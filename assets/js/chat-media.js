const fonts = { title: 'Bricolage Grotesque', body: 'DM Sans', mono: 'Space Mono' };
const logos = {
  rot: { label: 'TFB · Signature Rot', src: 'assets/brand/tfb-logo-signature-red.png' },
  gelb: { label: 'TFB · Signature Gelb', src: 'assets/brand/tfb-logo-midnight-amber.png' },
  padel: { label: 'Padel Bielstein', src: 'assets/brand/padel-bielstein-logo.png' },
};
const textLabels = ['Überschrift', 'Unterüberschrift'];
const layerLabel = index => textLabels[index] || `Text ${index + 1}`;
const emphasis = { bold: 'Fett', italic: 'Kursiv', underline: 'Unterstrichen' };
const alignments = { left: 'Links', center: 'Mittig', right: 'Rechts' };
const newLayer = index => ({
  text: '', font: index === 0 ? 'title' : 'body', size: index === 0 ? 8 : 5,
  opacity: 100, color: '#ffffff', x: 94, y: index === 0 ? 82 : 90,
  align: 'right', spacing: 0, bold: index === 0, italic: false, underline: false,
});
const formats = ['4 / 5', '16 / 9', '9 / 16'];
const makeSlide = (source, kind = 'image') => ({
  source, kind, format: '4 / 5', x: 50, y: 50, zoom: 1,
  top: { strength: 0, height: 36 }, bottom: { strength: 0, height: 36 },
  layers: [], logo: '', logoX: 79, logoY: 14, logoSize: 25,
});
const esc = value => TFB.ui.esc(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const blobUrls = new WeakMap();
function sourceOf(source) {
  if (typeof source === 'string') return source;
  if (!blobUrls.has(source)) blobUrls.set(source, URL.createObjectURL(source));
  return blobUrls.get(source);
}
const releaseSource = source => {
  if (typeof source === 'string' || !blobUrls.has(source)) return;
  URL.revokeObjectURL(blobUrls.get(source));
  blobUrls.delete(source);
};

function prepareVideoFrame(video) {
  return new Promise(resolve => {
    let captureTimer;
    const stop = () => {
      clearTimeout(timeout);
      clearTimeout(captureTimer);
      video.removeEventListener('loadedmetadata', seek);
      video.removeEventListener('seeked', afterSeek);
      video.removeEventListener('error', stop);
      resolve();
    };
    const capture = () => {
      try {
        if (!video.videoWidth || !video.videoHeight) return;
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL('image/jpeg', .85);
      } catch (_) { /* The decoded video remains available even if capture fails. */ }
      finally { stop(); }
    };
    const seek = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) { stop(); return; }
      video.currentTime = Math.min(.3, video.duration / 2);
    };
    // WebKit can signal seeked before the paused frame is ready for canvas.
    const afterSeek = () => { captureTimer = setTimeout(capture, 150); };
    const timeout = setTimeout(stop, 4000);
    video.addEventListener('error', stop, {once:true});
    video.addEventListener('seeked', afterSeek, {once:true});
    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, {once:true});
  });
}

const videoLoads = new WeakMap();
const editorFrames = new WeakMap();
const videoUrls = new Map();
function releaseDetachedVideos() {
  for (const [video, url] of videoUrls) {
    if (!video.isConnected) {
      URL.revokeObjectURL(url);
      videoUrls.delete(video);
    }
  }
}
function loadPublishedVideo(button) {
  const video = button.closest('.cs-screen').querySelector('video');
  if (videoLoads.has(video)) return videoLoads.get(video);
  const post = button.closest('[data-cs-post]').dataset.csPost;
  const load = TFB.ui.api.getMemberVideo(post, button.dataset.csLoadVideo).then(async blob => {
    if (!video.isConnected) return video;
    const url = URL.createObjectURL(blob);
    videoUrls.set(video, url);
    video.preload = 'auto';
    video.src = url;
    if (!video.poster) await prepareVideoFrame(video);
    return video;
  }).catch(error => {
    videoLoads.delete(video);
    throw error;
  });
  videoLoads.set(video, load);
  return load;
}
const videoPreviews = new IntersectionObserver(entries => {
  for (const {target, isIntersecting} of entries) {
    if (!isIntersecting) continue;
    videoPreviews.unobserve(target);
    const button = target.querySelector('[data-cs-load-video]');
    if (button?.isConnected) loadPublishedVideo(button).catch(() => {});
  }
}, {rootMargin:'100px'});
function observeVideoPreview(root) {
  for (const button of root.querySelectorAll('[data-cs-published-page]:not([hidden]) [data-cs-load-video]')) {
    const screen = button.closest('.cs-screen');
    const video = screen.querySelector('video');
    if (!video.poster && !videoLoads.has(video)) videoPreviews.observe(screen);
  }
}
TFB.loadChatVideoPreviews = root => {
  videoPreviews.disconnect();
  slideshowVisibility.disconnect();
  releaseDetachedVideos();
  if (!document.body.classList.contains('tfb-splash-open')) {
    observeVideoPreview(root);
    observeSlideshows(root);
  }
};

