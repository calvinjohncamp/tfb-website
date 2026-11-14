// Exercise season copies against the real sync worker and a disposable database.
// All HTTP requests are intercepted; no production service is contacted.
import {readFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import worker from './worker-test-loader.mjs';
const f=await fixture(), root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({headless:true,...(process.env.TFB_CHROME_PATH?{executablePath:process.env.TFB_CHROME_PATH}:{})});
const errors=[];
async function device(width=1100){
  const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width,height:900}});
  await ctx.route('**/*',async route=>{
    const r=route.request(),url=new URL(r.url());
    if(url.hostname==='tfb-api.calvinjohncamp.workers.dev'){
      const response=await worker.fetch(new Request('https://tfb-api.test'+url.pathname+url.search,{method:r.method(),headers:{...r.headers(),'CF-Connecting-IP':'192.0.2.5'},...(r.postData()?{body:r.postData()}: {})}),f.env);
      await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});return;
    }
    if(url.hostname!=='joern-kaemper.de'){await route.abort();return;}
    let path=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';
    if(path==='assets/data/rosters.js'){await route.fulfill({status:404,body:''});return;}
    if(!(path==='index.html'||path==='sw.js'||path==='manifest.webmanifest'||path.startsWith('assets/'))||!resolve(root,path).startsWith(root)){await route.abort();return;}
    try {const body=readFileSync(resolve(root,path)),type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'}[extname(path)]||'application/octet-stream';await route.fulfill({body,contentType:type});}catch{await route.fulfill({status:404,body:''});}
  });
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto('https://joern-kaemper.de/#chat');await page.waitForFunction(()=>TFB.ui&&TFB.api.centralSync);
  return {ctx,page};
}
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const future=n=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
try {
 const group={id:'season-group',name:'Herren 55',createdBy:f.admin.id,members:[f.admin.id,f.otherId],pending:[]};
 const series={id:'legacy-series',kind:'training',groupId:group.id,title:'Training Winter',time:'18:00',place:'Halle',note:'Erhalten',createdBy:f.admin.id,invitees:[f.admin.id,f.otherId],slots:null,from:future(1),until:future(70),leadDays:7,skipped:[future(8)]};
 assert.equal((await f.commit([{kind:'group',id:group.id,revision:0,value:group},{kind:'series',id:series.id,revision:0,value:series}],f.adminToken,{importing:true})).status,200);
 const signIn=async(device, token) => {
   await device.page.evaluate(token=>sessionStorage.setItem('tfb_directory_token_v1',token),token);
   await device.page.reload();
   await device.page.waitForFunction(()=>TFB.ui?.state.member);
   await device.page.evaluate(async()=>{
     TFB.loadSite=async()=>({pages:{}});
     location.hash='#treffen';
     await TFB.ui.renderView('treffen');
   });
 };
 const desktop=await device(),phone=await device(390),guest=await device(390);
 await Promise.all([signIn(desktop,f.adminToken),signIn(phone,f.adminToken),signIn(guest,f.otherToken)]);
 const formatted = value => new Intl.DateTimeFormat('de-DE',{timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
 for (const {page} of [desktop,phone]) {
   const winter = page.locator('.meet-series[data-id=legacy-series]');
   await winter.getByText('Aktiv',{exact:true}).waitFor();
   assert.ok((await winter.innerText()).includes(`von ${formatted(series.from)} bis ${formatted(series.until)}`));
   const match = page.locator('.meet-card-link').filter({hasText:'Training Winter'});
   await match.first().waitFor();
   const badge = match.first().locator('.date-badge');
   for (const [yellow,bg,ink] of [[true,'rgb(0, 29, 61)','rgb(255, 195, 0)'],[false,'rgb(196, 85, 58)','rgb(255, 255, 255)']]) {
     await page.evaluate(value => document.documentElement.classList.toggle('tfb-logo-midnight-amber',value),yellow);
     for (const control of [badge,winter.locator('.meet-series-active')]) {
       const colors = await control.evaluate(el => ({
         bg:getComputedStyle(el).backgroundColor,
         ink:getComputedStyle(el).color,
         children:[...el.querySelectorAll('small,b')].map(child => getComputedStyle(child).color),
       }));
       assert.equal(colors.bg,bg);
       assert.equal(colors.ink,ink);
       assert.ok(colors.children.every(color => color===ink));
     }
   }
 }
 // Copy a season from an existing series without changing its invitations or answers.
 await phone.page.locator('[data-action="meet-series"][data-id="legacy-series"]').click();
 const seriesEditor=phone.page.locator('[data-series-form]');
 const copyButton=seriesEditor.getByRole('button',{name:'Als neue Serie speichern'});
 await copyButton.click();
 await seriesEditor.getByText('Bitte einen neuen Namen für die Kopie eingeben.').waitFor();
 const original=await phone.page.evaluate(()=>TFB.meet.snapshot().series.find(s=>s.id==='legacy-series'));
 await seriesEditor.locator('[name=title]').fill('Training Sommer');
 await seriesEditor.locator('[name=from]').fill(future(5));
 await seriesEditor.locator('[name=until]').fill(future(75));
 await copyButton.click();
 await seriesEditor.waitFor({state:'detached'});
 await desktop.page.waitForFunction(()=>TFB.meet.snapshot().series.some(s=>s.title==='Training Sommer'),null,{timeout:18000});
 const summer=await desktop.page.evaluate(()=>TFB.meet.snapshot().series.find(s=>s.title==='Training Sommer'));
 assert.notEqual(summer.id,original.id);
 assert.equal(summer.active,false);
 assert.equal(summer.groupId,original.groupId);
 assert.deepEqual(summer.invitees,original.invitees);
 assert.equal(summer.note,original.note);
 assert.equal(summer.time,original.time);
 assert.equal(summer.place,original.place);
 assert.equal(summer.leadDays,original.leadDays);
 assert.equal(summer.from,future(5));
 assert.equal(summer.until,future(75));
 assert.deepEqual(summer.skipped,[]);
 assert.deepEqual(summer.reservedDates,[]);
 assert.deepEqual(await desktop.page.evaluate(()=>TFB.meet.snapshot().series.find(s=>s.id==='legacy-series')),original);
 assert.equal(await desktop.page.evaluate(id=>TFB.meet.snapshot().meets.some(m=>m.seriesId===id),summer.id),false);
 assert.equal(await guest.page.getByText('Training Sommer',{exact:true}).count(),0);
 const summerCard = phone.page.locator(`.meet-series[data-id="${summer.id}"]`);
 await summerCard.getByText('Inaktiv',{exact:true}).waitFor();
 assert.ok((await summerCard.innerText()).includes(`von ${formatted(summer.from)} bis ${formatted(summer.until)}`));
 assert.equal(await summerCard.locator('.meet-series-active').count(),0);
 await phone.page.locator(`[data-action="meet-series"][data-id="${summer.id}"]`).click();
 await seriesEditor.locator('[name=active]').selectOption('yes');
 await seriesEditor.getByRole('button',{name:'Änderungen speichern'}).click();
 await seriesEditor.waitFor({state:'detached'});
 await desktop.page.waitForFunction(id=>TFB.meet.snapshot().series.find(s=>s.id===id)?.active,summer.id,{timeout:18000});
 await summerCard.getByText('Aktiv',{exact:true}).waitFor();
 const active=await f.state(f.otherToken);
 assert.ok(active.body.meetings.meets.some(m=>m.seriesId===summer.id));
 assert.ok(active.body.meetings.meets.some(m=>m.seriesId===series.id));
 assert.deepEqual(errors,[]);
 console.log('Series copy, validation, separate identity, sync, invitation pause and activation verified.');
} finally { await browser.close(); }
