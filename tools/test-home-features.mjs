import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto, createHash } from 'node:crypto';
import vm from 'node:vm';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
async function setup() {
  const storage = new Map();
  const context = { console, crypto: webcrypto, TextEncoder, setTimeout, clearTimeout,
    location: { hash: '#home' }, addEventListener() {},
    document: { addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, body: {} },
    MutationObserver: class { observe() {} },
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) } };
  context.window = context;
  vm.createContext(context);
  for (const path of ['assets/js/config.js', 'assets/data/legal-pages.js', 'assets/data/site-seed.js', 'assets/js/photo-frame.js', 'assets/js/demo-backend.js']) {
    if (path === 'assets/js/demo-backend.js') context.TFB.siteSeed.pages.home.blocks.forEach(b => { b.image = 'assets/images/board/kai-eichmann.jpg'; });
    vm.runInContext(readFileSync(new URL(path, root), 'utf8'), context);
  }
  storage.set('tfb_kiosk_demo_session_v1', 'm-demo');
  const db = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  if (!db.accounts.some(a => a.memberId === 'm-demo')) db.accounts.push({memberId: 'm-demo'});
  storage.set('tfb_kiosk_demo_v1', JSON.stringify(db));
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  const api = context.TFB.api;
  api.images = async () => ({});
  context.TFB.art = () => '<svg></svg>';
  const opened = [];
  context.TFB.ui = { api, state: { member: { isAdmin: true } }, icon: new Proxy({}, { get: () => '<svg></svg>' }),
    esc: value => String(value ?? '').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'),
    partnerSlot: () => '', viewHead: () => '', toast() {}, renderView() {}, openLightbox: (...args) => opened.push(args), openSheet: html => opened.push(html) };
  vm.runInContext(readFileSync(new URL('assets/js/site.js', root), 'utf8'), context);
  return { context, api, opened, storage };
}

test('community starts empty and removes only former example posts on every reload', async () => {
  const { context, storage } = await setup();
  const key = 'tfb_kiosk_demo_v1';
  const db = JSON.parse(storage.get(key));
  assert.deepEqual(db.community.posts, []);
  const ownPosts = [
    { id: 'p-user-club', scope: 'club', authorId: 'm-demo', text: 'Unser Clubabend', images: ['img:own-photo'] },
    { id: 'p-user-team', scope: 'team:herren-40-1', authorId: 'm2', text: 'Eigene Mannschaftsnachricht', images: [] },
  ];
  const seedIds = ['p-s1', 'p-s2', 'p-s3', 'p-s4', 'p-t1', 'p-t2', 'p-t3'];
  db.community.posts = [...ownPosts, ...seedIds.map(id => ({ id, text: 'Alter Beispielbeitrag', images: [] }))];
  storage.set(key, JSON.stringify(db));
  storage.set('unrelated-photo-store', 'original-photo-data');
  const backend = readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8');
  vm.runInContext(backend, context);
  const cleaned = JSON.parse(storage.get(key));
  assert.deepEqual(cleaned.community.posts, ownPosts);
  assert.deepEqual(cleaned.community.rosters, db.community.rosters);
  assert.equal(storage.get('unrelated-photo-store'), 'original-photo-data');
  vm.runInContext(backend, context);
  assert.deepEqual(JSON.parse(storage.get(key)).community.posts, ownPosts);
  cleaned.community.posts.push({ id: 'p-s1', text: 'Aus altem Backup' });
  storage.set(key, JSON.stringify(cleaned));
  vm.runInContext(backend, context);
  assert.deepEqual(JSON.parse(storage.get(key)).community.posts, ownPosts);
});

test('home preserves Padel detail, links Kiosk directly and removes example notice', async () => {
  const { context } = await setup();
  const html = await context.TFB.views.home();
  const kiosk = html.match(/<article[^>]+data-feature="h-kiosk"[\s\S]*?<\/article>/)[0];
  assert.match(kiosk, /class="feature-hit" href="#kiosk"/);
  assert.doesNotMatch(kiosk, /Mehr erfahren|href="#home\/h-kiosk"/);
  assert.match(html, /href="#home\/h-padel"/);
  assert.match(html, /href="#home\/h-50\/fotos"/);
  assert.doesNotMatch(html, /Vorführversion/);
});