let draft, studio, layerIndex = 0, cropMode = false;
const fades = { none:0, short:.25, medium:.6, long:1.2 };
const SLIDE_SECONDS = 2.4;
const slideshowDuration = count => Number((count * SLIDE_SECONDS).toFixed(1));
const fadeLabels = { none:'Ohne Überblenden', short:'Kurz · 0,25 s', medium:'Mittel · 0,6 s', long:'Lang · 1,2 s' };
const seconds = value => /^\d+(?:[,.]\d{1,2})?$/.test(String(value).trim()) ? Number(String(value).replace(',', '.')) : NaN;
const decimal = value => String(value).replace('.', ',');
function timingOf(layer) {
  if (!layer.timing) return null;
  const start = seconds(layer.timing.start), end = seconds(layer.timing.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) return null;
  return {start,end,fade:layer.timing.fade};
}
function showTimedText(root, time, showAll = false, duration = Infinity) {
  for (const layer of root.querySelectorAll('[data-cs-timed]')) {
    const { start, end, fade, opacity } = layer.dataset;
    const span = Math.min(Number(end), duration) - Number(start);
    const ramp = Math.min(Number(fade), span / 2);
    const elapsed = time - Number(start);
    const factor = showAll ? 1 : elapsed < 0 || elapsed >= span ? 0
      : ramp ? Math.min(1, elapsed / ramp, (span - elapsed) / ramp) : 1;
    layer.style.opacity = Number(opacity) * factor;
  }
}
function updateTimedText(video) {
  const stage = video.closest('.cs-stage');
  if (!stage) return;
  const started = Boolean(video.dataset.started);
  const time = video.ended ? Infinity : started ? video.currentTime : 0;
  showTimedText(stage, time, stage.classList.contains('is-editing') && !started);
}
const textFrames = new WeakMap();
document.addEventListener('play', event => {
  const video = event.target;
  if (!video.matches?.('.cs-stage video')) return;
  video.dataset.started = '1';
  cancelAnimationFrame(textFrames.get(video));
  const tick = () => {
    if (!video.isConnected) return;
    updateTimedText(video);
    if (!video.paused && !video.ended) textFrames.set(video, requestAnimationFrame(tick));
  };
  tick();
}, true);
for (const eventName of ['pause','seeked','ended']) {
  document.addEventListener(eventName, event => {
    if (event.target.matches?.('.cs-stage video')) updateTimedText(event.target);
  }, true);
}
function mediaStyle(slide) {
  return `object-position:${slide.x}% ${slide.y}%;transform-origin:${slide.x}% ${slide.y}%;transform:scale(${slide.zoom})`;
}
function design(slide, editing) {
  const logo = logos[slide.logo];
  return ['top', 'bottom'].map(edge => {
    const { strength, height } = slide[edge];
    return `<div class="cs-gradient ${edge}" style="height:${height}%;--cs-strength:${strength / 100}">${editing ?
      `<button type="button" data-cs-drag="${edge}" aria-label="Höhe des Verlaufs ${edge === 'top' ? 'oben' : 'unten'} ziehen"></button>` : ''}</div>`;
  }).join('') + textLayersMarkup(slide, editing) + (logo ? `<img class="cs-logo" ${editing ? 'data-cs-drag="logo"' : ''} src="${logo.src}"
    alt="${logo.label}" draggable="false" style="left:${slide.logoX}%;top:${slide.logoY}%;width:${slide.logoSize}%">` : '');
}
function textLayersMarkup(slide, editing = false) {
  return slide.layers.map((layer, index) => {
    if (!layer.text.trim()) return '';
    const active = editing && index === layerIndex;
    const timing = slide.kind !== 'image' && timingOf(layer);
    const fade = timing ? fades[timing.fade] || 0 : 0;
    const opacity = layer.opacity / 100;
    const styles = [
      `left:${layer.x}%`, `top:${layer.y}%`, `font-size:${layer.size}cqw`,
      `color:${layer.color}`, `opacity:${timing && !editing && (timing.start > 0 || fade) ? 0 : opacity}`,
      `letter-spacing:${(layer.spacing || 0) / 100}em`,
    ];
    if (typeof layer.bold === 'boolean') styles.push(`font-weight:${layer.bold ? 800 : 400}`);
    if (layer.italic) styles.push('font-style:italic');
    if (layer.underline) styles.push('text-decoration:underline');
    return `<span class="cs-layer cs-font-${layer.font} cs-align-${layer.align || 'center'}${active ? ' selected' : ''}" ${editing ? `data-cs-drag="layer" data-layer="${index}"` : ''}
      ${timing ? `data-cs-timed data-start="${timing.start}" data-end="${timing.end}" data-fade="${fade}" data-opacity="${opacity}"` : ''}
      style="${styles.join(';')}">${esc(layer.text)}</span>`;
  }).join('');
}
function stage(slide, editing = false) {
  const src = esc(sourceOf(slide.source));
  const media = slide.kind === 'video'
    ? `<video ${src ? `src="${src}"` : ''} style="${mediaStyle(slide)}" playsinline preload="${editing ? 'auto' : 'none'}" ${editing ? 'muted' : ''}></video>`
    : `<img src="${src}" style="${mediaStyle(slide)}" alt="${typeof slide.source === 'string' ? 'Foto zum Beitrag' : 'Eigenes Foto'}" draggable="false">`;
  return `<div class="cs-stage${editing ? ' is-editing' : ''}" style="--cs-ratio:${slide.format}">
    <div class="cs-media">${media}</div><div class="cs-design">${design(slide, editing)}</div>
    ${editing && cropMode ? '<div class="cs-crop-hit" data-cs-drag="crop" aria-label="Ausschnitt ziehen"></div>' : ''}
    ${editing && slide.kind === 'video' ? '<button class="cs-play" type="button" data-cs-edit-video aria-label="Video abspielen">▶</button>' : ''}
  </div>`;
}

