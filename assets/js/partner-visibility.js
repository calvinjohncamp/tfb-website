(function () {
  const defaults = {enabled:true,headline:'Hier spielt',accent:'das Miteinander.',description:'Tennis, Freunde und das Clubleben dazwischen. Willkommen bei den Tennisfreunden Bielstein.',entry:'Zu den Tennisfreunden',foot:'Sport verbindet. Seit 1976 in Bielstein.',partnerLabel:'Präsentiert von unseren Premium-Partnern'};
  const ui=()=>TFB.ui, admin=()=>Boolean(ui()?.isAdmin()), esc=s=>ui().esc(s);
  const cfg=TFB.config.partnerVisibility;
  const remote=()=>Boolean(cfg?.enabled && location.protocol==='https:' && cfg.hosts.includes(location.hostname));
  const SESSION='tfb_splash_visit_v1';
  let settings={...defaults}, previewSettings=null, splash=null, started=false, active=null, observer=null, timers=new Map(), candidates=new Set();
  let queue=[], sending=false, flushTimer=null, retryTimer=null, failures=0, report=null, year=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'}).slice(0,4);
  const pageNames={splash:'Einstiegsseite',home:'Home','home-detail':'Home · Themen','home-fotos':'Home · Fotos','home-alle':'Home · Übersicht',aktuell:'Aktuell','aktuell-detail':'Aktuell · Details','aktuell-alle':'Aktuell · Übersicht',chat:'Chat','chat-detail':'Chat · Details',sport:'Sport','sport-training':'Training',team:'Mannschaften',club:'Club','club-detail':'Club · Details',treffen:'Dating','treffen-detail':'Dating · Details',kiosk:'Kiosk',strichliste:'Strichliste',abrechnungen:'Abrechnungen',impressum:'Impressum',satzung:'Satzung'};
  function pageKey() {
    const [view,detail]=location.hash.slice(1).split('/');
    const key=({verein:'club',gefluester:'chat'})[view]||view||'home';
    if(!detail)return pageNames[key]?key:null;
    if(key==='sport')return 'sport-training';
    if(key==='team')return 'team';
    if(key==='home')return detail==='alle'?'home-alle':detail==='fotos'?'home-fotos':'home-detail';
    if(['aktuell','chat','club','treffen'].includes(key))return key+(detail==='alle'&&key==='aktuell'?'-alle':'-detail');
    return pageNames[key]?key:null;
  }
  function eligible() {return remote()&&!admin()&&!document.querySelector('.editing-page')&&!new URLSearchParams(location.search).has('tfbPresentation');}
  function event(kind,partner='',slot='') {
    if(!active||!eligible())return;
    const key=[kind,partner,slot].join(':');if(kind!=='click'&&active.sent.has(key))return;
    if(kind!=='click')active.sent.add(key);
    queue.push({id:crypto.randomUUID(),page:active.page,kind,partner,slot});
    if(queue.length>100)queue.splice(0,queue.length-100);
    clearTimeout(flushTimer);flushTimer=setTimeout(flush,500);
  }
  async function flush() {
    if(sending||!queue.length||!remote())return;
    if(admin()){queue=[];return;}
    sending=true;const batch=queue.slice(0,25);
    try {
      const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),10000);
      let response;
      try {response=await fetch(cfg.url.replace(/\/$/,'')+'/public/partner-events',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({events:batch}),keepalive:true,signal:controller.signal});}
      finally {clearTimeout(timeout);}
      if(!response.ok)throw Error(String(response.status));
      queue.splice(0,batch.length);failures=0;
    }catch(_){failures++;if(failures>=3){queue.splice(0,batch.length);failures=0;}}
    finally {sending=false;if(queue.length){clearTimeout(retryTimer);retryTimer=setTimeout(flush,failures?5000:500);}}
  }
  function cancelTimers(){for(const t of timers.values())clearTimeout(t);timers.clear();}
  function stopObserver(){observer?.disconnect();observer=null;cancelTimers();candidates.clear();}
  function unobscured(image) {
    if(document.visibilityState!=='visible'||document.querySelector('#sheet-root.open')||!image.isConnected)return false;
    if(active?.page!=='splash'&&splash&&!splash.hidden)return false;
    const r=image.getBoundingClientRect();if(!r.width||!r.height)return false;
    const w=Math.max(0,Math.min(r.right,innerWidth)-Math.max(0,r.left)),h=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(0,r.top));
    if(w*h/(r.width*r.height)<.5)return false;
    const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,r.x+r.width/2)),Math.max(0,Math.min(innerHeight-1,r.y+r.height/2)));
    return hit===image;
  }
  function schedule(image) {
    if(timers.has(image)||!unobscured(image))return;
    const visit=active;timers.set(image,setTimeout(()=>{timers.delete(image);if(active!==visit||!unobscured(image))return;const tile=image.closest('[data-partner-id]');event('partner_view');event('visible',tile.dataset.partnerId,tile.dataset.partnerSlot);},1000));
  }
  function observe(root) {
    stopObserver();if(!eligible()||!active)return;
    observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting,intersectionRatio})=>{
      if(isIntersecting&&intersectionRatio>=.5){candidates.add(target);schedule(target);}else{candidates.delete(target);clearTimeout(timers.get(target));timers.delete(target);}
    }),{threshold:[0,.5,1]});
    for(const image of root.querySelectorAll('[data-partner-id] img')){
      const ready=()=>{if(!image.isConnected||!image.complete||!image.naturalWidth||!active||root!==currentRoot())return;const tile=image.closest('[data-partner-id]');event('display',tile.dataset.partnerId,tile.dataset.partnerSlot);observer?.observe(image);};
      if(image.complete)ready();else image.addEventListener('load',ready,{once:true});
    }
  }
  const currentRoot=()=>splash&&!splash.hidden?splash:document.getElementById('view');
  function markVisit(){try{sessionStorage.setItem(SESSION,String(Date.now()));}catch(_){}}
  function begin(page,root) {
    if(!page||!root||!eligible()){stopObserver();active=null;return;}
    if(!active||active.page!==page){active={page,sent:new Set()};event('pageview');}
    observe(root);
  }
  async function refreshSettings(){if(TFB.partnerContent?.isRemote){await TFB.partnerContent.refresh();settings={...defaults,...TFB.partnerContent.splash};}else{const site=await ui().api.site();settings={...defaults,...site.splash};}}
  function premiumMarkup(){
    const partners=(TFB.partners||[]).filter(p=>p.tier==='premium'&&p.logo).sort((a,b)=>(a.sort||0)-(b.sort||0)).slice(0,2);
    if(!partners.length)return '';
    return `<section class="tfb-splash-partners pbsp-slot" aria-label="Premium-Partner"><p class="pbsp-kicker">${esc(settings.partnerLabel)}</p><div class="pbsp-duo">${partners.map((p,i)=>TFB.partnerTile(p,i)).join('')}</div></section>`;
  }
  function splashMarkup(){return `<div class="tfb-splash-inner"><div class="tfb-splash-top"><div class="tfb-splash-wordmark" role="${admin()?'group':'img'}" aria-label="Tennisfreunde Bielstein"><span class="tfb-logo-noball"></span>${admin()?'<button type="button" class="tfb-splash-ball" data-action="partner-report" aria-label="Partner verwalten"><span class="tfb-logo-ball"></span></button>':'<span class="tfb-logo-ball tfb-splash-ball"></span>'}</div>${admin()?`<button class="view-close tfb-splash-edit" data-action="splash-edit" aria-label="Einstiegsseite bearbeiten">${ui().icon.pencil}</button>`:''}</div><div class="tfb-splash-message"><p class="tfb-splash-eyebrow">Tennisfreunde Bielstein</p><h1><span>${esc(settings.headline)}</span><br><em>${esc(settings.accent)}</em></h1><p class="tfb-splash-description">${esc(settings.description)}</p></div><div><button type="button" class="tfb-splash-enter" data-action="splash-enter"><span>${esc(settings.entry)}</span><span aria-hidden="true">→</span></button><p class="tfb-splash-foot">${esc(settings.foot)}</p>${premiumMarkup()}<nav class="tfb-splash-legal" aria-label="Vereinsinformationen"><a href="#impressum" data-splash-legal>Impressum</a><a href="#satzung" data-splash-legal>Satzung</a></nav></div></div>`;}
  async function show(force=false) {
    await refreshSettings();if(!force&&!settings.enabled){rendered();return;}
    if(!splash){splash=document.createElement('section');splash.id='tfb-splash';splash.className='tfb-splash';splash.tabIndex=-1;splash.setAttribute('role','dialog');splash.setAttribute('aria-modal','true');splash.setAttribute('aria-label','Willkommen bei den Tennisfreunden Bielstein');document.body.appendChild(splash);}
    ui().closeSheet();stopObserver();active=null;splash.innerHTML=splashMarkup();splash.hidden=false;splash.scrollTop=0;
    document.body.classList.add('tfb-splash-open');document.getElementById('app').inert=true;
    splash.focus({preventScroll:true});
    begin('splash',splash);
  }
  function hide(count=true) {
    if(!splash||splash.hidden)return;
    stopObserver();active=null;splash.hidden=true;document.body.classList.remove('tfb-splash-open');document.getElementById('app').inert=false;markVisit();
    if(count)rendered();
  }
  async function start() {
    if(started)return;started=true;
    let last=0;try{last=Number(sessionStorage.getItem(SESSION)||0);}catch(_){}
    const direct=/^#(?:impressum|satzung|partnerzahlen|partner)(?:\/|$)/.test(location.hash)||new URLSearchParams(location.search).has('tfbPresentation');
    if(!direct&&Date.now()-last>30*60*1000)await show();else rendered();
  }
  function rendered(){
    if(!started)return;
    if(splash&&!splash.hidden)return;
    begin(pageKey(),document.getElementById('view'));
  }
  async function edit(){
    if(!admin())return;if(previewSettings)settings={...previewSettings};else await refreshSettings();const saved={...settings};
    ui().openSheet(`<form class="editor" data-editor="splash"><h2>Einstiegsseite bearbeiten</h2><p class="ed-hint">Texte anpassen und speichern – wie auf den anderen TFB-Seiten.</p><label class="field"><span><input name="enabled" type="checkbox" ${settings.enabled?'checked':''}> Einstiegsseite anzeigen</span></label>${[['headline','Überschrift',60],['accent','Hervorgehobene Zeile',60],['description','Beschreibung',350],['entry','Einstiegsbutton',60],['foot','Fußtext',120],['partnerLabel','Partnerüberschrift',120]].map(([key,label,max])=>`<label class="field"><span>${label}</span>${key==='description'?`<textarea name="${key}" maxlength="${max}" rows="3">${esc(settings[key])}</textarea>`:`<input name="${key}" value="${esc(settings[key])}" maxlength="${max}" required>`}</label>`).join('')}<p class="form-error" role="alert"></p><button type="button" class="btn block" data-splash-preview>Vorschau ansehen</button><div class="ed-actions"><button type="submit" class="btn primary block">Speichern</button></div><p class="ed-hint">${TFB.partnerContent?.isRemote?'Nach dem Speichern sind die Texte auf allen Geräten sichtbar.':'Lokale Vorschau: Speichern gilt in diesem Browser.'}</p></form>`);
    const form=document.querySelector('[data-editor="splash"]');
    requestAnimationFrame(()=>form.elements.headline.focus());
    const draft=()=>Object.fromEntries(Object.keys(defaults).map(k=>[k,k==='enabled'?form.elements[k].checked:form.elements[k].value.trim()]));
    const preview=()=>{settings=draft();previewSettings={...settings};splash.innerHTML=splashMarkup();};
    form.querySelector('[data-splash-preview]').onclick=()=>{preview();ui().closeSheet();ui().toast('Vorschau – über den Stift weiterbearbeiten oder speichern.',true);};
    // Preview stays in memory; reopening the editor retains it until save/reload.
    form.onsubmit=async e=>{e.preventDefault();if(!admin())return;const button=form.querySelector('[type="submit"]');button.disabled=true;try{if(TFB.partnerContent?.isRemote)await TFB.partnerContent.saveSplash(draft());else{const site=await ui().api.site();await ui().api.saveSite({...site,splash:draft()});}settings=draft();previewSettings=null;splash.innerHTML=splashMarkup();ui().closeSheet();await TFB.refreshSite();ui().toast('Einstiegsseite gespeichert',true);}catch(err){form.querySelector('.form-error').textContent=err.message;button.disabled=false;settings=saved;}};
  }
  const n=value=>Number(value||0).toLocaleString('de-DE');
  const date=value=>value?new Date(value).toLocaleDateString('de-DE',{timeZone:'Europe/Berlin'}):'Noch keine Messung';
  function summarize(data){
    const pages=new Map(),partners=new Map(),pagesWithPartners=new Map();let views=0,visible=0,clicks=0,splashViews=0;
    for(const row of data.rows){const total=Number(row.total);if(row.kind==='pageview'){if(row.page==='splash')splashViews+=total;else views+=total;pages.set(row.page,(pages.get(row.page)||0)+total);continue;}
      if(row.kind==='partner_view'){pagesWithPartners.set(row.page,(pagesWithPartners.get(row.page)||0)+total);continue;}
      const p=partners.get(row.partner)||{display:0,visible:0,click:0,splash:0};p[row.kind]=(p[row.kind]||0)+total;if(row.kind==='visible'){visible+=total;if(row.page==='splash')p.splash+=total;}if(row.kind==='click')clicks+=total;partners.set(row.partner,p);
    }return {pages,partners,pagesWithPartners,views,visible,clicks,splashViews};
  }
  async function reportView(){
    if(!admin())return '<section class="partner-report"><h1>Partner-Sichtbarkeit</h1><p>Diese Übersicht steht nur angemeldeten Admins zur Verfügung.</p></section>';
    const top=`<section class="partner-report"><div class="partner-report-head"><div><p class="tfb-splash-eyebrow">Tennisfreunde Bielstein</p><h1>Partner-Sichtbarkeit</h1></div><button type="button" class="btn small" data-action="splash-open">Zur Einstiegsseite</button></div>`;
    if(!TFB.directoryCall||!ui().api.secureDirectory)return top+'<p class="partner-report-empty">Lokale Vorschau: Hier werden keine Besucher gezählt. Die echten Jahreszahlen stehen nach Veröffentlichung und Einrichtung des Statistikservers auf der Website zur Verfügung.</p></section>';
    let data;try{data=await TFB.directoryCall('/admin/partner-visibility?year='+year);}catch(e){report=null;return top+`<p class="partner-report-empty" role="alert">${esc(e.message)}</p><button class="btn" data-action="partner-report-refresh">Erneut laden</button></section>`;}
    if(!admin())return '';
    report=data;const s=summarize(data),current=Number(new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Berlin'}).slice(0,4));
    return top+`<div class="partner-report-controls"><label>Jahr <select aria-label="Auswertungsjahr" data-partner-year>${Array.from({length:current-2025},(_,i)=>current-i).map(y=>`<option ${y==year?'selected':''}>${y}</option>`).join('')}</select></label><button class="btn small" data-action="partner-report-refresh">Aktualisieren</button><button class="btn small" data-action="partner-report-csv">CSV speichern</button><button class="btn small" data-action="partner-report-print">Drucken / PDF</button></div><p class="partner-report-period">${data.year} · bis ${esc(date(data.through+'T12:00:00Z'))} · Messbeginn: ${esc(date(data.startedAt))}</p><div class="partner-report-metrics"><div><span>Seitenaufrufe</span><strong>${n(s.views)}</strong><small>Home und Unterseiten</small></div><div><span>Sichtbare Logokontakte</span><strong>${n(s.visible)}</strong><small>inklusive Einstiegsseite</small></div><div><span>Partnerklicks</span><strong>${n(s.clicks)}</strong><small>Klicks auf Partnerlogos</small></div></div><p class="partner-report-intro">Die Einstiegsseite wurde ${n(s.splashViews)}-mal aufgerufen. Erfasst werden Kontakte, keine eindeutigen Personen.</p><h2>Unsere Partner</h2><div class="partner-report-table"><table><thead><tr><th>Partner</th><th>Ausspielungen</th><th>Sichtkontakte</th><th>davon Einstieg</th><th>Klicks</th></tr></thead><tbody>${data.partners.filter(p=>s.partners.has(p.id)).map(p=>{const r=s.partners.get(p.id)||{};return `<tr><th scope="row">${esc(p.name)}</th><td>${n(r.display)}</td><td>${n(r.visible)}</td><td>${n(r.splash)}</td><td>${n(r.click)}</td></tr>`;}).join('')||'<tr><td colspan="5">In diesem Zeitraum sind noch keine Partnerkontakte erfasst.</td></tr>'}</tbody></table></div><p class="partner-report-period">Partner erscheinen hier, sobald im ausgewählten Jahr Ausspielungen oder Kontakte erfasst sind.</p><h2>Seitenaufrufe im Detail</h2><div class="partner-report-table"><table><thead><tr><th>Seite</th><th>Aufrufe</th></tr></thead><tbody>${[...s.pages].sort(([a],[b])=>a.localeCompare(b)).map(([p,total])=>`<tr><th scope="row">${esc(pageNames[p]||p)}</th><td>${n(total)}</td></tr>`).join('')||'<tr><td colspan="2">In diesem Zeitraum sind noch keine Aufrufe erfasst.</td></tr>'}</tbody></table></div><details class="partner-report-method"><summary>So werden die Zahlen gezählt</summary><p>${esc(data.definition)}</p><p>Ein Seitenwechsel zählt einmal; reine Datenaktualisierungen zählen nicht neu. Splash und Home werden getrennt erfasst. Admin-Aufrufe, Bearbeitung und lokale Vorschauen werden nicht mitgezählt. Blocker und fehlende Verbindung können zur Untererfassung führen. Ausspielungen sind geladene Logos, Sichtkontakte sind gemessene Bildschirmkontakte.</p><p>Quelle: TFB · Zeitzone: Europe/Berlin · Messversion ${n(data.measurementVersion)}. Partner werden anhand stabiler Kennungen ausgewertet. Keine Hochrechnung aus der Rotation und keine rückwirkende Schätzung vor Messbeginn.</p></details></section>`;
  }
  function csv(){if(!admin()||!report)return;const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';const names=new Map(report.partners.map(p=>[p.id,p.name]));const rows=[['Quelle','Jahr','Messbeginn','Tag','Seite','Partner-ID','Partner','Platz','Kennzahl','Anzahl'],...report.rows.map(r=>['TFB',report.year,report.startedAt||'',r.day,pageNames[r.page]||r.page,r.partner,names.get(r.partner)||'',r.slot,r.kind,r.total])];const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`TFB-Partner-Sichtbarkeit-${report.year}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  TFB.views=TFB.views||{};TFB.views.partnerzahlen=reportView;
  TFB.actions=TFB.actions||{};Object.assign(TFB.actions,{
    'splash-enter':()=>{hide();if(['partnerzahlen','partner'].includes(ui().currentView()))location.hash='#home';else document.querySelector('#view h1')?.focus?.();},
    'splash-open':()=>{ui().closeSheet();show(true);},
    'splash-edit':edit,
    'partner-report':()=>{if(!admin())return;hide(false);if(location.hash==='#partner')ui().renderView('partner');else location.hash='#partner';},
    'partner-report-refresh':()=>ui().renderView('partnerzahlen'),
    'partner-report-csv':csv,
    'partner-report-print':()=>{if(admin()&&report)window.print();},
  });
  document.addEventListener('change',e=>{if(e.target.matches('[data-partner-year]')&&admin()){year=e.target.value;ui().renderView('partnerzahlen');}});
  document.addEventListener('click',e=>{
    const tile=e.target.closest('[data-partner-id]');if(tile?.matches('a[href]')&&active)event('click',tile.dataset.partnerId,tile.dataset.partnerSlot);
    if(e.target.closest('[data-splash-legal]'))hide(false);
  });
  document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!splash||splash.hidden||document.querySelector('#sheet-root.open'))return;const controls=[...splash.querySelectorAll('button,a[href]')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
  window.addEventListener('hashchange',()=>{stopObserver();active=null;if(splash&&!splash.hidden)hide(false);markVisit();});
  document.addEventListener('visibilitychange',()=>{cancelTimers();if(document.visibilityState==='visible'){if(splash&&!splash.hidden)begin('splash',splash);else rendered();}else flush();});
  // A modal breaks continuous visibility even when it opens during the one-second interval.
  new MutationObserver(()=>{cancelTimers();const open=Boolean(document.querySelector('#sheet-root .sheet'));if(splash&&!splash.hidden)splash.inert=open;if(!open)for(const image of candidates)schedule(image);}).observe(document.getElementById('sheet-root'),{childList:true,attributes:true});
  window.addEventListener('pagehide',()=>{markVisit();flush();});
  let activityAt=0;for(const type of ['pointerdown','keydown','scroll'])document.addEventListener(type,()=>{if(Date.now()-activityAt>60000){activityAt=Date.now();markVisit();}},{passive:true});
  TFB.partnerVisibility={start,rendered,show,defaults};
})();
