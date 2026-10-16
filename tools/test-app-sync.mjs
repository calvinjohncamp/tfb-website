import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './app-sync-fixture.mjs';
const account=(id,value={},revision=0)=>({kind:'account',id,revision,value:{consentVersion:'tfb-kiosk-v3',consentedAt:new Date().toISOString(),feedRules:'yes',...value}});
const post=(id,extra={},revision=0)=>({kind:'post',id,revision,value:{scope:'club',text:'Hello from another device',images:[],...extra}});
const picture='data:image/png;base64,'+'A'.repeat(1200000); // tests chunking, not browser decoding

test('central profile, uncropped photo, kiosk items and chat persist across sessions; private data remains private',async()=>{
  const f=await fixture();
  assert.equal((await f.commit([account(f.admin.id,{avatar:'data:image/png;base64,AAAA',avatarLarge:picture,phone:'private-phone'}),post('shared-post'),{kind:'item',id:'first-item',revision:0,value:{productId:'koelsch'}}])).status,200);
  const own=(await f.state()).body;
  assert.equal(own.records.find(r=>r.kind==='account').value.avatarLarge,picture);
  assert.equal(own.records.find(r=>r.kind==='item').value.priceCents,180);
  const other=(await f.state(f.otherToken)).body;
  assert.equal(other.records.filter(r=>r.kind==='post').length,1);
  assert.equal(other.records.filter(r=>['account','item'].includes(r.kind)).length,0);
  assert.equal(JSON.stringify(other).includes('private-phone'),false);
  assert.equal(other.faces[0].avatarLarge,undefined);
  assert.equal((await f.call('/app/photo',{id:f.admin.id},f.otherToken)).body.image,picture);
  assert.equal(f.env.DB.sqlite.prepare('SELECT count(*) n FROM app_payloads').get().n>3,true);
  assert.equal((await f.state(undefined)).status,200);
  assert.equal((await f.call('/app/state')).status,401);
});
test('stale updates reject the whole transaction; replay is idempotent; tombstones prevent resurrection',async()=>{
  const f=await fixture();await f.commit([post('one'),post('two')]);
  const command={id:crypto.randomUUID(),operations:[post('one',{text:'edited'},1)]};
  assert.equal((await f.call('/app/commit',command,f.adminToken)).status,200);
  assert.equal((await f.call('/app/commit',command,f.adminToken)).status,200);
  assert.equal((await f.commit([post('one',{text:'stale'},1),post('two',{text:'must not change'},1)])).status,409);
  let records=(await f.state()).body.records;
  assert.equal(records.find(r=>r.id==='two').value.text,'Hello from another device');
  assert.equal((await f.commit([{kind:'post',id:'one',revision:2,deleted:true}])).status,200);
  assert.equal((await f.commit([post('one')])).status,409);
  assert.equal((await f.state()).body.records.find(r=>r.id==='one').deleted,true);
});
test('team reading/writing and foreign mutations are checked on the server, independent of local roles',async()=>{
  const f=await fixture();await f.commit([post('private',{scope:'team:private-team'})]);
  assert.equal((await f.state(f.otherToken)).body.records.some(r=>r.id==='private'),false);
  assert.equal((await f.commit([post('forged',{scope:'team:private-team',authorId:f.admin.id,isAdmin:true})],f.otherToken)).status,403);
  await f.commit([post('public')]);
  assert.equal((await f.commit([post('public',{text:'overwrite'},1)],f.otherToken)).status,403);
  assert.equal((await f.commit([account(f.admin.id)],f.otherToken)).status,403);
  f.env.DB.sqlite.prepare('UPDATE members SET active=0 WHERE id=?').run(f.otherId);
  assert.equal((await f.state(f.otherToken)).status,401);
});
test('comments and attachments synchronize, preserve authorship, and cannot attach another member’s unpublished photo',async()=>{
  const f=await fixture();await f.commit([post('discussion'),{kind:'media',id:'img:private',revision:0,value:{data:'data:image/png;base64,AAAA'}}]);
  assert.equal((await f.state(f.otherToken)).body.records.some(r=>r.kind==='media'),false);
  const comment={kind:'comment',id:'comment',revision:0,value:{postId:'discussion',text:'Reply',images:[]}};
  assert.equal((await f.commit([comment],f.otherToken)).status,200);
  assert.equal((await f.state()).body.records.find(r=>r.kind==='comment').value.authorId,f.otherId);
  assert.equal((await f.commit([post('stolen-image',{images:['img:private']})],f.otherToken)).status,403);
  assert.equal((await f.commit([post('discussion',{images:['img:private']},1)])).status,200);
  assert.equal((await f.state(f.otherToken)).body.records.some(r=>r.id==='img:private'),true);
  await f.commit([{kind:'post',id:'discussion',revision:2,deleted:true}]);
  assert.equal((await f.state(f.otherToken)).body.records.some(r=>r.kind==='media'||r.kind==='comment'),false);
});
test('prices and timestamps come from server; migration keeps dated demo amounts and skips duplicate IDs',async()=>{
  const f=await fixture();await f.commit([account(f.admin.id)]);
  await f.commit([{kind:'item',id:'new-item',revision:0,value:{productId:'koelsch',priceCents:1,memberId:f.otherId,createdAt:'2020-01-01',status:'closed'}}]);
  const item=(await f.state()).body.records.find(r=>r.kind==='item').value;
  assert.equal(item.priceCents,180);assert.equal(item.memberId,f.admin.id);assert.equal(item.status,'open');assert.ok(item.createdAt.startsWith(new Date().toISOString().slice(0,10)));
  const old={kind:'item',id:'old-item',revision:0,value:{productId:'koelsch',priceCents:170,createdAt:'2026-09-01T12:00:00.000Z',status:'open'}};
  assert.equal((await f.commit([old],f.adminToken,{importing:true})).status,200);
  assert.equal((await f.state()).body.records.find(r=>r.id==='old-item').value.priceCents,170);
  assert.equal((await f.commit([old],f.adminToken,{importing:true})).status,409);
  assert.equal((await f.commit([{kind:'item',id:'old-item',revision:1,value:{status:'cancelled'}}])).status,409);
});

