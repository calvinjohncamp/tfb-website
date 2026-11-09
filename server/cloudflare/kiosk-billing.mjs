// Demonstration billing only. No mandate activation, SEPA file, bank or mail calls.
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const hash=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
export function kioskCommitStatements(env,member,ops,c,commitId,signature){
 const q=[],guard='EXISTS(SELECT 1 FROM app_commits WHERE id=? AND signature=?)',now=new Date().toISOString();
 for(const o of ops){if(o.kind==='catalog'){q.push(env.DB.prepare(`INSERT OR IGNORE INTO kiosk_catalog_history SELECT ?,?,?,? WHERE ${guard} AND NOT EXISTS(SELECT 1 FROM kiosk_catalog_history)`).bind('initial:'+commitId,'system',now,JSON.stringify(c.catalog),commitId,signature));}if(o.kind==='catalog')q.push(env.DB.prepare(`INSERT OR IGNORE INTO kiosk_catalog_history SELECT ?,?,?,? WHERE ${guard}`).bind(commitId,member.id,now,JSON.stringify(o.value),commitId,signature));
 if(o.kind!=='item'||o.deleted)continue;const v=o.value,menu=ops.find(x=>x.kind==='catalog')?.value||c.catalog,p=menu?.products.find(p=>p.id===v.productId),section=menu?.sections.find(s=>s.id===p?.section);
 q.push(env.DB.prepare(`INSERT OR IGNORE INTO kiosk_entries(id,member_id,member_name,product_id,product_name,detail,section_id,section_name,unit,product_kind,price_cents,created_at,basis) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE ${guard}`).bind(o.id,member.id,[member.first_name,member.last_name].filter(Boolean).join(' '),v.productId,v.productName,v.detail||p?.detail||'',v.sectionId||p?.section||'',v.sectionName||section?.title||'',v.unit||p?.unit||'Stück',v.kind||p?.kind||'sale',v.priceCents,v.createdAt,v.imported?'imported-demo':'server',commitId,signature));
 if(v.status==='cancelled'&&v.priceCents>0)q.push(env.DB.prepare(`INSERT OR IGNORE INTO kiosk_adjustments SELECT ?,?,?,?, ?,?,'undo' WHERE ${guard}`).bind('undo:'+o.id,o.id,v.priceCents,'Vom Mitglied unmittelbar zurückgenommen',member.id,now,commitId,signature));
 }return q;
}
function range(query){const month=query.get('month')||new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'}).slice(0,7);if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month))fail(400,'Bitte einen gültigen Monat wählen.');const from=query.get('from')||month+'-01',last=new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5)),0)).toISOString().slice(0,10),to=query.get('to')||last;const valid=d=>/^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d)&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;if(!valid(from)||!valid(to)||from>to||Date.parse(to)-Date.parse(from)>732*86400000)fail(400,'Bitte einen gültigen Zeitraum bis maximal zwei Jahre wählen.');return {from,to};}

const berlinCalendar=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'});
const day=t=>berlinCalendar.format(new Date(t));
export async function kioskReport(env,member,query,admin=false){
 const {from,to}=range(query),owner=admin?query.get('member')||'':member.id;
 if(!owner&&Date.parse(to)-Date.parse(from)>93*86400000)fail(400,'Für alle Mitglieder bitte höchstens drei Monate wählen; für längere Zeiträume ein Mitglied auswählen.');
 // UTC envelope followed by exact Berlin-calendar filtering, including DST.
 const rows=(await env.DB.prepare(`SELECT e.*,COALESCE(json_extract(pr.payload,'$.quantity'),1) quantity,COALESCE(m.first_name||' '||m.last_name,e.member_name) display_name FROM kiosk_entries e LEFT JOIN members m ON m.id=e.member_id LEFT JOIN padel_kiosk_receipts pr ON pr.event_id='purchase:'||substr(e.id,7) WHERE (?='' OR e.member_id=?) AND e.created_at>=? AND e.created_at<? ORDER BY e.created_at DESC,e.id`).bind(owner,owner,new Date(Date.parse(from+'T00:00:00Z')-86400000).toISOString(),new Date(Date.parse(to.slice(0,7)+'-01T00:00:00Z')+32*86400000).toISOString()).all()).results.filter(e=>{const d=day(e.created_at);return d>=from&&d<=to;});
 const ids=new Set(rows.map(e=>e.id)),adjustments=(await env.DB.prepare(`SELECT a.*,COALESCE(m.first_name||' '||m.last_name,'Früheres Konto') actor_name FROM kiosk_adjustments a JOIN kiosk_entries e ON e.id=a.entry_id LEFT JOIN members m ON m.id=a.actor_id WHERE (?='' OR e.member_id=?) ORDER BY a.created_at,a.id`).bind(owner,owner).all()).results.filter(a=>ids.has(a.entry_id));
 const messages=(await env.DB.prepare("SELECT q.*,COALESCE(m.first_name||' '||m.last_name,'Früheres Konto') author_name FROM kiosk_messages q LEFT JOIN members m ON m.id=q.author_id WHERE (?='' OR q.member_id=?) ORDER BY q.created_at,q.id").bind(owner,owner).all()).results.filter(q=>ids.has(q.entry_id));
 const entries=rows.map(e=>{const credits=adjustments.filter(a=>a.entry_id===e.id);return {...e,day:day(e.created_at),messages:messages.filter(q=>q.entry_id===e.id),adjustments:credits,net_cents:e.price_cents-credits.reduce((s,a)=>s+a.amount_cents,0)};});
 const periods=(await env.DB.prepare("SELECT created_at FROM kiosk_entries WHERE (?='' OR member_id=?)").bind(owner,owner).all()).results.map(e=>day(e.created_at).slice(0,7));
 const statements=(await env.DB.prepare("SELECT id,member_id,month,version,total_cents,created_at FROM kiosk_statements WHERE (?='' OR member_id=?) ORDER BY month DESC,version DESC LIMIT 200").bind(owner,owner).all()).results;
 return {mode:'demo',collectionEnabled:false,paymentMethod:null,debitDate:null,from,to,entries,statements,months:[...new Set(periods)].sort().reverse(),members:admin?(await env.DB.prepare('SELECT id,first_name,last_name FROM members ORDER BY last_name,first_name').all()).results:[],totalCents:entries.reduce((s,e)=>s+e.net_cents,0),grossCents:entries.reduce((s,e)=>s+e.price_cents,0),creditCents:adjustments.reduce((s,a)=>s+a.amount_cents,0),notice:'Vorführbetrieb · keine echten Forderungen, keine Abbuchungen und keine Abrechnungsmails. Zahlungsweg und Einzugstermin stehen noch nicht fest.'};
}
export async function kioskArchiveMonth(env,member,data){
 if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(data.month||'')||data.month>day(Date.now()).slice(0,7))fail(400,'Bitte einen begonnenen Vorführmonat wählen.');
 const report=await kioskReport(env,member,new URLSearchParams({month:data.month,...(data.member?{member:data.member}:{})}),true),groups=new Map();for(const e of report.entries){if(!groups.has(e.member_id))groups.set(e.member_id,[]);groups.get(e.member_id).push(e);}
 const ids=[];for(const [owner,entries]of groups){const value={format:'tfb-kiosk-demo-statement',version:1,month:data.month,memberId:owner,memberName:entries[0].display_name,entries:entries.map(({messages,...e})=>e),totalCents:entries.reduce((s,e)=>s+e.net_cents,0),mode:'demo',collectionEnabled:false},payload=JSON.stringify(value),fingerprint=await hash(payload),id=await hash(owner+':'+data.month+':'+fingerprint);
 await env.DB.prepare(`INSERT OR IGNORE INTO kiosk_statements(id,member_id,month,version,fingerprint,total_cents,created_at,actor_id,payload) SELECT ?,?,?,COALESCE(MAX(version),0)+1,?,?,?,?,? FROM kiosk_statements WHERE member_id=? AND month=?`).bind(id,owner,data.month,fingerprint,value.totalCents,new Date().toISOString(),member.id,payload,owner,data.month).run();ids.push(id);}
 return {ok:true,count:ids.length,ids,mode:'demo'};
}
export async function kioskStatement(env,member,id){const s=await env.DB.prepare('SELECT * FROM kiosk_statements WHERE id=?').bind(id).first();if(!s||!member.is_admin&&s.member_id!==member.id)fail(404,'Abrechnung nicht gefunden.');return {...JSON.parse(s.payload),id:s.id,archiveVersion:s.version,createdAt:s.created_at};}
export async function kioskCredit(env,member,data){
 if(!/^[\w-]{10,80}$/.test(data.id||'')||typeof data.entryId!=='string'||!Number.isSafeInteger(data.amountCents)||data.amountCents<=0||typeof data.reason!=='string'||data.reason.trim().length<5||data.reason.length>500)fail(400,'Buchung, positiver Korrekturbetrag und Begründung angeben.');
 const e=await env.DB.prepare('SELECT * FROM kiosk_entries WHERE id=?').bind(data.entryId).first();if(!e)fail(404,'Buchung nicht gefunden.');const old=await env.DB.prepare('SELECT * FROM kiosk_adjustments WHERE id=?').bind(data.id).first();if(old){if(old.entry_id!==data.entryId||old.amount_cents!==data.amountCents||old.reason!==data.reason.trim())fail(409,'Diese Korrekturkennung wurde bereits anders verwendet.');return {ok:true};}
 try{await env.DB.prepare("INSERT INTO kiosk_adjustments VALUES (?,?,?,?,?,?,'admin')").bind(data.id,e.id,data.amountCents,data.reason.trim(),member.id,new Date().toISOString()).run();}catch(e){if(String(e.message).includes('KIOSK_CREDIT_EXCEEDS_PURCHASE'))fail(409,'Die Korrektur übersteigt den noch offenen Buchungsbetrag.');throw e;}return {ok:true};
}

