// One-time, idempotent catalog setup. Never touches purchases or overrides a later rental price.
export function prepareLibraryCatalog(input){const c=structuredClone(input);if(c.products.some(p=>p.id==='padel-schlaeger-verleih'))return c;const old=c.products.find(p=>p.id==='padel-schlaeger');if(old){old.active=false;old.archived=true;}if(!c.sections.some(s=>s.id==='verleih'))c.sections.push({id:'verleih',title:'Verleih',note:'Ausrüstung für dein Match',status:'open'});c.products.push({id:'padel-schlaeger-verleih',section:'verleih',name:'Padelschläger – Verleih',detail:'Leihschläger für dein Match',price:400,unit:'Stunde',kind:'rental',active:true,archived:false,art:'padel',color:'#C4553A'});return c;}
export function librarySetupSql(rows,now=new Date().toISOString(),id=crypto.randomUUID()){
 if(!rows.length)throw Error('Bestehender Katalog fehlt; Einrichtung abgebrochen.');
 const current=rows[0],old=JSON.parse(rows.map(r=>r.data).join('')),next=prepareLibraryCatalog(old);if(JSON.stringify(old)===JSON.stringify(next))return null;
 const q=x=>"'"+String(x).replaceAll("'","''")+"'",payload='library-'+id,guard=`EXISTS(SELECT 1 FROM app_records WHERE kind='catalog' AND id='club' AND revision=${Number(current.revision)} AND payload_id=${q(current.payload_id)})`;
 return `INSERT INTO app_payloads(payload_id,part,data) SELECT ${q(payload)},0,${q(JSON.stringify(next))} WHERE ${guard};
INSERT INTO kiosk_catalog_history(id,actor_id,created_at,payload) SELECT ${q(payload+':before')},'system',${q(now)},${q(JSON.stringify(old))} WHERE ${guard} AND EXISTS(SELECT 1 FROM app_payloads WHERE payload_id=${q(payload)});
UPDATE app_records SET payload_id=${q(payload)},revision=revision+1,updated_at=${Date.parse(now)} WHERE kind='catalog' AND id='club' AND revision=${Number(current.revision)} AND payload_id=${q(current.payload_id)} AND EXISTS(SELECT 1 FROM app_payloads WHERE payload_id=${q(payload)});
INSERT INTO kiosk_catalog_history(id,actor_id,created_at,payload) SELECT ${q(payload+':after')},'system',${q(now)},${q(JSON.stringify(next))} WHERE EXISTS(SELECT 1 FROM app_records WHERE kind='catalog' AND id='club' AND payload_id=${q(payload)});
DELETE FROM app_payloads WHERE payload_id=${q(current.payload_id)} AND NOT EXISTS(SELECT 1 FROM app_records WHERE payload_id=${q(current.payload_id)});`;
}
