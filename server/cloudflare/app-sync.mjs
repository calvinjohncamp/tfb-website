// Authenticated, revision-checked demo data. No payment or SEPA processing.
import catalog from './demo-catalog.json';
import {meetingKinds,meetingProjection,validateMeetingOperation,materializeMeetings,berlinDay} from './meet-sync.mjs';
const fail = (status, message) => { throw Object.assign(Error(message), {status}); };
const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const key = r => `${r.kind}:${r.id}`;
const profileFields = ['phone','infoMails','openInvites','groupChatNotices','chatNoticesSince','chatNoticeRead','commentRead','feedRules','parentConsent','consentVersion','consentedAt','avatar','avatarLarge','avatarRevision','photoPublic','photoEvents','photoPending','photoConsentAt','photoConsentVersion'];
function text(v,max=2000) { if(typeof v!=='string'||v.length>max) fail(400,'Ungültiger Text.'); return v; }
function image(v,max=2500000) { if(v===null||v===undefined)return null; if(typeof v!=='string'||v.length>max||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) fail(400,'Ungültiges Foto.'); return v; }
function timestamp(v) { if(typeof v!=='string'||!Number.isFinite(Date.parse(v))||Date.parse(v)>Date.now()+60000)fail(400,'Ungültiges Datum.');return v; }
async function records(env, filter = () => true) {
  const meta=(await env.DB.prepare('SELECT r.* FROM app_records r JOIN members m ON m.id=r.owner_id WHERE m.active=1').all()).results.filter(filter);
  const chunks=[];
  for(let i=0;i<meta.length;i+=80){
    const ids=meta.slice(i,i+80).map(r=>r.payload_id);
    chunks.push(...(await env.DB.prepare(`SELECT * FROM app_payloads WHERE payload_id IN (${ids.map(()=>'?').join(',')}) ORDER BY part`).bind(...ids).all()).results);
  }
  const payload=new Map(); for(const c of chunks)payload.set(c.payload_id,(payload.get(c.payload_id)||'')+c.data);
  return meta.map(r=>({...r,value:JSON.parse(payload.get(r.payload_id)||'null')}));
}
async function context(env, member) {
  const rows=await records(env), map=new Map(rows.map(r=>[key(r),r]));
  const teams=new Set((await env.DB.prepare('SELECT team_key FROM member_teams WHERE member_id=?').bind(member.id).all()).results.map(r=>r.team_key));
  const canScope=scope=>scope==='club'||(typeof scope==='string'&&scope.startsWith('team:')&&(member.is_admin||teams.has(scope.slice(5))));
  const canPost=r=>r&&!r.deleted&&canScope(r.scope)&&(!r.value.hidden||r.owner_id===member.id||member.is_admin);
  return {rows,map,teams,canScope,canPost};
}
export async function syncRevision(env,member) {
  const row=await env.DB.prepare('SELECT COUNT(*) n,COALESCE(SUM(revision),0) total FROM app_records').first();
  const members=await env.DB.prepare('SELECT COUNT(*) n,SUM(active) active,MAX(updated_at) updated FROM members').first();
  const teams=(await env.DB.prepare('SELECT team_key FROM member_teams WHERE member_id=? ORDER BY team_key').bind(member.id).all()).results.map(r=>r.team_key);
  return `${row.n}:${row.total}:${member.updated_at}:${members.n}:${members.active}:${members.updated}:${teams.join(',')}:${berlinDay()}:tally3`;
}
export async function syncFaces(env,member,ids) {
  if(!Array.isArray(ids)||ids.length>100||ids.some(id=>typeof id!=='string'||id.length>120))fail(400,'Ungültige Profilabfrage.');
  const rows=await records(env,r=>r.kind==='account'&&ids.includes(r.id)),people=(await env.DB.prepare('SELECT id,first_name,last_name FROM members WHERE active=1').all()).results;
  return rows.filter(r=>r.kind==='account'&&!r.deleted&&ids.includes(r.id)&&r.value.avatar&&(!r.value.photoPending||r.id===member.id)).map(r=>({id:r.id,avatar:r.value.avatar,avatarRevision:r.value.avatarRevision,
    firstName:people.find(m=>m.id===r.id)?.first_name||'',lastName:people.find(m=>m.id===r.id)?.last_name||''}));
}
export async function syncPhoto(env,member,id) {
  if(typeof id!=='string'||id.length>120)fail(400,'Ungültige Profilabfrage.');
  const row=(await records(env,r=>r.kind==='account'&&r.id===id)).find(r=>!r.deleted);
  if(!row?.value.avatar||(row.value.photoPending&&id!==member.id))return {image:null};
  return {image:row.value.avatarLarge||row.value.avatar};
}
// Spread the presentation names across both sides of the signed-in member.
// Keep nine before and ten after where the directory has enough candidates.
function tallySampleMembers(people, member) {
  const compare=(a,b)=>a.last_name.localeCompare(b.last_name,'de')||a.first_name.localeCompare(b.first_name,'de')||a.id.localeCompare(b.id);
  const nameKey=m=>JSON.stringify([m.last_name,m.first_name].map(s=>s.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('de')));
  // Separate directory records can name the same person. Always keep the signed-in account.
  const seen=new Set([nameKey(member)]);
  const sorted=people.filter(m=>m.id!==member.id).sort(compare).filter(m=>{
    const key=nameKey(m);if(seen.has(key))return false;seen.add(key);return true;
  });
  const before=sorted.filter(m=>compare(m,member)<0),after=sorted.filter(m=>compare(m,member)>=0);
  const afterCount=Math.min(19-Math.min(9,before.length),after.length);
  const beforeCount=Math.min(19-afterCount,before.length);
  const spread=(list,count)=>Array.from({length:count},(_,i)=>list[count===1?Math.floor((list.length-1)/2):Math.floor(i*(list.length-1)/(count-1))]);
  return [...spread(before,beforeCount),...spread(after,afterCount)];
}
export async function syncState(env, member) {
  let revision=await syncRevision(env,member),c=await context(env,member);
  if(await materializeMeetings(env,c,member)){revision=await syncRevision(env,member);c=await context(env,member);}
  const planning=meetingProjection(c,member);
  const posts=c.rows.filter(r=>r.kind==='post'&&c.canPost(r));
  const postIds=new Set(posts.map(r=>r.id));
  const comments=c.rows.filter(r=>r.kind==='comment'&&!r.deleted&&postIds.has(r.value.postId));
  const mediaIds=new Set([...posts,...comments].flatMap(r=>r.value.images||[]));
  const own=c.rows.filter(r=>r.kind==='catalog'||r.owner_id===member.id&&(['account','item','media'].includes(r.kind)||r.deleted&&['post','comment'].includes(r.kind)));
  const media=c.rows.filter(r=>r.kind==='media'&&!r.deleted&&mediaIds.has(r.id)&&r.owner_id!==member.id);
  const people=(await env.DB.prepare('SELECT id,first_name,last_name FROM members WHERE active=1').all()).results;
  const visibleIds=new Set([member.id,...planning.memberIds,...posts.map(r=>r.owner_id),...comments.map(r=>r.owner_id)]);
  const faces=c.rows.filter(r=>r.kind==='account'&&!r.deleted&&r.owner_id!==member.id&&r.value.avatar&&!r.value.photoPending&&visibleIds.has(r.owner_id)).map(r=>({id:r.owner_id,avatar:r.value.avatar,avatarRevision:r.value.avatarRevision}));
  return {records:[...own,...posts,...comments,...media,...planning.records].map(({kind,id,owner_id,scope,revision,deleted,value})=>({kind,id,ownerId:owner_id,scope,revision,deleted:Boolean(deleted),value})),
    // Presentation rows are derived from the protected directory, never booked as items.
    demoTally:tallySampleMembers(people,member).map((m,i)=>{
      const cats={drinks:i%9+1,snacks:i%3,kranz:i%5===0?1:0,spielbetrieb:i%4===0?2:0,equipment:i%6===0?1:0};
      const labels={drinks:'Getränke',snacks:'Snacks',kranz:'Kränze',spielbetrieb:'Spielbetrieb',equipment:'Equipment'};
      return {firstName:m.first_name,lastName:m.last_name,isMe:false,isDemo:true,cats,counts:Object.fromEntries(Object.entries(cats).filter(([,n])=>n).map(([k,n])=>[labels[k],n])),total:Object.values(cats).reduce((a,b)=>a+b,0)};
    }),
    members:people.filter(m=>visibleIds.has(m.id)).map(m=>({id:m.id,firstName:m.first_name,lastName:m.last_name,active:true})), faces,catalog:c.map.get('catalog:club')?.value||catalog,demo:true,revision,meetProtocol:1,meetings:planning.data};
}
async function validate(env,member,c,op,all,importing) {
  if(!['account','item','post','comment','media','catalog',...meetingKinds].includes(op.kind)||typeof op.id!=='string'||!/^[\w:.-]{1,120}$/.test(op.id)||!Number.isSafeInteger(op.revision)||op.revision<0)fail(400,'Ungültiger Datensatz.');
  if(meetingKinds.has(op.kind))return validateMeetingOperation(env,member,c,op,all,importing);
  const old=c.map.get(key(op));
  if(old&&old.owner_id!==member.id&&!(member.is_admin&&['post','comment','catalog'].includes(op.kind)))fail(403,'Dieser Datensatz gehört einem anderen Mitglied.');
  if((old?.revision||0)!==op.revision)fail(409,'Die Daten wurden auf einem anderen Gerät geändert. Bitte neu laden.');
  if(op.deleted&&!['post','comment','media'].includes(op.kind))fail(400,'Diese Daten können hier nicht gelöscht werden.');
  if(op.deleted&&!old)fail(404,'Datensatz nicht vorhanden.');
  const owner=old?.owner_id||member.id;
  const v=op.value;
  if(!op.deleted&&(!v||typeof v!=='object'||Array.isArray(v)))fail(400,'Angaben fehlen.');
  let value=null, scope=old?.scope||'';
  const now=new Date().toISOString();
  if(!op.deleted&&op.kind==='account') {
    if(op.id!==member.id)fail(403,'Nur das eigene Profil kann gespeichert werden.');
    value=Object.fromEntries(profileFields.filter(k=>v[k]!==undefined).map(k=>[k,v[k]]));
    value.avatar=image(v.avatar,400000);value.avatarLarge=value.avatar?image(v.avatarLarge||v.avatar):null;
    for(const k of ['phone','feedRules','consentVersion','consentedAt','photoConsentAt','photoConsentVersion','chatNoticesSince'])if(value[k]!=null)text(value[k],200);
    for(const k of ['infoMails','openInvites','groupChatNotices','photoPublic','photoEvents'])if(value[k]!=null&&typeof value[k]!=='boolean')fail(400,'Ungültige Einstellung.');
    for(const k of ['chatNoticeRead','commentRead'])if(value[k]&&(!Array.isArray(value[k])||value[k].length>10000||value[k].some(x=>typeof x!=='string'||x.length>120)))fail(400,'Ungültiger Lesestatus.');
    // Approval is never accepted from an untrusted browser.
    value.photoApproval=old?.value.photoApproval||null;
    if(value.avatar!==old?.value.avatar){value.photoPublic=false;value.photoApproval=null;value.avatarRevision=(old?.value.avatarRevision||0)+1;}
    if(JSON.stringify(value).length>3000000)fail(413,'Das Profilfoto ist zu groß.');
  }
  if(!op.deleted&&op.kind==='catalog') {
    if(!member.is_admin||op.id!=='club')fail(403,'Nur die Verwaltung kann das Sortiment ändern.');
    if(!Array.isArray(v.sections)||!Array.isArray(v.products)||v.sections.length>30||v.products.length>300)fail(400,'Ungültiges Sortiment.');
    const sections=v.sections.map(x=>({id:text(x.id,80),title:text(x.title,40),note:text(x.note||'',120),status:x.status==='soon'?'soon':'open'}));
    const products=v.products.map(p=>{if(!Number.isSafeInteger(p.price)||p.price<0||p.price>50000||!sections.some(x=>x.id===p.section))fail(400,'Ungültiger Artikelpreis.');return {id:text(p.id,100),section:p.section,name:text(p.name,40),detail:text(p.detail||'',80),price:p.price,art:text(p.art||'bottle',80),color:/^#[0-9a-f]{6}$/i.test(p.color)?p.color:'#C4553A',active:p.active!==false};});
    if(new Set(products.map(p=>p.id)).size!==products.length||new Set(sections.map(s=>s.id)).size!==sections.length)fail(400,'Doppelte Artikelkennung.');
    value={sections,products};
  }
  if(!op.deleted&&op.kind==='media') {value={data:image(v.data,1800000)};if(!op.id.startsWith('img:'))fail(400,'Ungültige Fotokennung.');if(old&&JSON.stringify(old.value)!==JSON.stringify(value))fail(409,'Fotos können nur als neue Datei hochgeladen werden.');}
  if(!op.deleted&&['post','comment'].includes(op.kind)) {
    const account=all.find(r=>r.kind==='account'&&r.id===member.id)?.value||c.map.get('account:'+member.id)?.value;
    if(!account?.feedRules)fail(403,'Bitte zuerst die Chat-Hinweise bestätigen.');
    if(op.kind==='post') {
      scope=old?.scope||text(v.scope,100); if(!c.canScope(scope))fail(403,'Keine Berechtigung für diese Mannschaft.');
      const alsoTeams=v.alsoTeams||[];
      if(!Array.isArray(alsoTeams)||alsoTeams.length>30||alsoTeams.some(t=>typeof t!=='string'||(!member.is_admin&&!c.teams.has(t))))fail(403,'Mannschaftsberechtigung prüfen.');
      value={id:op.id,authorId:owner,scope,title:text(v.title||'',90),text:text(v.text||''),alsoTeams,images:v.images||[],createdAt:old?.value.createdAt||(importing?timestamp(v.createdAt):now)};
      if(member.is_admin)value.hidden=Boolean(v.hidden);else value.hidden=Boolean(old?.value.hidden);
    } else {
      const parent=c.map.get('post:'+v.postId)||all.find(r=>r.kind==='post'&&r.id===v.postId);
      const parentScope=parent?.scope||parent?.value?.scope;
      if(!parent||parent.deleted||!c.canScope(parentScope)||parent.value?.hidden)fail(403,'Beitrag nicht verfügbar.');
      scope=parentScope;
      value={id:op.id,postId:text(v.postId,120),authorId:owner,text:text(v.text||''),images:v.images||[],createdAt:old?.value.createdAt||(importing?timestamp(v.createdAt):now)};
    }
    if(!Array.isArray(value.images)||value.images.length>(op.kind==='post'?6:3)||value.images.some(ref=>typeof ref!=='string'))fail(400,'Zu viele Fotos.');
    if(!value.text.trim()&&!value.images.length)fail(400,'Bitte Text oder ein Foto hinzufügen.');
    for(const ref of value.images) {
      const media=c.map.get('media:'+ref)||all.find(r=>r.kind==='media'&&r.id===ref);
      if(!media||media.deleted||(media.owner_id||member.id)!==member.id&&!(old?.value.images||[]).includes(ref))fail(403,'Foto nicht verfügbar.');
    }
    if(old)value.editedAt=now;
  }
  if(!op.deleted&&op.kind==='item') {
    if(old) {
      value={...old.value};
      if(v.status!==old.value.status){if(v.status!=='cancelled'||old.value.status!=='open'||Date.parse(old.value.createdAt)<Date.now()-30000)fail(409,'Die Rücknahme ist nicht mehr möglich.');value.status='cancelled';}
    } else {
      const menu=all.find(r=>r.kind==='catalog')?.value||c.map.get('catalog:club')?.value||catalog;
      const p=menu.products.find(p=>p.id===v.productId&&p.active);
      if(!importing&&(!p||!menu.sections.some(s=>s.id===p.section&&s.status==='open')))fail(400,'Artikel nicht verfügbar.');
      const account=all.find(r=>r.kind==='account'&&r.id===member.id)?.value||c.map.get('account:'+member.id)?.value;
      if(!account?.consentedAt||account.consentVersion!=='tfb-kiosk-v3')fail(403,'Bitte zuerst der Kioskordnung zustimmen.');
      value={id:op.id,memberId:member.id,productId:importing?text(v.productId,100):p.id,productName:importing?text(v.productName||p?.name||'Vorführartikel',100):p.name,priceCents:p?.price||0,createdAt:importing?timestamp(v.createdAt):now,status:'open',demo:true};
      if(importing){if(!Number.isSafeInteger(v.priceCents)||v.priceCents<0||v.priceCents>50000||!['open','cancelled','closed'].includes(v.status))fail(400,'Ungültiger Vorführ-Strich.');value.priceCents=v.priceCents;value.status=v.status;}
    }
  }
  return {...op,value,scope,ownerId:owner};
}
export async function syncCommit(env,member,data) {
  if(typeof data.id!=='string'||!/^[\w-]{10,80}$/.test(data.id)||!Array.isArray(data.operations)||data.operations.length<1||data.operations.length>30)fail(400,'Ungültige Speicheranfrage.');
  const signature=await digest(JSON.stringify(data));
  const previous=await env.DB.prepare('SELECT * FROM app_commits WHERE id=?').bind(data.id).first();
  if(previous){if(previous.member_id!==member.id||previous.signature!==signature)fail(409,'Vorgangskennung bereits verwendet.');return {ok:true};}
  const c=await context(env,member), seen=new Set(), ops=[];
  for(const op of data.operations){if(!op||typeof op!=='object')fail(400,'Ungültiger Datensatz.');if(seen.has(key(op)))fail(400,'Doppelter Datensatz.');seen.add(key(op));ops.push(await validate(env,member,c,op,data.operations,Boolean(data.importing)));}
  // A single SQLite transaction gates EVERY write on ALL expected revisions.
  // Chunked payloads allow high-resolution photos without exceeding D1 row limits.
  const checks=ops.map(()=>`COALESCE((SELECT revision FROM app_records WHERE kind=? AND id=?),0)=?`).join(' AND ');
  const statements=[env.DB.prepare(`INSERT INTO app_commits(id,member_id,signature,created_at) SELECT ?,?,?,? WHERE ${checks}`).bind(data.id,member.id,signature,Date.now(),...ops.flatMap(o=>[o.kind,o.id,o.revision]))];
  for(const o of ops){
    const payloadId=crypto.randomUUID(), json=JSON.stringify(o.value);
    for(let i=0;i<json.length;i+=250000)statements.push(env.DB.prepare('INSERT INTO app_payloads(payload_id,part,data) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM app_commits WHERE id=? AND signature=?)').bind(payloadId,i/250000,json.slice(i,i+250000),data.id,signature));
    statements.push(env.DB.prepare(`INSERT INTO app_records(kind,id,owner_id,scope,revision,deleted,payload_id,updated_at)
      SELECT ?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM app_commits WHERE id=? AND signature=?)
      ON CONFLICT(kind,id) DO UPDATE SET scope=excluded.scope,revision=excluded.revision,deleted=excluded.deleted,payload_id=excluded.payload_id,updated_at=excluded.updated_at`).bind(o.kind,o.id,o.ownerId,o.scope,o.revision+1,o.deleted?1:0,payloadId,Date.now(),data.id,signature));
    // Superseded data includes old photos; delete it atomically after pointer swap.
    statements.push(env.DB.prepare('DELETE FROM app_payloads WHERE payload_id=? AND NOT EXISTS(SELECT 1 FROM app_records WHERE payload_id=?)').bind(c.map.get(key(o))?.payload_id||'',c.map.get(key(o))?.payload_id||''));
  }
  const result=await env.DB.batch(statements);
  if(!result[0].meta.changes)fail(409,'Die Daten wurden auf einem anderen Gerät geändert. Bitte neu laden.');
  return {ok:true};
}
