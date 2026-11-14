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
 await page.addInitScript(() => localStorage.setItem('tfb_kiosk_demo_session_v1', 'm-demo'));
 await page.goto(origin+'/?tfbPresentation=1#home');await page.waitForFunction(()=>TFB.ui&&TFB.homeMedia);
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#home';await TFB.ui.renderView('home');});
 if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action="admin-toggle"]').click();

 // The global admin row can use the page width on Dating 2.0.
 await page.evaluate(async()=>{location.hash='#treffen';await TFB.ui.renderView('treffen');});
 const adminBar=page.locator('#view[data-view=treffen] .tfb-admin-links');
 await adminBar.waitFor();
 await page.evaluate(()=>document.fonts.ready);
 for (const width of [1440, 1200, 390]) {
   await page.setViewportSize({width,height:1050});
   const layout=await adminBar.evaluate(bar=>({
     rows:new Set([...bar.children].map(button=>button.getBoundingClientRect().top)).size,
     overflow:document.documentElement.scrollWidth>innerWidth,
   }));
   if(width>=1200) assert.equal(layout.rows,1);
   assert.equal(layout.overflow,false);
 }
 await page.setViewportSize({width:1440,height:1050});
 const image='assets/images/board/kai-eichmann.jpg';
 await page.evaluate(async image=>{const site=await TFB.api.site();site.pages.home.blocks=[{id:'home-source',type:'feature',title:'Unsere Signature-Umkleide',kicker:'Konzept',subtitle:'Ausblick',text:'Originaltext bleibt.',mediaButtonLabel:'Zeig her!',mediaCollection:{entries:[{id:'entry',title:'Nach dem Match',kicker:'Signature',subtitle:'Wohlfühlen',text:'{hervorheben}Originaler Detailtext{/hervorheben} {rot}Ältere rote Markierung{/rot} {marker}Älterer Marker{/marker}',date:'2026-11-07',format:'4:5',images:Array(5).fill(image),instagramUrl:'https://instagram.com/p/example'}]}}];site.pages.aktuell.blocks=[{id:'dates-head',type:'heading',title:'Save the Date'},{id:'future',type:'event',date:'2027-05-15',title:'Späterer Termin'},{id:'news-head',type:'heading',title:'News'},{id:'old-news',type:'post',date:'2026-07-04',title:'Ältere News',text:'Bleibt erhalten'}];await TFB.api.saveSite(site);await TFB.refreshSite(true);location.hash='#aktuell';await TFB.ui.renderView('aktuell');},image);
 const tools=page.locator('.newsroom-tools');
 const headerPencil=page.locator('.topbar [data-action=admin-toggle]');
 await page.waitForFunction(()=>location.hash==='#aktuell');
 if (await headerPencil.getAttribute('aria-pressed') === 'true') await headerPencil.click();
 await tools.waitFor({state:'detached'});
 assert.equal(await tools.count(),0);
 assert.equal(await page.locator('[data-action=site-edit][data-page=aktuell]').count(),0);
 await headerPencil.click();
 await tools.waitFor();assert((await tools.boundingBox()).y<450,'Create controls are at the top');assert.equal(await page.locator('[data-action="block-new"]').count(),0);
 // A simple appointment opens directly, without the general block picker.
 await tools.locator('[data-kind=event]').click();let form=page.locator('[data-editor=block]');await form.locator('[name=title]').fill('Neuer früher Termin');await form.locator('[name=date]').fill('2026-11-20');await form.locator('[name=time]').fill('18:00');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});await tools.waitFor();
 assert.deepEqual(await page.locator('.col-dates .event h3').allTextContents(),['Neuer früher Termin','Späterer Termin']);
 assert.deepEqual(await tools.locator('.newsroom-create button').allTextContents(),['+ News hinzufügen','Termin hinzufügen','Fotos hinzufügen']);
 await tools.locator('[data-kind=post]').click();
 await form.locator('[name=title]').fill('Neue News');
 assert.equal(await form.locator('[name=date]').count(),0);
 await form.locator('[data-rich-for=text]').fill('Unser neuer Bericht.');
 await form.getByRole('button',{name:'Link hinzufügen'}).click();
 await form.getByRole('button',{name:'Link hinzufügen'}).click();
 await form.locator('[data-linkfor=link][data-linkkind=app]').click();
 await form.locator('[name=linkApp]').selectOption('#sport');
 await form.locator('[name=linkAppearance]').selectOption('symbol');
 const symbolPicker=page.getByRole('dialog',{name:'Symbol auswählen'});
 await form.locator('[data-link-symbols=link]').click();
 await symbolPicker.getByRole('button',{name:'Padel',exact:true}).locator('svg').waitFor();
 const emblem=symbolPicker.getByRole('button',{name:'Home',exact:true}).locator('svg.editorial-home-wordmark');
 assert.equal(await emblem.locator('path').count(),3);
 const markGeometry=await emblem.evaluate(svg=>{
   const circle=svg.parentElement.getBoundingClientRect();
   const rect=svg.getBoundingClientRect();
   const paths=svg.getBBox();
   const view=svg.viewBox.baseVal;
   return {scale:rect.width/circle.width, x:paths.x+paths.width/2-view.x-view.width/2,
     y:paths.y+paths.height/2-view.y-view.height/2, fill:getComputedStyle(svg).fill};
 });
 assert.ok(markGeometry.scale >= .80, JSON.stringify(markGeometry));
 assert.ok(Math.abs(markGeometry.x) < 15 && Math.abs(markGeometry.y) < 10, JSON.stringify(markGeometry));
 const colors=await emblem.evaluate(el=>{
   const root=document.documentElement;
   const yellow=root.classList.contains('tfb-logo-midnight-amber');
   root.classList.add('tfb-logo-midnight-amber');
   const symbols=[...el.closest('dialog').querySelectorAll('.editorial-link-mark.is-symbol')].filter(mark=>!mark.classList.contains('is-home-symbol'));
   const amberColors=symbols.map(mark=>getComputedStyle(mark).color);
   const blue=getComputedStyle(el).color;
   root.classList.remove('tfb-logo-midnight-amber');
   const white=getComputedStyle(el).color;
   const redColors=symbols.map(mark=>getComputedStyle(mark).color);
   root.classList.toggle('tfb-logo-midnight-amber',yellow);
   return [blue,white,[...new Set(amberColors)],[...new Set(redColors)]];
 });
 assert.deepEqual(colors,['rgb(0, 29, 61)','rgb(255, 255, 255)',['rgb(23, 23, 23)'],['rgb(255, 255, 255)']]);
 await page.keyboard.press('Escape');
 await symbolPicker.waitFor({state:'detached'});
 assert.equal(await form.locator('[name=linkSymbol]').inputValue(),'auto');
 await form.locator('[data-link-symbols=link]').click();
 await symbolPicker.getByRole('button',{name:'Sport',exact:true}).click();
 await symbolPicker.waitFor({state:'detached'});
 assert.equal(await form.locator('[name=linkSymbol]').inputValue(),'sport');
 await form.locator('[name=link2Url]').fill('ungültige Adresse');
 await form.locator('[type=submit]').click();
 await form.getByText('Bitte eine gültige Website-Adresse eingeben.').waitFor();
 await form.locator('[name=link2Url]').fill('www.example.org/news');
 await form.locator('[name=link2Label]').fill('Externer News-Link');
 await page.locator('.news-draft-preview .post').getByRole('link',{name:'Sport',exact:true}).waitFor();
 await form.getByRole('button',{name:'Unterseite',exact:true}).click();
 const draftStory = page.locator('.news-draft-preview .story');
 await draftStory.getByRole('link',{name:'Externer News-Link'}).waitFor();
 await form.locator('[data-rich-for=sec_0]').fill('Intern und extern');
 const text = form.locator('[data-rich-for=sec_0]');
 await text.evaluate(el=>{const selection=getSelection();selection.setBaseAndExtent(el.firstChild,0,el.firstChild,6);});
 page.once('dialog',dialog=>dialog.accept('#club'));
 await form.locator('[data-panel=sub] [data-rich=link]').click();
 await text.evaluate(el=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const at=node.textContent.indexOf('extern');if(at>=0){getSelection().setBaseAndExtent(node,at,node,at+6);return;}}throw Error(el.innerHTML);});
 page.once('dialog',dialog=>dialog.accept('https://example.com/bericht'));
 await form.locator('[data-panel=sub] [data-rich=link]').click();
 await text.getByRole('link', {name:'extern',exact:true}).evaluate(el=>getSelection().selectAllChildren(el));
 await form.locator('[data-panel=sub] [data-rich=hervorheben]').click();
 await form.locator('[data-secadd=h]').last().click();
 await form.locator('[name=sec_1]').fill('Zwischenüberschrift im Artikel');
 await form.locator('[data-secadd=quote]').last().click();
 await form.locator('[name=sec_2]').fill('Ein Zitat im Artikel');
 await form.locator('[name=sec_1_color]').selectOption('signature');
 await form.locator('[name=sec_2_color]').selectOption('signature');

 assert.equal(await draftStory.locator('.lead-letters').count(),0);
 assert.equal(await form.locator('[type=submit]').innerText(),'Veröffentlichen');
 await form.locator('[type=submit]').click();
 await form.waitFor({state:'detached'});
 await page.locator('.col-news .post').filter({hasText:'Neue News'}).getByRole('link',{name:'Sport',exact:true}).waitFor();
 assert.equal(await page.getByRole('link',{name:'Externer News-Link'}).getAttribute('href'),'https://www.example.org/news');
 const dimensions=await page.locator('.col-news .post').filter({hasText:'Neue News'}).locator('.editorial-link').evaluateAll(links=>
   links.map(link=>[link.getBoundingClientRect().height, Boolean(link.querySelector('.editorial-link-mark'))]));
 assert.deepEqual(dimensions,[[38,true],[38,false]]);
 await page.reload();
 assert.equal(await page.locator('.col-news .post').filter({hasText:'Neue News'}).getByRole('link',{name:'Sport',exact:true}).getAttribute('href'),'#sport');
 await page.getByRole('link',{name:'Neue News'}).click();
 const assertThemed = async marked => {
   await marked.first().waitFor();
   const colors = await marked.evaluateAll(elements => {
     const root = document.documentElement;
     const amber = root.classList.contains('tfb-logo-midnight-amber');
     const read = () => elements.map(element => {
       const style = getComputedStyle(element);
       return [style.color, style.backgroundImage];
     });
     root.classList.add('tfb-logo-midnight-amber');
     const yellow = read();
     root.classList.remove('tfb-logo-midnight-amber');
     const red = read();
     root.classList.toggle('tfb-logo-midnight-amber', amber);
     return {yellow, red};
   });
   for (const [color, background] of colors.yellow) {
     assert.equal(color, 'rgb(23, 23, 23)');
     assert.match(background, /tfb-highlight-freihand/);
   }
   for (const [color, background] of colors.red) {
     assert.equal(color, 'rgb(196, 85, 58)');
     assert.equal(background, 'none');
   }
 };
 await assertThemed(page.locator('.story-body a .tx-highlight'));
 await assertThemed(page.locator('.story-body :is(.story-h,.story-quote) .signature-highlight'));

 assert.equal(await page.locator('.story').getByRole('link',{name:'Sport',exact:true}).getAttribute('href'),'#sport');
 assert.equal(await page.getByRole('link',{name:'Externer News-Link'}).getAttribute('target'),'_blank');
 assert.equal(await page.locator('.story-body').getByRole('link',{name:'Intern',exact:true}).getAttribute('href'),'#club');
 assert.equal(await page.locator('.story-body').getByRole('link',{name:'extern',exact:true}).getAttribute('href'),'https://example.com/bericht');
 assert.equal(await page.locator('.story-body h2').innerText(),'Zwischenüberschrift im Artikel');
 assert.equal(await page.locator('.story-body blockquote').innerText(),'Ein Zitat im Artikel');

 await page.locator('.story-tools a[href="#aktuell"]').click();
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';await TFB.ui.renderView('aktuell');});
 await headerPencil.click();

 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=108;c.height=135;c.getContext('2d').fillRect(0,0,108,135);return c.toDataURL().split(',')[1];});
 const photos=n=>Array.from({length:n},(_,i)=>({name:`bild-${i}.png`,mimeType:'image/png',buffer:Buffer.from(png,'base64')}));
 for(const [kind,title,count] of [['carousel','Unser neues Karussell',15],['collage','Unsere Collage',5],['gallery','Unsere Galerie',5]]) {
   await tools.getByRole('button',{name:'Fotos hinzufügen'}).click();
   await page.locator(`.type-option[data-kind="${kind}"]`).click();
   await form.locator('[name=title]').fill(title);
   const files=form.locator('[data-gallery-input]');
   if(kind==='carousel') {
     await files.setInputFiles(photos(16));
     await page.getByText('Bitte insgesamt höchstens 15 Fotos auswählen.').waitFor();
     assert.equal(await form.locator('.gallery-thumb').count(),0);
   }
   await files.setInputFiles(photos(count));
   await form.locator('.gallery-thumb').nth(count-1).waitFor();
   await form.locator('[type=submit]').click();
   await form.waitFor({state:'detached'});
 }
 const carousel=page.locator('.col-news .post').filter({hasText:'Unser neues Karussell'});
 const newId=await carousel.getAttribute('data-site-content');
 assert.equal(await carousel.locator('[data-cs-published-page]').count(),15);
 const collage=page.locator('.col-news .post').filter({hasText:'Unsere Collage'});
 assert.equal(await collage.locator('.collage-item').count(),4);
 assert.ok(await collage.locator('.collage').evaluate(node => {
   const frame = node.getBoundingClientRect();
   return frame.height > 0 && frame.height <= 280 && [...node.children].every(tile => {
     const rect = tile.getBoundingClientRect();
     return rect.height > 0 && rect.bottom <= frame.bottom + 1 && rect.right <= frame.right + 1;
   });
 }));
 await collage.getByRole('button',{name:'Alle 5 Fotos ansehen'}).click();
 assert.equal(await page.locator('.viewer .gal-album .collage-item').count(),5);
 await page.keyboard.press('Escape');
 await page.locator('.viewer.gallery').waitFor({state:'detached'});
 assert.deepEqual(await page.locator('.col-news .post h3').allTextContents(),['Unsere Galerie','Unsere Collage','Unser neues Karussell','Neue News','Ältere News']);
 // Failure cannot remove Home content or leave a half-moved contribution.
 await page.evaluate(() => location.hash = '#home');
 if (!await page.locator('.site-page[data-page=home].editing-page').count() && !await page.locator('[data-action=site-edit][data-page=home]').count()) await headerPencil.click();
 if (!await page.locator('.site-page[data-page=home].editing-page').count()) await page.locator('[data-action=site-edit][data-page=home]').click();
 await page.locator('[data-action=home-move-news][data-id=home-source]').click();
 const moving = page.locator('[data-home-move]');
 assert.equal(await moving.locator('time').getAttribute('datetime'),'2026-11-07');
 await page.evaluate(() => { TFB.savedSaveSite = TFB.api.saveSite; TFB.api.saveSite = async () => { throw Error('Simulierter Speicherkonflikt'); }; });
 await moving.locator('[type=submit]').click();
 await moving.getByText('Simulierter Speicherkonflikt',{exact:true}).waitFor();
 assert.ok(await page.evaluate(async () => {
   const s = await TFB.api.site();
   return s.pages.home.blocks.some(b=>b.id==='home-source') && !s.pages.aktuell.blocks.some(b=>b.id==='home-source');
 }));
 const before = await page.evaluate(async () => {
   TFB.api.saveSite = TFB.savedSaveSite;
   return (await TFB.api.site()).pages.home.blocks.find(b=>b.id==='home-source').mediaCollection;
 });
 await moving.locator('[type=submit]').click();
 await moving.waitFor({state:'detached'});
 const moved = await page.evaluate(async () => (await TFB.api.site()).pages.aktuell.blocks.find(b=>b.id==='home-source'));
 assert.deepEqual(moved.mediaCollection,before);
 assert.equal(moved.date,'2026-11-07');
 await page.evaluate(() => location.hash = '#aktuell');
 await page.locator('.col-news .media-news').last().waitFor();
 assert.deepEqual(await page.locator('.col-news .post h3').allTextContents(),['Unsere Galerie','Unsere Collage','Unser neues Karussell','Neue News','Unsere Signature-Umkleide','Ältere News']);
 // Reload preserves media and old Home URLs still reach the transferred content.
 await page.reload();await page.locator('.media-news').first().waitFor();assert.equal(await page.locator('.media-news').count(),1);await page.evaluate(async()=>{location.hash='#home/home-source';await TFB.ui.renderView('home');});await page.locator('.hm-entry').waitFor();assert.equal(await page.locator('.hm-entry-copy h1').innerText(),'Nach dem Match');assert.equal(await page.locator('.hm-entry-intro').innerText(),'Wohlfühlen');
 await page.evaluate(async()=>{location.hash='#aktuell/alle';await TFB.ui.renderView('aktuell');});assert.equal(await page.locator('a.mini[href="#aktuell/beitrag/'+newId+'"]').count(),1);await page.locator('a.mini[href="#aktuell/beitrag/'+newId+'"]').click();await page.locator('.story .cs-carousel').waitFor();
 // Multiple stored groups are shown as a single slideshow, retaining every image and heading.
 await page.evaluate(async image => {
   const site = await TFB.api.site();
   site.pages.aktuell.blocks.find(block => block.id === 'home-source').mediaCollection.entries.push({
     id:'extra', title:'Zweiter Text', text:'Vorhandener Inhalt', images:[image],
   });
   await TFB.api.saveSite(site);
   await TFB.refreshSite();
   location.hash='#aktuell/home-source';
 }, image);
 const existingMarks = page.locator('.hm-entry-copy :is(.tx-highlight,.tx-red,.tx-mark)');
 await assertThemed(existingMarks);
 assert.equal(await existingMarks.count(), 3);
 const slideshow = page.getByRole('region',{name:'Diashow'});
 await slideshow.waitFor();
 assert.equal(await slideshow.count(),1);
 assert.equal(await slideshow.locator('[data-cs-published-page]').count(),6);
 await page.getByRole('heading',{name:'Zweiter Text'}).waitFor();
 await slideshow.getByRole('button',{name:'Bild 6 anzeigen',exact:true}).click();
 assert.equal(await slideshow.locator('.cs-carousel-status').innerText(),'Bild 6 von 6');
 const play=slideshow.locator('[data-cs-slideshow]');
 assert.equal(await play.getAttribute('aria-pressed'),'false');
 await play.click();
 assert.equal(await play.getAttribute('aria-pressed'),'true');
 await play.click();
 assert.equal(await play.getAttribute('aria-pressed'),'false');
 // Edit a legacy carousel through the shared Underseite tools and reopen the published result.
 if (await headerPencil.getAttribute('aria-pressed') === 'false') await headerPencil.click();
 const movedArticle = page.locator('[data-edit-block=home-source]');
 await page.evaluate(()=>location.hash='#aktuell');
 await movedArticle.getByRole('button',{name:'Bearbeiten'}).click();
 const mediaEditor = page.locator('[data-hm-editor]');
 await mediaEditor.getByRole('tab',{name:'Unterseite'}).click();
 assert.equal(await mediaEditor.locator('[data-hm-add],[data-hm-entry-remove]').count(),0);
 const mediaText = mediaEditor.locator('[data-rich-for=entry_0_section_0]');
 await mediaText.fill('Fetter Einblick');
 await mediaText.evaluate(el=>getSelection().selectAllChildren(el));
 await mediaEditor.locator('[data-hm-entry="0"] [data-rich=bold]').click();
 await mediaText.evaluate(el=>getSelection().selectAllChildren(el));
 await mediaEditor.locator('[data-hm-entry="0"] [data-rich=hervorheben]').click();
 await assertThemed(mediaText.locator('.tx-highlight'));
 await mediaEditor.locator('[data-hm-entry="0"] [data-secadd=quote]').last().click();
 await mediaEditor.locator('[name=entry_0_section_1]').fill('Zitat im Karussell');
 await mediaEditor.locator('[name=entry_0_section_1_color]').selectOption('signature');
 await mediaEditor.getByRole('tab',{name:'Übersicht'}).click();
 await mediaEditor.locator('[data-rich-for=text]').fill('Überblick zum Karussell');
 await mediaEditor.locator('[type=submit]').click();
 await mediaEditor.waitFor({state:'detached'});
 await page.evaluate(()=>location.hash='#aktuell/home-source');
 await page.locator('.hm-entry-copy strong').getByText('Fetter Einblick').waitFor();
 assert.equal(await page.locator('.hm-entry-copy blockquote').innerText(),'Zitat im Karussell');
 await assertThemed(page.locator('.hm-entry-copy :is(.tx-highlight, .story-quote .signature-highlight)'));
 // The legacy collection keeps its own detail layout and all five photos.
 await page.evaluate(async()=>{location.hash='#club/archiv';await TFB.ui.renderView('club');});await page.locator('.archive-home').waitFor();assert.equal(await page.locator('.archive-home .media-news').count(),1);assert.equal(await page.locator('.archive-home .media-news .hm-card').count(),5);
 await page.evaluate(async()=>{location.hash='#club/archiv/beitrag/home-home-source';await TFB.ui.renderView('club');});await page.locator('.hm-entry').waitFor();assert.equal(await page.locator('.hm-entry-copy h1').innerText(),'Nach dem Match');assert.equal(await page.locator('.story-tools a[href="#club/archiv"]').count(),1);
 await assertThemed(page.locator('.hm-entry-copy .tx-highlight'));
 // Management retains the normal two-column layout and simple terminology.
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#aktuell';await TFB.ui.renderView('aktuell');});if(await headerPencil.getAttribute('aria-pressed') === 'false')await headerPencil.click(); await tools.waitFor();assert.equal(await page.locator('.news-dates').count(),1);assert.equal(await page.locator('.col-news .block-edit').count()>0,true);assert.equal(await page.locator('[data-action=block-move]').count(),0);assert.equal(await page.locator('[data-action=block-new]').count(),0);
 for(const width of [1440,390]){await page.setViewportSize({width,height:1050});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`/tmp/tfb-aktuell-admin-${width}.png`,fullPage:true});}await page.locator('[data-action=aktuell-tab][data-tab=dates]').click();assert.equal(await page.locator('.col-dates').isVisible(),true);
 assert.equal(await page.getByRole('button',{name:'Fertig',exact:true}).count(),0);
 await headerPencil.click();
 await page.locator('.editing-page').waitFor({state:'detached'});
 assert.equal(await page.locator('.tfb-admin-links').count(),0);
 assert.equal(await headerPencil.getAttribute('aria-pressed'),'false');
 await page.locator('[data-action=aktuell-tab][data-tab=news]').click();
 await page.getByRole('link',{name:'Neue News'}).click();
 await headerPencil.click();
 await form.waitFor();
 await headerPencil.evaluate(button=>button.click());
 await form.waitFor({state:'detached'});
 assert.equal(await page.locator('.tfb-admin-links').count(),0);
 await headerPencil.click();
 assert.equal(await form.locator('[type=submit]').innerText(),'Änderungen speichern');
 await form.getByRole('button',{name:'Übersicht',exact:true}).click();
 await form.locator('[name=title]').fill('Nicht veröffentlichte Änderung');
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('.sheet-close').click();
 await form.waitFor();
 await form.locator('[name=title]').fill('Neue News');
 page.once('dialog',dialog=>dialog.accept());
 await form.getByRole('button',{name:'Ins Clubarchiv verschieben'}).click();
 await form.waitFor({state:'detached'});
 const savedNews=await page.evaluate(async()=> (await TFB.api.site()).pages.aktuell.blocks.find(b=>b.title==='Neue News'));
 assert.ok(savedNews.archived);
 await page.evaluate(id=> location.hash='#club/archiv/beitrag/aktuell-'+id,savedNews.id);
 await page.getByRole('link',{name:'Externer News-Link'}).waitFor();
 assert.equal(await page.getByRole('button',{name:/löschen|bearbeiten/i}).filter({hasText:/löschen/i}).count(),0);
 await page.evaluate(()=>location.hash='#aktuell');
 await tools.getByRole('button',{name:'News hinzufügen'}).click();
 await form.locator('[name=title]').fill('Mein löschbarer Test');
 await form.locator('[type=submit]').click();
 await form.waitFor({state:'detached'});
 const own = page.locator('.block-edit').filter({hasText:'Mein löschbarer Test'});
 const deleteButton = own.getByRole('button',{name:'Artikel löschen'});
 await deleteButton.waitFor();
 await deleteButton.click();
 await own.waitFor();
 const accept = dialog => dialog.accept();
 page.on('dialog',accept);
 await deleteButton.click();
 await own.waitFor({state:'detached'});
 page.off('dialog',accept);
 const old = page.locator('.block-edit').filter({hasText:'Ältere News'});
 assert.equal(await old.getByRole('button',{name:'Artikel löschen'}).count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: News links, dates and three photo formats, 15-photo cap, compact collage, original dates on transfer, archive and mobile admin.');
}finally{await browser.close();}
