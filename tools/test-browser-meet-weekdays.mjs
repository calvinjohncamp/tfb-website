import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage({ timezoneId: 'Europe/Berlin', serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2026-10-13T08:00:00Z'));
  await page.goto('http://127.0.0.1:5180/#home');
  await page.waitForFunction(() => localStorage.getItem('tfb_kiosk_demo_v1'));
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts.push({ memberId: 'm-demo' });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    const meets = JSON.parse(localStorage.getItem('tfb_meet_demo_v2'));
    meets.groups.push({ id: 'g-weekday-test', name: 'Wochentag-Test', members: ['m-demo', 'm4'], pending: [], createdBy: 'm-demo', weekday: 3, time: '18:00', place: 'Courts 1 + 2' });
    localStorage.setItem('tfb_meet_demo_v2', JSON.stringify(meets));
  });
  await page.goto('http://127.0.0.1:5180/#treffen');
  await page.reload();
  await page.waitForSelector('.topbar');
  await page.evaluate(() => { location.hash = '#treffen'; });
  await page.locator('.meet-new-row [data-action="meet-new"][data-kind="training"]').click();
  const form = page.locator('[data-meet-form]');
  await form.locator('[data-togglegroup="g-weekday-test"]').click();
  await form.locator('[data-weekly="1"]').click();
  assert.deepEqual(await form.locator('[data-weekday]').allTextContents(), ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-14');
  await form.locator('[name="time"]').fill('19:30');
  await form.locator('[name="place"]').fill('Trainingshalle');
  await form.locator('[name="leadDays"]').selectOption('5');
  const until = await form.locator('[name="until"]').inputValue();
  await form.getByRole('button', { name: 'Freitag', exact: true }).click();
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-16');
  await form.getByRole('button', { name: 'Mittwoch', exact: true }).click();
  await form.locator('[name="date"]').fill('2026-10-28');
  await form.locator('[name="date"]').dispatchEvent('change');
  assert.equal(await form.getByRole('button', { name: 'Mittwoch', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await form.locator('[name="until"]').inputValue(), until);
  assert.equal(await form.locator('[name="time"]').inputValue(), '19:30');
  assert.equal(await form.locator('[name="place"]').inputValue(), 'Trainingshalle');
  assert.equal(await form.locator('[name="leadDays"]').inputValue(), '5');
  await form.locator('[name="date"]').fill('2026-10-29');
  await form.locator('[name="date"]').dispatchEvent('change');
  await form.locator('[type="submit"]').click();
  assert.match(await form.locator('.form-error').textContent(), /Mittwoch/);
  await form.locator('[name="date"]').fill('2026-10-28');
  await form.locator('[name="date"]').dispatchEvent('change');
  for (const width of [1100, 834, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await form.locator('.meet-weekdays').scrollIntoViewIfNeeded();
    for (const button of await form.locator('[data-weekday]').all()) {
      const rect = await button.boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= width + 1);
    }
    await page.screenshot({ path: `/tmp/tfb-weekdays-${width}.png` });
  }
  await form.locator('[type="submit"]').click();
  await page.waitForSelector('[data-action="meet-series"]');
  await page.locator('[data-action="meet-series"]').click();
  const details = page.locator('[data-series-form]');
  assert.equal(await details.locator('[name="weekday"]').inputValue(), 'Mittwoch');
  assert.equal(await details.locator('.field').first().locator('span').textContent(), 'Wochentag');
  assert.match(await details.textContent(), /jede Woche mittwochs/);
  await page.locator('.sheet-close').click();
  await page.reload();
  await page.waitForSelector('.topbar');
  await page.evaluate(() => { location.hash = '#treffen'; });
  await page.locator('[data-action="meet-series"]').click();
  assert.equal(await details.locator('[name="weekday"]').inputValue(), 'Mittwoch');
  await page.locator('.sheet-close').click();
  await page.locator('[data-action="meet-new"][data-kind="einzel"]').click();
  await form.getByRole('button', { name: 'Dienstag', exact: true }).click();
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-13');
  await form.locator('[name="time"]').fill('09:00');
  await form.getByRole('button', { name: 'Dienstag', exact: true }).click();
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-20');
  await form.locator('[name="date"]').fill('2026-10-22');
  await form.locator('[name="date"]').dispatchEvent('change');
  assert.equal(await form.getByRole('button', { name: 'Donnerstag', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.clock.setFixedTime(new Date('2026-10-24T22:30:00Z'));
  await form.getByRole('button', { name: 'Montag', exact: true }).click();
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-26');
  await page.locator('.sheet-close').click();
  await page.locator('[data-action="meet-new"][data-kind="doppel"]').click();
  await form.getByRole('button', { name: 'Montag', exact: true }).click();
  assert.equal(await form.locator('[name="date"]').inputValue(), '2026-10-26');
  assert.deepEqual(errors, []);
  console.log('Wochentage: Datumshilfe, späterer Serienstart, Validierung, Details, gespeicherte Serie, Mobil und Zeitumstellung geprüft.');
} finally {
  await browser.close();
}
