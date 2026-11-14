import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './app-sync-fixture.mjs';
import {editorialScheduled,digest} from '../server/cloudflare/editorial.mjs';
import {backupEditorialSystem} from '../server/cloudflare/editorial-backup.mjs';
import {Bucket} from './editorial-fixture.mjs';
import {decryptSystemBackup,restoreDatabase} from './editorial-recovery.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {collectSimpleUsage} from '../server/cloudflare/simple-usage.mjs';
import {readFileSync} from 'node:fs';
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
 const [home,club]=await Promise.all([save(f,[change('page:home',1,{title:'Neu',blocks:[{id:'first',image:ref}]})]),save(f,[change('page:verein',1,{title:'Club neu'})])]);assert.equal(home.status,200);assert.equal(club.status,200);
 const state=await f.call('/public/site');assert.equal(state.body.documents['page:home'].value.title,'Neu');assert.equal(state.body.documents['page:verein'].value.title,'Club neu');
 const privateCheck=await save(f,[change('page:verein',2,{blocks:[{people:[{name:'Public',email:'private@example.invalid',memberId:f.otherId,photoCrop:{image:png}}]}]})]);assert.equal(privateCheck.status,200);
 assert.ok(!JSON.stringify((await f.call('/public/site')).body).includes('private@example.invalid'));
 assert.ok(!JSON.stringify((await f.call('/public/site')).body).includes(f.otherId));
 const r=await (await import('./worker-test-loader.mjs')).default.fetch(new Request('https://tfb-api.test/public/site-media/'+ref),f.env);assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),'image/png');
 const before=f.env.DB.sqlite.prepare('SELECT COUNT(*) AS n FROM cms_history').get().n;
 assert.equal((await save(f,[change('page:home',2,{title:'Missing',blocks:[{id:'first',image:'img:cms-'+'0'.repeat(64)}]})])).status,400);
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

test('Home-to-Aktuell media transfer commits both pages or neither on a revision conflict',async()=>{
 const f=await setup();const upload=await f.call('/admin/site/media',{data:png},f.adminToken),ref=upload.body.ref;
 const source={id:'signature',type:'feature',title:'Signature',mediaCollection:{entries:[{id:'one',title:'Umkleide',format:'4:5',images:[ref,ref,ref,ref,ref]}]}};
 await save(f,[change('page:home',0,{blocks:[source]}),change('page:aktuell',0,{blocks:[]})]);
 const moved={...source,type:'post',date:'2026-11-07'};
 const conflict=await save(f,[change('page:home',1,{blocks:[]}),change('page:aktuell',0,{blocks:[moved]})]);assert.equal(conflict.status,409);
 let state=(await f.call('/public/site')).body;assert.equal(state.documents['page:home'].value.blocks[0].id,'signature');assert.equal(state.documents['page:aktuell'].value.blocks.length,0);
 const success=await save(f,[change('page:home',1,{blocks:[]}),change('page:aktuell',1,{blocks:[moved]})]);assert.equal(success.status,200);
 state=(await f.call('/public/site')).body;assert.equal(state.documents['page:home'].value.blocks.length,0);assert.deepEqual(state.documents['page:aktuell'].value.blocks[0].mediaCollection,source.mediaCollection);
});


test('manual and downloaded backups preserve all usage aggregates; encrypted database restore preserves them too',async()=>{
 const f=await setup();await save(f,[change('page:home',0,{title:'Home'})]);
 const event=page=>({id:crypto.randomUUID(),page,app:true});await collectSimpleUsage(f.env,event('splash'),f.admin,'192.0.2.1');await collectSimpleUsage(f.env,event('home'),f.admin,'192.0.2.1');
 const named=await f.call('/admin/site/checkpoint',{label:'Statistik inklusive'},f.adminToken);assert.equal(named.status,200);
 const snapshot=(await f.call('/admin/site/export?id='+named.body.id,undefined,f.adminToken)).body;
 const live=(await f.call('/admin/site/export',undefined,f.adminToken)).body;
 for(const value of[snapshot,live]){assert.equal(value.statistics.format,'tfb-usage-snapshot');assert.equal(value.statistics.tables.usage_nc_totals.find(t=>t.period.length===10).views,1);assert.equal(value.statistics.tables.usage_nc_pages.find(t=>t.page==='splash').views,1);assert(!('usage_nc_uniques' in value.statistics.tables));assert(!JSON.stringify(value.statistics).includes(f.admin.id));}
 const result=await backupEditorialSystem(f.env),obj=await f.env.CMS_BUCKET.get(result.key),decoded=await decryptSystemBackup(new Uint8Array(await obj.arrayBuffer()),f.env.CMS_BACKUP_KEY);
 const tmp=mkdtempSync('/private/tmp/tfb-usage-restore-');try{const target=tmp+'/restore.sqlite';restoreDatabase(decoded,target);const db=new DatabaseSync(target);assert.equal(db.prepare("SELECT views FROM usage_nc_totals WHERE length(period)=10").get().views,1);assert.equal(db.prepare("SELECT views FROM usage_nc_pages WHERE page='splash'").get().views,1);db.close();}finally{rmSync(tmp,{recursive:true});}
 // An older content restore must never roll back live traffic counts.
 await save(f,[change('page:home',1,{title:'New Home'})]);await collectSimpleUsage(f.env,event('home'),f.admin,'192.0.2.1');
 const request={snapshot:named.body.id},plan=(await f.call('/admin/site/preview',request,f.adminToken)).body;
 const restored=await f.call('/admin/site/restore',{...request,id:crypto.randomUUID(),token:plan.token},f.adminToken);assert.equal(restored.status,200);
 assert.equal(f.env.DB.sqlite.prepare('SELECT views FROM usage_nc_totals WHERE length(period)=10').get().views,2);
});

