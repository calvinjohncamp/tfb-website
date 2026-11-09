import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';import {readFileSync} from 'node:fs';
import {fixture} from './app-sync-fixture.mjs';import {publishBrowserSite} from './browser-site-fixture.mjs';
function fees(){const c={TFB:{}};vm.createContext(c);vm.runInContext(readFileSync(new URL('../assets/js/membership-fees.js',import.meta.url),'utf8'),c);return c.TFB.membershipFees;}
test('2027 categories and amounts exactly match the board schedule; old child exemptions are gone',()=>{
 const f=fees();assert.deepEqual(JSON.parse(JSON.stringify(f.defaults)),{youth14:5000,youth18:9000,adult:21000,spouse:15000,education:11000,passive:5000,guest:11000,trialAdult:8000,trialYouth:5000});assert.equal(f.categories.length,9);assert(Object.isFrozen(f.categories));assert(f.categories.every(Object.isFrozen));
});
test('Euro input handles German cents exactly and rejects malformed, negative and excessive prices',()=>{
 const f=fees();for(const [input,cents]of[['0',0],['210',21000],[' 210,25 ',21025],['110.5',11050],['99999,99',9999999]])assert.equal(f.parse(input),cents);
 for(const input of['','-1','1e3','12,345','1.234,56','NaN','Infinity','100000','2,3,4','<script>'])assert.throws(()=>f.parse(input));
});
test('published amounts change values but cannot add, rename or remove fixed categories',()=>{
 const f=fees(),r=f.read({pages:{verein:{membershipFees:{amounts:{adult:21125,youth14:0,evil:900,spouse:-1,trialYouth:'free'},labels:{adult:'changed'}}}}});assert.equal(r.adult,21125);assert.equal(r.youth14,0);assert.equal(r.spouse,15000);assert.equal(r.trialYouth,5000);assert.equal(Object.keys(r).length,9);assert.equal(r.evil,undefined);assert.equal(f.regular.find(x=>x[0]==='adult')[1],'Erwachsene');
});
test('CMS persists fee changes publicly, protects roles and stale edits, and preserves club content',async()=>{
 const f=await fixture();await publishBrowserSite(f);const source=(await f.call('/admin/site',undefined,f.adminToken)).body.documents['page:verein'];const value=structuredClone(source.value);value.membershipFees={version:1,effectiveFrom:'2027-01-01',amounts:{...fees().defaults,adult:21125}};const command={id:crypto.randomUUID(),changes:[{key:'page:verein',expected:source.revision,value}]};
 assert.equal((await f.call('/admin/site/commit',command)).status,401);assert.equal((await f.call('/admin/site/commit',command,f.otherToken)).status,403);assert.equal((await f.call('/admin/site/commit',command,f.adminToken)).status,200);
 const next=(await f.call('/public/site')).body.documents['page:verein'];assert.equal(next.value.membershipFees.amounts.adult,21125);assert.deepEqual(next.value.blocks,source.value.blocks);assert.equal((await f.call('/admin/site/commit',{...command,id:crypto.randomUUID()},f.adminToken)).status,409);
});