function range(name, label, value, max = 100, min = 0, step = 1) {
  return `<label>${label}<span class="cs-range"><input type="range" name="${name}" min="${min}" max="${max}" step="${step}" value="${value}"><output>${value}</output></span></label>`;
}
function select(name, label, value, choices) {
  return `<label>${label}<select name="${name}" aria-label="${label}">${Object.entries(choices).map(([key, text]) =>
    `<option value="${key}"${value === key ? ' selected' : ''}>${text}</option>`).join('')}</select></label>`;
}
export function mediaDesign(ref, width, height, kind = 'image') {
  const ratio = width / height;
  const format = ratio > 1.2 ? '16 / 9' : ratio < 0.68 ? '9 / 16' : '4 / 5';
  const { source, ...design } = makeSlide('', kind);
  return {...design, format, ref};
}

export function publishedGallery(post, imageOf) {
  const slideshow = post.designs.length > 1 && post.designs.every(slide => !slide.ref.startsWith('vid:'));
  const format = post.designs[0]?.format || '4 / 5';
  return `<div class="cs-published" data-cs-post="${esc(post.id)}"${slideshow ? ` data-cs-auto style="--cs-slideshow-ratio:${format}"` : ''}>
    ${post.dots === 'top' ? pageDots(post.designs) : ''}
    <div class="cs-screens">
    ${post.designs.map((slide, index) => {
      const video = slide.ref.startsWith('vid:');
      const source = video ? '' : imageOf(slide.ref);
      const html = stage({...slide, source, kind:video ? 'video' : 'image'});
      return `<div class="cs-screen" data-cs-published-page="${index}"${index ? ' hidden' : ''}>${html}
        ${video ? `<button type="button" class="cs-play" data-cs-load-video="${esc(slide.ref)}" aria-label="Video abspielen">▶</button>` : ''}
        <button type="button" class="cs-expand" data-cs-published-full aria-label="Vollbild">⛶</button>
        ${video ? '' : '<button type="button" class="cs-image-hit" data-cs-published-full aria-label="Bild groß ansehen"></button>'}
      </div>`;
    }).join('')}
    ${slideshow && post.slideshowLayers?.length ? `<div class="cs-slideshow-text">${textLayersMarkup({layers:post.slideshowLayers,kind:'slideshow'})}</div>` : ''}
    </div>
    ${post.dots !== 'top' ? pageDots(post.designs) : ''}
    ${slideshow ? '<button type="button" class="btn small cs-slideshow" data-cs-slideshow aria-label="Bilder abspielen">▶</button>' : ''}
  </div>`;
}