test('sample news cleanup preserves curated copy, photos and training dates on reload', async () => {
  const { context, storage, api } = await setup();
  const key = 'tfb_kiosk_demo_v1';
  const db = JSON.parse(storage.get(key));
  const samples = context.TFB.siteSeed.pages.aktuell.blocks.filter(b => b.type === 'post');
  db.site.pages.home.blocks.push(...JSON.parse(JSON.stringify(samples)));
  db.site.pages.home.blocks.find(b => b.id === 'p-2').image = 'img:my-photo';
  db.site.pages.home.blocks.find(b => b.id === 'p-3').text = 'Meine eigene Meldung';
  db.site.pages.home.blocks.find(b => b.id === 'h-kiosk').image = null;
  db.site.pages.sport.blocks.find(b => b.id === 's-schnupper-dates').text = '17. Oktober, 11 Uhr, Tennisanlage';
  storage.set(key, JSON.stringify(db));
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  const saved = await context.TFB.api.site();
  assert.ok(!saved.pages.home.blocks.some(b => b.id === 'p-1'));
  assert.ok(!saved.pages.home.blocks.some(b => b.id === 'h-kiosk'));
  assert.ok(saved.pages.home.blocks.some(b => b.id === 'h-padel'));
  assert.equal(saved.pages.home.blocks.find(b => b.id === 'p-2').image, 'img:my-photo');
  assert.equal(saved.pages.home.blocks.find(b => b.id === 'p-3').text, 'Meine eigene Meldung');
  assert.equal(saved.pages.sport.blocks.find(b => b.id === 's-schnupper-dates').text, '17. Oktober, 11 Uhr, Tennisanlage');
});

test('news collages persist 100 photos, preview five and open full collage before individual photos', async () => {
  const { context, api } = await setup();
  const site = await api.site();
  const refs = Array(100).fill('assets/images/board/kai-eichmann.jpg');
  site.pages.home.blocks[0].images = refs;
  site.pages.aktuell.blocks.push({id:'own-news',type:'post',date:'2026-10-11',title:'Unsere Fotos',text:'Unser Fest',images:refs});
  await api.saveSite(site);
  const home = await context.TFB.views.home();
  assert.match(home, /news-collage/);
  assert.match(home, /\+95/);
  const html = await context.TFB.views.aktuell();
  assert.equal((html.match(/data-action="news-gallery"/g) || []).length, 4);   // Aktuell-Beitrag: höchstens 4 Fotos, Rest als „+N“
  assert.match(html, /\+96/);
  const handlers = {};
  const box = {innerHTML:'',classList:{add(){},remove(){}},addEventListener:(name,handler)=>{handlers[name]=handler;},remove(){}};
  context.document.createElement = () => box;
  context.document.body = {appendChild(){},classList:{add(){},remove(){}}};
  context.document.removeEventListener = () => {};
  context.requestAnimationFrame = fn => fn();
  context.TFB.actions['news-gallery']({dataset:{block:'own-news'}});
  assert.match(box.innerHTML, /collage gal-album collage-5/);
  assert.equal((box.innerHTML.match(/data-gi=/g) || []).length, 100);
  assert.doesNotMatch(box.innerHTML, /data-gstep/);
  handlers.click({target:{closest: selector => selector === '[data-gi]' ? {dataset:{gi:'99'}} : null}});
  assert.match(box.innerHTML, /100 \/ 100/);
  assert.match(box.innerHTML, /data-gstep/);
  site.pages.home.blocks[0].images.push(refs[0]);
  await assert.rejects(api.saveSite(site), /100 Bilder/);
});