test('one-time reset clears only club statistics and starts Home and Splash at the same time',async()=>{
 const f=await setup();await save(f,[change('page:home',0,{title:'Home'})]);await collectSimpleUsage(f.env,{id:crypto.randomUUID(),page:'home',app:false},f.admin,'192.0.2.1');
 f.env.DB.sqlite.exec(readFileSync(new URL('../server/cloudflare/operations/reset-usage-2026-11-08.sql',import.meta.url),'utf8'));
 for(const table of['usage_nc_totals','usage_nc_pages','usage_nc_page_months','usage_nc_page_years','usage_nc_uniques','usage_nc_events','usage_nc_sessions','usage_totals','usage_pages','usage_uniques','usage_events'])assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM '+table).get().n,0);
 assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM members').get().n,2);assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM cms_documents').get().n,1);
 const meta=f.env.DB.sqlite.prepare('SELECT value FROM usage_meta').all();assert.equal(meta.length,4);assert.equal(new Set(meta.map(m=>m.value)).size,1);
 await collectSimpleUsage(f.env,{id:crypto.randomUUID(),page:'splash',app:false},f.admin,'192.0.2.1');await collectSimpleUsage(f.env,{id:crypto.randomUUID(),page:'home',app:false},f.admin,'192.0.2.1');
 assert.equal(f.env.DB.sqlite.prepare("SELECT views FROM usage_nc_pages WHERE page='splash'").get().views,1);assert.equal(f.env.DB.sqlite.prepare("SELECT views FROM usage_nc_pages WHERE page='home'").get().views,1);
});

test('the central kiosk switch blocks purchases and preserves existing bookings', async () => {
  const f = await fixture();
  f.env.CMS_BUCKET = new Bucket();
  assert.equal((await save(f, [change('page:home', 0, { title: 'Home', blocks: [] })])).status, 200);
  const account = { kind: 'account', id: f.admin.id, revision: 0, value: {
    consentVersion: 'tfb-kiosk-v3', consentedAt: new Date().toISOString(),
  } };
  const buy = id => ({ kind: 'item', id, revision: 0, value: { productId: 'koelsch' } });
  assert.equal((await f.commit([account, buy('before-close')])).status, 200);
  assert.equal((await save(f, [change('global:kioskActive', 0, false)])).status, 200);
  const closed = await f.commit([buy('while-closed')]);
  assert.equal(closed.status, 409);
  assert.match(closed.body.error, /Kiosk.*geschlossen/);
  assert.deepEqual((await f.state()).body.records.filter(r => r.kind === 'item').map(r => r.id), ['before-close']);
  assert.equal((await save(f, [change('global:kioskActive', 1, true)])).status, 200);
  assert.equal((await f.commit([buy('after-open')])).status, 200);
});

