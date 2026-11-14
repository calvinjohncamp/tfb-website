import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='https://tfb-newsroom.invalid';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({serviceWorkers:'block',viewport:{width:1440,height:1050}}),errors=[];
 page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin && !(u.origin==='https://joern-kaemper.de' && u.pathname.startsWith('/assets/shared-kiosk/')))return route.abort();const f=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!f.startsWith(root))return route.abort();try{return route.fulfill({body:readFileSync(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf'})[extname(f)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await page.goto(origin+'/?tfbPresentation=1#home');await page.waitForFunction(()=>TFB.ui&&TFB.homeMedia);
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#home';await TFB.ui.renderView('home');});
 if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action="admin-toggle"]').click();


 const image = 'assets/images/board/kai-eichmann.jpg';
 await page.evaluate(async image => {
   const site = await TFB.api.site();
   site.pages.home.blocks = [
     {id:'legacy',type:'feature',title:'Altes Karussell',mediaCollection:{entries:[{id:'entry',title:'Einblick',images:[image,image]}]}},
     {id:'topic',type:'feature',title:'Ein Thema',image},
     {id:'gallery',type:'gallery',title:'Eine Galerie',images:[image,image]},
   ];
   site.pages.aktuell.blocks = [
     {id:'news',type:'post',title:'Anlage',text:'Einblick',date:'2026-11-01',mediaCollection:{entries:[{id:'entry',title:'Anlage',images:[image,image]}]}},
   ];
   await TFB.api.saveSite(site);
   await TFB.refreshSite(true);
 }, image);
 const form = page.locator('[data-home-order]');
 const editor = page.locator('[data-editor=block]');
 const row = id => form.locator('[data-order-id="' + id + '"]');
 const state = () => page.evaluate(() => TFB.api.site());
 const editHome = async () => {
   await page.locator('[data-action=site-edit][data-page=home]').click();
   await form.waitFor();
 };
 const answer = () => page.once('dialog', dialog => dialog.accept());
 const png = Buffer.from(await page.evaluate(() => {
   const canvas = document.createElement('canvas');
   canvas.width = 32; canvas.height = 24;
   canvas.getContext('2d').fillRect(0, 0, 32, 24);
   return canvas.toDataURL().split(',')[1];
 }), 'base64');
 const photos = ['Erstes Foto.png','Zweites Foto.png'].map(name => ({name,mimeType:'image/png',buffer:png}));
 const upload = async selector => {
   const field = editor.locator(selector);
   await field.setInputFiles(photos);
   await field.locator('..').locator('..').locator('.gallery-thumb').last().waitFor();
 };
 await editHome();
 for (const width of [1440,390,320]) {
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   const aligned = await form.locator('li').evaluateAll(rows => {
     const lefts = selector => new Set(rows.map(row => row.querySelector(selector).getBoundingClientRect().left));
     return lefts('[data-order-position]').size === 1 && lefts('[data-action=home-order-step]').size === 1;
   });
   assert.ok(aligned, 'Position and arrow columns align on every row');
   assert.equal(await form.locator('[data-action=home-order-step]').first().textContent(), '');
   assert.equal(await form.locator('[data-action=home-order-remove]').first().textContent(), 'Artikel löschen');
   const menuGap = await page.locator('.nav-card').evaluate(card =>
     card.querySelector('[data-action=nav-edit]').getBoundingClientRect().top -
     card.querySelector('.nav-preview').getBoundingClientRect().bottom);
   assert.ok(menuGap >= 12, 'Menu edit button has breathing room');
 }
 await page.setViewportSize({width:390,height:880});
 await page.getByRole('button',{name:'Neues Thema'}).click();
 await editor.locator('[name=title]').fill('Neuer Beitrag');
 assert.equal(await editor.getByText('Mehr Gestaltung').count(),0);
 await editor.getByRole('button',{name:'Link hinzufügen'}).click();
 await editor.locator('[name=linkUrl]').fill('https://example.org');
 await editor.locator('[name=linkLabel]').fill('Externe Website');
 await editor.locator('[data-linkfor=link2][data-linkkind=app]').click();
 await editor.locator('[name=link2App]').selectOption('#sport');
 await editor.locator('[name=link2Label]').fill('Zum Sport');
 await upload('[data-home-photo-input]');
 await editor.locator('[name=photoDisplay]').selectOption('carousel');
 await editor.getByRole('button',{name:'Unterseite anlegen'}).click();
 const content = editor.locator('[data-panel=sub] [contenteditable=true]').first();
 if (!await content.count()) await editor.locator('[data-panel=sub] [data-secadd=text]').first().click();
 await content.fill('Ausführlicher Inhalt zum Test.');
 await editor.locator('[data-edtab=home]').click();
 await editor.getByRole('button',{name:'Fotoseite anlegen'}).click();
 await editor.locator('[name=albumPhotoDisplay]').selectOption('gallery');
 await upload('[data-album-input]');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 const topic = (await state()).pages.home.blocks[0];
 assert.equal(topic.title,'Neuer Beitrag');
 assert.equal(topic.photoDisplay,'carousel');
 assert.equal(topic.album.photoDisplay,'gallery');
 assert.equal(topic.link2.url,'#sport');
 await row(topic.id).waitFor();
 await page.getByRole('button',{name:'Fotoblock hinzufügen'}).click();
 await page.getByRole('button',{name:/Karussell.*Fotos zum/}).click();
 await upload('[data-gallery-input]');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 const photo = (await state()).pages.home.blocks[0];
 assert.equal(photo.type,'carousel');
 assert.equal(photo.title,'');
 await row(photo.id).waitFor();
 assert.match(await form.locator('li').first().textContent(), /Ohne Überschrift/);
 await row(photo.id).getByRole('button',{name:/Nach unten/}).click();
 await page.waitForFunction(id => document.querySelectorAll('[data-order-id]')[1]?.dataset.orderId === id, photo.id);
 await row('gallery').locator('select').selectOption('0');
 await page.waitForFunction(() => document.querySelector('[data-order-id]').dataset.orderId === 'gallery');
 assert.equal((await state()).pages.home.blocks[0].id,'gallery');
 await row('topic').getByRole('button',{name:/Artikel löschen/}).click();
 assert.ok((await state()).pages.home.blocks.some(b=>b.id==='topic'), 'Dismissed dialog keeps the article');
 answer();
 await row('topic').getByRole('button',{name:/Artikel löschen/}).click();
 await row('topic').waitFor({state:'detached'});
 assert.ok(!(await state()).pages.home.blocks.some(b=>b.id==='topic'));
 assert.equal(await page.getByRole('button',{name:'Fertig'}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Karussell aus Aktuell übernehmen'}).count(),0);

 await row(topic.id).getByRole('button',{name:'Nach Aktuell verschieben'}).click();
 const move = page.locator('[data-home-move]');
 await move.locator('[name=date]').fill('2026-11-14');
 await move.getByRole('button',{name:'Nach Aktuell verschieben'}).click();
 await row(topic.id).waitFor({state:'detached'});
 const moved = (await state()).pages.aktuell.blocks.find(b=>b.id===topic.id);
 assert.equal(moved.type,'post');
 assert.deepEqual(moved.album,topic.album);
 assert.deepEqual(moved.more,topic.more);
 await page.evaluate(() => location.hash = '#aktuell');
 await page.locator('[data-action=site-edit][data-page=aktuell]').first().click();
 const article = page.locator('[data-edit-block="' + topic.id + '"]');
 await article.getByRole('button',{name:'Bearbeiten'}).click();
 await editor.locator('[data-edtab=sub]').click();
 await editor.getByText('Ausführlicher Inhalt zum Test.').first().waitFor();
 await page.locator('.sheet-close').click();
 answer();
 await article.getByRole('button',{name:'Ins Clubarchiv'}).click();
 await article.waitFor({state:'detached'});
 assert.equal((await state()).pages.aktuell.blocks.find(b=>b.id===topic.id).archived,true);
 await page.evaluate(id => location.hash = '#home/' + id,topic.id);
 const archive = page.getByRole('link',{name:'Zum Artikel im Clubarchiv'});
 await archive.click();
 await page.getByRole('heading',{name:'Neuer Beitrag',exact:true}).waitFor();
 await page.getByText('Ausführlicher Inhalt zum Test.').waitFor();
 await page.getByRole('link',{name:'Fotos der Veranstaltung'}).click();
 await page.locator('.album-page .gallery-grid').waitFor();
 await page.goto(origin+'/?tfbPresentation=1#home');
 await page.locator('[data-photo-module="' + photo.id + '"]').waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: Home editor, immediate order and deletion, transfer, archive and old links.');
} finally { await browser.close(); }
