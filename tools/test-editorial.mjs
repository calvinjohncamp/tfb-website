import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './app-sync-fixture.mjs';
import {editorialScheduled,digest} from '../server/cloudflare/editorial.mjs';
import {backupEditorialSystem} from '../server/cloudflare/editorial-backup.mjs';
import {Bucket} from './editorial-fixture.mjs';
import {decryptSystemBackup,restoreDatabase} from './editorial-recovery.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
async function setup(){const f=await fixture();f.env.CMS_BUCKET=new Bucket();f.env.CMS_BACKUP_KEY='ab'.repeat(32);return f;}
const change=(key,expected,value)=>({key,expected,value});
const save=(f,changes,id=crypto.randomUUID())=>f.call('/admin/site/commit',{id,changes},f.adminToken);
test('CMS access, published media, revision conflicts, independent page saves and idempotence',async()=>{
 const f=await setup();assert.equal((await f.call('/admin/site',undefined)).status,401);assert.equal((await f.call('/admin/site',undefined,f.otherToken)).status,403);
 assert.equal((await f.call('/public/site')).status,503);
 const media=await f.call('/admin/site/media',{data:png},f.adminToken);assert.equal(media.status,200);const ref=media.body.ref;
 assert.equal((await f.call('/public/site-media/'+ref)).status,404);
 const id=crypto.randomUUID(),changes=[change('page:home',0,{title:'Home',blocks:[{id:'first',image:ref,title:'Erster Beitrag'}]}),change('page:verein',0,{title:'Club',blocks:[{people:[{name:'Public',email:'private@example.invalid',phone:'secret',memberId:f.otherId}]}]})];
 assert.equal((await save(f,changes,id)).status,200);assert.equal((await save(f,changes,id)).status,200);
 assert.equal((await save(f,[change('page:home',0,{title:'Stale'})])).status,409);
 const [home,club]=await Promise.all([save(f,[change('page:home',1,{title:'Neu',blocks:[{id:'second',image:ref}]})]),save(f,[change('page:verein',1,{title:'Club neu'})])]);assert.equal(home.status,200);assert.equal(club.status,200);
 const state=await f.call('/public/site');assert.equal(state.body.documents['page:home'].value.title,'Neu');assert.equal(state.body.documents['page:verein'].value.title,'Club neu');
 const privateCheck=await save(f,[change('page:verein',2,{blocks:[{people:[{name:'Public',email:'private@example.invalid',memberId:f.otherId,photoCrop:{image:png}}]}]})]);assert.equal(privateCheck.status,200);
 assert.ok(!JSON.stringify((await f.call('/public/site')).body).includes('private@example.invalid'));
 assert.ok(!JSON.stringify((await f.call('/public/site')).body).includes(f.otherId));
 const r=await (await import('./worker-test-loader.mjs')).default.fetch(new Request('https://tfb-api.test/public/site-media/'+ref),f.env);assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),'image/png');
 const before=f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM cms_history').get().n;
 assert.equal((await save(f,[change('page:home',2,{title:'Missing',image:'img:cms-'+'0'.repeat(64)})])).status,400);
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM cms_history').get().n,before);
 assert.equal((await f.call('/admin/site/media',{data:'data:image/png;base64,aGVsbG8='},f.adminToken)).status,400);
});
test('preview restores only selected editorial pages, creates safety copy, leaves business records untouched',async()=>{
 const f=await setup();const first=await save(f,[change('page:home',0,{title:'Alt',blocks:[]}),change('page:verein',0,{title:'Club alt'})]);
 await save(f,[change('page:home',1,{title:'Neu',blocks:[]}),change('page:verein',1,{title:'Club neu'})]);
 const counts=()=>f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM members').get().n;
 const original=counts();
 const posted=await f.commit([{kind:'post',id:'new-after-snapshot',revision:0,value:{scope:'club',text:'Neuer Chat bleibt erhalten',images:[]}}]);assert.equal(posted.status,200);
 const businessBefore=JSON.stringify(f.env.DB.sqlite.prepare('SELECT * FROM app_records ORDER BY kind,id').all());
 const body={snapshot:first.body.snapshot,keys:['page:home']};
 const preview=await f.call('/admin/site/preview',body,f.adminToken);assert.equal(preview.status,200);assert.equal(preview.body.summary[0].key,'page:home');
 assert.equal((await f.call('/admin/site/restore',{...body,id:crypto.randomUUID(),token:'wrong'},f.adminToken)).status,409);
 const restored=await f.call('/admin/site/restore',{...body,id:crypto.randomUUID(),token:preview.body.token},f.adminToken);assert.equal(restored.status,200);assert.equal(counts(),original);assert.equal(JSON.stringify(f.env.DB.sqlite.prepare('SELECT * FROM app_records ORDER BY kind,id').all()),businessBefore);
 const state=(await f.call('/public/site')).body;assert.equal(state.documents['page:home'].value.title,'Alt');assert.equal(state.documents['page:verein'].value.title,'Club neu');assert.equal(state.documents['page:home'].revision,3);
 assert.equal(f.env.DB.sqlite.prepare("SELECT COUNT(*) AS n FROM cms_history WHERE kind='safety'").get().n,1);
 const exported=await f.call('/admin/site/export?id='+first.body.snapshot,undefined,f.adminToken);assert.equal(exported.body.format,'tfb-website-snapshot');assert.equal(exported.body.project,'tfb');
 assert.equal((await f.call('/admin/site/preview',{manifest:{format:'tfb-sicherung',version:1}},f.adminToken)).status,400);
 assert.equal((await save(f,[change('global:nav',0,[{target:'javascript:alert(1)'}])])).status,400);
});
test('scheduled backups and snapshot retention; encrypted database archive can be decrypted',async()=>{
 const f=await setup();await save(f,[change('page:home',0,{title:'Home'})]);
 await editorialScheduled(f.env);await editorialScheduled(f.env);
 assert.equal(f.env.DB.sqlite.prepare("SELECT COUNT(*) AS n FROM cms_history WHERE kind='daily'").get().n,1);
 const named=await f.call('/admin/site/checkpoint',{label:'Vorstandsfreigabe'},f.adminToken);assert.equal(named.status,200);
 const result=await backupEditorialSystem(f.env);const object=await f.env.CMS_BUCKET.get(result.key),bytes=new Uint8Array(await object.arrayBuffer());
 assert.ok(!new TextDecoder().decode(bytes).includes('synthetic-pepper'));
 const key=await crypto.subtle.importKey('raw',Uint8Array.from({length:32},()=>0xab),'AES-GCM',false,['decrypt']);
 const packed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12)},key,bytes.slice(12));
 const archive=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).json();assert.equal(archive.format,'tfb-system-backup');assert.equal(archive.tables.members.length,2);assert.equal(archive.tables.cms_documents[0].key,'page:home');
 assert.ok(archive.history);assert.ok(await digest(bytes));
 const tmp=mkdtempSync('/private/tmp/tfb-restore-');try{const decoded=await decryptSystemBackup(bytes,f.env.CMS_BACKUP_KEY),target=tmp+'/independent.sqlite';const check=restoreDatabase(decoded,target);assert.ok(check.tables>=10);const restored=new DatabaseSync(target);assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM members').get().n,2);assert.equal(restored.prepare('SELECT COUNT(*) AS n FROM sessions').get().n,0);assert.equal(restored.prepare("SELECT payload FROM cms_documents WHERE key='page:home'").get().payload,JSON.stringify({title:'Home'}));restored.close();assert.throws(()=>restoreDatabase(decoded,target),/already exists/);await assert.rejects(()=>decryptSystemBackup(bytes,'cd'.repeat(32)));}finally{rmSync(tmp,{recursive:true});}

});
test('board portraits retain approved crops and originals without publishing private member photos',async()=>{
 const f=await setup();const media=await f.call('/admin/site/media',{data:png},f.adminToken);const ref=media.body.ref;
 const posted=await f.commit([{kind:'account',id:f.admin.id,revision:0,value:{avatar:png,avatarLarge:png,photoPublic:false}}]);assert.equal(posted.status,200);
 await save(f,[change('page:home',0,{title:'Home'}),change('page:verein',0,{blocks:[{id:'v-vorstand',type:'people',people:[{name:'Static board',image:ref,photoCrop:{source:ref,image:png}},{memberId:f.admin.id,name:'Linked board'}]}]})]);
 let board=(await f.call('/public/site')).body.boardPeople;assert.equal(board[0].avatar,png);assert.equal(board[0].avatarLarge,ref);assert.equal(board[1].avatar,null);assert.equal(board[1].avatarLarge,null);
 const record=f.env.DB.sqlite.prepare("SELECT payload_id FROM app_records WHERE kind='account' AND id=?").get(f.admin.id);const payload=f.env.DB.sqlite.prepare('SELECT data FROM app_payloads WHERE payload_id=? AND part=0').get(record.payload_id);const account=JSON.parse(payload.data);account.photoPublic=true;account.photoPending=false;f.env.DB.sqlite.prepare('UPDATE app_payloads SET data=? WHERE payload_id=? AND part=0').run(JSON.stringify(account),record.payload_id);
 board=(await f.call('/public/site')).body.boardPeople;assert.equal(board[1].avatar,png);assert.equal(board[1].avatarLarge,png);
});
