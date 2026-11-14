import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { fixture } from './app-sync-fixture.mjs';
import { publishBrowserSite } from './browser-site-fixture.mjs';
import worker from './worker-test-loader.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://joern-kaemper.de';
const f = await fixture();
await publishBrowserSite(f);
const commit = async changes => {
  const response = await f.call('/admin/site/commit', { id: crypto.randomUUID(), changes }, f.adminToken);
  assert.equal(response.status, 200, JSON.stringify(response.body));
};
const publicDocs = async () => (await f.call('/public/site')).body.documents;
await commit([{ key: 'global:nav', expected: 0, value: [
  { id: 'kiosk', label: 'Kiosk', target: '#kiosk' },
  { id: 'chat', label: 'Chat', target: '#chat' },
  { id: 'aktuell', label: 'Aktuell', target: '#aktuell' },
  { id: 'treffen', label: 'Verabreden', target: '#treffen' },
] }]);

const browser = await chromium.launch();
const errors = [];
async function open(admin = false) {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  if (admin) await context.addInitScript(token => sessionStorage.setItem('tfb_directory_token_v1', token), f.adminToken);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(10000);
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname === 'tfb-api.calvinjohncamp.workers.dev') {
      const response = await worker.fetch(new Request('https://tfb-api.test' + url.pathname + url.search, {
        method: request.method(),
        headers: { ...request.headers(), origin, 'cf-connecting-ip': '192.0.2.6' },
        ...(request.postData() ? { body: request.postData() } : {}),
      }), f.env);
      const body = Buffer.from(await response.arrayBuffer());
      return route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body });
    }
    if (url.origin !== origin) return route.abort();
    const file = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.mjs': 'text/javascript' };
    try { return await route.fulfill({ body: readFileSync(file), contentType: types[extname(file)] || undefined }); }
    catch { return route.fulfill({ status: 404 }); }
  });
  await page.goto(origin + '/?tfbPresentation=1#home');
  await page.locator('.site-page[data-page=home]').waitFor();
  return page;
}

