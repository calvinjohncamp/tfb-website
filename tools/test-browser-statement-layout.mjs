import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {chromium,webkit} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import {publishBrowserSite} from './browser-site-fixture.mjs';
import worker from './worker-test-loader.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const sizes=process.env.TFB_LIVE?[[834,1194],[1194,834]]:[[390,844],[844,390],[768,1024],[834,1194],[1024,768],[1194,834],[1366,1024],[1440,1000]];
for(const engine of [chromium,webkit]){
 const f=await fixture();await publishBrowserSite(f);
 await f.commit([{kind:'account',id:f.admin.id,revision:0,value:{consentVersion:'tfb-kiosk-preparation-v1',consentedAt:new Date().toISOString()}}]);
 const current=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'}).slice(0,7),year=current.slice(0,4),september=`${Number(current.slice(5))>=9?year:Number(year)-1}-09`;
 const insert=f.env.DB.sqlite.prepare('INSERT INTO kiosk_entries(id,member_id,member_name,product_id,product_name,price_cents,created_at) VALUES (?,?,?,?,?,?,?)');
 for(const [id,month,day,price]of[['one',current,'01',12460],['two',current,'05',4940],['long',september,'01',22300]])insert.run(id,f.admin.id,'Demo Owner','water','Wasser',price,`${month}-${day}T10:00:00Z`);
 const before=f.env.DB.sqlite.prepare('SELECT COUNT(*) n,SUM(price_cents) total FROM kiosk_entries').get();
 const browser=await engine.launch();try{
  const c=await browser.newContext({viewport:{width:1194,height:834},serviceWorkers:'block'});await c.addInitScript(t=>sessionStorage.setItem('tfb_directory_token_v1',t),f.adminToken);
  await c.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());
   if(u.hostname==='tfb-api.calvinjohncamp.workers.dev'){const r=await worker.fetch(new Request('https://tfb-api.test'+u.pathname+u.search,{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.39'},...(req.postData()?{body:req.postData()}:{})}),f.env);return route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});}
   if(u.hostname!=='joern-kaemper.de')return route.abort();if(process.env.TFB_LIVE)return route.continue();const path=u.pathname==='/'?'/index.html':u.pathname;
   try{return route.fulfill({body:readFileSync(resolve(root,'.'+decodeURIComponent(path))),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.json':'application/json'})[extname(path)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(12000);await p.goto('https://joern-kaemper.de/');await p.locator('[data-action=splash-enter]').click();await p.locator('[data-action=admin-toggle]').click();await p.locator('nav[aria-label=Bereiche] a[href="#kiosk"]').click();await p.locator('a.kiosk-link[href="#abrechnungen"]').click();await p.locator('[data-kb-member-view] .kb-calendar-pair').waitFor();
  for(const [width,height] of sizes){await p.setViewportSize({width,height});
   for(const yellow of [false,true]){
    if(await p.locator('html').evaluate(e=>e.classList.contains('tfb-logo-midnight-amber'))!==yellow)await p.locator('.topbar [data-tfb-brand]').click();
    const check=await p.locator('.kb-calendar-pair').evaluate(el=>{
     const r=el.getBoundingClientRect(),viewElement=document.querySelector('#view'),view=viewElement.getBoundingClientRect(),viewStyle=getComputedStyle(viewElement),available=view.width-parseFloat(viewStyle.paddingLeft)-parseFloat(viewStyle.paddingRight),a=el.children[0].getBoundingClientRect(),b=el.children[1].getBoundingClientRect();
     const clipped=[...el.querySelectorAll('.kb-month')].flatMap(cell=>[...cell.children].filter(child=>{const c=child.getBoundingClientRect(),box=cell.getBoundingClientRect();return c.bottom>box.bottom+1||c.right>box.right+1||c.top<box.top-1||c.left<box.left-1;}).map(e=>e.textContent));
     const title=el.querySelector('.kb-month-title strong').getBoundingClientRect(),sum=el.querySelector('.kb-month-sum').getBoundingClientRect(),selected=el.querySelector('.kb-month.is-selected');
     return{width:r.width,view:available,side:Math.abs(a.top-b.top)<2,stack:b.top>=a.bottom,clipped,overlap:title.right>sum.left-4,shadow:getComputedStyle(selected).boxShadow,radius:getComputedStyle(selected).borderRadius,gridGap:getComputedStyle(el.querySelector('.kb-months')).gap,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.ok(check.width>=check.view-2,`Uses whole view at ${width}: ${JSON.stringify(check)}`);assert.equal(check.overflow,false);assert.deepEqual(check.clipped,[]);assert.equal(check.overlap,false);assert.equal(width>=1000?check.side:check.stack,true);assert.match(check.shadow,/inset/);assert.equal(check.radius,'8px');assert.notEqual(check.gridGap,'0px');
    assert.match(await p.locator('.kb-month.is-selected b').innerText(),/174,00/);
    await p.evaluate(()=>{window.scrollTo(0,0);return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});await p.screenshot({animations:'disabled',path:`/private/tmp/tfb-statements-${engine.name()}-${width}x${height}-${yellow?'amber':'crail'}.png`,fullPage:true});
   }
   // A long month name must also fit the summary header.
   if(september.slice(0,4)===year){await p.locator(`.kb-month[data-key="${september}"]`).click();await p.waitForFunction(key=>document.querySelector('.kb-month.is-selected')?.dataset.key===key,september);assert.match(await p.locator('.kb-month-title strong').innerText(),/September/);assert.equal(await p.locator('.kb-month-title strong').evaluate(e=>e.getBoundingClientRect().right<=e.closest('.kb-day-picker-head').querySelector('.kb-month-sum').getBoundingClientRect().left-4),true);await p.locator(`.kb-month[data-key="${current}"]`).click();await p.waitForFunction(key=>document.querySelector('.kb-month.is-selected')?.dataset.key===key,current);}
   console.log(`PASS ${engine.name()} ${width}x${height}: full width, readable fields, clean selection, long month header, both palettes`);
  }
  const key=await p.locator('.kb-calendar-days .has-turnover').first().getAttribute('data-key');await p.locator(`.kb-calendar-days [data-key="${key}"]`).click();await p.waitForFunction(()=>document.querySelector('.kb-calendar-days [aria-pressed=true]'));await p.locator('.kb-day-picker-head button').click();await p.waitForFunction(()=>document.querySelector('.kb-day-picker-head button[aria-pressed=true]'));
  await p.locator('.tfb-admin-links a[href="#kioskabrechnung"]').click();await p.locator('[data-kb-admin-view] .kb-calendar-pair').waitFor();assert.equal(await p.locator('.kb-month').count(),12);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(f.env.DB.sqlite.prepare('SELECT COUNT(*) n,SUM(price_cents) total FROM kiosk_entries').get(),before);assert.deepEqual(errors,[]);await c.close();
 }finally{await browser.close();}
}
