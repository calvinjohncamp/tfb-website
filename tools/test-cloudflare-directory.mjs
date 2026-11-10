import { DatabaseSync } from 'node:sqlite';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from './worker-test-loader.mjs';

// Real SQLite, with only D1's asynchronous wrapper emulated. No private data.
class D1 {
  constructor() { this.sqlite=new DatabaseSync(':memory:'); }
  async exec(sql) { this.sqlite.exec(sql); }
  prepare(sql) {
    const db=this.sqlite; let args=[];
    const query={bind(...values){args=values;return query;},
      async first(){return db.prepare(sql).get(...args)||null;},
      async all(){return {results:db.prepare(sql).all(...args)};},
      async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}};
    return query;
  }
  async batch(statements) {
    this.sqlite.exec('BEGIN');
    try {const r=[];for(const q of statements)r.push(await q.run());this.sqlite.exec('COMMIT');return r;}
    catch(e){this.sqlite.exec('ROLLBACK');throw e;}
  }
}
const password='A synthetic password 123!';
const owner={setupToken:'a'.repeat(64),firstName:'Test',lastName:'Admin',email:'admin@example.invalid',password};
const people=[{memberNo:'1',firstName:'Test',lastName:'Admin',email:owner.email},
  {memberNo:'2',firstName:'JÖRN',lastName:'MÜLLER',email:'member@example.invalid',isAdmin:true},
  {memberNo:'3',firstName:'Private',lastName:'Testperson',email:'other@example.invalid'}];
async function fixture() {
  const env={DB:new D1(),PASSWORD_PEPPER:'synthetic-test-pepper-'.repeat(3),SETUP_TOKEN:owner.setupToken};
  async function call(path,data,token,origin='https://joern-kaemper.de') {
    const response=await worker.fetch(new Request('https://tfb-api.test'+path,{method:data===undefined?'GET':'POST',headers:{Origin:origin,'CF-Connecting-IP':'192.0.2.1',...(token?{Authorization:'Bearer '+token}:{}),...(data===undefined?{}:{'Content-Type':'application/json'})},...(data===undefined?{}:{body:JSON.stringify(data)})}),env);
    return {status:response.status,body:await response.json(),headers:response.headers};
  }
  const setup=await call('/setup',owner);assert.equal(setup.status,200,JSON.stringify(setup.body));
  return {env,call,admin:setup.body.token};
}
async function activated(f) {
  assert.equal((await f.call('/admin/import',{rows:people,apply:true},f.admin)).status,200);
  const search=await f.call('/members/search?q=jörn',undefined,f.admin);
  assert.equal(search.status,200);assert.equal(search.body.length,1);
  const member=search.body[0];
  const code=await f.call('/admin/activation',{memberId:member.id},f.admin);
  const signup=await f.call('/auth/activate',{identifier:'2',password,code:code.body.code});
  assert.equal(signup.status,200,JSON.stringify(signup.body));
  return {member,code:code.body.code,token:signup.body.token};
}

