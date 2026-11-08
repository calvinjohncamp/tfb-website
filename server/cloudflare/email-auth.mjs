import {accessMailHtml} from './access-mail.mjs';
const enc=new TextEncoder();
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFC');
const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),n=>n.toString(16).padStart(2,'0')).join('');
const same=(a,b)=>{if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;};
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
export const emailAccessReady=env=>Boolean(env.AUTH_MAIL?.send||(env.RESEND_API_KEY&&env.AUTH_EMAIL_FROM));
export async function recordAccess(env,id,login=false){
 const now=Date.now();
 await env.DB.prepare(`INSERT INTO member_access(member_id,first_login_at,last_login_at,last_seen_at) VALUES (?,?,?,?)
 ON CONFLICT(member_id) DO UPDATE SET last_seen_at=excluded.last_seen_at,
 first_login_at=COALESCE(member_access.first_login_at,excluded.first_login_at),
 last_login_at=CASE WHEN ? THEN excluded.last_login_at ELSE member_access.last_login_at END
 WHERE ? OR member_access.last_seen_at<?`).bind(id,login?now:null,login?now:null,now,login?1:0,login?1:0,now-60000).run();
}
export async function memberAccessOverview(env){
 const rows=(await env.DB.prepare(`SELECT m.id,m.member_no,m.first_name,m.last_name,m.email,m.email2,m.is_admin,m.password_hash IS NOT NULL AS has_password,
 a.first_login_at,a.last_login_at,a.last_seen_at FROM members m LEFT JOIN member_access a ON a.member_id=m.id
 WHERE m.active=1 ORDER BY m.last_name COLLATE NOCASE,m.first_name COLLATE NOCASE`).all()).results;
 const now=Date.now();
 const members=rows.map(m=>({id:m.id,memberNo:m.member_no,firstName:m.first_name,lastName:m.last_name,email:m.email,email2:m.email2,isAdmin:Boolean(m.is_admin),
 activated:Boolean(m.has_password),firstLoginAt:m.first_login_at||null,lastLoginAt:m.last_login_at||null,lastSeenAt:m.last_seen_at||null,
 online:Boolean(m.last_seen_at&&m.last_seen_at>now-5*60000)}));
 return {at:now,members,summary:{total:members.length,online:members.filter(m=>m.online).length,activated:members.filter(m=>m.activated).length,withoutEmail:members.filter(m=>!m.email&&!m.email2).length}};
}
export async function requestEmailCode(env,data){
 if(!emailAccessReady(env))fail(503,'Der automatische Mailversand wird noch eingerichtet. Bitte später erneut versuchen.');
 const email=norm(data.email),memberNo=String(data.memberNo||'').trim();
 if(email.length>160||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||memberNo.length>160)fail(400,'Bitte deine beim Verein hinterlegte E-Mail-Adresse eingeben.');
 const now=Date.now();
 await env.DB.prepare('DELETE FROM member_login_challenges WHERE expires_at<?').bind(now-86400000).run();
 const rows=(await env.DB.prepare(`SELECT id FROM members WHERE active=1 AND (lower(email)=? OR lower(email2)=?) AND (?='' OR member_no=?) LIMIT 2`).bind(email,email,memberNo,memberNo).all()).results;
 const memberId=rows.length===1?rows[0].id:null;
 const previous=await env.DB.prepare('SELECT id,expires_at FROM member_login_challenges WHERE email=? AND member_id IS ? AND created_at>? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1').bind(email,memberId,now-60000).first();
 if(previous)return {challengeId:previous.id,expiresAt:previous.expires_at,retryAfter:60};
 await env.DB.prepare('UPDATE member_login_challenges SET consumed_at=? WHERE email=? AND member_id IS ? AND consumed_at IS NULL').bind(now,email,memberId).run();
 const id=Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
 const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%1000000).padStart(6,'0');
 const expires=now+10*60000,hash=await digest(`${env.PASSWORD_PEPPER}:${id}:${code}`);
 await env.DB.prepare('INSERT INTO member_login_challenges(id,member_id,email,code_hash,created_at,expires_at) VALUES (?,?,?,?,?,?)').bind(id,memberId,email,hash,now,expires).run();
 if(memberId){
  const message={from:env.AUTH_EMAIL_FROM||'Tennisfreunde Bielstein <tfb@padel-bielstein.de>',to:[email],subject:'Dein TFB-Freischaltcode',
   text:`Dein Freischaltcode: ${code}\n\nEr ist 10 Minuten gültig und nur einmal verwendbar. Gib ihn auf der TFB-Website ein und lege dein persönliches Passwort mit mindestens 12 Zeichen fest.\n\nWenn du keinen Code angefordert hast, ignoriere diese Nachricht.\nDeine Tennisfreunde Bielstein`,
   html:accessMailHtml(code)};
  try{
   if(env.AUTH_MAIL?.send)await env.AUTH_MAIL.send(message);
   else{
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`tfb-access/${id}`},body:JSON.stringify(message),signal:AbortSignal.timeout(12000)});
    if(!r.ok)throw Error('Mail provider rejected request');
   }
  }catch(_){await env.DB.prepare('DELETE FROM member_login_challenges WHERE id=?').bind(id).run();fail(503,'Die Mail konnte gerade nicht versendet werden. Bitte später erneut versuchen.');}
 }
 // Same response for unknown, shared and known addresses: no public membership lookup.
 return {challengeId:id,expiresAt:expires,retryAfter:60};
}
export async function claimEmailCode(env,data){
 const id=String(data.challengeId||''),code=String(data.code||'').trim(),now=Date.now();
 if(!/^[a-f0-9]{48}$/.test(id)||!/^\d{6}$/.test(code))fail(401,'Der Code ist ungültig oder abgelaufen. Bitte erneut prüfen oder einen neuen Code anfordern.');
 const row=await env.DB.prepare('UPDATE member_login_challenges SET attempts=attempts+1 WHERE id=? AND consumed_at IS NULL AND expires_at>? AND attempts<5 RETURNING *').bind(id,now).first();
 const actual=await digest(`${env.PASSWORD_PEPPER}:${id}:${code}`);
 if(!row||!row.member_id||!same(row.code_hash,actual))fail(401,'Der Code ist ungültig oder abgelaufen. Bitte erneut prüfen oder einen neuen Code anfordern.');
 const member=await env.DB.prepare('SELECT * FROM members WHERE id=? AND active=1 AND (lower(email)=? OR lower(email2)=?)').bind(row.member_id,row.email,row.email).first();
 if(!member)fail(401,'Der Zugang ist nicht mehr freigeschaltet. Bitte beim Verein die hinterlegte Adresse prüfen lassen.');
 const claimed=await env.DB.prepare('UPDATE member_login_challenges SET consumed_at=? WHERE id=? AND consumed_at IS NULL AND expires_at>? AND attempts<=5 RETURNING id').bind(now,id,now).first();
 if(!claimed)fail(401,'Dieser Code wurde bereits verwendet. Bitte einen neuen Code anfordern.');
 return member;
}
