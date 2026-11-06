import {publishBrowserSite} from './browser-site-fixture.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import worker from './worker-test-loader.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),site='https://joern-kaemper.de',api='https://tfb-api.calvinjohncamp.workers.dev';
const f=await fixture();await publishBrowserSite(f);const browser=await chromium.launch({headless:true});let collectRequests=0;const errors=[];
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
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ttf':'font/ttf','.json':'application/json'};
  try{return route.fulfill({body:readFileSync(path),contentType:types[extname(path)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
 });
 await page.goto(site);await page.waitForSelector('#tfb-splash');await page.evaluate(()=>document.fonts.ready);return {page,context};
}
try{
 const guest=await open();assert.equal(await guest.page.locator('#tfb-splash button').count(),2);
 assert.deepEqual(await guest.page.locator('#tfb-splash [data-partner-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.partnerId)),['bmw-kaltenbach-gruppe']);
 assert.equal(await guest.page.locator('#tfb-splash .pbsp-kicker').textContent(),'Präsentiert von unserem Premium-Partner');
 assert.equal(await guest.page.locator('[data-action="partner-report"]').count(),0);
 await guest.page.locator('.tfb-splash-partners').scrollIntoViewIfNeeded();await guest.page.waitForTimeout(1600);assert.equal(collectRequests,0);
 await guest.page.locator('[data-action="splash-enter"]').click();await guest.page.evaluate(()=>location.hash='#partner');await guest.page.waitForSelector('.partner-admin');assert.match(await guest.page.locator('.partner-admin').innerText(),/nur für angemeldete Admins/);
 const pairs=[];
 for(const hash of ['#chat','#aktuell','#chat','#club/archiv']){
  await guest.page.evaluate(target=>{location.hash=target;},hash);
  await guest.page.waitForFunction(target=>document.querySelector('#view [data-partner-rotation]')?.dataset.partnerRotation===target,hash.slice(1).split('/')[0]);
  await guest.page.waitForSelector('#view .pbsp-tile:nth-child(2)');
  const pair=await guest.page.locator('#view .pbsp-tile').evaluateAll(nodes=>nodes.map(n=>n.dataset.partnerId).sort().join('|'));
  assert.notEqual(pair,pairs.at(-1));
  pairs.push(pair);
 }
 const {page}=await open(true);assert.equal(await page.evaluate(()=>TFB.ui.isAdmin()),true,'Server admin session should be restored');
 await page.locator('[data-action="splash-enter"]').click();await page.locator('[data-action="profile"]').click();await page.waitForSelector('.acct');
 assert.equal(await page.locator('.acct [data-action="sync-import"]').count(),0);
 assert.equal(await page.locator('.acct .membership-notice').count(),0);
 assert.match(await page.locator('.acct-card').first().innerText(),/Mitglied der Tennisfreunde Bielstein/);
 assert.equal(await page.locator('.acct-head').count(),1);
 await page.locator('.sheet-close').click();
 const adminToggle=page.getByRole('button',{name:'Admin-Werkzeuge'});
 if(await adminToggle.getAttribute('aria-pressed')==='false')await adminToggle.click();
 await page.getByRole('link',{name:'Partner verwalten'}).click();
 await page.waitForSelector('[data-partner-row]');
 assert.equal(await page.locator('[data-partner-row]').count(),34);
 assert.equal(await page.getByText('Zahlungseingänge').count(),0);
 await page.getByText('Partnerrotation einstellen',{exact:true}).click();
 const rotationForm=page.locator('[data-editor="partner-rotation"]');
 assert.equal(await rotationForm.locator('[name="regional"]').inputValue(),'1');
 await rotationForm.locator('[name="premium"]').fill('4');
 await rotationForm.getByRole('button',{name:'Gewichte speichern'}).click();
 await page.getByText('Partnerrotation gespeichert',{exact:true}).waitFor();
 assert.equal((await f.call('/public/partner-content')).body.rotation.premium,4);
 await page.locator('[data-action="partner-new"]').click();
 await page.locator('[name="name"]').fill('Unser TFB-Testpartner');
 await page.locator('[name="company"]').fill('TFB Musterfirma');
 assert.equal(await page.locator('[name="tier"]').inputValue(),'regional');
 await page.locator('[name="logoFile"]').setInputFiles({name:'test.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=','base64')});
 await page.locator('[data-editor="partner"] [type="submit"]').click();
 const row=page.locator('[data-partner-row]').filter({hasText:'Unser TFB-Testpartner'});
 await row.waitFor();
 await row.getByRole('button',{name:'Bearbeiten'}).click();
 await page.locator('[name="company"]').fill('Neue TFB Musterfirma');
 await page.locator('[data-editor="partner"] [type="submit"]').click();
 await row.getByText('Neue TFB Musterfirma').waitFor();
 await page.locator('[data-partner-search]').fill('Unser TFB-Testpartner');
 assert.equal(await page.locator('[data-partner-row]').count(),1);
 for(const [width,height] of [[320,740],[390,844],[834,1194],[1194,834],[1440,1100]]){
  await page.setViewportSize({width,height});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Admin ${width}`);
 }
 await row.getByRole('button',{name:'Entfernen'}).click();
 await page.locator('[data-editor="partner-remove"] [type="submit"]').click();
 await row.waitFor({state:'detached'});
 await page.locator('[data-partner-search]').clear();
 await page.screenshot({path:'/tmp/tfb-new-partners/admin-preview.png'});
 const secondPremium=(await f.call('/admin/partners',undefined,f.adminToken)).body.partners.find(p=>p.tier==='regional');
 assert.equal((await f.call('/admin/partners/save',{id:secondPremium.id,revision:secondPremium.revision,partner:{...secondPremium,tier:'premium'}},f.adminToken)).status,200);
 await page.locator('[data-action="splash-edit"]').click();
 await page.locator('[name="premiumCount"]').selectOption('2');
 await page.locator('[name="headline"]').fill('Hier ist TFB');await page.locator('[name="eyebrowEnabled"]').uncheck();await page.locator('[name="footEnabled"]').uncheck();await page.locator('[name="eyebrowText"]').fill('Unser Verein');await page.locator('[data-editor="splash"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 // Entry always returns Home, including a restored Kiosk route and admin re-entry.
 for(const [width,height] of [[320,740],[390,844],[834,1194],[1194,834],[1440,1100]]){
  await page.setViewportSize({width,height});
  for(const previous of ['#kiosk','#club','#partner','#home']){
   await page.evaluate(hash=>{location.hash=hash;},previous);
   await page.waitForFunction(hash=>document.querySelector('#view').dataset.view===hash.slice(1),previous);
   await page.evaluate(()=>TFB.partnerVisibility.show(true));
   await page.locator('[data-action="splash-enter"]').click();
   await page.waitForFunction(()=>location.hash==='#home'&&document.querySelector('#view').dataset.view==='home'&&document.querySelector('#tfb-splash').hidden);
   await page.waitForSelector('#view .pbsp-duo');
  }
 }
 await page.evaluate(()=>{location.hash='#kiosk';});
 // Simulate an expired Splash visit on reload; pagehide normally renews it.
 await page.addInitScript(()=>sessionStorage.removeItem('tfb_splash_visit_v1'));
 await page.waitForFunction(()=>document.querySelector('#view').dataset.view==='kiosk');
 await page.reload();await page.waitForSelector('#tfb-splash:not([hidden])');
 assert.equal(await page.evaluate(()=>location.hash),'#kiosk','Reload restores Kiosk beneath Splash');
 await page.locator('[data-action="splash-enter"]').click();
 await page.waitForFunction(()=>location.hash==='#home'&&document.querySelector('#view').dataset.view==='home');
 await page.waitForSelector('#view .pbsp-duo');
 await page.evaluate(()=>TFB.partnerVisibility.show(true));
 const newGuest=await open();
 assert.deepEqual(await newGuest.page.locator('#tfb-splash [data-partner-id]').evaluateAll(nodes=>nodes.map(n=>n.dataset.partnerId)),['bmw-kaltenbach-gruppe',secondPremium.id]);
 assert.equal(await newGuest.page.locator('#tfb-splash .pbsp-kicker').textContent(),'Präsentiert von unseren Premium-Partnern');
 assert.match(await newGuest.page.locator('#tfb-splash h1').innerText(),/Hier ist TFB/,'splash text persists centrally across devices');
 assert.equal(await newGuest.page.locator('#tfb-splash .tfb-splash-message .tfb-splash-eyebrow').count(),0);assert.equal(await newGuest.page.locator('#tfb-splash .tfb-splash-foot').count(),0);
 await page.locator('[data-action="splash-enter"]').click();
 if(await adminToggle.getAttribute('aria-pressed')==='false')await adminToggle.click();
 await page.locator('[data-action="splash-edit"]').click();await page.locator('[name="premiumCount"]').selectOption('1');await page.locator('[name="eyebrowEnabled"]').check();await page.locator('[name="footEnabled"]').check();await page.locator('[data-editor="splash"] [type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('#sheet-root.open'));
 const checkGuest=await open();assert.equal(await checkGuest.page.locator('#tfb-splash [data-partner-id]').count(),1);assert.equal(await checkGuest.page.locator('#tfb-splash .tfb-splash-message .tfb-splash-eyebrow').textContent(),'Unser Verein');assert.equal(await checkGuest.page.locator('#tfb-splash .tfb-splash-foot').count(),1);await checkGuest.context.close();
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
 console.log('Passed: real-worker browser integration, admin-only access, central partner creation, editing and removal, search, cross-device splash text, equal-sized partner blocks, responsive layout, measurement disabled.');
}finally{await browser.close();}
