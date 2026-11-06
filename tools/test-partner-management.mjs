import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {fixture} from './app-sync-fixture.mjs';
const partner=(extra={})=>({name:'Synthetic TFB Partner',company:'Example Company',url:'https://example.invalid',contactName:'Private Contact',contactEmail:'private@example.invalid',contactPhone:'123',street:'Private Street',postalCode:'12345',city:'Private City',...extra});
const logoData='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
const report=(f)=>f.call('/admin/partners?year=2027',undefined,f.adminToken);
test('anonymous public config contains only public marketing fields; partner writes require a real admin',async()=>{
 const f=await fixture();const pub=await f.call('/public/partner-content');assert.equal(pub.status,200);assert.equal(pub.body.measurementEnabled,false);assert.equal(pub.body.partners.length,34);
 assert.equal((await f.call('/admin/partners?year=2027')).status,401);assert.equal((await f.call('/admin/partners?year=2027',undefined,f.otherToken)).status,403);
 for(const path of ['/admin/partners/save','/admin/partner-settings','/admin/partners/rotation','/admin/partners/remove'])assert.equal((await f.call(path,{},f.otherToken)).status,403);
 const save=await f.call('/admin/partners/save',{id:'test-real-partner',revision:0,partner:partner(),logoData},f.adminToken);assert.equal(save.status,200,JSON.stringify(save.body));
 const config=await f.call('/public/partner-content');const text=JSON.stringify(config.body);for(const privateField of ['Private Contact','private@example.invalid','Private Street','PRIVATE NOTE','annualCents'])assert.ok(!text.includes(privateField),privateField);
 assert.equal(config.body.partners.find(p=>p.id==='test-real-partner').name,'Synthetic TFB Partner');
});
test('central splash edits use revisions, publish immediately, and reject stale forms and forbidden roles',async()=>{
 const f=await fixture(),before=(await f.call('/public/partner-content')).body;
 const data={revision:before.revision,splash:{...before.splash,headline:'Unser Verein'}};
 assert.equal((await f.call('/admin/partner-settings',data,f.adminToken)).status,200);
 assert.equal((await f.call('/public/partner-content')).body.splash.headline,'Unser Verein');
 assert.equal((await f.call('/admin/partner-settings',data,f.adminToken)).status,409);
 const current=(await f.call('/public/partner-content')).body;
 const switched=await f.call('/admin/partner-settings',{revision:current.revision,splash:{...current.splash,eyebrowEnabled:false,eyebrowText:'Kleine Vereinszeile',footEnabled:false}},f.adminToken);
 assert.equal(switched.status,200);assert.equal(switched.body.splash.eyebrowEnabled,false);assert.equal(switched.body.splash.footEnabled,false);
 // Old open editors must not reset the newly introduced flags or custom text.
 const legacy=await f.call('/admin/partner-settings',{revision:switched.body.revision,splash:{...before.splash,headline:'Legacy edit'}},f.adminToken);
 assert.equal(legacy.status,200);assert.equal(legacy.body.splash.eyebrowEnabled,false);assert.equal(legacy.body.splash.footEnabled,false);assert.equal(legacy.body.splash.eyebrowText,'Kleine Vereinszeile');
 assert.equal((await f.call('/public/partner-events',{events:[]})).status,409,'measurement stays disabled server-side');
 assert.deepEqual((await f.call('/admin/partner-visibility?year=2027',undefined,f.adminToken)).body,{enabled:false,plannedStart:'2027-01-01'});
});
test('partners can be edited and removed, and stale forms cannot overwrite or delete newer data',async()=>{
 const f=await fixture(),id='real-partner',p=partner({annualCents:100});
 assert.equal((await f.call('/admin/partners/save',{id,revision:0,partner:p,logoData},f.adminToken)).status,200);
 assert.equal((await f.call('/admin/partners/save',{id,revision:0,partner:p},f.adminToken)).status,409);
 assert.equal((await f.call('/admin/partners/save',{id,revision:1,partner:{...p,name:'Renamed'}},f.adminToken)).status,200);
 const row=(await report(f)).body.partners.find(p=>p.id===id);
 assert.equal(row.name,'Renamed');
 assert.equal(row.revision,2);
 assert.equal(row.tier,'regional');
 const stored=f.env.DB.sqlite.prepare('SELECT payload FROM tfb_partners WHERE id=?').get(id);
 assert.equal(JSON.parse(stored.payload).annualCents,30000);
 assert.equal((await f.call('/admin/partners/remove',{id,revision:1},f.adminToken)).status,409);
 assert.equal((await f.call('/admin/partners/remove',{id,revision:2},f.adminToken)).status,200);
 assert.ok(!(await report(f)).body.partners.some(p=>p.id===id));
 assert.ok(!(await f.call('/public/partner-content')).body.partners.some(p=>p.id===id));
 assert.equal((await f.call('/admin/partner-payments/add',{},f.adminToken)).status,404);
 for(const changed of [{url:'javascript:alert(1)'},{contactEmail:'invalid'}]){
  assert.equal((await f.call('/admin/partners/save',{id:'invalid',revision:0,partner:partner(changed),logoData},f.adminToken)).status,400);
 }
});
test('logo upload validates raster content and public output does not disclose contact records',async()=>{
 const f=await fixture();
 assert.equal((await f.call('/admin/partners/save',{id:'new-logo',revision:0,partner:partner(),logoData},f.adminToken)).status,200);
 const config=(await f.call('/public/partner-content')).body;assert.match(config.partners.find(p=>p.id==='new-logo').logo,/\/public\/partner-logo\/new-logo\?v=1$/);
 assert.equal((await f.call('/admin/partners/save',{id:'bad-image',revision:0,partner:partner(),logoData:'data:image/png;base64,QUFBQQ=='},f.adminToken)).status,400);
});
test('the configured rotation survives splash edits and rejects invalid or stale writes',async()=>{
 const f=await fixture(), before=(await report(f)).body;
 assert.deepEqual(before.rotation,{premium:3,partner:3,regional:1});
 const rotation={premium:6,partner:4,regional:2};
 const path='/admin/partners/rotation';
 assert.equal((await f.call(path,{revision:before.revision,rotation:{...rotation,regional:0}},f.adminToken)).status,400);
 assert.equal((await f.call(path,{revision:before.revision,rotation},f.adminToken)).status,200);
 assert.equal((await f.call(path,{revision:before.revision,rotation},f.adminToken)).status,409);
 const pub=(await f.call('/public/partner-content')).body;
 assert.deepEqual(pub.rotation,rotation);
 assert.equal((await f.call('/admin/partner-settings',{revision:pub.revision,splash:{...pub.splash,headline:'Ein anderer Text'}},f.adminToken)).status,200);
 assert.deepEqual((await f.call('/public/partner-content')).body.rotation,rotation);
 const regular=pub.partners.find(p=>p.tier==='regional');
 const row=(await report(f)).body.partners.find(p=>p.id===regular.id);
 assert.equal((await f.call('/admin/partners/save',{id:row.id,revision:row.revision,partner:{...row,tier:'partner'}},f.adminToken)).status,200);
 assert.equal((await f.call('/public/partner-content')).body.partners.find(p=>p.id===row.id).tier,'partner');
});

