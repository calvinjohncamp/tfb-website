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
 for (const [format, size] of [['2x1',200],['3x1',300],['4x1',400]]) {
   await page.route('**/assets/tests/' + format + '.svg', route => route.fulfill({contentType:'image/svg+xml',
     body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="100"><rect width="100%" height="100%" fill="gold"/></svg>`}));
 }
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
 const dismissByBackdrop = async (viewer, x = 14, y = 100) => {
   await viewer.waitFor();
   await page.mouse.click(x,y);
   await viewer.waitFor({state:'detached'});
 };
 await page.locator('[data-feature="topic"] [data-action=home-photo-gallery]').click();
 const photoViewer = page.locator('.viewer.gallery.open');
 const {x, y} = await photoViewer.locator('.gal-single').evaluate(button => {
   const buttonBox = button.getBoundingClientRect(), image = button.querySelector('img').getBoundingClientRect();
   if (image.left - buttonBox.left < 15) throw Error('Expected space beside the image');
   return {x:buttonBox.left + 5, y:(image.top + image.bottom) / 2};
 });
 await dismissByBackdrop(photoViewer, x, y);
 await page.locator('[data-feature="legacy"] .hm-zoom-button').click();
 await dismissByBackdrop(page.locator('.hm-zoom-dialog'));
 await editHome();
 for (const width of [1920,1440,1000,901,900,390,320]) {
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   const aligned = await form.locator('li').evaluateAll(rows => {
     const lefts = selector => new Set(rows.map(row => row.querySelector(selector).getBoundingClientRect().left));
     return lefts('[data-order-position]').size === 1 && lefts('[data-action=home-order-step]').size === 1;
   });
   assert.ok(aligned, 'Position and arrow columns align on every row');
   const arrowPlacement = await form.locator('li').evaluateAll((rows, desktop) => rows.every(row => {
     const bounds = selector => row.querySelector(selector).getBoundingClientRect();
     const info = bounds('.home-order-info'), tools = bounds('[data-action=block-edit]');
     const up = bounds('[data-dir="-1"]'), down = bounds('[data-dir="1"]');
     const center = (up.left + down.right) / 2;
     return up.right < down.left && down.right <= row.getBoundingClientRect().right &&
       (!desktop || (down.right < tools.left && Math.abs(center - (info.right + tools.left) / 2) < 1));
   }), width > 900);
   assert.ok(arrowPlacement, 'Arrows have their own space between the title and edit actions');
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
 const sub = editor.locator('[data-panel=sub]');
 const addDetailLink = sub.getByRole('button', {name:'Link hinzufügen'});
 await addDetailLink.click();
 await sub.locator('[data-linkfor=detailLink0][data-linkkind=app]').click();
 await sub.locator('[name=detailLink0App]').selectOption('#club');
 await sub.locator('[name=detailLink0Label]').fill('Zum Club');
 await addDetailLink.click();
 await sub.locator('[name=detailLink1Url]').fill('https://example.net/extern');
 await sub.locator('[name=detailLink1Label]').fill('Externer Detaillink');
 await addDetailLink.click();
 await sub.locator('[data-detail-link-remove="2"]').click();
 await sub.locator('[data-heroratio="3"]').click();
 await upload('[data-more-input]');
 await sub.locator('[data-collagestyle=original]').click();
 await sub.locator('[name=detailPhotoDisplay]').selectOption('gallery');
 await page.locator('.story .gallery-grid .gallery-item').first().waitFor();
 await sub.locator('[name=detailPhotoDisplay]').selectOption('carousel');
 await page.locator('.story .cs-carousel').waitFor();
 assert.equal(await sub.locator('[name=detailAnimationStart]').isChecked(), false);
 assert.equal(await sub.getByText(/freiwillig/).count(), 0);
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
 assert.equal(topic.more.heroRatio,'3');
 assert.equal(topic.more.original,true);
 assert.equal(topic.more.photoDisplay,'carousel');
 assert.equal(topic.more.images.length,2);
 assert.deepEqual(topic.more.links.map(l=>[l.url,l.label]), [['#club','Zum Club'],['https://example.net/extern','Externer Detaillink']]);
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
 const detailLinks = page.locator('.story-detail-links');
 assert.equal(await detailLinks.getByRole('link',{name:'Zum Club'}).getAttribute('href'), '#club');
 assert.equal(await detailLinks.getByRole('link',{name:'Externer Detaillink'}).getAttribute('target'), '_blank');
 const articleCarousel = page.locator('.story .cs-carousel');
 await articleCarousel.locator('[data-cs-published-page]:not([hidden]) [data-cs-published-full]').first().click();
 await dismissByBackdrop(page.locator('.cs-viewer'));
 await page.getByRole('link',{name:'Fotos der Veranstaltung'}).click();
 await page.locator('.album-page .gallery-grid').waitFor();
 await page.goto(origin+'/?tfbPresentation=1#home');
 await page.locator('[data-photo-module="' + photo.id + '"]').waitFor();
 for (const mode of ['gallery', 'legacy-collage']) {
   await page.evaluate(async ({mode,image}) => {
     const site = await TFB.api.site();
     site.pages.home.blocks.push({
       id:'detail-' + mode, type:'feature', title:mode, image, more:{
         text:'Fotos unter dem Text', images:[image,image,image],
         ...(mode === 'gallery' ? {photoDisplay:'gallery'} : {original:true}),
       },
     });
     await TFB.api.saveSite(site);
     await TFB.refreshSite(true);
   }, {mode,image});
   await page.goto(origin+'/?tfbPresentation=1#home/detail-'+mode);
   const photos = page.locator(mode === 'gallery' ? '.story .gallery-grid' : '.story .collage.natural');
   const second = photos.locator('[data-index="1"]');
   await second.click();
   assert.ok((await photoViewer.locator('.viewer-bar').innerText()).includes('2 / 3'));
   await dismissByBackdrop(photoViewer);
 }
 await page.evaluate(() => location.hash = '#home');
 await page.locator('.story').waitFor({state:'detached'});
 const testCover = async ({ratio, heroCount=1, grid, width}) => {
   await page.setViewportSize({width,height:900});
   await page.evaluate(async ({ratio, heroCount, grid}) => {
     const site = await TFB.api.site();
     site.pages.home.blocks = site.pages.home.blocks.filter(block => block.id !== 'format-test');
     site.pages.home.blocks.push({
       id:'format-test', type:'feature', title:'Kopfbild-Test', image:'assets/tests/2x1.svg',
       images:['assets/tests/2x1.svg'], more: {
         heroMode:'wide', heroRatio:ratio, heroGrid:grid, text:'Test für Kopfbilder',
         ...(heroCount > 1 ? {heroSource:'own', heroImages:['2x1','3x1','4x1','2x1'].map(r=>'assets/tests/'+r+'.svg')} : {}),
       },
     });
     await TFB.api.saveSite(site);
     await TFB.refreshSite(true);
     location.hash = '#home/format-test';
   },{ratio,heroCount,grid});
   const photos = page.locator(heroCount > 1 ? '.topic-hero-grid img' : '.story-topic-cover img');
   await photos.first().waitFor();
   assert.equal(await photos.count(), heroCount);
   const sizes = await photos.evaluateAll(async imgs => Promise.all(imgs.map(async img => {
     await img.decode();
     const rect = img.getBoundingClientRect();
     return {imgRatio:rect.width / rect.height, naturalRatio:img.naturalWidth / img.naturalHeight,
       fit:getComputedStyle(img).objectFit, top:rect.top, width:rect.width,
       articleWidth:img.closest('.story').getBoundingClientRect().width};
   })));
   for (const size of sizes) {
     assert.ok(Math.abs(size.imgRatio - (ratio ? Number(ratio) : grid === 'tiles' ? 1 : size.naturalRatio)) < .04);
     if (ratio) assert.equal(size.fit,'contain');
     if (heroCount === 1) assert.ok(Math.abs(size.width - size.articleWidth) < 1);
   }
   if (heroCount > 1) assert.equal(new Set(sizes.map(size => size.top)).size, width > 639 ? 1 : 2);
   await page.evaluate(() => location.hash = '#home');
   await page.locator('.story-topic-cover, .topic-hero-grid').waitFor({state:'detached'});
 };
 for (const width of [1440,390]) {
   await testCover({width});
   for (const ratio of ['2','3','4']) await testCover({ratio,width});
   for (const grid of ['tiles','original']) await testCover({heroCount:4,grid,width});
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: Home editor, backdrop dismissal, detail photo formats, order, transfer, archive and old links.');
} finally { await browser.close(); }