test('setup is one-time, refuses a wrong secret, never makes an import row an admin',async()=>{
  const f=await fixture();
  assert.equal((await f.call('/setup',owner)).status,409);
  assert.equal((await f.call('/setup',{...owner,setupToken:'wrong'})).status,403);
  const user=await activated(f);
  assert.equal((await f.call('/auth/session',undefined,user.token)).body.member.isAdmin,false);
  assert.equal((await f.call('/admin/import',{rows:people},user.token)).status,403);
});
test('no names without a valid server session, forged browser admin does not help',async()=>{
  const f=await fixture();await activated(f);
  for(const token of [undefined,'f'.repeat(64),'m-demo']) {
    assert.equal((await f.call('/members/search?q=jörn',undefined,token)).status,401);
    assert.equal((await f.call('/members/names',{ids:['1'],isAdmin:true},token)).status,401);
  }
  const blocked=await f.call('/members/search?q=jörn',undefined,f.admin,'https://attacker.invalid');
  assert.equal(blocked.status,403);assert.equal(blocked.headers.get('Access-Control-Allow-Origin'),null);
});
test('only own team memberships accompany login/session and changed rosters take effect',async()=>{
  const f=await fixture();const user=await activated(f);
  f.env.DB.sqlite.prepare('INSERT INTO member_teams(member_id,team_key) VALUES (?,?)').run(user.member.id,'herren-55-1');
  const other=f.env.DB.sqlite.prepare('SELECT id FROM members WHERE member_no=?').get('3');
  f.env.DB.sqlite.prepare('INSERT INTO member_teams(member_id,team_key) VALUES (?,?)').run(other.id,'private-other-team');
  const signed=await f.call('/auth/login',{identifier:'2',password});
  assert.deepEqual(signed.body.member.teams,['herren-55-1']);
  assert.deepEqual((await f.call('/auth/session',undefined,user.token)).body.member.teams,['herren-55-1']);
  const hits=await f.call('/members/search?q=private',undefined,user.token);
  assert.equal(JSON.stringify(hits.body).includes('private-other-team'),false);
  f.env.DB.sqlite.prepare('DELETE FROM member_teams WHERE member_id=?').run(user.member.id);
  assert.deepEqual((await f.call('/auth/session',undefined,user.token)).body.member.teams,[]);
});
test('activation requires the issued code, is single use, stores only token and code hashes',async()=>{
  const f=await fixture();const user=await activated(f);
  const replay=await f.call('/auth/activate',{identifier:'2',password,code:user.code});assert.equal(replay.status,401);
  assert.equal((await f.call('/auth/login',{identifier:'2',password:'wrong'})).status,401);
  const signed=await f.call('/auth/login',{identifier:'member@example.invalid',password});assert.equal(signed.status,200);
  const row=f.env.DB.sqlite.prepare('SELECT * FROM members WHERE id=?').get(user.member.id);
  assert.equal(row.activation_hash,null);assert.notEqual(row.password_hash,password);
  assert.equal(f.env.DB.sqlite.prepare('SELECT 1 FROM sessions WHERE token_hash=?').get(signed.body.token),undefined);
  assert.equal((await f.call('/auth/logout',{},signed.body.token)).status,200);
  assert.equal((await f.call('/auth/session',undefined,signed.body.token)).status,401);
});
test('search limits results, handles Unicode, returns no mail or membership numbers, SQL wildcards are literal',async()=>{
  const f=await fixture();const user=await activated(f);
  const found=await f.call('/members/search?q=jörn',undefined,user.token);
  assert.equal(found.body[0].firstName,'JÖRN');
  assert.deepEqual(Object.keys(found.body[0]).sort(),['firstName','id','lastName','openInvites']);
  assert.deepEqual((await f.call('/members/search?q=%25%25',undefined,user.token)).body,[]);
  const rows=[...people,...Array.from({length:12},(_,i)=>({memberNo:'extra'+i,firstName:'Many',lastName:'Matches'+i,email:''}))];
  await f.call('/admin/import',{rows,apply:true},f.admin);
  assert.equal((await f.call('/members/search?q=many',undefined,user.token)).body.length,8);
  assert.deepEqual((await f.call('/members/search?q=a',undefined,user.token)).body,[]);
  assert.equal((await f.call('/members/names',{ids:Array.from({length:101},(_,i)=>String(i))},user.token)).status,400);
});
test('imports preview without writing, reject duplicates, deactivation immediately invalidates sessions',async()=>{
  const f=await fixture();
  const preview=await f.call('/admin/import',{rows:people},f.admin);assert.equal(preview.body.neu.length,2);
  assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members').get().n,1);
  assert.equal((await f.call('/admin/import',{rows:[people[1],people[1]],apply:true},f.admin)).status,400);
  const user=await activated(f);
  const removed=await f.call('/admin/import',{rows:[people[0]],apply:true},f.admin);assert.equal(removed.status,200);
  assert.equal((await f.call('/auth/session',undefined,user.token)).status,401);
  assert.equal((await f.call('/auth/session',undefined,f.admin)).status,200);
});
test('email changes revoke login, expired sessions and excessive login attempts are rejected',async()=>{
  const f=await fixture();const user=await activated(f);
  await f.call('/admin/import',{rows:people.map(m=>m.memberNo==='2'?{...m,email:'changed@example.invalid'}:m),apply:true},f.admin);
  assert.equal((await f.call('/auth/session',undefined,user.token)).status,401);
  assert.equal((await f.call('/auth/login',{identifier:'2',password})).status,401);
  f.env.DB.sqlite.exec('UPDATE sessions SET expires_at=0');
  assert.equal((await f.call('/auth/session',undefined,f.admin)).status,401);
  let result;
  for(let i=0;i<16;i++) result=await f.call('/auth/login',{identifier:'nobody',password:'wrong'});
  assert.equal(result.status,429);
});
test('opening the app renews a valid remembered session, but never an expired one', async () => {
  const f = await fixture();
  const db = f.env.DB.sqlite;
  const expiration = () => db.prepare('SELECT expires_at FROM sessions').get().expires_at;
  const halfDay = 12 * 60 * 60 * 1000;
  const day = 2 * halfDay;
  assert.ok(expiration() > Date.now() + 29 * day);
  db.prepare('UPDATE sessions SET expires_at=?').run(Date.now() + halfDay);
  assert.equal((await f.call('/auth/session', undefined, f.admin)).status, 200);
  const renewed = expiration();
  assert.ok(renewed > Date.now() + 29 * day);
  assert.equal((await f.call('/auth/session', undefined, f.admin)).status, 200);
  assert.equal(expiration(), renewed);
  db.exec('UPDATE sessions SET expires_at=0');
  assert.equal((await f.call('/auth/session', undefined, f.admin)).status, 401);
  assert.equal(expiration(), 0);
});

