// Read-only exports reuse bounded monthly reports; no annual transaction list is rendered.
const lastDay=m=>new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5)),0)).toISOString().slice(0,10);
export function exportPlan({kind,year,month=null,today}){
 if(!/^20\d{2}$/.test(year)||!/^20\d{2}-\d{2}-\d{2}$/.test(today)||year>today.slice(0,4))throw Error('Bitte ein begonnenes Jahr wählen.');
 if(month&&(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month)||month.slice(0,4)!==year))throw Error('Monat und Jahr passen nicht zusammen.');
 let from=year+'-01-01',to;
 if(kind==='month'){if(!month||month>today.slice(0,7))throw Error('Bitte zuerst einen begonnenen Monat auswählen.');from=month+'-01';to=lastDay(month);}
 else if(kind==='cumulative')to=month?lastDay(month):year+'-12-31';
 else if(kind==='closing'){to=year+'-12-31';if(today<String(Number(year)+1)+'-01-01')throw Error('Der Jahresabschluss ist ab dem 01.01.'+(Number(year)+1)+' verfügbar.');}
 else throw Error('Unbekannter Export.');
 if(to>today)to=today;
 const months=[];for(let n=Number(from.slice(5,7));n<=Number(to.slice(5,7));n++)months.push(year+'-'+String(n).padStart(2,'0'));
 return {kind,year,from,to,months};
}
export async function collectExport(plan,fetchMonth){
 const entries=[];
 for(let i=0;i<plan.months.length;i+=2){const reports=await Promise.all(plan.months.slice(i,i+2).map(fetchMonth));for(const report of reports)for(const e of report.entries)if(e.day>=plan.from&&e.day<=plan.to)entries.push(e);}
 return [...new Map(entries.map(e=>[e.id,e])).values()].sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)||String(a.id).localeCompare(String(b.id)));
}
const cell=x=>'"'+String(x??'').replace(/^[\s]*[=+@-]/,"'$&").replace(/"/g,'""')+'"';
const euro=n=>(n/100).toFixed(2).replace('.',',');
export function exportCsv(entries,{plan,generatedAt,scopeLabel='Alle Mitglieder'}){
 const headers=['Art','Buchungsnummer','Mitglied','Zeitpunkt UTC','Artikel','Einheit','Ursprünglich EUR','Korrektur EUR','Vorführbetrag EUR','Grund','Erfasst von','Quelle','Export','Zeitraum von','Zeitraum bis','Datenstand UTC'];
 const events=[];
 for(const e of entries){events.push({at:e.created_at,id:e.id,row:['Buchung',e.id,e.display_name,e.created_at,e.product_name,e.unit,euro(e.price_cents),'',euro(e.net_cents),'Vorführbetrieb',e.display_name,e.basis]});for(const a of e.adjustments)events.push({at:a.created_at,id:a.id,row:['Korrektur zu '+e.id,a.id,e.display_name,a.created_at,e.product_name,e.unit,'',euro(a.amount_cents),'',a.reason,a.actor_name||a.actor_id,a.source]});}
 events.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)||String(a.id).localeCompare(String(b.id)));
 const rows=[headers,...events.map(e=>[...e.row,plan.kind,plan.from,plan.to,generatedAt])];
 if(plan.kind==='closing'){
  const dates=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}),totals=Array(12).fill(0);
  for(const e of entries){const d=e.day||dates.format(new Date(e.created_at));if(d.slice(0,4)===plan.year)totals[Number(d.slice(5,7))-1]+=e.net_cents;}
  rows.unshift(['Jahresabschluss '+plan.year],['Auswahl',scopeLabel],['Datenstand UTC',generatedAt],['Monat','Vorführbetrag EUR'],...totals.map((value,i)=>[new Date(Date.UTC(Number(plan.year),i,15)).toLocaleDateString('de-DE',{month:'long',timeZone:'Europe/Berlin'}),euro(value)]),['Jahressumme',euro(totals.reduce((sum,n)=>sum+n,0))],[],['Einzelbuchungen']);
 }
 return '\ufeff'+rows.map(r=>r.map(cell).join(';')).join('\r\n');
}