function pageDots(slides) {
  return slides.length < 2 ? '' : `<div class="cs-dots" role="group" aria-label="Seite auswählen">${slides.map((_, index) =>
    `<button type="button" data-cs-published-dot="${index}" aria-label="Seite ${index + 1}"${index ? '' : ' aria-current="true"'}></button>`).join('')}</div>`;
}
const slideshows = new WeakMap();
function slideshowState(gallery) {
  if (!slideshows.has(gallery)) {
    const pages = [...gallery.querySelectorAll('[data-cs-published-page]')];
    slideshows.set(gallery, {pages, duration:slideshowDuration(pages.length), text:gallery.querySelector('.cs-slideshow-text'),
      button:gallery.querySelector('[data-cs-slideshow]'), index:pages.findIndex(page => !page.hidden), elapsed:0, frame:null, paused:false});
  }
  return slideshows.get(gallery);
}
function pauseSlideshow(gallery) {
  const state = slideshows.get(gallery);
  if (!state) return;
  cancelAnimationFrame(state.frame);
  state.frame = null;
  state.button.textContent = '▶';
  state.button.setAttribute('aria-label','Bilder abspielen');
}
function slideshowPage(gallery, state, index) {
  const previous = state.pages[state.index];
  const incoming = state.pages[index];
  state.transition?.cancel();
  selectPublished(gallery, index);
  state.index = index;
  if (!previous || previous === incoming || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  previous.hidden = false;
  previous.inert = true;
  previous.dataset.csOutgoing = '';
  const animation = incoming.animate([{opacity:0},{opacity:1}], {duration:360,easing:'ease-in-out'});
  state.transition = animation;
  const finish = () => {
    if (state.index !== Number(previous.dataset.csPublishedPage)) previous.hidden = true;
    previous.inert = false;
    delete previous.dataset.csOutgoing;
  };
  animation.onfinish = finish;
  animation.oncancel = finish;
}
function startSlideshow(gallery) {
  const state = slideshowState(gallery);
  if (state.frame !== null) return;
  gallery.classList.add('is-slideshow');
  state.button.textContent = 'Ⅱ';
  state.button.setAttribute('aria-label','Bilder pausieren');
  const anchor = performance.now() - state.elapsed * 1000;
  const tick = now => {
    if (!gallery.isConnected) { pauseSlideshow(gallery); return; }
    state.elapsed = (Math.max(0, now - anchor) / 1000) % state.duration;
    const index = Math.min(state.pages.length - 1, Math.floor(state.elapsed / SLIDE_SECONDS));
    if (index !== state.index) slideshowPage(gallery, state, index);
    if (state.text) showTimedText(state.text,state.elapsed,false,state.duration);
    state.frame = requestAnimationFrame(tick);
  };
  state.frame = requestAnimationFrame(tick);
}
function pickGalleryPage(gallery, index) {
  if (!gallery.hasAttribute('data-cs-auto')) { selectPublished(gallery,index); return; }
  const state = slideshowState(gallery);
  if (!state.pages[index]) return;
  gallery.classList.add('is-slideshow');
  pauseSlideshow(gallery);
  state.paused = true;
  state.transition?.cancel();
  state.index = index;
  state.elapsed = index * SLIDE_SECONDS;
  selectPublished(gallery,index);
  if (state.text) showTimedText(state.text,state.elapsed,false,state.duration);
}
const slideshowVisibility = new IntersectionObserver(entries => {
  for (const {target,isIntersecting} of entries) {
    if (!target.isConnected) continue;
    const state = slideshowState(target);
    state.visible = isIntersecting;
    if (isIntersecting && !state.paused && !state.inViewer) startSlideshow(target);
    else if (!isIntersecting) pauseSlideshow(target);
  }
});
function observeSlideshows(root) {
  for (const gallery of root.querySelectorAll('[data-cs-auto]')) slideshowVisibility.observe(gallery);
}
function selectPublished(gallery, index) {
  const pages = [...gallery.querySelectorAll('[data-cs-published-page]')];
  if (!pages[index]) return;
  pages.forEach((page, i) => {
    if (i !== index) {
      page.querySelector('video')?.pause();
      videoPreviews.unobserve(page);
    }
    page.hidden = i !== index;
  });
  gallery.querySelectorAll('[data-cs-published-dot]').forEach((button, i) => {
    if (i === index) button.setAttribute('aria-current','true');
    else button.removeAttribute('aria-current');
  });
  observeVideoPreview(gallery);
}
let publishedSwipe;
document.addEventListener('touchstart', event => {
  const gallery = event.target.closest('.cs-published');
  if (gallery && event.touches.length === 1) publishedSwipe = {gallery, x:event.touches[0].clientX,y:event.touches[0].clientY};
}, {passive:true});
document.addEventListener('touchend', event => {
  if (!publishedSwipe) return;
  const {gallery,x,y} = publishedSwipe;
  publishedSwipe = null;
  const end = event.changedTouches[0];
  const dx = end.clientX - x;
  if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(end.clientY - y)) return;
  const current = gallery.querySelector('[data-cs-published-page]:not([hidden]):not([data-cs-outgoing])');
  if (current) pickGalleryPage(gallery, Number(current.dataset.csPublishedPage) + (dx < 0 ? 1 : -1));
}, {passive:true});

