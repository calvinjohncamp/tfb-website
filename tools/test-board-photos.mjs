import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
test('local crop sources embed all seven source files without alteration', () => {
  const context = { TFB: {} };
  context.window = context;
  vm.runInNewContext(readFileSync(new URL('assets/data/board-photo-data.js', root), 'utf8'), context);
  assert.equal(Object.keys(context.TFB.boardPhotoData).length, 7);
  for (const [path, data] of Object.entries(context.TFB.boardPhotoData)) {
    assert.deepEqual(Buffer.from(data.split(',')[1], 'base64'), readFileSync(new URL(path, root)));
  }
});
test('published board import includes seven local portraits and runs only once', async () => {
  const { api, login, storage, boot } = setup();
  const board = await api.boardPeople();
  assert.equal(board.length, 7);
  assert.equal(board[0].email, 'kai.eichmann.tennis@gmail.com');
  assert.match(board[1].avatar, /aufgehellt\.png$/);
  assert.match(board[1].avatarLarge, /sebastian-manz\.jpg$/);
  assert.match(board[5].avatar, /aufgehellt\.png$/);
  for (const person of board) {
    assert.ok(person.phone && person.email);
    assert.ok(readFileSync(new URL(person.avatar, root)).length > 1000);
    assert.ok(readFileSync(new URL(person.avatarLarge, root)).length > 1000);
  }
  login('m-demo');
  const site = await api.site();
  site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people.reverse();
  await api.saveSite(site);
  assert.equal((await boot().boardPeople())[0].name, 'Katharina Pollmann');
  const db = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  db.site.applied = db.site.applied.filter((id) => id !== 'club-vorstand-import-2026-10-11');
  db.site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people = [{ name: 'Name folgt' }];
  storage.set('tfb_kiosk_demo_v1', JSON.stringify(db));
  assert.equal((await boot().boardPeople()).length, 7);
});
function setup() {
  const storage = new Map();
  function boot() {
    const context = { console, crypto: webcrypto, TextEncoder, setTimeout, clearTimeout,
      localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) } };
    context.window = context;
    vm.createContext(context);
    for (const path of ['assets/js/config.js', 'assets/data/site-seed.js', 'assets/js/demo-backend.js']) {
      vm.runInContext(readFileSync(new URL(path, root), 'utf8'), context);
    }
    return context.TFB.api;
  }
  boot();
  const db = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  db.members.find((m) => m.id === 'm1').email = 'family@example.org';
  db.members.find((m) => m.id === 'm-j1').email = 'family@example.org';
  db.accounts.push({ memberId: 'm-demo' }, { memberId: 'm-j1' });
  storage.set('tfb_kiosk_demo_v1', JSON.stringify(db));
  const api = boot();
  const login = (id) => id ? storage.set('tfb_kiosk_demo_session_v1', id) : storage.delete('tfb_kiosk_demo_session_v1');
  return { api, storage, login, boot };
}

test('board lookup is admin-only and shared emails return all candidates', async () => {
  const { api, login } = setup();
  await assert.rejects(api.searchBoardMembers('family@example.org'));
  login('m1');
  await assert.rejects(api.searchBoardMembers('family@example.org'));
  login('m-demo');
  const found = await api.searchBoardMembers('family@example.org');
  assert.equal(found.length, 2);
  assert.deepEqual(Array.from(found, (m) => m.id).sort(), ['m-j1', 'm1']);
});

test('board-specific crop persists without changing its original', async () => {
  const { api, login, boot } = setup();
  login('m-demo');
  const site = await api.site();
  const person = site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people[0];
  person.photoCrop = { image, source: person.image, position: { zoom: 2, x: 10, y: 20 } };
  await api.saveSite(site);
  login(null);
  assert.equal((await boot().boardPeople())[0].avatar, image);
  assert.equal((await api.boardPeople())[0].avatarLarge, person.image);
  assert.equal((await api.site()).pages.verein.blocks.find((b) => b.id === 'v-vorstand').people[0].photoCrop, undefined);
});

