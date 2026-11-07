// Editorial media collections: the existing Home feature shell remains unchanged.
(function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const entries = block => (block.mediaCollection?.entries || []).filter(e => e.title && e.images?.length);
  const source = (ref, imageOf) => imageOf(ref) || ref;
  const image = (ref, imageOf, alt = '', lead = false) => `<img src="${esc(source(ref,imageOf))}" alt="${esc(alt)}" loading="${lead?'eager':'lazy'}" fetchpriority="${lead?'high':'low'}" decoding="async">`;
  const link = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
  const magnifier='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path></svg>';
  const playbackIcon = playing => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${playing?'<rect x="7" y="5" width="3.5" height="14" rx=".7"/><rect x="13.5" y="5" width="3.5" height="14" rx=".7"/>':'<path d="M8 5.5v13l10-6.5z"/>'}</svg>`;
  let zoom=null;
  function cover(block, href, imageOf) {
    const entry = entries(block)[0], refs = entry?.images || [], manual=block.animationStart==='manual';
    if (!refs.length) return `<div class="feature-media hm-empty">Noch keine Bilder veröffentlicht.</div>`;
    return `<div class="feature-media hm-orbit" data-hm-orbit data-hm-start="${block.animationStart==='manual'?'manual':'auto'}" aria-label="Einblicke in ${esc(block.title)}"><div class="hm-stage">${refs.map((ref,i) => `<a class="hm-card" href="${esc(href)}" aria-label="Bild ${i+1}: Alle Einblicke ansehen">${image(ref,imageOf,entry.title,i===0)}</a>`).join('')}</div><div class="hm-footer"><a class="hm-caption" href="${esc(href)}"><span>${esc(entry.title)}</span></a><button type="button" class="hm-zoom-button" aria-label="Karussell vergrößern" title="Karussell vergrößern">${magnifier}</button><button type="button" class="hm-pause" aria-label="${manual?'Bildbewegung starten':'Bildbewegung pausieren'}" aria-pressed="${manual}"${refs.length<2?' hidden':''}>${playbackIcon(!manual)}</button></div></div>`;
  }
  async function detail(block, { imageOf, paragraphs, admin, page='home', backHref }) {
    const studio = await import('./chat-media.js');
    const collection = block.mediaCollection, list = entries(block), count = collection.showAll ? list.length : 6;
    const sizes = {'4:5':[4,5],'9:16':[9,16],'16:9':[16,9],'5:4':[5,4]};
    const markup = (entry,index) => {
      const [w,h] = sizes[entry.format] || sizes['4:5'];
      const gallery = studio.publishedGallery({id:`home-media-${block.id}-${entry.id}`,photoView:'carousel',designs:entry.images.map(ref=>studio.mediaDesign(ref,w,h))},ref=>source(ref,imageOf)).replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
      const url = link(entry.instagramUrl);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') ? new Date(entry.date+'T12:00:00').toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) : '';
      return `<article class="hm-entry"${index>=count?' hidden':''}><div class="hm-entry-gallery">${gallery}<div class="hm-thumbs" role="group" aria-label="Bild auswählen">${entry.images.map((ref,i)=>`<button type="button" data-hm-thumb="${i}" aria-label="Bild ${i+1} anzeigen" aria-pressed="${i===0}">${image(ref,imageOf,`${entry.title} · Bild ${i+1}`)}</button>`).join('')}</div></div><div class="hm-entry-copy"><p class="hm-entry-date">${date?`<time datetime="${esc(entry.date)}">${esc(date)}</time> · `:''}${entry.images.length} Bildseiten</p>${(entry.kicker ?? block.kicker) ? `<p class="feature-kicker hm-entry-kicker">${esc(entry.kicker ?? block.kicker)}</p>` : ''}<${index===0?'h1':'h2'}>${esc(entry.title)}</${index===0?'h1':'h2'}>${entry.subtitle?`<p class="hm-entry-intro">${esc(entry.subtitle)}</p>`:''}${paragraphs(entry.text)}${url?`<a class="more-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Auf Instagram ansehen ↗</a>`:''}</div></article>`;
    };
    return `<section class="hm-collection"><div class="story-tools">${admin?`<button type="button" class="view-close" data-action="feature-edit" data-page="${esc(page)}" data-id="${esc(block.id)}" aria-label="Sammlung bearbeiten">${TFB.ui.icon.pencil}</button>`:''}<a class="view-close" href="${esc(backHref||'#'+page)}" aria-label="${backHref?'Zurück zum Clubarchiv':page==='home'?'Zurück zur Startseite':'Zurück zu Aktuell'}">${TFB.ui.icon.close}</a></div>${list.map(markup).join('')}${list.length>count?`<p class="hm-all"><button type="button" class="btn" data-hm-all>Alle ${list.length} Beiträge anzeigen</button></p>`:''}</section>`;
  }
  const mounted = new WeakSet(), controllers = new Set();
  function mountOrbit(node,initial={}) {
    const cards = [...node.querySelectorAll('.hm-card')], n = cards.length, button = node.querySelector('.hm-pause'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let phase=Number(initial.phase)||0,timer=0,frame=0,visible=false,hover=false,focused=false,paused=initial.paused===undefined?node.dataset.hmStart==='manual':Boolean(initial.paused);
    const enlarged=node.classList.contains('hm-zoom-orbit'), hoverable=matchMedia('(hover: hover) and (pointer: fine)');
    let keyboard=false,allowMotion=Boolean(initial.allowMotion);
    const motionBlocked=()=>reduced.matches&&!allowMotion;
    const loaded=cards.map(()=>false);
    const nextImagesReady=()=>loaded[Math.floor(phase)%n]&&loaded[(Math.floor(phase)+1)%n];
    const depthOrder = at => cards.map((_,i)=>({i,depth:Math.cos(2*Math.PI*(i-at-.00001)/n)})).sort((a,b)=>a.depth-b.depth||a.i-b.i).map(x=>x.i);
    const layout = () => {
      const w=node.clientWidth,h=node.clientHeight,percent=n===1?64:n===2?54:n===3?50:48;
      const cardWidth=enlarged?Math.min(w*(w<h?.82:percent/100),h*(n===1?.84:.66)*4/5)+'px':node.closest('.media-news')?Math.min(w*percent/100,h*(n===1?.88:.72)*4/5)+'px':percent+'%';
      const step=Math.floor(phase),progress=phase-step,before=depthOrder(step),after=depthOrder(step+1),order=progress<.5?before:after;
      // Change paint order only while receding cards are fully transparent.
      // Reuse the real cards: creating/removing composited image copies caused
      // flashes in the clipped inline view on iPad, even when zoom looked fine.
      const distance=Math.min(1,Math.abs(progress-.5)*2),fade=distance*distance*(3-2*distance);
      cards.forEach((card,i)=>{
        const angle=2*Math.PI*(i-phase)/n,c=Math.cos(angle),sin=Math.sin(angle);
        card.style.width=cardWidth;
        card.style.transform=`translate(-50%,-50%) translate(${sin*w*.285}px,${-(1-c)*h*.13}px) rotate(${-sin*10}deg) scale(${.58+.42*(c+1)/2})`;
        card.style.zIndex=String(order.indexOf(i)+1);
        card.style.opacity=String(!reduced.matches&&after.indexOf(i)<before.indexOf(i)?fade:1);
      });
      node.dataset.hmOrder=order.join(',');node.dataset.hmPhase=String(phase);node.dataset.hmReady='true';
    };
    const stop = () => {clearTimeout(timer);cancelAnimationFrame(frame);node.dataset.hmRunning='false';};
    const canRun = () => n>1&&node.isConnected&&visible&&nextImagesReady()&&!document.hidden&&!motionBlocked()&&(enlarged||!hover&&!focused)&&!paused&&(!zoom||zoom.node===node);
    const sync = (delay=3000) => {stop();button.setAttribute('aria-pressed',String(paused||motionBlocked()));button.setAttribute('aria-label',paused||motionBlocked()?'Bildbewegung starten':'Bildbewegung pausieren');const playing=!(paused||motionBlocked());if(button.dataset.hmPlaying!==String(playing)){button.innerHTML=playbackIcon(playing);button.dataset.hmPlaying=String(playing);}button.disabled=false;if(!canRun())return;node.dataset.hmRunning='true';timer=setTimeout(()=>{const start=performance.now(),from=phase,to=Math.floor(phase+.0001)+1;const tick=now=>{if(!canRun()){stop();return;}const t=Math.min(1,(now-start)/1600);phase=from+(to-from)*t*t*(3-2*t);layout();if(t<1)frame=requestAnimationFrame(tick);else{phase=to%n;layout();sync(2100);}};frame=requestAnimationFrame(tick);},delay);};
    button.addEventListener('click',()=>{if(motionBlocked()){allowMotion=true;paused=false;}else paused=!paused;hover=false;sync();});
    node.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&hoverable.matches){hover=true;sync();}});
    node.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;sync();}});
    const focus=()=>{focused=keyboard&&node.contains(document.activeElement)&&document.activeElement!==button&&document.activeElement!==node.querySelector('.hm-zoom-button');sync();};
    node.addEventListener('focusin',focus);node.addEventListener('focusout',()=>queueMicrotask(focus));
    const keyInput=e=>{if(e.key==='Tab'){keyboard=true;focus();}};
    const pointerInput=e=>{keyboard=false;if(e.pointerType!=='mouse')hover=false;focus();};
    document.addEventListener('keydown',keyInput);document.addEventListener('pointerdown',pointerInput);
    const intersection=new IntersectionObserver(rows=>{const next=rows[0].isIntersecting;if(visible===next)return;visible=next;sync();},{threshold:.15});intersection.observe(node);
    const resize=new ResizeObserver(layout);resize.observe(node);
    const changed=()=>{allowMotion=false;if(reduced.matches){phase=Math.round(phase)%n;layout();}sync();};
    const visibility=()=>sync();reduced.addEventListener('change',changed);document.addEventListener('visibilitychange',visibility);
    cards.forEach((card,i)=>{
      const img=card.querySelector('img');
      const reveal=async()=>{
        if(loaded[i]||!img.naturalWidth)return;
        try{await img.decode();}catch{return;}
        if(!node.isConnected)return;
        loaded[i]=true;card.dataset.hmLoaded='true';
        // Keep the current picture until its successor can actually be drawn.
        if(node.dataset.hmRunning!=='true')sync();
      };
      img.addEventListener('load',reveal);
      if(img.complete)queueMicrotask(reveal);
    });
    layout();sync();return {node,getState:()=>({phase,paused,allowMotion}),setState(state){phase=state.phase;paused=state.paused;allowMotion=Boolean(state.allowMotion);layout();sync();},refresh:sync,destroy(){stop();document.removeEventListener('keydown',keyInput);document.removeEventListener('pointerdown',pointerInput);intersection.disconnect();resize.disconnect();reduced.removeEventListener('change',changed);document.removeEventListener('visibilitychange',visibility);}};
  }
  function closeZoom(restoreFocus=true) {
    if(!zoom)return;
    const active=zoom,state=active.controller.getState();zoom=null;
    active.controller.destroy();controllers.delete(active.controller);
    active.dialog.close();active.dialog.remove();document.body.classList.remove('hm-zoom-open');
    if(active.source.node.isConnected)active.source.setState(state);
    for(const c of controllers)c.refresh?.();
    if(restoreFocus&&active.trigger.isConnected)active.trigger.focus({preventScroll:true});
  }
  function openZoom(trigger) {
    if(zoom)return;
    hydrate();const node=trigger.closest('[data-hm-orbit]'),source=[...controllers].find(c=>c.node===node);
    if(!source)return;
    const dialog=document.createElement('dialog');dialog.className='hm-zoom-dialog';dialog.setAttribute('aria-label','Karussell in großer Ansicht');
    const enlarged=node.cloneNode(true);enlarged.className='hm-orbit hm-zoom-orbit';enlarged.querySelectorAll('.hm-transition-card,.hm-zoom-button').forEach(el=>el.remove());
    enlarged.querySelectorAll('img').forEach(img=>img.loading='eager');
    const close=document.createElement('button');close.type='button';close.className='hm-zoom-close';close.setAttribute('aria-label','Große Ansicht schließen');close.textContent='×';
    dialog.append(enlarged,close);document.body.append(dialog);document.body.classList.add('hm-zoom-open');dialog.showModal();
    mounted.add(enlarged);const controller=mountOrbit(enlarged,source.getState());zoom={dialog,node:enlarged,controller,source,trigger};controllers.add(controller);
    for(const c of controllers)c.refresh?.();
    close.addEventListener('click',()=>closeZoom());dialog.addEventListener('cancel',e=>{e.preventDefault();closeZoom();});
    dialog.addEventListener('click',e=>{if(e.target.closest('.hm-card,.hm-caption'))closeZoom(false);});
    close.focus({preventScroll:true});
  }
  document.addEventListener('click',e=>{const trigger=e.target.closest('.hm-zoom-button');if(trigger){e.preventDefault();e.stopPropagation();openZoom(trigger);}});
  window.addEventListener('hashchange',()=>closeZoom(false));

  function mountThumbs(node) {
    const gallery=node.querySelector('.cs-carousel'),thumbs=[...node.querySelectorAll('[data-hm-thumb]')];
    if(!gallery)return {node,destroy(){}};
    const sync=()=>{const current=Number(gallery.querySelector('[data-cs-published-page]:not([hidden])')?.dataset.csPublishedPage||0);thumbs.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));};
    thumbs.forEach(b=>b.addEventListener('click',()=>gallery.querySelector(`[data-cs-published-dot="${b.dataset.hmThumb}"]`)?.click()));
    const observer=new MutationObserver(sync);observer.observe(gallery,{subtree:true,attributes:true,attributeFilter:['hidden']});sync();return {node,destroy(){observer.disconnect();}};
  }
  let queued=false;
  function hydrate(){queued=false;for(const c of controllers)if(!c.node.isConnected){c.destroy();controllers.delete(c);}document.querySelectorAll('[data-hm-orbit],.hm-entry').forEach(node=>{if(mounted.has(node))return;mounted.add(node);controllers.add(node.matches('[data-hm-orbit]')?mountOrbit(node):mountThumbs(node));});}
  new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(hydrate);}}).observe(document.getElementById('app'),{childList:true,subtree:true});
  document.addEventListener('click',e=>{const all=e.target.closest('[data-hm-all]');if(all){all.closest('.hm-collection').querySelectorAll('.hm-entry[hidden]').forEach(el=>el.hidden=false);all.parentElement.remove();}});

  function fresh() { return {title:'Einblicke in unser Projekt.',intro:'',entries:[]}; }
  function openEditor(original, {imageOf,uploadFiles,onSave,onDelete,page='home'}) {
    const ui=TFB.ui,draft=structuredClone(original),single=page==='aktuell'&&draft.mediaSingle;
    let tab='home',busy=false,armed=false;
    const field=(label,name,value,area=false)=>`<label class="field"><span>${label}</span>${area?`<textarea name="${name}" rows="4">${esc(value)}</textarea>`:`<input name="${name}" value="${esc(value)}">`}</label>`;
    const formats=(entry,i)=>`<label class="field"><span>Bildformat</span><select name="entry_${i}_format">${['4:5','9:16','16:9','5:4'].map(format=>`<option${entry.format===format?' selected':''}>${format}</option>`).join('')}</select></label>`;
    const pictures=(entry,i)=>`<div class="gallery-edit">${entry.images.map((ref,j)=>`<div class="gallery-thumb">${image(ref,imageOf)}<button type="button" data-hm-remove="${i}:${j}" aria-label="Bild entfernen">×</button><span class="thumb-move"><button type="button" data-hm-move="${i}:${j}:-1"${j===0?' disabled':''} aria-label="Bild nach vorne">‹</button><button type="button" data-hm-move="${i}:${j}:1"${j===entry.images.length-1?' disabled':''} aria-label="Bild nach hinten">›</button></span></div>`).join('')}<label class="gallery-add">${ui.icon.camera}<span>Bilder hinzufügen</span><input type="file" accept="image/*" multiple data-hm-upload="${i}" hidden></label></div>`;
    function collect(){
      const form=document.querySelector('[data-hm-editor]');if(!form)return;
      for(const key of ['title','kicker','subtitle','text','mediaButtonLabel','date'])if(form.elements[key])draft[key]=form.elements[key].value.trim();
      if(form.elements.animationStart)draft.animationStart=form.elements.animationStart.value;
      draft.mediaCollection.entries.forEach((entry,i)=>{for(const key of ['kicker','title','subtitle','date','text','format','instagramUrl'])if(form.elements[`entry_${i}_${key}`])entry[key]=form.elements[`entry_${i}_${key}`].value.trim();});
      if(single)for(const key of ['title','kicker','subtitle','text','date'])draft.mediaCollection.entries[0][key]=draft[key]||'';
    }
    const animationField=()=>`<fieldset class="hm-animation-choice"><legend>Animation in der Übersicht</legend>${[['auto','Animation startet sofort'],['manual','Animation erst per Play starten']].map(([value,label])=>`<label><input type="radio" name="animationStart" value="${value}"${(draft.animationStart||'auto')===value?' checked':''}> ${label}</label>`).join('')}</fieldset>`;
    const summaryFields=()=>animationField()+field('Obere Themenzeile','kicker',draft.kicker)+field('Hauptüberschrift','title',draft.title)+field('Unterüberschrift','subtitle',draft.subtitle)+field(page==='home'?'Hinweistext':'Begleittext','text',draft.text,true)+field('Button-Beschriftung','mediaButtonLabel',draft.mediaButtonLabel||'Beitrag ansehen');
    function render(){
      const dateField=page==='aktuell'?`<label class="field"><span>Veröffentlichungsdatum</span><input type="date" name="date" value="${esc(draft.date||draft.mediaCollection.entries[0]?.date)}"></label>`:'';
      const posts=()=>draft.mediaCollection.entries.map((entry,i)=>`<section class="hm-edit-entry"><h3>Beitrag ${i+1}</h3>${field('Obere Themenzeile',`entry_${i}_kicker`,entry.kicker ?? draft.kicker)}${field('Überschrift',`entry_${i}_title`,entry.title)}${field('Unterüberschrift (freiwillig)',`entry_${i}_subtitle`,entry.subtitle)}<label class="field"><span>Datum</span><input type="date" name="entry_${i}_date" value="${esc(entry.date)}"></label>${field('Begleittext',`entry_${i}_text`,entry.text,true)}${formats(entry,i)}${field('Instagram-Link (freiwillig)',`entry_${i}_instagramUrl`,entry.instagramUrl)}${pictures(entry,i)}<div class="hm-entry-actions"><button type="button" class="btn small" data-hm-entry-move="${i}:-1"${i===0?' disabled':''}>Beitrag nach oben</button><button type="button" class="btn small" data-hm-entry-move="${i}:1"${i===draft.mediaCollection.entries.length-1?' disabled':''}>Nach unten</button><button type="button" class="link" data-hm-entry-remove="${i}">Beitrag entfernen</button></div></section>`).join('')+'<button type="button" class="btn block" data-hm-add>Beitrag hinzufügen</button>';
      const singleFields=()=>summaryFields()+dateField+formats(draft.mediaCollection.entries[0],0)+pictures(draft.mediaCollection.entries[0],0)+field('Instagram-Link (freiwillig)','entry_0_instagramUrl',draft.mediaCollection.entries[0].instagramUrl);
      ui.openSheet(`<form class="editor hm-editor" data-hm-editor novalidate><h2>${page==='aktuell'?(draft._new?'Karussell hinzufügen':'Karussell bearbeiten'):(draft._new?'Medien-Collage hinzufügen':'Medien-Collage bearbeiten')}</h2>${single?'':`<div class="ed-tabs"><button type="button" data-hm-tab="home" class="${tab==='home'?'on':''}">${page==='home'?'Startseite':'News-Übersicht'}</button><button type="button" data-hm-tab="posts" class="${tab==='posts'?'on':''}">Beiträge</button></div>`}${single?singleFields():tab==='home'?summaryFields()+dateField:posts()}<p class="form-error" role="alert"></p><button type="submit" class="btn primary block">Speichern</button><button type="button" class="btn block danger" data-hm-delete>${armed?'Wirklich löschen?':page==='aktuell'?'Karussell löschen':'Thema löschen'}</button></form>`);
      const form=document.querySelector('[data-hm-editor]');
      form.addEventListener('click',async event=>{
        const b=event.target.closest('button');if(!b||busy)return;collect();
        if(b.dataset.hmTab){tab=b.dataset.hmTab;render();}
        else if(b.hasAttribute('data-hm-add')){if(draft.mediaCollection.entries.length>=50)return;draft.mediaCollection.entries.push({id:crypto.randomUUID(),kicker:draft.kicker||'',title:'',subtitle:'',date:new Date().toISOString().slice(0,10),text:'',format:'4:5',images:[],instagramUrl:''});render();}
        else if(b.dataset.hmRemove){const[i,j]=b.dataset.hmRemove.split(':').map(Number);draft.mediaCollection.entries[i].images.splice(j,1);render();}
        else if(b.dataset.hmMove){const[i,j,d]=b.dataset.hmMove.split(':').map(Number),a=draft.mediaCollection.entries[i].images;[a[j],a[j+d]]=[a[j+d],a[j]];render();}
        else if(b.dataset.hmEntryRemove){draft.mediaCollection.entries.splice(Number(b.dataset.hmEntryRemove),1);render();}
        else if(b.dataset.hmEntryMove){const[i,d]=b.dataset.hmEntryMove.split(':').map(Number),a=draft.mediaCollection.entries;[a[i],a[i+d]]=[a[i+d],a[i]];render();}
        else if(b.hasAttribute('data-hm-delete')){if(!armed){armed=true;b.textContent='Wirklich löschen?';return;}busy=true;try{await onDelete();ui.closeSheet();}catch(err){form.querySelector('.form-error').textContent=err.message;busy=false;}}
      });
      form.addEventListener('change',async event=>{
        const input=event.target;if(!input.matches('[data-hm-upload]')||!input.files.length||busy)return;collect();
        if(draft.mediaCollection.entries.reduce((sum,e)=>sum+e.images.length,0)+input.files.length>100){form.querySelector('.form-error').textContent='Pro Sammlung sind höchstens 100 Bilder möglich.';return;}
        busy=true;form.querySelector('[type=submit]').disabled=true;
        try{const refs=await uploadFiles([...input.files]);if(!form.isConnected)return;draft.mediaCollection.entries[Number(input.dataset.hmUpload)].images.push(...refs);busy=false;render();}catch(err){form.querySelector('.form-error').textContent=err.message;busy=false;form.querySelector('[type=submit]').disabled=false;}
      });
      form.addEventListener('submit',async event=>{
        event.preventDefault();if(busy)return;collect();const error=form.querySelector('.form-error');
        if(!draft.title){error.textContent='Bitte eine Hauptüberschrift eingeben.';return;}
        if(page==='aktuell'&&!TFB.newsroom.validDate(draft.date)){error.textContent='Bitte ein Veröffentlichungsdatum wählen.';return;}
        if(!draft.mediaCollection.entries.length||draft.mediaCollection.entries.some(e=>!e.title||!e.images.length)){error.textContent='Jeder Beitrag braucht eine Überschrift und mindestens ein Bild.';return;}
        if(draft.mediaCollection.entries.some(e=>e.instagramUrl&&!link(e.instagramUrl))){error.textContent='Bitte einen gültigen Instagram-Link mit https:// eingeben.';return;}
        busy=true;form.querySelector('[type=submit]').disabled=true;
        try{delete draft._new;draft.navigation='detail';draft.image=draft.mediaCollection.entries[0].images[0];await onSave(draft);ui.closeSheet();}catch(err){error.textContent=err.message;busy=false;form.querySelector('[type=submit]').disabled=false;}
      });
    }
    render();
  }
  TFB.homeMedia={cover,detail,fresh,openEditor};
})();
