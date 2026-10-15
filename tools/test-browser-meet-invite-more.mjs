import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Isolated browser and synthetic members; no live service or private list.
const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://tfb-meet-test.invalid';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2026-10-15T06:00:00Z'));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
    try { return route.fulfill({ body: readFileSync(path), contentType: types[extname(path)] || 'application/octet-stream' }); }
    catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(origin);
  await page.waitForFunction(() => TFB.ui);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.members.push(...['one', 'two'].map((n, i) => ({ id: 'extra-' + n, firstName: 'Zusatz', lastName: i ? 'Zwei' : 'Eins', email: n + '@example.invalid', active: true })));
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    const responses = Object.fromEntries(['m-demo', 'm4', 'm6', 'm8'].map((id, i) => [id, { a: i === 3 ? 'no' : 'yes', at: Date.now() - (10 - i) * 60000, note: 'unverändert' }]));
    const meeting = { id: 'test-doppel', kind: 'doppel', title: 'Doppel', date: '2026-10-16', time: '15:00', place: 'Platz 1', createdBy: 'm-demo', invitees: ['m-demo', 'm4', 'm6', 'm8'], slots: 4, responses, seriesId: 'test-series' };
    localStorage.setItem('tfb_meet_demo_v2', JSON.stringify({ groups: [], series: [{ id: 'test-series', createdBy: 'm-demo', invitees: meeting.invitees.slice(), from: '2026-10-16', until: '2026-10-16', time: '15:00', place: 'Platz 1', slots: 4, leadDays: 3, kind: 'doppel', title: 'Doppel', skipped: [] }], meets: [meeting], inbox: [], noSampleGroups: true }));
  });
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.id === 'm-demo');
  await page.evaluate(() => { location.hash = '#treffen/test-doppel'; });
  const button = page.locator('[data-action="meet-invite-more"]');
  try { await button.waitFor({ timeout: 5000 }); }
  catch (error) { console.log({ errors, view: await page.locator('#view').innerText() }); throw error; }
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_meet_demo_v2')));
  await button.click();
  let form = page.locator('[data-meet-invite-more]');
  await form.locator('[name="search"]').fill('Zusatz');
  await form.locator('[data-add="extra-one"]').click();
  // Closing without submission cannot mutate the meeting.
  await page.locator('.sheet-close').click();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_meet_demo_v2')).meets), before.meets);
  await button.click();
  form = page.locator('[data-meet-invite-more]');
  await page.screenshot({ path: '/tmp/tfb-invite-more-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  const box = await form.boundingBox();
  assert.ok(box.x >= 0 && box.x + box.width <= 391, 'Invitation form fits the phone viewport');
  await page.screenshot({ path: '/tmp/tfb-invite-more-mobile.png' });
  for (const id of ['extra-one', 'extra-two']) {
    await form.locator('[name="search"]').fill('Zusatz');
    await form.locator(`[data-add="${id}"]`).click();
  }
  await form.locator('[type="submit"]').click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_meet_demo_v2')).meets[0].invitees.length === 6);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_meet_demo_v2')));
  assert.deepEqual(after.meets[0].responses, before.meets[0].responses);
  assert.deepEqual(after.series, before.series);
  assert.deepEqual(after.inbox.filter(n => n.type === 'invite').map(n => n.to).sort(), ['extra-one', 'extra-two']);
  await button.click();
  await form.locator('[name="search"]').fill('Zusatz');
  await form.getByText('Keine weiteren passenden Mitglieder gefunden.').waitFor();
  assert.equal(await form.locator('[data-add]').count(), 0);
  await page.locator('.sheet-close').click();
  // Existing first-come/standby behaviour applies to the additional invitees too.
  for (const id of ['extra-one', 'extra-two']) {
    await page.locator(`[data-action="meet-proxy"][data-member="${id}"]`).click();
    await page.locator('.meet-proxy [data-set="yes"]').click();
  }
  await page.locator('[data-member="extra-two"] .meet-pill').getByText('Ersatz 1').waitFor();
  await page.screenshot({ path: '/tmp/tfb-invite-more-result.png' });
  await page.reload();
  await page.locator('[data-member="extra-two"] .meet-pill').getByText('Ersatz 1').waitFor();
  // An invited member cannot access the organiser's add-invitees action.
  await page.evaluate(() => localStorage.setItem('tfb_kiosk_demo_session_v1', 'm4'));
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.id === 'm4');
  assert.equal(await page.locator('[data-action="meet-invite-more"]').count(), 0);
  await page.evaluate(() => TFB.actions['meet-invite-more']({ dataset: { id: 'test-doppel' } }));
  assert.equal(await page.locator('[data-meet-invite-more]').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS: add invitees after decline; preserve responses/series; notify new invitees only; no duplicates; standby; persistence; organiser only.');
} finally { await browser.close(); }
