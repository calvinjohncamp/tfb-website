import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import worker from './worker-test-loader.mjs';
import {Bucket} from './editorial-fixture.mjs';
import {digest} from '../server/cloudflare/editorial.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),site='https://joern-kaemper.de',api='https://tfb-api.calvinjohncamp.workers.dev';
const f=await fixture(),browser=await chromium.launch({headless:true});let collectRequests=0;const errors=[];
f.env.CMS_BUCKET=new Bucket();
const uploaded=await f.call('/admin/site/media',{data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII='},f.adminToken);assert.equal(uploaded.status,200);
const initial=(await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:[{key:'page:home',expected:0,value:{title:'Home',blocks:[{id:'one',type:'feature',title:'Zentraler erster Beitrag',text:'Gemeinsam auf allen Geräten',image:uploaded.body.ref}]}},{key:'page:verein',expected:0,value:{title:'Club',blocks:[]}}]},f.adminToken));
assert.equal(initial.status,200);
const archive=new Uint8Array([80,75,5,6,...Array(18).fill(0)]),release='a'.repeat(40);
await f.env.CMS_BUCKET.put('editorial/releases/'+release+'.zip',archive);
f.env.DB.sqlite.prepare('INSERT INTO cms_releases VALUES(?,?,?,?,?)').run(release,'editorial/releases/'+release+'.zip',await digest(archive),archive.length,new Date().toISOString());
async function open(admin=false){
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:1100}});
 if(admin)await context.addInitScript(token=>sessionStorage.setItem('tfb_directory_token_v1',token),f.adminToken);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.origin===api){if(url.pathname==='/public/partner-events')collectRequests++;
   const headers=new Headers(req.headers());headers.set('Origin',site);headers.set('CF-Connecting-IP','192.0.2.55');headers.set('User-Agent','TFB isolated browser test');const response=await worker.fetch(new Request(req.url(),{method:req.method(),headers,...(req.postData()?{body:req.postData()}:{})}),f.env);
   const bytes=Buffer.from(await response.arrayBuffer());if(response.status>=400)console.log('Test API',url.pathname,response.status,bytes.toString().slice(0,180));
   return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:bytes});
  }
  if(url.origin!==site)return route.abort();
  const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root))return route.abort();
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ttf':'font/ttf'};
  try{return route.fulfill({body:readFileSync(path),contentType:types[extname(path)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
 });
 await page.goto(site);await page.waitForSelector('#tfb-splash');await page.evaluate(()=>document.fonts.ready);return {page,context};
}
try{
 const {page}=await open(true);
 await page.locator('[data-action="splash-enter"]').click();
 await page.waitForFunction(()=>document.querySelector('#view').textContent.includes('Zentraler erster Beitrag'));
 const version=await page.evaluate(async()=>{const site=await TFB.api.site();site.pages.home.blocks[0].title='Desktop gespeichert';await TFB.api.saveSite(site);await TFB.refreshSite(true);return (await TFB.api.site())._cms.versions['page:home'];});assert.equal(version,2);
 const guest=await open();await guest.page.setViewportSize({width:390,height:844});await guest.page.locator('[data-action="splash-enter"]').click();
 await guest.page.waitForFunction(()=>document.querySelector('#view').textContent.includes('Desktop gespeichert'));
 await guest.page.reload();await guest.page.waitForFunction(()=>document.querySelector('#view').textContent.includes('Desktop gespeichert'));
 // A real stale editor must leave a local draft rather than overwrite another device.
 const conflict=await page.evaluate(async()=>{const old=await TFB.api.site();const latest=await TFB.api.site();latest.pages.home.blocks[0].title='Neuerer Serverstand';await TFB.api.saveSite(latest);old.pages.home.blocks[0].title='Nicht veröffentlichter Entwurf';try{await TFB.api.saveSite(old);return false;}catch{return Object.keys(localStorage).some(k=>k.startsWith('tfb_editorial_draft_'));}});assert.equal(conflict,true);
 assert.equal((await f.call('/public/site')).body.documents['page:home'].value.blocks[0].title,'Neuerer Serverstand');
 await page.locator('[data-action="profile"]').click();await page.waitForSelector('[data-action="cms-checkpoint"]');
 assert.match(await page.locator('.cms-controls').innerText(),/Stand sichern/);
 await page.locator('[data-action="cms-checkpoint"]').click();await page.locator('[data-cms-checkpoint] [name="label"]').fill('Browser Vorstandsstand');await page.locator('[data-cms-checkpoint] button').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 await page.locator('[data-action="profile"]').click();
 const downloading=page.waitForEvent('download',{timeout:7000}).catch(async e=>{console.log('Export UI:',await page.locator('#toast-root').innerText());throw e;});await page.locator('[data-action="cms-export"]').click();const download=await downloading;await download.saveAs('/private/tmp/tfb-v232-browser-snapshot.zip');assert.match(download.suggestedFilename(),/TFB-Website-Snapshot/);
 const bytes=readFileSync('/private/tmp/tfb-v232-browser-snapshot.zip');
 const zipDetails=await page.evaluate(bytes=>{const files=TFB.snapshotZip.unpack(new Uint8Array(bytes).buffer);const manifest=JSON.parse(new TextDecoder().decode(files['snapshot.json']));return {keys:Object.keys(files),title:manifest.documents['page:home'].value.blocks[0].title};},Array.from(bytes));assert.equal(zipDetails.title,'Neuerer Serverstand');assert.ok(zipDetails.keys.includes('programm/projekt.zip'));assert.ok(zipDetails.keys.some(k=>k.startsWith('medien/')));
 await page.locator('[data-cms-file]').setInputFiles('/private/tmp/tfb-v232-browser-snapshot.zip');await page.waitForSelector('.cms-panel');assert.match(await page.locator('.cms-panel').innerText(),/entspricht bereits/);await page.locator('.cms-panel [data-action="close-sheet"]').click();
 await page.locator('[data-action="profile"]').click();
 await page.locator('[data-action="cms-history"]').click();await page.waitForSelector('[data-cms-preview]');await page.locator('[data-cms-preview]').last().click();await page.waitForSelector('[data-cms-apply]');await page.locator('[data-cms-scope]').selectOption('page:home');await page.locator('[data-cms-apply]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 assert.equal((await f.call('/public/site')).body.documents['page:home'].value.blocks[0].title,'Zentraler erster Beitrag');
 await page.locator('[data-action="profile"]').click();
 for(const [width,height] of [[390,844],[834,1194],[1440,1100]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.locator('.cms-controls').scrollIntoViewIfNeeded();
 await page.screenshot({path:'/private/tmp/tfb-v232-editorial-account.png',fullPage:true});
 // Offline writes must preserve the unpublished change locally, never silently succeed.
 await page.evaluate(async()=>{window.offlineDraft=await TFB.api.site();});
 await page.context().setOffline(true);
 await page.route('**/admin/site/commit',r=>r.abort());
 const offline=await page.evaluate(async()=>{try{const site=window.offlineDraft;site.pages.home.title='Offline';await TFB.api.saveSite(site);return false;}catch{return JSON.parse(localStorage.getItem('tfb_editorial_draft_'+TFB.ui.state.member.id)).site.pages.home.title==='Offline';}});assert.equal(offline,true);await page.context().setOffline(false);
 assert.equal(collectRequests,0);assert.deepEqual(errors,[]);
 console.log('PASS: real-worker desktop/mobile sync, stale draft, account controls, named checkpoint, portable ZIP export/import, selected Home restore, responsive layout, offline rejection and no tracking.');
}finally{await browser.close();}
