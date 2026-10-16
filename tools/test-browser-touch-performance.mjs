// Touch navigation under 250 ms simulated API latency, actual worker + disposable SQLite.
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
let interrupted=false; const requests=[];
const errors=[];
async function device(width=1100){
  const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width,height:900},hasTouch:true,isMobile:true,deviceScaleFactor:2});
  await ctx.route('**/*',async route=>{
    const r=route.request(),url=new URL(r.url());
    if(url.hostname==='tfb-api.calvinjohncamp.workers.dev'){
      requests.push(url.pathname);await new Promise(resolve=>setTimeout(resolve,250));
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
  const page=await ctx.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto('https://joern-kaemper.de/#chat');await page.waitForFunction(()=>TFB.ui&&TFB.api.centralSync);
  return {ctx,page};
}
async function login(page){await page.evaluate(async()=>{TFB.ui.state.member=await TFB.api.signIn('test@example.invalid','Synthetic password only 123!');});}
try {
  const d=await device(Number(process.env.TFB_TOUCH_WIDTH)||390),page=d.page;
  const date=new Date(Date.now()+86400000).toISOString().slice(0,10);
  await f.commit([{kind:'account',id:f.admin.id,revision:0,value:{feedRules:'yes',consentVersion:'tfb-kiosk-v3',consentedAt:new Date().toISOString()}},
    {kind:'media',id:'img:touch-photo',revision:0,value:{data:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII='}},
    {kind:'post',id:'touch-post',revision:0,value:{scope:'club',text:'Touch-Testfoto',images:['img:touch-photo']}},
    {kind:'meet',id:'touch-match',revision:0,value:{kind:'einzel',title:'Touch-Test',createdBy:f.admin.id,invitees:[f.admin.id,f.otherId],date,time:'18:00',place:'Platz 1',slots:2}}]);
  await login(page);await page.reload();await page.waitForFunction(()=>TFB.ui?.state.member);
  await page.evaluate(()=>{location.hash='#kiosk';});
  await page.locator('a.deckel').waitFor();
  // Age the local snapshot; still inside the ten-second polling interval.
  await page.waitForTimeout(5100);
  requests.length=0;
  let start=Date.now();
  await page.locator('[data-action=profile]').tap();
  await page.locator('[data-account-form]').waitFor();
  const profileMs=Date.now()-start,profileRequests=[...requests];
  await page.locator('.sheet-close').tap();
  requests.length=0;start=Date.now();
  await page.locator('.topnav a[href="#treffen"]').tap();
  await page.locator('a[href="#treffen/touch-match"]').waitFor();
  const planningMs=Date.now()-start,planningRequests=[...requests];
  requests.length=0;
  await page.locator('a[href="#treffen/touch-match"]').tap();
  await page.locator('.meet-table').waitFor();
  const detailRequests=[...requests];
  await page.evaluate(async()=>{await TFB.api.memberAvatars([TFB.ui.state.member.id]);await TFB.api.memberAvatars([TFB.ui.state.member.id]);});
  const repeatedFaceRequests=requests.filter(p=>p==='/app/faces').length;
  console.log(JSON.stringify({profileMs,profileRequests,planningMs,planningRequests,detailRequests,repeatedFaceRequests}));
  if(!process.env.TFB_PERF_BASELINE){
    assert.equal(profileRequests.filter(p=>p==='/app/state').length,0,'Opening profile does not download the full chat/photo state');
    assert.equal(planningRequests.filter(p=>p==='/members/names').length,0,'Planning uses names already in the synchronized state');
    assert.equal(repeatedFaceRequests,0,'Visible participant photos are already synchronized');
    assert.equal(await page.locator('.topnav a').first().evaluate(el=>getComputedStyle(el).touchAction),'manipulation');
  }
  if(!process.env.TFB_PERF_BASELINE){
    await page.locator('.topnav a[href="#kiosk"]').tap();
    await page.locator('a.deckel').waitFor();
    await page.evaluate(()=>{
      document.addEventListener('click',e=>{if(e.target.closest('a.deckel'))window.coasterTappedAt=performance.now();},true);
      window.addEventListener('hashchange',()=>{if(location.hash==='#abrechnungen')window.coasterDelay=performance.now()-window.coasterTappedAt;});
    });
    await page.locator('a.deckel').tap();
    await page.waitForFunction(()=>Number.isFinite(window.coasterDelay));
    assert.ok(await page.evaluate(()=>window.coasterDelay<200),'Touch coaster navigation has no artificial 480 ms animation delay');
    // A slow earlier navigation must never overwrite the page selected afterwards.
    await page.evaluate(()=>{
      const old=TFB.views.chat;
      TFB.views.chat=()=>new Promise(resolve=>{window.finishSlowView=()=>{TFB.views.chat=old;resolve('<p>STALE VIEW</p>');};});
    });
    await page.locator('.topnav a[href="#chat"]').tap();
    await page.waitForFunction(()=>window.finishSlowView);
    await page.locator('.topnav a[href="#treffen"]').tap();
    await page.locator('a[href="#treffen/touch-match"]').waitFor();
    await page.evaluate(()=>window.finishSlowView());
    assert.ok((await page.locator('#view').innerText()).includes('Dating 2.0'));
    assert.ok(!(await page.locator('#view').innerText()).includes('STALE VIEW'));
    // Buying a synthetic drink must not rewrite all unchanged chat photos.
    const unchangedMedia=await page.evaluate(async()=>{
      let writes=0;const put=IDBObjectStore.prototype.put,revision=TFB.imageRevision;
      IDBObjectStore.prototype.put=function(...args){if(this.name==='images')writes++;return put.apply(this,args);};
      try{await TFB.api.addToTab('koelsch',1);return {writes,before:revision,after:TFB.imageRevision,total:(await TFB.api.myOpenMonth()).totalCents};}
      finally{IDBObjectStore.prototype.put=put;}
    });
    assert.equal(unchangedMedia.writes,0);assert.equal(unchangedMedia.before,unchangedMedia.after);assert.equal(unchangedMedia.total,180);
  }
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'/tmp/tfb-touch-performance-phone.png'});
}finally{await browser.close();}