export async function kioskMessage(env,member,data,reply=false){
 if(!/^[\w-]{10,80}$/.test(data.id||'')||typeof data.entryId!=='string'||typeof data.text!=='string'||data.text.trim().length<5||data.text.length>1000)fail(400,'Bitte eine Frage oder Antwort zwischen 5 und 1000 Zeichen eingeben.');
 const e=await env.DB.prepare('SELECT member_id FROM kiosk_entries WHERE id=?').bind(data.entryId).first();if(!e||!reply&&e.member_id!==member.id)fail(404,'Buchung nicht gefunden.');
 if(reply){const parent=await env.DB.prepare("SELECT id FROM kiosk_messages WHERE id=? AND entry_id=? AND kind='question'").bind(data.parentId||'',data.entryId).first();if(!parent)fail(400,'Ursprüngliche Frage nicht gefunden.');}
 const old=await env.DB.prepare('SELECT * FROM kiosk_messages WHERE id=?').bind(data.id).first();if(old){if(old.author_id!==member.id||old.entry_id!==data.entryId||old.text!==data.text.trim())fail(409,'Diese Nachricht wurde bereits anders gespeichert.');return {ok:true};}
 await env.DB.prepare('INSERT INTO kiosk_messages VALUES (?,?,?,?,?,?,?,?)').bind(data.id,data.entryId,e.member_id,member.id,reply?data.parentId:null,reply?'reply':'question',data.text.trim(),new Date().toISOString()).run();return {ok:true};
}

