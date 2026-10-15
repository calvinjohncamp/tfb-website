import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://tfb-comments-test.invalid';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.commentTest = JSON.parse(sessionStorage.getItem('comment-test') || '{}');
    window.useCommentMember = async (id, admin = false) => {
      TFB.ui.state.member = TFB.api.attachDirectoryMember({ id, firstName: 'Test', lastName: id, email: id + '@example.invalid', active: true, isAdmin: admin });
      await TFB.api.acceptFeedRules();
    };
  });
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
  const result = await page.evaluate(async () => {
    const api = TFB.api;
    window.commentTest = {};
    window.useCommentMember = async (id, admin = false) => {
      TFB.ui.state.member = api.attachDirectoryMember({ id, firstName: 'Test', lastName: id, email: id + '@example.invalid', active: true, isAdmin: admin });
      await api.acceptFeedRules();
    };
    await useCommentMember('owner');
    const first = await api.addPost({ scope: 'club', text: 'Spontane Nachricht ohne Überschrift' });
    const second = await api.addPost({ scope: 'club', title: 'Zweiter Beitrag', text: 'Ein anderes Thema' });
    commentTest.first = first.id; commentTest.second = second.id;
    await api.addComment(first.id, 'Eigene Ergänzung');
    const selfQuiet = api.commentNotices().length === 0;
    await useCommentMember('reply');
    await api.addComment(first.id, 'Erste Antwort');
    await api.addComment(first.id, '<img src=x onerror=alert(1)>');
    await api.addComment(second.id, 'Anderes Thema');
    const comments = await api.comments(first.id);
    commentTest.replyId = comments[1].id;
    await useCommentMember('stranger');
    let editDenied = false, deleteDenied = false;
    try { await api.editComment(commentTest.replyId, 'Fremde Änderung'); } catch { editDenied = true; }
    try { await api.deleteComment(commentTest.replyId); } catch { deleteDenied = true; }
    const unrelatedQuiet = api.commentNotices().length === 0;
    await useCommentMember('owner');
    const notices = api.commentNotices();
    const rows = await api.posts('club');
    await api.signOut();
    let anonymousDenied = false;
    try { await api.addComment(first.id, 'Anonym'); } catch { anonymousDenied = true; }
    await useCommentMember('owner');
    sessionStorage.setItem('comment-test', JSON.stringify(commentTest));
    return { selfQuiet, editDenied, deleteDenied, unrelatedQuiet, anonymousDenied,
      noticeCounts: notices.map(n => n.count).sort(), count: rows.find(p => p.id === first.id).commentCount,
      order: comments.map(c => c.text), noTitle: !first.title };
  });
  for (const k of ['selfQuiet', 'editDenied', 'deleteDenied', 'unrelatedQuiet', 'anonymousDenied', 'noTitle']) assert.equal(result[k], true, k);
  assert.deepEqual(result.noticeCounts, [1, 2]);
  assert.equal(result.count, 3);
  assert.deepEqual(result.order, ['Eigene Ergänzung', 'Erste Antwort', '<img src=x onerror=alert(1)>']);
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.id === 'owner');
  await page.evaluate(() => { location.hash = '#chat'; });
  await page.locator('[data-action="post-comments"]').first().waitFor();
  assert.equal(await page.locator('.comment-list').count(), 0, 'Comments stay out of the feed');
  // The bell opens a complete thread and marks only that thread as read.
  await page.locator('[data-action="inbox"]').click();
  const noticeId = await page.evaluate(() => 'comments-' + commentTest.first);
  await page.locator(`[data-open="${noticeId}"]`).click();
  await page.locator('.comment').last().waitFor();
  assert.equal(await page.locator('.comment').count(), 3);
  assert.equal(await page.locator('.comment-text img').count(), 0, 'Comment text is escaped');
  assert.equal(await page.evaluate(() => TFB.api.commentNotices().length), 1);
  await page.locator('[data-comment-form] textarea').fill('Antwort des Verfassers');
  await page.locator('[data-comment-form] [type="submit"]').click();
  await page.waitForFunction(() => document.querySelectorAll('.comment').length === 4);
  assert.equal(await page.evaluate(() => TFB.api.commentNotices().length), 1);
  // A later reply triggers a fresh notice; edits do not generate extra notices.
  await page.evaluate(async () => {
    await useCommentMember('reply');
    await TFB.api.addComment(commentTest.first, 'Neue Rückmeldung');
    await TFB.api.editComment(commentTest.replyId, 'Korrigierte erste Antwort');
    await useCommentMember('owner');
  });
  assert.equal(await page.evaluate(() => TFB.api.commentNotices().find(n => n.postId === commentTest.first).count), 1);
  await page.reload();
  await page.locator('.comment').last().waitFor();
  assert.equal(await page.locator('.comment').count(), 5);
  assert.equal(await page.evaluate(() => TFB.api.commentNotices().length), 1, 'Reading survives reload');
  // Own comments can be edited in the dialog and deleted with confirmation.
  await page.locator('.comment').filter({ hasText: 'Antwort des Verfassers' }).locator('[data-action="comment-edit"]').click();
  await page.locator('[data-comment-edit] textarea').fill('Überarbeitete Ergänzung');
  await page.locator('[data-comment-edit] [type="submit"]').click();
  await page.getByText('Überarbeitete Ergänzung', { exact: true }).waitFor();
  const remove = page.locator('.comment').filter({ hasText: 'Überarbeitete Ergänzung' }).locator('[data-action="comment-delete"]');
  await remove.click(); await remove.click();
  await page.waitForFunction(() => document.querySelectorAll('.comment').length === 4);
  // Admin can remove another person's comment, but cannot edit it.
  await page.evaluate(async () => { await useCommentMember('moderator', true); TFB.api.secureDirectory = true; await TFB.ui.renderView(); });
  assert.equal(await page.locator('.comment [data-action="comment-edit"]').count(), 0);
  const modRemove = page.locator('.comment [data-action="comment-delete"]').first();
  await modRemove.click(); await modRemove.click();
  await page.waitForFunction(() => document.querySelectorAll('.comment').length === 3);
  // Composer: message first, optional heading, preserve text while opening it.
  await page.evaluate(() => { location.hash = '#chat'; });
  await page.locator('[data-action="post-new"]').first().click();
  const compose = page.locator('[data-compose]');
  assert.equal(await compose.locator('[name="title"]').isVisible(), false);
  await compose.locator('textarea[name="text"]').fill('Kurze Nachricht');
  await compose.locator('summary').click();
  await compose.locator('[name="title"]').fill('Freiwillige Überschrift');
  assert.equal(await compose.locator('textarea[name="text"]').inputValue(), 'Kurze Nachricht');
  await compose.locator('[type="submit"]').click();
  await page.getByRole('heading', { name: 'Freiwillige Überschrift', exact: true }).waitFor();
  await page.evaluate(() => { location.hash = '#chat/alle'; });
  await page.locator('.mini-comment-count').first().waitFor();
  await page.locator('.mini').filter({ hasText: 'Spontane Nachricht ohne Überschrift' }).click();
  await page.locator('.post-comments').waitFor();
  for (const width of [1100, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `No overflow at ${width}px`);
    if ([1100, 390].includes(width)) await page.screenshot({ path: `/tmp/tfb-comments-${width}.png`, fullPage: true });
  }
  // Removing a post also removes its thread and any pending notification.
  await page.evaluate(async () => {
    await TFB.api.deletePost(commentTest.second);
    await useCommentMember('owner');
  });
  assert.equal(await page.evaluate(() => TFB.api.commentNotices().length), 0);
  assert.deepEqual(errors, []);
  console.log('PASS: optional heading, flat comments, escaped text, permissions, edit/delete/moderation, grouped bell notices, read state, reload and responsive detail view.');
} finally { await browser.close(); }
