import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import worker from './worker-test-loader.mjs';
class D1 {
  constructor(){this.sqlite=new DatabaseSync(':memory:');this.pending=Promise.resolve();}
  async exec(sql){this.sqlite.exec(sql);}
  prepare(sql){const db=this.sqlite;let args=[];const q={bind(...v){args=v;return q;},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}};return q;}
  batch(statements){const task=this.pending.then(async()=>{this.sqlite.exec('BEGIN');try{const out=[];for(const q of statements)out.push(await q.run());this.sqlite.exec('COMMIT');return out;}catch(e){this.sqlite.exec('ROLLBACK');throw e;}});this.pending=task.catch(()=>{});return task;}
}
export async function fixture(){
  const env={DB:new D1(),PASSWORD_PEPPER:'synthetic-pepper-'.repeat(4),SETUP_TOKEN:'x'.repeat(64)};
  async function call(path,data,token){const r=await worker.fetch(new Request('https://tfb-api.test'+path,{method:data===undefined?'GET':'POST',headers:{Origin:'https://joern-kaemper.de','CF-Connecting-IP':'192.0.2.2',...(token?{Authorization:'Bearer '+token}:{}),...(data===undefined?{}:{'Content-Type':'application/json'})},...(data===undefined?{}:{body:JSON.stringify(data)})}),env);return {status:r.status,body:await r.json()};}
  const setup=await call('/setup',{setupToken:env.SETUP_TOKEN,firstName:'Demo',lastName:'Owner',email:'test@example.invalid',password:'Synthetic password only 123!'});
  assert.equal(setup.status,200);const admin=setup.body.member,adminToken=setup.body.token;
  const otherId=crypto.randomUUID();
  env.DB.sqlite.prepare("INSERT INTO members(id,first_name,last_name,email,search_text,updated_at) VALUES (?,'Other','Member','other@example.invalid','other member other@example.invalid',?)").run(otherId,Date.now());
  const token='b'.repeat(64),hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('hex');
  env.DB.sqlite.prepare('INSERT INTO sessions VALUES (?,?,?)').run(hash,otherId,Date.now()+100000);
  const commit=(ops,token=adminToken,extra={})=>{
    const uid=token===adminToken?admin.id:otherId;
    if(ops.some(o=>['post','comment'].includes(o.kind)&&!o.deleted)&&!ops.some(o=>o.kind==='account'&&o.id===uid)&&!env.DB.sqlite.prepare("SELECT 1 FROM app_records WHERE kind='account' AND id=?").get(uid))ops=[{kind:'account',id:uid,revision:0,value:{feedRules:'yes'}},...ops];
    return call('/app/commit',{id:crypto.randomUUID(),operations:ops,...extra},token);
  };
  const state=(t=adminToken)=>call('/app/state',undefined,t);
  return {env,call,commit,state,admin,adminToken,otherId,otherToken:token};
}
