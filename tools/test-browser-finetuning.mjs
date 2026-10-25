import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
const f=await fixture();
for(let i=0;i<25;i++)f.env.DB.sqlite.prepare("INSERT INTO members(id,first_name,last_name,updated_at) VALUES (?,?,?,?)").run('sample-'+i,'Person '+i,'Example '+String(i).padStart(2,'0'),Date.now());
let state=(await f.state()).body;assert.equal(state.demoTally.length,19);assert.ok(state.demoTally.every(r=>r.isDemo&&!r.isMe));assert.ok(state.demoTally.every(r=>Object.values(r.counts).reduce((a,b)=>a+b,0)===r.total));
assert.equal(state.records.filter(r=>r.kind==='item').length,0);
assert.equal((await f.commit([{kind:'group',id:'simple',revision:0,value:{name:'People only',members:[f.admin.id],pending:[f.otherId]}}])).status,200);
state=(await f.state()).body;assert.equal(state.meetings.groups[0].weekday,undefined);
console.log('Server: 19 separate sample rows; no fake bookings; groups without schedule persist.');
const root=fileURLToPath(new URL('../',import.meta.url));
const browser=await chromium.launch({headless:true});
try{
const page=await browser.newPage({timezoneId:'Europe/Berlin',serviceWorkers:'block',viewport:{width:1100,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!=='http://tfb-test.invalid')return route.abort();const p=resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));try{return route.fulfill({body:readFileSync(p),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.jpg':'image/jpeg'})[extname(p)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
await page.goto('http://tfb-test.invalid/#home');await page.waitForFunction(()=>window.TFB?.ui);
await page.evaluate(()=>{const db=JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));db.accounts.push({memberId:'m-demo',password:'test-password'});localStorage.setItem('tfb_kiosk_demo_v1',JSON.stringify(db));localStorage.setItem('tfb_kiosk_demo_session_v1','m-demo');});
await page.reload();await page.waitForFunction(()=>TFB.ui.state.member);
await page.evaluate(()=>location.hash='#treffen');
await page.locator('[data-action="meet-group"].add').click();let form=page.locator('[data-group-form]');assert.equal(await form.locator('[name="weekday"],[name="time"],[name="place"]').count(),0);
await form.locator('[name="name"]').fill('Testgruppe');await form.locator('[name="search"]').fill('Klein');await form.locator('[data-add]').first().click();await form.locator('[type="submit"]').click();await page.waitForSelector('.meet-group:has-text("Testgruppe")');
await page.getByRole('button',{name:'Training anlegen',exact:true}).click();form=page.locator('[data-meet-form]');assert.equal(await form.locator('[name="title"]').count(),1);await form.locator('[name="title"]').fill('Eigenständiger Trainingsname');await form.locator('[name="place"]').fill('Tennishalle');assert.equal(await form.locator('.meet-kinds,.meet-often').count(),0);
for(const width of [1100,834,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:`/tmp/tfb-finetuning-${width}.png`});}
await form.locator('[type="submit"]').click();await page.waitForSelector('[data-action="meet-series"]');await page.evaluate(()=>location.hash='#treffen');assert.match(await page.locator('.meet-series-list').innerText(),/Eigenständiger Trainingsname/);
await page.evaluate(async()=>{await TFB.api.signOut();TFB.ui.state.member=null;await TFB.ui.renderView();location.hash='#kiosk';});
await page.locator('[data-form="auth"]').waitFor();
await page.evaluate(()=>{TFB.api.signIn=async()=>{const db=JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));localStorage.setItem('tfb_kiosk_demo_session_v1','m-demo');return db.members.find(m=>m.id==='m-demo');};TFB.api.lookupEmail=async()=>({known:true,hasPassword:true});});
await page.locator('[name="email"]').fill('test@example.invalid');await page.locator('[data-form="auth"] [type="submit"]').click();await page.locator('[name="password"]').fill('synthetic-pass');await page.locator('[data-form="auth"] [type="submit"]').click();await page.waitForFunction(()=>location.hash==='#home');
assert.deepEqual(errors,[]);
console.log('Browser: people-only group, member selection, independent weekly training and responsive layout pass.');
}finally{await browser.close();}
