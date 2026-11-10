import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {memberMailList,memberMailGet,memberMailSave,memberMailDelete,memberMailRestore,memberMailTest} from '../server/cloudflare/member-mail.mjs';
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

test('deletion is reversible, absent from the archive and protected against stale saves',async()=>{
 const env={CMS_BUCKET:new Bucket()},saved=await memberMailSave(env,admin,base);
 const removed=await memberMailDelete(env,admin,{id,expectedEtag:saved.etag});assert.ok(removed.deletedAt);assert.equal((await memberMailList(env)).rows.length,0);
 await assert.rejects(memberMailGet(env,id),{status:404});await assert.rejects(memberMailSave(env,admin,{...base,expectedEtag:saved.etag}),{status:409});
 await memberMailRestore(env,admin,{id,expectedEtag:removed.etag});assert.equal((await memberMailGet(env,id)).body,base.body);assert.equal((await memberMailList(env)).rows.length,1);
});
test('test delivery is only to the current admin, matches the canonical renderer and is idempotent',async()=>{
 const messages=[],env={CMS_BUCKET:new Bucket(),AUTH_MAIL:{send:async message=>messages.push(message)}},member={id:'test-admin',email:'ADMIN@example.invalid'},request={...base,requestId:crypto.randomUUID(),to:'outsider@example.invalid'};
 const result=await memberMailTest(env,member,request);assert.equal(result.to,'admin@example.invalid');assert.deepEqual(messages[0].to,['admin@example.invalid']);assert.match(messages[0].subject,/^\[TFB Test\]/);assert.ok(messages[0].html.includes('Hallo &amp; willkommen.'));assert.equal(messages[0].html.includes('contenteditable'),false);
 await memberMailTest(env,member,request);assert.equal(messages.length,1);
 await assert.rejects(memberMailTest(env,member,{...request,body:'Changed'}),{status:409});
 assert.equal((await memberMailList(env,member)).rows.length,0,'sending a test never saves an archive entry');
});
test('failed test delivery retains a retry key and cannot fall back to bulk or a supplied recipient',async()=>{
 const env={CMS_BUCKET:new Bucket(),AUTH_MAIL:{send:async()=>{throw Error('provider failure');}}},member={id:'admin',email:'admin@example.invalid'},request={...base,requestId:crypto.randomUUID()};
 await assert.rejects(memberMailTest(env,member,request),{status:503});let count=0;env.AUTH_MAIL.send=async()=>{count++;};await memberMailTest(env,member,request);assert.equal(count,1);
 await assert.rejects(memberMailTest(env,{id:'no-mail'},{...request,requestId:crypto.randomUUID(),to:'outside@example.invalid'}),{status:400});
});

test('structured formatting survives archive, copy and canonical email delivery in both worlds',async()=>{
 const messages=[],env={CMS_BUCKET:new Bucket(),AUTH_MAIL:{send:async message=>messages.push(message)}},formatting={salutation:[{text:'Liebe ',bold:true},{text:'Mitglieder',bold:true,italic:true,signature:true},{text:',',bold:true}],body:[{text:base.body}]};
 const saved=await memberMailSave(env,admin,{...base,formatting});assert.deepEqual(saved.formatting,formatting);assert.deepEqual((await memberMailGet(env,id)).formatting,formatting);
 assert.equal((await memberMailSave(env,admin,{...base,formatting})).etag,saved.etag);assert.deepEqual((await memberMailSave(env,admin,{...base,id:other,formatting})).formatting,formatting);
 await assert.rejects(memberMailSave(env,admin,{...base,expectedEtag:saved.etag}),{status:409});
 for(const theme of ['club','red']){await memberMailTest(env,{id:'admin',email:'admin@example.invalid'},{...base,theme,formatting,requestId:crypto.randomUUID()});const message=messages.at(-1);assert.ok(message.html.includes('<em style="font-style:italic"><strong style="font-weight:700">Mitglieder</strong></em>'));assert.ok(message.html.includes(theme==='red'?'style="color:#C4553A"':'background-color:#FFC300;color:#001D3D'));assert.equal(message.html.includes('data-mm-command'),false);assert.ok(message.text.includes(base.salutation));}
});
test('formatting rejects foreign markup, wrong fields, mismatching text and excessive runs',async()=>{
 for(const formatting of [{date:[{text:base.date}]},{body:[{text:'Different'}]},{body:[{text:base.body,html:'<script>'}]},{body:[{text:base.body,bold:'yes'}]},{body:Array.from({length:2001},()=>({text:''}))}])await assert.rejects(memberMailSave({CMS_BUCKET:new Bucket()},admin,{...base,formatting}),{status:400});
 const env={CMS_BUCKET:new Bucket(),AUTH_MAIL:{send:async message=>{assert.ok(message.html.includes('&lt;img src=x onerror=alert(1)&gt;'));assert.equal(message.html.includes('<img src=x'),false);}}},body='<img src=x onerror=alert(1)>';
 await memberMailTest(env,{id:'admin',email:'admin@example.invalid'},{...base,body,formatting:{body:[{text:body,bold:true}]},requestId:crypto.randomUUID()});
});


test('salutation defaults to bold in legacy letters, while explicit plain formatting remains possible',async()=>{
 const {html}=await import('../assets/js/member-mail-renderer.mjs');assert.ok(html(base).includes('<strong style="font-weight:700">Liebe Mitglieder,</strong>'));assert.ok(!html({...base,formatting:{salutation:[{text:base.salutation}]}}).includes('<strong style="font-weight:700">Liebe Mitglieder,</strong>'));
});
