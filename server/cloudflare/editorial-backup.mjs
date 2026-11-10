// Private, encrypted whole-database backups. Restoration is an operator task,
// never the normal "restore Home" action. R2 objects for media/releases are immutable.
import {digest,editorialCheckpoint,readSnapshot,editorialPrune} from './editorial.mjs';
const enc=new TextEncoder();
const quote=s=>'"'+s.replaceAll('"','""')+'"';
const hexBytes=s=>Uint8Array.from(s.match(/../g)||[],x=>parseInt(x,16));
export async function databaseArchive(env){
 const schema=(await env.DB.prepare("SELECT type,name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY type,name").all()).results;
 const transient=new Set(['sessions','rate_limits','cms_guards','cms_backup_status']);
 const scan=async name=>{if(transient.has(name))return [];const result=[];for(let offset=0;;offset+=200){const rows=(await env.DB.prepare('SELECT * FROM '+quote(name)+' LIMIT 200 OFFSET ?').bind(offset).all()).results;result.push(...rows);if(rows.length<200)return result;}};
 const tables={};for(const table of schema.filter(x=>x.type==='table'))tables[table.name]=await scan(table.name);
 const history={};for(const row of tables.cms_history||[]){const object=await env.CMS_BUCKET.get(row.object_key);if(!object)throw Error('A referenced snapshot is missing');history[row.object_key]=await object.json();}
 // Capture a consistent revision: background edits trigger a retry rather than
 // silently accepting a torn CMS snapshot. D1's own export remains the disaster fallback.
 for(const name of Object.keys(tables))if(await digest(JSON.stringify(tables[name]))!==await digest(JSON.stringify(await scan(name))))throw Error('Data changed during backup; retry required');
 const expected=new Map([...(tables.cms_media||[]).map(x=>[x.object_key,x.hash]),...(tables.cms_releases||[]).map(x=>[x.object_key,x.sha256])]);
 const objects=[];let cursor;do{const list=await env.CMS_BUCKET.list({prefix:'editorial/',cursor});objects.push(...list.objects.filter(x=>!x.key.startsWith('editorial/history/')).map(x=>({key:x.key,size:x.size,...(expected.has(x.key)?{sha256:expected.get(x.key)}:{})})));cursor=list.truncated?list.cursor:undefined;}while(cursor);
 const bucketDocuments={};let mailCursor;
 do{const page=await env.CMS_BUCKET.list({prefix:'member-mail/',limit:1000,...(mailCursor?{cursor:mailCursor}:{})});for(const entry of page.objects){const object=await env.CMS_BUCKET.get(entry.key);if(!object)throw Error('Mail archive changed during backup; retry required');const text=await object.text();bucketDocuments[entry.key]={text,sha256:await digest(text)};}mailCursor=page.truncated?page.cursor:undefined;}while(mailCursor);
 for(const [name,document] of Object.entries(bucketDocuments)){const current=await env.CMS_BUCKET.get(name);if(!current||await digest(await current.text())!==document.sha256)throw Error('Mail archive changed during backup; retry required');}
 return {format:'tfb-system-backup',version:1,createdAt:new Date().toISOString(),schema,tables,history,objects,bucketDocuments};
}
export async function backupEditorialSystem(env,options={}){
 if(!env.CMS_BUCKET||!/^([a-f0-9]{64})$/.test(env.CMS_BACKUP_KEY||''))throw Error('Private backup storage/key missing');
 const attempt=new Date().toISOString();
 await env.DB.prepare("INSERT INTO cms_backup_status(id,last_attempt) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET last_attempt=excluded.last_attempt").bind(attempt).run();
 try{
 const data=await databaseArchive(env);if(options.revision!==undefined&&data.tables.cms_head?.[0]?.revision!==options.revision)throw Error('Die Website wurde während der Sicherung geändert. Bitte erneut sichern.');const raw=enc.encode(JSON.stringify(data));
 if(env.BACKUP_BUCKET){for(const object of data.objects){const existing=await env.BACKUP_BUCKET.head(object.key);if(existing?.size===object.size&&object.sha256&&existing.customMetadata?.sha256===object.sha256)continue;const source=await env.CMS_BUCKET.get(object.key);if(!source)throw Error('A backup object is missing');await env.BACKUP_BUCKET.put(object.key,source.body,{customMetadata:object.sha256?{sha256:object.sha256}:{}});}}
 const gzip=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
 const iv=crypto.getRandomValues(new Uint8Array(12)),key=await crypto.subtle.importKey('raw',hexBytes(env.CMS_BACKUP_KEY),'AES-GCM',false,['encrypt']);
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,gzip));const bytes=new Uint8Array(12+cipher.length);bytes.set(iv);bytes.set(cipher,12);
 const stamp=data.createdAt.slice(0,10),objectKey=options.snapshot?'backups/points/'+options.snapshot+'.json.gz.aes':'backups/daily/'+stamp+'.json.gz.aes';
 await env.CMS_BUCKET.put(objectKey,bytes,{customMetadata:{format:'tfb-system-backup-v1',sha256:await digest(bytes)}});
 if(env.BACKUP_BUCKET){await env.BACKUP_BUCKET.put(objectKey,bytes,{customMetadata:{sha256:await digest(bytes)}});const mirrored=await env.BACKUP_BUCKET.head(objectKey);if(mirrored?.size!==bytes.length||mirrored.customMetadata?.sha256!==await digest(bytes))throw Error('Independent backup copy could not be confirmed');}
 if(options.snapshot){await env.CMS_BUCKET.put('backups/daily/'+stamp+'.json.gz.aes',bytes);if(env.BACKUP_BUCKET)await env.BACKUP_BUCKET.put('backups/daily/'+stamp+'.json.gz.aes',bytes);}
 const month=stamp.slice(0,7),monthly='backups/monthly/'+month+'.json.gz.aes';if(!await env.CMS_BUCKET.head(monthly)){await env.CMS_BUCKET.put(monthly,bytes);if(env.BACKUP_BUCKET)await env.BACKUP_BUCKET.put(monthly,bytes);}
 for(const [prefix,keep] of [['backups/daily/',30],['backups/monthly/',12]]){const list=await env.CMS_BUCKET.list({prefix,limit:1000});const rows=list.objects.sort((a,b)=>b.key.localeCompare(a.key));for(const object of rows.slice(keep)){await env.CMS_BUCKET.delete(object.key);if(env.BACKUP_BUCKET)await env.BACKUP_BUCKET.delete(object.key);}}
 await env.DB.prepare("UPDATE cms_backup_status SET last_success=?,last_error='' WHERE id=1").bind(new Date().toISOString()).run();
 return {key:objectKey,size:bytes.length,sha256:await digest(bytes),mailDocuments:Object.keys(data.bucketDocuments).length};
 }catch(e){await env.DB.prepare("UPDATE cms_backup_status SET last_error=? WHERE id=1").bind('Die technische Sicherung ist fehlgeschlagen. Der letzte erfolgreiche Stand bleibt erhalten.').run();throw e;}
}

