// Central website content only. Authentication/business data keep their own APIs.
(function(){
 const cfg=TFB.config.memberDirectory;
 if(location.protocol!=='https:'||!cfg?.hosts.includes(location.hostname)||!TFB.directoryCall)return;
 const api=TFB.api,call=TFB.directoryCall,base=cfg.url.replace(/\/$/,''),cacheKey='tfb_editorial_public_v1';
 const local={site:api.site.bind(api),images:api.images.bind(api),setPhotoFrame:api.setPhotoFrame.bind(api)};
 const clone=x=>JSON.parse(JSON.stringify(x)),ui=()=>TFB.ui,admin=()=>Boolean(ui()?.isAdmin());
 const pages=new Set(['home','aktuell','sport','verein','satzung','impressum']),globals=new Set(['version','teams','applied','chatText','homeLook','homeColorMode','nav','meetText','kioskActive','stories','photoFrames','focusStrip']);
 let state=null,privateState=null,pending=null,images={},busy=0,lastError='',lastCheck=0;
 const split=s=>{const docs={};for(const [k,v] of Object.entries(s)){if(k==='pages'){for(const [p,x] of Object.entries(v))if(pages.has(p))docs['page:'+p]=x;}else if(globals.has(k))docs['global:'+k]=v;}return docs;};
 const join=docs=>{const site={pages:{}};for(const [key,item] of Object.entries(docs)){if(key.startsWith('page:'))site.pages[key.slice(5)]=clone(item.value);else site[key.slice(7)]=clone(item.value);}return site;};
 const canonical=x=>Array.isArray(x)?x.map(v=>v===undefined?null:canonical(v)):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).filter(k=>x[k]!==undefined).sort().map(k=>[k,canonical(x[k])])):x;
 const stable=x=>JSON.stringify(canonical(x));
 const draftKey=()=> 'tfb_editorial_draft_'+(ui()?.state.member?.id||'admin');
 const readDraft=()=>{try{return JSON.parse(localStorage.getItem(draftKey())||'null');}catch{return null;}};
 const hash=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(typeof x==='string'?x:stable(x)))),b=>b.toString(16).padStart(2,'0')).join('');
 const photoUrl=ref=>base+'/public/site-media/'+encodeURIComponent(ref);
 // Warm only the first cover on the requested public page, before app rendering.
 const warmed=new Set();
 function warmCover(value){
  const page=location.hash.startsWith('#aktuell')?'aktuell':!location.hash||location.hash.startsWith('#home')?'home':null;
  const block=page&&value.documents['page:'+page]?.value?.blocks?.find(b=>b.mediaCollection&&!b._new);
  const ref=block?.mediaCollection?.entries?.[0]?.images?.[0];
  if(!ref||!/^img:cms-[a-f0-9]{64}$/.test(ref)||warmed.has(ref))return;
  warmed.add(ref);const img=new Image();img.fetchPriority='high';img.decoding='async';img.src=photoUrl(ref);
 }
 function apply(value,isPrivate=false){if(value?.format!=='tfb-editorial-state'||!value.documents?.['page:home'])throw Error('Die zentralen Seiteninhalte sind unvollständig.');
  if(isPrivate)privateState=value;else{lastError='';state=value;try{localStorage.setItem(cacheKey,JSON.stringify(value));}catch{}}
  if(!isPrivate)warmCover(value);
  images={...images,...Object.fromEntries(value.media.filter(m=>!isPrivate||!images[m.ref]).map(m=>[m.ref,photoUrl(m.ref)]))};TFB.imageRevision=(TFB.imageRevision||0)+1;return value;
 }
 async function refresh(wantPrivate=false){if(wantPrivate)return apply(await call('/admin/site'),true);
  if(pending)return pending;pending=(async()=>{try{const response=await fetch(base+'/public/site',{cache:'no-store'});if(!response.ok)throw Error('Die zentrale Website ist gerade nicht erreichbar.');return apply(await response.json());}catch(e){if(!state){try{state=JSON.parse(localStorage.getItem(cacheKey));}catch{}}if(!state)throw e;images={...images,...Object.fromEntries((state.media||[]).map(m=>[m.ref,photoUrl(m.ref)]))};lastError='Offline-Ansicht: Der letzte bestätigte Stand wird angezeigt.';return state;}finally{pending=null;}})();return pending;}
 const ready=refresh().catch(e=>{lastError=e.message;return null;});
 api.site=async()=>{await ready;const value=admin()?await refresh(true):state||await refresh();if(!value)throw Error(lastError||'Website konnte nicht geladen werden.');const site=join(value.documents),fingerprints={};for(const [key,item] of Object.entries(value.documents))fingerprints[key]=await hash(item.value);site._cms={versions:Object.fromEntries(Object.entries(value.documents).map(([k,v])=>[k,v.revision])),fingerprints};return site;};
 let saves=Promise.resolve();
 api.saveSite=input=>{const site=clone(input);const run=async()=>{if(!admin())throw Error('Nur Admins dürfen die Website bearbeiten.');if(!site._cms)throw Error('Dieser Entwurf stammt noch aus der lokalen Bearbeitung. Bitte vor der Übernahme vollständig sichern.');
   const changes=[];for(const [key,value] of Object.entries(split(site)))if(await hash(value)!==site._cms.fingerprints[key])changes.push({key,expected:site._cms.versions[key]||0,value});
   if(!changes.length)return clone(site);try{localStorage.setItem(draftKey(),JSON.stringify({at:new Date().toISOString(),site}));}catch{throw Error('Der Entwurf konnte nicht gesichert werden. Bitte eine Sicherung herunterladen, bevor du weiterbearbeitest.');}busy++;try{await call('/admin/site/commit',{id:crypto.randomUUID(),changes});privateState=null;localStorage.removeItem(draftKey());await refresh();return await api.site();}catch(e){lastError=e.status===409?e.message:'Nicht veröffentlicht: '+e.message;throw Error(lastError);}finally{busy--;}};
  const next=saves.then(run,run);saves=next.catch(()=>{});return next;};
 api.images=async options=>{await ready;return {...await local.images(options),...images};};
 async function upload(data){if(!admin()&&!ui()?.state.member?.teams?.length)throw Error('Bitte mit einem zugeordneten Mannschaftskonto anmelden.');const result=await call(admin()?'/admin/site/media':'/app/team-media',{data});images[result.ref]=data;TFB.imageRevision=(TFB.imageRevision||0)+1;return result.ref;}
 api.putImage=upload;api.putFile=upload;
 async function saveTeamField(team,field,value,expectedSite){
  const site=expectedSite||await api.site();
  await call('/app/team-content',{id:crypto.randomUUID(),team,field,value,expected:site._cms.versions['global:teams']||0});
  privateState=null;await refresh();return api.site();
 }
 api.setTeamPhoto=(team,ref)=>saveTeamField(team,'photo',ref||null);
 api.setTeamPortrait=(team,portrait)=>saveTeamField(team,'portrait',portrait||{});
 api.saveTeamPosts=(team,posts,site)=>saveTeamField(team,'posts',posts,site);
 api.setPhotoFrame=async(ref,frame)=>{const site=await api.site();site.photoFrames={...site.photoFrames};if(frame===null)delete site.photoFrames[ref];else site.photoFrames[ref]=TFB.photoFrame.normalize(frame);return (await api.saveSite(site)).photoFrames;};
 api.boardPeople=async()=>{await ready;const source=ref=>images[ref]||ref;return clone((privateState&&admin()?privateState:state)?.boardPeople||[]).map(p=>({...p,avatar:source(p.avatar),avatarLarge:source(p.avatarLarge)}));};
 async function poll(){if(Date.now()-lastCheck<10000||busy||document.hidden||document.querySelector('#sheet-root.open,.editing-page,.editing-team'))return;lastCheck=Date.now();try{const r=await fetch(base+'/public/site-revision',{cache:'no-store'});if(r.ok&&(await r.json()).revision!==state?.revision){await refresh();await TFB.refreshSite?.(true);}}catch{/* Last confirmed content remains visible. */}}
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});setInterval(poll,15000);
 const esc=x=>ui().esc(x),labels={'page:home':'Home','page:aktuell':'Aktuell','page:sport':'Sport','page:verein':'Club','page:satzung':'Satzung','page:impressum':'Impressum','global:teams':'Mannschaftsinhalte','global:photoFrames':'Bildausschnitte','global:nav':'Navigation','global:meetText':'Dating-Texte','global:kioskActive':'Kiosk-Verfügbarkeit','global:homeLook':'Home-Layout','global:homeColorMode':'Home-Farben','global:stories':'Club-History','global:chatText':'Chat-Texte'};
 const stamp=()=>new Date().toISOString().slice(0,19).replaceAll(':','-');
 function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
 async function exported(id){return call('/admin/site/export'+(id?'?id='+encodeURIComponent(id):''));}
 async function exportZip(id){busy++;try{ui().toast('Sicherung wird vollständig zusammengestellt …');const manifest=await exported(id),files={};for(const media of manifest.media){
   const response=await TFB.directoryFetch('/admin/site/media/'+encodeURIComponent(media.ref));const bytes=new Uint8Array(await response.arrayBuffer());if(await crypto.subtle.digest('SHA-256',bytes).then(x=>Array.from(new Uint8Array(x),b=>b.toString(16).padStart(2,'0')).join(''))!==media.hash)throw Error('Eine Medien-Prüfsumme stimmt nicht.');files['medien/'+media.hash]=bytes;
  }if(manifest.release){const r=await TFB.directoryFetch('/admin/site/release?id='+encodeURIComponent(manifest.release.commit_id));const bytes=new Uint8Array(await r.arrayBuffer());const sum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(sum!==manifest.release.sha256)throw Error('Die Programm-Prüfsumme stimmt nicht.');files['programm/projekt.zip']=bytes;}else throw Error('Der passende Programmstand wurde noch nicht gesichert.');
  files['snapshot.json']=JSON.stringify(manifest,null,2);download(TFB.snapshotZip.pack(files),'TFB-Website-Snapshot_'+stamp()+'.zip');ui().toast('Inhalte, Medien, Programmstand und Statistik gesichert',true);
 }catch(e){ui().toast(e.message);}finally{busy--;}}
 const protectedNote='Mitglieder, Umsätze, Chats, Seitenaufrufe und dein aktuelles Mailarchiv bleiben beim Wiederherstellen erhalten.';
 let backupAttempt=null,backupPanelRoot;
 const pointDate=value=>new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 async function backupStatus(){const root=document.querySelector('[data-cms-backup-root]');if(!root)return;try{const data=await call('/admin/site/history');if(!root.isConnected)return;const complete=data.snapshots.filter(row=>row.complete);root.querySelector('[data-cms-backup-status]').textContent=complete.length?'Zuletzt gesichert: '+pointDate(complete[0].created_at):'Du kannst jetzt deinen ersten Sicherungsstand anlegen.';}catch(e){if(root.isConnected)root.querySelector('[data-cms-backup-status]').textContent='Gespeicherte Stände derzeit nicht erreichbar. Bitte erneut versuchen.';}}
 function backupPanel(){return `<section class="editor cms-backup" data-cms-backup-root><p class="cms-backup-kicker">Gut gesichert.</p><h2>Datensicherung / Time Machine</h2><p>Bewahre den veröffentlichten Stand auf oder hole eine frühere Version deiner Website zurück.</p><div class="cms-backup-protected"><span aria-hidden="true">✓</span><p>${protectedNote}</p></div><label class="field"><span>Name der Sicherung <small>(freiwillig)</small></span><input data-cms-backup-name maxlength="120" placeholder="Zum Beispiel: Vor der neuen Saison"></label><div class="cms-backup-actions"><button type="button" class="btn cms-backup-primary" data-action="cms-backup-now">Jetzt sichern</button><button type="button" class="btn cms-backup-secondary" data-action="cms-history">Gesicherte Stände</button></div><p class="cms-backup-status" data-cms-backup-status role="status">Gespeicherte Stände werden geladen …</p><p class="cms-backup-note">Automatisch täglich und jederzeit per Klick. Geschützt online gespeichert, mit zusätzlicher verschlüsselter Kopie.</p>${readDraft()?'<p class="form-error">Auf diesem Gerät liegt noch ein unveröffentlichter Entwurf. Die Sicherung bewahrt den zuletzt veröffentlichten Stand auf.</p><button class="link" data-action="cms-draft">Entwurf ansehen</button>':''}</section>`;}
 async function saveBackup(){
  if(busy)return;const root=document.querySelector('[data-cms-backup-root]');if(!root)return;const label=root.querySelector('[data-cms-backup-name]').value.trim();if(backupAttempt?.label!==label)backupAttempt={id:crypto.randomUUID(),label};
  busy++;root.querySelectorAll('button,input').forEach(el=>el.disabled=true);const status=root.querySelector('[data-cms-backup-status]');status.textContent='Dein Stand wird gesichert. Bitte einen Moment warten …';
  try{const result=await call('/admin/site/backup',backupAttempt);backupAttempt=null;await refresh(true);if(root.isConnected)await checkpoints(result.id);ui().toast('Sicherung gespeichert · unter Gesicherte Stände verfügbar',true);}catch(e){status.textContent=e.message;status.classList.add('is-error');}finally{busy--;if(root.isConnected)root.querySelectorAll('button,input').forEach(el=>el.disabled=false);}
 }
 async function checkpoints(highlight){
  const data=await call('/admin/site/history');
  ui().openSheet(`<section class="editor cms-panel cms-backup"><button type="button" class="link cms-backup-back" data-action="cms-backup-home">← Zur Übersicht</button><h2>Gesicherte Stände</h2><p>Wähle einen Zeitpunkt. Die Vorschau verändert noch nichts. Erst mit „Website wiederherstellen“ wird der alte Website-Stand übernommen.</p><div class="cms-backup-protected"><span aria-hidden="true">✓</span><p>${protectedNote}</p></div><div class="cms-history">${data.snapshots.length?data.snapshots.map(row=>`<section${row.id===highlight?' class="cms-backup-new"':''}><div><small>${esc(pointDate(row.created_at))}${row.id===highlight?' · Gerade gesichert':''}</small><strong>${esc(row.label)}</strong><span class="cms-backup-kind">${row.complete?'Website, Clubdaten und Mailarchiv gesichert':row.kind==='edit'?'Automatisch gespeicherte Website-Änderung':'Früherer Website-Stand'}</span></div><button type="button" class="btn small cms-backup-primary" data-cms-preview="${esc(row.id)}">Vorschau</button></section>`).join(''):'<p>Noch keine gespeicherten Stände. Mit „Jetzt sichern“ legst du den ersten an.</p>'}</div></section>`);
 }
 async function preview(request){
  const plan=await call('/admin/site/preview',request);
  ui().openSheet(`<section class="editor cms-panel cms-backup"><button type="button" class="link cms-backup-back" data-action="cms-history">← Gesicherte Stände</button><h2>Vorschau</h2><p>Die Vorschau verändert noch nichts. Erst mit „Website wiederherstellen“ wird der ausgewählte Website-Stand übernommen.</p><div class="cms-backup-protected"><span aria-hidden="true">✓</span><p>${protectedNote}</p></div>${plan.changes.length?`<p>Diese Bereiche werden auf den ausgewählten Stand zurückgesetzt:</p><ul class="cms-backup-changes">${plan.changes.map(c=>`<li>${esc(labels[c.key]||c.key)}${Array.isArray(c.value?.blocks)?` <span>${c.value.blocks.length} Inhalte</span>`:''}</li>`).join('')}</ul><p class="cms-backup-note">Bevor es losgeht, sichern wir den aktuellen Stand automatisch. Du kannst ihn anschließend wieder zurückholen.</p><button type="button" class="btn cms-backup-primary cms-backup-restore" data-cms-apply>Website wiederherstellen</button><p class="form-error" role="alert"></p>`:'<p>Deine Website entspricht bereits diesem Stand. Es gibt nichts zu ändern.</p>'}</section>`);
  const panel=document.querySelector('.cms-panel');let attempt;
  panel.querySelector('[data-cms-apply]')?.addEventListener('click',async event=>{if(busy)return;busy++;event.target.disabled=true;event.target.textContent='Aktuellen Stand sichern und Website zurückholen …';try{const fresh=await call('/admin/site/preview',request);if(fresh.revision!==plan.revision)throw Error('Inzwischen wurde die Website geändert. Bitte die Vorschau erneut öffnen.');attempt ||= crypto.randomUUID();await call('/admin/site/restore',{...request,id:attempt,token:fresh.token});if(request.draft)localStorage.removeItem(draftKey());await refresh();ui().closeSheet();await TFB.refreshSite(true);ui().toast('Website wiederhergestellt · aktuelle Clubdaten erhalten',true);}catch(error){panel.querySelector('.form-error').textContent=error.message;event.target.disabled=false;event.target.textContent='Website wiederherstellen';}finally{busy--;}});
 }
 async function legacyManifest(backup){
  if(backup.version!==1||!backup.db?.site?.pages?.home)throw Error('Diese ältere Sicherung enthält keine vollständige Website.');
  const original=backup.db.site,mapping=new Map();
  async function convert(value){
   if(Array.isArray(value))return Promise.all(value.map(convert));
   if(value&&typeof value==='object'){const out={};for(const [k,v] of Object.entries(value))out[await convert(k)]=await convert(v);return out;}
   if(typeof value!=='string'||!value.startsWith('img:')&&!value.startsWith('doc:')&&!value.startsWith('assets/'))return value;
   if(mapping.has(value))return mapping.get(value);
   let data=backup.images?.[value];
   if(value.startsWith('assets/')){const url=new URL(value,location.href);if(url.origin!==location.origin||!url.pathname.startsWith(new URL('assets/',location.href).pathname))throw Error('Ungültige Mediendatei in der Sicherung.');const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Ein altes Bild oder PDF fehlt. Bitte das vollständige Sicherungspaket verwenden.');const blob=await response.blob();data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});}
   if(!data)throw Error('Eine referenzierte Mediendatei fehlt in dieser Sicherung.');const ref=await upload(data);mapping.set(value,ref);return ref;
  }
  const docs=split(original),converted={};for(const [key,value] of Object.entries(docs))converted[key]={value:await convert(value)};
  return {format:'tfb-website-snapshot',version:1,project:'tfb',documents:converted,media:[]};
 }
 async function importFile(file){busy++;try{const files=file.name.endsWith('.zip')?TFB.snapshotZip.unpack(await file.arrayBuffer()):null;let manifest=JSON.parse(files?new TextDecoder().decode(files['snapshot.json']):await file.text());if(manifest.format==='tfb-sicherung')manifest=await legacyManifest(manifest);if(manifest.format!=='tfb-website-snapshot'||manifest.version!==1||manifest.project!=='tfb')throw Error('Bitte eine TFB-Website-Inhaltssicherung laden. Alte Komplettsicherungen bleiben ein eigener Vorgang.');
  for(const media of manifest.media||[]){let bytes;if(files)bytes=files['medien/'+media.hash];else if(manifest.images?.[media.ref]){const result=await upload(manifest.images[media.ref]);if(result!==media.ref)throw Error('Eine Mediendatei ist beschädigt.');continue;}if(!bytes)throw Error('In diesem Paket fehlt eine Mediendatei.');const sum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(sum!==media.hash)throw Error('Eine Mediendatei wurde verändert.');let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));const ref=await upload('data:'+media.mime+';base64,'+btoa(binary));if(ref!==media.ref)throw Error('Eine Mediendatei ist beschädigt.');}
  await preview({manifest});
 }catch(e){ui().toast(e.message);}finally{busy--;}}
 TFB.editorial={enabled:true,ready,refresh,backupPanel};
 new MutationObserver(()=>{const root=document.querySelector('[data-cms-backup-root]');if(root&&root!==backupPanelRoot){backupPanelRoot=root;backupStatus();}}).observe(document.body,{childList:true,subtree:true});
 TFB.actions=TFB.actions||{};Object.assign(TFB.actions,{'cms-backup-home':()=>ui().openSheet(backupPanel()),'cms-backup-now':saveBackup,'cms-draft':()=>{const draft=readDraft();if(draft)preview({draft:true,manifest:{format:'tfb-website-snapshot',version:1,project:'tfb',documents:Object.fromEntries(Object.entries(split(draft.site)).map(([key,value])=>[key,{value}]))}}).catch(e=>ui().toast(e.message));},'cms-history':()=>checkpoints().catch(e=>ui().toast(e.message))});
 document.addEventListener('click',e=>{const previewButton=e.target.closest('[data-cms-preview]'),downloadButton=e.target.closest('[data-cms-download]');if(previewButton)preview({snapshot:previewButton.dataset.cmsPreview}).catch(err=>ui().toast(err.message));if(downloadButton)exportZip(downloadButton.dataset.cmsDownload);});
 document.addEventListener('change',e=>{if(e.target.matches('[data-cms-file]')&&e.target.files[0])importFile(e.target.files[0]);});
})();
