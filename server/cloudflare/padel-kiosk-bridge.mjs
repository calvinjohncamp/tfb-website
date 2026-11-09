import {kioskReport,kioskOverview,kioskStatement,kioskMessage} from './kiosk-billing.mjs';
import {kioskTally} from './kiosk-account.mjs';
// Server-to-server only. No browser CORS or public member-price response.
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[^\p{L}\p{N}]/gu,'');
const mail=s=>String(s||'').trim().toLowerCase();
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('');
async function authorize(request,env){const actual=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');if(request.headers.get('Origin')||!env.PADEL_KIOSK_BRIDGE_SECRET||actual.length<32||await digest(actual)!==await digest(env.PADEL_KIOSK_BRIDGE_SECRET))fail(401,'Nicht freigegeben.');}
async function resolve(env,data){
 if(data.livemode!==false)fail(409,'Echte TFB-Einzüge sind noch nicht angebunden.');
 if(!/^[a-f0-9-]{36}$/.test(data.authId||'')||typeof data.email!=='string'||typeof data.fullName!=='string')fail(400,'Ungültige Identität.');
 const candidates=(await env.DB.prepare("SELECT id,first_name,last_name FROM members WHERE active=1 AND (rtrim(lower(email),';, ')=? OR rtrim(lower(email2),';, ')=?)").bind(mail(data.email),mail(data.email)).all()).results.filter(m=>norm(m.first_name+' '+m.last_name)===norm(data.fullName));
 if(candidates.length!==1)fail(409,'TFB-Konto nicht eindeutig zuordenbar.');
 const memberId=candidates[0].id,old=await env.DB.prepare('SELECT member_id FROM padel_kiosk_links WHERE auth_id=?').bind(data.authId).first();
 if(old&&old.member_id!==memberId)fail(409,'Bestehende Kontozuordnung muss geprüft werden.');
 await env.DB.prepare('INSERT INTO padel_kiosk_links(auth_id,member_id) VALUES(?,?) ON CONFLICT(auth_id) DO NOTHING').bind(data.authId,memberId).run();
 return {memberId,liveAuthorized:false};
}
async function receive(env,{kind,order:o}){
 if(!o||o.livemode!==false)fail(409,'Echte TFB-Einzüge sind noch nicht angebunden.');
 if(!['purchase','cancel'].includes(kind)||!/^[a-f0-9-]{36}$/.test(o.id||'')||o.payment_route!=='tfb_debit'||o.allocation!=='tfb'||o.tariff!=='member'||o.origin!=='padel_app'||!Number.isSafeInteger(o.quantity)||o.quantity<1||o.quantity>24||!Number.isSafeInteger(o.unit_cents)||o.unit_cents<1||o.total_cents!==o.unit_cents*o.quantity||!Number.isFinite(Date.parse(o.created_at))||typeof o.product_name!=='string'||o.product_name.length>160||typeof o.section_name!=='string'||o.section_name.length>100||!['sale','rental'].includes(o.kind)||typeof o.unit!=='string'||o.unit.length>80)fail(400,'Ungültige Kiosk-Buchung.');
 const member=await env.DB.prepare('SELECT m.* FROM padel_kiosk_links l JOIN members m ON m.id=l.member_id WHERE l.auth_id=? AND l.member_id=? AND m.active=1').bind(o.auth_id,o.tfb_member_id).first();if(!member)fail(409,'TFB-Kontozuordnung fehlt.');
 const payload=JSON.stringify(o),fingerprint=await digest(payload),entryId='padel-'+o.id,eventId=kind+':'+o.id;
 const old=await env.DB.prepare('SELECT fingerprint FROM padel_kiosk_receipts WHERE event_id=?').bind(eventId).first();if(old){if(old.fingerprint!==fingerprint)fail(409,'Abweichende Wiederholung.');return {orderId:o.id,kind,entryId};}
 const statements=[];
 if(kind==='purchase'){
  statements.push(env.DB.prepare("INSERT INTO kiosk_entries(id,member_id,member_name,product_id,product_name,detail,section_id,section_name,unit,product_kind,price_cents,created_at,origin,basis) VALUES(?,?,?,?,?,?,'padel',?,?,?,?,?,'padel_app','padel-test') ON CONFLICT(id) DO NOTHING").bind(entryId,member.id,member.first_name+' '+member.last_name,o.product_id,o.product_name,o.quantity+' × '+o.unit,o.section_name,o.quantity+' × '+o.unit,o.kind,o.total_cents,o.created_at));
 }else{
  if(!await env.DB.prepare('SELECT id FROM kiosk_entries WHERE id=? AND member_id=?').bind(entryId,member.id).first())fail(409,'Originalbuchung noch nicht übernommen.');
  const credited=await env.DB.prepare('SELECT COALESCE(SUM(amount_cents),0) cents FROM kiosk_adjustments WHERE entry_id=?').bind(entryId).first();
  const remaining=o.total_cents-credited.cents;
  if(remaining>0)statements.push(env.DB.prepare("INSERT INTO kiosk_adjustments VALUES(?,?,?,?,?,?,'undo') ON CONFLICT(id) DO NOTHING").bind('padel-undo-'+o.id,entryId,remaining,'In der Padel-App unmittelbar zurückgenommen',member.id,new Date().toISOString()));
 }
 statements.push(env.DB.prepare('INSERT INTO padel_kiosk_receipts VALUES(?,?,?,?,?) ON CONFLICT(event_id) DO NOTHING').bind(eventId,entryId,fingerprint,payload,new Date().toISOString()));
 await env.DB.batch(statements);return {orderId:o.id,kind,entryId};
}

async function account(env,data){
 const member=await env.DB.prepare('SELECT m.* FROM padel_kiosk_links l JOIN members m ON m.id=l.member_id WHERE l.auth_id=? AND m.active=1').bind(data.authId).first();
 if(!member)fail(403,'TFB-Kontozuordnung fehlt.');
 member.is_admin=false; // A Padel personal account never inherits TFB administration rights.
 const query=new URLSearchParams(data.query||{});
 // This bridge is always a personal view. Never forward an admin/member scope.
 query.delete('member');
 if(data.resource==='overview')return kioskOverview(env,member,query);
 if(data.resource==='report'||data.resource==='open'){
  const report=await kioskReport(env,member,query);
  if(data.resource==='report')return report;
  return {month:report.from.slice(0,7),totalCents:report.totalCents,items:report.entries.filter(e=>e.net_cents>0).map(e=>({id:e.id,productId:e.product_id,productName:e.product_name,priceCents:e.net_cents,createdAt:e.created_at,quantity:e.quantity||1,origin:e.origin}))};
 }
 if(data.resource==='statement')return kioskStatement(env,member,query.get('id'));
 if(data.resource==='question')return kioskMessage(env,member,data.message);
 if(data.resource==='tally')return kioskTally(env,member);
 fail(400,'Unbekannte Kontoabfrage.');
}
export async function padelKioskBridge(request,env,data){await authorize(request,env);if(data.action==='account')return account(env,data);if(data.action==='resolve')return resolve(env,data);if(data.action==='receive')return receive(env,data);if(data.action==='reconcile'){const rows=(await env.DB.prepare("SELECT a.id,a.amount_cents,a.created_at,e.id entry_id FROM kiosk_adjustments a JOIN kiosk_entries e ON e.id=a.entry_id JOIN padel_kiosk_links l ON l.member_id=e.member_id WHERE e.origin='padel_app' AND (?='' OR l.auth_id=?) AND a.id NOT LIKE 'padel-undo-%' ORDER BY a.created_at,a.id").bind(data.authId||'',data.authId||'').all()).results;return {adjustments:rows.map(r=>({id:r.id,orderId:r.entry_id.slice(6),amountCents:r.amount_cents,createdAt:r.created_at}))};}fail(400,'Unbekannte Aktion.');}
