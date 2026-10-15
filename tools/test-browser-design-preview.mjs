import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:5180/');
  await page.waitForSelector('.topbar');
  const world = () => page.evaluate(() => document.body.dataset.designWorld);
  assert.equal(await world(), 'cool');
  assert.equal(await page.locator('.world-switch').count(), 0);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.site.homeLook = '6';
    db.site.pages.home.blocks = [{ id: 'preview-home', type: 'feature', title: '50 Jahre Tennisfreunde', kicker: 'Seit 1976', subtitle: 'Fotos unserer Jubiläumsparty', text: 'Seit einem halben Jahrhundert wird in Bielstein Tennis gespielt.', image: 'assets/images/board/kai-eichmann.jpg' }];
    db.community.posts = [{ id: 'preview-chat', scope: 'club', authorId: 'm4', title: 'Grüße aus Andalusien', text: 'Wir grüßen alle Tennisfreunde.', images: [], createdAt: new Date().toISOString() }];
    db.accounts.push({ memberId: 'm-demo', consentVersion: TFB.config.consentVersion, consentedAt: new Date().toISOString() });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    localStorage.setItem('tfb_editorial_preview_v1', 'colors');
  });
  await page.reload();
  await page.waitForSelector('.feature-body h2');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await world(), 'cool');
  assert.equal(await page.locator('.world-switch').count(), 0);
  assert.equal(await page.locator('.feature-number').first().evaluate(el => getComputedStyle(el).webkitTextStrokeWidth), '1.25px');
  await page.locator('.tfb-logo-ball').click();
  await page.waitForSelector('.world-switch');
  assert.equal(await page.locator('.world-switch button').count(), 2);
  assert.equal(await page.locator('button[data-design-world="cool"]').getAttribute('aria-pressed'), 'true');
  const before = await page.evaluate(() => localStorage.getItem('tfb_kiosk_demo_v1'));
  const homeText = await page.locator('#view').textContent();
  await page.locator('button[data-design-world="warm"]').click();
  assert.equal(await world(), 'warm');
  assert.match(await page.locator('.feature-body h2').first().evaluate(el => getComputedStyle(el).fontFamily), /Avenir/);
  assert.equal(await page.locator('#view').textContent(), homeText);
  assert.equal(await page.evaluate(() => localStorage.getItem('tfb_kiosk_demo_v1')), before);
  await page.reload();
  await page.waitForSelector('.feature-body h2');
  assert.equal(await world(), 'warm');
  await page.locator('.tfb-logo-ball').click();
  await page.waitForSelector('.world-switch');
  await page.locator('[data-design-preview]').click();
  assert.equal(await world(), 'cool');
  assert.equal(await page.locator('button[data-design-world="cool"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-design-preview]').click();
  assert.equal(await world(), 'warm');
  await page.locator('button[data-design-world="cool"]').click();
  assert.equal(await page.evaluate(() => localStorage.getItem('tfb_design_world_v2')), null);
  for (const width of [1440, 1024, 834, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForFunction(() => [...document.querySelectorAll('.feature-title-word')].every(el => el.getBoundingClientRect().width <= el.closest('h2').clientWidth + 1));
    const switcher = await page.locator('.world-switch').boundingBox();
    const pencil = await page.locator('.home-tools .view-close').boundingBox();
    assert.ok(switcher.x < pencil.x);
    assert.ok(Math.abs(switcher.y + switcher.height / 2 - pencil.y - pencil.height / 2) < 1, JSON.stringify({ width, switcher, pencil }));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `/tmp/tfb-world-admin-${width}.png` });
  }
  await page.locator('.tfb-logo-ball').click();
  await page.waitForFunction(() => !document.querySelector('.world-switch'));
  for (const width of [1440, 834, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['home', 'chat', 'kiosk', 'strichliste', 'abrechnungen', 'aktuell', 'sport', 'sport/training', 'club', 'treffen', 'team/herren-40-1', 'impressum', 'satzung']) {
      await page.evaluate(route => { location.hash = '#' + route; }, route);
      await page.waitForFunction(route => document.querySelector('#view')?.dataset.view === route.split('/')[0] && !document.querySelector('#view > .loading'), route);
      assert.equal(await world(), 'cool');
      assert.equal(await page.locator('.world-switch').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${width}px`);
      const hash = await page.evaluate(() => location.hash);
      await page.locator('[data-design-preview]').click();
      assert.equal(await world(), 'warm');
      assert.equal(await page.evaluate(() => location.hash), hash);
      await page.locator('[data-design-preview]').click();
      assert.equal(await world(), 'cool');
    }
  }
  await page.locator('[data-action="profile"]').click();
  await page.waitForSelector('.acct');
  assert.equal(await page.locator('.sheet').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(247, 247, 247)');
  await page.locator('.sheet-close').click();
  const local = await browser.newPage();
  await local.goto(new URL('../index.html', import.meta.url).href);
  await local.waitForSelector('.topbar');
  assert.equal(await local.evaluate(() => document.body.dataset.designWorld), 'cool');
  await local.evaluate(() => Promise.all([document.fonts.load('700 30px "TFB Bricolage"'), document.fonts.load('400 16px "TFB DM Sans"')]));
  await local.locator('[data-design-preview]').focus();
  await local.keyboard.press('Enter');
  assert.equal(await local.evaluate(() => document.body.dataset.designWorld), 'warm');
  await local.close();
  assert.deepEqual(errors, []);
  console.log('Kühl standardmäßig, zwei Welten, Zwischenvariante ignoriert, Home-Admin-Auswahl/Stift-Ausrichtung, Member/Guest ausgeblendet, Logo/Reload/Datei/Account, unveränderte Daten und alle Routen geprüft.');
} finally { await browser.close(); }