let liveEditor;
export function openLiveMediaEditor(design, source, dots, onSave) {
  liveEditor = onSave;
  const slide = {...structuredClone(design),source,kind:design.ref.startsWith('vid:') ? 'video' : 'image'};
  while (slide.layers.length < textLabels.length) slide.layers.push(newLayer(slide.layers.length));
  mountEditor({dots,slide});
}
export function openSlideshowEditor(first, source, layers, count, onSave) {
  liveEditor = design => onSave(design.layers.some(layer => layer.text.trim()) ? design.layers : []);
  const slide = {...structuredClone(first), source, kind:'slideshow', layers:structuredClone(layers)};
  while (slide.layers.length < textLabels.length) slide.layers.push(newLayer(slide.layers.length));
  mountEditor({slide,duration:slideshowDuration(count)});
}

function typographyMarkup(layer) {
  return `${currentSlide().kind !== 'image' ? `<div data-cs-timing>${timingMarkup(layer)}</div>` : ''}
    <div class="cs-type-row">
      ${select('font', 'Schrift', layer.font, fonts)}
      ${select('align', 'Ausrichtung', layer.align || 'center', alignments)}
    </div>
    <div class="cs-emphasis" role="group" aria-label="Schriftschnitt">${Object.entries(emphasis).map(([name, label]) => {
      const active = name === 'bold' ? layer.bold ?? layer.font !== 'mono' : layer[name];
      return `<label><input type="checkbox" name="${name}" ${active ? 'checked' : ''}><span>${label}</span></label>`;
    }).join('')}</div>
    ${range('size', 'Schriftgröße', layer.size, 36, 1, 0.1)}
    ${range('spacing', 'Buchstabenabstand', layer.spacing || 0, 30, -10)}
    ${range('opacity', 'Deckkraft', layer.opacity)}
    <div class="cs-color"><label>Hex-Code<input name="hex" value="${layer.color}" maxlength="7" spellcheck="false"></label>
      <input type="color" name="color" value="${layer.color}" aria-label="Textfarbe">
      ${'EyeDropper' in window ? '<button type="button" class="btn small" data-cs-pick>Pipette</button>' : ''}</div>`;
}

function timingMarkup(layer) {
  const duration = draft.duration;
  if (!duration) return '<p class="small muted">Videodauer wird ermittelt …</p>';
  const timed = Boolean(layer.timing);
  return `<fieldset class="cs-timing"><legend>${currentSlide().kind === 'slideshow' ? 'Text in der Diashow' : 'Text im Video'} · ${decimal(duration)} s</legend>
    ${select('timingMode', 'Sichtbarkeit', timed ? 'timed' : 'always', { always:'Immer sichtbar', timed:'Zeitgesteuert' })}
    ${timed ? `<div class="cs-type-row">
      <label>Einblenden bei (s)<input name="timingStart" inputmode="decimal" value="${esc(decimal(layer.timing.start))}"></label>
      <label>Ausblenden bei (s)<input name="timingEnd" inputmode="decimal" value="${esc(decimal(layer.timing.end))}"></label>
    </div>${select('timingFade', 'Überblenden', layer.timing.fade, fadeLabels)}` : ''}
  </fieldset>`;
}

function editorMarkup() {
  const slide = currentSlide();
  const slideshow = slide.kind === 'slideshow';
  return `<header class="cs-editor-head"><h2>${slideshow ? 'Text für alle Bilder' : 'Chat-Beitrag gestalten'}</h2><button type="button" class="btn small" data-cs-cancel>Schließen</button></header>
    <form data-cs-form class="cs-editor-form">
      <div class="cs-editor-preview">
        <div data-cs-editor-stage>${stage(slide, true)}</div>
        ${slideshow ? '<p class="small muted">Vorschau am ersten Bild</p>' : `<div class="cs-page-menu">
          <button type="button" class="btn small" data-cs-crop aria-pressed="${cropMode}">Ausschnitt ziehen</button>
        </div>`}
      </div>
      <div class="cs-inspector">
        ${slideshow ? '' : `<details><summary>Beitrag und Format</summary>
          ${select('format', 'Rahmen für diese Seite', slide.format, Object.fromEntries(formats.map(value => [value, value.replace(' / ', ':')])))}
          ${select('dots', 'Wischpunkte', draft.dots, { bottom:'Unter dem Bild', top:'Über dem Bild' })}
          ${range('zoom', 'Zoom', slide.zoom, 3, 1, 0.01)}
          ${range('x', 'Ausschnitt horizontal', Math.round(slide.x))}
          ${range('y', 'Ausschnitt vertikal', Math.round(slide.y))}
        </details>`}
        <details open><summary>Text auf dem Medium</summary>
          ${slide.layers.map((layer, index) => `<label>${layerLabel(index)}<textarea data-cs-text="${index}" rows="1" maxlength="240">${esc(layer.text)}</textarea></label>`).join('')}
          <div class="cs-page-menu cs-type-chooser" role="group" aria-label="Zeile formatieren">${slide.layers.map((_, index) => `<button type="button" class="btn small" data-cs-layer="${index}" aria-label="${layerLabel(index)} formatieren" aria-pressed="${index === layerIndex}">${layerLabel(index)}</button>`).join('')}</div>
          <div data-cs-typography>${typographyMarkup(slide.layers[layerIndex])}</div>
        </details>
        ${slideshow ? '' : `<details><summary>Verlauf oben und unten</summary>
          ${range('topStrength', 'Stärke oben', slide.top.strength)}${range('topHeight', 'Höhe oben', slide.top.height)}
          ${range('bottomStrength', 'Stärke unten', slide.bottom.strength)}${range('bottomHeight', 'Höhe unten', slide.bottom.height)}
        </details>
        <details><summary>Logo</summary>
          ${select('logo', 'Logo auf dieser Seite', slide.logo, { '':'Ohne Logo', ...Object.fromEntries(Object.entries(logos).map(([key, logo]) => [key, logo.label])) })}
          ${slide.logo ? range('logoSize', 'Logobreite', slide.logoSize, 80, 6) : ''}
        </details>`}
      </div>
      <footer class="cs-editor-footer"><p role="status" data-cs-status></p><button class="btn signal" type="submit">Übernehmen</button></footer>
    </form>`;
}

