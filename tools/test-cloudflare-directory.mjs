import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
const bundleUrl=pathToFileURL(process.env.TFB_WORKER_BUNDLE || '/tmp/tfb-worker-bundle/worker.js');
const bundled=readFileSync(bundleUrl,'utf8').replace(/import (\w+) from ["']([^"']+\.sql)["'];/g,
  (_,name,path)=>`const ${name} = ${JSON.stringify(readFileSync(new URL(path,bundleUrl),'utf8'))};`);
const { default: worker } = await import('data:text/javascript;base64,'+Buffer.from(bundled).toString('base64'));

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