test('photo frames clamp geometry, persist without changing image sources and restore original', async () => {
  const { context, api, storage } = await setup();
  const framing = context.TFB.photoFrame;
  assert.equal(framing.normalize({format:'unsafe'}), null);
  assert.equal(framing.normalize({format:'toString'}), null);
  assert.deepEqual(JSON.parse(JSON.stringify(framing.normalize({format:'square',zoom:99,x:-9,y:9}))), {format:'square',zoom:4,x:0,y:1});
  for (const format of ['portrait','landscape','square']) {
    for (const dimensions of [[800,1600],[1600,800]]) {
      const g = framing.geometry(...dimensions, 300, format, 1);
      assert.ok(g.excessX >= 0 && g.excessY >= 0);
      assert.equal(g.width, 300);
    }
  }
  const ref = 'assets/images/leon-kaufmann.jpg';
  const before = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  await api.setPhotoFrame(ref, {format:'square',zoom:1.8,x:.25,y:.2});
  context.location.hash = '#sport/training';
  const html = await context.TFB.views.sport();
  assert.match(html, /photo-frame active/);
  assert.match(html, /--photo-ratio:1;--photo-zoom:1.8;--photo-x:25%;--photo-y:20%/);
  assert.match(html, /src="assets\/images\/leon-kaufmann.jpg"/);
  assert.deepEqual(JSON.parse(storage.get('tfb_kiosk_demo_v1')).site.pages, before.site.pages);
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  assert.equal((await context.TFB.api.site()).photoFrames[ref].zoom, 1.8);
  await context.TFB.api.setPhotoFrame(ref, null);
  assert.equal((await context.TFB.api.site()).photoFrames[ref], undefined);
  await assert.rejects(context.TFB.api.setPhotoFrame('https://other.invalid/image.jpg', {format:'square'}));
  storage.delete('tfb_kiosk_demo_session_v1');
  await assert.rejects(context.TFB.api.setPhotoFrame(ref, {format:'square'}));
});

test('legal pages preserve all supplied statute wording, register data and subsequent admin edits', async () => {
  const { context, api, storage } = await setup();
  const site = await api.site();
  const statutes = site.pages.satzung;
  assert.equal(statutes.blocks.length, 17);
  const reconstructed = ['Satzung der Tennisfreunde Bielstein e.V.', ...statutes.blocks.flatMap(b => [b.title, b.text]), 'Stand 20.03.2015']
    .join('\n').replace(/§\s*(\d+)/g, '§$1').replace(/\s+/g, ' ').trim();
  assert.equal(createHash('sha256').update(reconstructed).digest('hex'), 'e323a84997b389bfaddedc77376083e0b187a561c0b43c082d3553ac094f5635');
  context.location.hash = '#satzung';
  const html = await context.TFB.views.satzung();
  assert.match(html, /legal-document/);
  assert.match(html, /Stand 20.03.2015/);
  assert.doesNotMatch(html, /run-texts/);
  context.location.hash = '#impressum';
  const imprint = await context.TFB.views.impressum();
  assert.match(imprint, /Amtsgerichts Köln/);
  assert.match(imprint, /VR 600693/);
  assert.match(imprint, /Kai Eichmann/);
  assert.doesNotMatch(imprint, /Jens Kämper|noch zu ergänzen|Entwurf/);
  site.pages.impressum.blocks[0].text = 'Eigener Kontakttext';
  await api.saveSite(site);
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  assert.equal(JSON.parse(storage.get('tfb_kiosk_demo_v1')).site.pages.impressum.blocks[0].text, 'Eigener Kontakttext');
  const app = readFileSync(new URL('assets/js/app.js', root), 'utf8');
  assert.match(app, /<footer class="site-footer">/);
  assert.match(app, /href="#impressum"/);
  assert.match(app, /href="#satzung"/);
});

