import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import {Bucket} from './editorial-fixture.mjs';
import worker from './worker-test-loader.mjs';
import {splitSite} from '../server/cloudflare/editorial.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),f=await fixture();f.env.CMS_BUCKET=new Bucket();
const sandbox={TFB:{}};sandbox.window=sandbox;vm.runInNewContext(readFileSync(resolve(root,'assets/data/site-seed.js'),'utf8'),sandbox);const seed=sandbox.window.TFB.siteSeed;
const entry={id:'entry',title:'Unsere Umkleide',images:Array(5).fill('assets/images/board/kai-eichmann.jpg'),format:'4:5'};
seed.pages.home.blocks=[{id:'manual',type:'feature',title:'Manual',animationStart:'manual',mediaCollection:{entries:[entry]}}];
seed.pages.aktuell.blocks=[{id:'auto',type:'post',title:'Auto',animationStart:'auto',mediaCollection:{entries:[entry]},date:'2026-11-07'}];
assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:Object.entries(splitSite(seed)).map(([key,value])=>({key,expected:0,value}))},f.adminToken)).status,200);
assert.equal((await f.commit([{kind:'post',id:'public-browser-post',revision:0,value:{scope:'club',text:'Public browser test',images:[]}}])).status,200);
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:1050}}),errors=[];
 await context.route('**/*',async route=>{const r=route.request(),u=new URL(r.url());
  if(u.hostname==='tfb-api.calvinjohncamp.workers.dev'){const res=await worker.fetch(new Request('https://tfb-api.test'+u.pathname+u.search,{method:r.method(),headers:{...r.headers(),'CF-Connecting-IP':'192.0.2.6'},...(r.postData()?{body:r.postData()}:{})}),f.env);return route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});}
  if(u.hostname!=='joern-kaemper.de')return route.abort();
  const file=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root))return route.abort();
  try{return route.fulfill({body:readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[extname(file)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
 });
 const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));await page.goto('https://joern-kaemper.de/?tfbPresentation=1#home');await page.locator('.hm-orbit').waitFor();
 assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
 for(const key of ['kiosk','chat','treffen'])assert.equal(await page.locator('.topnav a[href="#'+key+'"]').count(),1);
 const orbit=page.locator('.hm-orbit');await orbit.scrollIntoViewIfNeeded();await page.mouse.move(5,5);await page.waitForTimeout(3200);assert.equal(await orbit.getAttribute('data-hm-phase'),'0');assert.equal(await orbit.locator('.hm-pause').getAttribute('aria-pressed'),'true');
 await orbit.locator('.hm-zoom-button').click();const zoom=page.locator('.hm-zoom-orbit');assert.equal(await zoom.locator('.hm-pause').getAttribute('aria-pressed'),'true');await zoom.locator('.hm-pause').click();await page.waitForTimeout(3200);assert(Number(await zoom.getAttribute('data-hm-phase'))>0);await page.keyboard.press('Escape');
 await page.locator('.topnav a[href="#aktuell"]').click();await page.locator('.media-news .hm-orbit').waitFor();await page.mouse.move(5,5);await page.waitForTimeout(3200);assert(Number(await page.locator('.media-news .hm-orbit').getAttribute('data-hm-phase'))>0);
 await page.locator('.topnav a[href="#chat"]').click();await page.getByText('Public browser test',{exact:true}).waitFor();
 await page.locator('.topnav a[href="#kiosk"]').click();await page.locator('.tiles .tile').first().waitFor();assert.equal(await page.locator('.kiosk-hero .coaster').count(),0);await page.locator('.tiles button.tile').first().click();await page.locator('[data-form=auth]').waitFor();
 await page.locator('.topnav a[href="#treffen"]').click();await page.locator('.meet-kind-tile').first().waitFor();assert((await page.locator('.meet-kind-tile').count())>=3);assert.equal(await page.evaluate(()=>TFB.ui.state.member),null);
 for(const width of [1440,390]){await page.setViewportSize({width,height:1050});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 await page.evaluate(async()=>{TFB.ui.state.member=await TFB.api.signIn('test@example.invalid','Synthetic password only 123!');TFB.api.mode='test';location.hash='#home/manual';await TFB.ui.renderView();});
 for(const [route,value] of [['#home/manual','auto'],['#aktuell/auto','manual']]){
  await page.evaluate(async route=>{location.hash=route;await TFB.ui.renderView();},route);
  await page.locator('[data-action=feature-edit]').first().click();
  const form=page.locator('[data-hm-editor]');await form.locator('[name=animationStart][value='+value+']').check();await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});
 }
 const saved=(await f.call('/public/site')).body.documents;assert.equal(saved['page:home'].value.blocks[0].animationStart,'auto');assert.equal(saved['page:aktuell'].value.blocks[0].animationStart,'manual');
 assert.deepEqual(errors,[]);console.log('PASS: anonymous public feed, full navigation, kiosk catalog/login, Dating overview, per-carousel start mode, fullscreen Play and responsive layout.');
}finally{await browser.close();}
