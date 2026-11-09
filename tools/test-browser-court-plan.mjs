import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {chromium,webkit} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import {publishBrowserSite} from './browser-site-fixture.mjs';
import worker from './worker-test-loader.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const engine of [chromium,webkit]){
 const browser=await engine.launch();
 try {for(const width of (process.env.TFB_LIVE?[390,834]:[375,390,760,834,1440])){
  const f=await fixture();await publishBrowserSite(f);
  const c=await browser.newContext({viewport:{width,height:1100},serviceWorkers:'block'}),errors=[];
  await c.route('**/*',async route=>{
   const req=route.request(),u=new URL(req.url());
   if(u.hostname==='tfb-api.calvinjohncamp.workers.dev'){
    const r=await worker.fetch(new Request('https://tfb-api.test'+u.pathname+u.search,{method:req.method(),headers:{...req.headers(),'CF-Connecting-IP':'192.0.2.38'},...(req.postData()?{body:req.postData()}:{})}),f.env);
    return route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});
   }
   if(u.hostname!=='joern-kaemper.de')return route.abort();
   if(process.env.TFB_LIVE)return route.continue();
   const path=u.pathname==='/'?'/index.html':u.pathname;
   try{return route.fulfill({body:readFileSync(resolve(root,'.'+decodeURIComponent(path))),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.json':'application/json','.webmanifest':'application/manifest+json'})[extname(path)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}
  });
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(12000);
  await p.goto('https://joern-kaemper.de/#sport/platzbelegung');await p.locator('[data-action=splash-enter]').click();
  await p.locator('nav[aria-label="Bereiche"] a[href="#sport"]').click();
  await p.getByRole('link',{name:'Platzbelegung',exact:true}).click();
  const plan=p.locator('.court-plan');await plan.waitFor();
  assert.equal(await p.locator('.sport-switch [aria-current=page]').innerText(),'Platzbelegung');
  const tabs=await p.locator('.sport-switch a').evaluateAll(es=>es.map(e=>Math.round(e.getBoundingClientRect().top)));assert.equal(new Set(tabs).size,1,'All three Sport buttons stay in one row');
  assert.equal(await plan.locator('.cp-event').count(),4);assert.equal(await plan.locator('.cp-lane h4').allTextContents().then(x=>x.map(v=>v.trim().replace(/\s+/g,' '))).then(x=>JSON.stringify(x)),JSON.stringify(['Platz 1','Platz 2','Platz 3','Platz 4','Platz 6','Platz 7']));
  assert.match(await plan.innerText(),/Sommer 2027/i);
  await plan.getByRole('button',{name:'Dienstag',exact:true}).click();assert.equal(await plan.locator('.cp-event').count(),6);
  assert.match(await plan.locator('.cp-event').filter({hasText:'Tr. Johann'}).innerText(),/17:00–21:00 Uhr/);
  await plan.getByRole('button',{name:'Mittwoch',exact:true}).click();assert.equal(await plan.locator('.cp-event').count(),7);
  await plan.getByRole('button',{name:'Ganze Woche',exact:true}).click();assert.equal(await plan.locator('.cp-event').count(),29);assert.equal(await plan.locator('.cp-day').count(),7);
  // Every visible event must fit its box, including the one-hour trainer entry.
  assert.deepEqual(await plan.locator('.cp-event').evaluateAll(es=>es.filter(e=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)),[]);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await plan.getByRole('button',{name:'Samstag',exact:true}).click();assert.equal(await plan.locator('.cp-event').count(),0);assert.match(await plan.locator('.cp-empty').innerText(),/keine festen Belegungen/);
  // Keyboard activation uses native buttons and keeps focus on the selected day.
  await plan.getByRole('button',{name:'Donnerstag',exact:true}).press('Enter');assert.equal(await plan.locator('.cp-event').count(),8);
  for(const yellow of [false,true]){
   // The actual public color switch has the accessible name "Farbwelt wechseln".
   if(await p.locator('html').evaluate(e=>e.classList.contains('tfb-logo-midnight-amber'))!==yellow)await p.locator('.topbar [data-tfb-brand]').click();
   assert.equal(await plan.evaluate(e=>getComputedStyle(e).getPropertyValue('--cp-accent').trim()),yellow?'#FFC300':'#C4553A');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await p.screenshot({path:`/private/tmp/tfb-court-${engine.name()}-${width}-${yellow?'amber':'crail'}.png`,fullPage:true});
  }
  await p.reload();await plan.waitFor();assert.equal(await p.locator('.sport-switch [aria-current=page]').innerText(),'Platzbelegung');
  await p.locator('[data-action=splash-enter]').click();await p.locator('nav[aria-label="Bereiche"] a[href="#sport"]').click();
  await p.getByRole('link',{name:'Training',exact:true}).click();await p.locator('.training-coaches,.trainer-grid,.club-people').first().waitFor();assert.equal(await p.locator('.court-plan').count(),0);
  await p.getByRole('link',{name:'Mannschaften',exact:true}).click();await p.locator('.team-row').first().waitFor();
  assert.deepEqual(errors,[]);await c.close();console.log(`PASS ${engine.name()} ${width}: 29 assignments, day/week controls, court numbers, empty days, themes, legibility and Sport navigation`);
 }}finally{await browser.close();}
}
