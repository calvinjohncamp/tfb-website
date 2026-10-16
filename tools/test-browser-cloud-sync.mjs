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
let interrupted=false;
const errors=[];
async function device(width=1100){
  const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width,height:900}});
  await ctx.route('**/*',async route=>{
    const r=route.request(),url=new URL(r.url());
    if(url.hostname==='tfb-api.calvinjohncamp.workers.dev'){
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
try {
  const a=await device(), b=await device(390);
  // A synthetic old browser has a photo and chat from the former demo account.
  await a.page.evaluate(()=>{
    const canvas=document.createElement('canvas');canvas.width=600;canvas.height=1000;
    canvas.getContext('2d').fillRect(0,0,600,1000);const large=canvas.toDataURL();canvas.width=100;canvas.height=100;const small=canvas.toDataURL();
    const db=JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
    db.accounts=db.accounts.filter(a=>a.memberId!=='m-demo');db.accounts.push({memberId:'m-demo',avatar:small,avatarLarge:large,feedRules:'yes',consentVersion:'tfb-kiosk-v3',consentedAt:new Date().toISOString()});
    db.community.posts=[{id:'old-post',authorId:'m-demo',scope:'club',text:'Mein alter Chat',images:[],createdAt:'2026-10-01T12:00:00.000Z'}];
    db.items.push({id:'old-tab',memberId:'m-demo',productId:'koelsch',productName:'Kölsch',priceCents:180,status:'open',createdAt:new Date().toISOString()});
    localStorage.setItem('tfb_kiosk_demo_v1',JSON.stringify(db));
  });
  await a.page.reload();await a.page.waitForFunction(()=>TFB.ui&&TFB.api.centralSync);
  await login(a.page);
  assert.equal(await a.page.evaluate(async()=>(await TFB.api.syncMigrationPreview()).posts),1);
  await a.page.evaluate(()=>TFB.api.importLocalSync());
  await a.page.evaluate(()=>TFB.api.importLocalSync()); // no duplicates
  await login(b.page);
  assert.equal(await b.page.evaluate(()=>TFB.ui.state.member.avatarLarge?.length>100),true);
  assert.equal(await b.page.evaluate(async()=>(await TFB.api.posts('club')).filter(p=>p.id==='old-post').length),1);
  assert.equal(await b.page.evaluate(async()=>(await TFB.api.myOpenMonth()).totalCents),180);
  await a.page.evaluate(()=>TFB.api.addPost({scope:'club',text:'Neuer Chat vom Desktop'}));
  await b.page.evaluate(()=>{location.hash='#chat';});
  await b.page.waitForFunction(()=>document.querySelector('#view')?.textContent.includes('Neuer Chat vom Desktop'),{timeout:18000});
  const newPost=await b.page.evaluate(async()=>(await TFB.api.posts('club')).find(p=>p.text==='Neuer Chat vom Desktop'));
  await b.page.evaluate(id=>TFB.api.addComment(id,'Antwort vom iPhone'),newPost.id);
  await a.page.evaluate(()=>TFB.api.addToTab('koelsch',2));
  await b.page.reload();await b.page.waitForFunction(()=>TFB.ui?.state.member?.avatar);
  assert.equal(await b.page.evaluate(async()=>(await TFB.api.myOpenMonth()).totalCents),540);
  assert.equal(await b.page.evaluate(async id=>(await TFB.api.comments(id))[0]?.text,newPost.id),'Antwort vom iPhone');
  // Simulate server committing a write whose response was lost. Reopening must
  // replay the same durable command ID rather than create a second kiosk item.
  interrupted='after';
  const message=await a.page.evaluate(async()=>{try{await TFB.api.addToTab('koelsch',1);return 'unexpected success';}catch(e){return e.message;}});
  assert.notEqual(message,'unexpected success');
  interrupted=false;await a.page.reload();await a.page.waitForFunction(()=>TFB.ui?.state.member?.avatar);
  assert.equal(await a.page.evaluate(async()=>(await TFB.api.myOpenMonth()).totalCents),720);
  await b.page.evaluate(()=>TFB.api.signOut());
  assert.deepEqual(await b.page.evaluate(()=>TFB.api.posts('club')),[]);
  assert.deepEqual(errors,[]);
  console.log('Zwei Geräte: Übernahme ohne Duplikate, automatisches Profilfoto, Bierdeckel, Chats/Kommentare, Aktualisierung, Neustart, unterbrochene Speicherung und Abmeldung geprüft.');
} finally {await browser.close();}
