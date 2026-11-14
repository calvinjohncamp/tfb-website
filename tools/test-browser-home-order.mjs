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
 for (const [format, size] of [['2x1',200],['3x1',300],['4x1',400],['1x1',100],['1x2',50]]) {
   await page.route('**/assets/tests/' + format + '.svg', route => route.fulfill({contentType:'image/svg+xml',
     body:`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="100"><rect width="100%" height="100%" fill="gold"/></svg>`}));
 }
 await page.addInitScript(() => localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo'));
 await page.goto(origin+'/?tfbPresentation=1#home');await page.waitForFunction(()=>TFB.ui&&TFB.homeMedia);
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#home';await TFB.ui.renderView('home');});


 const image = 'assets/images/board/kai-eichmann.jpg';
 await page.evaluate(async image => {
   const site = await TFB.api.site();
   site.pages.home.blocks = [
     {id:'legacy',type:'feature',title:'Altes Karussell',mediaCollection:{entries:[{id:'entry',title:'Einblick',images:[image,image]}]}},
     {id:'topic',type:'feature',title:'Ein Thema',image, editorialAuthor:'home-media-admin', navigation:'link', link:{url:'#kiosk',label:'Kiosk besuchen'}, more:{text:'Eigene Unterseite'}},
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
   if (await page.locator('.header-admin-edit').getAttribute('aria-pressed') === 'false') await page.locator('.header-admin-edit').click();
   else if (!await form.count()) await page.locator('[data-action=site-edit][data-page=home]').click();
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
 const firstTitle = page.locator('[data-feature="topic"] a:has(h2)');
 assert.equal(await firstTitle.getAttribute('href'),'#home/topic');
 assert.equal(await page.getByRole('link',{name:'Kiosk besuchen'}).getAttribute('href'),'#kiosk');
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
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, String(width));
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
   assert.equal(await form.locator('[data-action=editorial-delete]').first().textContent(), 'Artikel löschen');
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
 await editor.locator('[name=link2Appearance]').selectOption('symbol');
 await editor.locator('[data-link-symbols=link2]').click();
 await page.getByRole('dialog',{name:'Symbol auswählen'}).getByRole('button',{name:'Sport',exact:true}).click();
 await upload('[data-home-photo-input]');
 await editor.locator('[name=photoDisplay]').selectOption('gallery');
 await editor.getByRole('button',{name:'Unterseite anlegen',exact:true}).click();
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
 await sub.locator('[name=detailLink1Appearance]').selectOption('photo');
 await sub.locator('[data-link-photo=detailLink1]').setInputFiles(photos[0]);
 await sub.locator('[data-link-crop=detailLink1]').click();
 const crop = page.locator('.photo-frame-overlay');
 await crop.locator('[data-frame-zoom]').fill('2');
 await crop.getByRole('button',{name:'Übernehmen'}).click();
 await crop.waitFor({state:'detached'});
 await addDetailLink.click();
 await sub.locator('[data-detail-link-remove="2"]').click();
 await sub.locator('[data-heroratio="3"]').click();
 await upload('[data-more-input]');
 await sub.locator('[data-collagestyle=original]').click();
 await sub.locator('[name=detailPhotoDisplay]').selectOption('gallery');
 await page.locator('.story .gallery-grid .gallery-item').first().waitFor();
 await sub.locator('[name=detailPhotoDisplay]').selectOption('single');
 await page.locator('.story .story-photo-single').waitFor();
 await sub.locator('[name=detailPhotoDisplay]').selectOption('slideshow');
 const slideshow = page.locator('.story').getByRole('region',{name:'Diashow'});
 await slideshow.waitFor();
 await slideshow.getByRole('button',{name:'Bild 2 anzeigen',exact:true}).evaluate(button=>button.click());
 assert.equal(await slideshow.locator('.cs-carousel-status').textContent(),'Bild 2 von 2');
 const active = slideshow.locator('.cs-screen:not([hidden]) .cs-stage');
 await page.waitForFunction(() => document.querySelector('.story .cs-original-slides')?.style.getPropertyValue('--cs-original-ratio') === String(32/24));
 const ratio = await active.evaluate(stage=>stage.clientWidth/stage.clientHeight);
 assert.ok(Math.abs(ratio-32/24)<.02);
 await sub.locator('[name=detailPhotoDisplay]').selectOption('carousel');
 await page.locator('.story .hm-orbit').waitFor();
 assert.equal(await sub.locator('[name=detailAnimationStart]').isChecked(), false);
 assert.equal(await sub.getByText(/freiwillig/).count(), 0);
 await editor.locator('[data-edtab=home]').click();
 await editor.getByRole('button',{name:'Foto-Unterseite anlegen'}).click();
 await editor.locator('[name=albumPhotoDisplay]').selectOption('carousel');
 await editor.locator('[data-panel=album] .sec-add [data-secadd=text]').click();
 const albumText = editor.locator('[data-rich-for=album_sec_0]');
 await albumText.fill('Ein Rückblick in Bildern');
 await albumText.evaluate(el=>getSelection().selectAllChildren(el));
 await editor.locator('[data-panel=album] [data-rich=hervorheben]').click();
 await upload('[data-album-input]');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 const topic = (await state()).pages.home.blocks[0];
 assert.equal(topic.title,'Neuer Beitrag');
 assert.equal(topic.photoDisplay,'gallery');
 assert.equal(topic.album.photoDisplay,'carousel');
 assert.equal(topic.link2.url,'#sport');
 assert.equal(topic.link2.appearance,'symbol');
 assert.equal(topic.link2.icon,'sport');
 assert.equal(topic.more.links[1].appearance,'photo');
 assert.equal(topic.more.links[1].crop.zoom,2);
 assert.equal(topic.more.heroRatio,'3');
 assert.equal(topic.more.original,true);
 assert.equal(topic.more.photoDisplay,'carousel');
 assert.equal(topic.more.images.length,2);
 assert.deepEqual(topic.more.links.map(l=>[l.url,l.label]), [['#club','Zum Club'],['https://example.net/extern','Externer Detaillink']]);
 await row(topic.id).waitFor();
 await page.getByRole('button',{name:'Fotoblock hinzufügen'}).click();
 const photoPicker = page.locator('#sheet-root .type-list');
 assert.deepEqual(await photoPicker.locator('strong').allTextContents(), ['Collage', 'Galerie']);
 await photoPicker.getByRole('button',{name:/Collage/}).click();
 await upload('[data-gallery-input]');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 const photo = (await state()).pages.home.blocks[0];
 assert.equal(photo.type,'collage');
 assert.equal(photo.title,'');
 await row(photo.id).waitFor();
 assert.match(await form.locator('li').first().textContent(), /Ohne Überschrift/);
 await row(photo.id).getByRole('button',{name:/Nach unten/}).click();
 await page.waitForFunction(id => document.querySelectorAll('[data-order-id]')[1]?.dataset.orderId === id, photo.id);
 await row('gallery').locator('select').selectOption('0');
 await page.waitForFunction(() => document.querySelector('[data-order-id]').dataset.orderId === 'gallery');
 assert.equal((await state()).pages.home.blocks[0].id,'gallery');
 await row('topic').getByRole('button',{name:'Bearbeiten'}).click();
 await editor.getByText('Linkziel der Überschrift',{exact:true}).click();
 await editor.locator('[name=titleTarget]').fill('#sport');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 await page.locator('.header-admin-edit').click();
 await firstTitle.waitFor();
 assert.equal(await firstTitle.getAttribute('href'),'#sport');
 await editHome();
 await row('topic').getByRole('button',{name:/Artikel löschen/}).click();
 assert.ok((await state()).pages.home.blocks.some(b=>b.id==='topic'), 'Dismissed dialog keeps the article');
 const confirmDelete = dialog => dialog.accept();
 page.on('dialog',confirmDelete);
 await row('topic').getByRole('button',{name:/Artikel löschen/}).click();
 page.off('dialog',confirmDelete);
 await row('topic').waitFor({state:'detached'});
 assert.ok(!(await state()).pages.home.blocks.some(b=>b.id==='topic'));
 assert.equal(await page.getByRole('button',{name:'Fertig'}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Karussell aus Aktuell übernehmen'}).count(),0);

 await row(topic.id).getByRole('button',{name:'Nach Aktuell verschieben'}).click();
 const move = page.locator('[data-home-move]');
 assert.equal(await move.locator('[name=date]').count(),0);
 assert.equal(await move.locator('time').getAttribute('datetime'),topic.createdOn);
 await move.getByRole('button',{name:'Nach Aktuell verschieben'}).click();
 await row(topic.id).waitFor({state:'detached'});
 const moved = (await state()).pages.aktuell.blocks.find(b=>b.id===topic.id);
 assert.equal(moved.type,'post');
 assert.equal(moved.date,topic.createdOn);
 assert.deepEqual(moved.album,topic.album);
 assert.deepEqual(moved.more,topic.more);
 await page.evaluate(() => location.hash = '#aktuell');
 if (await page.locator('.header-admin-edit').getAttribute('aria-pressed') === 'false') await page.locator('.header-admin-edit').click();
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
 const photoLink=detailLinks.getByRole('link',{name:'Externer Detaillink'});
 assert.equal(await photoLink.locator('.photo-frame').evaluate(el=>el.style.getPropertyValue('--photo-zoom')),'2');
 assert.equal((await photoLink.boundingBox()).height,38);
 assert.equal((await detailLinks.getByRole('link',{name:'Zum Club'}).boundingBox()).height,38);
 const articleCarousel = page.locator('.story .hm-orbit');
 const detailRoute = await page.evaluate(() => location.hash);
 await articleCarousel.locator('.hm-card[data-hm-loaded]').first().click();
 await page.getByRole('dialog',{name:'Karussell in großer Ansicht'}).waitFor();
 assert.equal(await page.evaluate(() => location.hash), detailRoute);
 await page.keyboard.press('Escape');
 await page.getByRole('link',{name:'Fotos der Veranstaltung'}).click();
 await page.locator('.album-page .hm-orbit').waitFor();
 await page.locator('.album-page .tx-highlight').getByText('Ein Rückblick in Bildern').waitFor();
 await page.goto(origin+'/?tfbPresentation=1&view=published#home');
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
 // The same carousel cap applies in each Home editor, including format changes.
 await page.evaluate(async image => {
   const site = await TFB.api.site();
   const photos = Array(16).fill(image);
   site.pages.home.blocks.push({
     id:'carousel-limit', type:'feature', title:'Karussell-Grenze', image, images:photos,
     photoDisplay:'gallery', detailEnabled:true, more:{images:photos,photoDisplay:'gallery'},
     album:{enabled:true,images:photos,photoDisplay:'gallery'},
   });
   const legacy = site.pages.home.blocks.find(block => block.id === 'legacy');
   legacy.mediaCollection.entries[0].images = Array(14).fill(image);
   await TFB.api.saveSite(site);
   await TFB.refreshSite(true);
 }, image);
 await editHome();
 await row('carousel-limit').getByRole('button',{name:'Bearbeiten'}).click();
 assert.equal(await editor.getByRole('button',{name:'Als Karussell anlegen',exact:true}).isDisabled(),true);
 assert.equal(await editor.getByRole('button',{name:'Als Diashow anlegen',exact:true}).isDisabled(),true);
 for(const [tab, name] of [['sub','detailPhotoDisplay'],['album','albumPhotoDisplay']]){
   await editor.locator('[data-edtab="' + tab + '"]').click();
   assert.equal(await editor.locator('[name="' + name + '"] option[value=carousel]').evaluate(option => option.disabled),true,name);
 }
 await page.locator('.sheet-close').click();
 await row('legacy').getByRole('button',{name:'Bearbeiten'}).click();
 const home = editor.locator('[data-panel=home]');
 const subpage = editor.locator('[data-panel=sub]');
 assert.equal(await home.locator('.gallery-thumb').count(),14);
 await home.locator('[data-home-photo-input]').setInputFiles(photos);
 await page.getByText('Höchstens 15 Fotos pro Thema.',{exact:true}).waitFor();
 assert.equal(await home.locator('.gallery-thumb').count(),14);
 await editor.getByRole('tab',{name:'Unterseite',exact:true}).click();
 assert.equal(await subpage.locator('input[type=file]:not([data-link-photo])').count(),0);
 assert.equal(await subpage.locator('[name=sharedTitle0]').inputValue(),'Einblick');
 await editor.getByRole('tab',{name:'Übersicht',exact:true}).click();
 await home.locator('[data-move-list=home][data-move-dir="1"]').first().click();
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 assert.equal((await state()).pages.home.blocks.find(block => block.id === 'legacy').mediaCollection.entries[0].images.length,14);

 // Both media formats are created in the regular topic editor, with the same photo list.
 for (const [mode, title] of [['orbit','Thema mit Karten'],['slideshow','Thema mit Bildfolge']]) {
   await editHome();
   await page.getByRole('button',{name:'Neues Thema'}).click();
   await editor.locator('[name=title]').fill(title);
   await editor.locator('[data-home-photo-mode=' + mode + ']').click();
   await upload('[data-home-photo-input]');
   assert.equal(await home.locator('.gallery-thumb').count(),2);
   assert.equal(await editor.getByText('Format der Diashow', {exact:true}).count(),0);
   assert.equal(await editor.getByRole('tab',{name:'Unterseite',exact:true}).count(),0);
   if (mode === 'orbit') {
     await editor.getByRole('button',{name:'Unterseite anlegen',exact:true}).click();
     await subpage.getByText(/dieselben Fotos/).waitFor();
     assert.equal(await subpage.locator('input[data-hero-input],input[data-more-input]').count(),0);
     await subpage.locator('[data-rich-for=sec_0]').fill('Text zur Diashow');
   } else {
     assert.equal(await editor.getByRole('tab',{name:'Unterseite',exact:true}).count(),0);
     await home.getByRole('checkbox',{name:'Diashow automatisch starten'}).uncheck();
   }
   await editor.locator('[type=submit]').click();
   await editor.waitFor({state:'detached'});
   const item = (await state()).pages.home.blocks[0];
   assert.equal(item.title,title);
   assert.equal(item.type,'feature');
   assert.equal(item.photoDisplay,mode);
   assert.equal(item.images.length,2);
   await page.locator('.header-admin-edit').click();
   const article = page.locator('[data-feature="' + item.id + '"]');
   await article.getByRole('heading',{name:title}).waitFor();
   if (mode === 'orbit') {
     assert.equal(await article.locator('button.hm-card').count(),2);
     const photo = article.locator('.hm-card[data-hm-loaded]').first();
     await photo.click();
     const zoom = page.getByRole('dialog',{name:'Karussell in großer Ansicht'});
     await zoom.waitFor();
     assert.equal(await page.evaluate(() => location.hash), '#home');
     await page.keyboard.press('Escape');
     assert.equal(await photo.evaluate(button => button === document.activeElement), true);
     await article.locator('.feature-more a').click();
     await page.locator('.hm-entry-copy').getByText('Text zur Diashow').waitFor();
     assert.equal(await page.getByRole('region',{name:'Diashow'}).count(),1);
     assert.equal(await page.locator('.hm-entry-gallery [data-cs-published-page]').count(),2);
     await page.getByRole('link',{name:'Zurück zur Startseite'}).click();
     await article.getByRole('link',{name:title,exact:true}).click();
     await page.locator('.hm-entry-copy').getByText('Text zur Diashow').waitFor();
     await page.getByRole('link',{name:'Zurück zur Startseite'}).click();
   } else {
     assert.equal(await article.locator('a:has(h2), .feature-more').count(),0);
     const inline = article.getByRole('region',{name:'Diashow'});
     assert.equal(await inline.locator('[data-cs-published-page]').count(),2);
     await inline.getByRole('button',{name:'Bild 2 anzeigen',exact:true}).click();
     assert.equal(await inline.locator('.cs-carousel-status').textContent(),'Bild 2 von 2');
     await inline.getByRole('button',{name:'Bilder abspielen'}).click();
     await inline.getByRole('button',{name:'Bilder pausieren'}).click();
     assert.equal(await page.evaluate(()=>location.hash),'#home');
   }
 }
 await editHome();
 await page.getByRole('button',{name:'Neues Thema'}).click();
 await editor.locator('[name=title]').fill('Karussell direkt auf Home');
 await editor.getByRole('button',{name:'Als Karussell anlegen'}).click();
 await upload('[data-home-photo-input]');
 await editor.locator('[type=submit]').click();
 await editor.waitFor({state:'detached'});
 const inlineOrbit = (await state()).pages.home.blocks[0];
 assert.equal(inlineOrbit.detailEnabled, undefined);
 await page.locator('.header-admin-edit').click();
 const inlineArticle = page.locator(`[data-feature="${inlineOrbit.id}"]`);
 await inlineArticle.locator('.hm-zoom-button').waitFor();
 assert.equal(await inlineArticle.locator('a.hm-card, .feature-more').count(),0);
 const zoom = page.getByRole('dialog',{name:'Karussell in großer Ansicht'});
 for (const control of [inlineArticle.locator('.hm-card[data-hm-loaded]').first(), inlineArticle.getByRole('button',{name:'Karussell vergrößern',exact:true})]) {
   await control.click();
   await zoom.waitFor();
   assert.equal(await page.evaluate(() => location.hash), '#home');
   await page.keyboard.press('Escape');
 }
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
 const fitPhotos = ['1x1','1x2','2x1'].map(format => 'assets/tests/'+format+'.svg');
 await page.evaluate(async photos => {
   const site = await TFB.api.site();
   site.pages.home.blocks = [
     {id:'mixed-orbit',type:'feature',title:'Gemischtes Karussell',images:photos,photoDisplay:'orbit',
       detailEnabled:true,animationStart:'manual',more:{text:'Gemischte Fotos'}},
     {id:'mixed-slideshow',type:'feature',title:'Gemischte Diashow',images:photos,photoDisplay:'slideshow',
       animationStart:'manual',photoFormat:'9:16'},
     {id:'wide-slideshow',type:'feature',title:'Querformat-Diashow',images:[photos[2],photos[2]],photoDisplay:'slideshow',
       animationStart:'manual',photoFormat:'9:16'},
   ];
   await TFB.api.saveSite(site);
   await TFB.refreshSite(true);
 }, fitPhotos);
 for (const width of [1440,390]) {
   await page.setViewportSize({width,height:950});
   const mixedOrbit = page.locator('[data-feature=mixed-orbit] [data-hm-orbit]');
   await mixedOrbit.scrollIntoViewIfNeeded();
   await page.waitForFunction(() => document.querySelectorAll('[data-feature=mixed-orbit] [data-hm-loaded]').length === 3);
   const cardRatios = await mixedOrbit.locator('.hm-card').evaluateAll(cards =>
     cards.map(card => parseFloat(card.style.width)/parseFloat(card.style.height)));
   assert.deepEqual(cardRatios.map(ratio => Number(ratio.toFixed(2))), [1,.5,2]);
   const mixed = page.locator('[data-feature=mixed-slideshow] .cs-original-slides');
   const detail = page.locator('.hm-entry-gallery .cs-original-slides');
   const checkMixed = async gallery => {
     await gallery.scrollIntoViewIfNeeded();
     const nav = gallery.locator('.cs-carousel-nav');
     const top = await nav.evaluate(el => el.offsetTop);
     for (const index of [0,1,2]) {
       await gallery.locator(`[data-cs-published-dot="${index}"]`).evaluate(button => button.click());
       const slide = gallery.locator('.cs-screen:not([hidden]) .cs-stage');
       const image = slide.locator('img');
       await gallery.locator('.cs-screen:not([hidden]) .cs-stage img').evaluate(img => { img.loading = 'eager'; });
       await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await image.elementHandle());
       const shape = await image.evaluate(img => ({
         fit:getComputedStyle(img).objectFit, ratio:img.naturalWidth / img.naturalHeight,
       }));
       assert.deepEqual(shape,{fit:'contain',ratio:[1,.5,2][index]});
       assert.equal(await nav.evaluate(el => el.offsetTop),top);
     }
   };
   await checkMixed(mixed);
   const wide = page.locator('[data-feature=wide-slideshow] .cs-original-slides');
   await wide.scrollIntoViewIfNeeded();
   await page.waitForFunction(() => document.querySelector('[data-feature=wide-slideshow] .cs-original-slides')?.style.getPropertyValue('--cs-original-ratio') === '2');
   const ratio = await wide.locator('.cs-stage').first().evaluate(stage => stage.clientWidth/stage.clientHeight);
   assert.ok(Math.abs(ratio-2)<.02);
   await page.evaluate(() => {location.hash = '#home/mixed-orbit';});
   await checkMixed(detail);
   await page.evaluate(() => {location.hash = '#home';});
   await mixedOrbit.waitFor();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: Home editor, backdrop dismissal, detail photo formats, order, transfer, archive and old links.');
} finally { await browser.close(); }