test('rotation distributes three BMW placements for each regional placement and assigns distinct pairs',()=>{
 const source=readFileSync(new URL('../assets/js/partner-rotation.js',import.meta.url),'utf8');
 const storage=new Map(),bmw='bmw-kaltenbach-gruppe';
 const TFB={partners:[
  {id:bmw,logo:'logo',tier:'premium'},
  ...Array.from({length:33},(_,i)=>({id:'p'+i,logo:'logo',tier:'regional'}))
 ]};
 const sessionStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
 vm.runInNewContext(source,{TFB,Math:{floor:Math.floor,min:Math.min,random:()=>0},sessionStorage});
 const counts=new Map();
 let previous;
 for(let i=0;i<18;i++){
  const pair=TFB.partnerPair(i).map(p=>p.id);
  assert.equal(new Set(pair).size,2);
  assert.deepEqual(TFB.partnerPair(i).map(p=>p.id),pair);
  assert.notEqual([...pair].sort().join('|'),previous);
  previous=[...pair].sort().join('|');
  for(const id of pair)counts.set(id,(counts.get(id)||0)+1);
 }
 assert.equal(counts.get(bmw),3);
 for(const partner of TFB.partners.slice(1))assert.equal(counts.get(partner.id),1);
 TFB.partners=TFB.partners.slice(0,2);
 assert.equal(new Set(TFB.partnerPair('small').map(p=>p.id)).size,2);
});
