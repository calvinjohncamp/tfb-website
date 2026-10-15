import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://tfb-recovery-test.invalid';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
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
  await page.waitForFunction(() => TFB.ui);
  const result = await page.evaluate(async () => {
    const api = TFB.api;
    TFB.ui.state.member = api.attachDirectoryMember({ id: 'recovery-owner', firstName: 'Test', lastName: 'Verwaltung', email: 'test@example.invalid', active: true, isAdmin: true });
    await api.acceptFeedRules();
    const own = await api.addPost({ scope: 'club', title: 'Neu angelegt', text: 'Unbedingt erhalten' });
    const before = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    const photo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jR1kAAAAASUVORK5CYII=';
    const file = { format: 'tfb-chat-wiederherstellung', version: 1, posts: [
      { id: 'p-recover-one', authorId: 'old-account', scope: 'club', title: 'Alt', text: 'Beitrag mit Team', images: ['img:old-photo'], alsoTeams: ['herren-55-1'], createdAt: '2026-10-12T08:00:00Z' },
      { id: 'p-recover-two', authorId: 'old-account', scope: 'club', title: 'Alt zwei', text: 'Ohne Foto', images: [], alsoTeams: [], createdAt: '2026-10-12T09:00:00Z' },
    ], images: { 'img:old-photo': photo } };
    const plan = await api.restoreChatPosts(file);
    const previewUnchanged = localStorage.getItem('tfb_kiosk_demo_v1') === JSON.stringify(before);
    let rejected = false;
    try { await api.restoreChatPosts({ ...file, images: {} }, { apply: true }); } catch { rejected = true; }
    const invalidUnchanged = localStorage.getItem('tfb_kiosk_demo_v1') === JSON.stringify(before);
    await api.restoreChatPosts(file, { apply: true });
    const after = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    const added = after.community.posts.find(p => p.id === 'p-recover-one');
    const images = await api.images({ strict: true });
    await api.editPost(added.id, { title: added.title, text: 'Neuere Bearbeitung', images: added.images, alsoTeams: added.alsoTeams });
    const again = await api.restoreChatPosts(file, { apply: true });
    const repeated = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    return { plan, previewUnchanged, rejected, invalidUnchanged, unchangedOtherData: ['members', 'accounts', 'items', 'statements', 'site', 'catalog'].every(k => JSON.stringify(before[k]) === JSON.stringify(after[k])),
      ownPreserved: after.community.posts.some(p => p.id === own.id && p.text === 'Unbedingt erhalten'), author: added.authorId,
      teams: added.alsoTeams, photoPreserved: images[added.images[0]] === photo, again, newerText: repeated.community.posts.find(p => p.id === added.id).text };
  });
  assert.deepEqual(result.plan, { found: 2, added: 2, skipped: 0, photos: 1 });
  for (const key of ['previewUnchanged', 'rejected', 'invalidUnchanged', 'unchangedOtherData', 'ownPreserved', 'photoPreserved']) assert.equal(result[key], true, key);
  assert.equal(result.author, 'recovery-owner');
  assert.deepEqual(result.teams, ['herren-55-1']);
  assert.equal(result.again.added, 0);
  assert.equal(result.newerText, 'Neuere Bearbeitung');
  await page.reload();
  await page.waitForFunction(() => TFB.ui?.state.member?.id === 'recovery-owner');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).community.posts.length), 3);
  if (process.env.TFB_RECOVERY_FIXTURE) {
    const file = JSON.parse(readFileSync(process.env.TFB_RECOVERY_FIXTURE, 'utf8'));
    const restored = await page.evaluate(async file => {
      const result = await TFB.api.restoreChatPosts(file, { apply: true });
      const posts = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).community.posts;
      const images = await TFB.api.images({ strict: true });
      return { result, complete: file.posts.every(p => {
        const target = posts.find(t => t.id === p.id);
        return target?.authorId === 'recovery-owner' && target.text === p.text
          && JSON.stringify(target.alsoTeams) === JSON.stringify(p.alsoTeams || [])
          && target.images.every((ref, i) => images[ref] === file.images[p.images[i]]);
      }) };
    }, file);
    assert.equal(restored.complete, true);
    console.log('Private recovery file verified locally:', restored.result);
  }
  // The profile's targeted picker imports only the supplied posts after confirmation.
  await page.evaluate(() => { TFB.api.secureDirectory = true; });
  await page.locator('[data-action="profile"]').first().click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-chat-restore-input]').setInputFiles({ name: 'Chat-Wiederherstellung.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({
    format: 'tfb-chat-wiederherstellung', version: 1, images: {}, posts: [{ id: 'p-ui-recovery', scope: 'club', title: 'Über Dateiauswahl', text: 'Ergänzung', images: [], alsoTeams: [], createdAt: '2026-10-12T10:00:00Z' }],
  })) });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1')).community.posts.some(p => p.id === 'p-ui-recovery'));
  // Names stay intact on phones, portrait tablets and narrow embedded columns.
  await page.evaluate(async () => {
    TFB.ui.state.member = await TFB.api.acceptConsent();
    TFB.api.tally = async () => ['Brandt', 'Dietrich', 'Kämper', 'Müller-Schneider', 'von der Linden'].map(lastName => ({ lastName, firstName: 'Anna-Lena', counts: { Wasser: 3 }, cats: { drinks: 3 }, isMe: false }));
    location.hash = '#strichliste';
  });
  await page.locator('.paper-name-part').first().waitFor();
  for (const width of [320, 390, 640, 768, 834, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    const layout = await page.locator('.paper-name-part').evaluateAll(parts => parts.every(part => {
      const range = document.createRange(); range.selectNodeContents(part);
      const row = part.closest('.tally-row').getBoundingClientRect();
      const box = part.getBoundingClientRect();
      return range.getClientRects().length === 1 && box.x >= row.x && box.right <= row.right + 1;
    }));
    assert.equal(layout, true, `Unbroken name parts fit at ${width}px`);
    if ([390, 768].includes(width)) await page.screenshot({ path: `/tmp/tfb-tally-names-${width}.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: selective chat recovery preserves existing data, photos, teams and authorship; repeat imports preserve newer text; names fit phones/tablets.');
} finally { await browser.close(); }
