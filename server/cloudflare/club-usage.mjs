const PAGES=new Set(['home','aktuell','chat','sport','club','treffen','kiosk']);
export const usageDay=(now=Date.now())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
const bad=message=>{throw Object.assign(Error(message),{status:400});};
const uuid=s=>typeof s==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(s);
async function key(env,value){const enc=new TextEncoder(),k=await crypto.subtle.importKey('raw',enc.encode(env.PASSWORD_PEPPER),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode('tfb-usage-v1:'+value))),x=>x.toString(16).padStart(2,'0')).join('');}
export async function cleanUsage(env,now=Date.now()){
 const day=usageDay(now),month=day.slice(0,7),cutoff=usageDay(now-400*86400000);
 await env.DB.batch([env.DB.prepare('DELETE FROM usage_events WHERE expires<=?').bind(now),env.DB.prepare('DELETE FROM usage_uniques WHERE period NOT IN (?,?)').bind(day,month),env.DB.prepare('DELETE FROM usage_pages WHERE day<?').bind(cutoff),env.DB.prepare('DELETE FROM usage_totals WHERE length(period)=10 AND period<?').bind(cutoff),env.DB.prepare('DELETE FROM usage_totals WHERE length(period)=7 AND period<?').bind(cutoff.slice(0,7))]);
}
export async function collectUsage(env,data,member=null,now=Date.now()){
 if(member?.is_admin)return {ok:true,ignored:true};
 if(!data||Object.keys(data).some(k=>!['id','visitor','visit','page','app','consent'].includes(k))||data.consent!==true||![data.id,data.visitor,data.visit].every(uuid)||!PAGES.has(data.page)||typeof data.app!=='boolean')bad('Ungültiges Statistikereignis.');
 const day=usageDay(now),month=day.slice(0,7),claim=crypto.randomUUID(),id=await key(env,'event:'+data.id);
 const guard='EXISTS(SELECT 1 FROM usage_events WHERE id=? AND claim=?)';
 const queries=[env.DB.prepare('DELETE FROM usage_events WHERE expires<=?').bind(now),env.DB.prepare('DELETE FROM usage_uniques WHERE period NOT IN (?,?)').bind(day,month),env.DB.prepare('INSERT OR IGNORE INTO usage_events(id,claim,expires) VALUES (?,?,?)').bind(id,claim,now+86400000)];
 for(const period of [day,month]){
  queries.push(env.DB.prepare(`INSERT INTO usage_totals(period,views,app_views) SELECT ?,1,? WHERE ${guard} ON CONFLICT(period) DO UPDATE SET views=views+1,app_views=app_views+excluded.app_views`).bind(period,Number(data.app),id,claim));
  const identities=[['visitors',data.visitor],['visits',data.visit],...(member?[['members',member.id]]:[])];
  for(const [kind,value]of identities)queries.push(env.DB.prepare(`INSERT OR IGNORE INTO usage_uniques(period,kind,key) SELECT ?,?,? WHERE ${guard}`).bind(period,kind,await key(env,`${period}:${kind}:${value}`),id,claim));
 }
 queries.push(env.DB.prepare(`INSERT INTO usage_pages(day,page,views) SELECT ?,?,1 WHERE ${guard} ON CONFLICT(day,page) DO UPDATE SET views=views+1`).bind(day,data.page,id,claim),env.DB.prepare(`INSERT OR IGNORE INTO usage_meta(key,value) SELECT 'started',? WHERE ${guard}`).bind(new Date(now).toISOString(),id,claim));
 await env.DB.batch(queries);return {ok:true};
}
const zero=()=>({views:0,visitors:0,visits:0,members:0,app_views:0});
export async function usageReport(env,month,now=Date.now()){
 const today=usageDay(now),current=today.slice(0,7);month=month||current;
 if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month)||month>current||month<'2026-11')bad('Bitte einen verfügbaren Monat wählen.');
 const prevDate=new Date(`${month}-15T12:00:00Z`);prevDate.setUTCMonth(prevDate.getUTCMonth()-1);const previous=prevDate.toISOString().slice(0,7);
 const endDay=month===current?Number(today.slice(-2)):new Date(Number(month.slice(0,4)),Number(month.slice(5)),0).getDate();
 const rows=(await env.DB.prepare("SELECT * FROM usage_totals WHERE length(period)=10 AND (period LIKE ? OR period LIKE ?) ORDER BY period").bind(month+'-%',previous+'-%').all()).results;
 const aggregate=await env.DB.prepare('SELECT * FROM usage_totals WHERE period=?').bind(month).first();
 const previousThrough=rows.filter(r=>r.period.startsWith(previous)&&Number(r.period.slice(-2))<=endDay).reduce((n,r)=>n+r.views,0);
 const started=(await env.DB.prepare("SELECT value FROM usage_meta WHERE key='enabled_at'").first())?.value||null;
 const startDay=started?usageDay(Date.parse(started)):null;
 const previousEnd=`${previous}-${String(Math.min(endDay,new Date(Number(previous.slice(0,4)),Number(previous.slice(5)),0).getDate())).padStart(2,'0')}`;
 const days=Array.from({length:endDay},(_,i)=>{const period=`${month}-${String(i+1).padStart(2,'0')}`;return {period,available:!!startDay&&period>=startDay,...(rows.find(r=>r.period===period)||zero())};});
 const pages=(await env.DB.prepare('SELECT page,SUM(views) AS views FROM usage_pages WHERE day LIKE ? GROUP BY page ORDER BY views DESC,page').bind(month+'-%').all()).results;
 return {enabled:env.USAGE_MEASUREMENT_ENABLED==='1',timeZone:'Europe/Berlin',startedAt:started,generatedAt:new Date(now).toISOString(),month,today,currentMonth:current,monthTotals:aggregate||zero(),todayTotals:rows.find(r=>r.period===today)||zero(),days,pages,comparison:{previousMonth:previous,through:previousEnd,views:previousThrough,available:!!startDay&&startDay<=previous+'-01'&&previousEnd<today},definition:'Nur freiwillig freigegebene Nutzung. Besucher sind Browser mit monatlich wechselnder Zufallskennung, keine eindeutig identifizierten Personen. Besuche enden nach 30 Minuten ohne Aktivität. Durchschnitt: Aufrufe geteilt durch Besuche desselben Zeitraums. Ein Besuch über Mitternacht zählt an beiden Tagen, im Monat einmal. Monatswechsel beginnt eine neue Kennung. Mitglieder werden nur mit gültiger Anmeldung und ohne Admins gezählt. Keine Namen, E-Mails, IP-Adressen oder Klickverläufe in der Statistik. Browserkennungen und Besuchszuordnungen nur für den laufenden Monat/Tag, Wiederholungsschutz 24 Stunden; Tageswerte 400 Tage, Monatssummen bis zu 14 Monate.'};
}
