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
    if (url.origin !== 'http://tfb-gallery-test.invalid' || !path.startsWith(root)) return route.abort();
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch (_) { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.addInitScript(() => localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo'));
  await page.goto('http://tfb-gallery-test.invalid/#home');
  await page.waitForFunction(() => window.TFB?.ui);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts = [{ memberId: 'm-demo', consentVersion: TFB.config.consentVersion }];
    const refs = ['kai-eichmann', 'thomas-heine', 'katja-kuepper', 'katharina-pollmann', 'daniel-pollmann'].map(name => `assets/images/board/${name}.jpg`);
    // Keep public editorial copy, but use only synthetic photo modules here.
    for (const key of ['home', 'aktuell']) db.site.pages[key].blocks = db.site.pages[key].blocks.filter(b => !['gallery', 'collage'].includes(b.type));
    for (const key of ['home', 'aktuell']) for (const type of ['gallery', 'collage']) db.site.pages[key].blocks.push({
      id: type + '-' + key, type, title: 'Clubabend in Bildern', date: '2026-10-13',
      images: refs, text: 'Unser gemeinsamer Clubabend.\n\nEin zweiter Absatz bei den Fotos.', showText: true,
      textPosition: type === 'collage' ? 'above' : 'below',
    });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
  });
  await page.reload();
  for (const key of ['home', 'aktuell']) {
    await page.evaluate(key => { location.hash = '#' + key; }, key);
    await page.waitForSelector(`.gallery-item[data-block="gallery-${key}"]`);
    for (const [label, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844]]) {
      await page.setViewportSize({ width, height });
      const module = page.locator(`.block-gallery:has([data-block="gallery-${key}"])`);
      await module.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/tmp/tfb-gallery-${key}-${label}.png` });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await module.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)), true);
      await page.locator(`.gallery-item[data-block="gallery-${key}"][data-index="2"]`).click();
      await page.waitForSelector('.viewer.gallery.open');
      await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.viewer.gallery.open')).opacity) >= .99);
      assert.match(await page.locator('.viewer-bar').innerText(), /3 \/ 5/);
      await page.screenshot({ path: `/tmp/tfb-gallery-viewer-${key}-${label}.png` });
      await page.locator('.gal-single').click();
      assert.match(await page.locator('.viewer-bar').innerText(), /4 \/ 5/);
      await page.locator('[data-gstep="-1"]').click();
      await page.keyboard.press('ArrowLeft');
      assert.match(await page.locator('.viewer-bar').innerText(), /2 \/ 5/);
      await page.locator('[data-gback]').click();
      await page.locator('[data-gi="4"]').click();
      assert.match(await page.locator('.viewer-bar').innerText(), /5 \/ 5/);
      await page.locator('.gal-single').click();
      assert.match(await page.locator('.viewer-bar').innerText(), /1 \/ 5/);
      await page.keyboard.press('Escape');
      await page.waitForSelector('.viewer.gallery', { state: 'detached' });
      const collage = page.locator('.block-collage');
      await collage.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/tmp/tfb-collage-${key}-${label}.png` });
      const textBox = await collage.locator('.gallery-text').boundingBox();
      const mediaBox = await collage.locator('.gallery-media').boundingBox();
      assert.ok(textBox.y + textBox.height <= mediaBox.y);
      await collage.locator('[data-index="4"]').click();
      await page.waitForSelector('.viewer.gallery.open');
      assert.match(await page.locator('.viewer-bar').innerText(), /5 \/ 5/);
      await page.keyboard.press('Escape');
      await page.waitForSelector('.viewer.gallery', { state: 'detached' });
    }
  }
  await page.evaluate(() => { location.hash = '#home'; });
  await page.waitForSelector('.gallery-item[data-block="gallery-home"]');
  await page.locator('.topbar .tfb-logo-ball').click();
  for (const route of ['home', 'aktuell', 'club', 'sport', 'chat', 'kiosk']) {
    await page.evaluate(route => { location.hash = '#' + route; }, route);
    await page.waitForSelector('.page-bottom-tools .view-close');
    assert.equal(await page.locator('.page-bottom-tools .view-close').count(), 1);
  }
  await page.evaluate(() => { location.hash = '#home'; });
  await page.waitForSelector('.page-bottom-tools [data-action="site-edit"]');
  await page.locator('.page-bottom-tools [data-action="site-edit"]').scrollIntoViewIfNeeded();
  const bottomY = await page.evaluate(() => scrollY);
  await page.locator('.page-bottom-tools [data-action="site-edit"]').click();
  await page.waitForSelector('.editing-page');
  assert.ok(await page.evaluate(() => scrollY) >= bottomY - 5);
  await page.locator('[data-action="block-edit"][data-id="gallery-home"]').click();
  await page.locator('.gallery-thumb[data-index="0"] .thumb-grip').scrollIntoViewIfNeeded();
  const source = await page.locator('.gallery-thumb[data-index="0"]').boundingBox();
  const target = await page.locator('.gallery-thumb[data-index="3"]').boundingBox();
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  await page.waitForSelector('.gallery-thumb.dragging');
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 8 });
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="3"] img').getAttribute('src').includes('kai-eichmann'));
  assert.ok(await page.locator('[data-photo-module="gallery-home"] [data-index="3"] img').getAttribute('src').then(src => src.includes('kai-eichmann')));
  assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'gallery-home').images[0].endsWith('kai-eichmann.jpg')));
  await page.screenshot({ path: '/tmp/tfb-gallery-live-drag.png' });
  await page.mouse.up();
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="3"] img').getAttribute('src').includes('kai-eichmann'));
  await page.locator('[data-editor="block"] [name="date"]').fill('2026-10-14');
  await page.locator('[data-editor="block"] [name="showText"]').uncheck();
  await page.locator('[data-editor="block"] [name="textPosition"]').selectOption('above');
  await page.locator('[data-editor="block"] button[type="submit"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'gallery-home').showText === false);
  await page.reload();
  await page.waitForSelector('.gallery-item[data-block="gallery-home"]');
  assert.equal(await page.locator('.block-gallery:not(.block-collage) .gallery-text').count(), 0);
  assert.equal(await page.locator('.block-gallery:not(.block-collage) time').getAttribute('datetime'), '2026-10-14');
  await page.locator('.topbar .tfb-logo-ball').click();
  await page.locator('[data-action="site-edit"][data-page="home"]').first().click();
  await page.locator('[data-action="block-add"][data-type="gallery"]').click();
  await page.locator('[data-editor="block"] [name="title"]').fill('Neue Galerie');
  await page.locator('[data-editor="block"] button[type="submit"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.some(b => b.type === 'gallery' && b.title === 'Neue Galerie'));
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'gallery-home'));
  assert.match(saved.text, /gemeinsamer Clubabend/);
  assert.equal(saved.images.length, 5);
  assert.ok(saved.images[3].endsWith('kai-eichmann.jpg'));
  assert.equal(saved.textPosition, 'above');
  await page.locator('[data-action="block-add"][data-type="collage"]').click();
  await page.locator('[data-editor="block"] [name="title"]').fill('Neue Collage');
  await page.locator('[data-editor="block"] button[type="submit"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.some(b => b.type === 'collage' && b.title === 'Neue Collage'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-action="block-edit"][data-id="collage-home"]').click();
  await page.locator('.gallery-thumb[data-index="0"] .thumb-grip').scrollIntoViewIfNeeded();
  const touchSource = await page.locator('.gallery-thumb[data-index="0"]').boundingBox();
  const touchTarget = await page.locator('.gallery-thumb[data-index="3"]').boundingBox();
  await page.screenshot({ path: '/tmp/tfb-collage-editor-mobile.png' });
  const cdp = await page.context().newCDPSession(page);
  const startPoint = { x: touchSource.x + touchSource.width / 2, y: touchSource.y + touchSource.height / 2 };
  const endPoint = { x: touchTarget.x + touchTarget.width / 2, y: touchTarget.y + touchTarget.height / 2 };
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [startPoint] });
  await page.waitForSelector('.gallery-thumb.dragging');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [endPoint] });
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="3"] img').getAttribute('src').includes('kai-eichmann'));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="0"] img').getAttribute('src').includes('kai-eichmann'));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchSource.x + touchSource.width / 2, y: touchSource.y + touchSource.height / 2 }] });
  await page.waitForSelector('.gallery-thumb.dragging');
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchTarget.x + touchTarget.width / 2, y: touchTarget.y + touchTarget.height / 2 }] });
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="3"] img').getAttribute('src').includes('kai-eichmann'), null, {timeout:3000});
  assert.ok(await page.locator('[data-photo-module="collage-home"] [data-index="3"] img').getAttribute('src').then(src => src.includes('kai-eichmann')));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(() => document.querySelector('.gallery-thumb[data-index="3"] img').getAttribute('src').includes('kai-eichmann'), null, {timeout:3000});
  await page.locator('[data-editor="block"] [name="textPosition"]').selectOption('below');
  await page.locator('[data-editor="block"] button[type="submit"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'collage-home').images[3].endsWith('kai-eichmann.jpg'));
  const previousIndex = await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.findIndex(b => b.id === 'collage-home'));
  await page.locator('[data-action="block-move"][data-id="collage-home"][data-dir="-1"]').click();
  await page.waitForFunction(previousIndex => {
    const blocks = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks;
    return blocks.findIndex(b => b.id === 'collage-home') === previousIndex - 1;
  }, previousIndex);
  const savedOrder = await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'collage-home').images);
  await page.locator('[data-action="block-edit"][data-id="collage-home"]').click();
  await page.locator('.gallery-thumb[data-index="0"]').scrollIntoViewIfNeeded();
  const cancelSource = await page.locator('.gallery-thumb[data-index="0"]').boundingBox();
  const cancelTarget = await page.locator('.gallery-thumb[data-index="2"]').boundingBox();
  await page.mouse.move(cancelSource.x + cancelSource.width / 2, cancelSource.y + cancelSource.height / 2);
  await page.mouse.down();
  await page.mouse.move(cancelTarget.x + cancelTarget.width / 2, cancelTarget.y + cancelTarget.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.locator('.sheet-close').click();
  await page.waitForFunction(savedOrder => {
    const refs = [...document.querySelectorAll('[data-photo-module="collage-home"] [data-action="gallery-open"] img')].map(img => img.getAttribute('src'));
    return JSON.stringify(refs) === JSON.stringify(savedOrder);
  }, savedOrder);
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).site.pages.home.blocks.find(b => b.id === 'collage-home').images), savedOrder);
  assert.deepEqual(errors, []);
  console.log('Home/Aktuell galleries and collages: live mouse/touch sorting before release, page preview, bottom edit buttons, text position, module order and reload passed.');
} finally { await browser.close(); }
