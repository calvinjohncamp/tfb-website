// TFB: protected member directory. Invitations/Kiosk remain a local simulation.
import schema from './schema.sql';
import {syncState, syncCommit, syncRevision, syncFaces, syncPhoto} from './app-sync.mjs';
import { managementPage } from './management.mjs';

const ORIGINS = new Set(['https://joern-kaemper.de', 'https://www.joern-kaemper.de', 'https://calvinjohncamp.github.io']);
const SESSION_MS = 12 * 60 * 60 * 1000;
const CODE_MS = 24 * 60 * 60 * 1000;
const encoder = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
const unhex = text => Uint8Array.from(text.match(/../g) || [], s => parseInt(s, 16));
const random = () => hex(crypto.getRandomValues(new Uint8Array(32)));
const norm = s => String(s || '').trim().toLowerCase().normalize('NFC');
const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim().normalize('NFC');
const hash = async s => hex(await crypto.subtle.digest('SHA-256', encoder.encode(s)));
function fail(status, message) { throw Object.assign(new Error(message), { status }); }
function equal(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export async function passwordHash(password, salt, pepper) {
  // A separate server secret protects against offline attacks on a leaked DB.
  // workerd WebCrypto supports at most 100,000 PBKDF2 iterations per call.
  const hmac = await crypto.subtle.importKey('raw', encoder.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const prehash = await crypto.subtle.sign('HMAC', hmac, encoder.encode(password));
  const key = await crypto.subtle.importKey('raw', prehash, 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unhex(salt), iterations: 100000, hash: 'SHA-256' }, key, 256));
}
async function publicMember(env, m) {
  const teams = (await env.DB.prepare('SELECT team_key FROM member_teams WHERE member_id=? ORDER BY team_key').bind(m.id).all()).results.map(row => row.team_key);
  return { id: m.id, memberNo: m.member_no, firstName: m.first_name, lastName: m.last_name,
    email: m.email, isAdmin: Boolean(m.is_admin), active: true, teams };
}
async function body(request, maxBytes = 1024 * 1024) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) fail(415, 'Bitte JSON-Daten senden.');
  const reader = request.body?.getReader();
  if (!reader) fail(400, 'Angaben fehlen.');
  const chunks = []; let size = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); fail(413, 'Die Anfrage ist zu groß.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let value;
  try { value = JSON.parse(new TextDecoder().decode(bytes)); } catch { fail(400, 'Ungültige Angaben.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'Ungültige Angaben.');
  return value;
}
async function rate(env, request, tag, limit) {
  const ip = request.headers.get('CF-Connecting-IP') || 'no-ip';
  const now = Date.now(); const window = Math.floor(now / 900000);
  const key = await hash(`${env.PASSWORD_PEPPER}:${ip}:${tag}:${window}`);
  const row = await env.DB.prepare(`INSERT INTO rate_limits(key,attempts,expires_at) VALUES (?,1,?)
    ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts`).bind(key, now + 1800000).first();
  if (row.attempts > limit) fail(429, 'Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.');
}
async function memberForIdentifier(env, identifier) {
  const value = norm(identifier);
  if (!value || value.length > 160) return null;
  const result = await env.DB.prepare(`SELECT * FROM members WHERE active=1
    AND (lower(email)=? OR lower(email2)=? OR member_no=?) LIMIT 2`).bind(value, value, value).all();
  // Shared household mail addresses need the unambiguous membership number.
  return result.results.length === 1 ? result.results[0] : null;
}
async function authenticated(request, env, admin = false) {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(request.headers.get('Authorization') || '');
  if (!match) fail(401, 'Bitte melde dich an.');
  const tokenHash = await hash(match[1]);
  const m = await env.DB.prepare(`SELECT m.* FROM sessions s JOIN members m ON m.id=s.member_id
    WHERE s.token_hash=? AND s.expires_at>? AND m.active=1`).bind(tokenHash, Date.now()).first();
  if (!m) fail(401, 'Deine Anmeldung ist abgelaufen. Bitte erneut anmelden.');
  if (admin && !m.is_admin) fail(403, 'Nur die Verwaltung darf diese Funktion nutzen.');
  return { member: m, tokenHash };
}
async function createSession(env, m) {
  const token = random();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(Date.now()),
    env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<=?').bind(Date.now()),
    env.DB.prepare('INSERT INTO sessions(token_hash,member_id,expires_at) VALUES (?,?,?)')
      .bind(await hash(token), m.id, Date.now() + SESSION_MS),
  ]);
  return { token, member: await publicMember(env, m) };
}
function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) fail(400, 'Bitte ein Passwort mit 12 bis 128 Zeichen verwenden.');
}
export function normalizeImport(rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 3000) fail(400, 'Bitte 1 bis 3000 Mitglieder übergeben.');
  const seen = new Set();
  const nonempty = rows.filter(r => {
    if (!r || typeof r !== 'object') fail(400, 'Ungültige Mitgliederzeile.');
    return ['memberNo','firstName','lastName','email','email2'].some(key => clean(r[key]));
  });
  if (!nonempty.length) fail(400, 'Keine Mitglieder in der Liste gefunden.');
  return nonempty.map(r => {
    if (!r || typeof r !== 'object') fail(400, 'Ungültige Mitgliederzeile.');
    const memberNo = clean(r.memberNo), firstName = clean(r.firstName), lastName = clean(r.lastName);
    const email = norm(r.email), email2 = norm(r.email2);
    if (!firstName || !lastName || [memberNo, firstName, lastName, email, email2].some(s => s.length > 160)) fail(400, 'Mitgliedsnummer und Namen prüfen.');
    if ([email,email2].some(s => s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))) fail(400, 'E-Mail-Adresse in der Liste prüfen.');
    const key = memberNo ? `no:${memberNo}` : email ? `mail:${email}` : `name:${norm(firstName+' '+lastName)}`;
    if (seen.has(key)) fail(400, 'Doppelte Mitgliedsnummer oder nicht eindeutig zuordenbare Zeilen.');
    seen.add(key);
    return { key, memberNo, firstName, lastName, email, email2 };
  });
}
async function importMembers(env, data) {
  const list = normalizeImport(data.rows);
  const previous = (await env.DB.prepare('SELECT * FROM members').all()).results;
  const used = new Set(); const statements = [];
  const plan = { neu: [], geaendert: [], gleich: 0, weg: [], ohneMail: 0, zeilen: list.length, beispiele: 0 };
  for (const r of list) {
    // Bootstrap admin is linked only by an exact unique email, never a name.
    const candidates = previous.filter(m => m.is_admin && !m.imported && r.email && m.email === r.email);
    const old = previous.find(m => m.external_key === r.key) || (candidates.length === 1 ? candidates[0] : null);
    if (old && used.has(old.id)) fail(400, 'Die Liste enthält eine mehrdeutige Kontozuordnung.');
    if (old) used.add(old.id);
    const name = `${r.firstName} ${r.lastName}`;
    if (!r.email) plan.ohneMail++;
    if (!old) {
      plan.neu.push(name);
      statements.push(env.DB.prepare(`INSERT INTO members(id,member_no,external_key,first_name,last_name,email,email2,search_text,imported,updated_at)
        VALUES (?,?,?,?,?,?,?,?,1,?)`).bind(crypto.randomUUID(), r.memberNo, r.key, r.firstName, r.lastName, r.email, r.email2, norm(`${r.firstName} ${r.lastName} ${r.email} ${r.email2}`), Date.now()));
    } else {
      const changed = !old.active || old.member_no !== r.memberNo || old.first_name !== r.firstName || old.last_name !== r.lastName || old.email !== r.email || old.email2 !== r.email2;
      if (changed) plan.geaendert.push(name); else plan.gleich++;
      if (changed || !old.imported) {
        const emailChanged = old.email !== r.email || old.email2 !== r.email2;
        // A changed login address invalidates sessions, codes and the old password.
        if (emailChanged) statements.push(env.DB.prepare('DELETE FROM sessions WHERE member_id=?').bind(old.id));
        statements.push(env.DB.prepare(`UPDATE members SET member_no=?,external_key=?,first_name=?,last_name=?,email=?,email2=?,search_text=?,active=1,imported=1,
          password_hash=CASE WHEN ? THEN NULL ELSE password_hash END,password_salt=CASE WHEN ? THEN NULL ELSE password_salt END,
          activation_hash=CASE WHEN ? THEN NULL ELSE activation_hash END,activation_expires=CASE WHEN ? THEN NULL ELSE activation_expires END,updated_at=? WHERE id=?`)
          .bind(r.memberNo,r.key,r.firstName,r.lastName,r.email,r.email2,norm(`${r.firstName} ${r.lastName} ${r.email} ${r.email2}`),emailChanged?1:0,emailChanged?1:0,emailChanged?1:0,emailChanged?1:0,Date.now(),old.id));
      }
    }
  }
  for (const old of previous.filter(m => m.imported && m.active && !m.is_admin && !used.has(m.id))) {
    plan.weg.push(`${old.first_name} ${old.last_name}`);
    statements.push(env.DB.prepare('UPDATE members SET active=0,activation_hash=NULL,password_hash=NULL,password_salt=NULL WHERE id=?').bind(old.id));
    statements.push(env.DB.prepare('DELETE FROM sessions WHERE member_id=?').bind(old.id));
  }
  if (data.apply === true && statements.length) await env.DB.batch(statements);
  return plan;
}

