import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import worker from './worker-test-loader.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),site='https://joern-kaemper.de',api='https://tfb-api.calvinjohncamp.workers.dev';
const f=await fixture(),browser=await chromium.launch({headless:true});let collectRequests=0;const errors=[];
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
 const guest=await open();assert.equal(await guest.page.locator('#tfb-splash button').count(),1);
 assert.equal(await guest.page.locator('[data-action="partner-report"]').count(),0);
 await guest.page.locator('.tfb-splash-partners').scrollIntoViewIfNeeded();await guest.page.waitForTimeout(1600);assert.equal(collectRequests,0);
 await guest.page.locator('[data-action="splash-enter"]').click();await guest.page.evaluate(()=>location.hash='#partner');await guest.page.waitForSelector('.partner-admin');assert.match(await guest.page.locator('.partner-admin').innerText(),/nur für angemeldete Admins/);
 const {page}=await open(true);assert.equal(await page.evaluate(()=>TFB.ui.isAdmin()),true,'Server admin session should be restored');
 await page.locator('[data-action="splash-enter"]').click();await page.locator('[data-action="profile"]').click();await page.waitForSelector('.acct');
 assert.equal(await page.locator('.acct [data-action="sync-import"]').count(),0);
 assert.equal(await page.locator('.acct .membership-notice').count(),0);
 assert.match(await page.locator('.acct-card').first().innerText(),/Mitglied der Tennisfreunde Bielstein/);
 assert.equal(await page.locator('.acct-head').count(),1);
 await page.locator('.acct [data-action="splash-open"]').click();await page.locator('[data-action="partner-report"]').click();await page.waitForSelector('[data-partner-row]');
 assert.equal(await page.locator('[data-partner-row]').count(),38);assert.match(await page.locator('.partner-admin-visibility').innerText(),/ausgeschaltet/);
 const id=await page.locator('[data-partner-row]').first().getAttribute('data-partner-row');await page.locator(`[data-action="partner-edit"][data-id="${id}"]`).click();await page.waitForSelector('[data-editor="partner"]');
 await page.locator('[name="name"]').fill('Unser TFB-Testpartner');await page.locator('[name="company"]').fill('TFB Musterfirma');await page.locator('[name="tier"]').selectOption('partner');await page.locator('[name="sample"]').uncheck();await page.locator('[name="status"]').selectOption('contract');
 await page.locator('[name="logoFile"]').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=','base64')});
 await page.locator('[data-editor="partner"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 await page.waitForSelector(`[data-partner-row="${id}"]`);assert.match(await page.locator(`[data-partner-row="${id}"]`).innerText(),/Unser TFB-Testpartner/);
 await page.locator(`[data-action="partner-payment"][data-id="${id}"]`).click();await page.waitForSelector('[data-editor="partner-payment"]');await page.locator('[data-editor="partner-payment"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 await page.waitForFunction(()=>document.querySelector('.partner-admin-payments')?.textContent.includes('Unser TFB-Testpartner'));
 assert.match(await page.locator('.partner-admin-payments').innerText(),/300,00/);
 await page.locator('[data-partner-admin-year]').selectOption('2026');await page.waitForFunction(()=>document.querySelector('.partner-admin-payments')?.textContent.includes('keine Zahlungen'));
 await page.locator('[data-partner-admin-year]').selectOption('2027');await page.waitForFunction(()=>document.querySelector('.partner-admin-payments')?.textContent.includes('Unser TFB-Testpartner'));
 await page.locator('[data-partner-search]').fill('Unser TFB-Testpartner');assert.equal(await page.locator('[data-partner-row]').count(),1);
 for(const [width,height] of [[320,740],[390,844],[834,1194],[1194,834],[1440,1100]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Admin ${width}`);}
 await page.screenshot({path:'/tmp/tfb-partner-admin-v210.png',fullPage:true});
 const download=page.waitForEvent('download');await page.locator('[data-action="partner-admin-export"]').click();assert.match((await download).suggestedFilename(),/TFB-Partner-2027/);
 await page.locator('[data-action="splash-open"]').click();await page.waitForSelector('[data-action="splash-edit"]');await page.locator('[data-action="splash-edit"]').click();await page.locator('[name="headline"]').fill('Hier ist TFB');await page.locator('[name="eyebrowEnabled"]').uncheck();await page.locator('[name="footEnabled"]').uncheck();await page.locator('[name="eyebrowText"]').fill('Unser Verein');await page.locator('[data-editor="splash"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 const newGuest=await open();assert.match(await newGuest.page.locator('#tfb-splash h1').innerText(),/Hier ist TFB/,'splash text persists centrally across devices');
 assert.equal(await newGuest.page.locator('#tfb-splash .tfb-splash-message .tfb-splash-eyebrow').count(),0);assert.equal(await newGuest.page.locator('#tfb-splash .tfb-splash-foot').count(),0);
 await page.locator('[data-action="splash-edit"]').click();await page.locator('[name="eyebrowEnabled"]').check();await page.locator('[name="footEnabled"]').check();await page.locator('[data-editor="splash"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 const checkGuest=await open();assert.equal(await checkGuest.page.locator('#tfb-splash .tfb-splash-message .tfb-splash-eyebrow').textContent(),'Unser Verein');assert.equal(await checkGuest.page.locator('#tfb-splash .tfb-splash-foot').count(),1);await checkGuest.context.close();
 for(const [width,height] of [[320,740],[390,844],[834,1194],[1194,834],[1440,1100]]){await newGuest.page.setViewportSize({width,height});assert.equal(await newGuest.page.locator('#tfb-splash').evaluate(e=>e.scrollWidth>e.clientWidth),false,`Splash ${width}`);await newGuest.page.locator('[data-action="splash-enter"]').click();const duo=newGuest.page.locator('#view .pbsp-duo').first();await duo.waitFor();assert.ok(await duo.evaluate(e=>e.getBoundingClientRect().width)<=560);await newGuest.page.evaluate(()=>TFB.partnerVisibility.show(true));}
 await newGuest.page.waitForTimeout(1300);assert.equal(collectRequests,0,'no traffic collection, including after public navigation');
 // Isolated Step-2 check only: two logos must not double-count page-level visibility.
 f.env.PARTNER_MEASUREMENT_ENABLED='1';
 await newGuest.page.evaluate(()=>{TFB.config.partnerVisibility.enabled=true;});
 await newGuest.page.locator('[data-action="splash-enter"]').click();
 await newGuest.page.locator('#view .pbsp-duo').first().scrollIntoViewIfNeeded();
 await newGuest.page.waitForTimeout(1800);
 const counts=Object.fromEntries(f.env.DB.sqlite.prepare("SELECT kind,SUM(total) AS n FROM partner_daily WHERE page='home' GROUP BY kind").all().map(r=>[r.kind,r.n]));
 assert.equal(counts.pageview,1);assert.equal(counts.partner_view,1);assert.equal(counts.visible,2);
 assert.deepEqual(errors,[]);
 console.log('Passed: real-worker browser integration, admin-only access, central partner/logo/payment editing, year/search/export, cross-device splash text, equal-sized partner blocks, responsive layout, measurement disabled.');
}finally{await browser.close();}
