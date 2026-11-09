import test from 'node:test';import assert from 'node:assert/strict';
import{exportPlan,collectExport,exportCsv}from'../assets/js/kiosk-export.js';
import{fixture}from'./app-sync-fixture.mjs';
const today='2026-11-08';
test('month, cumulative cutoff and annual closing use explicit calendar boundaries',()=>{
 assert.equal(exportPlan({kind:'month',year:'2024',month:'2024-02',today}).to,'2024-02-29');
 assert.equal(exportPlan({kind:'cumulative',year:'2026',month:'2026-10',today}).to,'2026-10-31');
 assert.equal(exportPlan({kind:'cumulative',year:'2026',month:'2026-11',today}).to,today);
 assert.equal(exportPlan({kind:'cumulative',year:'2025',today}).months.length,12);
 assert.throws(()=>exportPlan({kind:'closing',year:'2026',today}),/01.01.2027/);
 assert.throws(()=>exportPlan({kind:'closing',year:'2026',today:'2026-12-31'}),/01.01.2027/);assert.equal(exportPlan({kind:'closing',year:'2026',today:'2027-01-01'}).to,'2026-12-31');
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
const parseCsv=text=>{const rows=[];let row=[],value='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(i===0&&c==='\ufeff')continue;if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===';'&&!quoted){row.push(value);value='';}else if(c==='\n'&&!quoted){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value='';}else value+=c;}row.push(value);rows.push(row);return rows;};
test('CSV has plain German headings, a single corrected amount per purchase and a separate audit list',()=>{
 const plan=exportPlan({kind:'closing',year:'2025',today}),entry=(id,at,price,adjustments=[])=>({id,created_at:at,display_name:'=FORMULA',product_name:'Wasser; "kalt"',unit:'Stück',price_cents:price,net_cents:price-adjustments.reduce((s,a)=>s+a.amount_cents,0),adjustments,basis:'server'});
 const csv=exportCsv([entry('a','2025-01-01T12:00:00Z',100,[{id:'credit',created_at:'2025-03-01T12:00:00Z',amount_cents:20,reason:'Prüfung; mit "Begründung"\nzweite Zeile',actor_name:'Finanzwart',source:'admin'}]),entry('b','2025-02-01T12:00:00Z',200)],{plan,generatedAt:'2026-11-09T06:03:12.414Z'}),rows=parseCsv(csv),bookings=rows.filter(r=>['a','b'].includes(r[0])&&r[5]==='Stück');
 assert(csv.startsWith('\ufeff'));assert.doesNotMatch(csv,/Vorführbetrag|Vorführbetrieb|Datenstand UTC|Zeitpunkt UTC|Quelle|"Export"/);
 assert(rows.every(r=>r.length===9));assert.deepEqual(bookings.map(r=>r[0]),['a','b']);assert.deepEqual(bookings[0].slice(2,4),['01.01.2025','13:00:00']);assert.deepEqual(bookings[0].slice(6),['1,00','0,20','0,80']);
 assert.equal(bookings.reduce((sum,r)=>sum+Math.round(Number(r[8].replace(',','.'))*100),0),280);
 assert.deepEqual(rows.find(r=>r[0]==='Erstellt am').slice(1,3),['09.11.2026','07:03:12']);
 assert(rows.some(r=>r[5]==='Korrektur'&&r[6]==='0,20'&&r[8]==='Finanzwart'&&r[7].includes('zweite Zeile')));assert.match(csv,/Nicht erneut abziehen/);assert.match(csv,/"'\=FORMULA"/);
 assert(rows.findIndex(r=>r[0]==='Jahressumme')<rows.findIndex(r=>r[0]==='Einzelbuchungen'));assert.deepEqual(rows.find(r=>r[0]==='Jahressumme').slice(0,2),['Jahressumme','2,80']);
 const empty=exportCsv([],{plan,generatedAt:today});assert.match(empty,/Jahresabschluss 2025/);assert.match(empty,/"Januar";"0,00"/);assert.match(empty,/"Dezember";"0,00"/);assert.match(empty,/"Jahressumme";"0,00"/);assert.match(empty,/Keine Stornos oder Korrekturen/);
});
test('CSV uses German daylight-saving local time without time codes or milliseconds',()=>{
 const plan=exportPlan({kind:'month',year:'2025',month:'2025-07',today});const csv=exportCsv([{id:'summer',created_at:'2025-07-01T12:30:45.123Z',display_name:'Mitglied',product_name:'Wasser',unit:'Stück',price_cents:100,net_cents:0,adjustments:[{id:'undo',created_at:'2025-07-01T12:30:50Z',amount_cents:100,reason:'Zurückgenommen',actor_name:'Mitglied',source:'undo'}]}],{plan,generatedAt:'2026-11-09T06:03:12.414Z'}),rows=parseCsv(csv);
 assert.deepEqual(rows.find(r=>r[0]==='summer'&&r[5]==='Stück').slice(2,4),['01.07.2025','14:30:45']);assert(rows.some(r=>r[5]==='Storno'&&r[3]==='14:30:50'));assert.doesNotMatch(csv,/2025-07-01T|\.123Z/);
});
test('a failed month fails the entire annual export instead of silently returning partial data',async()=>{
 const plan=exportPlan({kind:'cumulative',year:'2026',month:'2026-03',today});await assert.rejects(()=>collectExport(plan,async m=>{if(m==='2026-02')throw Error('Unavailable');return {entries:[]};}),/Unavailable/);
});
