// Anonymous counters only: no member IDs, URL parameters, IPs or visitor profiles.
import partners from './partner-catalog.json';

export const PAGES = ['splash','home','home-detail','home-fotos','home-alle','aktuell','aktuell-detail','aktuell-alle','chat','chat-detail','sport','sport-training','team','club','club-detail','treffen','treffen-detail','kiosk','strichliste','abrechnungen','impressum','satzung'];
const kinds = ['pageview','partner_view','display','visible','click'];
const catalog = new Map(partners.map(p => [p.id,p]));
const bad = message => { throw Object.assign(Error(message),{status:400}); };
export const berlinDay = (date = new Date()) => new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);

export function validateEvents(data, knownPartners=catalog) {
  if (!Array.isArray(data.events) || !data.events.length || data.events.length > 25) bad('Bitte 1 bis 25 Zählereignisse senden.');
  return data.events.map(e => {
    if (!e || typeof e !== 'object' || Object.keys(e).some(k=>!['id','page','kind','partner','slot'].includes(k))) bad('Ungültiges Zählereignis.');
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(e.id) || !PAGES.includes(e.page) || !kinds.includes(e.kind)) bad('Ungültiges Zählereignis.');
    if (e.kind === 'pageview' || e.kind === 'partner_view') {
      if (e.partner || e.slot) bad('Seitenaufrufe haben keinen Partnerplatz.');
      if(e.kind==='partner_view'&&['impressum','satzung'].includes(e.page))bad('Diese Seite hat keine Partnerfläche.');
      return {...e,partner:'',slot:''};
    }
    if (!knownPartners.has(e.partner) || !['left','right'].includes(e.slot) || ['impressum','satzung'].includes(e.page)) bad('Ungültiger Partnerplatz.');
    if (e.page==='splash' && knownPartners.get(e.partner).tier!=='premium') bad('Auf der Einstiegsseite stehen Premium-Partner.');
    return e;
  });
}

async function currentPartners(env){return (await env.DB.prepare('SELECT id,payload FROM tfb_partners ORDER BY id').all()).results.map(r=>{const p=JSON.parse(r.payload);return {id:r.id,name:p.name,tier:p.tier};});}
export async function collectVisibility(env, data) {
  const current=await currentPartners(env);
  const events=validateEvents(data,new Map(current.map(p=>[p.id,p]))), now=Date.now(), day=berlinDay(new Date(now));
  // A trigger increments daily totals only for newly inserted IDs. The batch is atomic.
  await env.DB.batch([
    env.DB.prepare('DELETE FROM partner_events WHERE expires_at<=?').bind(now),
    ...events.map(e=>env.DB.prepare(`INSERT OR IGNORE INTO partner_events(id,source,day,page,partner,slot,kind,expires_at)
      VALUES (?,'tfb',?,?,?,?,?,?)`).bind(e.id,day,e.page,e.partner,e.slot,e.kind,now+2*86400000)),
    env.DB.prepare("INSERT OR IGNORE INTO partner_meta(key,value) VALUES ('measurement_started',?)").bind(new Date(now).toISOString()),
  ]);
  return {ok:true};
}

export async function visibilityReport(env, year) {
  const current=Number(berlinDay().slice(0,4));
  if (!/^\d{4}$/.test(String(year)) || Number(year)<2026 || Number(year)>current) bad('Bitte ein gültiges Jahr wählen.');
  const start=`${year}-01-01`, end=`${Number(year)+1}-01-01`;
  const rows=(await env.DB.prepare(`SELECT day,page,partner,slot,kind,SUM(total) AS total FROM partner_daily
    WHERE source='tfb' AND day>=? AND day<? GROUP BY day,page,partner,slot,kind ORDER BY day,page,partner,slot,kind`).bind(start,end).all()).results;
  const started=await env.DB.prepare("SELECT value FROM partner_meta WHERE key='measurement_started'").first();
  return {source:'tfb',year:Number(year),timeZone:'Europe/Berlin',startedAt:started?.value||null,
    through:year==current?berlinDay():`${year}-12-31`,generatedAt:new Date().toISOString(),
    definition:'Sichtkontakt: mindestens 50 % des Logos für eine Sekunde im aktiven Tab; je Aufruf und Partnerplatz einmal.',
    measurementVersion:1,rotationVersion:'tfb-equal-v1',partners:await currentPartners(env),rows};
}
