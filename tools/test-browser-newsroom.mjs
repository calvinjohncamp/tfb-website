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

 const image='assets/images/board/kai-eichmann.jpg';
 await page.evaluate(async image=>{const site=await TFB.api.site();site.pages.home.blocks=[{id:'home-source',type:'feature',title:'Unsere Signature-Umkleide',kicker:'Konzept',subtitle:'Ausblick',text:'Originaltext bleibt.',mediaButtonLabel:'Zeig her!',mediaCollection:{entries:[{id:'entry',title:'Nach dem Match',kicker:'Signature',subtitle:'Wohlfühlen',text:'Originaler Detailtext',date:'2026-11-07',format:'4:5',images:Array(5).fill(image),instagramUrl:'https://instagram.com/p/example'}]}}];site.pages.aktuell.blocks=[{id:'dates-head',type:'heading',title:'Save the Date'},{id:'future',type:'event',date:'2027-05-15',title:'Späterer Termin'},{id:'news-head',type:'heading',title:'News'},{id:'old-news',type:'post',date:'2026-07-04',title:'Ältere News',text:'Bleibt erhalten'}];await TFB.api.saveSite(site);await TFB.refreshSite(true);location.hash='#aktuell';await TFB.ui.renderView('aktuell');},image);
 const tools=page.locator('.newsroom-tools');await tools.waitFor();assert((await tools.boundingBox()).y<450,'Create controls are at the top');assert.equal(await page.locator('[data-action="block-new"]').count(),0);
 // A simple appointment opens directly, without the general block picker.
 await tools.locator('[data-kind=event]').click();let form=page.locator('[data-editor=block]');await form.locator('[name=title]').fill('Neuer früher Termin');await form.locator('[name=date]').fill('2026-11-20');await form.locator('[name=time]').fill('18:00');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});await tools.waitFor();
 assert.deepEqual(await page.locator('.col-dates .event h3').allTextContents(),['Neuer früher Termin','Späterer Termin']);
 assert.deepEqual(await tools.locator('.newsroom-create button').allTextContents(),['+ News hinzufügen','Termin hinzufügen','Fotos hinzufügen']);
 await tools.locator('[data-kind=post]').click();
 await form.locator('[name=title]').fill('Neue News');
 assert.equal(await form.locator('[name=date]').count(),0);
 await form.locator('[data-rich-for=text]').fill('Unser neuer Bericht.');
 await form.getByRole('button',{name:'Link hinzufügen'}).click();
 await form.locator('[data-linkfor=link][data-linkkind=app]').click();
 await form.locator('[name=linkApp]').selectOption('#sport');
 await form.locator('[name=linkLabel]').fill('Zum Sport');
 await form.locator('[name=link2Url]').fill('https://example.org/news');
 await form.locator('[name=link2Label]').fill('Externer News-Link');
 await form.locator('[type=submit]').click();
 await form.waitFor({state:'detached'});
 await page.getByRole('link',{name:'Neue News'}).click();
 assert.equal(await page.getByRole('link',{name:'Zum Sport'}).getAttribute('href'),'#sport');
 assert.equal(await page.getByRole('link',{name:'Externer News-Link'}).getAttribute('target'),'_blank');
 await page.locator('.story-tools a[href="#aktuell"]').click();
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
 await page.locator('[data-action=site-edit][data-page=home]').click();
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
 // The legacy collection keeps its own detail layout and all five photos.
 await page.evaluate(async()=>{location.hash='#club/archiv';await TFB.ui.renderView('club');});await page.locator('.archive-home').waitFor();assert.equal(await page.locator('.archive-home .media-news').count(),1);assert.equal(await page.locator('.archive-home .media-news .hm-card').count(),5);
 await page.evaluate(async()=>{location.hash='#club/archiv/beitrag/home-home-source';await TFB.ui.renderView('club');});await page.locator('.hm-entry').waitFor();assert.equal(await page.locator('.hm-entry-copy h1').innerText(),'Nach dem Match');assert.equal(await page.locator('.story-tools a[href="#club/archiv"]').count(),1);
 // Management retains the normal two-column layout and simple terminology.
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#aktuell';await TFB.ui.renderView('aktuell');});if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action=admin-toggle]').click();await page.locator('[data-action=site-edit][data-page=aktuell]').first().click();await tools.waitFor();assert.equal(await page.locator('.news-dates').count(),1);assert.equal(await page.locator('.col-news .block-edit').count()>0,true);assert.equal(await page.locator('[data-action=block-move]').count(),0);assert.equal(await page.locator('[data-action=block-new]').count(),0);
 for(const width of [1440,390]){await page.setViewportSize({width,height:1050});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`/tmp/tfb-aktuell-admin-${width}.png`,fullPage:true});}await page.locator('[data-action=aktuell-tab][data-tab=dates]').click();assert.equal(await page.locator('.col-dates').isVisible(),true);
 assert.equal(await page.getByRole('button',{name:'Fertig',exact:true}).count(),0);
 await page.locator('.page-head').getByRole('button',{name:'Bearbeitung schließen'}).click();
 await page.locator('.editing-page').waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('PASS: News links, dates and three photo formats, 15-photo cap, compact collage, original dates on transfer, archive and mobile admin.');
}finally{await browser.close();}