test('Sport separates teams and editable training, imports trainer and preserves later edits', async () => {
  const { context, api, storage } = await setup();
  context.location.hash = '#sport';
  const teams = await context.TFB.views.sport();
  assert.match(teams, /href="#sport\/training"/);
  assert.doesNotMatch(teams, /training-coach|kostenloses Schnuppertraining/);
  context.location.hash = '#sport/training';
  const training = await context.TFB.views.sport();
  assert.match(training, /training-coach/);
  assert.match(training, /Leon Kaufmann/);
  assert.match(training, /assets\/images\/leon-kaufmann.jpg/);
  assert.match(training, /href="tel:017676731093"/);
  assert.match(training, /mailto:leonkaufmann2002@icloud.com/);
  assert.match(training, /kostenloses Schnuppertraining/);
  assert.doesNotMatch(training, /kalender\//);
  assert.doesNotMatch(training, /Bitte schaut in unseren Kalender/);
  assert.match(training, /Termine für Schnuppertraining demnächst/);
  assert.doesNotMatch(training, /team-news-btn/);
  assert.match(training, /data-page="sport"/);
  const site = await api.site();
  site.pages.sport.blocks.find(b => b.id === 's-training').text = 'Eigener Trainertext';
  await api.saveSite(site);
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  assert.equal(JSON.parse(storage.get('tfb_kiosk_demo_v1')).site.pages.sport.blocks.find(b => b.id === 's-training').text, 'Eigener Trainertext');
  const db = JSON.parse(storage.get('tfb_kiosk_demo_v1'));
  db.site.applied = db.site.applied.filter(id => id !== 'sport-trainer-2026-10-11');
  storage.set('tfb_kiosk_demo_v1', JSON.stringify(db));
  vm.runInContext(readFileSync(new URL('assets/js/demo-backend.js', root), 'utf8'), context);
  assert.equal(JSON.parse(storage.get('tfb_kiosk_demo_v1')).site.pages.sport.blocks.find(b => b.id === 's-training').text, 'Eigener Trainertext');
});

test('Aktuell separates news and dates, Chat preserves latest-first feed and searchable overview', async () => {
  const { context, api } = await setup();
  await api.acceptFeedRules();
  const post = await api.addPost({scope:'club',text:'Der neueste Chat',images:[]});
  context.location.hash = '#aktuell';
  const news = await context.TFB.views.aktuell();
  assert.match(news, /page-grid news-dates show-news/);
  assert.doesNotMatch(news, /class="feed"|Clubgeflüster|Der neueste Chat/);
  assert.match(news, /Save the Date/);
  context.location.hash = '#chat';
  const chat = await context.TFB.views.chat();
  assert.match(chat, /<h1>Clubgeflüster<\/h1>/);
  assert.match(chat, /href="#chat\/alle"/);
  assert.match(chat, /data-action="post-new"/);
  const first = chat.match(/data-post="([^"]+)"/)[1];
  assert.equal(first, post.id);
  context.location.hash = '#chat/alle';
  const all = await context.TFB.views.chat();
  assert.match(all, /Alle Beiträge/);
  assert.match(all, /href="#chat"/);
  assert.match(all, /ov-filters/);
  context.location.hash = '#gefluester';
  assert.match(await context.TFB.views.gefluester(), /Alle Beiträge/);
  const app = readFileSync(new URL('assets/js/app.js', root), 'utf8');
  assert.match(app, /\{ id: 'kiosk', label: 'Kiosk'[^}]+\}, \{ id: 'chat', label: 'Chat'[^}]+\},\s*\{ id: 'aktuell'/);   // Standard-Menü: Kiosk · Chat · Aktuell
});

test('club offers contributions before admission and opens the complete annual fee overview', async () => {
  const { context, opened } = await setup();
  context.location.hash = '#club';
  const html = await context.TFB.views.club();
  assert.ok(html.indexOf('data-action="membership-fees"') < html.indexOf('data-action="membership-open"'));
  assert.match(html, /membership-fees-button/);
  assert.match(html, /membership-apply-button/);
  context.TFB.actions['membership-fees']();
  const modal = opened[0];
  for (const price of ['36,00 €', '60,00 €', '75,00 €', '189,00 €', '129,00 €', '50,00 €', '95,00 €']) assert.ok(modal.includes(price));
  assert.match(modal, /Kinder bis 6 Jahre/);
  assert.match(modal, /Beitragsfrei/);
  assert.match(modal, /dritte Kind.*Volljährigkeit/);
  assert.match(modal, /1\. Januar/);
  assert.match(modal, /pro Kalenderjahr/);
});

