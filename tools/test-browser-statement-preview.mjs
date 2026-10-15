import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://tfb-statements-test.invalid';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await page.waitForFunction(() => window.TFB?.ui);
  const result = await page.evaluate(async () => {
    const api = TFB.api;
    TFB.ui.state.member = api.attachDirectoryMember({ id: 'preview-admin', firstName: 'Test', lastName: 'Verwaltung', email: 'statements@example.invalid', active: true, isAdmin: true });
    TFB.ui.state.member = await api.acceptConsent();
    await api.addToTab('koelsch');
    const before = localStorage.getItem('tfb_kiosk_demo_v1');
    const current = await api.myOpenMonth();
    const closed = await api.myStatements();
    const repeated = await api.myStatements();
    const after = localStorage.getItem('tfb_kiosk_demo_v1');
    location.hash = '#abrechnungen';
    return { before, after, current, closed, repeated };
  });
  assert.equal(result.before, result.after, 'Preview does not write statements into browser data');
  assert.equal(result.current.totalCents, 180, 'Current purchases keep their actual total');
  assert.equal(result.current.items.length, 1);
  assert.deepEqual(result.closed, result.repeated, 'Repeated visits do not duplicate examples');
  assert.deepEqual(result.closed.map(s => s.totalCents), [3480, 2350]);
  assert.ok(result.closed.every(s => s.memberId === 'preview-admin' && s.demo && s.status === 'collected'));
  const expectedMonths = await page.evaluate(() => [1, 2].map(back => TFB.time.previousMonthKey(TFB.time.monthKey(new Date()), back)));
  assert.deepEqual(result.closed.map(s => s.month), expectedMonths);
  await page.locator('.statement').first().waitFor();
  assert.equal(await page.locator('.statement').count(), 2);
  assert.equal(await page.locator('.statement .pill.ok').count(), 2);
  assert.equal(await page.getByText('Beispiel · fiktiver Betrag', { exact: true }).count(), 2);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: `/tmp/tfb-statement-preview-${width}.png`, fullPage: true });
  }
  // Existing monthly statements win over the matching fictional preview.
  await page.evaluate(month => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.statements.push({ id: 'existing-statement', memberId: 'preview-admin', month, totalCents: 990, itemCount: 6, status: 'collected' });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
  }, expectedMonths[0]);
  await page.reload();
  await page.locator('.statement').first().waitFor();
  const existing = await page.evaluate(() => TFB.api.myStatements());
  assert.equal(existing.length, 2);
  assert.equal(existing[0].id, 'existing-statement');
  assert.equal(existing[0].totalCents, 990);
  assert.equal(existing[0].demo, undefined);
  const other = await page.evaluate(async () => {
    TFB.api.attachDirectoryMember({ id: 'preview-member', firstName: 'Test', lastName: 'Mitglied', email: 'member@example.invalid', active: true, isAdmin: false });
    return TFB.api.myStatements();
  });
  assert.deepEqual(other, [], 'Other members see neither admin statements nor preview examples');
  assert.deepEqual(errors, []);
  console.log('PASS: two completed demo months, current total unchanged, no stored examples, no duplicates, existing statements preserved, private by member, desktop/mobile fit.');
} finally { await browser.close(); }