test('central catalog preserves administrator prices and cannot be changed by another member',async()=>{
  const f=await fixture(),catalog=(await f.state()).body.catalog;
  catalog.products.find(p=>p.id==='koelsch').price=195;
  assert.equal((await f.commit([{kind:'catalog',id:'club',revision:0,value:catalog},account(f.admin.id)])).status,200);
  assert.equal((await f.commit([{kind:'item',id:'custom-price',revision:0,value:{productId:'koelsch'}}])).status,200);
  assert.equal((await f.state()).body.records.find(r=>r.id==='custom-price').value.priceCents,195);
  assert.equal((await f.state(f.otherToken)).body.catalog.products.find(p=>p.id==='koelsch').price,195);
  assert.equal((await f.commit([{kind:'catalog',id:'club',revision:1,value:catalog}],f.otherToken)).status,403);
});

test('profile approval cannot be forged; pending and removed photos cannot be loaded on another device',async()=>{
  const f=await fixture();
  await f.commit([account(f.admin.id,{avatar:'data:image/png;base64,AAAA',avatarLarge:picture,photoPending:{scopes:['members']},photoApproval:{confirmedBy:'forged'}})]);
  assert.equal((await f.state()).body.records.find(r=>r.kind==='account').value.photoApproval,null);
  assert.equal((await f.call('/app/photo',{id:f.admin.id},f.otherToken)).body.image,null);
  assert.equal((await f.call('/app/photo',{id:f.admin.id},f.adminToken)).body.image,picture);
  await f.commit([account(f.admin.id,{avatar:null,avatarLarge:null},1)]);
  assert.equal((await f.call('/app/photo',{id:f.admin.id},f.otherToken)).body.image,null);
});
