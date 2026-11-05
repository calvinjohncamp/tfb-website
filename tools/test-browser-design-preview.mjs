import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.TFB_TEST_SITE_URL || 'http://127.0.0.1:5180/');
  const splash = page.locator('#tfb-splash');
  const splashBall = splash.getByRole('button', { name: 'Farbwelt wechseln' });
  const headerBall = page.locator('.topbar [data-tfb-brand]');
  const admin = page.locator('[data-action="admin-toggle"]');
  const world = () => page.evaluate(() => document.body.dataset.designWorld);
  await splashBall.click();
  assert.equal(await splashBall.getAttribute('aria-pressed'), 'true');
  assert.equal(await splash.locator('[data-action="splash-edit"]').count(), 0);
  await splash.locator('[data-action="splash-enter"]').click();
  assert.equal(await headerBall.getAttribute('aria-pressed'), 'true');
  assert.equal(await world(), 'cool');
  assert.equal(await admin.count(), 0);
  assert.equal(await page.locator('[data-design-preview]').count(), 0);

  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.site.pages.home.blocks.find(block => block.type === 'feature').bg = '#99C6FD';
    db.site.homeColorMode = 'bunt';
    if (!db.accounts.some(account => account.memberId === 'm-demo')) db.accounts.push({ memberId: 'm-demo' });
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    localStorage.setItem('tfb_design_world_v2', 'warm');
  });
  await page.reload();
  await splash.locator('[data-action="splash-enter"]').click();
  assert.equal(await world(), 'cool');
  const feature = page.locator('[data-feature]').first();
  const background = () => feature.evaluate(el => el.style.getPropertyValue('--feature-bg'));
  assert.equal(await background(), '');
  await feature.locator('.feature-number').click();
  assert.equal(await background(), '');

  await admin.click();
  const custom = page.locator('button[data-design-world="custom"]');
  assert.equal(await custom.count(), 0);
  await page.getByRole('button', { name: 'Warme Welt' }).click();
  await custom.waitFor();
  assert.equal(await world(), 'warm');
  assert.equal(await background(), '');
  await custom.click();
  await page.waitForFunction(() => document.querySelector('[data-feature]')?.style.getPropertyValue('--feature-bg') === '#99C6FD');
  assert.equal(await world(), 'custom');
  await page.getByRole('button', { name: 'Warme Welt' }).click();
  await page.locator('.home-tools [data-action="site-edit"]').click();
  await page.locator('[data-action="block-edit"]').first().click();
  const blockEditor = page.locator('[data-editor="block"]');
  await blockEditor.locator('input[name="bg"]').fill('#AABBCC');
  await page.waitForFunction(() => document.querySelector('[data-feature]')?.style.getPropertyValue('--feature-bg') === '#AABBCC');
  assert.equal(await world(), 'custom');
  await blockEditor.locator('[type="submit"]').click();
  await page.getByRole('button', { name: 'Fertig', exact: true }).click();
  assert.equal(await background(), '#AABBCC');
  await page.getByRole('button', { name: 'Einstiegsseite bearbeiten' }).click();
  const editor = page.locator('[data-editor="splash"]');
  await editor.locator('[name="headline"]').fill('Vorschau für den Test');
  await editor.getByRole('button', { name: 'Vorschau ansehen' }).click();
  await splash.locator('h1').getByText('Vorschau für den Test').waitFor();
  assert.equal(await splash.locator('[data-action="splash-edit"]').count(), 0);
  await splash.locator('[data-action="splash-enter"]').click();
  await admin.click();
  await page.waitForFunction(() => document.body.dataset.designWorld === 'cool' && !document.querySelector('.world-switch'));
  assert.equal(await background(), '');

  await page.locator('nav.topnav a[href="#sport"]').click();
  await page.waitForURL(/#sport$/);
  await headerBall.click();
  assert.match(page.url(), /#sport$/);
  assert.equal(await headerBall.getAttribute('aria-pressed'), 'false');
  await page.locator('.brand-home').click({ position: {x: 5, y: 5} });
  await page.waitForURL(/#home$/);
  for (const width of [320, 390, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  assert.deepEqual(errors, []);
  console.log('Farbwechsel am Ball, Home-Link, Admin-Welten und Einstiegsseiten-Vorschau geprüft.');
} finally { await browser.close(); }
