import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
async function openFocusForTest(page) {
  await page.locator('.header-focus').click();
}
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5180/#home');
  await page.waitForSelector('.topbar');
  await page.waitForFunction(() => localStorage.getItem('tfb_kiosk_demo_v1'));
  await page.waitForSelector('.header-focus');
  assert.equal(await page.locator('.header-focus').isVisible(), true);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts.push({ memberId: 'm-demo' });
    // Previously saved strip settings must not bring the withdrawn UI back.
    db.site.focusStrip = { enabled: true, after: 2, height: 300 };
    db.site.homeLook = '6';
    db.site.pages.home.blocks = [1, 2, 3].map(value => ({
      id: 'focus-test-' + value, type: 'feature', title: '50 Jahre Tennisfreunde',
      text: 'Unser Verein.', image: 'assets/images/board/kai-eichmann.jpg',
    }));
    db.site.pages.home.blocks.push({ id: 'focus-gallery-test', type: 'gallery', title: 'Fotos im Fokus', images: ['assets/images/board/kai-eichmann.jpg', 'assets/images/board/thomas-heine.jpg'] });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
  });
  await page.reload();
  await page.waitForSelector('.topbar');
  for (const [width, height] of [[1440, 1000], [1280, 1000], [1100, 1000], [1024, 1000], [960, 1000], [900, 1000], [834, 1100], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.waitForFunction(() => Math.abs(parseFloat(getComputedStyle(document.querySelector('.header-focus')).fontSize) - parseFloat(getComputedStyle(document.querySelector('.topnav .tab')).fontSize) * .9) < .01);
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.feature-title-word')).every(word => word.getBoundingClientRect().width <= word.closest('h2').clientWidth + 1));
    assert.equal(await page.locator('.focus-strip').count(), 0);
    assert.equal(await page.locator('[data-action="focus-install"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const focus = await page.locator('.header-focus').boundingBox();
    const bell = await page.locator('.inbox-btn').boundingBox();
    assert.ok(Math.abs(focus.width - 21.6) < .1);
    assert.equal(bell.width, 27);
    assert.ok(focus.x + focus.width < bell.x);
    assert.ok(Math.abs(focus.y + focus.height - bell.y - bell.height) < 1, JSON.stringify({ width, focus, bell }));
    assert.equal(await page.locator('.header-focus').evaluate(el => getComputedStyle(el).fontWeight), '600');
    await page.screenshot({ path: '/tmp/tfb-home-without-strip-' + width + '.png' });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('[data-action="profile"]').click();
  await page.waitForSelector('.acct-logout');
  assert.equal(await page.locator('.signature-install').count(), 0);
  assert.equal(await page.locator('#sheet-root [data-action="focus-open"]').count(), 0);
  await page.locator('.sheet-close').click();
  await openFocusForTest(page);
  await page.waitForSelector('.tfb-focus-overlay');
  await page.waitForFunction(() => Boolean(document.fullscreenElement));
  const presentation = page.frames().find(frame => frame.url().includes('praesentation.html'));
  assert.ok(presentation);
  await presentation.waitForSelector('#viewport');
  for (const [mode, width] of [['phone', 390], ['tablet', 834], ['desktop', 1440]]) {
    await presentation.locator('[data-mode="' + mode + '"]').evaluate(button => button.click());
    const rect = await presentation.locator('#viewport').boundingBox();
    assert.equal(Math.round(rect.width), width);
    assert.ok(Math.abs(rect.x + rect.width / 2 - 720) <= 1);
  }
  const child = page.frames().find(frame => frame.url().includes('tfbPresentation=1'));
  assert.ok(child);
  await child.waitForSelector('.topbar');
  await child.waitForLoadState('load');
  assert.equal(await child.evaluate(() => document.body.dataset.designWorld), 'cool');
  await child.locator('[data-design-preview]').click();
  await page.waitForFunction(() => document.body.dataset.designWorld === 'warm');
  assert.equal(await child.evaluate(() => document.body.dataset.designWorld), 'warm');
  await child.locator('[data-design-preview]').click();
  await page.waitForFunction(() => document.body.dataset.designWorld === 'cool');
  for (const mode of ['phone', 'tablet', 'desktop']) {
    await presentation.locator(`[data-mode="${mode}"]`).evaluate(button => button.click());
    await child.locator('.gallery-item[data-block="focus-gallery-test"]').first().click();
    await child.waitForSelector('.viewer.gallery.open');
    await child.waitForFunction(() => Number(getComputedStyle(document.querySelector('.viewer.gallery')).opacity) > .99);
    assert.equal(await child.evaluate(() => document.querySelector('.viewer-stage').scrollWidth > document.querySelector('.viewer-stage').clientWidth), false);
    assert.equal(await child.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth), 'none');
    await child.locator('[data-gstep="1"]').click();
    assert.match(await child.locator('.viewer-bar').textContent(), /2 \/ 2/);
    await page.screenshot({ path: `/tmp/tfb-focus-photo-${mode}.png` });
    await child.locator('.viewer-close').click();
    await child.waitForSelector('.viewer.gallery', { state: 'detached' });
  }
  assert.equal(await child.locator('.focus-strip').count(), 0);
  await child.evaluate(async () => {
    const site = await TFB.api.site();
    site.focusStrip.height = 280;
    await TFB.api.saveSite(site);
  });
  await page.evaluate(() => {
    window.focusRouteReceived = false;
    window.addEventListener('message', event => {
      if (event.data?.type === 'tfb-focus-route' && event.data.hash === '#club') window.focusRouteReceived = true;
    });
  });
  await child.locator('.topnav a[href="#club"]').click();
  await child.waitForURL(url => url.hash === '#club');
  await page.waitForFunction(() => window.focusRouteReceived);
  await presentation.locator('#close').evaluate(button => button.click());
  await page.waitForFunction(() => !document.querySelector('.tfb-focus-overlay'));
  await page.waitForFunction(() => location.hash === '#club');
  assert.equal(await page.evaluate(() => location.hash), '#club');
  assert.equal(await page.evaluate(() => document.fullscreenElement), null);
  assert.equal(await page.evaluate(async () => (await TFB.api.site()).focusStrip.height), 280);
  await page.evaluate(() => { location.hash = '#home'; });
  await page.waitForSelector('.topbar');
  assert.equal(await page.locator('.focus-strip').count(), 0);
  await openFocusForTest(page);
  await page.waitForFunction(() => Boolean(document.fullscreenElement));
  await page.evaluate(() => document.exitFullscreen());
  await page.waitForFunction(() => !document.querySelector('.tfb-focus-overlay'));
  assert.equal(await page.evaluate(() => document.body.classList.contains('tfb-focus-active')), false);
  for (const [device, width, height] of [['iPhone', 390, 844], ['iPhone', 844, 390], ['iPad', 834, 1194], ['iPad', 1194, 834]]) {
    const context = await browser.newContext({ hasTouch: true, viewport: { width, height },
      userAgent: device === 'iPhone' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15' });
    if (device === 'iPad') await context.addInitScript(() => {
      Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });
    });
    const mobile = await context.newPage();
    await mobile.goto('http://127.0.0.1:5180/#home');
    await mobile.waitForSelector('.topbar');
    assert.equal(await mobile.locator('.header-focus').count(), 0);
    await mobile.waitForFunction(() => localStorage.getItem('tfb_kiosk_demo_v1'));
    await mobile.evaluate(() => {
      const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
      db.site.homeLook = '6';
      db.site.pages.home.blocks = [{ id: 'title-test', type: 'feature', title: '50 Jahre Tennisfreunde', text: 'Unser Verein.', image: 'assets/images/board/kai-eichmann.jpg' }];
      localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    });
    await mobile.reload();
    await mobile.waitForSelector('.feature-title-word');
    await mobile.waitForFunction(() => Array.from(document.querySelectorAll('.feature-title-word')).every(word => word.getBoundingClientRect().width <= word.closest('h2').clientWidth + 1));
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const word = mobile.locator('.feature-title-word').filter({ hasText: 'Tennisfreunde' });
    assert.equal(await word.evaluate(el => getComputedStyle(el).whiteSpace), 'nowrap');
    await mobile.screenshot({ path: `/tmp/tfb-title-${device}-${width}.png` });
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log('Desktop-F im Kopf; iPhone/iPad ohne F; Fokus, Gerätebreiten, Zentrierung und Rückkehr geprüft.');
} finally {
  await browser.close();
}
