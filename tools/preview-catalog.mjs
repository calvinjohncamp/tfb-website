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
  page.on('pageerror', err => errors.push(err.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (url.origin !== 'http://tfb-catalog-test.invalid' || !path.startsWith(root)) return route.abort();
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch (_) { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.addInitScript(() => localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo'));
  await page.goto('http://tfb-catalog-test.invalid/#kiosk');
  await page.waitForFunction(() => window.TFB?.ui);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    if (!db.accounts.some(a => a.memberId === 'm-demo')) db.accounts.push({ memberId: 'm-demo', consentVersion: TFB.config.consentVersion });
    db.accounts.find(a => a.memberId === 'm-demo').consentVersion = TFB.config.consentVersion;
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
  });
  await page.reload();
  await page.waitForFunction(() => window.TFB?.ui?.state.member);
  await page.evaluate(() => { location.hash = '#kiosk'; });
  try { await page.waitForSelector('.menu .tiles', { timeout: 10000 }); }
  catch (err) { console.log(await page.locator('body').innerText(), errors); throw err; }
  for (const [label, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `/tmp/tfb-catalog-${label}.png` });
    await page.locator('.menu').nth(2).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/tfb-catalog-${label}-aperitif.png` });
    await page.locator('.menu').nth(3).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/tfb-catalog-${label}-specialties.png` });
    await page.locator('.menu').nth(4).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/tfb-catalog-${label}-spielbetrieb.png` });
    await page.locator('.tile[data-id="cornetto"]').screenshot({ path: `/tmp/tfb-catalog-${label}-cornetto.png` });
    const result = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('.menu h2')].map(el => el.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth,
      blankSymbols: [...document.querySelectorAll('.tile-art')].filter(el => !el.querySelector('svg') || el.clientWidth === 0).length,
    }));
    if (result.overflow || result.blankSymbols || result.headings.length !== 7) throw new Error(JSON.stringify(result));
    console.log(label, JSON.stringify(result));
  }
  await page.evaluate(async () => {
    for (const id of ['gerolsteiner', 'koelsch-kranz', 'bockwurst', 'flutlicht', 'gastspieler']) await TFB.api.addToTab(id);
    location.hash = '#strichliste';
  });
  await page.waitForSelector('.tally-row');
  for (const [label, width, height] of [['desktop', 1280, 900], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.screenshot({ path: `/tmp/tfb-tally-${label}.png` });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Tally overflow');
  }
  if (errors.length) throw new Error(errors.join('\n'));
} finally { await browser.close(); }