const currentSlide = () => draft.slide;
function drawEditor() {
  const inspectorScroll = studio.querySelector('.cs-inspector')?.scrollTop || 0;
  const expanded = [...studio.querySelectorAll('.cs-inspector details')].map(item => item.open);
  studio.innerHTML = editorMarkup();
  studio.querySelectorAll('.cs-inspector details').forEach((item, index) => {
    if (expanded[index] !== undefined) item.open = expanded[index];
  });
  studio.querySelector('.cs-inspector').scrollTop = inspectorScroll;
  const video = studio.querySelector('video[src]');
  if (video) {
    editorFrames.set(video, prepareVideoFrame(video));
    const setDuration = () => {
      if (!video.isConnected || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const duration = Number(video.duration.toFixed(2));
      if (draft.duration === duration) return;
      draft.duration = duration;
      studio.querySelector('[data-cs-timing]').innerHTML = timingMarkup(currentSlide().layers[layerIndex]);
    };
    video.addEventListener('loadedmetadata', setDuration, {once:true});
    if (video.readyState >= 1) queueMicrotask(setDuration);
  }
}
function mountEditor(value) {
  draft = value;
  layerIndex = 0;
  cropMode = false;
  studio = document.createElement('dialog');
  studio.className = 'cs-editor';
  studio.setAttribute('aria-label', value.slide.kind === 'slideshow' ? 'Text für alle Bilder' : 'Chat-Beitrag gestalten');
  drawEditor();
  document.body.append(studio);
  studio.showModal();
  studio.addEventListener('close', () => {
    releaseSource(currentSlide().source);
    studio.remove();
    liveEditor = null;
    studio = null;
    draft = null;
  }, { once: true });
}
function repaintDesign() {
  const slide = currentSlide();
  const surface = studio.querySelector('.cs-stage');
  surface.style.setProperty('--cs-ratio', slide.format);
  surface.querySelector('.cs-media > *').style.cssText = mediaStyle(slide);
  surface.querySelector('.cs-design').innerHTML = design(slide, true);
  const video = surface.querySelector('video');
  if (video) updateTimedText(video);
}
function selectLayer(index) {
  if (layerIndex === index) return;
  layerIndex = index;
  studio.querySelectorAll('[data-cs-layer]').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.csLayer) === index));
  });
  studio.querySelector('[data-cs-typography]').innerHTML = typographyMarkup(currentSlide().layers[index]);
  repaintDesign();
}
const gradientFields = {
  topStrength: ['top', 'strength'], topHeight: ['top', 'height'],
  bottomStrength: ['bottom', 'strength'], bottomHeight: ['bottom', 'height'],
};
function updateField(input) {
  const { name, value } = input;
  const slide = currentSlide();
  const layer = slide.layers[layerIndex];
  if (input.dataset.csText !== undefined) slide.layers[Number(input.dataset.csText)].text = value;
  if (name === 'dots') { draft.dots = value; return; }
  if (['format','logo'].includes(name)) slide[name] = value;
  if (['zoom','logoSize','x','y'].includes(name)) slide[name] = Number(value);
  if (gradientFields[name]) {
    const [edge, key] = gradientFields[name];
    slide[edge][key] = Number(value);
  }
  if (layer) {
    if (name === 'timingMode') {
      if (value === 'timed') layer.timing = {start:0,end:draft.duration,fade:'none'};
      else delete layer.timing;
      const panel = studio.querySelector('[data-cs-timing]');
      panel.innerHTML = timingMarkup(layer);
      panel.querySelector('[name="timingMode"]').focus();
    }
    if (name === 'timingStart') layer.timing.start = value;
    if (name === 'timingEnd') layer.timing.end = value;
    if (name === 'timingFade') layer.timing.fade = value;
    if (['font','align'].includes(name)) layer[name] = value;
    if (['size','opacity','spacing'].includes(name)) layer[name] = Number(value);
    if (Object.hasOwn(emphasis, name)) layer[name] = input.checked;
    if (name === 'color' || (name === 'hex' && /^#?[\da-f]{6}$/i.test(value))) {
      layer.color = '#' + value.replace(/^#/, '');
      const form = input.form;
      form.elements.color.value = layer.color;
      if (name === 'color') form.elements.hex.value = layer.color;
    }
  }
  if (input.type === 'range') input.nextElementSibling.value = value;
  repaintDesign();
}
document.addEventListener('input', event => {
  if (!event.target.closest('[data-cs-form]')) return;
  updateField(event.target);
  if (event.target.name === 'logo') drawEditor();
});
document.addEventListener('focusin', event => {
  const input = event.target.closest('[data-cs-text]');
  if (input && studio?.contains(input)) selectLayer(Number(input.dataset.csText));
});
document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if ('csShowSlideshow' in data || 'csShowCollage' in data) {
    const view = button.closest('[data-cs-photo-view]');
    const collage = view.querySelector('[data-cs-collage]');
    const carousel = view.querySelector('[data-cs-carousel]');
    const gallery = carousel.querySelector('[data-cs-auto]');
    const show = 'csShowSlideshow' in data;
    carousel.hidden = !show;
    collage.hidden = show;
    if (show) {
      pickGalleryPage(gallery,0);
      slideshowState(gallery).paused = false;
      startSlideshow(gallery);
      gallery.scrollIntoView({block:'nearest'});
      gallery.querySelector('[data-cs-slideshow]').focus({preventScroll:true});
    } else {
      pauseSlideshow(gallery);
      collage.querySelector('[data-cs-show-slideshow]').focus({preventScroll:true});
    }
    return;
  }
  const gallery = button.closest('.cs-published');
  if (gallery && 'csPublishedDot' in data) { pickGalleryPage(gallery, Number(data.csPublishedDot)); return; }
  if (gallery && 'csSlideshow' in data) {
    const state = slideshowState(gallery);
    state.paused = state.frame !== null;
    if (state.paused) pauseSlideshow(gallery); else startSlideshow(gallery);
    return;
  }
  if (gallery && 'csPublishedFull' in data) {
    pauseSlideshow(gallery);
    const slideshow = slideshows.get(gallery);
    if (slideshow) slideshow.inViewer = true;
    const original = button.closest('.cs-screen');
    original.querySelector('video')?.pause();
    const dialog = document.createElement('dialog');
    dialog.className = 'cs-viewer';
    dialog.setAttribute('aria-label', 'Medium im Vollbild');
    const copy = gallery.cloneNode(true);
    copy.querySelectorAll('[data-cs-outgoing]').forEach(page => {
      page.hidden = true;
      page.inert = false;
      delete page.dataset.csOutgoing;
    });
    if (slideshow) slideshowState(copy).elapsed = slideshow.elapsed;
    copy.querySelectorAll('[data-cs-published-full]').forEach(control => control.remove());
    copy.querySelectorAll('video').forEach(video => {
      video.removeAttribute('src');
      delete video.dataset.started;
      video.controls = false;
      updateTimedText(video);
    });
    copy.querySelectorAll('[data-cs-load-video]').forEach(control => { control.hidden = false; control.disabled = false; });
    dialog.innerHTML = '<div class="cs-viewer-tools"><button type="button" aria-pressed="false">16:9</button><button type="button" aria-label="Vollbild schließen">×</button></div>';
    const [wide, close] = dialog.querySelectorAll('button');
    wide.onclick = () => wide.setAttribute('aria-pressed', String(dialog.classList.toggle('wide')));
    close.onclick = () => dialog.close();
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      pauseSlideshow(copy);
      slideshowVisibility.unobserve(copy);
      copy.querySelectorAll('.cs-screen').forEach(screen => videoPreviews.unobserve(screen));
      dialog.remove();
      releaseDetachedVideos();
      if (slideshow) {
        slideshow.inViewer = false;
        if (slideshow.visible && !slideshow.paused) startSlideshow(gallery);
      }
      button.focus();
    }, {once:true});
    dialog.append(copy);
    document.body.append(dialog);
    dialog.showModal();
    observeVideoPreview(copy);
    if (slideshow) {
      slideshowVisibility.observe(copy);
      if (slideshow.paused) slideshowState(copy).paused = true;
    }
    return;
  }
  if (gallery && 'csLoadVideo' in data) {
    button.disabled = true;
    try {
      const video = await loadPublishedVideo(button);
      if (!video.isConnected) return;
      video.currentTime = 0;
      await video.play();
      video.controls = true;
      button.hidden = true;
    } catch (error) {
      TFB.ui.toast(error.message);
      button.disabled = false;
    }
    return;
  }
  if (!studio?.contains(button)) return;
  if ('csCancel' in data) { studio.close(); return; }
  if ('csCrop' in data) { cropMode = !cropMode; drawEditor(); }
  if ('csLayer' in data) selectLayer(Number(data.csLayer));
  if ('csEditVideo' in data) {
    const video = studio.querySelector('video');
    if (video.paused) {
      await editorFrames.get(video);
      if (!video.isConnected) return;
      if (!video.dataset.started || video.ended) video.currentTime = 0;
      video.play().then(() => { button.textContent = 'Ⅱ'; }).catch(() => {});
    }
    else { video.pause(); button.textContent = '▶'; }
    video.onended = () => { button.textContent = '▶'; };
  }
  if ('csPick' in data) {
    const control = studio.querySelector('[name="color"]');
    try {
      const { sRGBHex } = await new EyeDropper().open();
      if (control.isConnected) { control.value = sRGBHex; updateField(control); }
    } catch (_) { /* Escape cancels color selection. */ }
  }
});