async function route(request, env, url) {
  const path = url.pathname;
  if (request.method === 'GET' && path === '/manage') return new Response(managementPage, { headers: { 'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'" } });
  if (request.method === 'GET' && path === '/health') return { service: 'tfb-api', version: 1, databaseBound: Boolean(env.DB), configured: Boolean(env.PASSWORD_PEPPER && env.SETUP_TOKEN) };
  if (!env.DB || !env.PASSWORD_PEPPER || env.PASSWORD_PEPPER.length < 32) fail(503, 'Der Mitgliederzugang wird noch eingerichtet.');
  if (request.method === 'POST' && path === '/setup') {
    const data = await body(request);
    if (!env.SETUP_TOKEN || !equal(await hash(String(data.setupToken || '')), await hash(env.SETUP_TOKEN))) fail(403, 'Einrichtung nicht freigegeben.');
    validatePassword(data.password);
    const email = norm(data.email), first = clean(data.firstName), last = clean(data.lastName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !first || !last || [email,first,last].some(s=>s.length>160)) fail(400, 'Name und E-Mail prüfen.');
    await env.DB.exec(schema.split(';').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean).join(';\n')+';');
    const salt = random(); const id = crypto.randomUUID();
    const result = await env.DB.prepare(`INSERT INTO members(id,first_name,last_name,email,search_text,is_admin,password_hash,password_salt,updated_at)
      SELECT ?,?,?,?,?,1,?,?,? WHERE NOT EXISTS(SELECT 1 FROM members WHERE is_admin=1)`)
      .bind(id,first,last,email,norm(`${first} ${last} ${email}`),await passwordHash(data.password,salt,env.PASSWORD_PEPPER),salt,Date.now()).run();
    if (result.meta.changes !== 1) fail(409, 'Die Verwaltung ist bereits eingerichtet. Bitte anmelden.');
    return createSession(env, await env.DB.prepare('SELECT * FROM members WHERE id=?').bind(id).first());
  }
  if (request.method === 'POST' && ['/auth/login','/auth/activate'].includes(path)) {
    await rate(env, request, 'auth', 15);
    const data = await body(request);
    if (typeof data.password !== 'string' || data.password.length > 128) fail(400, 'Zugangsdaten prüfen.');
    const m = await memberForIdentifier(env, data.identifier);
    if (path === '/auth/login') {
      const actual = await passwordHash(data.password, m?.password_salt || '0'.repeat(64), env.PASSWORD_PEPPER);
      if (!m?.password_hash || !equal(actual, m.password_hash)) fail(401, 'Anmeldung nicht möglich. E-Mail oder Mitgliedsnummer und Passwort prüfen.');
      return createSession(env, m);
    }
    validatePassword(data.password);
    const codeHash = await hash(String(data.code || '').trim());
    if (!m || !m.activation_hash || !equal(codeHash, m.activation_hash) || m.activation_expires <= Date.now()) fail(401, 'Freischaltung nicht möglich. Zugang und Freischaltcode prüfen.');
    const salt = random();
    const result = await env.DB.prepare(`UPDATE members SET password_hash=?,password_salt=?,activation_hash=NULL,activation_expires=NULL
      WHERE id=? AND active=1 AND activation_hash=? AND activation_expires>? RETURNING *`)
      .bind(await passwordHash(data.password,salt,env.PASSWORD_PEPPER),salt,m.id,codeHash,Date.now()).first();
    if (!result) fail(401, 'Der Freischaltcode ist nicht mehr gültig.');
    await env.DB.prepare('DELETE FROM sessions WHERE member_id=?').bind(m.id).run();
    return createSession(env, result);
  }
  const { member, tokenHash } = await authenticated(request, env, path.startsWith('/admin/'));
  await rate(env, request, 'directory', member.is_admin ? 3000 : 1800);
  if (request.method === 'GET' && path === '/app/revision') return {revision:await syncRevision(env,member)};
  if (request.method === 'POST' && path === '/app/photo') return syncPhoto(env,member,(await body(request)).id);
  if (request.method === 'POST' && path === '/app/faces') return syncFaces(env,member,(await body(request)).ids);
  if (request.method === 'GET' && path === '/app/state') return syncState(env,member);
  if (request.method === 'POST' && path === '/app/commit') return syncCommit(env,member,await body(request,8*1024*1024));
  if (request.method === 'GET' && path === '/auth/session') return { member: await publicMember(env, member) };
  if (request.method === 'POST' && path === '/auth/logout') {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(tokenHash).run(); return { ok: true };
  }
  if (request.method === 'GET' && path === '/members/search') {
    const q = norm(url.searchParams.get('q')).replace(/[._-]+/g,' ').replace(/\s+/g,' ').trim();
    if (q.length < 2 || q.length > 80) return [];
    // instr treats SQL wildcard characters as literal text. Never return mail addresses.
    const rows = await env.DB.prepare(`SELECT id,first_name,last_name FROM members WHERE active=1 AND
      instr(search_text,?)>0 ORDER BY last_name,first_name LIMIT 8`).bind(q).all();
    return rows.results.map(m=>({id:m.id,firstName:m.first_name,lastName:m.last_name,openInvites:true}));
  }
  if (request.method === 'POST' && path === '/members/names') {
    const data = await body(request); const ids = [...new Set(data.ids || [])];
    if (ids.length > 100 || ids.some(id=>typeof id!=='string'||id.length>80)) fail(400, 'Zu viele Namen angefordert.');
    if (!ids.length) return {};
    const rows = await env.DB.prepare(`SELECT id,first_name,last_name FROM members WHERE active=1 AND id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all();
    return Object.fromEntries(rows.results.map(m=>[m.id,`${m.first_name} ${m.last_name}`]));
  }
  if (request.method === 'GET' && path === '/admin/info') {
    const row = await env.DB.prepare('SELECT COUNT(*) AS n,MAX(updated_at) AS at FROM members WHERE imported=1 AND active=1').first();
    return { imported: row.n, at: row.at ? new Date(row.at).toISOString() : null };
  }
  if (request.method === 'POST' && path === '/admin/import') return importMembers(env, await body(request));
  if (request.method === 'POST' && path === '/admin/activation') {
    const data = await body(request);
    const target = await env.DB.prepare('SELECT id FROM members WHERE id=? AND active=1').bind(String(data.memberId||'')).first();
    if (!target) fail(404, 'Mitglied nicht gefunden.');
    const code=random(); const expires=Date.now()+CODE_MS;
    await env.DB.prepare('UPDATE members SET activation_hash=?,activation_expires=? WHERE id=?')
      .bind(await hash(code),expires,target.id).run();
    return { code, expiresAt: new Date(expires).toISOString() };
  }
  fail(404, 'Funktion nicht vorhanden.');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url); const origin = request.headers.get('Origin');
    const sameOrigin = origin === url.origin;
    const allowed = !origin || sameOrigin || ORIGINS.has(origin);
    const headers = { 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer',
      'Vary':'Origin', ...(allowed && origin ? {'Access-Control-Allow-Origin':origin} : {}) };
    function respond(value, status=200) {
      if (value instanceof Response) { const h=new Headers(value.headers);for(const [k,v] of Object.entries(headers))h.set(k,v);return new Response(value.body,{status:value.status,headers:h}); }
      return Response.json(value,{status,headers});
    }
    if (!allowed) return respond({error:'Diese Website ist nicht freigegeben.'},403);
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600'}});
    if (!['GET','POST'].includes(request.method)) return respond({error:'Methode nicht unterstützt.'},405);
    try { return respond(await route(request,env,url)); }
    catch(e) { return respond({error:e.status ? e.message : 'Der Mitgliederzugang ist noch nicht bereit oder vorübergehend nicht erreichbar.'},e.status||503); }
  }
};