test('linked crop is hidden after permission withdrawal or replacement', async () => {
  const { api, login } = setup();
  login('m1');
  await api.setAvatar(image);
  await api.setPhotoPermissions({ publicAvatar: true });
  login('m-demo');
  const [member] = await api.boardMembers(['m1']);
  const site = await api.site();
  const cropped = image + '#cropped';
  site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people = [{ role: 'Vorsitz', memberId: 'm1', photoCrop: { image: cropped, source: `member:m1:${member.avatarRevision}` } }];
  await api.saveSite(site);
  assert.equal((await api.boardPeople())[0].avatar, cropped);
  login('m1');
  await api.setPhotoPermissions({ publicAvatar: false });
  assert.equal((await api.boardPeople())[0].avatar, null);
  await api.setAvatar(image);
  await api.setPhotoPermissions({ publicAvatar: true });
  assert.equal((await api.boardPeople())[0].avatar, image);
});

test('board uses member ID, public photo permission, and explicit email publication', async () => {
  const { api, login } = setup();
  login('m-demo');
  const site = await api.site();
  site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people = [{ role: 'Vorsitz', name: 'Alter Name', memberId: 'm1', image: 'assets/images/board/kai-eichmann.jpg' }];
  await api.saveSite(site);
  login('m1');
  await api.setAvatar(image);
  let board = await api.boardPeople();
  assert.equal(board[0].name, 'Anna Becker');
  assert.equal(board[0].avatar, null);
  assert.equal(board[0].avatarLarge, null);
  assert.equal(board[0].email, '');
  await api.setPhotoPermissions({ publicAvatar: true, events: false });
  login(null);
  assert.equal((await api.boardPeople())[0].avatar, image);
  assert.equal((await api.boardPeople())[0].avatarLarge, image);
  login('m1');
  await api.setPhotoPermissions({ publicAvatar: false, events: false });
  assert.equal((await api.boardPeople())[0].avatar, null);
  assert.equal((await api.boardPeople())[0].avatarLarge, null);
});

test('minor photos stay hidden until verified admin approval; replacement revokes visibility', async () => {
  const { api, login } = setup();
  login('m-j1');
  await api.setAvatar(image);
  assert.deepEqual(Object.keys(await api.memberAvatars(['m-j1'])), []);
  await assert.rejects(api.setPhotoPermissions({ publicAvatar: true }));
  await api.setPhotoPermissions({ publicAvatar: true, events: true, parentName: 'Test Parent', parentEmail: 'parent@example.org' });
  await assert.rejects(api.reviewPhotoRequest('m-j1', true, true));
  login('m-demo');
  await assert.rejects(api.reviewPhotoRequest('m-j1', true, false));
  await api.reviewPhotoRequest('m-j1', true, true);
  assert.equal((await api.memberAvatars(['m-j1']))['m-j1'], image);
  login('m-j1');
  await api.setAvatar(image);
  assert.deepEqual(Object.keys(await api.memberAvatars(['m-j1'])), []);
});

test('anonymous feeds do not expose private profile photos', async () => {
  const { api, login } = setup();
  login('m1');
  await api.setAvatar(image);
  await api.acceptFeedRules();
  await api.addPost({ scope: 'club', text: 'Eigener Testbeitrag', images: [] });
  assert.equal((await api.posts('club')).find((p) => p.authorId === 'm1').avatar, image);
  login(null);
  assert.equal((await api.posts('club')).find((p) => p.authorId === 'm1').avatar, null);
});

test('stored linkage survives restart and reflects a renamed member', async () => {
  const { api, login, storage, boot } = setup();
  login('m-demo');
  const site = await api.site();
  site.pages.verein.blocks.find((b) => b.id === 'v-vorstand').people = [{ role: 'Vorsitz', name: 'Anna Becker', memberId: 'm1' }];
  await api.saveSite(site);
  const db = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  db.members.find((m) => m.id === 'm1').firstName = 'Neuer Name';
  storage.set('tfb_kiosk_demo_v1', JSON.stringify(db));
  const restarted = boot();
  assert.equal((await restarted.boardPeople())[0].name, 'Neuer Name Becker');
  assert.equal((await restarted.boardMembers(['m1']))[0].firstName, 'Neuer Name');
});
