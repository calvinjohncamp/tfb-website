import {test} from 'node:test';import assert from 'node:assert/strict';import {fixture} from './app-sync-fixture.mjs';
const post=(id,authorMode,revision=0,extra={})=>({kind:'post',id,revision,value:{scope:'club',text:'Official information',images:[],...(authorMode===undefined?{}:{authorMode}),...extra}});
test('Only admins may publish TFB chat posts; ownership and personal comments stay intact',async()=>{
 const f=await fixture();assert.equal((await f.commit([post('forged','tfb')],f.otherToken)).status,403);assert.equal((await f.commit([post('invalid','unknown')])).status,400);assert.equal((await f.commit([post('team','tfb',0,{scope:'team:herren'})])).status,403);
 assert.equal((await f.commit([post('official','tfb',0,{authorId:f.otherId})])).status,200);
 let state=(await f.state()).body,record=state.records.find(r=>r.id==='official');assert.equal(record.ownerId,f.admin.id);assert.equal(record.value.authorId,f.admin.id);assert.equal(record.value.authorMode,'tfb');
 assert.equal((await f.commit([{kind:'comment',id:'reply',revision:0,value:{postId:'official',text:'A personal reply',images:[],authorMode:'tfb'}}],f.otherToken)).status,403);
 assert.equal((await f.commit([{kind:'comment',id:'reply',revision:0,value:{postId:'official',text:'A personal reply',images:[]}}],f.otherToken)).status,200);
 let guest=(await f.call('/public/community')).body;const official=guest.posts.find(p=>p.id==='official');assert.equal(official.author,'Tennisfreunde Bielstein');assert.equal(official.avatar,'assets/icons/icon-512.png');assert.equal(guest.comments[0].author,'Other Member');assert.equal(guest.comments[0].authorMode,undefined);
 assert.equal((await f.commit([post('official','personal',1)])).status,200);guest=(await f.call('/public/community')).body;assert.equal(guest.posts.find(p=>p.id==='official').author,'Demo Owner');assert.equal(guest.posts.find(p=>p.id==='official').authorMode,undefined);
 assert.equal((await f.commit([post('official','tfb',2)])).status,200);
 // A new admin can publish independently without sharing the first admin's account.
 f.env.DB.sqlite.prepare('UPDATE members SET is_admin=1 WHERE id=?').run(f.otherId);assert.equal((await f.commit([post('second','tfb')],f.otherToken)).status,200);assert.equal((await f.state(f.otherToken)).body.records.find(r=>r.id==='second').ownerId,f.otherId);
});