let drag;
document.addEventListener('pointerdown', event => {
  const handle = event.target.closest('[data-cs-drag]');
  if (handle && studio?.contains(handle)) {
    const surface = handle.closest('.cs-stage');
    const slide = currentSlide();
    const kind = handle.dataset.csDrag;
    const index = Number(handle.dataset.layer);
    const origin = kind === 'layer' ? slide.layers[index]
      : kind === 'logo' ? { x:slide.logoX, y:slide.logoY }
      : kind === 'crop' ? slide : {};
    drag = { surface, slide, kind, index, x:event.clientX, y:event.clientY, originX:origin.x, originY:origin.y };
    surface.setPointerCapture(event.pointerId);
    event.preventDefault();
    return;
  }
});
document.addEventListener('pointermove', event => {
  if (!drag) return;
  const { surface, slide, kind, index, x, y, originX, originY } = drag;
  const box = surface.getBoundingClientRect();
  const dx = (event.clientX - x) / box.width * 100;
  const dy = (event.clientY - y) / box.height * 100;
  if (kind === 'top' || kind === 'bottom') {
    const height = Math.round(clamp(kind === 'top' ? (event.clientY - box.top) / box.height * 100 : (box.bottom - event.clientY) / box.height * 100, 0, 100));
    slide[kind].height = height;
    const range = studio.querySelector(`[name="${kind}Height"]`);
    range.value = height;
    range.nextElementSibling.value = height;
  } else {
    const nextX = clamp(originX + (kind === 'crop' ? -dx : dx), 0, 100);
    const nextY = clamp(originY + (kind === 'crop' ? -dy : dy), 0, 100);
    if (kind === 'layer') Object.assign(slide.layers[index], { x:nextX, y:nextY });
    if (kind === 'logo') Object.assign(slide, { logoX:nextX, logoY:nextY });
    if (kind === 'crop') {
      Object.assign(slide, { x:nextX, y:nextY });
      for (const name of ['x', 'y']) {
        const range = studio.querySelector(`[name="${name}"]`);
        range.value = Math.round(slide[name]);
        range.nextElementSibling.value = range.value;
      }
    }
  }
  repaintDesign();
});
document.addEventListener('pointerup', event => {
  if (drag) {
    if (drag.kind === 'layer') selectLayer(drag.index);
    drag = null;
  }
});
document.addEventListener('pointercancel', () => { drag = null; });
window.addEventListener('hashchange', () => {
  document.querySelector('.cs-viewer')?.close();
  studio?.close();
});
document.addEventListener('submit', async event => {
  const form = event.target;
  if (!form.matches('[data-cs-form]')) return;
  event.preventDefault();
  const {source,kind,...design} = currentSlide();
  const layers = design.layers.map(layer => {
    if (!layer.timing) return layer;
    return {...layer,timing:timingOf(layer)};
  });
  const invalid = layers.findIndex((layer, index) => design.layers[index].timing &&
    (!layer.timing || (draft.duration && layer.timing.end > draft.duration)));
  if (invalid !== -1) {
    selectLayer(invalid);
    const range = draft.duration ? ` zwischen 0 und ${decimal(draft.duration)} s` : '';
    form.querySelector('[data-cs-status]').textContent = `${layerLabel(invalid)}: Gib zwei Zeiten${range} ein. Die Ausblendzeit muss später liegen.`;
    form.querySelector('[name="timingStart"]')?.focus();
    return;
  }
  design.layers = layers;
  liveEditor(design,draft.dots);
  studio.close();
});
