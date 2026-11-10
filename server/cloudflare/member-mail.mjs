import {html as mailHtml} from '../../assets/js/member-mail-renderer.mjs';
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
export async function memberMailList(env,member){
 const bucket=ready(env),rows=[];let cursor;
 do{
  const page=await bucket.list({prefix:PREFIX,limit:1000,include:['customMetadata'],...(cursor?{cursor}:{})});
  for(const object of page.objects){const id=object.key.slice(PREFIX.length).replace(/\.json$/,'');if(!validId(id))continue;const m=object.customMetadata||{};if(m.deleted==='1')continue;let name;try{name=decodeURIComponent(m.name||'E-Mail');}catch(_){name='E-Mail';}rows.push({id,name,date:m.date||'',updatedAt:Number(m.updatedAt)||0,etag:object.etag});}
  cursor=page.truncated?page.cursor:undefined;
 }while(cursor);
 let recipient='';if(member){try{recipient=testAddress(member);}catch(_){}}
 return {testRecipient:recipient,testReady:Boolean(recipient&&(env.AUTH_MAIL?.send||(env.RESEND_API_KEY&&env.AUTH_EMAIL_FROM))),rows:rows.sort((a,b)=>b.updatedAt-a.updatedAt||a.name.localeCompare(b.name,'de'))};
}
export async function memberMailGet(env,id){
 if(!validId(id))fail(400,'Ungültige Mailvorlage.');
 const object=await ready(env).get(PREFIX+id+'.json');if(!object)fail(404,'Diese Mailvorlage wurde nicht gefunden.');
 const doc=await object.json();if(doc.deletedAt)fail(404,'Diese Mailvorlage wurde gelöscht.');return result(doc,object.etag);
}
export async function memberMailSave(env,member,data){
 if(!validId(data.id))fail(400,'Ungültige Mailvorlage.');
 if(data.expectedEtag!=null&&(typeof data.expectedEtag!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(data.expectedEtag)))fail(400,'Ungültiger Speicherstand.');
 const bucket=ready(env),value=clean(data),key=PREFIX+data.id+'.json',object=await bucket.get(key),prior=object?await object.json():null;
 if(prior?.deletedAt)fail(409,'Diese Vorlage wurde gelöscht. Bitte als neue Vorlage speichern.');
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

function testAddress(member){
 for(const raw of [member.email,member.email2]){const address=String(raw||'').trim().replace(/[;, ]+$/,'').toLowerCase();if(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address))return address;}
 fail(400,'Für deinen Adminzugang fehlt eine gültige E-Mail-Adresse.');
}
async function markDeleted(env,member,data,remove){
 if(!validId(data.id)||typeof data.expectedEtag!=='string')fail(400,'Ungültige Mailvorlage.');
 const bucket=ready(env),key=PREFIX+data.id+'.json',object=await bucket.get(key);if(!object)fail(404,'Mailvorlage nicht gefunden.');
 if(object.etag!==data.expectedEtag)fail(409,'Die Vorlage wurde inzwischen geändert. Bitte den aktuellen Stand laden.');
 const doc=await object.json();if(Boolean(doc.deletedAt)===remove)return result(doc,object.etag);
 const value={...doc,deletedAt:remove?Date.now():null,deletedBy:remove?member.id:null};
 const saved=await bucket.put(key,JSON.stringify(value),{onlyIf:{etagMatches:object.etag},httpMetadata:{contentType:'application/json',cacheControl:'no-store'},customMetadata:{name:encodeURIComponent(value.name),date:value.date,updatedAt:String(value.updatedAt),deleted:remove?'1':'0'}});
 if(!saved)fail(409,'Die Vorlage wurde gleichzeitig geändert. Bitte erneut laden.');return result(value,saved.etag);
}
export const memberMailDelete=(env,member,data)=>markDeleted(env,member,data,true);
export const memberMailRestore=(env,member,data)=>markDeleted(env,member,data,false);
export async function memberMailTest(env,member,data){
 if(!validId(data.requestId))fail(400,'Ungültige Testanfrage.');
 const mail=clean(data),to=testAddress(member),bucket=ready(env);
 if(!env.AUTH_MAIL?.send&&!(env.RESEND_API_KEY&&env.AUTH_EMAIL_FROM))fail(503,'Der Testversand ist gerade nicht verfügbar.');
 const signature=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({mail,to})))),b=>b.toString(16).padStart(2,'0')).join('');
 const key=`member-mail/tests/${member.id}/${data.requestId}.json`,previous=await bucket.get(key),receipt=previous?await previous.json():null;
 if(receipt&&receipt.signature!==signature)fail(409,'Diese Testanfrage gehört zu einem anderen Brief. Bitte einen neuen Test starten.');
 if(receipt?.status==='sent')return receipt.result;
 if(receipt?.status==='pending'&&Date.now()-receipt.startedAt<15000)fail(409,'Der Testversand läuft noch. Bitte kurz warten.');
 const startedAt=Date.now(),lock=await bucket.put(key,JSON.stringify({signature,status:'pending',startedAt}),{onlyIf:previous?{etagMatches:previous.etag}:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json',cacheControl:'no-store'}});
 if(!lock)fail(409,'Diese Testanfrage wird bereits bearbeitet. Bitte kurz warten.');
 const message={from:env.AUTH_EMAIL_FROM||'Tennisfreunde Bielstein <tfb@padel-bielstein.de>',to:[to],reply_to:'info@tfbielstein.de',subject:'[TFB Test] '+mail.subject,
  text:[new Intl.DateTimeFormat('de-DE',{dateStyle:'long',timeZone:'Europe/Berlin'}).format(new Date(mail.date+'T12:00:00Z')),mail.headline,mail.salutation,mail.body,mail.closing,'Tennisfreunde Bielstein e. V.\ninfo@tfbielstein.de'].join('\n\n'),html:mailHtml(mail)};
 try{
  if(env.AUTH_MAIL?.send)await env.AUTH_MAIL.send(message);
  else{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`tfb-member-test/${member.id}/${data.requestId}`},body:JSON.stringify(message),signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Provider rejected test');}
 }catch(_){await bucket.put(key,JSON.stringify({signature,status:'failed',startedAt}),{onlyIf:{etagMatches:lock.etag}});fail(503,'Die Testmail konnte gerade nicht bestätigt werden. Bitte denselben Test erneut versuchen.');}
 const sent={ok:true,to,sentAt:Date.now()};await bucket.put(key,JSON.stringify({signature,status:'sent',startedAt,result:sent}),{onlyIf:{etagMatches:lock.etag},httpMetadata:{contentType:'application/json',cacheControl:'no-store'}});return sent;
}
