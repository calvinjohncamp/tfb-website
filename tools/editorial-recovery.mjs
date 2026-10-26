// Operator-only local recovery; never imported into the website or Worker.
import {DatabaseSync} from 'node:sqlite';
import {existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export async function decryptSystemBackup(bytes,hex){
 if(!/^[a-f0-9]{64}$/.test(hex))throw Error('Expected a separate 256-bit backup key');
 const key=await crypto.subtle.importKey('raw',Buffer.from(hex,'hex'),'AES-GCM',false,['decrypt']);
 const packed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.subarray(0,12)},key,bytes.subarray(12));
 const value=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
 if(value.format!=='tfb-system-backup'||value.version!==1||!value.schema||!value.tables)throw Error('Unsupported backup');return value;
}
const quoted=s=>'"'+s.replaceAll('"','""')+'"';
export function restoreDatabase(archive,path){
 if(existsSync(path))throw Error('Restore target already exists; no existing database will be overwritten');
 const db=new DatabaseSync(path);try{db.exec('PRAGMA foreign_keys=OFF; BEGIN;');
 for(const item of archive.schema.filter(x=>x.type==='table'))db.exec(item.sql);
 for(const [name,rows] of Object.entries(archive.tables))for(const row of rows){const columns=Object.keys(row);db.prepare('INSERT INTO '+quoted(name)+' ('+columns.map(quoted).join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').run(...columns.map(k=>row[k]));}
 for(const item of archive.schema.filter(x=>x.type!=='table'))db.exec(item.sql);
 db.exec('COMMIT; PRAGMA foreign_keys=ON;');
 if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('Database integrity check failed');
 if(db.prepare('PRAGMA foreign_key_check').all().length)throw Error('Database references are incomplete');
 return {tables:Object.keys(archive.tables).length,rows:Object.values(archive.tables).reduce((n,rows)=>n+rows.length,0)};
 }catch(e){try{db.exec('ROLLBACK');}catch{}throw e;}finally{db.close();}
}
export function verifyObjects(archive,directory){
 const media=archive.tables.cms_media||[],releases=archive.tables.cms_releases||[];
 for(const object of archive.objects){const file=directory+'/'+object.key;if(!existsSync(file)||readFileSync(file).length!==object.size)throw Error('Missing/incomplete object: '+object.key);}
 for(const item of [...media,...releases]){const bytes=readFileSync(directory+'/'+item.object_key),expected=item.hash||item.sha256;if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('Object checksum mismatch');}
 return archive.objects.length;
}