test('chat text editor persists all page labels, escapes text and keeps community posts untouched', async () => {
  const {context, api, opened} = await setup();
  const beforePosts = JSON.stringify(await api.posts('club',{withTeams:true}));
  context.location.hash = '#chat';
  assert.match(await context.TFB.views.chat(), /data-action="chat-text-edit"/);
  const values = {...context.TFB.siteSeed.chatText, title:'Unser Austausch', feedTitle:'Clubgespräche',
    feedIntro:'<script>kein HTML</script>', overviewTitle:'Alles aus dem Club', searchPlaceholder:'Suchen',
    photosOnly:'Fotobeiträge', overviewIntro:''};
  let submit;
  const form = {elements:Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{value:v}])),
    addEventListener: (_, fn) => {submit=fn;}, querySelector: () => ({disabled:false,textContent:''})};
  context.document.querySelector = () => form;
  context.TFB.ui.closeSheet = () => {};
  await context.TFB.actions['chat-text-edit']();
  assert.match(opened[0], /Filter und Beschriftungen/);
  await submit({preventDefault(){}});
  assert.equal((await api.site()).chatText.feedTitle, 'Clubgespräche');
  await context.TFB.refreshSite();
  const chat = await context.TFB.views.chat();
  assert.match(chat, /<h1>Clubgespräche<\/h1>/);
  assert.match(chat, /&lt;script>/);
  assert.doesNotMatch(chat, /<script>/);
  context.location.hash = '#chat/alle';
  const overview = await context.TFB.views.chat();
  assert.match(overview, /Alles aus dem Club/);
  assert.match(overview, /placeholder="Suchen"/);
  assert.match(overview, /Fotobeiträge/);
  assert.equal(JSON.stringify(await api.posts('club',{withTeams:true})),beforePosts);
  context.TFB.ui.state.member = null;
  assert.doesNotMatch(await context.TFB.views.chat(), /data-action="chat-text-edit"/);
});

