// Editorial media collections: the existing Home feature shell remains unchanged.
(function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const entries = block => (block.mediaCollection?.entries || []).filter(entry => entry.title);
  const photos = block => block.mediaCollection?.entries.flatMap(entry => entry.images || []) || block.images || [];
  const source = (ref, imageOf) => imageOf(ref) || ref;
  const image = (ref, imageOf, alt = '', lead = false, defer = false) => `<img ${defer?'data-hm-src':'src'}="${esc(source(ref,imageOf))}" alt="${esc(alt)}" loading="${lead?'eager':'lazy'}" fetchpriority="${lead?'high':'low'}" decoding="async">`;
  const link = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
  const magnifier='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path></svg>';
  const playbackIcon = playing => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${playing?'<rect x="7" y="5" width="3.5" height="14" rx=".7"/><rect x="13.5" y="5" width="3.5" height="14" rx=".7"/>':'<path d="M8 5.5v13l10-6.5z"/>'}</svg>`;
  let zoom=null;
  function cover(block, href, imageOf, homeLead = null) {
    const caption = entries(block)[0]?.title || block.title || '';
    const refs = homeLead === null && block.mediaCollection ? entries(block)[0]?.images || [] : photos(block);
    const manual=block.animationStart==='manual';
    if (!refs.length) return `<div class="feature-media hm-empty">Noch keine Bilder veröffentlicht.</div>`;
    return `<div class="feature-media hm-orbit" data-hm-orbit data-hm-start="${block.animationStart==='manual'?'manual':'auto'}" aria-label="Karussell zu ${esc(block.title)}"><div class="hm-stage">${refs.map((ref,i) => {
      const tag = href ? 'a' : 'div';
      return `<${tag} class="hm-card"${href ? ` href="${esc(href)}" aria-label="Bild ${i+1}: Unterseite öffnen"` : ''}>${image(ref,imageOf,caption,i===0&&homeLead!==false,homeLead!==null&&(!homeLead||i>0))}</${tag}>`;
    }).join('')}</div><div class="hm-footer">${href ? `<a class="hm-caption" href="${esc(href)}"><span>${esc(caption)}</span></a>` : `<span class="hm-caption">${esc(caption)}</span>`}<button type="button" class="hm-zoom-button" aria-label="Karussell vergrößern" title="Karussell vergrößern">${magnifier}</button><button type="button" class="hm-pause" aria-label="${manual?'Bildbewegung starten':'Bildbewegung pausieren'}" aria-pressed="${manual}"${refs.length<2?' hidden':''}>${playbackIcon(!manual)}</button></div></div>`;
  }
  function slideshow(studio, block, imageOf, animationStart = 'auto', firstPriority = 'lazy') {
    const sizes = {'4:5':[4,5],'9:16':[9,16],'16:9':[16,9],'5:4':[5,4]};
    const groups = block.mediaCollection?.entries || [{images:photos(block), format:block.photoFormat}];
    const designs = groups.flatMap(entry => {
      const [w,h] = sizes[entry.format] || sizes['4:5'];
      return (entry.images || []).map(ref => studio.mediaDesign(ref,w,h));
    });
    return designs.length ? studio.publishedGallery({
      id: `home-media-${block.id}`, photoView:'carousel', animationStart, compactControls:true, photoSlideshow:true, designs, firstPriority,
    }, ref => source(ref,imageOf)) : '';
  }
  async function detail(block, { imageOf, paragraphs, renderTextSections, admin, page='home', backHref, links = '', extraPhotos = '' }) {
    const studio = await import('./chat-media.js?v=20261114-home-formats-1');
    const list = block.mediaCollection ? entries(block) : [{
      title: block.title, subtitle: block.subtitle, date: TFB.newsroom.creationDate(block),
      text: block.text, sections: block.more?.sections, images: photos(block),
    }];
    const gallery = slideshow(studio, block, imageOf);
    const markup = (entry,index) => {
      const url = link(entry.instagramUrl);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') ? new Date(entry.date+'T12:00:00').toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) : '';
      return `<section class="hm-entry-copy"><p class="hm-entry-date">${date?`<time datetime="${esc(entry.date)}">${esc(date)}</time> · `:''}${entry.images.length} ${entry.images.length === 1 ? 'Foto' : 'Fotos'}</p>${(entry.kicker ?? block.kicker) ? `<p class="feature-kicker hm-entry-kicker"><span class="signature-highlight">${esc(entry.kicker ?? block.kicker)}</span></p>` : ''}<${index===0?'h1':'h2'}>${esc(entry.title)}</${index===0?'h1':'h2'}>${entry.subtitle?`<p class="hm-entry-intro"><span class="signature-highlight">${esc(entry.subtitle)}</span></p>`:''}${entry.sections?.some(section => section.text?.trim()) ? renderTextSections(entry.sections) : paragraphs(!block.mediaCollection || block.mediaSingle ? entry.text || block.text : entry.text)}${url?`<a class="more-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Auf Instagram ansehen ↗</a>`:''}</section>`;
    };
    return `<section class="hm-collection"><div class="story-tools">${admin?`<button type="button" class="view-close" data-action="feature-edit" data-page="${esc(page)}" data-id="${esc(block.id)}" aria-label="Unterseite bearbeiten">${TFB.ui.icon.pencil}</button>`:''}<a class="view-close" href="${esc(backHref||'#'+page)}" aria-label="${backHref?'Zurück zum Clubarchiv':page==='home'?'Zurück zur Startseite':'Zurück zu Aktuell'}">${TFB.ui.icon.close}</a></div>${gallery || list.length ? `<article class="hm-entry"><div class="hm-entry-gallery">${gallery}</div><div>${list.map(markup).join('')}</div></article>` : ''}
      ${links ? `<div class="story-links">${links}</div>` : ''}
      ${extraPhotos}`;
  }
  // Blend complete paint orders on one stable drawing surface. Every picture is
  // opaque in both orders: exposed edges remain visible while overlap changes.
  function createOrbitPainter(node,cards) {
    const canvas=document.createElement('canvas'),a=document.createElement('canvas'),b=document.createElement('canvas');
    const out=canvas.getContext('2d'),left=a.getContext('2d'),right=b.getContext('2d');
    if(!out||!left||!right)return null;
    canvas.className='hm-paint';canvas.setAttribute('aria-hidden','true');
    node.querySelector('.hm-stage').prepend(canvas);
    // The fullscreen stage needs a larger pixel budget to stay sharp on Retina displays.
    const pixelBudget=node.classList.contains('hm-zoom-orbit')?12000000:3000000;
    let width=0,height=0,ratio=1,top=0;
    const rounded=(ctx,x,y,w,h,r)=>{
      ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
    };
    function draw(ctx,order,poses,w,h){
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
      for(const i of order){
        const img=cards[i].querySelector('img');if(cards[i].dataset.hmLoaded!=='true'||!img.naturalWidth)continue;
        const pose=poses[i],cw=pose.width,ch=cw*5/4;
        ctx.save();ctx.translate(w/2+pose.x,top+pose.y);ctx.rotate(pose.angle*Math.PI/180);ctx.scale(pose.scale,pose.scale);
        ctx.shadowColor='#0006';ctx.shadowBlur=26*ratio;ctx.shadowOffsetY=12*ratio;
        rounded(ctx,-cw/2,-ch/2,cw,ch,5);ctx.fillStyle='#302d2a';ctx.fill();
        ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
        rounded(ctx,-cw/2,-ch/2,cw,ch,5);ctx.clip();
        const fit=Math.min(cw/img.naturalWidth,ch/img.naturalHeight),iw=img.naturalWidth*fit,ih=img.naturalHeight*fit;
        ctx.drawImage(img,-iw/2,-ih/2,iw,ih);ctx.restore();
      }
    }
    return {
      render(poses,before,after,weight,w,h){
        if(w!==width||h!==height){
          width=w;height=h;ratio=Math.min(devicePixelRatio||1,2,Math.sqrt(pixelBudget/Math.max(1,w*h)));
          for(const surface of [canvas,a,b]){surface.width=Math.max(1,Math.round(w*ratio));surface.height=Math.max(1,Math.round(h*ratio));}
          left.imageSmoothingQuality=right.imageSmoothingQuality='high';
          top=parseFloat(getComputedStyle(cards[0]).top)||h*.48;
        }
        draw(left,before,poses,w,h);
        out.setTransform(1,0,0,1,0,0);out.clearRect(0,0,canvas.width,canvas.height);
        out.globalCompositeOperation='source-over';out.globalAlpha=1;out.drawImage(a,0,0);
        if(weight>0){
          draw(right,after,poses,w,h);
          // Premultiplied addition keeps shared opaque picture coverage opaque;
          // source-over fades would expose the backdrop at the halfway point.
          out.clearRect(0,0,canvas.width,canvas.height);out.globalAlpha=1-weight;out.drawImage(a,0,0);
          out.globalCompositeOperation='lighter';out.globalAlpha=weight;out.drawImage(b,0,0);
          out.globalCompositeOperation='source-over';out.globalAlpha=1;
        }
        node.classList.add('hm-painted');
      },
      destroy(){canvas.remove();a.width=a.height=b.width=b.height=1;node.classList.remove('hm-painted');}
    };
  }
  const mounted = new WeakSet(), controllers = new Set();
  function mountOrbit(node,initial={}) {
    const cards = [...node.querySelectorAll('.hm-card')], n = cards.length, button = node.querySelector('.hm-pause'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let phase=Number(initial.phase)||0,timer=0,frame=0,visible=false,hover=false,focused=false,paused=initial.paused===undefined?node.dataset.hmStart==='manual':Boolean(initial.paused);
    const enlarged=node.classList.contains('hm-zoom-orbit'), hoverable=matchMedia('(hover: hover) and (pointer: fine)');
    let keyboard=false,allowMotion=Boolean(initial.allowMotion);
    const motionBlocked=()=>reduced.matches&&!allowMotion;
    const loaded=cards.map(()=>false),painter=createOrbitPainter(node,cards);
    const nextImagesReady=()=>loaded[Math.floor(phase)%n]&&loaded[(Math.floor(phase)+1)%n];
    const depthOrder = at => cards.map((_,i)=>({i,depth:Math.cos(2*Math.PI*(i-at-.00001)/n)})).sort((a,b)=>a.depth-b.depth||a.i-b.i).map(x=>x.i);
    const layout = () => {
      const w=node.clientWidth,h=node.clientHeight,percent=n===1?64:n===2?54:n===3?50:48;
      const cardWidth=enlarged?Math.min(w*(w<h?.82:percent/100),h*(n===1?.84:.66)*4/5)+'px':node.closest('.media-news')?Math.min(w*percent/100,h*(n===1?.88:.72)*4/5)+'px':percent+'%';
      const step=Math.floor(phase),progress=phase-step,before=depthOrder(step),after=depthOrder(step+1),order=progress<.5?before:after;
      const poses=cards.map((card,i)=>{
        const angle=2*Math.PI*(i-phase)/n,c=Math.cos(angle),sin=Math.sin(angle);
        const pose={x:sin*w*.285,y:-(1-c)*h*.13,angle:-sin*10,scale:.58+.42*(c+1)/2,width:cardWidth.endsWith('%')?w*parseFloat(cardWidth)/100:parseFloat(cardWidth)};
        card.style.width=cardWidth;
        card.style.transform=`translate(-50%,-50%) translate(${pose.x}px,${pose.y}px) rotate(${pose.angle}deg) scale(${pose.scale})`;
        card.style.zIndex=String(order.indexOf(i)+1);card.style.opacity='1';
        return pose;
      });
      const mix=progress*progress*(3-2*progress);
      painter?.render(poses,before,after,reduced.matches?0:mix,w,h);
      node.dataset.hmOrder=order.join(',');node.dataset.hmPhase=String(phase);node.dataset.hmReady='true';
    };
    const stop = () => {clearTimeout(timer);cancelAnimationFrame(frame);node.dataset.hmRunning='false';};
    const canRun = () => n>1&&node.isConnected&&visible&&!document.body.classList.contains('tfb-splash-open')&&nextImagesReady()&&!document.hidden&&!motionBlocked()&&(enlarged||!hover&&!focused)&&!paused&&(!zoom||zoom.node===node);
    const sync = (delay=3000) => {stop();button.setAttribute('aria-pressed',String(paused||motionBlocked()));button.setAttribute('aria-label',paused||motionBlocked()?'Bildbewegung starten':'Bildbewegung pausieren');const playing=!(paused||motionBlocked());if(button.dataset.hmPlaying!==String(playing)){button.innerHTML=playbackIcon(playing);button.dataset.hmPlaying=String(playing);}button.disabled=false;if(!canRun())return;node.dataset.hmRunning='true';timer=setTimeout(()=>{const start=performance.now(),from=phase,to=Math.floor(phase+.0001)+1;const tick=now=>{if(!canRun()){stop();return;}const t=Math.min(1,(now-start)/1600);phase=from+(to-from)*t*t*(3-2*t);layout();if(t<1)frame=requestAnimationFrame(tick);else{phase=to%n;layout();sync(2100);}};frame=requestAnimationFrame(tick);},delay);};
    button.addEventListener('click',()=>{if(motionBlocked()){allowMotion=true;paused=false;}else paused=!paused;hover=false;sync();});
    node.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&hoverable.matches){hover=true;sync();}});
    node.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;sync();}});
    const focus=()=>{focused=keyboard&&node.contains(document.activeElement)&&document.activeElement!==button&&document.activeElement!==node.querySelector('.hm-zoom-button');sync();};
    node.addEventListener('focusin',focus);node.addEventListener('focusout',()=>queueMicrotask(focus));
    const keyInput=e=>{if(e.key==='Tab'){keyboard=true;focus();}};
    const pointerInput=e=>{keyboard=false;if(e.pointerType!=='mouse')hover=false;focus();};
    document.addEventListener('keydown',keyInput);document.addEventListener('pointerdown',pointerInput);
    function loadNextImage() {
      if ((!visible && !enlarged) || document.body.classList.contains('tfb-splash-open')) return;
      const images = [...node.querySelectorAll('.hm-card img')];
      if (images.some(img => img.hasAttribute('src') && !img.complete)) return;
      const next = images.find(img => img.dataset.hmSrc);
      if (!next) return;
      next.loading = 'eager';
      next.src = next.dataset.hmSrc;
      delete next.dataset.hmSrc;
    }
    const intersection=new IntersectionObserver(rows=>{const next=rows[0].isIntersecting;if(visible===next)return;visible=next;loadNextImage();sync();},{threshold:.15});intersection.observe(node);
    const resize=new ResizeObserver(layout);resize.observe(node);
    const changed=()=>{allowMotion=false;if(reduced.matches){phase=Math.round(phase)%n;layout();}sync();};
    const visibility=()=>sync();reduced.addEventListener('change',changed);document.addEventListener('visibilitychange',visibility);
    cards.forEach((card,i)=>{
      const img=card.querySelector('img');
      const reveal=async()=>{
        if(loaded[i]||!img.naturalWidth)return;
        try{await img.decode();}catch{return;}
        if(!node.isConnected)return;
        loaded[i]=true;card.dataset.hmLoaded='true';layout();
        // Keep the current picture until its successor can actually be drawn.
        if(node.dataset.hmRunning!=='true')sync();
      };
      img.addEventListener('load', () => { reveal(); loadNextImage(); });
      img.addEventListener('error', loadNextImage);
      if(img.complete)queueMicrotask(reveal);
    });
    layout();loadNextImage();sync();return {node,getState:()=>({phase,paused,allowMotion}),setState(state){phase=state.phase;paused=state.paused;allowMotion=Boolean(state.allowMotion);layout();sync();},refresh(){loadNextImage();sync();},destroy(){stop();painter?.destroy();document.removeEventListener('keydown',keyInput);document.removeEventListener('pointerdown',pointerInput);intersection.disconnect();resize.disconnect();reduced.removeEventListener('change',changed);document.removeEventListener('visibilitychange',visibility);}};
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
    const enlarged=node.cloneNode(true);enlarged.className='hm-orbit hm-zoom-orbit';enlarged.querySelectorAll('.hm-paint,.hm-transition-card,.hm-zoom-button').forEach(el=>el.remove());
    enlarged.querySelectorAll('img').forEach(img=>img.loading='eager');
    const close=document.createElement('button');close.type='button';close.className='hm-zoom-close';close.setAttribute('aria-label','Große Ansicht schließen');close.textContent='×';
    dialog.append(enlarged,close);document.body.append(dialog);document.body.classList.add('hm-zoom-open');dialog.showModal();
    mounted.add(enlarged);const controller=mountOrbit(enlarged,source.getState());zoom={dialog,node:enlarged,controller,source,trigger};controllers.add(controller);
    for(const c of controllers)c.refresh?.();
    close.addEventListener('click',()=>closeZoom());dialog.addEventListener('cancel',e=>{e.preventDefault();closeZoom();});
    dialog.addEventListener('click', e => {
      if (e.target.closest('a.hm-card,a.hm-caption')) closeZoom(false);
      else if (!e.target.closest('button')) closeZoom();
    });
    close.focus({preventScroll:true});
  }
  document.addEventListener('click',e=>{const trigger=e.target.closest('.hm-zoom-button');if(trigger){e.preventDefault();e.stopPropagation();openZoom(trigger);}});
  window.addEventListener('hashchange',()=>closeZoom(false));

  let queued=false;
  function hydrate(){queued=false;for(const c of controllers)if(!c.node.isConnected){c.destroy();controllers.delete(c);}document.querySelectorAll('[data-hm-orbit]').forEach(node=>{if(mounted.has(node))return;mounted.add(node);controllers.add(mountOrbit(node));});}
  new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(hydrate);}}).observe(document.getElementById('app'),{childList:true,subtree:true});

  TFB.resumeHomeMedia = () => { for (const controller of controllers) controller.refresh?.(); };

  function fresh() { return {title:'Einblicke in unser Projekt.',intro:'',entries:[]}; }
  function openEditor(original, {imageOf,uploadFiles,cover4kField,links,onSave,onDelete,deleteArticle,editor,startTab,page='home'}) {
    const ui=TFB.ui,draft=structuredClone(original),single=page==='aktuell'&&draft.mediaSingle;
    if (!draft.mediaCollection.entries.length) draft.mediaCollection.entries.push({
      id: crypto.randomUUID(), title: draft.title || '', images: [], format: '4:5',
    });
    let tab=startTab==='sub'?'posts':'home',busy=false,armed=false;
    const fieldOwner = name => {
      const match = /^entry_(\d+)_section_(\d+)$/.exec(name);
      return match ? draft.mediaCollection.entries[Number(match[1])]?.sections?.[Number(match[2])] : draft;
    };
    const entrySections = entry => {
      if (!entry.sections) entry.sections = single && entry.text === draft.text ? [] : editor.legacySections(entry);
      return entry.sections;
    };
    const contentFields = (entry, i) => editor.sections(entrySections(entry), `entry_${i}_section_`);
    const entryPhotos = (entry,i) => formats(entry,i) + pictures(entry,i) +
      field('Instagram-Link',`entry_${i}_instagramUrl`,entry.instagramUrl);
    let linksOpen = Boolean(draft.link?.url || draft.link2?.url);
    const limit = TFB.newsroom.CAROUSEL_LIMIT;
    const photoCount = () => draft.mediaCollection.entries.reduce((count, entry) => count + entry.images.length, 0);
    const field = (label, name, value, type = 'text') => `<label class="field"><span>${label}</span><input type="${type}" name="${name}" value="${esc(value)}"></label>`;
    const formats=(entry,i)=>`<label class="field"><span>Bildformat</span><select name="entry_${i}_format">${['4:5','9:16','16:9','5:4'].map(format=>`<option${entry.format===format?' selected':''}>${format}</option>`).join('')}</select></label>`;
    const pictures=(entry,i)=>`<div class="gallery-edit">${entry.images.map((ref,j)=>`<div class="gallery-thumb">${image(ref,imageOf)}<button type="button" data-hm-remove="${i}:${j}" aria-label="Bild entfernen">×</button><span class="thumb-move"><button type="button" data-hm-move="${i}:${j}:-1"${j===0?' disabled':''} aria-label="Bild nach vorne">‹</button><button type="button" data-hm-move="${i}:${j}:1"${j===entry.images.length-1?' disabled':''} aria-label="Bild nach hinten">›</button></span></div>`).join('')}${photoCount() < limit ? `<label class="gallery-add">${ui.icon.camera}<span>Bilder hinzufügen</span><input type="file" accept="image/*" multiple data-hm-upload="${i}" hidden></label>` : ''}</div>`;
    function collect(){
      const form=document.querySelector('[data-hm-editor]');if(!form)return;
      for(const key of ['title','kicker','subtitle','text','mediaButtonLabel','date'])if(form.elements[key])draft[key]=form.elements[key].value.trim();
      links?.read(form, draft);
      editor.readTitleTarget(form, draft);
      if(form.elements.animationStart)draft.animationStart=form.elements.animationStart.value;
      if(form.elements.allow4k)draft.allow4k=form.elements.allow4k.checked;
      draft.mediaCollection.entries.forEach((entry,i)=>{
        for(const key of ['kicker','title','subtitle','date','format','instagramUrl'])if(form.elements[`entry_${i}_${key}`])entry[key]=form.elements[`entry_${i}_${key}`].value.trim();
        if (form.querySelector(`[data-hm-entry="${i}"]`)) {
          entry.sections = editor.readSections(form, entrySections(entry), `entry_${i}_section_`);
          if (entry.sections.some(section => section.text.trim()) || !single) {
            entry.text = entry.sections.filter(section => section.type === 'text').map(section => section.text).join('\n\n');
          } else { entry.text = ''; }
        }
      });
      if(single) {
        const entry = draft.mediaCollection.entries[0];
        for(const key of ['title','kicker','subtitle']) entry[key]=draft[key]||'';
      }
    }
    const animationField=()=>`<fieldset class="hm-animation-choice"><legend>Animation in der Übersicht</legend>${[['auto','Animation startet sofort'],['manual','Animation erst per Play starten']].map(([value,label])=>`<label><input type="radio" name="animationStart" value="${value}"${(draft.animationStart||'auto')===value?' checked':''}> ${label}</label>`).join('')}</fieldset>`;
    const summaryFields=()=>animationField()+(ui.state.member?.isAdmin?cover4kField(draft,page==='home',true):'')+field('Obere Themenzeile','kicker',draft.kicker)+field('Hauptüberschrift','title',draft.title)+field('Unterüberschrift','subtitle',draft.subtitle)+editor.text('Kurztext','text',draft.text)+field('Button-Beschriftung','mediaButtonLabel',draft.mediaButtonLabel||'Beitrag ansehen');
    function render(){
      const date = TFB.newsroom.creationDate(draft);
      const dateField = page === 'aktuell' && date ? `<p class="muted small">Erstellt am <time datetime="${esc(date)}">${new Date(date+'T12:00:00').toLocaleDateString('de-DE')}</time></p>` : '';
      const linkControls = !links ? '' : linksOpen
        ? '<h3 class="editor-sub">Links</h3>' + links.fields(draft)
        : '<button type="button" class="btn small" data-hm-links>Link hinzufügen</button>';
      const entries = draft.mediaCollection.entries;
      const details = () => entries.map((entry,i)=>`<section class="hm-edit-entry" data-hm-entry="${i}">
        ${single ? '<p class="ed-hint">Titel kommt aus der Übersicht. Ohne eigenen Inhalt erscheint hier der Kurztext.</p>' : `
          ${entries.length > 1 ? `<h3>Fotos und Text ${i+1}</h3>` : ''}
          ${field('Kleine Zeile darüber',`entry_${i}_kicker`,entry.kicker ?? draft.kicker)}
          ${field('Überschrift',`entry_${i}_title`,entry.title)}
          ${field('Unterüberschrift',`entry_${i}_subtitle`,entry.subtitle)}
          ${field('Datum',`entry_${i}_date`,entry.date,'date')}`}
        ${entryPhotos(entry,i)}
        <h3 class="editor-sub">Inhalt</h3>${contentFields(entry,i)}
        </section>`).join('');
      ui.openSheet(`<form class="editor hm-editor" data-hm-editor novalidate>
        <h2>Karussell ${draft._new?'hinzufügen':'bearbeiten'}</h2>
        <div class="ed-tabs" role="tablist" aria-label="Ansicht bearbeiten">
          <button type="button" role="tab" data-hm-tab="home" aria-selected="${tab==='home'}" class="${tab==='home'?'on':''}">Übersicht</button>
          <button type="button" role="tab" data-hm-tab="posts" aria-selected="${tab==='posts'}" class="${tab==='posts'?'on':''}">Unterseite</button>
        </div>
        ${tab==='home'?summaryFields()+dateField+linkControls+(page==='home'?editor.titleTargetField(draft):''):details()}
        <p class="form-error" role="alert"></p><button type="submit" class="btn primary block">Speichern</button>
        ${deleteArticle || ''}
        ${onDelete ? `<button type="button" class="btn block danger" data-hm-delete>${armed ? 'Archivieren bestätigen' : 'Ins Clubarchiv verschieben'}</button>` : ''}
        </form>`);
      const form=document.querySelector('[data-hm-editor]');
      editor.bind(form, draft, [], fieldOwner);
      form.addEventListener('click',async event=>{
        const b=event.target.closest('button');if(!b||busy||b.closest('.rich-tools'))return;collect();
        if (editor.isSectionsClick(event)) {
          const entry = entries[Number(b.closest('[data-hm-entry]').dataset.hmEntry)];
          if (editor.sectionsClick(event, entrySections(entry))) render();
        }
        else if (b.hasAttribute('data-hm-links')) { linksOpen = true; render(); }
        else if (b.dataset.linkkind) { links.switchTarget(draft, b.dataset.linkfor, b.dataset.linkkind === 'app'); render(); }
        else if (b.dataset.linkCrop) { links.crop(draft[b.dataset.linkCrop], b, render); }
        else if(b.dataset.hmTab){tab=b.dataset.hmTab;render();}
        else if(b.dataset.hmRemove){const[i,j]=b.dataset.hmRemove.split(':').map(Number);draft.mediaCollection.entries[i].images.splice(j,1);render();}
        else if(b.dataset.hmMove){const[i,j,d]=b.dataset.hmMove.split(':').map(Number),a=draft.mediaCollection.entries[i].images;[a[j],a[j+d]]=[a[j+d],a[j]];render();}
        else if(b.hasAttribute('data-hm-delete')){if(!armed){armed=true;b.textContent='Archivieren bestätigen';return;}busy=true;try{await onDelete();ui.closeSheet();}catch(err){form.querySelector('.form-error').textContent=err.message;busy=false;}}
      });
      form.addEventListener('change',async event=>{
        const input=event.target;
        if (busy) return;
        if (input.matches('[data-link-refresh]')) { collect(); render(); return; }
        if (input.dataset.linkPhoto && input.files.length) {
          collect();
          busy = true;
          const submit = form.querySelector('[type=submit]');
          submit.disabled = true;
          try {
            const [image] = await uploadFiles([input.files[0]]);
            if (form.isConnected) {
              Object.assign(draft[input.dataset.linkPhoto], {image, crop:null, appearance:'photo'});
              render();
            }
          } catch (error) { ui.toast(error.message); }
          finally { busy = false; submit.disabled = false; }
          return;
        }
        if(!input.matches('[data-hm-upload]')||!input.files.length)return;collect();
        const index=Number(input.dataset.hmUpload);
        const entry=draft.mediaCollection.entries[index];
        if (photoCount() + input.files.length > limit) {
          form.querySelector('.form-error').textContent = `Die Diashow kann höchstens ${limit} Fotos enthalten.`;
          input.value = '';
          return;
        }
        busy=true;form.querySelector('[type=submit]').disabled=true;
        const allIn4k=page==='home'&&draft.allow4k===true;
        const firstIs4kCover=index===0&&entry.images.length===0&&draft.allow4k===true;
        try{const refs=await uploadFiles([...input.files],firstIs4kCover,allIn4k,page==='home');if(!form.isConnected)return;entry.images.push(...refs);busy=false;render();}catch(err){form.querySelector('.form-error').textContent=err.message;busy=false;form.querySelector('[type=submit]').disabled=false;}
      });
      form.addEventListener('submit',async event=>{
        event.preventDefault();if(busy)return;collect();const error=form.querySelector('.form-error');
        if (links && !links.validate(form, draft)) return;
        if (!editor.validateTitleTarget(form, draft)) {
          if (tab !== 'home') { tab = 'home'; render(); editor.validateTitleTarget(document.querySelector('[data-hm-editor]'), draft); }
          return;
        }
        if(!draft.title){error.textContent='Bitte eine Hauptüberschrift eingeben.';return;}
        if(!draft.mediaCollection.entries.length||draft.mediaCollection.entries.some(e=>!e.title||!e.images.length)){if(tab!=='posts'){tab='posts';render();}
          document.querySelector('[data-hm-editor] .form-error').textContent='Bitte eine Überschrift und mindestens ein Foto für die Unterseite hinzufügen.';return;}
        if(draft.mediaCollection.entries.some(e=>e.instagramUrl&&!link(e.instagramUrl))){
          if(tab!=='posts'){tab='posts';render();}
          document.querySelector('[data-hm-editor] .form-error').textContent='Bitte einen gültigen Instagram-Link mit https:// eingeben.';
          return;
        }
        busy=true;form.querySelector('[type=submit]').disabled=true;
        try{delete draft._new;draft.navigation='detail';draft.image=draft.mediaCollection.entries[0].images[0];await onSave(draft);ui.closeSheet();}catch(err){error.textContent=err.message;busy=false;form.querySelector('[type=submit]').disabled=false;}
      });
    }
    render();
  }
  TFB.homeMedia={cover,detail,slideshow,photos,fresh,openEditor};
})();
