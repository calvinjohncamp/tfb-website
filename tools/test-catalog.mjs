import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
function setup() {
  const storage = new Map();
  const context = { console, crypto: webcrypto, TextEncoder, setTimeout, clearTimeout,
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) } };
  context.window = context;
  vm.createContext(context);
  for (const path of ['assets/js/config.js', 'assets/data/legal-pages.js', 'assets/data/site-seed.js', 'assets/js/demo-backend.js', 'assets/js/art.js']) {
    vm.runInContext(readFileSync(new URL(path, root), 'utf8'), context);
  }
  return { context, storage };
}

test('catalog matches the real beverage list and places specialties before the unchanged future shop', async () => {
  const { context } = setup();
  const cat = await context.TFB.api.catalog();
  assert.deepEqual(Array.from(cat.sections, s => s.id), ['alkoholfrei', 'bier', 'aperitif', 'spezialitaeten', 'spielbetrieb', 'snacks', 'shop']);
  assert.equal(cat.sections[3].title, 'Spezialitäten');
  assert.equal(cat.sections[3].status, 'open');
  assert.equal(cat.sections[4].title, 'Spielbetrieb');
  assert.equal(cat.sections[5].title, 'Snacks');
  assert.equal(cat.sections[6].status, 'soon');
  const prices = {gerolsteiner:150, apfelschorle:150, 'coca-cola':150, fanta:150, fassbrause:210,
    sportsfreund:210, malzbier:210, 'koelsch-flasche':220, koelsch:180, 'koelsch-kranz':1450,
    weissbier:350, radler:210, aperol:350, grauburgunder:1000, bockwurst:250, grillwurst:300, grillfleisch:400, flutlicht:500, gastspieler:800};
  for (const [id, price] of Object.entries(prices)) assert.equal(cat.products.find(p => p.id === id).price, price, id);
  assert.match(cat.products.find(p => p.id === 'koelsch-kranz').detail, /9 Kölsch/);
  assert.doesNotMatch(cat.products.find(p => p.id === 'weissbier').detail, /alkoholfrei/i);
  for (const id of ['snickers', 'mars', 'hanuta', 'pringles', 'chipsfrisch', 'haribo', 'cornetto']) {
    assert.equal(cat.products.find(p => p.id === id).active, true);
  }
  assert.ok(!cat.products.some(p => p.id === 'red-bull' && p.active));
  assert.equal(cat.products.find(p => p.id === 'koelsch-flasche').color, cat.products.find(p => p.id === 'koelsch').color);
  assert.equal(cat.products.find(p => p.id === 'grillwurst').art, 'grillwurst-brot');
  assert.doesNotMatch(context.TFB.art('wurst-brot', '#B5462F'), /#74452C|#F0C59B/);
  assert.match(context.TFB.art('grillwurst-brot', '#C68C50'), /#74452C/);
  assert.match(context.TFB.art('aperol', '#F27736'), /SPRITZ/);
  for (const product of cat.products) {
    assert.ok(context.TFB.artKinds.some(([key]) => key === product.art), product.art);
    assert.doesNotMatch(context.TFB.art(product.art, product.color), /undefined|NaN/);
  }
});

test('playing fees and section migration preserve prices and history, and tally separately', async () => {
  const { context, storage } = setup();
  const key = 'tfb_kiosk_demo_v1';
  const db = JSON.parse(storage.get(key));
  db.catalogVersion = 12;
  db.catalog.sections = db.catalog.sections.filter(s => !['spezialitaeten', 'spielbetrieb'].includes(s.id));
  db.catalog.sections.find(s => s.id === 'snacks').title = 'Spezialitäten';
  db.catalog.products = db.catalog.products.filter(p => !['flutlicht', 'gastspieler'].includes(p.id));
  for (const p of db.catalog.products.filter(p => ['bockwurst', 'grillwurst', 'grillfleisch'].includes(p.id))) p.section = 'snacks';
  db.catalog.products.find(p => p.id === 'bockwurst').price = 270;
  const history = JSON.stringify(db.items);
  storage.set(key, JSON.stringify(db));
  const backend = readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8');
  vm.runInContext(backend, context);
  const changed = JSON.parse(storage.get(key));
  assert.equal(JSON.stringify(changed.items), history);
  assert.equal(changed.catalog.products.find(p => p.id === 'bockwurst').price, 270);
  assert.equal(changed.catalog.products.find(p => p.id === 'bockwurst').section, 'spezialitaeten');
  assert.equal(changed.catalog.products.find(p => p.id === 'cornetto').section, 'snacks');
  const memberId = changed.members.find(m => m.active).id;
  changed.accounts = [{ memberId, consentVersion: context.TFB.config.consentVersion }];
  storage.set('tfb_kiosk_demo_session_v1', memberId);
  changed.items = [];
  changed.catalog.products.find(p => p.id === 'flutlicht').price = 550;
  storage.set(key, JSON.stringify(changed));
  vm.runInContext(backend, context);
  await context.TFB.api.addToTab('flutlicht');
  await context.TFB.api.addToTab('gastspieler');
  await context.TFB.api.addToTab('bockwurst');
  const rows = await context.TFB.api.tally();
  assert.equal(rows[0].cats.spielbetrieb, 2);
  assert.equal(rows[0].cats.snacks, 1);
  assert.equal(rows[0].cats.drinks, undefined);
  assert.equal(JSON.parse(storage.get(key)).catalog.products.find(p => p.id === 'flutlicht').price, 550);
});

test('wine name migration preserves all other data and custom names', () => {
  const { context, storage } = setup();
  const key = 'tfb_kiosk_demo_v1';
  const backend = readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8');
  for (const name of ['Grauburgunder', 'Eigener Wein']) {
    const db = JSON.parse(storage.get(key));
    db.catalogVersion = 11;
    const wine = db.catalog.products.find(p => p.id === 'grauburgunder');
    wine.name = name; wine.price = 1234;
    const expected = { ...wine, name: name === 'Grauburgunder' ? 'Grauburgunder Wein' : name };
    storage.set(key, JSON.stringify(db));
    vm.runInContext(backend, context);
    const updated = JSON.parse(storage.get(key));
    assert.equal(updated.catalogVersion, 13);
    assert.deepEqual(updated.catalog.products.find(p => p.id === 'grauburgunder'), expected);
    assert.deepEqual(updated.items, db.items);
  }
});

test('refined Aperol, apple label and centered FASS preserve the other bottle artwork', () => {
  const { context } = setup();
  const aperol = context.TFB.art('aperol', '#F27736');
  assert.match(aperol, /width="32" height="57"/);
  assert.match(aperol, /#244D87/);
  assert.match(aperol, /#FFD45B/);
  assert.doesNotMatch(aperol, /TO GO/);
  const apple = context.TFB.art('apfelschorle', '#B6CE72');
  const water = context.TFB.art('gerolsteiner', '#A4D6D0');
  assert.equal(apple.match(/<path d="([^"]+)"/)[1], water.match(/<path d="([^"]+)"/)[1]);
  assert.match(apple, /width="20" height="20"/);
  assert.doesNotMatch(apple, /APFEL|#D2202F|#4FBFB0/);
  assert.match(apple, /M32 36c-5-4-9/);
  assert.match(apple, /translate\(32 39\) scale\(\.75\) translate\(-32 -39\)/);
  const cone = context.TFB.art('cone', '#6B3E1E');
  assert.doesNotMatch(cone, /M20 26c4-2|M24 34l14 8/);
  assert.match(cone, /stroke="#B8894C" stroke-width="1.2"/);
  const fass = context.TFB.art('fassbrause', '#B6C85D');
  const ys = [...fass.matchAll(/<text x="32" y="([^"]+)"/g)].map(m => Number(m[1]));
  assert.equal(ys.length, 4);
  assert.equal((ys[0] + ys[3]) / 2, 41);
  assert.match(fass, /dominant-baseline="central"/);
  assert.match(water, /M25.3 49v6/);
});

test('v10 illustration migration leaves custom prices unchanged and runs only once', async () => {
  const { context, storage } = setup();
  const key = 'tfb_kiosk_demo_v1';
  const db = JSON.parse(storage.get(key));
  db.catalogVersion = 10;
  const koelsch = db.catalog.products.find(p => p.id === 'koelsch-flasche');
  koelsch.color = '#7A4A1E'; koelsch.price = 235;
  const history = JSON.stringify(db.items);
  storage.set(key, JSON.stringify(db));
  const backend = readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8');
  vm.runInContext(backend, context);
  const changed = JSON.parse(storage.get(key));
  assert.equal(changed.catalogVersion, 13);
  assert.equal(changed.catalog.products.find(p => p.id === 'koelsch-flasche').price, 235);
  assert.equal(changed.catalog.products.find(p => p.id === 'koelsch-flasche').color, '#E9B949');
  assert.equal(JSON.stringify(changed.items), history);
  changed.catalog.products.find(p => p.id === 'koelsch-flasche').color = '#ABCDEF';
  storage.set(key, JSON.stringify(changed));
  vm.runInContext(backend, context);
  assert.equal(JSON.parse(storage.get(key)).catalog.products.find(p => p.id === 'koelsch-flasche').color, '#ABCDEF');
});

test('v9 migration preserves booking prices, custom snack/shop data and subsequent administrator edits', async () => {
  const { context, storage } = setup();
  const key = 'tfb_kiosk_demo_v1';
  const db = JSON.parse(storage.get(key));
  db.catalogVersion = 9;
  db.catalog.products = db.catalog.products.filter(p => !['apfelschorle', 'fassbrause', 'aperol', 'grauburgunder', 'grillwurst', 'grillfleisch', 'koelsch-flasche'].includes(p.id));
  db.catalog.products.find(p => p.id === 'coca-cola').price = 280;
  db.catalog.products.find(p => p.id === 'snickers').price = 177;
  db.catalog.products.find(p => p.id === 'shirt').detail = 'Custom shirt';
  db.catalog.products.push({id:'red-bull',section:'alkoholfrei',name:'Red Bull',price:200,active:true});
  db.items.push({id:'old-cola',productId:'coca-cola',priceCents:280,name:'Old cola'});
  const history = JSON.stringify(db.items);
  storage.set(key, JSON.stringify(db));
  const backend = readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8');
  vm.runInContext(backend, context);
  const updated = JSON.parse(storage.get(key));
  assert.equal(updated.catalogVersion, 13);
  assert.equal(JSON.stringify(updated.items), history);
  assert.equal(updated.catalog.products.find(p => p.id === 'coca-cola').price, 150);
  assert.equal(updated.catalog.products.find(p => p.id === 'red-bull').active, false);
  assert.equal(updated.catalog.products.find(p => p.id === 'snickers').price, 177);
  assert.equal(updated.catalog.products.find(p => p.id === 'shirt').detail, 'Custom shirt');
  updated.catalog.products.find(p => p.id === 'coca-cola').price = 155;
  storage.set(key, JSON.stringify(updated));
  vm.runInContext(backend, context);
  assert.equal(JSON.parse(storage.get(key)).catalog.products.find(p => p.id === 'coca-cola').price, 155);
});
