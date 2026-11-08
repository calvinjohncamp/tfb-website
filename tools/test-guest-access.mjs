import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './app-sync-fixture.mjs';
import {Bucket} from './editorial-fixture.mjs';
import worker from './worker-test-loader.mjs';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
test('Guests read published content and referenced images, but no account, hidden post or private endpoint',async()=>{
 const f=await fixture(),ref='img:'+crypto.randomUUID();
 assert.equal((await f.commit([{kind:'media',id:ref,revision:0,value:{data:png}},{kind:'post',id:'guest-post',revision:0,value:{scope:'club',title:'Published',text:'Visible',images:[ref]}},{kind:'post',id:'hidden-post',revision:0,value:{scope:'club',text:'Hidden secret',images:[],hidden:true}}])).status,200);
 assert.equal((await f.commit([{kind:'comment',id:'public-comment',revision:0,value:{postId:'guest-post',text:'Public reply',images:[]}}],f.otherToken)).status,200);
 const guest=await f.call('/public/community');assert.equal(guest.status,200);assert.equal(guest.body.posts.length,1);assert.equal(guest.body.posts[0].commentCount,1);assert.equal(guest.body.comments[0].text,'Public reply');assert.deepEqual(guest.body.images,[ref]);
 for(const forbidden of ['email','password','feedRules','Hidden secret','inbox','memberNo'])assert.ok(!JSON.stringify(guest.body).includes(forbidden),forbidden);
 assert.equal(guest.body.posts[0].mine,false);assert.equal(guest.body.posts[0].canModerate,false);
 for(const path of ['/app/state','/admin/site','/app/photo'])assert.equal((await f.call(path)).status,401);
 const photo=await worker.fetch(new Request('https://tfb-api.test/public/chat-media?'+new URLSearchParams({ref})),f.env);assert.equal(photo.status,200);assert.equal(photo.headers.get('content-type'),'image/png');
 assert.equal((await f.call('/public/chat-media?ref=img:unpublished')).status,404);
 assert.equal((await f.call('/app/commit',{id:crypto.randomUUID(),operations:[]})).status,401);
});
test('Assigned members change only their team content, never Home/Aktuell or another team; conflicts preserved',async()=>{
 const f=await fixture();f.env.CMS_BUCKET=new Bucket();
 assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:[{key:'page:home',expected:0,value:{blocks:[]}},{key:'global:teams',expected:0,value:{own:{posts:[],photo:null},other:{posts:[]}}}]},f.adminToken)).status,200);
 const change=(team,field,value,expected=1)=>f.call('/app/team-content',{id:crypto.randomUUID(),team,field,value,expected},f.otherToken);
 assert.equal((await change('own','portrait',{title:'Team'})).status,403);
 f.env.DB.sqlite.prepare('INSERT INTO member_teams(member_id,team_key) VALUES (?,?)').run(f.otherId,'own');
 assert.equal((await change('other','portrait',{title:'Wrong'})).status,403);
 assert.equal((await change('own','page:home',{blocks:[]})).status,400);
 assert.equal((await change('own','portrait',{title:'Our team'})).status,200);
 assert.equal((await change('own','portrait',{title:'Stale'})).status,409);
 const state=(await f.call('/public/site')).body;assert.equal(state.documents['global:teams'].value.own.portrait.title,'Our team');assert.deepEqual(state.documents['global:teams'].value.other,{posts:[]});assert.deepEqual(state.documents['page:home'].value,{blocks:[]});
 assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:[]},f.otherToken)).status,403);
 const media=await f.call('/app/team-media',{data:png},f.otherToken);assert.equal(media.status,200);
 assert.equal((await change('own','photo',media.body.ref,2)).status,200);
});

test('guests, forged sessions and deactivated members cannot submit posts, comments or uploads',async()=>{
 const f=await fixture();f.env.CMS_BUCKET=new Bucket();
 assert.equal((await f.commit([{kind:'post',id:'readable',revision:0,value:{scope:'club',text:'Public content',images:[]}}])).status,200);
 const before=f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM app_records').get().n;
 f.env.DB.sqlite.prepare('UPDATE members SET active=0 WHERE id=?').run(f.otherId);
 for(const token of [undefined,'f'.repeat(64),f.otherToken]){
  for(const operation of [
   {kind:'post',id:'blocked-post',revision:0,value:{scope:'club',text:'Not allowed',images:[]}},
   {kind:'comment',id:'blocked-comment',revision:0,value:{postId:'readable',text:'Not allowed',images:[]}}
  ])assert.equal((await f.call('/app/commit',{id:crypto.randomUUID(),operations:[operation]},token)).status,401);
  assert.equal((await f.call('/app/team-media',{data:png},token)).status,401);
  assert.equal((await f.call('/app/chat-video',{data:'invalid'},token)).status,401);
  assert.equal((await f.call('/admin/site/commit',{id:crypto.randomUUID(),changes:[]},token)).status,401);
 }
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM app_records').get().n,before);
 assert.equal((await f.call('/public/community')).body.posts[0].text,'Public content');
});
