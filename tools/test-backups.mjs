import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const photo = 'data:image/png;base64,YWJj';
const tick = () => new Promise(resolve => setImmediate(resolve));

// Transaction-aware test double: successful requests may still end in an abort.
function imageStorage() {
  const databases = new Map();
  const faults = {};
  const indexedDB = {
    open(name) {
      const req = {};
      setImmediate(() => {
        if (faults.hangOpen) return;
        if (faults.failOpen) { req.onerror?.(); return; }
        const fresh = !databases.has(name);
        if (fresh) databases.set(name, new Map());
        const records = databases.get(name);
        req.result = {
          close() {}, createObjectStore() {},
          transaction(storeName, mode) {
            const pending = [], writes = [];
            const listeners = {};
            let aborted = false;
            const tx = {
              addEventListener(type, fn) { listeners[type] = fn; },
              abort() { if (!aborted) { aborted = true; tx.onabort?.(); listeners.abort?.(); } },
              objectStore() {
                const request = result => { const r = { result }; pending.push(r); return r; };
                return {
                  getAllKeys: () => request([...records.keys()]),
                  getAll: () => request([...records.values()]),
                  get: key => request(records.get(key)),
                  put(value, key) { writes.push([key, value]); return request(key); },
                };
              },
            };
            setImmediate(() => {
              if (aborted) return;
              if (faults.hangTransaction) return;
              for (const req of pending) req.onsuccess?.();
              if ((mode === 'readwrite' && faults.abortWrite) || (mode === 'readonly' && faults.abortRead)) { tx.abort(); return; }
              for (const [key, value] of writes) records.set(key, value);
              tx.oncomplete?.(); listeners.complete?.();
            });
            return tx;
          },
        };
        if (fresh) req.onupgradeneeded?.();
        req.onsuccess?.();
      });
      return req;
    },
    deleteDatabase(name) { databases.delete(name); return {}; },
  };
  return { indexedDB, databases, faults };
}

async function setup() {
  const disk = new Map();
  let quota = false;
  const images = imageStorage();
  const context = {
    console, crypto: webcrypto, TextEncoder,
    setTimeout: (fn, ms) => setTimeout(fn, ms === 10000 ? 40 : ms), clearTimeout,
    indexedDB: images.indexedDB,
    localStorage: {
      getItem: key => disk.get(key) || null,
      setItem(key, value) { if (quota) throw new Error('quota'); disk.set(key, value); },
      removeItem: key => disk.delete(key),
    },
  };
  context.window = context;
  vm.createContext(context);
  for (const path of ['assets/js/config.js', 'assets/data/legal-pages.js', 'assets/data/site-seed.js', 'assets/js/demo-backend.js']) {
    vm.runInContext(readFileSync(new URL(path, root), 'utf8'), context);
  }
  disk.set('tfb_kiosk_demo_session_v1', 'm-demo');
  const api = context.TFB.api;
  const ref = await api.putImage(photo);
  await tick();
  const site = await api.site();
  site.pages.home.blocks.push({ id: 'own-backup-test', type: 'feature', title: 'Own test content', image: ref });
  await api.saveSite(site);
  return { context, api, disk, ...images, quota: () => { quota = true; } };
}

test('export includes photos and rejects open errors, blocked reads and missing references', async () => {
  const { api, faults, databases } = await setup();
  const backup = await api.exportAll();
  assert.equal(Object.keys(backup.images).length, 1);
  faults.failOpen = true;
  await assert.rejects(api.exportAll(), /Bildspeicher/);
  assert.deepEqual(Object.keys(await api.images()), []); // Display fallback is separate.
  faults.failOpen = false;
  faults.abortRead = true;
  await assert.rejects(api.exportAll(), /vollständig/);
  faults.abortRead = false;
  faults.hangOpen = true;
  await assert.rejects(api.exportAll(), /antwortet nicht/);
  faults.hangOpen = false;
  databases.get('tfb_kiosk_images').clear();
  await assert.rejects(api.exportAll(), /fehlen/);
});

test('restore validates before changing anything and retains old photos after transaction abort or quota error', async () => {
  const { api, faults, disk, databases, quota } = await setup();
  const backup = await api.exportAll();
  const before = disk.get('tfb_kiosk_demo_v1');
  const oldPhotos = [...databases.get('tfb_kiosk_images')];
  const invalid = JSON.parse(JSON.stringify(backup));
  delete invalid.images;
  await assert.rejects(api.importAll(invalid), /Fotosammlung/);
  invalid.images = {};
  await assert.rejects(api.importAll(invalid), /fehlen/);
  invalid.images = { 'img:bad': 'not-a-photo' };
  await assert.rejects(api.importAll(invalid), /ungültig/);
  faults.abortWrite = true;
  await assert.rejects(api.importAll(backup), /vollständig/);
  assert.equal(disk.get('tfb_kiosk_demo_v1'), before);
  assert.deepEqual([...databases.get('tfb_kiosk_images')], oldPhotos);
  faults.abortWrite = false;
  quota();
  await assert.rejects(api.importAll(backup), /Gerätespeicher/);
  assert.equal(disk.get('tfb_kiosk_demo_v1'), before);
  assert.deepEqual([...databases.get('tfb_kiosk_images')], oldPhotos);
  assert.equal(databases.size, 1);
});

