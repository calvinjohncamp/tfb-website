import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={TFB:{}};
vm.runInNewContext(readFileSync(new URL('../assets/data/court-plan.js',import.meta.url),'utf8'),context);
const plan=context.TFB.courtPlanData;
test('summer plan preserves source courts and all 29 fixed assignments without overlaps',()=>{
 assert.equal(plan.season,'Sommer 2027');assert.deepEqual([...plan.courts],[1,2,3,4,6,7]);assert.equal(plan.entries.length,29);
 assert.deepEqual([...plan.days].map((_,i)=>plan.entries.filter(e=>e.day===i).length),[4,6,7,8,4]);
 for(const e of plan.entries){assert.ok(plan.courts.includes(e.court));assert.ok(e.start>=14&&e.end<=21&&e.end>e.start);assert.ok(['team','youth','coach'].includes(e.kind));
  for(const other of plan.entries)if(e!==other&&e.day===other.day&&e.court===other.court)assert.ok(e.end<=other.start||other.end<=e.start,`${e.cell} overlaps ${other.cell}`);
 }
});
test('source boundary cases and explicit Tuesday correction are retained',()=>{
 for(const [cell,day,court,start,end]of[['G18',1,7,17,21],['G23',2,4,17,18],['H23',2,4,18,20],['D37',4,4,14,21],['F29',3,3,16,18]]){
  const e=plan.entries.find(e=>e.cell===cell);assert.deepEqual([e.day,e.court,e.start,e.end],[day,court,start,end]);
 }
 assert.equal(Object.isFrozen(plan.entries),true);assert.equal(Object.isFrozen(plan.entries[0]),true);
});
