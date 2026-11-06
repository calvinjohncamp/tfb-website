import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fixture} from './app-sync-fixture.mjs';
const partners=JSON.parse(readFileSync(new URL('../server/cloudflare/partner-catalog.json',import.meta.url)));
const partner=partners.find(p=>p.tier==='premium').id;
const e=(kind='pageview',page='home',extra={})=>({id:crypto.randomUUID(),page,kind,...(kind==='pageview'?{}:{partner,slot:'left'}),...extra});
test('public collection is anonymous, repeat delivery is idempotent, and daily totals survive expiry of short-lived IDs',async()=>{
 const f=await fixture(),events=[e(),e('display'),e('visible'),e('click'),e('visible','splash')];f.env.PARTNER_MEASUREMENT_ENABLED='1';
 assert.equal((await f.call('/public/partner-events',{events})).status,200);
 assert.equal((await f.call('/public/partner-events',{events})).status,200);
 const year=new Date().getFullYear();let report=await f.call('/admin/partner-visibility?year='+year,undefined,f.adminToken);
 assert.equal(report.status,200);assert.equal(report.body.rows.reduce((s,r)=>s+r.total,0),5);
 assert.ok(report.body.startedAt);assert.equal(report.body.source,'tfb');
 assert.equal((await f.call('/public/partner-events',{events:[e('click')]})).status,200);
 report=await f.call('/admin/partner-visibility?year='+year,undefined,f.adminToken);
 assert.equal(report.body.rows.find(r=>r.kind==='click').total,2);
 f.env.DB.sqlite.prepare('UPDATE partner_events SET expires_at=0').run();
 await f.call('/public/partner-events',{events:[e('pageview','sport-training')]});
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM partner_events').get().n,1);
 assert.equal(f.env.DB.sqlite.prepare('SELECT SUM(total) AS n FROM partner_daily').get().n,7);
 const columns=f.env.DB.sqlite.prepare('PRAGMA table_info(partner_events)').all().map(r=>r.name);
 assert.deepEqual(columns,['id','source','day','page','partner','slot','kind','expires_at']);
});
test('only server-verified active admins can read statistics; hidden URL and forged browser roles grant no access',async()=>{
 const f=await fixture();f.env.PARTNER_MEASUREMENT_ENABLED='1';const path='/admin/partner-visibility?year='+new Date().getFullYear();
 assert.equal((await f.call(path)).status,401);
 assert.equal((await f.call(path,undefined,'f'.repeat(64))).status,401);
 assert.equal((await f.call(path,undefined,f.otherToken)).status,403);
 assert.equal((await f.call(path,undefined,f.adminToken)).status,200);
 f.env.DB.sqlite.prepare('UPDATE members SET is_admin=0 WHERE id=?').run(f.admin.id);
 assert.equal((await f.call(path,undefined,f.adminToken)).status,403);
});
test('invalid/private fields and unregistered partners reject the complete batch',async()=>{
 const f=await fixture();f.env.PARTNER_MEASUREMENT_ENABLED='1';
 for(const invalid of [e('visible','home',{partner:'unregistered'}),e('pageview','team/private-person'),e('visible','impressum'),e('pageview','home',{memberId:'private'}),e('pageview','home',{id:'not-a-uuid'}),e('visible','splash',{partner:partners.find(p=>p.tier==='regional').id})]){
  assert.equal((await f.call('/public/partner-events',{events:[e(),invalid]})).status,400);
 }
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM partner_daily').get().n,0);
 assert.equal((await f.call('/public/partner-events',{events:Array.from({length:26},()=>e())})).status,400);
});
test('reports separate years and start empty without inventing historic traffic',async()=>{
 const f=await fixture();f.env.PARTNER_MEASUREMENT_ENABLED='1';const year=new Date().getFullYear();
 let r=await f.call('/admin/partner-visibility?year='+year,undefined,f.adminToken);
 assert.equal(r.body.startedAt,null);assert.deepEqual(r.body.rows,[]);
 for(const y of ['2025','9999','2026 OR 1=1',''])assert.equal((await f.call('/admin/partner-visibility?year='+encodeURIComponent(y),undefined,f.adminToken)).status,400);
 f.env.DB.sqlite.prepare("INSERT INTO partner_daily VALUES ('tfb','2026-12-31','home','','','pageview',7)").run();
 const raw=readFileSync(new URL('../server/cloudflare/partner-visibility.mjs',import.meta.url),'utf8').replace("import partners from './partner-catalog.json';",'const partners='+JSON.stringify(partners)+';');
 const {berlinDay}=await import('data:text/javascript;base64,'+Buffer.from(raw).toString('base64'));
 assert.equal(berlinDay(new Date('2026-12-31T23:30:00Z')),'2027-01-01');
 assert.equal(berlinDay(new Date('2026-06-30T22:30:00Z')),'2026-07-01');
});
