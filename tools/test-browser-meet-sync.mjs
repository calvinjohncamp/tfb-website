// Two independent browser profiles against the actual worker + disposable SQLite.
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
let interrupted=false,importRequests=0;
const errors=[];
async function device(width=1100){
  const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width,height:900}});
  await ctx.route('**/*',async route=>{
    const r=route.request(),url=new URL(r.url());
    if(url.hostname==='tfb-api.calvinjohncamp.workers.dev'){
      if(interrupted==='secondImport'&&url.pathname==='/app/commit'&&++importRequests===2){await route.abort('failed');return;}
      if(interrupted==='before'&&url.pathname==='/app/commit'){await route.abort('failed');return;}
      const response=await worker.fetch(new Request('https://tfb-api.test'+url.pathname+url.search,{method:r.method(),headers:{...r.headers(),'CF-Connecting-IP':'192.0.2.5'},...(r.postData()?{body:r.postData()}: {})}),f.env);
      if(interrupted==='after'&&url.pathname==='/app/commit'){await route.abort('failed');return;}
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
async function login(page){await page.evaluate(async()=>{TFB.ui.state.member=await TFB.api.signIn('test@example.invalid','Synthetic password only 123!');});}
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const future=n=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
try {
 const desktop=await device(),tablet=await device(834),phone=await device(390),guest=await device(390);
 await desktop.page.evaluate(({owner,other,date,until})=>{
  const group={id:'legacy-group',name:'Bisherige Trainingsgruppe',createdBy:owner,members:[owner,other],pending:[],weekday:3,time:'18:00',place:'Platz 2'};
  const series={id:'legacy-series',kind:'training',groupId:group.id,title:'Bisheriges wöchentliches Training',time:'18:00',place:'Platz 2',note:'Erhalten',createdBy:owner,invitees:[owner,other],slots:null,from:date,until,leadDays:3,skipped:[]};
  const meet={id:'legacy-meeting',...series,seriesId:series.id,date,responses:{[owner]:{a:'yes',at:Date.now()-60000,note:''},[other]:{a:'no',at:Date.now()-30000,note:'Originalnotiz'}}};
  localStorage.setItem('tfb_meet_demo_v2',JSON.stringify({groups:[group],series:[series],meets:[meet],inbox:[1,2,3].map(n=>({id:`legacy-notice-${n}`,to:owner,type:"yes",from:other,meetId:meet.id,snap:{title:meet.title,date,time:meet.time},at:Date.now()-n*60000,read:false})),noSampleGroups:true}));
 },{owner:f.admin.id,other:f.otherId,date:future(1),until:future(29)});
 await desktop.page.reload();await desktop.page.waitForFunction(()=>TFB.ui&&TFB.meet);
 interrupted='secondImport';
 await assert.rejects(()=>login(desktop.page));
 interrupted=false;
 await desktop.page.reload();await desktop.page.waitForFunction(()=>TFB.ui?.state.member);
 assert.equal(f.env.DB.sqlite.prepare("SELECT COUNT(*) AS n FROM app_records WHERE kind='meet-notice' AND id LIKE 'legacy-notice-%'").get().n,3,'Interrupted migration resumes remaining notices');
 await login(tablet.page);await login(phone.page);
 for(const d of [desktop,tablet,phone]){
  await d.page.evaluate(()=>{location.hash='#treffen';});
  await d.page.waitForSelector('[data-action="meet-group"][data-id="legacy-group"]');
  assert.equal(await d.page.evaluate(()=>TFB.meet.snapshot().series[0].title),'Bisheriges wöchentliches Training');
  assert.equal(await d.page.evaluate(id=>TFB.meet.snapshot().meets[0].responses[id].note,f.otherId),'Originalnotiz');
 }
 await guest.page.evaluate(token=>sessionStorage.setItem('tfb_directory_token_v1',token),f.otherToken);
 await guest.page.reload();await guest.page.waitForFunction(()=>TFB.ui?.state.member);await guest.page.evaluate(()=>{location.hash='#treffen';});
 // Create a group using the actual iPad form and confirm it as the invited person.
 await tablet.page.locator('[data-action="meet-group"]:not([data-id])').click();
 await tablet.page.locator('[data-group-form] [name=name]').fill('Neue iPad-Gruppe');
 await tablet.page.locator('[data-group-form] [name=search]').fill('Other');
 await tablet.page.locator('[data-group-form] [data-add]').click();
 await tablet.page.locator('[data-group-form] [type=submit]').click();
 await tablet.page.locator('[data-group-form]').waitFor({state:'detached'});
 const gid=await tablet.page.evaluate(()=>TFB.meet.snapshot().groups.find(g=>g.name==='Neue iPad-Gruppe').id);
 await guest.page.locator(`[data-action="group-answer"][data-id="${gid}"]`).waitFor({timeout:18000});
 await guest.page.locator(`[data-action="group-answer"][data-id="${gid}"]`).click();
 await guest.page.locator('[data-group-answer] [data-g=yes]').click();
 await guest.page.locator('[data-group-answer]').waitFor({state:'detached'});
 await tablet.page.waitForFunction(({gid,other})=>TFB.meet.snapshot().groups.find(g=>g.id===gid)?.members.includes(other),{gid,other:f.otherId},{timeout:18000});
 // Create weekly training through the iPad editor; first occurrence is generated centrally.
 await tablet.page.locator(`[data-action="meet-group"][data-id="${gid}"]`).click();
 await tablet.page.locator('[data-group-form] [data-start]').click();
 await tablet.page.locator('[data-meet-form] [data-weekly="1"]').click();
 await tablet.page.locator('[data-meet-form] [name=title]').fill('Training vom iPad');
 await tablet.page.locator('[data-meet-form] [name=leadDays]').selectOption('7');
 await tablet.page.locator('[data-meet-form] [type=submit]').click();
 await tablet.page.locator('[data-meet-form]').waitFor({state:'detached'});
 await phone.page.waitForFunction(()=>TFB.meet.snapshot().series.some(s=>s.title==='Training vom iPad'),null,{timeout:18000});
 const mid=await phone.page.evaluate(()=>TFB.meet.snapshot().meets.find(m=>m.title==='Training vom iPad').id);
 await guest.page.waitForFunction(id=>TFB.meet.snapshot().meets.some(m=>m.id===id),mid,{timeout:18000});
 await guest.page.evaluate(id=>{location.hash='#treffen/'+id;},mid);
 await guest.page.locator('[data-action="meet-answer"][data-answer=yes]').click();
 await phone.page.waitForFunction(({mid,other})=>TFB.meet.snapshot().meets.find(m=>m.id===mid)?.responses[other]?.a==='yes',{mid,other:f.otherId},{timeout:18000});
 // A kiosk purchase on the iPad must appear on the iPhone and desktop too.
 await tablet.page.evaluate(async()=>{await TFB.api.acceptConsent();await TFB.api.addToTab('koelsch',1);});
 for(const d of [phone,desktop]){
  await d.page.reload();await d.page.waitForFunction(()=>TFB.ui?.state.member);
  assert.equal(await d.page.evaluate(async()=>(await TFB.api.myOpenMonth()).totalCents),180);
  assert.equal(await d.page.evaluate(()=>TFB.meet.snapshot().groups.filter(g=>g.name==='Neue iPad-Gruppe').length),1);
  assert.equal(await d.page.evaluate(()=>TFB.meet.snapshot().series.filter(s=>s.title==='Training vom iPad').length),1);
 }
 // Simulated replies must not alter real member responses after waiting.
 assert.equal(await desktop.page.evaluate(({mid,other})=>TFB.meet.snapshot().meets.find(m=>m.id===mid).responses[other].a,{mid,other:f.otherId}),'yes');
 await phone.page.screenshot({path:'/tmp/tfb-meet-sync-phone.png'});
 assert.deepEqual(errors,[]);
 console.log('Desktop/iPad/iPhone: alte Gruppe/Serie/Antworten erhalten, neue Gruppe und Training am iPad, echte Gruppenbestätigung und Zusage, Kiosk-Kauf auf allen Geräten, Neustart und keine doppelten Termine geprüft.');
} finally {await browser.close();}