test('unknown email cannot log in or activate using a real member activation code',async()=>{
  const f=await fixture();await f.call('/admin/import',{rows:people,apply:true},f.admin);
  const row=f.env.DB.sqlite.prepare('SELECT id FROM members WHERE member_no=?').get('2');
  const code=await f.call('/admin/activation',{memberId:row.id},f.admin);
  assert.equal((await f.call('/auth/login',{identifier:'external@example.invalid',password})).status,401);
  assert.equal((await f.call('/auth/activate',{identifier:'external@example.invalid',password,code:code.body.code})).status,401);
  assert.equal((await f.call('/auth/activate',{identifier:'member@example.invalid',password,code:code.body.code})).status,200);
  assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members').get().n,3);
});
test('imported secondary email works; shared family email requires the unique membership number',async()=>{
  const f=await fixture();const rows=people.map(p=>({...p,...(p.memberNo==='2'?{email2:'secondary@example.invalid'}:{})}));
  await f.call('/admin/import',{rows,apply:true},f.admin);
  const row=f.env.DB.sqlite.prepare('SELECT id FROM members WHERE member_no=?').get('2');
  let code=await f.call('/admin/activation',{memberId:row.id},f.admin);
  assert.equal((await f.call('/auth/activate',{identifier:' SECONDARY@EXAMPLE.INVALID ',password,code:code.body.code})).status,200);
  assert.equal((await f.call('/auth/login',{identifier:' MEMBER@EXAMPLE.INVALID ',password})).status,200);
  await f.call('/admin/import',{rows:rows.map(p=>p.memberNo==='3'?{...p,email:'member@example.invalid'}:p),apply:true},f.admin);
  assert.equal((await f.call('/auth/login',{identifier:'member@example.invalid',password})).status,401);
  assert.equal((await f.call('/auth/login',{identifier:'2',password})).status,200);
});

test('missing membership number and trailing mail separators reuse the existing person and keep access',async()=>{
 const f=await fixture(),user=await activated(f);
 const rows=people.map(r=>r.memberNo==='2'?{...r,memberNo:'',email:r.email+';'}:r);
 assert.equal((await f.call('/admin/import',{rows,apply:true},f.admin)).status,200);
 const stored=f.env.DB.sqlite.prepare('SELECT id,member_no,email FROM members WHERE id=?').get(user.member.id);
 assert.equal(stored.member_no,'2');assert.equal(stored.email,'member@example.invalid');
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members').get().n,3);
 assert.equal((await f.call('/auth/session',undefined,user.token)).status,200);
 f.env.DB.sqlite.prepare('UPDATE members SET email=? WHERE id=?').run('member@example.invalid;',user.member.id);
 assert.equal((await f.call('/auth/login',{identifier:'member@example.invalid',password})).status,200);
 assert.equal((await f.call('/admin/import',{rows:people,apply:true},f.admin)).status,200);
 assert.equal((await f.call('/auth/session',undefined,user.token)).status,200,'format cleanup never resets the real password or sessions');
});
test('shared mail with different people and no numbers never collapses household members',async()=>{
 const f=await fixture();const rows=[people[0],{firstName:'Anna',lastName:'Familie',email:'family@example.invalid;'},{firstName:'Tom',lastName:'Familie',email:'family@example.invalid'}];
 assert.equal((await f.call('/admin/import',{rows,apply:true},f.admin)).status,200);
 assert.equal((await f.call('/admin/import',{rows,apply:true},f.admin)).status,200);
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members').get().n,3);
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members WHERE email=?').get('family@example.invalid').n,2);
});

test('member mail archive is admin-only on every route and never exposes drafts publicly',async()=>{
 const f=await fixture(),user=await activated(f);f.env.CMS_BUCKET={list:async()=>({objects:[],truncated:false})};
 for(const [path,data] of [['/admin/member-mail',undefined],['/admin/member-mail/12345678-1234-1234-1234-123456789abc',undefined],['/admin/member-mail/save',{}]]){
  assert.equal((await f.call(path,data)).status,401);
  assert.equal((await f.call(path,data,user.token)).status,403);
 }
 assert.equal((await f.call('/admin/member-mail',undefined,f.admin)).status,200);
 assert.equal((await f.call('/admin/member-mail/save',{},f.admin)).status,400);
 assert.equal((await f.call('/member-mail')).status,401);
});