test('successful restore switches only after complete photo commit and survives backend reload', async () => {
  const { context, api, disk, databases } = await setup();
  const backup = await api.exportAll();
  backup.images['doc:test'] = 'data:application/pdf;base64,YWJj';
  backup.db.site.pages.home.blocks[0].bg = '#99C6FD';
  await api.importAll(backup);
  const active = JSON.parse(disk.get('tfb_kiosk_demo_v1')).imageDatabase;
  assert.match(active, /^tfb_kiosk_images-restore-/);
  assert.equal(databases.get('tfb_kiosk_images').size, 1); // Recovery copy retained.
  assert.equal((await api.exportAll()).images['doc:test'], backup.images['doc:test']);
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  assert.equal((await context.TFB.api.site()).pages.home.blocks[0].bg, '#99C6FD');
  assert.equal((await context.TFB.api.exportAll()).images['doc:test'], backup.images['doc:test']);
});

test('restore transaction timeout leaves the active state untouched', async () => {
  const { api, disk, faults } = await setup();
  const backup = await api.exportAll();
  const before = disk.get('tfb_kiosk_demo_v1');
  faults.hangTransaction = true;
  await assert.rejects(api.importAll(backup), /antwortet nicht/);
  assert.equal(disk.get('tfb_kiosk_demo_v1'), before);
});

async function autosaveSetup() {
  const calls = { exports: 0, opened: 0, aborted: 0 };
  let content = 'last-complete-backup', staged;
  let exportError = null, writeError = false, permission = 'granted';
  const dir = {
    name: 'test-only', queryPermission: async () => permission, requestPermission: async () => permission,
    getFileHandle: async () => ({ createWritable: async () => {
      calls.opened++;
      return { write: async data => { if (writeError) throw new Error('write failed'); staged = data; },
        close: async () => { content = staged; }, abort: async () => { calls.aborted++; } };
    } }),
  };
  const fake = imageStorage();
  fake.databases.set('tfb_autosave', new Map([['dir', dir]]));
  const notices = [];
  const context = {
    indexedDB: fake.indexedDB, navigator: {},
    showDirectoryPicker: async () => dir,
    document: { addEventListener() {}, querySelector: () => null },
    localStorage: { getItem: () => 'state' },
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0,
    TFB: { ui: { state: { member: { isAdmin: false, adminHidden: true } }, esc: x => x,
      toast: x => notices.push(x), api: { exportAll: async () => {
        calls.exports++; if (exportError) throw new Error(exportError);
        return { images: { 'img:test': photo } };
      } } } },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(readFileSync(new URL('assets/js/autosave.js', root), 'utf8'), context);
  await tick(); await tick();
  return { context, calls, notices, content: () => content,
    failExport: message => { exportError = message; }, failWrite: () => { writeError = true; },
    deny: () => { permission = 'denied'; } };
}

test('autosave preserves last complete file on export failure, reports it and retries with hidden admin tools', async () => {
  const { context, calls, notices, content, failExport } = await autosaveSetup();
  failExport('photo read failed');
  await assert.rejects(context.TFB.autosave.run(true), /photo read failed/);
  assert.equal(calls.opened, 0);
  assert.equal(content(), 'last-complete-backup');
  assert.match(context.TFB.autosave.box(), /Sicherung fehlgeschlagen/);
  assert.equal(notices.length, 1);
  failExport(null);
  const first = context.TFB.autosave.run(true);
  assert.equal(context.TFB.autosave.run(true), first);
  await first;
  assert.equal(calls.exports, 2);
  assert.equal(JSON.parse(content()).images['img:test'], photo);
  assert.doesNotMatch(context.TFB.autosave.box(), /Sicherung fehlgeschlagen/);
});

test('autosave aborts failed file writes and does not report permission refusal as success', async () => {
  const { context, calls, content, failWrite, deny } = await autosaveSetup();
  failWrite();
  await assert.rejects(context.TFB.autosave.run(true), /write failed/);
  assert.equal(calls.aborted, 1);
  assert.equal(content(), 'last-complete-backup');
  deny();
  assert.equal(await context.TFB.autosave.run(true), false);
});
