import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage({ timezoneId: 'Europe/Berlin', serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2026-10-13T08:00:00Z'));
  await page.addInitScript(() => {
    const fixture = sessionStorage.getItem('next-match-test-fixture');
    if (fixture) localStorage.setItem('tfb_meet_demo_v2', fixture);
  });
  await page.goto('http://127.0.0.1:5180/#home');
  await page.waitForFunction(() => localStorage.getItem('tfb_kiosk_demo_v1'));
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts.push({ memberId: 'm-demo', consentVersion: TFB.config.consentVersion, consentedAt: new Date().toISOString() });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
  });
  const make = (id, date, time, response = 'yes', extra = {}) => ({
    id, title: 'Match ' + id, kind: 'einzel', date, time, place: 'Platz 2',
    createdBy: 'm4', invitees: ['m4', 'm-demo'], slots: 2,
    responses: { m4: { a: 'yes', at: 1 }, ...(response ? { 'm-demo': { a: response, at: 2 } } : {}) }, ...extra,
  });
  async function loadMeets(meets) {
    await page.evaluate(meets => {
      sessionStorage.setItem('next-match-test-fixture', JSON.stringify({ meets, groups: [], series: [], inbox: [], noSampleGroups: true }));
    }, meets);
    await page.reload();
    await page.waitForSelector('[data-action="profile"]');
  }
  const eligible = make('confirmed', '2026-10-13', '18:00');
  await loadMeets([
    make('later', '2026-10-14', '11:00'),
    make('past', '2026-10-13', '09:00'),
    make('open', '2026-10-13', '11:00', null),
    make('declined', '2026-10-13', '12:00', 'no'),
    make('reserve', '2026-10-13', '13:00', 'yes', { invitees: ['m4', 'm6', 'm-demo'], responses: { m4: { a: 'yes', at: 1 }, m6: { a: 'yes', at: 2 }, 'm-demo': { a: 'yes', at: 3 } } }),
    make('someone-else', '2026-10-13', '14:00', null, { invitees: ['m4', 'm6'], responses: { m4: { a: 'yes', at: 1 }, m6: { a: 'yes', at: 2 } } }),
    eligible,
  ]);
  assert.equal(await page.evaluate(() => TFB.meet.nextMatch('m-demo').id), 'confirmed');
  assert.equal(await page.evaluate(() => TFB.meet.nextMatch(null)), null);
  const storageBefore = await page.evaluate(() => localStorage.getItem('tfb_meet_demo_v2'));
  await page.locator('[data-action="profile"]').click();
  const summary = page.locator('.acct-next-match');
  assert.match(await summary.textContent(), /Dienstag, 13\. Oktober.*18:00 Uhr/);
  assert.match(await summary.textContent(), /Platz 2/);
  assert.equal(await summary.evaluate(el => el.previousElementSibling.classList.contains('acct-card')), true);
  assert.equal(await summary.evaluate(el => el.nextElementSibling.classList.contains('acct-kiosk')), true);
  assert.equal(await summary.evaluate(el => getComputedStyle(el).borderTopWidth), '1px');
  assert.equal(await page.locator('.acct-kiosk h3').textContent(), 'Kiosk-Umsätze');
  assert.equal(await page.evaluate(() => localStorage.getItem('tfb_meet_demo_v2')), storageBefore);
  for (const width of [1100, 834, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await summary.scrollIntoViewIfNeeded();
    const rect = await summary.boundingBox();
    assert.ok(rect.x >= 0 && rect.x + rect.width <= width + 1);
    assert.equal(await summary.evaluate(el => el.scrollWidth > el.clientWidth), false);
    await page.screenshot({ path: `/tmp/tfb-next-match-${width}.png` });
  }
  await summary.locator('a').click();
  await page.waitForFunction(() => location.hash === '#treffen/confirmed');
  assert.equal(await page.locator('.acct-next-match').count(), 0);
  await page.locator('[data-action="profile"]').click();
  await page.locator('.acct-kiosk > .acct-details').click();
  await page.waitForFunction(() => location.hash === '#abrechnungen');
  await page.waitForSelector('.month-card');
  assert.equal(await page.locator('.month-card > p.muted').textContent(), 'Einzug am 5. November');
  assert.equal(await page.locator('.acct-kiosk').count(), 0);
  assert.match(await page.locator('#app').textContent(), /Meine Abrechnungen/);
  await loadMeets([make('training', '2026-10-14', '18:00', 'yes', { kind: 'training', slots: null, title: 'Training TFB Ü50' })]);
  await page.locator('[data-action="profile"]').click();
  assert.match(await summary.textContent(), /Training TFB Ü50/);
  await page.locator('.sheet-close').click();
  await loadMeets([]);
  await page.locator('[data-action="profile"]').click();
  assert.match(await summary.textContent(), /kein zugesagtes Match/);
  assert.equal(await summary.locator('a').count(), 0);
  assert.deepEqual(errors, []);
  console.log('Nächstes Match: eigene Zusagen, Startzeit, Ersatz/Absage/offen ausgeschlossen, Training, Position, Details, leerer Zustand und Mobil geprüft.');
} finally {
  await browser.close();
}
