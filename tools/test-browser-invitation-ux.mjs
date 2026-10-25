import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './app-sync-fixture.mjs';
import worker from './worker-test-loader.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),f=await fixture();
const ids=['ux-shared','ux-b','ux-extra'];
for(const [i,id] of ids.entries())f.env.DB.sqlite.prepare('INSERT INTO members(id,first_name,last_name,search_text,updated_at) VALUES (?,?,?,?,?)').run(id,['Shared','Second','Extra'][i],'Player',['shared','second','extra'][i]+' player',Date.now());
const groups=[{id:'ux-a',name:'Gruppe A',members:[f.admin.id,f.otherId,ids[0]],pending:[]},{id:'ux-b',name:'Gruppe B',members:[f.admin.id,ids[0],ids[1]],pending:[]}];
for(const g of groups)assert.equal((await f.commit([{kind:'group',id:g.id,revision:0,value:g}],f.adminToken,{importing:true})).status,200);
const browser=await chromium.launch({headless:true});
try{const page=await browser.newPage({serviceWorkers:'block'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',async route=>{const r=route.request(),u=new URL(r.url());if(u.hostname==='tfb-api.calvinjohncamp.workers.dev'){const response=await worker.fetch(new Request('https://tfb-api.test'+u.pathname+u.search,{method:r.method(),headers:{...r.headers(),'CF-Connecting-IP':'192.0.2.5'},...(r.postData()?{body:r.postData()}:{})}),f.env);return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:await response.text()});}if(u.hostname!=='joern-kaemper.de')return route.abort();try{return route.fulfill({body:readFileSync(resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname))),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(u.pathname==='/'?'/index.html':u.pathname)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:''});}});
await page.goto('https://joern-kaemper.de/#home');await page.waitForFunction(()=>TFB.ui&&TFB.api.centralSync);
await page.evaluate(async()=>{TFB.ui.state.member=await TFB.api.signIn('test@example.invalid','Synthetic password only 123!');});

const form=page.locator('[data-meet-form]');
const go=async()=>{await page.evaluate(()=>{location.hash='#treffen';TFB.ui.renderView();});await page.locator('.meet-new-row').waitFor();};
const pick=async id=>{await form.locator(`[data-togglegroup="${id}"]`).click();};
const add=async(query,id)=>{await form.locator('[name=search]').fill(query);await form.locator(`[data-add="${id}"]`).click();};
const selected=()=>form.locator('.meet-chips .chip').count();
await go();await page.locator('.meet-new-row [data-kind=training]').click();
assert.equal(await form.locator('[data-weekly="0"]').getAttribute('aria-pressed'),'true');assert.equal(await form.locator('[name=until]').count(),0);assert.equal(await form.locator('[data-options]').getAttribute('open'),null);
await form.locator('[name=title]').fill('Gemeinsames Training');await form.locator('[name=time]').fill('19:30');await form.locator('[name=place]').fill('Halle UX');
await add('shared',ids[0]);await pick('ux-a');await pick('ux-b');assert.equal(await selected(),4);
await form.locator(`[data-remove="${f.otherId}"]`).click();assert.equal(await selected(),3);
await pick('ux-a');await pick('ux-b');assert.equal(await selected(),2,'Manually selected overlapping player survives deselecting both groups');
await pick('ux-a');await pick('ux-b');await add('extra',ids[2]);await form.locator(`[data-remove="${f.otherId}"]`).click();assert.equal(await selected(),4);
for(const [field,value] of [['title','Gemeinsames Training'],['time','19:30'],['place','Halle UX']])assert.equal(await form.locator(`[name=${field}]`).inputValue(),value);
await form.locator('[data-weekly="1"]').click();assert.equal(await selected(),4);await form.locator('[name=leadDays]').selectOption('7');
for(const width of [1100,834,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:`/tmp/tfb-invitation-ux-${width}.png`});}
await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});
let snapshot=await page.evaluate(()=>TFB.meet.snapshot());const series=snapshot.series.find(s=>s.title==='Gemeinsames Training');assert.ok(series);assert.equal(series.groupId,null);const wanted=[f.admin.id,...ids].sort();assert.deepEqual([...series.invitees].sort(),wanted);assert.deepEqual([...snapshot.meets.find(m=>m.seriesId===series.id).invitees].sort(),wanted);
assert.deepEqual(snapshot.groups.find(g=>g.id==='ux-a').members.sort(),[f.admin.id,f.otherId,ids[0]].sort());
await page.reload();await page.waitForFunction(()=>TFB.ui?.state.member);snapshot=await page.evaluate(()=>TFB.meet.snapshot());assert.deepEqual([...snapshot.series.find(s=>s.id===series.id).invitees].sort(),wanted);
await go();await page.getByRole('button',{name:'Trainingsserie anlegen',exact:true}).click();assert.equal(await form.locator('[data-weekly="1"]').getAttribute('aria-pressed'),'true');assert.equal(await selected(),1);await page.locator('.sheet-close').click();
await page.locator('[data-action="meet-group"][data-id="ux-a"]').click();await page.locator('[data-group-form] [data-start]').click();assert.equal(await selected(),3);assert.equal(await form.locator('[data-weekly="0"]').getAttribute('aria-pressed'),'true');await page.locator('.sheet-close').click();
for(const kind of ['einzel','doppel','frei','training']){
 await go();await page.locator(`.meet-new-row [data-kind="${kind}"]`).click();assert.equal(await form.locator('[data-weekly="0"]').getAttribute('aria-pressed'),'true');await pick('ux-a');await pick('ux-b');if(kind==='frei')await form.locator('[name=title]').fill('Mannschafts-Test');if(kind==='training')await form.locator('[name=title]').fill('Einmaliges Training');await form.locator('[type=submit]').click();await form.waitFor({state:'detached'});const m=await page.evaluate(()=>{const id=location.hash.split('/')[1];return TFB.meet.snapshot().meets.find(m=>m.id===id);});assert.equal(m.kind,kind);assert.equal(m.seriesId,null);assert.equal(m.invitees.length,4);
}
assert.deepEqual(errors,[]);console.log('Unified invitations: all four kinds, one-off/weekly entry, overlapping groups, manual additions/exclusions, retained fields, unchanged groups, central materialization/reload and 320–1100px pass.');
}finally{await browser.close();}
