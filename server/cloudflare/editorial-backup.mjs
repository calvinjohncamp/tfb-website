// Private, encrypted whole-database backups. Restoration is an operator task,
// never the normal "restore Home" action. R2 objects for media/releases are immutable.
import {digest} from './editorial.mjs';
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
 const objects=[];let cursor;do{const list=await env.CMS_BUCKET.list({prefix:'editorial/',cursor});objects.push(...list.objects.filter(x=>!x.key.startsWith('editorial/history/')).map(x=>({key:x.key,size:x.size})));cursor=list.truncated?list.cursor:undefined;}while(cursor);
 return {format:'tfb-system-backup',version:1,createdAt:new Date().toISOString(),schema,tables,history,objects};
}
export async function backupEditorialSystem(env){
 if(!env.CMS_BUCKET||!/^([a-f0-9]{64})$/.test(env.CMS_BACKUP_KEY||''))throw Error('Private backup storage/key missing');
 const attempt=new Date().toISOString();
 await env.DB.prepare("INSERT INTO cms_backup_status(id,last_attempt) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET last_attempt=excluded.last_attempt").bind(attempt).run();
 try{
 const data=await databaseArchive(env),raw=enc.encode(JSON.stringify(data));
 const gzip=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
 const iv=crypto.getRandomValues(new Uint8Array(12)),key=await crypto.subtle.importKey('raw',hexBytes(env.CMS_BACKUP_KEY),'AES-GCM',false,['encrypt']);
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,gzip));const bytes=new Uint8Array(12+cipher.length);bytes.set(iv);bytes.set(cipher,12);
 const stamp=data.createdAt.slice(0,10),objectKey='backups/daily/'+stamp+'.json.gz.aes';
 await env.CMS_BUCKET.put(objectKey,bytes,{customMetadata:{format:'tfb-system-backup-v1',sha256:await digest(bytes)}});
 const month=stamp.slice(0,7),monthly='backups/monthly/'+month+'.json.gz.aes';if(!await env.CMS_BUCKET.head(monthly))await env.CMS_BUCKET.put(monthly,bytes);
 for(const [prefix,keep] of [['backups/daily/',30],['backups/monthly/',12]]){const list=await env.CMS_BUCKET.list({prefix,limit:1000});const rows=list.objects.sort((a,b)=>b.key.localeCompare(a.key));for(const object of rows.slice(keep))await env.CMS_BUCKET.delete(object.key);}
 await env.DB.prepare("UPDATE cms_backup_status SET last_success=?,last_error='' WHERE id=1").bind(new Date().toISOString()).run();
 return {key:objectKey,size:bytes.length};
 }catch(e){await env.DB.prepare("UPDATE cms_backup_status SET last_error=? WHERE id=1").bind('Die technische Sicherung ist fehlgeschlagen. Der letzte erfolgreiche Stand bleibt erhalten.').run();throw e;}
}