try {
  let page = await open(true);
  let form = page.locator('[data-editor=nav]');
  const headerLink = (p, target) => p.locator('.topnav').locator('a[href="' + target + '"]');
  const row = target => form.locator('.nav-row').filter({
    has: page.locator('option:checked[value="' + target + '"]'),
  });
  const edit = async () => {
    if (!await page.locator('[data-action=nav-edit]').count()) {
      await page.locator('[data-action=admin-toggle]').click();
    }
    await page.locator('[data-action=nav-edit]').click();
    await form.waitFor();
  };
  const save = () => form.locator('[type=submit]').click();
  const answer = (accept, message) => page.once('dialog', async dialog => {
    assert.match(dialog.message(), message);
    await (accept ? dialog.accept() : dialog.dismiss());
  });

  await edit();
  assert.equal(await headerLink(page, '#treffen').textContent(), 'Dating 2.0');
  assert.equal(await row('#treffen').locator('input[name^=label_]').inputValue(), 'Dating 2.0');
  await row('#treffen').locator('input[name^=label_]').fill('Verabreden');
  await row('#kiosk').locator('input[name^=show_]').uncheck();
  await save();
  await form.waitFor({ state: 'detached' });
  assert.equal(await headerLink(page, '#treffen').textContent(), 'Verabreden');
  assert.equal(await headerLink(page, '#kiosk').count(), 0);
  const guest = await open();
  assert.equal(await headerLink(guest, '#treffen').textContent(), 'Verabreden');
  assert.equal(await headerLink(guest, '#kiosk').count(), 0);
  await page.context().close();
  page = await open(true);
  form = page.locator('[data-editor=nav]');
  await edit();
  assert.equal(await row('#treffen').locator('input[name^=label_]').inputValue(), 'Verabreden');

  const original = await publicDocs();
  const removePage = () => row('#aktuell').getByRole('button', { name: 'Mit Seiteninhalten löschen' }).click();
  answer(false, /Aktuell.*allen redaktionellen Seiteninhalten/);
  await removePage();
  assert.equal(await row('#aktuell').count(), 1);
  answer(true, /Aktuell.*allen redaktionellen Seiteninhalten/);
  await removePage();
  answer(false, /Jetzt speichern.*Einträge löschen/);
  await save();
  assert.deepEqual(await publicDocs(), original);

  // Another editor's changes to the target page invalidate the pending deletion.
  const newer = structuredClone(original['page:aktuell'].value);
  newer.title = 'Aktuell mit Änderung';
  await commit([{ key: 'page:aktuell', expected: original['page:aktuell'].revision, value: newer }]);
  answer(true, /Jetzt speichern.*Einträge löschen/);
  await save();
  await form.getByRole('alert').getByText(/inzwischen geändert/).waitFor();
  assert.deepEqual((await publicDocs())['page:aktuell'].value, newer);
  await page.locator('.sheet-close').click();
  await edit();
  answer(true, /Aktuell mit Änderung.*allen redaktionellen Seiteninhalten/);
  await removePage();
  answer(true, /Menüpunkt „Chat“/);
  await row('#chat').getByRole('button', { name: 'Menüpunkt löschen' }).click();
  answer(true, /Jetzt speichern.*Einträge löschen/);
  await save();
  await form.waitFor({ state: 'detached' });

  const saved = await publicDocs();
  assert.deepEqual(saved['page:aktuell'].value, { title: newer.title, blocks: [], deleted: true });
  assert.deepEqual(saved['page:home'], original['page:home']);
  assert.deepEqual(saved['global:nav'].value.map(x => x.id), ['kiosk', 'treffen']);
  await guest.reload();
  await guest.locator('.site-page[data-page=home]').waitFor();
  assert.equal(await headerLink(guest, '#chat').count(), 0);
  assert.equal(await headerLink(guest, '#aktuell').count(), 0);
  await guest.evaluate(() => { location.hash = '#aktuell/alle'; });
  await guest.getByRole('heading', { name: 'Seite entfernt' }).waitFor();

  await edit();
  for (const [target, label] of [['#kiosk', 'Kiosk'], ['#treffen', 'Verabreden']]) {
    answer(true, new RegExp('Menüpunkt „' + label + '“'));
    await row(target).getByRole('button', { name: 'Menüpunkt löschen' }).click();
  }
  answer(true, /Jetzt speichern.*Einträge löschen/);
  await save();
  await form.waitFor({ state: 'detached' });
  assert.deepEqual((await publicDocs())['global:nav'].value, []);
  await guest.reload();
  await guest.getByRole('heading', { name: 'Seite entfernt' }).waitFor();
  assert.equal(await guest.locator('.topnav .tab').count(), 0);
  // The page pencil edits the shared guest and member headings.
  await page.evaluate(() => { location.hash = '#treffen'; });
  await page.getByRole('button', { name: 'Dating-Seite bearbeiten' }).click();
  const dating = page.locator('[data-meet-text]');
  await dating.locator('[name=copy_title]').fill('Gemeinsam Tennis spielen');
  await dating.locator('[name=copy_subtitle]').fill('Training und Matches');
  await dating.locator('[name=copy_training]').fill('Winter- und Sommertraining');
  await dating.locator('[type=submit]').click();
  await dating.waitFor({ state: 'detached' });
  await page.getByRole('heading', { name: 'Gemeinsam Tennis spielen' }).waitFor();
  await page.getByRole('heading', { name: 'Winter- und Sommertraining' }).waitFor();
  const nextGuest = await open();
  await nextGuest.evaluate(() => { location.hash = '#treffen'; });
  await nextGuest.getByRole('heading', { name: 'Gemeinsam Tennis spielen' }).waitFor();
  await nextGuest.getByText('Training und Matches', { exact: true }).waitFor();

  // Turning off the Kiosk keeps the billing and its control accessible.
  await commit([{ key: 'global:nav', expected: (await publicDocs())['global:nav'].revision,
    value: [{ id: 'kiosk', label: 'Kiosk', target: '#kiosk' }] }]);
  await page.evaluate(() => { location.hash = '#kioskabrechnung'; });
  const switcher = page.getByRole('button', { name: 'Kiosk aktiv', exact: true });
  answer(true, /Kiosk deaktivieren/);
  await switcher.click();
  await page.getByRole('button', { name: 'Kiosk inaktiv', exact: true }).waitFor();
  assert.equal((await publicDocs())['global:kioskActive'].value, false);
  const closedGuest = await open();
  assert.equal(await headerLink(closedGuest, '#kiosk').count(), 0);
  await closedGuest.evaluate(() => { location.hash = '#kiosk'; });
  await closedGuest.getByRole('heading', { name: 'Kiosk geschlossen' }).waitFor();
  await page.getByRole('button', { name: 'Kiosk inaktiv', exact: true }).click();
  await switcher.waitFor();
  assert.equal((await publicDocs())['global:kioskActive'].value, true);
  assert.deepEqual(errors, []);
  console.log('PASS: legacy label, rename and hide after reload, two-step deletion, conflict protection, Dating headings and kiosk status.');
} finally {
  await browser.close();
}
