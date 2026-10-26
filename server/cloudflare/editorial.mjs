const enc=new TextEncoder();
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const clone=v=>JSON.parse(JSON.stringify(v));
const globals=new Set(['version','teams','applied','chatText','homeLook','homeColorMode','nav','stories','photoFrames','focusStrip']);
const pages=new Set(['home','aktuell','sport','verein','satzung','impressum']);
const validKey=k=>typeof k==='string'&&(k.startsWith('page:')?pages.has(k.slice(5)):k.startsWith('global:')&&globals.has(k.slice(7)));
export const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',typeof value==='string'?enc.encode(value):value)),b=>b.toString(16).padStart(2,'0')).join('');
export function splitSite(site){
 const docs={};for(const [key,value] of Object.entries(site||{})){if(key==='pages'){for(const [page,data] of Object.entries(value||{}))if(pages.has(page))docs['page:'+page]=data;}else if(globals.has(key))docs['global:'+key]=value;}
 return docs;
}
export function joinSite(docs){const site={pages:{}};for(const [key,doc] of Object.entries(docs)){const value=doc.value===undefined?doc:doc.value;if(key.startsWith('page:'))site.pages[key.slice(5)]=clone(value);else site[key.slice(7)]=clone(value);}return site;}
export function publicValue(value){
 if(Array.isArray(value))return value.filter(x=>!x?true:!x._new).map(publicValue);
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).filter(([key])=>!['memberId','photoCrop','passwordHash','accounts','members','community'].includes(key)&&!(key==='email'&&!value.publishEmail)&&!(key==='phone'&&!value.publishPhone)).map(([key,item])=>[key,publicValue(item)]));
}
function validate(value){
 let nodes=0;function walk(v,depth){if(++nodes>40000||depth>25)fail(400,'Der Seiteninhalt ist zu komplex.');if(typeof v==='string'){if(v.length>600000)fail(400,'Ein Inhalt ist zu groß.');if(/^(?:javascript|vbscript|file):/i.test(v.trim()))fail(400,'Nicht erlaubtes Linkziel.');if(v.startsWith('data:')&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v))fail(400,'Nicht erlaubtes eingebettetes Format.');}else if(v&&typeof v==='object'){for(const [k,x] of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))fail(400,'Ungültiger Inhalt.');walk(x,depth+1);}}else if(v!==null&&!['boolean','number'].includes(typeof v))fail(400,'Ungültiger Inhalt.');}walk(value,0);
 if(enc.encode(JSON.stringify(value)).length>900000)fail(413,'Diese Seite ist zu groß.');
}
export function mediaRefs(value,found=new Set()){
 if(typeof value==='string'&&/^(?:img|doc):cms-[a-f0-9]{64}$/.test(value))found.add(value);
 else if(value&&typeof value==='object')for(const [key,x] of Object.entries(value)){if(/^(?:img|doc):cms-[a-f0-9]{64}$/.test(key))found.add(key);mediaRefs(x,found);}return found;
}
function ready(env){if(!env.CMS_BUCKET)fail(503,'Der geschützte Inhaltsspeicher wird eingerichtet.');}
async function publicDocuments(env,documents){
 const copy=clone(documents),people=copy['page:verein']?.value?.blocks?.find(b=>b.id==='v-vorstand')?.people||[];
 const ids=[...new Set(people.map(p=>p.memberId).filter(Boolean))],members=new Map(),accounts=new Map();
 if(ids.length){
  const rows=(await env.DB.prepare('SELECT id,first_name,last_name,email FROM members WHERE active=1 AND id IN (SELECT value FROM json_each(?))').bind(JSON.stringify(ids)).all()).results;for(const row of rows)members.set(row.id,row);
  const parts=(await env.DB.prepare("SELECT r.id,p.data FROM app_records r JOIN app_payloads p ON p.payload_id=r.payload_id WHERE r.kind='account' AND r.deleted=0 AND r.id IN (SELECT value FROM json_each(?)) ORDER BY r.id,p.part").bind(JSON.stringify(ids)).all()).results;
  for(const row of parts)accounts.set(row.id,(accounts.get(row.id)||'')+row.data);
 }
 for(const person of people){if(!person.memberId)continue;
  const member=members.get(person.memberId);person.image=null;
  if(!member){person.name='Nicht besetzt';delete person.photoCrop;continue;}
  person.name=member.first_name+' '+member.last_name;if(person.publishEmail)person.email=member.email;
  const account=JSON.parse(accounts.get(person.memberId)||'{}');
  if(account.photoPublic&&!account.photoPending&&account.avatar)person.image=person.photoCrop?.source===`member:${person.memberId}:${account.avatarRevision||0}`?person.photoCrop.image:account.avatar;
  delete person.photoCrop;
 }
 return Object.fromEntries(Object.entries(copy).map(([key,doc])=>[key,{...doc,value:publicValue(doc.value)}]));
}
export async function editorialState(env,admin=false,attempt=0){
 const before=(await env.DB.prepare('SELECT revision FROM cms_head WHERE id=1').first()).revision;
 const rows=(await env.DB.prepare('SELECT key,revision,payload FROM cms_documents ORDER BY key').all()).results;
 if(!rows.length)fail(503,'Die zentrale Redaktion wird eingerichtet. Bitte den bisherigen Browserstand behalten.');
 const raw=Object.fromEntries(rows.map(row=>[row.key,{revision:row.revision,value:JSON.parse(row.payload)}]));
 const projected=await publicDocuments(env,raw),documents=admin?raw:projected;
 const media=(await env.DB.prepare('SELECT m.ref,m.mime,m.size,m.hash FROM cms_media m '+(admin?'':'JOIN cms_public_media p ON p.ref=m.ref')).all()).results;
 const revision=(await env.DB.prepare('SELECT revision FROM cms_head WHERE id=1').first()).revision;
 if(before!==revision){if(attempt>=3)fail(409,'Inhalte werden gerade geändert. Bitte erneut laden.');return editorialState(env,admin,attempt+1);}
 const boardPeople=(projected['page:verein']?.value?.blocks?.find(b=>b.id==='v-vorstand')?.people||[]).map(p=>({role:p.role,name:p.name,email:p.publishEmail?p.email||'':'',phone:p.publishPhone?p.phone||'':'',avatar:p.image||null,avatarLarge:p.image||null}));
 const backup=admin?await env.DB.prepare('SELECT last_success,last_attempt,last_error FROM cms_backup_status WHERE id=1').first():undefined;
 return {format:'tfb-editorial-state',version:1,revision,documents,media,boardPeople,...(admin?{backup}: {})};
}
export async function uploadEditorialMedia(env,data){
 ready(env);const match=/^data:(image\/(?:jpeg|png|webp|gif)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/.exec(data?.data||'');
 if(!match||match[2].length>14000000)fail(400,'Bitte ein Bild oder PDF bis 10 MB wählen.');
 let bytes;try{bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));}catch{fail(400,'Die Datei ist beschädigt.');}
 const magic=Array.from(bytes.slice(0,12));const ok=match[1]==='image/jpeg'?magic[0]===255&&magic[1]===216&&magic[2]===255:match[1]==='image/png'?magic.slice(0,8).join() ==='137,80,78,71,13,10,26,10':match[1]==='image/webp'?new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP':match[1]==='image/gif'?new TextDecoder().decode(bytes.slice(0,4))==='GIF8':new TextDecoder().decode(bytes.slice(0,5))==='%PDF-';
 if(!ok)fail(400,'Dateityp und Dateiinhalt stimmen nicht überein.');
 const hash=await digest(bytes),ref=(match[1]==='application/pdf'?'doc:':'img:')+'cms-'+hash,key='editorial/media/'+hash;
 await env.CMS_BUCKET.put(key,bytes,{httpMetadata:{contentType:match[1]}});
 await env.DB.prepare('INSERT OR IGNORE INTO cms_media VALUES(?,?,?,?,?)').bind(ref,hash,match[1],bytes.length,key).run();
 return {ref,hash,mime:match[1],size:bytes.length};
}
export async function editorialMedia(env,ref,admin=false){
 ready(env);if(!/^(?:img|doc):cms-[a-f0-9]{64}$/.test(ref))fail(404,'Datei nicht gefunden.');
 const row=await env.DB.prepare('SELECT m.* FROM cms_media m '+(admin?'':'JOIN cms_public_media p ON p.ref=m.ref ')+'WHERE m.ref=?').bind(ref).first();
 if(!row)fail(404,'Datei nicht freigegeben.');const object=await env.CMS_BUCKET.get(row.object_key);if(!object)fail(503,'Die Datei ist vorübergehend nicht verfügbar.');
 return new Response(object.body,{headers:{'Content-Type':row.mime,'Cache-Control':admin?'no-store':'private, max-age=3600','X-Content-Type-Options':'nosniff'}});
}
async function snapshotObject(env,state,extra){
 ready(env);const id=crypto.randomUUID(),at=new Date().toISOString(),objectKey='editorial/history/'+id+'.json';
 const releases=(await env.DB.prepare('SELECT commit_id,object_key,sha256,size FROM cms_releases ORDER BY created_at DESC LIMIT 1').all()).results;
 const used=mediaRefs(joinSite(state.documents));
 const manifest={format:'tfb-website-snapshot',version:1,schemaVersion:6,project:'tfb',id,createdAt:at,revision:state.revision,documents:state.documents,media:state.media.filter(m=>used.has(m.ref)),release:releases[0]||null,...extra};
 await env.CMS_BUCKET.put(objectKey,JSON.stringify(manifest),{httpMetadata:{contentType:'application/json'}});
 return {id,at,objectKey,manifest};
}
export async function editorialCommit(env,member,data){
 ready(env);if(!/^[a-zA-Z0-9-]{12,100}$/.test(data?.id||'')||!Array.isArray(data.changes)||!data.changes.length||data.changes.length>24)fail(400,'Ungültiger Speichervorgang.');
 const signature=await digest(JSON.stringify(data)),receipt=await env.DB.prepare('SELECT signature,result FROM cms_receipts WHERE id=?').bind(data.id).first();
 if(receipt){if(receipt.signature!==signature)fail(409,'Diese Speicherung wurde bereits anders verwendet.');return JSON.parse(receipt.result);}
 const changes=data.changes;for(const item of changes){if(!validKey(item.key)||!Number.isSafeInteger(item.expected)||item.expected<0)fail(400,'Ungültige Seitenrevision.');validate(item.value);}
 if(new Set(changes.map(x=>x.key)).size!==changes.length)fail(400,'Doppelte Seitenangabe.');
 for(let attempt=0;attempt<3;attempt++){
  let old;try{old=await editorialState(env,true);}catch(e){if(e.status!==503)throw e;old={revision:0,documents:{},media:[]};}
  for(const item of changes)if((old.documents[item.key]?.revision||0)!==item.expected)fail(409,'Diese Seite wurde inzwischen auf einem anderen Gerät geändert. Dein Entwurf bleibt erhalten. Bitte den aktuellen Stand vergleichen.');
  const next=clone(old);next.revision++;for(const item of changes)next.documents[item.key]={revision:item.expected+1,value:item.value};
  if(!next.documents['page:home'])fail(400,'Die Startseite fehlt.');
  const refs=mediaRefs(joinSite(next.documents));const media=[];
  const knownMedia=new Map((await env.DB.prepare('SELECT * FROM cms_media').all()).results.map(row=>[row.ref,row]));
  for(const ref of refs){const row=knownMedia.get(ref);if(!row||!await env.CMS_BUCKET.head(row.object_key))fail(400,'Ein verknüpftes Bild oder PDF fehlt. Der bisherige Stand bleibt erhalten.');media.push(row);}
  next.media=media;const label=String(data.label||'Inhalte gespeichert').trim().slice(0,120);
  const saved=await snapshotObject(env,next,{label,author:member.id,kind:data.kind==='restore'?'restore':'edit'});
  const result={ok:true,revision:next.revision,snapshot:saved.id,...(data.requestHash?{requestHash:data.requestHash}:{}),versions:Object.fromEntries(Object.entries(next.documents).map(([k,v])=>[k,v.revision]))};
  const statements=[env.DB.prepare('INSERT INTO cms_guards VALUES(?,?,?)').bind(data.id+'@','@head',old.revision)];
  for(const item of changes){statements.push(env.DB.prepare('INSERT INTO cms_guards VALUES(?,?,?)').bind(data.id+item.key,item.key,item.expected));statements.push(env.DB.prepare('INSERT INTO cms_documents VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at').bind(item.key,item.expected+1,JSON.stringify(item.value),saved.at));}
  const publicRefs=mediaRefs(joinSite(await publicDocuments(env,next.documents)));statements.push(env.DB.prepare('DELETE FROM cms_public_media'));
  statements.push(env.DB.prepare('INSERT INTO cms_public_media SELECT ref FROM cms_media WHERE ref IN (SELECT value FROM json_each(?))').bind(JSON.stringify([...publicRefs])));
  statements.push(env.DB.prepare('UPDATE cms_head SET revision=? WHERE id=1').bind(next.revision),env.DB.prepare('INSERT INTO cms_history VALUES(?,?,?,?,?,?,?,?,?)').bind(saved.id,next.revision,saved.at,member.id,label,data.kind==='restore'?'restore':'edit',0,saved.objectKey,''),env.DB.prepare('INSERT INTO cms_receipts VALUES(?,?,?)').bind(data.id,signature,JSON.stringify(result)),env.DB.prepare('DELETE FROM cms_guards WHERE id LIKE ?').bind(data.id+'%'));
  try{await env.DB.batch(statements);return result;}catch(e){if(!String(e.message).includes('CMS_CONFLICT')){const duplicate=await env.DB.prepare('SELECT signature,result FROM cms_receipts WHERE id=?').bind(data.id).first();if(duplicate?.signature===signature)return JSON.parse(duplicate.result);throw e;}if(attempt===2)fail(409,'Inhalte wurden gleichzeitig geändert. Dein Entwurf bleibt erhalten.');}
 }
}
export async function editorialCheckpoint(env,member,{label='',kind='manual',bucket=''}={}){
 const state=await editorialState(env,true);if(!['manual','safety','daily','monthly'].includes(kind))fail(400,'Ungültiger Sicherungstyp.');
 if(['daily','monthly'].includes(kind)){const existing=await env.DB.prepare('SELECT id FROM cms_history WHERE kind=? AND bucket=?').bind(kind,bucket).first();if(existing)return existing;}
 const saved=await snapshotObject(env,state,{label:label.slice(0,120)||'Manuell gesichert',author:member.id,kind});
 await env.DB.prepare('INSERT INTO cms_history VALUES(?,?,?,?,?,?,?,?,?)').bind(saved.id,state.revision,saved.at,member.id,label.slice(0,120)||'Manuell gesichert',kind,kind==='manual'&&label.trim()?1:0,saved.objectKey,bucket).run();return {id:saved.id};
}
export async function editorialHistory(env){return {snapshots:(await env.DB.prepare('SELECT id,revision,created_at,author,label,kind,named FROM cms_history ORDER BY created_at DESC LIMIT 200').all()).results};}
async function readSnapshot(env,id){ready(env);const row=await env.DB.prepare('SELECT object_key FROM cms_history WHERE id=?').bind(id).first();if(!row)fail(404,'Sicherungsstand nicht gefunden.');const object=await env.CMS_BUCKET.get(row.object_key);if(!object)fail(503,'Sicherungsdatei nicht erreichbar.');return object.json();}
export async function editorialPreview(env,data){
 const snapshot=data.snapshot?await readSnapshot(env,data.snapshot):data.manifest;
 if(snapshot?.format!=='tfb-website-snapshot'||snapshot.version!==1||(snapshot.schemaVersion||6)>6||snapshot.project!=='tfb'||!snapshot.documents)fail(400,'Keine unterstützte TFB-Inhaltssicherung.');
 const state=await editorialState(env,true),keys=data.keys||Object.keys(snapshot.documents);
 if(!Array.isArray(keys)||!keys.length||keys.some(k=>!validKey(k)||!snapshot.documents[k]))fail(400,'Bitte eine vorhandene Seite wählen.');
 const changes=keys.filter(k=>JSON.stringify(state.documents[k]?.value)!==JSON.stringify(snapshot.documents[k].value)).map(key=>({key,expected:state.documents[key]?.revision||0,value:snapshot.documents[key].value}));
 for(const item of changes)validate(item.value);
 const media=mediaRefs(joinSite(Object.fromEntries(changes.map(x=>[x.key,x]))));
 for(const ref of media){const row=await env.DB.prepare('SELECT object_key FROM cms_media WHERE ref=?').bind(ref).first();if(!row||!await env.CMS_BUCKET.head(row.object_key))fail(400,'Zu diesem Stand fehlen Medien. Bitte zuerst das vollständige Sicherungspaket importieren.');}
 return {snapshot:snapshot.id||null,revision:state.revision,changes,summary:changes.map(x=>({key:x.key,title:x.value?.title||x.key,blocks:Array.isArray(x.value?.blocks)?x.value.blocks.length:null})),token:await digest(JSON.stringify(changes))};
}
export async function editorialRestore(env,member,data){
 const requestHash=await digest(JSON.stringify(data));
 const prior=await env.DB.prepare('SELECT result FROM cms_receipts WHERE id=?').bind(data.id||'').first();
 if(prior){const result=JSON.parse(prior.result);if(result.requestHash!==requestHash)fail(409,'Diese Wiederherstellung wurde bereits anders verwendet.');return result;}
 const preview=await editorialPreview(env,data);if(preview.token!==data.token)fail(409,'Die Vorschau ist nicht mehr aktuell. Bitte erneut vergleichen.');if(!preview.changes.length)return {ok:true,unchanged:true};
 await editorialCheckpoint(env,member,{label:'Vor Wiederherstellung',kind:'safety'});
 return editorialCommit(env,member,{id:data.id,changes:preview.changes,label:'Wiederhergestellt: '+String(data.label||'früherer Stand').slice(0,80),kind:'restore',requestHash});
}
export async function editorialExport(env,id,inline=false){
 const snapshot=id?await readSnapshot(env,id):{...(await editorialState(env,true)),format:'tfb-website-snapshot',version:1,schemaVersion:6,project:'tfb',createdAt:new Date().toISOString()};
 if(!id){snapshot.release=await env.DB.prepare('SELECT commit_id,object_key,sha256,size FROM cms_releases ORDER BY created_at DESC LIMIT 1').first();const used=mediaRefs(joinSite(snapshot.documents));snapshot.media=snapshot.media.filter(m=>used.has(m.ref));delete snapshot.backup;delete snapshot.boardPeople;}
 if(!inline)return snapshot;
 const images={};for(const ref of mediaRefs(joinSite(snapshot.documents))){const row=await env.DB.prepare('SELECT * FROM cms_media WHERE ref=?').bind(ref).first();if(!row)fail(503,'Eine Mediendatei fehlt.');const object=await env.CMS_BUCKET.get(row.object_key);if(!object)fail(503,'Eine Mediendatei fehlt.');const bytes=new Uint8Array(await object.arrayBuffer());if(await digest(bytes)!==row.hash)fail(503,'Die Medien-Prüfsumme stimmt nicht.');let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));images[ref]='data:'+row.mime+';base64,'+btoa(binary);}
 return {...snapshot,images};
}
export async function editorialPrune(env){
 const rows=(await env.DB.prepare('SELECT id,kind,named,object_key FROM cms_history ORDER BY created_at DESC').all()).results,counts={};
 for(const row of rows){if(row.named||row.kind==='safety'||row.kind==='restore')continue;const limit=row.kind==='daily'?30:row.kind==='monthly'?12:30;counts[row.kind]=(counts[row.kind]||0)+1;if(counts[row.kind]>limit){await env.DB.prepare('DELETE FROM cms_history WHERE id=?').bind(row.id).run();await env.CMS_BUCKET.delete(row.object_key);}}
}
export async function editorialScheduled(env){
 const now=new Date().toISOString();await editorialCheckpoint(env,{id:'system'},{label:'Tagesstand '+now.slice(0,10),kind:'daily',bucket:now.slice(0,10)});await editorialCheckpoint(env,{id:'system'},{label:'Monatsstand '+now.slice(0,7),kind:'monthly',bucket:now.slice(0,7)});await editorialPrune(env);
}