test('club discount note persists edits and can be removed', async () => {
  const { context, api } = await setup();
  const site = await api.site();
  const button = site.pages.verein.blocks.find(b => b.id === 'v-mitglied-btn');
  assert.match(button.note, /10 Prozent Rabatt auf alle Padel-Buchungen/);
  button.note = 'Unser Mitgliedervorteil';
  await api.saveSite(site);
  let html = await context.TFB.views.club();
  assert.match(html, /membership-benefit">Unser Mitgliedervorteil/);
  button.note = '';
  await api.saveSite(site);
  await context.TFB.refreshSite();
  html = await context.TFB.views.club();
  assert.doesNotMatch(html, /membership-benefit/);
});

test('club and team posts preserve six photos on creation and edit, reject seven and render collages', async () => {
  const { context, api } = await setup();
  await api.acceptFeedRules();
  const refs = Array.from({length: 6}, (_, i) => `assets/images/board/test-${i}.jpg`);
  for (const scope of ['club', 'team:herren-55-1']) {
    const post = await api.addPost({scope, text: 'Fotos', images: refs});
    assert.equal(post.images.length, 6);
    const edited = await api.editPost(post.id, {text:'Neu', images: refs.toReversed()});
    assert.equal(edited.images.length, 6);
    assert.equal(edited.images[0], refs[5]);
    await assert.rejects(api.addPost({scope, text: 'Zu viele', images: [...refs, refs[0]]}), /6 Fotos/);
    await assert.rejects(api.editPost(post.id, {text: 'Zu viele', images: [...refs, refs[0]]}), /6 Fotos/);
  }
  const html = await context.TFB.views.gefluester();
  assert.match(html, /message-collage n6/);
  assert.ok((html.match(/class="message-photo"/g) || []).length >= 12);
});

test('gallery accepts 100 photos, rejects 101 and opens each original', async () => {
  const { context, api, opened } = await setup();
  const site = await api.site();
  const block = site.pages.home.blocks.find(b => b.id === 'h-50');
  block.album.images = Array(100).fill('assets/images/board/thomas-heine.jpg');
  await api.saveSite(site);
  block.album.images.push('assets/images/board/kai-eichmann.jpg');
  await assert.rejects(api.saveSite(site), /100 Bilder/);
  context.location.hash = '#home/h-50/fotos';
  const html = await context.TFB.views.home();
  assert.equal((html.match(/class="collage-item"/g) || []).length, 100);
  assert.doesNotMatch(html, /feature-text|Den Club kennenlernen/);
  // Kollage öffnet die blätterbare Galerie direkt beim angeklickten Foto
  const box = {innerHTML:'', classList:{add(){},remove(){}}, addEventListener(){}, remove(){}};
  context.document.createElement = () => box;
  context.document.body = {appendChild(){}, classList:{add(){},remove(){}}};
  context.document.addEventListener = () => {};
  context.document.removeEventListener = () => {};
  context.requestAnimationFrame = fn => fn();
  context.TFB.actions['collage-open']({ dataset: { block: 'album-h-50', index: '99' } });
  assert.match(box.innerHTML, /100 \/ 100/);
  assert.match(box.innerHTML, /data-gstep/);
  assert.match(box.innerHTML, /thomas-heine\.jpg/);
});

test('chat gallery opens the whole collage, then supports clicks, arrows and swipes without double advancing', async () => {
  const { context, api } = await setup();
  await api.acceptFeedRules();
  const post = await api.addPost({scope:'club', text:'Galerie', images:Array(6).fill('assets/images/board/kai-eichmann.jpg')});
  await context.TFB.views.gefluester();
  const handlers = {};
  const box = {innerHTML:'', classList:{add(){},remove(){}}, addEventListener:(name, handler)=>{handlers[name]=handler;}, remove(){}};
  context.document.createElement = () => box;
  context.document.body = {appendChild(){}, classList:{add(){},remove(){}}};
  context.document.removeEventListener = () => {};
  context.requestAnimationFrame = fn => fn();
  context.TFB.actions['post-gallery']({dataset:{id:post.id,index:'5'}});
  assert.match(box.innerHTML, /gal-collage message-collage n6/);
  assert.doesNotMatch(box.innerHTML, /data-gstep/);
  const target = selectors => ({closest: selector => selectors[selector] || null});
  handlers.click({target:target({'[data-gi]':{dataset:{gi:'0'}}})});
  assert.match(box.innerHTML, /1 \/ 6/);
  assert.match(box.innerHTML, /data-gstep/);
  handlers.click({target:target({'.gal-single':{}})});
  assert.match(box.innerHTML, /2 \/ 6/);
  handlers.click({target:target({'[data-gstep]':{dataset:{gstep:'-1'}}})});
  assert.match(box.innerHTML, /1 \/ 6/);
  const stage = target({'.viewer-stage':{}});
  handlers.touchstart({target:stage,touches:[{clientX:200,clientY:100}]});
  handlers.touchend({changedTouches:[{clientX:80,clientY:105}]});
  assert.match(box.innerHTML, /2 \/ 6/);
  handlers.click({target:target({'.viewer-stage':{},'.gal-single':{}}),preventDefault(){}});
  assert.match(box.innerHTML, /2 \/ 6/);
  handlers.touchstart({target:stage,touches:[{clientX:80,clientY:100}]});
  handlers.touchend({changedTouches:[{clientX:200,clientY:105}]});
  assert.match(box.innerHTML, /1 \/ 6/);
  handlers.touchstart({target:stage,touches:[{clientX:80,clientY:100}]});
  handlers.touchend({changedTouches:[{clientX:140,clientY:250}]});
  assert.match(box.innerHTML, /1 \/ 6/);
});

test('detail link may be hidden independently and external targets retain safe new tabs', async () => {
  const { context, api } = await setup();
  const site = await api.site();
  const padel = site.pages.home.blocks.find(b => b.id === 'h-padel');
  padel.showMore = false;
  const kiosk = site.pages.home.blocks.find(b => b.id === 'h-kiosk');
  kiosk.link.url = 'https://example.org/club';
  kiosk.link.icon = 'camera';
  await api.saveSite(site);
  const html = await context.TFB.views.home();
  const section = html.match(/<article[^>]+data-feature="h-padel"[\s\S]*?<\/article>/)[0];
  assert.match(section, /href="#home\/h-padel"/);
  assert.doesNotMatch(section, /Mehr erfahren/);
  assert.match(html, /href="https:\/\/example.org\/club" target="_blank" rel="noopener"/);
});

test('gallery and main links can be reordered and positioned independently', async () => {
  const { context, api } = await setup();
  await context.TFB.views.home();
  await context.TFB.actions['link-order']({ dataset: { block: 'h-50', link: 'album' } });
  let html = await context.TFB.views.home();
  assert.ok(html.indexOf('Fotos der Veranstaltung') < html.indexOf('Den Club kennenlernen'));
  await context.TFB.actions['link-move']({ dataset: { block: 'h-50', link: 'album', slot: 'left' } });
  const saved = (await api.site()).pages.home.blocks.find(b => b.id === 'h-50');
  assert.equal(saved.album.position, 'left');
  assert.equal(saved.link.position || 'right', 'right');
});