// Overview returns only calendar aggregates, never a year's transaction list.
export async function kioskOverview(env,member,query,admin=false,now=Date.now()){
 const owner=admin?query.get('member')||'':member.id;
 const rows=(await env.DB.prepare(`SELECT e.created_at,e.price_cents,COALESCE(a.cents,0) credit_cents FROM kiosk_entries e LEFT JOIN (SELECT entry_id,SUM(amount_cents) cents FROM kiosk_adjustments GROUP BY entry_id) a ON a.entry_id=e.id WHERE (?='' OR e.member_id=?) ORDER BY e.created_at`).bind(owner,owner).all()).results;
 const days=new Map(),months=new Map(),years=new Map();
 for(const e of rows){const d=day(e.created_at);for(const [map,key]of[[days,d],[months,d.slice(0,7)],[years,d.slice(0,4)]]){const value=map.get(key)||{period:key,totalCents:0,grossCents:0,creditCents:0,count:0};value.totalCents+=e.price_cents-e.credit_cents;value.grossCents+=e.price_cents;value.creditCents+=e.credit_cents;value.count++;map.set(key,value);}}
 return {mode:'demo',collectionEnabled:false,today:day(now),currentMonth:day(now).slice(0,7),currentYear:day(now).slice(0,4),days:[...days.values()],months:[...months.values()],years:[...years.values()],members:admin?(await env.DB.prepare('SELECT id,first_name,last_name FROM members ORDER BY last_name,first_name').all()).results:[]};
}
