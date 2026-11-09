// Shared calendar and tally rules; used by the TFB worker and the Padel endpoint.
export const berlinDay=value=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date(value));
export function tallyWindow(now=new Date(),days=7){const to=berlinDay(now),start=new Date(to+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-(days-1));return{from:start.toISOString().slice(0,10),to};}
export function tallyCategory(entry){
 const section=String(entry.sectionId||'').toLowerCase(),text=[entry.sectionName,entry.productName].filter(Boolean).join(' ').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
 if(/kranz/.test(text))return'kranz';
 if(['snacks','spezialitaeten'].includes(section)||/snack|starkung|wurst|grillfleisch/.test(text))return'snacks';
 if(section==='spielbetrieb')return'spielbetrieb';
 if(['shop','equipment'].includes(section)||entry.kind==='rental'||/ausrustung|equipment/.test(text))return'equipment';
 return'drinks';
}
export function tallyRows(entries,ownId,now=new Date()){
 const period=tallyWindow(now),people=new Map();
 for(const entry of entries){const day=berlinDay(entry.createdAt);if(entry.netCents<=0||day<period.from||day>period.to)continue;
  let row=people.get(entry.memberId);if(!row){row={firstName:entry.firstName||'',lastName:entry.lastName||'',isMe:entry.memberId===ownId,cats:{drinks:0,kranz:0,snacks:0,spielbetrieb:0,equipment:0},counts:{},total:0};people.set(entry.memberId,row);}
  const quantity=entry.quantity||1;row.cats[tallyCategory(entry)]+=quantity;row.counts[entry.productName]=(row.counts[entry.productName]||0)+quantity;row.total+=quantity;
 }
 return [...people.values()].sort((a,b)=>a.lastName.localeCompare(b.lastName,'de')||a.firstName.localeCompare(b.firstName,'de'));
}
