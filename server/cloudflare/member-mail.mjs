// Private, admin-only letter templates. No recipient lookup and no mail transport.
const PREFIX='member-mail/drafts/';
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const validId=id=>typeof id==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id);
const fields=['name','date','subject','headline','salutation','body','closing','theme'];
function ready(env){if(!env.CMS_BUCKET)fail(503,'Das Mailarchiv ist gerade nicht erreichbar.');return env.CMS_BUCKET;}
function clean(data){
 const out={};
 for(const [key,max] of Object.entries({name:120,subject:200,headline:240,salutation:240,body:30000,closing:1000})){
  if(typeof data[key]!=='string')fail(400,'Bitte alle Felder prüfen.');
  const value=data[key].replace(/\r\n?/g,'\n').normalize('NFC');
  if(value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))fail(400,'Ein Textfeld ist zu lang oder enthält ungültige Zeichen.');
  if((['name','subject','headline'].includes(key)&&!value.trim())||(['name','subject'].includes(key)&&/[\r\n]/.test(value)))fail(400,'Bitte Archivname, Betreff und Überschrift eintragen.');
  out[key]=['name','subject','headline'].includes(key)?value.trim():value;
 }
 if(!out.body.trim())fail(400,'Bitte einen Nachrichtentext eintragen.');
 if(typeof data.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!Number.isFinite(Date.parse(data.date))||new Date(data.date).toISOString().slice(0,10)!==data.date)fail(400,'Bitte ein gültiges Datum wählen.');
 if(!['club','red'].includes(data.theme))fail(400,'Bitte eine gültige Farbwelt wählen.');
 return {...out,date:data.date,theme:data.theme};
}
const same=(a,b)=>fields.every(key=>a[key]===b[key]);
const result=(doc,etag)=>({...doc,etag});
export async function memberMailList(env){
 const bucket=ready(env),rows=[];let cursor;
 do{
  const page=await bucket.list({prefix:PREFIX,limit:1000,include:['customMetadata'],...(cursor?{cursor}:{})});
  for(const object of page.objects){const id=object.key.slice(PREFIX.length).replace(/\.json$/,'');if(!validId(id))continue;const m=object.customMetadata||{};let name;try{name=decodeURIComponent(m.name||'E-Mail');}catch(_){name='E-Mail';}rows.push({id,name,date:m.date||'',updatedAt:Number(m.updatedAt)||0,etag:object.etag});}
  cursor=page.truncated?page.cursor:undefined;
 }while(cursor);
 return {rows:rows.sort((a,b)=>b.updatedAt-a.updatedAt||a.name.localeCompare(b.name,'de'))};
}
export async function memberMailGet(env,id){
 if(!validId(id))fail(400,'Ungültige Mailvorlage.');
 const object=await ready(env).get(PREFIX+id+'.json');if(!object)fail(404,'Diese Mailvorlage wurde nicht gefunden.');
 return result(await object.json(),object.etag);
}
export async function memberMailSave(env,member,data){
 if(!validId(data.id))fail(400,'Ungültige Mailvorlage.');
 if(data.expectedEtag!=null&&(typeof data.expectedEtag!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(data.expectedEtag)))fail(400,'Ungültiger Speicherstand.');
 const bucket=ready(env),value=clean(data),key=PREFIX+data.id+'.json',object=await bucket.get(key),prior=object?await object.json():null;
 if(object&&object.etag!==data.expectedEtag){
  if(same(prior,value))return result(prior,object.etag); // A retry after a lost successful response.
  fail(409,'Diese Mail wurde inzwischen geändert. Dein Text bleibt erhalten. Bitte als neue Vorlage speichern oder den aktuellen Stand laden.');
 }
 if(!object&&data.expectedEtag)fail(409,'Der bisherige Speicherstand fehlt. Bitte als neue Vorlage speichern.');
 const now=Date.now(),doc={id:data.id,...value,createdAt:prior?.createdAt||now,createdBy:prior?.createdBy||member.id,updatedAt:now,updatedBy:member.id};
 const saved=await bucket.put(key,JSON.stringify(doc),{onlyIf:object?{etagMatches:object.etag}:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json',cacheControl:'no-store'},customMetadata:{name:encodeURIComponent(doc.name),date:doc.date,updatedAt:String(now)}});
 if(!saved)fail(409,'Eine andere Änderung wurde gleichzeitig gespeichert. Dein Text bleibt erhalten. Bitte als neue Vorlage speichern oder den aktuellen Stand laden.');
 return result(doc,saved.etag);
}
