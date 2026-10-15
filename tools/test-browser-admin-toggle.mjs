import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://joern-kaemper.de';
const browser = await chromium.launch({ headless: true });
let isAdmin = true;
try {
  const page = await browser.newPage({ serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('tfb_directory_token_v1', 'a'.repeat(64)));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'tfb-api.calvinjohncamp.workers.dev') return route.fulfill({ json: { member: {
      id: 'toggle-test-member', firstName: 'Test', lastName: 'Mitglied', email: 'test@example.invalid', active: true, isAdmin, teams: [],
    } } });
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await page.waitForFunction(() => TFB.ui?.state.member?.adminHidden);
  assert.equal(await page.evaluate(() => TFB.api.secureDirectory), true);
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  const ball = page.locator('.topbar .tfb-logo-ball');
  await ball.click();
  await page.locator('[data-action="site-edit"]').first().waitFor();
  await ball.click();
  await page.waitForFunction(() => TFB.ui.state.member.adminHidden === true);
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  const role = await page.evaluate(async () => {
    const verified = await TFB.api.session();
    TFB.ui.state.member = verified;
    await TFB.ui.renderView();
    return verified.isAdmin;
  });
  assert.equal(role, true, 'Hiding controls never changes the verified role');
  assert.equal(await page.locator('[data-action="site-edit"]').count(), 0);
  await page.evaluate(async () => {
    TFB.ui.state.member = await TFB.api.acceptConsent();
    location.hash = '#kiosk';
  });
  await page.locator('.kiosk-link').first().waitFor();
  assert.equal(await page.locator('[data-action="edit-start"]').count(), 0);
  await ball.click();
  await page.locator('[data-action="edit-start"]').first().waitFor();
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.adminHidden);
  assert.equal(await page.locator('[data-action="edit-start"]').count(), 0);
  // An ordinary verified member cannot enable admin tools with the ball.
  isAdmin = false;
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member && !TFB.ui.state.member.isAdmin && !TFB.ui.state.member.adminHidden);
  await ball.click();
  assert.equal(await page.locator('[data-action="site-edit"], [data-action="edit-start"]').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS: secure-login admin ball toggles Home/Kiosk tools, stays hidden after session refresh/reload, retains role and never elevates ordinary members.');
} finally { await browser.close(); }
