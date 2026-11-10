import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {memberMailList,memberMailGet,memberMailSave} from '../server/cloudflare/member-mail.mjs';
class Bucket{
 objects=new Map();
 async get(key){const o=this.objects.get(key);return o?{...o,json:async()=>JSON.parse(o.value)}:null;}
 async put(key,value,options){const o=this.objects.get(key);if(options.onlyIf instanceof Headers){if(options.onlyIf.get('If-None-Match')==='*'&&o)return null;}else if(options.onlyIf?.etagMatches!==o?.etag)return null;
 const object={key,value,customMetadata:options.customMetadata,etag:createHash('md5').update(value).digest('hex')};this.objects.set(key,object);return object;}
 async list({prefix,cursor}){const objects=[...this.objects.values()].filter(o=>o.key.startsWith(prefix));const start=Number(cursor)||0;return {objects:objects.slice(start,start+1),truncated:start+1<objects.length,cursor:String(start+1)};}
}
const id='12345678-1234-1234-1234-123456789abc',other='87654321-1234-1234-1234-123456789abc',admin={id:'admin'},base={id,expectedEtag:null,name:'Saisonstart',date:'2026-11-10',subject:'Es geht wieder los',headline:'Es geht\nwieder los.',salutation:'Liebe Mitglieder,',body:'Hallo & willkommen.\n\nSchön, dass ihr dabei seid.',closing:'Viele Grüße\nEuer Vorstand',theme:'club'};
test('central roundtrip, overwrite, save-as and list paging preserve independent letters',async()=>{
 const env={CMS_BUCKET:new Bucket()};const first=await memberMailSave(env,admin,base);assert.ok(first.etag);assert.equal((await memberMailGet(env,id)).body,base.body);
 const changed=await memberMailSave(env,admin,{...base,body:'Neuer Text',expectedEtag:first.etag});assert.notEqual(first.etag,changed.etag);
 const copy=await memberMailSave(env,admin,{...base,id:other,name:'Saisonstart 2027',date:'2027-03-01'});assert.equal(copy.body,base.body);assert.equal((await memberMailGet(env,id)).body,'Neuer Text');
 const list=await memberMailList(env);assert.equal(list.rows.length,2);assert.equal(JSON.stringify(list).includes(base.body),false);
});
test('replayed writes are idempotent, stale edits fail without losing the current version',async()=>{
 const env={CMS_BUCKET:new Bucket()};const first=await memberMailSave(env,admin,base);const repeat=await memberMailSave(env,admin,base);assert.equal(first.etag,repeat.etag);assert.equal(env.CMS_BUCKET.objects.size,1);
 const newer=await memberMailSave(env,admin,{...base,body:'Aktuell',expectedEtag:first.etag});
 await assert.rejects(memberMailSave(env,admin,{...base,body:'Veraltet',expectedEtag:first.etag}),{status:409});assert.equal((await memberMailGet(env,id)).body,'Aktuell');
 const replay=await memberMailSave(env,admin,{...base,body:'Aktuell',expectedEtag:first.etag});assert.equal(replay.etag,newer.etag);
});
test('atomic conditions reject an edit that races another writer',async()=>{
 const env={CMS_BUCKET:new Bucket()},first=await memberMailSave(env,admin,base);const put=env.CMS_BUCKET.put.bind(env.CMS_BUCKET);let once=true;
 env.CMS_BUCKET.put=async(key,value,options)=>{if(once){once=false;await put(key,JSON.stringify({...first,body:'Parallel gespeichert'}),{onlyIf:{etagMatches:first.etag}});}return put(key,value,options);};
 await assert.rejects(memberMailSave(env,admin,{...base,body:'Race',expectedEtag:first.etag}),{status:409});assert.equal((await memberMailGet(env,id)).body,'Parallel gespeichert');
});
test('invalid dates, paths, header injection, missing or oversized content are rejected',async()=>{
 for(const data of [{...base,id:'../../editorial'},{...base,date:'2026-02-30'},{...base,subject:'Hi\nBcc:all'},{...base,body:''},{...base,body:'x'.repeat(30001)},{...base,theme:'unknown'}])await assert.rejects(memberMailSave({CMS_BUCKET:new Bucket()},admin,data),{status:400});
 await assert.rejects(memberMailGet({CMS_BUCKET:new Bucket()},id),{status:404});
});
