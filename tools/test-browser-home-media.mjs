import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='https://tfb-home-media.invalid';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({serviceWorkers:'block',viewport:{width:1440,height:1050}}),errors=[];
 page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const f=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!f.startsWith(root))return route.abort();try{return route.fulfill({body:readFileSync(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf'})[extname(f)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await page.goto(origin+'/?tfbPresentation=1#home');await page.waitForFunction(()=>TFB.ui&&TFB.homeMedia);
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#home';await TFB.ui.renderView('home');});
 if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action="admin-toggle"]').click();
 await page.locator('[data-action="site-edit"][data-page="home"]').first().click();
 await page.locator('[data-media-collection]').first().click();
 const form=page.locator('[data-hm-editor]');await form.locator('[name=title]').fill('Einblicke in unser Projekt');await form.locator('[name=kicker]').fill('Unser Padelprojekt');await form.locator('[name=subtitle]').fill('Sammlung mit fünf Bildern');await form.locator('[name=text]').fill('Ideen und Details zum Entdecken.');
 await form.locator('[data-hm-tab=posts]').click();assert.equal(await form.locator('[name=collection_title],[name=collection_intro]').count(),0);await form.locator('[data-hm-add]').click();await form.locator('[name=entry_0_kicker]').fill('Konzept Umkleide Padel');await form.locator('[name=entry_0_title]').fill('Unsere Umkleide');await form.locator('[name=entry_0_subtitle]').fill('Ankommen und wohlfühlen.');await form.locator('[name=entry_0_text]').fill('Ein erster Einblick.');
 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=108;c.height=135;c.getContext('2d').fillRect(0,0,108,135);return c.toDataURL().split(',')[1];});
 await form.locator('[data-hm-upload="0"]').setInputFiles(Array.from({length:5},(_,i)=>({name:`foto-${i}.png`,mimeType:'image/png',buffer:Buffer.from(png,'base64')})));
 await page.waitForFunction(()=>document.querySelectorAll('[data-hm-editor] .gallery-thumb').length===5);
 await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});await page.locator('[data-action=site-done]').click();
 const feature=page.locator('.feature').filter({hasText:'Einblicke in unser Projekt'});await feature.waitFor();assert.equal(await feature.locator('.hm-card').count(),5);assert.equal(await feature.locator('.hm-caption').innerText(),'Unsere Umkleide');assert.equal(await feature.getByText(/Bildseiten entdecken/).count(),0);const href=await feature.locator('.hm-card').first().getAttribute('href');assert(href.startsWith('#home/'));
 await feature.scrollIntoViewIfNeeded();await page.mouse.move(10,10);await page.waitForTimeout(3100);assert(Number(await feature.locator('[data-hm-orbit]').getAttribute('data-hm-phase'))>0,'Cover animates');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.hm-pause').disabled);assert.equal(await feature.locator('.hm-pause').isDisabled(),true);const phase=await feature.locator('[data-hm-orbit]').getAttribute('data-hm-phase');await page.waitForTimeout(1100);assert.equal(await feature.locator('[data-hm-orbit]').getAttribute('data-hm-phase'),phase);
 await page.reload();await page.locator('.hm-card').first().waitFor();await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.hm-card').first().click();await page.locator('.hm-entry').waitFor();assert.equal(await page.locator('.hm-heading').count(),0);assert.equal(await page.locator('.hm-entry-kicker').innerText(),'KONZEPT UMKLEIDE PADEL');assert.equal(await page.locator('.hm-entry-copy h1').innerText(),'Unsere Umkleide');assert.equal(await page.locator('.hm-entry-intro').innerText(),'Ankommen und wohlfühlen.');assert.equal(await page.locator('.hm-thumbs button').count(),5);
 await page.locator('[data-hm-thumb="3"]').click();assert.equal(await page.locator('.hm-thumbs [aria-pressed=true]').getAttribute('data-hm-thumb'),'3');await page.locator('.cs-carousel [data-cs-step="1"]').click();assert.equal(await page.locator('.hm-thumbs [aria-pressed=true]').getAttribute('data-hm-thumb'),'4');
 await page.locator('[data-cs-published-page]:not([hidden]) [data-cs-published-full]').first().click();await page.locator('.cs-viewer').waitFor();await page.locator('.cs-viewer [data-cs-published-page]:not([hidden]) [data-cs-next-photo]').first().click();await page.locator('.cs-viewer [data-cs-viewer-close]').click();
 await page.evaluate(async()=>{TFB.api.secureDirectory=true;TFB.api.mode='test';});
 if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action=admin-toggle]').click();
 await page.evaluate(()=>TFB.ui.renderView());
 await page.locator('[data-action=feature-edit]').first().click();await form.locator('[name=title]').fill('Geänderte Home-Überschrift');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});await page.reload();await page.locator('.hm-entry').waitFor();
 for(const width of [1440,390]){await page.setViewportSize({width,height:1050});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:`/tmp/tfb-home-media-detail-${width}.png`,fullPage:true});}
 assert.equal(await page.locator('.hm-back').count(),0);await page.locator('.brand-home').click();await page.locator('.hm-orbit').waitFor();for(const width of [1440,390]){await page.setViewportSize({width,height:1050});await page.locator('.hm-orbit').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:`/tmp/tfb-home-media-cover-${width}.png`});}
 await page.evaluate(async()=>{const site=await TFB.api.site();const b=site.pages.home.blocks.find(b=>b.mediaCollection);const entry=b.mediaCollection.entries[0];b.mediaCollection.entries=Array.from({length:8},(_,i)=>({...entry,id:'entry-'+i,title:'Beitrag '+(i+1)}));await TFB.api.saveSite(site);await TFB.refreshSite(true);location.hash='#home/'+b.id;await TFB.ui.renderView();});
 await page.locator('[data-hm-all]').waitFor();assert.equal(await page.locator('.hm-entry:not([hidden])').count(),6);await page.locator('[data-hm-all]').click();assert.equal(await page.locator('.hm-entry:not([hidden])').count(),8);
 // Position, not an older explicit image-side preference, controls Look 6.
 await page.setViewportSize({width:1440,height:1050});
 await page.evaluate(async()=>{const site=await TFB.api.site();site.homeLook='6';const seed=site.pages.home.blocks.find(b=>b.mediaCollection);site.pages.home.blocks=['portrait-right','wide','square-right','portrait'].map((layout,i)=>({...structuredClone(seed),id:'side-'+i,title:'Reihenfolge '+i,layout}));await TFB.api.saveSite(site);await TFB.refreshSite(true);location.hash='#home';await TFB.ui.renderView('home');});
 for(const action of ['initial','reorder','insert-first']){
  if(action!=='initial')await page.evaluate(async action=>{const site=await TFB.api.site(),blocks=site.pages.home.blocks;if(action==='reorder')blocks.unshift(blocks.pop());else blocks.unshift({...structuredClone(blocks[1]),id:'new-first',title:'Neuer erster Beitrag',layout:'square-right'});await TFB.api.saveSite(site);await TFB.refreshSite(true);await TFB.ui.renderView('home');},action);
  const sides=await page.locator('.home-look-6 .feature').evaluateAll(nodes=>nodes.map(el=>{const picture=el.firstElementChild.getBoundingClientRect(),body=el.querySelector('.feature-body').getBoundingClientRect();return {number:el.querySelector('.feature-number').textContent,left:picture.x<body.x};}));
  sides.forEach((side,i)=>{assert.equal(side.number,String(i+1).padStart(2,'0'),action+' numbering');assert.equal(side.left,i%2===0,action+' alternating image position '+i);});
 }
 assert.deepEqual(errors,[]);console.log('PASS: Home media editor, lossless upload, save/reload, five cards, motion/reduced motion, all-image links, detail thumbnails/fullscreen, text editing and mobile.');
}finally{await browser.close();}
