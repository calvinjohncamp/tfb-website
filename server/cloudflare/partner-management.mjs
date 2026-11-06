const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const txt=(s,max=200)=>{if(typeof s!=='string'||s.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))fail(400,'Bitte die Textangaben prüfen.');return s.trim();};
const validId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
const rotationDefaults={premium:3,partner:3,regional:1};
const validWeight=weight=>Number.isInteger(weight)&&weight>=1&&weight<=12;
const rotationWeights=rotation=>Object.fromEntries(Object.entries(rotationDefaults)
  .map(([tier,weight])=>[tier,validWeight(rotation?.[tier])?rotation[tier]:weight]));

async function partnerSettings(env){
 const setting=await env.DB.prepare('SELECT revision,payload FROM tfb_partner_settings WHERE id=1').first();
 if(!setting)fail(503,'Die Partnerpflege wird eingerichtet.');
 const {rotation,...splash}=JSON.parse(setting.payload);
 return {revision:setting.revision,splash,rotation:rotationWeights(rotation)};
}
function safeUrl(value){const s=txt(value||'',1000);if(!s)return '';let u;try{u=new URL(s);}catch{fail(400,'Die Website-Adresse ist ungültig.');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)fail(400,'Bitte eine öffentliche Website-Adresse verwenden.');return u.href;}
function readPartner(value,id,previous){
 if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'Partnerangaben fehlen.');
 const tier=value.tier??previous?.tier??(id==='bmw-kaltenbach-gruppe'?'premium':'regional');
 if(typeof tier!=='string'||!Object.hasOwn(rotationDefaults,tier))fail(400,'Bitte eine Partnerstufe auswählen.');
 const p={name:txt(value.name,160),company:txt(value.company||'',200),tier,active:true,
   url:safeUrl(value.url),contactName:txt(value.contactName||'',160),contactEmail:txt(value.contactEmail||'',160),contactPhone:txt(value.contactPhone||'',80),
   street:txt(value.street||'',200),postalCode:txt(value.postalCode||'',24),city:txt(value.city||'',100),
   annualCents:tier==='regional'?30000:(previous?.annualCents??0),sort:previous?.sort??0,logo:previous?.logo||''};
 if(!p.name)fail(400,'Bitte einen Partnernamen angeben.');
 if(p.contactEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contactEmail))fail(400,'Bitte die Kontakt-E-Mail prüfen.');
 if(p.logo&&!/^assets\/partners\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/i.test(p.logo))fail(400,'Bitte ein Logo über die Dateiauswahl hochladen.');
 return p;
}
const logoUrl=(row,base)=>row.uploaded?`${base}/public/partner-logo/${row.id}?v=${row.revision}`:JSON.parse(row.payload).logo;
export async function publicPartnerContent(env,base){
 const rows=(await env.DB.prepare('SELECT id,revision,payload,(logo_data IS NOT NULL) AS uploaded FROM tfb_partners ORDER BY json_extract(payload,\'$.sort\'),id').all()).results;
 return {...await partnerSettings(env),partners:rows.filter(r=>JSON.parse(r.payload).active).map(r=>{const p=JSON.parse(r.payload);return {id:r.id,name:p.name,tier:p.tier,sort:p.sort,logo:logoUrl(r,base),url:p.url};}),measurementEnabled:false,plannedStart:'2027-01-01'};
}
export async function adminPartnerContent(env,base){
 const rows=(await env.DB.prepare("SELECT id,revision,payload,(logo_data IS NOT NULL) AS uploaded FROM tfb_partners ORDER BY CASE json_extract(payload,'$.tier') WHEN 'premium' THEN 0 WHEN 'partner' THEN 1 ELSE 2 END,json_extract(payload,'$.name') COLLATE NOCASE,id").all()).results;
 const {revision,rotation}=await partnerSettings(env);
 return {revision,rotation,partners:rows.map(r=>{
   const {name,company,tier,url,contactName,contactEmail,contactPhone,street,postalCode,city}=JSON.parse(r.payload);
   return {id:r.id,revision:r.revision,logoPreview:logoUrl(r,base),name,company,tier,url,contactName,contactEmail,contactPhone,street,postalCode,city};
 })};
}
export async function savePartner(env,data){
 if(!validId(data.id)||!Number.isSafeInteger(data.revision)||data.revision<0)fail(400,'Ungültiger Partner.');
 const old=await env.DB.prepare('SELECT revision,payload,(logo_data IS NOT NULL) AS uploaded FROM tfb_partners WHERE id=?').bind(data.id).first();
 if((old?.revision||0)!==data.revision)fail(409,'Der Partner wurde inzwischen geändert. Bitte neu laden.');
 const p=readPartner(data.partner,data.id,old&&JSON.parse(old.payload));
 let logo=null,replace=false;
 if(data.logoData!==undefined){replace=true;logo=data.logoData;
  if(logo!==null&&(typeof logo!=='string'||logo.length>400000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(logo)))fail(400,'Das Logo muss PNG, JPEG oder WebP sein und unter 300 KB bleiben.');
  if(logo){const mime=logo.slice(5,logo.indexOf(';')),raw=atob(logo.split(',')[1]);const signature=mime==='image/png'?raw.startsWith('\x89PNG\r\n\x1a\n'):mime==='image/jpeg'?raw.startsWith('\xff\xd8\xff'):raw.startsWith('RIFF')&&raw.slice(8,12)==='WEBP';if(!signature)fail(400,'Die Logodatei ist ungültig.');}
 }
 if(!p.logo&&!(replace?logo:old?.uploaded))fail(400,'Ein sichtbarer Partner benötigt ein Logo.');
 const now=new Date().toISOString();
 let row;
 try {
   row=old
     ? await env.DB.prepare('UPDATE tfb_partners SET payload=?,logo_data=CASE WHEN ? THEN ? ELSE logo_data END,revision=revision+1,updated_at=? WHERE id=? AND revision=? RETURNING revision').bind(JSON.stringify(p),replace?1:0,logo,now,data.id,data.revision).first()
     : await env.DB.prepare('INSERT INTO tfb_partners(id,payload,logo_data,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO NOTHING RETURNING revision').bind(data.id,JSON.stringify(p),logo,now).first();
 } catch(error) {
   if(String(error.message).includes('Maximal zwei'))fail(400,'Bitte höchstens zwei Premium-Partner pflegen.');
   throw error;
 }
 if(!row)fail(409,'Der Partner wurde inzwischen geändert. Bitte neu laden.');return {ok:true,id:data.id,revision:row.revision};
}
export async function savePartnerSettings(env,data){
 const fields={headline:60,accent:60,description:350,entry:60,foot:120,partnerLabel:120},s=data.splash||{},clean={enabled:s.enabled};
 if(typeof s.enabled!=='boolean'||!Number.isSafeInteger(data.revision))fail(400,'Ungültige Einstiegsseite.');
 const previous=await env.DB.prepare('SELECT payload FROM tfb_partner_settings WHERE id=1').first();
 const old=previous?JSON.parse(previous.payload):{};
 clean.eyebrowEnabled=s.eyebrowEnabled===undefined?old.eyebrowEnabled!==false:s.eyebrowEnabled;
 if(typeof clean.eyebrowEnabled!=='boolean')fail(400,'Bitte die Anzeige der kleinen Zeile prüfen.');
 clean.footEnabled=s.footEnabled===undefined?old.footEnabled!==false:s.footEnabled;
 if(typeof clean.footEnabled!=='boolean')fail(400,'Bitte die Anzeige der Zeile unter dem Button prüfen.');
 clean.eyebrowText=txt(s.eyebrowText===undefined?(old.eyebrowText??'Tennisfreunde Bielstein'):s.eyebrowText,120);
 for(const [key,max] of Object.entries(fields)){clean[key]=txt(s[key],max);if(!clean[key]&&key!=='description'&&key!=='foot')fail(400,'Bitte die Texte vervollständigen.');}
 const row=await env.DB.prepare('UPDATE tfb_partner_settings SET payload=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=? RETURNING revision').bind(JSON.stringify({...clean,rotation:rotationWeights(old.rotation)}),new Date().toISOString(),data.revision).first();
 if(!row)fail(409,'Die Texte wurden inzwischen geändert. Bitte die Einstiegsseite neu laden.');return {revision:row.revision,splash:clean};
}
export async function savePartnerRotation(env,data){
 const {rotation,revision}=data;
 if(!Number.isSafeInteger(revision)||!Object.keys(rotationDefaults).every(tier=>validWeight(rotation?.[tier])))
   fail(400,'Bitte je Stufe ein Gewicht von 1 bis 12 eintragen.');
 const weights=rotationWeights(rotation);
 const row=await env.DB.prepare("UPDATE tfb_partner_settings SET payload=json_set(payload,'$.rotation',json(?)),revision=revision+1,updated_at=? WHERE id=1 AND revision=? RETURNING revision")
   .bind(JSON.stringify(weights),new Date().toISOString(),revision).first();
 if(!row)fail(409,'Die Einstellungen wurden inzwischen geändert. Bitte neu laden.');
 return {revision:row.revision,rotation:weights};
}
export async function removePartner(env,data){
 if(!validId(data.id)||!Number.isSafeInteger(data.revision)||data.revision<1)fail(400,'Ungültiger Partner.');
 const [,removed]=await env.DB.batch([
   env.DB.prepare('DELETE FROM tfb_partner_payments WHERE partner_id=? AND EXISTS (SELECT 1 FROM tfb_partners WHERE id=? AND revision=?)').bind(data.id,data.id,data.revision),
   env.DB.prepare('DELETE FROM tfb_partners WHERE id=? AND revision=?').bind(data.id,data.revision)
 ]);
 if(!removed.meta.changes)fail(409,'Der Partner wurde inzwischen geändert oder entfernt. Bitte neu laden.');
 return {ok:true};
}
export async function partnerLogo(env,id){
 if(!validId(id))fail(404,'Logo nicht gefunden.');const row=await env.DB.prepare('SELECT logo_data,payload FROM tfb_partners WHERE id=?').bind(id).first();
 if(!row?.logo_data)fail(404,'Logo nicht gefunden.');
 const [head,body]=row.logo_data.split(',');return new Response(Uint8Array.from(atob(body),c=>c.charCodeAt(0)),{headers:{'Content-Type':head.slice(5,head.indexOf(';')),'Content-Security-Policy':"default-src 'none'"}});
}
