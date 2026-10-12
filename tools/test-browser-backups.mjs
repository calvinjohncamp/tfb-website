import { readFileSync } from 'node:fs';

// Optional real-browser check, always in a fresh profile with synthetic data.
const { chromium } = await import(process.env.TFB_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage();
  await page.route('**/*', route => route.request().url() === 'http://tfb-backup-test.invalid/'
    ? route.fulfill({ body: '<!doctype html><title>Isolated backup test</title>', contentType: 'text/html' })
    : route.abort());
  await page.goto('http://tfb-backup-test.invalid/');
  for (const file of ['assets/js/config.js', 'assets/data/legal-pages.js', 'assets/data/site-seed.js', 'assets/js/demo-backend.js']) {
    await page.addScriptTag({ content: readFileSync(new URL('../' + file, import.meta.url), 'utf8') });
  }
  console.log(await page.evaluate(async () => {
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    const api = TFB.api;
    const ref = await api.putImage('data:image/png;base64,YWJj');
    const site = await api.site();
    site.pages.home.blocks.push({ id: 'isolated-test', type: 'feature', title: 'Test', image: ref });
    await api.saveSite(site);
    const backup = await api.exportAll();
    await api.importAll(backup);
    const restored = await api.exportAll();
    if (restored.images[ref] !== backup.images[ref]) throw new Error('Photo lost');
    const before = localStorage.getItem('tfb_kiosk_demo_v1');
    const bad = JSON.parse(JSON.stringify(backup));
    bad.images = {};
    let rejected = false;
    try { await api.importAll(bad); } catch (_) { rejected = true; }
    if (!rejected || localStorage.getItem('tfb_kiosk_demo_v1') !== before) throw new Error('Invalid backup changed state');
    return 'PASS: real IndexedDB photo export/restore and invalid-backup preservation (isolated Chrome)';
  }));
} finally { await browser.close(); }
