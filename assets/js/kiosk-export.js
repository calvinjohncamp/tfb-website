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
const localDate=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric'});
const localTime=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
const calendarDay=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'});
const chronological=(a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)||String(a.id).localeCompare(String(b.id));
const date=d=>localDate.format(new Date(d));
const time=d=>localTime.format(new Date(d));
export function exportCsv(entries,{plan,generatedAt,scopeLabel='Alle Mitglieder'}){
 const labels={month:'Monatsabrechnung',cumulative:'Jahr kumuliert',closing:'Jahresabschluss'};
 const headers=['Buchungsnummer','Mitglied','Datum','Uhrzeit','Artikel','Einheit','Buchungsbetrag (EUR)','Rücknahmen/Korrekturen (EUR)','Abrechnungsbetrag (EUR)'];
 const sorted=[...entries].sort(chronological),total=sorted.reduce((sum,e)=>sum+e.net_cents,0);
 const rows=[['TFB Kiosk '+labels[plan.kind]+' '+plan.year],['Auswahl',scopeLabel],['Zeitraum',date(plan.from+'T12:00:00Z')+' bis '+date(plan.to+'T12:00:00Z')],['Erstellt am',date(generatedAt),time(generatedAt)],['Alle Uhrzeiten: deutsche Ortszeit (einschließlich Sommer-/Winterzeit).']];
 if(plan.kind==='closing'){
  const totals=Array(12).fill(0);
  for(const e of sorted){const d=e.day||calendarDay.format(new Date(e.created_at));if(d.slice(0,4)===plan.year)totals[Number(d.slice(5,7))-1]+=e.net_cents;}
  rows.push([],['Monatsübersicht'],['Monat','Abrechnungsbetrag (EUR)'],...totals.map((value,i)=>[new Date(Date.UTC(Number(plan.year),i,15)).toLocaleDateString('de-DE',{month:'long',timeZone:'Europe/Berlin'}),euro(value)]),['Jahressumme',euro(totals.reduce((sum,n)=>sum+n,0))]);
 }
 rows.push([],['Einzelbuchungen'],['Abrechnungsbetrag = Buchungsbetrag minus Rücknahmen/Korrekturen.'],headers);
 for(const e of sorted)rows.push([e.id,e.display_name,date(e.created_at),time(e.created_at),e.product_name,e.unit,euro(e.price_cents),euro(e.price_cents-e.net_cents),euro(e.net_cents)]);
 rows.push(['Gesamter Abrechnungsbetrag','','','','','','','',euro(total)]);
 const corrections=sorted.flatMap(e=>e.adjustments.map(a=>({...a,booking:e}))).sort(chronological);
 rows.push([],['Rücknahmen und Korrekturen'],['Die folgenden Beträge sind in den Abrechnungsbeträgen oben bereits berücksichtigt. Nicht erneut abziehen.']);
 if(corrections.length){
  rows.push(['Zu Buchungsnummer','Mitglied','Datum','Uhrzeit','Artikel','Art','Korrekturbetrag (EUR)','Begründung','Bearbeitet von']);
  for(const a of corrections)rows.push([a.booking.id,a.booking.display_name,date(a.created_at),time(a.created_at),a.booking.product_name,a.source==='undo'?'Stornierung':'Korrektur',euro(a.amount_cents),a.reason,a.actor_name||'Frühere Verwaltung']);
 }else rows.push(['Keine Rücknahmen oder Korrekturen im ausgewählten Zeitraum.']);
 // Nine columns throughout; ordinary text is protected against spreadsheet formulas.
 return '\ufeff'+rows.map(r=>Array.from({length:headers.length},(_,i)=>r[i]??'').map(cell).join(';')).join('\r\n');
}