test('only the creating admin can delete active articles, and the archive stays read-only', async () => {
 const f = await setup();
 f.env.DB.sqlite.prepare('UPDATE members SET is_admin=1 WHERE id=?').run(f.otherId);
 const historical = {id:'club-history', type:'post', title:'Vereinsgeschichte'};
 assert.equal((await save(f,[change('page:home',0,{blocks:[historical]}),change('page:aktuell',0,{blocks:[]})])).status,200);
 const own = {id:'b-'+crypto.randomUUID(),type:'post',title:'Mein neuer Artikel',editorialAuthor:f.otherId};
 assert.equal((await save(f,[change('page:home',1,{blocks:[historical,own]})])).status,200);
 const read = async () => (await f.call('/admin/site',undefined,f.adminToken)).body.documents;
 let pages = await read();
 assert.equal(pages['page:home'].value.blocks[1].editorialAuthor,f.admin.id);
 assert.equal((await f.call('/public/site')).body.documents['page:home'].value.blocks[1].editorialAuthor,undefined);
 const foreignDelete = await f.call('/admin/site/commit',{
   id:crypto.randomUUID(),kind:'restore',changes:[change('page:home',2,{blocks:[historical]})]
 },f.otherToken);
 assert.equal(foreignDelete.status,403);
 assert.equal((await save(f,[change('page:home',2,{blocks:[own]})])).status,403);
 assert.equal((await save(f,[change('page:home',2,{blocks:[historical]}),change('page:aktuell',1,{blocks:[own]})])).status,200);
 pages = await read();
 assert.equal(pages['page:aktuell'].value.blocks[0].editorialAuthor,f.admin.id);
 assert.equal((await save(f,[change('page:aktuell',2,{blocks:[]})])).status,200);
 const archived = {...own,id:'b-'+crypto.randomUUID()};
 assert.equal((await save(f,[change('page:aktuell',3,{blocks:[archived]})])).status,200);
 assert.equal((await save(f,[change('page:aktuell',4,{blocks:[{...archived,archived:true}]})])).status,200);
 assert.equal((await save(f,[change('page:aktuell',5,{blocks:[]})])).status,403);
 assert.equal((await save(f,[change('page:aktuell',5,{blocks:[{...archived,archived:true,title:'Versuch'}]})])).status,403);
});

test('verified older Home articles retain their own author and deletion permissions', async () => {
 const f = await setup();
 f.env.DB.sqlite.prepare('UPDATE members SET is_admin=1 WHERE id=?').run(f.otherId);
 const idea = {id:'b-457826b0-1ea5-4e36-9781-247da537c072',type:'feature',title:'Eine Idee nimmt Gestalt an.'};
 const oktoberfest = {id:'b-mw9qi1yd',type:'gallery',title:'Oktoberfest'};
 const anniversary = {id:'h-50',type:'feature',title:'50 Jahre Tennisfreunde'};
 const historic = {id:'club-history',type:'feature',title:'Clubarchiv'};
 const novemberIdea = {id:'b-mw61khx5',type:'post',date:'2026-11-07',title:'Eine Idee nimmt Gestalt an.'};
 const blocks = [idea,oktoberfest,anniversary,historic];
 assert.equal((await save(f,[change('page:home',0,{blocks}),change('page:aktuell',0,{blocks:[novemberIdea]})])).status,200);
 const history = f.env.DB.sqlite.prepare("INSERT INTO cms_history (id,revision,created_at,author,label,kind,object_key) VALUES (?,?,?,?,?,'edit','')");
 history.run('first-admin',57,'2026-11-07T09:54:05.080Z',f.admin.id,'Inhalte gespeichert');
 history.run('second-admin',86,'2026-11-09T20:53:14.973Z',f.otherId,'Inhalte gespeichert');
 const read = token => f.call('/admin/site',undefined,token);
 const edit = (token, changes) => f.call('/admin/site/commit',{id:crypto.randomUUID(),changes},token);
 assert.deepEqual((await read(f.adminToken)).body.documents['page:home'].value.blocks.map(b=>b.editorialAuthor),[f.admin.id,f.otherId,f.admin.id,undefined]);
 assert.ok((await f.call('/public/site')).body.documents['page:home'].value.blocks.every(b=>!b.editorialAuthor));
 assert.equal((await edit(f.otherToken,[change('page:home',1,{blocks:[oktoberfest,anniversary,historic]})])).status,403);
 assert.equal((await edit(f.adminToken,[change('page:home',1,{blocks:[idea,anniversary,historic]})])).status,403);
 assert.equal((await edit(f.adminToken,[change('page:home',1,{blocks:[idea,oktoberfest,anniversary]})])).status,403);
 assert.equal((await edit(f.otherToken,[change('page:home',1,{blocks:[idea,anniversary,historic]})])).status,200);
 assert.equal((await edit(f.adminToken,[change('page:home',2,{blocks:[historic]})])).status,200);
 assert.equal((await read(f.adminToken)).body.documents['page:aktuell'].value.blocks[0].editorialAuthor,f.admin.id);
 assert.equal((await edit(f.otherToken,[change('page:aktuell',1,{blocks:[]})])).status,403);
 assert.equal((await edit(f.adminToken,[change('page:aktuell',1,{blocks:[]})])).status,200);
});
