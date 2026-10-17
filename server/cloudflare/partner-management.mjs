const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const txt=(s,max=200)=>{if(typeof s!=='string'||s.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))fail(400,'Bitte die Textangaben prüfen.');return s.trim();};
const validId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
const euroCents=n=>{if(!Number.isSafeInteger(n)||n<0||n>100000000)fail(400,'Bitte einen gültigen Betrag eingeben.');return n;};
const isoDay=value=>{const s=txt(value,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s+'T12:00:00Z'))||new Date(s+'T12:00:00Z').toISOString().slice(0,10)!==s)fail(400,'Bitte ein gültiges Zahlungsdatum eingeben.');return s;};
function safeUrl(value){const s=txt(value||'',1000);if(!s)return '';let u;try{u=new URL(s);}catch{fail(400,'Die Website-Adresse ist ungültig.');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)fail(400,'Bitte eine öffentliche Website-Adresse verwenden.');return u.href;}
function readPartner(value){
 if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'Partnerangaben fehlen.');
 const p={name:txt(value.name,160),company:txt(value.company||'',200),tier:value.tier,active:value.active,sample:value.sample,
   url:safeUrl(value.url),contactName:txt(value.contactName||'',160),contactEmail:txt(value.contactEmail||'',160),contactPhone:txt(value.contactPhone||'',80),
   street:txt(value.street||'',200),postalCode:txt(value.postalCode||'',24),city:txt(value.city||'',100),status:value.status,
   annualCents:euroCents(value.annualCents),note:txt(value.note||'',2000),sort:value.sort,logo:txt(value.logo||'',300)};
 if(!p.name||!['premium','partner'].includes(p.tier)||typeof p.active!=='boolean'||typeof p.sample!=='boolean'||!['draft','verbal','contract'].includes(p.status)||!Number.isSafeInteger(p.sort)||Math.abs(p.sort)>1000000)fail(400,'Bitte Partnername, Art und Vertragsstand prüfen.');
 if(p.contactEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contactEmail))fail(400,'Bitte die Kontakt-E-Mail prüfen.');
 if(p.logo&&!/^assets\/partners\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/i.test(p.logo))fail(400,'Bitte ein Logo über die Dateiauswahl hochladen.');
 return p;
}
const logoUrl=(row,base)=>row.uploaded?`${base}/public/partner-logo/${row.id}?v=${row.revision}`:JSON.parse(row.payload).logo;
export async function publicPartnerContent(env,base){
 const rows=(await env.DB.prepare('SELECT id,revision,payload,(logo_data IS NOT NULL) AS uploaded FROM tfb_partners ORDER BY json_extract(payload,\'$.sort\'),id').all()).results;
 const setting=await env.DB.prepare('SELECT revision,payload FROM tfb_partner_settings WHERE id=1').first();
 if(!setting)fail(503,'Die Partnerpflege wird eingerichtet.');
 return {revision:setting.revision,splash:JSON.parse(setting.payload),partners:rows.filter(r=>JSON.parse(r.payload).active).map(r=>{const p=JSON.parse(r.payload);return {id:r.id,name:p.name,tier:p.tier,sort:p.sort,logo:logoUrl(r,base),url:p.url};}),measurementEnabled:false,plannedStart:'2027-01-01'};
}
export async function adminPartnerContent(env,base,year){
 if(!/^\d{4}$/.test(String(year))||Number(year)<2026||Number(year)>2100)fail(400,'Bitte ein gültiges Jahr wählen.');
 const rows=(await env.DB.prepare('SELECT id,revision,payload,(logo_data IS NOT NULL) AS uploaded FROM tfb_partners ORDER BY json_extract(payload,\'$.sort\'),id').all()).results;
 const payments=(await env.DB.prepare('SELECT id,partner_id AS partnerId,year,amount_cents AS amountCents,paid_on AS paidOn,note,created_at AS createdAt FROM tfb_partner_payments WHERE year=? AND voided_at IS NULL ORDER BY paid_on DESC,created_at DESC').bind(Number(year)).all()).results;
 return {year:Number(year),partners:rows.map(r=>({...JSON.parse(r.payload),id:r.id,revision:r.revision,logoPreview:logoUrl(r,base)})),payments,measurement:{enabled:false,plannedStart:'2027-01-01'}};
}
export async function savePartner(env,data){
 if(!validId(data.id)||!Number.isSafeInteger(data.revision)||data.revision<0)fail(400,'Ungültiger Partner.');
 const p=readPartner(data.partner),old=await env.DB.prepare('SELECT revision,logo_data FROM tfb_partners WHERE id=?').bind(data.id).first();
 if((old?.revision||0)!==data.revision)fail(409,'Der Partner wurde inzwischen geändert. Bitte neu laden.');
 let logo=null,replace=false;
 if(data.logoData!==undefined){replace=true;logo=data.logoData;
  if(logo!==null&&(typeof logo!=='string'||logo.length>400000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(logo)))fail(400,'Das Logo muss PNG, JPEG oder WebP sein und unter 300 KB bleiben.');
  if(logo){const mime=logo.slice(5,logo.indexOf(';')),raw=atob(logo.split(',')[1]);const signature=mime==='image/png'?raw.startsWith('\x89PNG\r\n\x1a\n'):mime==='image/jpeg'?raw.startsWith('\xff\xd8\xff'):raw.startsWith('RIFF')&&raw.slice(8,12)==='WEBP';if(!signature)fail(400,'Die Logodatei ist ungültig.');}
 }
 if(p.active&&!p.logo&&!(replace?logo:old?.logo_data))fail(400,'Ein sichtbarer Partner benötigt ein Logo.');
 const now=new Date().toISOString();let row;
 try{row=old?await env.DB.prepare('UPDATE tfb_partners SET payload=?,logo_data=CASE WHEN ? THEN ? ELSE logo_data END,revision=revision+1,updated_at=? WHERE id=? AND revision=? RETURNING revision').bind(JSON.stringify(p),replace?1:0,logo,now,data.id,data.revision).first():await env.DB.prepare('INSERT INTO tfb_partners(id,payload,logo_data,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO NOTHING RETURNING revision').bind(data.id,JSON.stringify(p),logo,now).first();}
 catch(e){if(String(e.message).includes('Maximal zwei'))fail(400,'Es können höchstens zwei Premium-Partner auf der Einstiegsseite erscheinen.');throw e;}
 if(!row)fail(409,'Der Partner wurde inzwischen geändert. Bitte neu laden.');return {ok:true,id:data.id,revision:row.revision};
}
export async function savePartnerSettings(env,data){
 const fields={headline:60,accent:60,description:350,entry:60,foot:120,partnerLabel:120},s=data.splash||{},clean={enabled:s.enabled};
 if(typeof s.enabled!=='boolean'||!Number.isSafeInteger(data.revision))fail(400,'Ungültige Einstiegsseite.');
 for(const [key,max] of Object.entries(fields)){clean[key]=txt(s[key],max);if(!clean[key]&&key!=='description'&&key!=='foot')fail(400,'Bitte die Texte vervollständigen.');}
 const row=await env.DB.prepare('UPDATE tfb_partner_settings SET payload=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=? RETURNING revision').bind(JSON.stringify(clean),new Date().toISOString(),data.revision).first();
 if(!row)fail(409,'Die Texte wurden inzwischen geändert. Bitte die Einstiegsseite neu laden.');return {revision:row.revision,splash:clean};
}
export async function addPartnerPayment(env,data){
 if(!validId(data.id)||!validId(data.partnerId)||!Number.isInteger(data.year)||data.year<2026||data.year>2100||euroCents(data.amountCents)===0)fail(400,'Bitte Partner, Jahr und Zahlungsbetrag prüfen.');
 const paidOn=isoDay(data.paidOn),note=txt(data.note||'',500);
 const partner=await env.DB.prepare('SELECT payload FROM tfb_partners WHERE id=?').bind(data.partnerId).first();if(!partner)fail(404,'Partner nicht gefunden.');
 if(JSON.parse(partner.payload).sample)fail(400,'Bitte den Testpartner zuerst als echten TFB-Partner übernehmen.');
 const old=await env.DB.prepare('SELECT * FROM tfb_partner_payments WHERE id=?').bind(data.id).first();
 if(old){if(old.partner_id!==data.partnerId||old.year!==data.year||old.amount_cents!==data.amountCents||old.paid_on!==paidOn||old.note!==note)fail(409,'Diese Zahlung wurde bereits anders erfasst.');return {ok:true};}
 await env.DB.prepare('INSERT INTO tfb_partner_payments(id,partner_id,year,amount_cents,paid_on,note,created_at) VALUES (?,?,?,?,?,?,?)').bind(data.id,data.partnerId,data.year,data.amountCents,paidOn,note,new Date().toISOString()).run();return {ok:true};
}
export async function voidPartnerPayment(env,data){if(!validId(data.id))fail(400,'Ungültige Zahlung.');await env.DB.prepare('UPDATE tfb_partner_payments SET voided_at=? WHERE id=? AND voided_at IS NULL').bind(new Date().toISOString(),data.id).run();return {ok:true};}
export async function partnerLogo(env,id){
 if(!validId(id))fail(404,'Logo nicht gefunden.');const row=await env.DB.prepare('SELECT logo_data,payload FROM tfb_partners WHERE id=?').bind(id).first();
 if(!row?.logo_data)fail(404,'Logo nicht gefunden.');
 const [head,body]=row.logo_data.split(',');return new Response(Uint8Array.from(atob(body),c=>c.charCodeAt(0)),{headers:{'Content-Type':head.slice(5,head.indexOf(';')),'Content-Security-Policy':"default-src 'none'"}});
}
