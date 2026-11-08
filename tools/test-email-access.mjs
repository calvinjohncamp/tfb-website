import{test}from'node:test';import assert from'node:assert/strict';import{fixture}from'./app-sync-fixture.mjs';
const password='Member account password 123!';
async function setup(){const f=await fixture(),mail=[];f.env.AUTH_MAIL={send:async m=>mail.push(m)};const request=(email='other@example.invalid',memberNo='')=>f.call('/auth/email/request',{email,memberNo});const activate=(challengeId,code,pw=password)=>f.call('/auth/email/activate',{challengeId,code,password:pw});const code=()=>mail.at(-1)?.text.match(/Freischaltcode: (\d{6})/)[1];return{...f,mail,request,activate,code};}
test('automatic code stays private, activates a listed email with 12+ character password and supports later login',async()=>{
 const f=await setup();assert.equal((await f.call('/auth/options')).body.automaticEmail,true);const r=await f.request(' OTHER@EXAMPLE.INVALID ');assert.equal(r.status,200);assert.equal(f.mail.length,1);assert.deepEqual(f.mail[0].to,['other@example.invalid']);assert.match(f.mail[0].html,/https:\/\/joern-kaemper\.de\/assets\/brand\/tfb-logo-midnight-amber\.png/);assert.match(f.mail[0].html,/max-width:620px/);assert.match(f.mail[0].html,/border-top:3px solid #FFC300/);assert.match(f.mail[0].html,/class="access-code"/);assert(!/PRÄSENTATIONSMUSTER|Anna Beispiel|#C4553A|Aufnahmeprüfung/.test(f.mail[0].html));const code=f.code();assert(!JSON.stringify(r.body).includes(code));const stored=f.env.DB.sqlite.prepare('SELECT * FROM member_login_challenges WHERE id=?').get(r.body.challengeId);assert.notEqual(stored.code_hash,code);
 assert.equal((await f.activate(r.body.challengeId,code,'too-short')).status,400);
 const signed=await f.activate(r.body.challengeId,code);assert.equal(signed.status,200);assert.equal(signed.body.member.id,f.otherId);assert.equal(signed.body.member.isAdmin,false);
 assert.equal((await f.activate(r.body.challengeId,code)).status,401);assert.equal((await f.call('/auth/login',{identifier:'other@example.invalid',password})).status,200);
});
test('unknown and shared addresses get no membership disclosure; household number safely disambiguates',async()=>{
 const f=await setup();const unknown=await f.request('external@example.invalid');assert.equal(unknown.status,200);assert.equal(f.mail.length,0);assert.equal((await f.activate(unknown.body.challengeId,'123456')).status,401);
 f.env.DB.sqlite.prepare('UPDATE members SET email=?,member_no=? WHERE id=?').run('other@example.invalid','1',f.admin.id);f.env.DB.sqlite.prepare('UPDATE members SET member_no=? WHERE id=?').run('2',f.otherId);
 const shared=await f.request();assert.equal(shared.status,200);assert.deepEqual(Object.keys(shared.body).sort(),Object.keys(unknown.body).sort());assert.equal(f.mail.length,0);
 const own=await f.request('other@example.invalid','2');assert.equal(f.mail.length,1);assert.equal((await f.activate(own.body.challengeId,f.code())).body.member.id,f.otherId);
});
test('cooldown prevents duplicate mail, bad guesses lock a challenge and expired or revoked identities fail',async()=>{
 const f=await setup(),r=await f.request(),code=f.code();assert.equal((await f.request()).body.challengeId,r.body.challengeId);assert.equal(f.mail.length,1);
 const bad=code==='000000'?'111111':'000000';for(let i=0;i<5;i++)assert.equal((await f.activate(r.body.challengeId,bad)).status,401);assert.equal((await f.activate(r.body.challengeId,code)).status,401);
 const g=await setup(),expired=await g.request();g.env.DB.sqlite.prepare('UPDATE member_login_challenges SET expires_at=0').run();assert.equal((await g.activate(expired.body.challengeId,g.code())).status,401);
 const h=await setup(),revoked=await h.request();h.env.DB.sqlite.prepare('UPDATE members SET active=0 WHERE id=?').run(h.otherId);assert.equal((await h.activate(revoked.body.challengeId,h.code())).status,401);
});
test('replacement code invalidates previous code and password reset revokes all existing sessions',async()=>{
 const f=await setup(),r=await f.request(),old=f.code();f.env.DB.sqlite.prepare('UPDATE member_login_challenges SET created_at=created_at-61000').run();const fresh=await f.request(),next=f.code();assert.equal(f.mail.length,2);assert.equal((await f.activate(r.body.challengeId,old)).status,401);assert.equal((await f.activate(fresh.body.challengeId,next)).status,200);assert.equal((await f.call('/auth/session',undefined,f.otherToken)).status,401);
});
test('mail failure is visible, leaves no usable code, and missing provider does not pretend to send',async()=>{
 const f=await setup();f.env.AUTH_MAIL.send=async()=>{throw Error('synthetic provider failure');};assert.equal((await f.request()).status,503);assert.equal(f.env.DB.sqlite.prepare('SELECT COUNT(*) n FROM member_login_challenges').get().n,0);delete f.env.AUTH_MAIL;assert.equal((await f.call('/auth/options')).body.automaticEmail,false);assert.equal((await f.request()).status,503);
});
test('member dashboard and presence require server roles; timestamps never invent a historic login',async()=>{
 const f=await setup();assert.equal((await f.call('/admin/members')).status,401);assert.equal((await f.call('/admin/members',undefined,f.otherToken)).status,403);
 const state=await f.call('/admin/members',undefined,f.adminToken);assert.equal(state.status,200);assert.equal(state.body.summary.total,2);assert(state.body.members.find(m=>m.id===f.admin.id).online);
 await f.call('/auth/presence',{},f.otherToken);const m=(await f.call('/admin/members',undefined,f.adminToken)).body.members.find(m=>m.id===f.otherId);assert(m.online);assert.equal(m.lastLoginAt,null);
 f.env.DB.sqlite.prepare('UPDATE member_access SET last_seen_at=? WHERE member_id=?').run(Date.now()-6*60000,f.otherId);assert.equal((await f.call('/admin/members',undefined,f.adminToken)).body.members.find(m=>m.id===f.otherId).online,false);
});

test('existing imported trailing separators still accept the clean email for code and confirmation',async()=>{
 const f=await setup();f.env.DB.sqlite.prepare('UPDATE members SET email=? WHERE id=?').run('other@example.invalid;',f.otherId);
 const r=await f.request();assert.equal(r.status,200);assert.equal(f.mail.length,1);assert.deepEqual(f.mail[0].to,['other@example.invalid']);
 assert.match(f.mail[0].html,/<font color="#001D3D">\d{6}<\/font>/);assert.match(f.mail[0].html,/width="200"/);assert.match(f.mail[0].html,/text-align:left;-webkit-text-fill-color:#001D3D/);
 assert.equal((await f.activate(r.body.challengeId,f.code())).status,200);
});
