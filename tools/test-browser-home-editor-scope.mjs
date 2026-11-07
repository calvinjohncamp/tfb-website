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
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();const f=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!f.startsWith(root))return route.abort();try{return route.fulfill({body:readFileSync(f),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf'})[extname(f)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
 await page.goto(origin+'/?tfbPresentation=1#home');await page.waitForFunction(()=>TFB.ui&&TFB.homeMedia);
 await page.evaluate(async()=>{TFB.ui.state.member=TFB.api.attachDirectoryMember({id:'home-media-admin',firstName:'Home',lastName:'Test',isAdmin:true,active:true,email:'home@example.invalid',teams:[]});TFB.api.secureDirectory=true;TFB.api.mode='test';location.hash='#home';await TFB.ui.renderView('home');});
 if(await page.evaluate(()=>TFB.ui.state.member?.adminHidden))await page.locator('[data-action="admin-toggle"]').click();


 await page.evaluate(async()=>{const s=await TFB.api.site();const photo='assets/images/board/kai-eichmann.jpg';s.pages.home.blocks=[{id:'normal',type:'feature',title:'Normal story',text:'Original',image:photo,more:{title:'Detail',text:'Detail text'},album:{enabled:true,title:'Separate album',images:[photo]}},{id:'gallery',type:'gallery',title:'Gallery',images:[photo]},{id:'collage',type:'collage',title:'Collage',images:[photo]},{id:'orbit',type:'feature',title:'Carousel',mediaCollection:{entries:[{id:'story-entry',title:'Carousel detail',images:[photo]}]}}];await TFB.api.saveSite(s);await TFB.refreshSite(true);await TFB.ui.renderView('home');});
 await page.locator('[data-action=site-edit][data-page=home]').first().click();assert.equal(await page.locator('.home-editor-settings').count(),1);
 const before=await page.evaluate(()=>TFB.api.site());
 await page.locator('[data-action=block-edit][data-id=normal]').click();const form=page.locator('[data-editor=block]');
 assert.equal(await form.locator('[data-edtheme]').count(),0);assert.deepEqual(await form.locator('[data-edtab]').allTextContents(),['Startseite','Unterseite']);assert.equal(await form.locator('[name=albumTitle]').count(),0);
 await form.locator('[name=title]').fill('Edited normal story');await form.locator('[data-edtab=sub]').click();await form.locator('[data-panel=sub] [contenteditable=true]').first().fill('Edited detail');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});
 let saved=await page.evaluate(()=>TFB.api.site());assert.equal(saved.pages.home.blocks[0].title,'Edited normal story');assert.equal(saved.pages.home.blocks[0].more.text,'Edited detail');assert.deepEqual(saved.pages.home.blocks[0].album,before.pages.home.blocks[0].album);assert.deepEqual(saved.pages.home.blocks.slice(1),before.pages.home.blocks.slice(1));
 await page.locator('[data-action=block-album-edit][data-id=normal]').click();await form.waitFor();assert.equal(await form.locator('h2').innerText(),'Fotokollage bearbeiten');assert.equal(await form.locator('[data-edtab],[data-edtheme],[name=title],[data-delete]').count(),0);await form.locator('[name=albumTitle]').fill('Edited album');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});saved=await page.evaluate(()=>TFB.api.site());assert.equal(saved.pages.home.blocks[0].album.title,'Edited album');assert.equal(saved.pages.home.blocks[0].title,'Edited normal story');assert.equal(saved.pages.home.blocks[0].more.text,'Edited detail');
 for(const id of ['gallery','collage']){await page.locator('[data-action=block-edit][data-id='+id+']').click();assert.equal(await form.locator('[data-edtheme],[data-edtab]').count(),0);await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});}
 await page.locator('[data-action=block-edit][data-id=orbit]').click();await page.locator('[data-hm-editor]').waitFor();assert.equal(await page.locator('[data-editor=block]').count(),0);await page.locator('[data-hm-editor] [type=submit]').click();await page.locator('[data-hm-editor]').waitFor({state:'detached'});
 await page.locator('[data-action=site-done]').last().click();assert.equal(await page.locator('.editing-page').count(),0);assert.deepEqual(errors,[]);console.log('PASS: Home settings, isolated story/detail/album/gallery/collage/carousel editors, independent saves and Done.');
}finally{await browser.close();}
