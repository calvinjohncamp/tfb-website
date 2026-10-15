import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true,
  ...(process.env.TFB_CHROME_PATH ? { executablePath: process.env.TFB_CHROME_PATH } : {}) });
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:5180/');
  await page.waitForFunction(() => window.TFB?.ui);
  await page.evaluate(() => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts = db.accounts.filter(a => a.memberId !== 'm-demo');
    db.accounts.push({ memberId: 'm-demo', feedRules: 'yes' });
    db.community.rosters = { 'test-team': ['m-demo', 'm4'] };
    db.community.fixedRosters20261011 = true;
    db.community.posts = [];
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo');
    localStorage.setItem('tfb_meet_demo_v2', JSON.stringify({ groups: [{ id: 'test-group', name: 'Training', members: ['m-demo', 'm6', 'm4'], pending: ['m8'], createdBy: 'm6' }], meets: [], series: [], inbox: [], noSampleGroups: true }));
  });
  await page.reload();
  await page.waitForSelector('[data-action="profile"]');
  assert.deepEqual(await page.evaluate(() => TFB.api.chatNotices()), []);
  await page.locator('[data-action="profile"]').click();
  assert.equal(await page.locator('[name=groupChatNotices]').inputValue(), 'off');
  await page.locator('[name=groupChatNotices]').selectOption('on');
  await page.locator('[data-account-form] [type=submit]').click();
  await page.waitForFunction(() => TFB.ui.state.member.groupChatNotices);
  await page.locator('.sheet-close').click();
  await page.evaluate(async () => {
    const db = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    const since = db.accounts.find(a => a.memberId === 'm-demo').chatNoticesSince;
    const post = (id, authorId, extra = {}) => ({ id, authorId, scope: 'club', title: id, text: 'Hallo vom Training', images: [], createdAt: new Date(Date.parse(since) + 1000).toISOString(), ...extra });
    db.community.posts = [post('team-one', 'm4'), post('team-two', 'm4'), post('training', 'm6'), post('pending', 'm8'), post('own', 'm-demo'), post('unrelated', 'm12'), post('hidden', 'm4', { hidden: true }), post('old', 'm4', { createdAt: new Date(Date.parse(since) - 1000).toISOString() })];
    localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(db));
    await TFB.api.reloadLocalState();
    TFB.inbox.refresh();
  });
  let notices = await page.evaluate(() => TFB.api.chatNotices());
  assert.equal(notices.length, 2, JSON.stringify(await page.evaluate(async () => ({ session: await TFB.api.session(), db: JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).accounts, peers: TFB.meet.chatPeers('m-demo') }))));
  assert.equal(notices.find(n => n.from === 'm4').count, 2);
  assert.equal(notices.find(n => n.from === 'm6').count, 1);
  await page.locator('[data-action=inbox]').click();
  await page.waitForSelector('.inbox-item');
  assert.equal(await page.locator('.inbox-item').count(), 2);
  await page.locator('[data-open="chat-m4"]').click();
  await page.waitForSelector('.chat-stream .fpost');
  assert.equal(await page.evaluate(() => TFB.api.chatNotices().find(n => n.from === 'm4').count), 1);
  await page.reload();
  await page.waitForSelector('.chat-stream .fpost');
  assert.equal(await page.evaluate(() => TFB.api.chatNotices().find(n => n.from === 'm4').count), 1);
  await page.locator('[data-action=inbox]').click();
  await page.locator('[data-open="chat-m4"]').click();
  await page.waitForFunction(() => !TFB.api.chatNotices().some(n => n.from === 'm4'));
  await page.locator('[data-action=inbox]').click();
  await page.locator('[data-del="chat-m6"]').click();
  await page.waitForFunction(() => TFB.api.chatNotices().length === 0);
  await page.locator('.sheet-close').click();
  await page.locator('[data-action=profile]').click();
  for (const width of [1100, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('[name=groupChatNotices]').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.acct').evaluate(el => el.scrollWidth > el.clientWidth), false);
    await page.screenshot({ path: `/tmp/tfb-chat-notices-${width}.png` });
  }
  await page.locator('[name=groupChatNotices]').selectOption('off');
  await page.locator('[data-account-form] [type=submit]').click();
  await page.waitForFunction(() => !TFB.ui.state.member.groupChatNotices);
  assert.deepEqual(await page.evaluate(() => TFB.api.chatNotices()), []);
  assert.deepEqual(errors, []);
  console.log('Chat-Hinweise: opt-in, Mannschaft/Training, keine eigenen/fremden/pending/alten/verborgenen Beiträge, Bündelung, Direktlink, gelesen nach Reload, Entfernen und Mobil geprüft.');
} finally { await browser.close(); }
