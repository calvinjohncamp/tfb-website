import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.TFB_PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (url.origin !== 'http://tfb-overview-test.invalid' || !path.startsWith(root)) return route.abort();
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch (_) { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto('http://tfb-overview-test.invalid/#home');
  await page.waitForFunction(() => window.TFB?.ui);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.site.pages.home.blocks = TFB.siteSeed.pages.home.blocks.map(b => ({ ...b, image: 'assets/images/board/kai-eichmann.jpg' }));
    db.site.pages.aktuell.blocks = [
      { id: 'placement-news', type: 'heading', title: 'News' },
      { id: 'placement-post', type: 'post', title: 'Clubnachrichten', date: '2026-10-13', text: 'Unser gemeinsamer Clubabend', image: 'assets/images/board/kai-eichmann.jpg' },
      { id: 'placement-dates', type: 'heading', title: 'Save the Date' },
      { id: 'placement-event', type: 'event', title: 'Clubabend', date: '2026-11-20' },
    ];
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
  });
  await page.reload();
  for (const [label, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844], ['mobile-wide', 500, 900], ['narrow', 320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => { location.hash = '#home'; });
    await page.waitForSelector('.feature-first .content-overview-tools');
    const link = page.locator('.feature-first a[href="#home/alle"]');
    const buttonBox = await link.boundingBox();
    const bodyBox = await page.locator('.feature-first .feature-body').boundingBox();
    const numberBox = await page.locator('.feature-first .feature-number').boundingBox();
    assert.ok(buttonBox.x >= bodyBox.x && buttonBox.x + buttonBox.width <= bodyBox.x + bodyBox.width);
    assert.ok(buttonBox.x >= numberBox.x + numberBox.width || buttonBox.y + buttonBox.height <= numberBox.y || buttonBox.y >= numberBox.y + numberBox.height);
    if (width < 900) assert.ok(Math.abs(buttonBox.y + buttonBox.height - numberBox.y - numberBox.height) < 2);
    assert.equal(await page.locator('.site-page > .content-overview-tools').count(), 0);
    await page.screenshot({ path: `/tmp/tfb-overview-placement-home-${label}.png` });
    await page.evaluate(() => { location.hash = '#aktuell'; });
    await page.waitForSelector('.site-page a[href="#aktuell/alle"]:visible');
    const headerLink = page.locator('.page-head a[href="#aktuell/alle"]');
    const headBox = await headerLink.boundingBox();
    const introBox = await page.locator('.page-head > div:first-child > p').boundingBox();
    if (width >= 1024) {
      assert.ok(Math.abs(headBox.y + headBox.height - introBox.y - introBox.height) < 2);
      const news = await page.locator('.col-news .aktuell-column-head > .block-heading').boundingBox();
      const dates = await page.locator('.col-dates .aktuell-column-head > .block-heading').boundingBox();
      assert.ok(Math.abs(news.y - dates.y) < 2);
    } else {
      for (const tab of ['news', 'dates']) {
        await page.locator(`[data-action="aktuell-tab"][data-tab="${tab}"]`).click();
        const heading = await page.locator(`.col-${tab} .aktuell-column-head > .block-heading`).boundingBox();
        const button = await page.locator('.site-page a[href="#aktuell/alle"]:visible').boundingBox();
        assert.ok(Math.abs(button.y + button.height - heading.y - heading.height) < 2);
        assert.ok(button.x >= heading.x + heading.width);
        assert.equal(await page.locator('.site-page a[href="#aktuell/alle"]:visible').count(), 1);
        await page.screenshot({ path: `/tmp/tfb-overview-placement-aktuell-${tab}-${label}.png` });
      }
      await page.locator('[data-action="aktuell-tab"][data-tab="news"]').click();
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `/tmp/tfb-overview-placement-aktuell-${label}.png` });
  }
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.community.posts = [
      { id: 'overview-test-club', scope: 'club', authorId: 'm-demo', title: 'Clubnachricht', text: 'Unser Testbericht', images: [], createdAt: '2026-10-13T10:00:00Z' },
      { id: 'overview-test-team', scope: 'team:herren-40', authorId: 'm-demo', title: 'Teamnachricht', text: 'Unser Teambericht', images: [], createdAt: '2026-10-13T09:00:00Z' },
    ];
    for (const key of ['home', 'aktuell']) {
      db.site.pages[key].blocks = Array.from({ length: 20 }, (_, i) => ({
        id: `${key}-${i}`, type: 'post', title: `Bericht ${String(i + 1).padStart(2, '0')}`,
        date: '2026-10-13', text: `Unser Clubbericht Nummer ${i + 1}.`,
      }));
      db.site.pages[key].blocks.push(
        { id: key + '-gallery', type: 'gallery', title: 'Sommergalerie', images: ['assets/images/board/kai-eichmann.jpg'], text: 'Nicht sichtbar', showText: false },
        { id: key + '-collage', type: 'collage', title: 'Herbstcollage', images: ['assets/images/board/thomas-heine.jpg'], text: 'Ein schöner Clubabend' },
        { id: key + '-dates', type: 'heading', title: 'Save the Date' },
        { id: key + '-event', type: 'event', title: 'Unser Termin', date: '2026-10-20' });
    }
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
  });
  await page.reload();
  for (const key of ['home', 'aktuell']) {
    for (const [label, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(key => { location.hash = '#' + key; }, key);
      await page.waitForSelector(`a[href="#${key}/alle"]:visible`);
      if (key === 'aktuell') assert.equal(await page.locator('.col-dates a[href$="/alle"]:visible').count(), 0);
      await page.locator(`a[href="#${key}/alle"]:visible`).click();
      await page.waitForSelector('.content-overview[data-ready]');
      assert.equal(await page.locator('.mini:visible').count(), 22);
      assert.equal(await page.locator('.overview').getByText('Unser Termin').count(), 0);
      assert.equal(await page.locator('.overview').getByText('Nicht sichtbar').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `/tmp/tfb-overview-${key}-${label}.png` });
      await page.locator('[data-ov=q]').fill('Nummer 20');
      assert.equal(await page.locator('.mini:visible').count(), 1);
      await page.locator('.mini:visible').click();
      const target = page.locator(`[data-site-content="${key}-19"]`);
      await target.waitFor();
      await page.waitForFunction(id => document.activeElement?.dataset.siteContent === id, `${key}-19`);
      const bounds = await target.boundingBox();
      assert.ok(bounds.y >= 0 && bounds.y < 60, `Selected contribution is visible: ${bounds.y}`);
      if (key === 'aktuell') assert.equal(await page.locator('.news-dates.show-news').count(), 1);
      await page.goBack();
      await page.waitForSelector('.content-overview[data-ready]');
      await page.locator('[data-ov=photos]').check();
      assert.equal(await page.locator('.mini:visible').count(), 2);
      await page.locator('[data-ov=where]').selectOption('collage');
      assert.equal(await page.locator('.mini:visible').count(), 1);
      assert.match(await page.locator('.mini:visible').innerText(), /Herbstcollage/);
      await page.locator('[data-ov=q]').fill('Keine Treffer');
      assert.equal(await page.locator('.mini:visible').count(), 0);
      assert.equal(await page.locator('.ov-empty').isVisible(), true);
      await page.reload();
      await page.waitForSelector('.content-overview[data-ready]');
      assert.equal(await page.locator('.mini:visible').count(), 22);
    }
  }
  await page.evaluate(() => { location.hash = '#chat/alle'; });
  await page.waitForSelector('.overview[data-ready]');
  await page.locator('[data-ov=where]').selectOption('club');
  assert.ok(await page.locator('.mini:visible').count() > 0);
  assert.equal(await page.locator('.mini:visible:not([data-where="club"])').count(), 0);
  assert.deepEqual(errors, []);
  console.log('Home/Aktuell: 22 contributions, news-only, search/type/photo filters, direct jump, back/reload, desktop/mobile and Chat regression passed.');
} finally {
  await browser.close();
}
