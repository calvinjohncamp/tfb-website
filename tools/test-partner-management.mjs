import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {fixture} from './app-sync-fixture.mjs';
const partner=(extra={})=>({name:'Synthetic TFB Partner',company:'Example Company',tier:'partner',active:false,sample:false,status:'contract',annualCents:30000,sort:0,logo:'',url:'https://example.invalid',contactName:'Private Contact',contactEmail:'private@example.invalid',contactPhone:'123',street:'Private Street',postalCode:'12345',city:'Private City',note:'PRIVATE NOTE',...extra});
const report=(f)=>f.call('/admin/partners?year=2027',undefined,f.adminToken);
test('anonymous public config contains only public marketing fields; partner and payment writes require a real admin',async()=>{
 const f=await fixture();const pub=await f.call('/public/partner-content');assert.equal(pub.status,200);assert.equal(pub.body.measurementEnabled,false);assert.equal(pub.body.partners.length,38);
 assert.equal((await f.call('/admin/partners?year=2027')).status,401);assert.equal((await f.call('/admin/partners?year=2027',undefined,f.otherToken)).status,403);
 for(const path of ['/admin/partners/save','/admin/partner-settings','/admin/partner-payments/add','/admin/partner-payments/void'])assert.equal((await f.call(path,{},f.otherToken)).status,403);
 const save=await f.call('/admin/partners/save',{id:'test-real-partner',revision:0,partner:partner({active:true,logo:'assets/partners/partner-schwalbe.png'})},f.adminToken);assert.equal(save.status,200,JSON.stringify(save.body));
 const config=await f.call('/public/partner-content');const text=JSON.stringify(config.body);for(const privateField of ['Private Contact','private@example.invalid','Private Street','PRIVATE NOTE','annualCents','30000'])assert.ok(!text.includes(privateField),privateField);
 assert.equal(config.body.partners.find(p=>p.id==='test-real-partner').name,'Synthetic TFB Partner');
});
test('central splash edits use revisions, publish immediately, and reject stale forms and forbidden roles',async()=>{
 const f=await fixture(),before=(await f.call('/public/partner-content')).body;
 const data={revision:before.revision,splash:{...before.splash,headline:'Unser Verein'}};
 assert.equal((await f.call('/admin/partner-settings',data,f.adminToken)).status,200);
 assert.equal((await f.call('/public/partner-content')).body.splash.headline,'Unser Verein');
 assert.equal((await f.call('/admin/partner-settings',data,f.adminToken)).status,409);
 assert.equal((await f.call('/public/partner-events',{events:[]})).status,409,'measurement stays disabled server-side');
 assert.deepEqual((await f.call('/admin/partner-visibility?year=2027',undefined,f.adminToken)).body,{enabled:false,plannedStart:'2027-01-01'});
});
test('partner edits preserve stable IDs, reject stale edits, and retain hidden partners for payment history',async()=>{
 const f=await fixture(),id='real-partner',p=partner();
 assert.equal((await f.call('/admin/partners/save',{id,revision:0,partner:p},f.adminToken)).status,200);
 assert.equal((await f.call('/admin/partners/save',{id,revision:0,partner:partner({name:'Lost update'})},f.adminToken)).status,409);
 assert.equal((await f.call('/admin/partners/save',{id,revision:1,partner:{...p,name:'Renamed'}},f.adminToken)).status,200);
 const row=(await report(f)).body.partners.find(p=>p.id===id);assert.equal(row.name,'Renamed');assert.equal(row.revision,2);
 for(const changed of [{url:'javascript:alert(1)'},{contactEmail:'invalid'},{active:true},{annualCents:-1},{tier:'court'}])assert.equal((await f.call('/admin/partners/save',{id:'bad-'+crypto.randomUUID(),revision:0,partner:partner(changed)},f.adminToken)).status,400);
 assert.equal((await f.call('/admin/partners/save',{id:'extra-premium',revision:0,partner:partner({tier:'premium',active:true,logo:'assets/partners/partner-schwalbe.png'})},f.adminToken)).status,400);
});
test('paid yearly totals are actual receipts, idempotent, reversible and independent of later fee edits',async()=>{
 const f=await fixture();await f.call('/admin/partners/save',{id:'real',revision:0,partner:partner()},f.adminToken);
 const payment={id:crypto.randomUUID(),partnerId:'real',year:2027,amountCents:30000,paidOn:'2026-10-17',note:'Advance payment'};
 assert.equal((await f.call('/admin/partner-payments/add',payment,f.adminToken)).status,200);
 assert.equal((await f.call('/admin/partner-payments/add',payment,f.adminToken)).status,200);
 assert.equal((await report(f)).body.payments.length,1);
 assert.equal((await f.call('/admin/partners?year=2026',undefined,f.adminToken)).body.payments.length,0);
 await f.call('/admin/partners/save',{id:'real',revision:1,partner:partner({annualCents:45000})},f.adminToken);
 assert.equal((await report(f)).body.payments[0].amountCents,30000);
 assert.equal((await f.call('/admin/partner-payments/add',{...payment,amountCents:45000},f.adminToken)).status,409);
 assert.equal((await f.call('/admin/partner-payments/add',{...payment,id:crypto.randomUUID(),paidOn:'2027-02-30'},f.adminToken)).status,400);
 const sample=(await report(f)).body.partners.find(p=>p.sample);assert.equal((await f.call('/admin/partner-payments/add',{...payment,id:crypto.randomUUID(),partnerId:sample.id},f.adminToken)).status,400);
 await f.call('/admin/partner-payments/void',{id:payment.id},f.adminToken);assert.equal((await report(f)).body.payments.length,0);
 assert.ok(f.env.DB.sqlite.prepare('SELECT voided_at FROM tfb_partner_payments WHERE id=?').get(payment.id).voided_at);
});
test('logo upload validates raster content and public output does not disclose contact records',async()=>{
 const f=await fixture(),logoData='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
 assert.equal((await f.call('/admin/partners/save',{id:'new-logo',revision:0,partner:partner({active:true}),logoData},f.adminToken)).status,200);
 const config=(await f.call('/public/partner-content')).body;assert.match(config.partners.find(p=>p.id==='new-logo').logo,/\/public\/partner-logo\/new-logo\?v=1$/);
 assert.equal((await f.call('/admin/partners/save',{id:'bad-image',revision:0,partner:partner(),logoData:'data:image/png;base64,QUFBQQ=='},f.adminToken)).status,400);
});
test('equal rotation gives every partner exactly one appearance per complete round, with no premium slot preference',()=>{
 const source=readFileSync(new URL('../assets/js/partner-rotation.js',import.meta.url),'utf8');
 for(const count of [1,2,3,5,38]){
  const storage=new Map(),TFB={partners:Array.from({length:count},(_,i)=>({id:'p'+i,name:'P'+i,tier:i<2?'premium':'partner',logo:'logo'+i}))};
  vm.runInNewContext(source,{TFB,Math,sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
  const seen=[];for(let i=0;i<count*10;i++){const pair=TFB.partnerPair('page'+i);assert.equal(pair.length,Math.min(2,count));assert.equal(new Set(pair.map(p=>p.id)).size,pair.length);assert.equal(TFB.partnerPair('page'+i),pair);seen.push(...pair.map(p=>p.id));}
  for(let start=0;start+count<=seen.length;start+=count)assert.equal(new Set(seen.slice(start,start+count)).size,count);
 }
});