// One user-visible point links its website state to the encrypted database/mail archive.
// Normal restoration still writes ONLY the whitelisted editorial documents.
export async function unifiedBackup(env,member,data={},internal=false){
 const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
 if(!env.CMS_BUCKET||!/^([a-f0-9]{64})$/.test(env.CMS_BACKUP_KEY||''))fail(503,'Die Sicherung ist derzeit nicht bereit. Der bisherige Stand bleibt erhalten.');
 if(env.BACKUP_MIRROR_REQUIRED==='1'&&!env.BACKUP_BUCKET)fail(503,'Der zusätzliche Sicherungsspeicher ist derzeit nicht erreichbar. Bitte später erneut versuchen.');
 if(env.BACKUP_MIRROR_REQUIRED==='1'){const release=await env.DB.prepare('SELECT object_key,size FROM cms_releases ORDER BY created_at DESC LIMIT 1').first();if(!release||!await env.CMS_BUCKET.head(release.object_key))fail(503,'Der passende Programmstand muss vor der ersten Sicherung hinterlegt werden.');}
 if(typeof data.id!=='string'||!/^[a-f0-9-]{36}$/.test(data.id)||typeof(data.label||'')!=='string'||(data.label||'').length>120)fail(400,'Bitte einen gültigen Sicherungsnamen verwenden.');
 const kind=internal?(data.kind||'manual'):'manual',period=internal?(data.bucket||''):'';
 if(!['manual','safety','daily','monthly'].includes(kind))fail(400,'Ungültige Sicherung.');
 const label=(data.label||'').trim()||'Sicherung vom '+new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Berlin'}).format(new Date());
 const requestKey='backups/requests/'+data.id+'.json',old=await env.CMS_BUCKET.get(requestKey),prior=old?await old.json():null;
 if(prior&&prior.requestLabel!==(data.label||''))fail(409,'Diese Sicherung gehört zu einem anderen Namen.');
 if(prior?.status==='complete')return prior.result;
 if(prior?.snapshot){const saved=await readSnapshot(env,prior.snapshot);if(saved.systemBackup){return {id:saved.id,label:saved.label,createdAt:saved.createdAt,complete:true};}}
 if(prior?.status==='pending'&&Date.now()-prior.startedAt<180000)fail(409,'Die Sicherung läuft bereits. Bitte kurz warten.');
 const receipt={status:'pending',startedAt:Date.now(),requestLabel:data.label||''};
 const lock=await env.CMS_BUCKET.put(requestKey,JSON.stringify(receipt),{onlyIf:old?{etagMatches:old.etag}:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json',cacheControl:'no-store'}});
 if(!lock)fail(409,'Die Sicherung läuft bereits. Bitte kurz warten.');
 let snapshot;
 try{
  const created=await editorialCheckpoint(env,member,{label,kind,bucket:period,unified:true});snapshot=await readSnapshot(env,created.id);
  await env.CMS_BUCKET.put(requestKey,JSON.stringify({...receipt,snapshot:snapshot.id}));
  const systemBackup=await backupEditorialSystem(env,{snapshot:snapshot.id,revision:snapshot.revision});
  const completed={...snapshot,systemBackup};
  await env.CMS_BUCKET.put('editorial/history/'+snapshot.id+'.json',JSON.stringify(completed),{httpMetadata:{contentType:'application/json'},customMetadata:{backup:'complete'}});
  const result={id:snapshot.id,label:snapshot.label,createdAt:snapshot.createdAt,complete:true};
  await env.CMS_BUCKET.put(requestKey,JSON.stringify({...receipt,status:'complete',snapshot:snapshot.id,result})).catch(()=>{});return result;
 }catch(error){
  if(snapshot)await env.CMS_BUCKET.put('editorial/history/'+snapshot.id+'.json',JSON.stringify(snapshot),{httpMetadata:{contentType:'application/json'},customMetadata:{backup:'failed'}});
  await env.CMS_BUCKET.put(requestKey,JSON.stringify({...receipt,status:'failed',snapshot:snapshot?.id}));
  fail(error.status||503,'Die Sicherung konnte nicht vollständig abgeschlossen werden. Deine Daten bleiben erhalten. Bitte erneut versuchen.');
 }
}
export async function unifiedScheduled(env){
 const now=new Date().toISOString();
 for(const [kind,bucket,label] of [['daily',now.slice(0,10),'Automatische Tagessicherung'],['monthly',now.slice(0,7),'Automatische Monatssicherung']]){
  const existing=await env.DB.prepare('SELECT id FROM cms_history WHERE kind=? AND bucket=?').bind(kind,bucket).first();
  if(existing){const snapshot=await readSnapshot(env,existing.id);if(!snapshot.unified||snapshot.systemBackup)continue;}
  const hash=await digest(kind+bucket),id=hash.slice(0,8)+'-'+hash.slice(8,12)+'-'+hash.slice(12,16)+'-'+hash.slice(16,20)+'-'+hash.slice(20,32);
  await unifiedBackup(env,{id:'system'},{id,label,kind,bucket},true);
 }
 await editorialPrune(env);
}
