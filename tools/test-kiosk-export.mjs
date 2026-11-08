import test from 'node:test';import assert from 'node:assert/strict';
import{exportPlan,collectExport,exportCsv}from'../assets/js/kiosk-export.js';
import{fixture}from'./app-sync-fixture.mjs';
const today='2026-11-08';
test('month, cumulative cutoff and annual closing use explicit calendar boundaries',()=>{
 assert.equal(exportPlan({kind:'month',year:'2024',month:'2024-02',today}).to,'2024-02-29');
 assert.equal(exportPlan({kind:'cumulative',year:'2026',month:'2026-10',today}).to,'2026-10-31');
 assert.equal(exportPlan({kind:'cumulative',year:'2026',month:'2026-11',today}).to,today);
 assert.equal(exportPlan({kind:'cumulative',year:'2025',today}).months.length,12);
 assert.throws(()=>exportPlan({kind:'closing',year:'2026',today}),/31.12.2026/);
 assert.equal(exportPlan({kind:'closing',year:'2026',today:'2026-12-31'}).to,'2026-12-31');
 assert.throws(()=>exportPlan({kind:'month',year:'2026',today}),/Monat/);
 assert.throws(()=>exportPlan({kind:'cumulative',year:'2027',today}),/begonnenes/);
});
test('annual club and personal exports reuse protected monthly reports without changing data',async()=>{
 const f=await fixture(),insert=f.env.DB.sqlite.prepare('INSERT INTO kiosk_entries(id,member_id,member_name,product_id,product_name,price_cents,created_at) VALUES (?,?,?,?,?,?,?)');
 for(const [id,owner,cents,at]of[['dec',f.admin.id,300,'2025-12-31T12:00:00Z'],['jan',f.admin.id,100,'2024-12-31T23:30:00Z'],['other',f.otherId,200,'2025-06-01T12:00:00Z']])insert.run(id,owner,'Synthetic','water','Wasser',cents,at);
 const plan=exportPlan({kind:'closing',year:'2025',today}),count=f.env.DB.sqlite.prepare('SELECT count(*) n FROM app_commits').get().n;
 const all=await collectExport(plan,async month=>{const r=await f.call('/admin/kiosk/report?month='+month,undefined,f.adminToken);assert.equal(r.status,200);return r.body;});
 assert.deepEqual(all.map(e=>e.id),['jan','other','dec']);assert.equal(all.reduce((s,e)=>s+e.net_cents,0),600);
 const own=await collectExport(plan,async month=>(await f.call('/app/kiosk/report?month='+month+'&member='+f.otherId,undefined,f.adminToken)).body);
 assert.deepEqual(own.map(e=>e.id),['jan','dec']);
 assert.equal((await f.call('/admin/kiosk/report?month=2025-01',undefined,f.otherToken)).status,403);
 assert.equal(f.env.DB.sqlite.prepare('SELECT count(*) n FROM app_commits').get().n,count);
});
test('CSV includes original amounts, correction actor and net totals in chronological event order',()=>{
 const plan=exportPlan({kind:'closing',year:'2025',today}),entry=(id,at,price,adjustments=[])=>({id,created_at:at,display_name:'=FORMULA',product_name:'Wasser; "kalt"',unit:'Stück',price_cents:price,net_cents:price-adjustments.reduce((s,a)=>s+a.amount_cents,0),adjustments,basis:'server'});
 const csv=exportCsv([entry('a','2025-01-01T12:00:00Z',100,[{id:'credit',created_at:'2025-03-01T12:00:00Z',amount_cents:20,reason:'Prüfung',actor_name:'Finanzwart',source:'admin'}]),entry('b','2025-02-01T12:00:00Z',200)],{plan,generatedAt:'2026-11-08T12:00:00Z'});
 assert(csv.startsWith('\ufeff'));assert(csv.indexOf('"b"')<csv.indexOf('"credit"'));assert.match(csv,/Finanzwart/);assert.match(csv,/"'\=FORMULA"/);assert.match(csv,/"0,80"/);assert.match(csv,/2025-12-31/);
 const empty=exportCsv([],{plan,generatedAt:today});assert.match(empty,/Jahresabschluss 2025/);assert.match(empty,/"Januar";"0,00"/);assert.match(empty,/"Dezember";"0,00"/);assert.match(empty,/"Jahressumme";"0,00"/);assert(!empty.includes('"Buchung";'));assert(csv.indexOf('"Jahressumme";"2,80"')<csv.indexOf('"Einzelbuchungen"'));assert.match(csv,/"Januar";"0,80"/);assert.match(csv,/"Februar";"2,00"/);
});
test('a failed month fails the entire annual export instead of silently returning partial data',async()=>{
 const plan=exportPlan({kind:'cumulative',year:'2026',month:'2026-03',today});await assert.rejects(()=>collectExport(plan,async m=>{if(m==='2026-02')throw Error('Unavailable');return {entries:[]};}),/Unavailable/);
});
