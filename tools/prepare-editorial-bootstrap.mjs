// Prepare the verified DESKTOP export, never the older public-content seed.
// This command writes private local files only; applying them is a separate step.
import {readFileSync,writeFileSync,mkdirSync,existsSync,chmodSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {splitSite,publicValue,mediaRefs} from '../server/cloudflare/editorial.mjs';
process.umask(0o077);
const input=process.argv[2],output=resolve(process.argv[3]||'.private/release-v232/bootstrap');
if(!input)throw Error('Usage: node tools/prepare-editorial-bootstrap.mjs VERIFIED-DESKTOP.json [private-output]');
const root=resolve('.'),backup=JSON.parse(readFileSync(input,'utf8'));
if(backup.format!=='tfb-sicherung'||backup.version!==1||!backup.db?.site?.pages?.home)throw Error('A verified desktop backup is required');
mkdirSync(output,{recursive:true,mode:0o700});mkdirSync(resolve(output,'media'),{recursive:true,mode:0o700});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),mapping=new Map(),media=new Map();
function convert(value){
 if(Array.isArray(value))return value.map(convert);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[convert(k),convert(v)]));
 if(typeof value!=='string'||!(/^(img:|doc:|assets\/)/.test(value)))return value;
 if(mapping.has(value))return mapping.get(value);
 let mime,bytes;
 if(value.startsWith('assets/')){const file=resolve(root,value);if(!file.startsWith(root+'/assets/')||!existsSync(file))throw Error('A referenced public file is missing: '+value);const ext=value.split('.').at(-1).toLowerCase();mime={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',pdf:'application/pdf'}[ext];if(!mime)throw Error('Unsupported editorial file type: '+ext);bytes=readFileSync(file);}
 else{const data=backup.images?.[value];const match=/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/.exec(data||'');if(!match)throw Error('A referenced desktop image/document is missing');mime=match[1];bytes=Buffer.from(match[2],'base64');}
 const hash=sha(bytes),ref=(mime==='application/pdf'?'doc:':'img:')+'cms-'+hash,object_key='editorial/media/'+hash;
 media.set(ref,{ref,hash,mime,size:bytes.length,object_key});mapping.set(value,ref);writeFileSync(resolve(output,'media',hash),bytes,{mode:0o600});return ref;
}
const documents=Object.fromEntries(Object.entries(splitSite(backup.db.site)).map(([key,value])=>[key,{revision:1,value:convert(value)}]));
const idPath=resolve(output,'snapshot-id.txt'),id=existsSync(idPath)?readFileSync(idPath,'utf8'):randomUUID();writeFileSync(idPath,id,{mode:0o600});
const at=new Date().toISOString(),manifest={format:'tfb-website-snapshot',version:1,schemaVersion:6,project:'tfb',id,createdAt:at,revision:1,documents,media:[...media.values()],label:'Desktopstand vor zentraler Umstellung',author:'desktop-migration',kind:'manual',release:null};
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
try{execFileSync('git',['cat-file','-e',head+':assets/js/editorial.js'],{stdio:'ignore'});const archive=resolve(output,'programm.zip');execFileSync('git',['archive','--format=zip','--output',archive,head]);const bytes=readFileSync(archive);manifest.release={commit_id:head,object_key:'editorial/releases/'+head+'.zip',sha256:sha(bytes),size:bytes.length};}catch{/* Source commit must be created before the final deployment preparation. */}
writeFileSync(resolve(output,'snapshot.json'),JSON.stringify(manifest),{mode:0o600});
const q=x=>"'"+String(x).replaceAll("'","''")+"'",historyKey='editorial/history/'+id+'.json';
const sql=["INSERT INTO cms_guards VALUES('desktop-bootstrap','@head',0);"];
for(const row of media.values())sql.push('INSERT OR IGNORE INTO cms_media VALUES('+[row.ref,row.hash,row.mime,row.size,row.object_key].map(q).join(',')+');');
for(const [key,doc] of Object.entries(documents))sql.push('INSERT OR IGNORE INTO cms_documents VALUES('+[key,1,JSON.stringify(doc.value),at].map(q).join(',')+');');
const publicRefs=[...mediaRefs(publicValue(Object.fromEntries(Object.entries(documents).map(([key,v])=>[key,v.value]))))];
sql.push('INSERT OR IGNORE INTO cms_public_media SELECT ref FROM cms_media WHERE ref IN (SELECT value FROM json_each('+q(JSON.stringify(publicRefs))+'));');
if(manifest.release)sql.push('INSERT OR IGNORE INTO cms_releases VALUES('+[manifest.release.commit_id,manifest.release.object_key,manifest.release.sha256,manifest.release.size,at].map(q).join(',')+');');
sql.push('INSERT OR IGNORE INTO cms_history VALUES('+[id,1,at,'desktop-migration',manifest.label,'manual',1,historyKey,''].map(q).join(',')+');',"UPDATE cms_head SET revision=1 WHERE id=1 AND revision=0;","DELETE FROM cms_guards WHERE id='desktop-bootstrap';");
writeFileSync(resolve(output,'bootstrap.sql'),sql.join('\n'),{mode:0o600});
const details={desktopCreatedAt:backup.createdAt,desktopSha256:sha(readFileSync(input)),homeOrder:documents['page:home'].value.blocks.map(x=>({id:x.id,title:x.title})),documents:Object.keys(documents).length,mediaCount:media.size,mediaBytes:[...media.values()].reduce((sum,m)=>sum+m.size,0),release:manifest.release,historyKey};
writeFileSync(resolve(output,'verification.json'),JSON.stringify(details,null,2),{mode:0o600});console.log(JSON.stringify({output,documents:details.documents,mediaCount:details.mediaCount,mediaBytes:details.mediaBytes,releaseReady:Boolean(manifest.release)}));
