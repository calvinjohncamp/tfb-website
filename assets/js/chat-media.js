const playbackIcon = playing => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${playing?'<rect x="7" y="5" width="3.5" height="14" rx=".7"/><rect x="13.5" y="5" width="3.5" height="14" rx=".7"/>':'<path d="M8 5.5v13l10-6.5z"/>'}</svg>`;
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
        if (!video.videoWidth || !video.videoHeight || video.dataset.inspect) return;
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
      const {start,end} = clipBounds(video);
      video.currentTime = start + Math.min(.3, (end - start) / 2);
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
const SLIDE_SECONDS = 3.4;
const slideshowDuration = count => Number((count * SLIDE_SECONDS).toFixed(1));
const fadeLabels = { none:'Ohne Überblenden', short:'Kurz · 0,25 s', medium:'Mittel · 0,6 s', long:'Lang · 1,2 s' };
const seconds = value => /^\d+(?:[,.]\d{1,2})?$/.test(String(value).trim()) ? Number(String(value).replace(',', '.')) : NaN;
const decimal = value => String(value).replace('.', ',');
const hundredths = value => Number(value.toFixed(2));
const hasVideoEdit = video => video.hasAttribute('data-clip-start');
function clipBounds(video) {
  const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
  const end = Math.min(duration, Number(video.dataset.clipEnd ?? duration));
  return {start:Math.min(Number(video.dataset.clipStart || 0),end),end};
}
function syncClipButton(video) {
  const player = video.closest('.cs-screen, .is-editing');
  const button = player?.querySelector('[data-cs-load-video], [data-cs-edit-video]');
  if (!button || (!hasVideoEdit(video) && !video.closest('.cs-mobile-video') && !button.hasAttribute('data-cs-edit-video'))) return;
  player.classList.toggle('is-playing', !video.paused && !video.ended);
  button.innerHTML = playbackIcon(!video.paused && !video.ended);
  button.setAttribute('aria-label', video.paused || video.ended ? 'Video abspielen' : 'Video pausieren');
}
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
  const editing = stage.classList.contains('is-editing');
  const inspect = editing && (!started || video.dataset.inspect);
  const {start,end} = clipBounds(video);
  const duration = end - start;
  const atEnd = started && (video.ended || video.currentTime >= end - .015);
  if (hasVideoEdit(video) && atEnd && !inspect && !video.paused) video.pause();
  const time = atEnd ? duration : started ? clamp(video.currentTime - start,0,duration) : 0;
  showTimedText(stage, atEnd && !inspect ? Infinity : time, Boolean(inspect), duration);
  if (hasVideoEdit(video)) {
    const fadeIn = Math.min(Number(video.dataset.clipIn),duration / 2);
    const fadeOut = Math.min(Number(video.dataset.clipOut),duration / 2);
    video.style.opacity = started && !inspect ? Math.min(1, fadeIn ? time / fadeIn : 1, fadeOut ? (duration - time) / fadeOut : 1) : 1;
  }
  const seek = stage.closest('.cs-screen')?.querySelector('[data-cs-clip-seek]');
  if (seek && Number.isFinite(duration)) {
    if (Number(seek.max) !== duration) seek.max = duration;
    if (!seek.matches(':active')) seek.value = time;
  }
}
const textFrames = new WeakMap();
document.addEventListener('play', event => {
  const video = event.target;
  if (!video.matches?.('.cs-stage video')) return;
  video.dataset.started = '1';
  syncClipButton(video);
  cancelAnimationFrame(textFrames.get(video));
  const tick = () => {
    if (!video.isConnected) return;
    updateTimedText(video);
    if (!video.paused && !video.ended) textFrames.set(video, requestAnimationFrame(tick));
  };
  tick();
}, true);
for (const eventName of ['pause','seeked','ended','timeupdate']) {
  document.addEventListener(eventName, event => {
    if (!event.target.matches?.('.cs-stage video')) return;
    updateTimedText(event.target);
    if (eventName === 'pause' || eventName === 'ended') syncClipButton(event.target);
  }, true);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('.cs-stage video[data-clip-start]').forEach(video => video.pause());
});
function playClip(video, restart = false) {
  const {start,end} = clipBounds(video);
  if (restart || !video.dataset.started || video.ended || video.currentTime < start || video.currentTime >= end - .015) {
    video.currentTime = start;
  }
  delete video.dataset.inspect;
  return video.play();
}
function mediaStyle(slide) {
  if (slide.kind === 'slideshow') return '';
  const plain = slide.x === 50 && slide.y === 50 && slide.zoom === 1 &&
    !slide.logo && !slide.layers?.some(layer => layer.text?.trim()) && !slide.top?.strength && !slide.bottom?.strength;
  return `${plain ? 'object-fit:contain;' : ''}object-position:${slide.x}% ${slide.y}%;transform-origin:${slide.x}% ${slide.y}%;transform:scale(${slide.zoom})`;
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
function stage(slide, editing = false, fitPhoto = false) {
  const src = esc(sourceOf(slide.source));
  const media = slide.kind === 'video'
    ? `<video ${src ? `src="${src}"` : ''} style="${mediaStyle(slide)}" playsinline preload="${editing ? 'auto' : 'none'}" ${editing ? 'muted' : ''}
      ${slide.videoEdit ? `data-clip-start="${slide.videoEdit.start}" data-clip-end="${slide.videoEdit.end}" data-clip-in="${fades[slide.videoEdit.fadeIn]}" data-clip-out="${fades[slide.videoEdit.fadeOut]}"` : ''}></video>`
    : `<img src="${src}" style="${fitPhoto ? '' : mediaStyle(slide)}" alt="${typeof slide.source === 'string' ? 'Foto zum Beitrag' : 'Eigenes Foto'}" draggable="false">`;
  const content = `<div class="cs-media">${media}</div><div class="cs-design">${design(slide, editing)}</div>`;
  return `<div class="cs-stage${editing ? ' is-editing' : ''}${slide.kind === 'slideshow' ? ' cs-shared-preview' : ''}" style="--cs-ratio:${slide.format}">
    ${fitPhoto ? `<div class="cs-photo-frame" style="--cs-photo-ratio:${slide.format}">${content}</div>` : content}
    ${editing && cropMode ? '<div class="cs-crop-hit" data-cs-drag="crop" aria-label="Ausschnitt ziehen"></div>' : ''}
    ${editing && slide.kind === 'video' ? `<button class="cs-play" type="button" data-cs-edit-video aria-label="Video abspielen">${playbackIcon(false)}</button>` : ''}
  </div>`;
}

function fitSlideshowImage(image) {
  if (image.naturalWidth && image.naturalHeight) {
    image.closest('.cs-photo-frame')?.style.setProperty('--cs-photo-ratio', image.naturalWidth / image.naturalHeight);
  }
}
document.addEventListener('load', event => {
  if (event.target.matches?.('.cs-photo-frame img:not(.cs-logo)')) fitSlideshowImage(event.target);
}, true);

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
  const carousel = post.photoView === 'carousel';
  const slideshow = !carousel && post.designs.length > 1 && post.designs.every(slide => !slide.ref.startsWith('vid:'));
  const format = post.designs[0]?.format || '4 / 5';
  const arrow = direction => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${direction < 0 ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}"/></svg>`;
  const navigation = carousel ? `<div class="cs-carousel-nav">
    <button type="button" data-cs-step="-1" aria-label="Vorheriges Bild"${post.designs.length < 2 ? ' disabled' : ''}>${arrow(-1)}</button>
    ${pageDots(post.designs)}
    <button type="button" data-cs-step="1" aria-label="Nächstes Bild"${post.designs.length < 2 ? ' disabled' : ''}>${arrow(1)}</button>
    <span class="cs-carousel-status" aria-live="polite" aria-atomic="true">Bild 1 von ${post.designs.length}</span>
  </div>` : pageDots(post.designs);
  return `<div class="cs-published${carousel ? ' cs-carousel' : ''}" data-cs-post="${esc(post.id)}"${carousel ? ' tabindex="0" role="region" aria-label="Bilderkarussell"' : ''}${slideshow ? ` data-cs-auto style="--cs-slideshow-ratio:${format}"` : ''}>
    ${post.dots === 'top' ? navigation : ''}
    <div class="cs-screens">
    ${post.designs.map((slide, index) => {
      const video = slide.ref.startsWith('vid:');
      const source = video ? '' : imageOf(slide.ref);
      const html = stage({...slide, source, kind:video ? 'video' : 'image'}, false, slideshow || carousel);
      return `<div class="cs-screen" data-cs-published-page="${index}"${index ? ' hidden' : ''}>${html}
        ${video ? `<button type="button" class="cs-play" data-cs-load-video="${esc(slide.ref)}" aria-label="Video abspielen">${playbackIcon(false)}</button>` : ''}
        ${video ? '<div class="cs-clip-controls" hidden><input type="range" min="0" step="any" value="0" data-cs-clip-seek aria-label="Position im Video"><button type="button" data-cs-clip-mute aria-pressed="false">Ton aus</button></div>' : ''}
        <button type="button" class="cs-expand" data-cs-published-full aria-label="Vollbild">⛶</button>
        ${video ? '' : '<button type="button" class="cs-image-hit" data-cs-published-full aria-label="Bild groß ansehen"></button>'}
      </div>`;
    }).join('')}
    ${slideshow && post.slideshowLayers?.length ? `<div class="cs-slideshow-text">${textLayersMarkup({layers:post.slideshowLayers,kind:'slideshow'})}</div>` : ''}
    </div>
    ${post.dots !== 'top' ? navigation : ''}
    ${slideshow ? `<button type="button" class="cs-slideshow" data-cs-slideshow aria-label="Bilder abspielen" aria-pressed="false">${playbackIcon(false)}</button>` : ''}
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
  state.button.innerHTML = playbackIcon(false);
  state.button.setAttribute('aria-pressed','false');
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
  state.button.innerHTML = playbackIcon(true);
  state.button.setAttribute('aria-pressed','true');
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
  if (!gallery.hasAttribute('data-cs-auto')) {
    const count = gallery.querySelectorAll('[data-cs-published-page]').length;
    if (gallery.classList.contains('cs-carousel') && count) index = (index % count + count) % count;
    selectPublished(gallery,index);
    return;
  }
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
  root.querySelectorAll('.cs-photo-frame .cs-media img').forEach(fitSlideshowImage);
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
  gallery.querySelectorAll('[data-cs-step]').forEach(button => {
    button.disabled = pages.length < 2;
  });
  const status = gallery.querySelector('.cs-carousel-status');
  if (status) status.textContent = `Bild ${index + 1} von ${pages.length}`;
  observeVideoPreview(gallery);
}
document.addEventListener('keydown', event => {
  const gallery = event.target.closest('.cs-carousel');
  if (!gallery || event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
  const pages = gallery.querySelectorAll('[data-cs-published-page]');
  const current = gallery.querySelector('[data-cs-published-page]:not([hidden])');
  const index = Number(current?.dataset.csPublishedPage || 0);
  const next = {ArrowLeft:index - 1, ArrowRight:index + 1, Home:0, End:pages.length - 1}[event.key];
  if (next === undefined) return;
  event.preventDefault();
  pickGalleryPage(gallery, next);
});
let publishedSwipe;
const carouselClickSuppression = new WeakMap();
document.addEventListener('touchstart', event => {
  const gallery = event.target.closest('.cs-published');
  publishedSwipe = gallery && event.touches.length === 1
    ? {gallery, x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
}, {passive:true});
document.addEventListener('touchcancel', () => { publishedSwipe = null; }, {passive:true});
document.addEventListener('touchmove', event => { if (event.touches.length !== 1) publishedSwipe = null; }, {passive:true});
document.addEventListener('touchend', event => {
  if (!publishedSwipe) return;
  const {gallery,x,y} = publishedSwipe;
  publishedSwipe = null;
  const end = event.changedTouches[0];
  if (!end) return;
  const dx = end.clientX - x;
  if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(end.clientY - y)) return;
  if (gallery.classList.contains('cs-carousel')) carouselClickSuppression.set(gallery, Date.now() + 500);
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
  const duration = textDuration();
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

function editorClip() {
  return currentSlide().videoEdit || {start:0,end:draft.duration,fadeIn:'none',fadeOut:'none'};
}
function textDuration() {
  if (currentSlide().kind !== 'video' || !draft.duration) return draft.duration;
  const {start,end} = editorClip();
  return hundredths(end - start);
}
function clipEditorMarkup() {
  if (!draft.duration) return '<p class="small muted">Filmleiste wird geladen …</p>';
  const clip = editorClip();
  const handle = (name, label, value) =>
    `<input type="range" name="${name}" min="0" max="${draft.duration}" step="0.01" value="${value}" aria-label="${label}">`;
  return `<div class="cs-trim-track">
      <span class="cs-trim-selection" data-cs-trim-selection></span>
      ${handle('clipStart','Filmanfang',clip.start)}
      ${handle('clipEnd','Filmende',clip.end)}
    </div>
    <div class="cs-trim-times">
      <span>Anfang <output data-cs-clip-start></output></span>
      <strong><output data-cs-clip-length></output></strong>
      <span>Ende <output data-cs-clip-end></output></span>
    </div>
    <div class="cs-type-row">
      ${select('clipFadeIn','Bild einblenden',clip.fadeIn,fadeLabels)}
      ${select('clipFadeOut','Bild ausblenden',clip.fadeOut,fadeLabels)}
    </div>
    <p class="small muted">Textzeiten zählen ab dem gewählten Filmanfang.</p>
    <button type="button" class="btn small" data-cs-reset-clip>Auf volle Länge zurücksetzen</button>`;
}
function refreshClipEditor() {
  const clip = editorClip();
  const panel = studio.querySelector('[data-cs-clip-editor]');
  const video = studio.querySelector('video');
  if (!draft.duration || !panel) return;
  panel.querySelector('[name="clipStart"]').value = clip.start;
  panel.querySelector('[name="clipEnd"]').value = clip.end;
  for (const [field,value] of Object.entries({start:clip.start,end:clip.end,length:textDuration()})) {
    panel.querySelector(`[data-cs-clip-${field}]`).value = `${decimal(value)} s`;
  }
  const selection = panel.querySelector('[data-cs-trim-selection]');
  selection.style.setProperty('--clip-start',`${clip.start / draft.duration * 100}%`);
  selection.style.setProperty('--clip-end',`${clip.end / draft.duration * 100}%`);
  const edit = currentSlide().videoEdit;
  for (const [field,value] of Object.entries({clipStart:clip.start,clipEnd:clip.end,clipIn:fades[clip.fadeIn],clipOut:fades[clip.fadeOut]})) {
    if (edit) video.dataset[field] = value;
    else delete video.dataset[field];
  }
  const legend = studio.querySelector('[data-cs-timing] legend');
  if (legend) legend.textContent = `Text im Video · ${decimal(textDuration())} s`;
  updateTimedText(video);
}
function inspectClipAt(time) {
  const video = studio.querySelector('video');
  video.dataset.inspect = '1';
  video.pause();
  video.removeAttribute('poster');
  video.currentTime = clamp(time,0,video.duration);
  updateTimedText(video);
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
        ${slide.kind === 'video' ? `<details open><summary>Film schneiden und überblenden</summary>
          <div data-cs-clip-editor>${clipEditorMarkup()}</div></details>` : ''}
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
    refreshClipEditor();
    editorFrames.set(video, prepareVideoFrame(video));
    const setDuration = () => {
      if (!video.isConnected || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const duration = Number(video.duration.toFixed(2));
      if (draft.duration === duration) return;
      draft.duration = duration;
      studio.querySelector('[data-cs-clip-editor]').innerHTML = clipEditorMarkup();
      studio.querySelector('[data-cs-timing]').innerHTML = timingMarkup(currentSlide().layers[layerIndex]);
      refreshClipEditor();
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
  if (['clipStart','clipEnd','clipFadeIn','clipFadeOut'].includes(name)) {
    const clip = {...editorClip()};
    const minimum = Math.min(.1,draft.duration);
    if (name === 'clipStart') clip.start = hundredths(clamp(Number(value),0,clip.end - minimum));
    if (name === 'clipEnd') clip.end = hundredths(clamp(Number(value),clip.start + minimum,draft.duration));
    if (name === 'clipFadeIn') clip.fadeIn = value;
    if (name === 'clipFadeOut') clip.fadeOut = value;
    slide.videoEdit = clip;
    refreshClipEditor();
    if (name === 'clipStart' || name === 'clipEnd') inspectClipAt(name === 'clipStart' ? clip.start : Math.max(clip.start,clip.end - .01));
    return;
  }
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
      if (value === 'timed') layer.timing = {start:0,end:textDuration(),fade:'none'};
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
  if (event.target.matches('[data-cs-clip-seek]')) {
    const video = event.target.closest('.cs-screen').querySelector('video');
    video.currentTime = clipBounds(video).start + Number(event.target.value);
    return;
  }
  if (!event.target.closest('[data-cs-form]')) return;
  updateField(event.target);
  if (event.target.name === 'logo') drawEditor();
});
document.addEventListener('focusin', event => {
  const input = event.target.closest('[data-cs-text]');
  if (input && studio?.contains(input)) selectLayer(Number(input.dataset.csText));
});
function openPublishedViewer(gallery, button, fromStart = false) {
  pauseSlideshow(gallery);
  const slideshow = gallery.hasAttribute('data-cs-auto') ? slideshowState(gallery) : null;
  if (slideshow) slideshow.inViewer = true;
  button.closest('.cs-screen')?.querySelector('video')?.pause();
  const dialog = document.createElement('dialog');
  dialog.className = slideshow ? 'cs-viewer cs-viewer-slideshow' : 'cs-viewer';
  dialog.setAttribute('aria-label', 'Medium im Vollbild');
  const copy = gallery.cloneNode(true);
  copy.querySelectorAll('[data-cs-outgoing]').forEach(page => {
    page.hidden = true;
    page.inert = false;
    delete page.dataset.csOutgoing;
  });
  if (slideshow) {
    const state = slideshowState(copy);
    if (fromStart) pickGalleryPage(copy,0);
    else state.elapsed = slideshow.elapsed;
    state.paused = !fromStart && slideshow.paused;
    copy.classList.add('is-slideshow');
  }
  copy.querySelectorAll('[data-cs-published-full], .cs-image-hit').forEach(control => control.remove());
  if (gallery.classList.contains('cs-carousel')) {
    copy.querySelectorAll('.cs-screen').forEach(screen => {
      if (!screen.querySelector('video')) screen.insertAdjacentHTML('beforeend', '<button type="button" class="cs-image-hit" data-cs-next-photo aria-label="Nächstes Bild"></button>');
    });
  }
  copy.querySelectorAll('video').forEach(video => {
    video.removeAttribute('src');
    delete video.dataset.started;
    video.controls = false;
    updateTimedText(video);
  });
  copy.querySelectorAll('[data-cs-load-video]').forEach(control => { control.hidden = false; control.disabled = false; });
  copy.querySelectorAll('.cs-clip-controls').forEach(controls => {
    controls.hidden = true;
    const mute = controls.querySelector('[data-cs-clip-mute]');
    mute.textContent = 'Ton aus';
    mute.setAttribute('aria-pressed','false');
  });
  copy.querySelectorAll('[data-cs-load-video]').forEach(button => {
    button.innerHTML = playbackIcon(false);
    button.setAttribute('aria-label','Video abspielen');
  });
  dialog.innerHTML = `<div class="cs-viewer-tools">
    ${slideshow || gallery.classList.contains('cs-carousel') ? '' : '<button type="button" aria-pressed="false" data-cs-wide>16:9</button>'}
    <button type="button" aria-label="Vollbild schließen" data-cs-viewer-close>×</button></div>`;
  const wide = dialog.querySelector('[data-cs-wide]');
  if (wide) wide.onclick = () => wide.setAttribute('aria-pressed', String(dialog.classList.toggle('wide')));
  dialog.querySelector('[data-cs-viewer-close]').onclick = () => dialog.close();
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    pauseSlideshow(copy);
    slideshowVisibility.unobserve(copy);
    copy.querySelectorAll('.cs-screen').forEach(screen => videoPreviews.unobserve(screen));
    dialog.remove();
    releaseDetachedVideos();
    if (slideshow) {
      slideshow.inViewer = false;
      if (gallery.isConnected && slideshow.visible && !slideshow.paused) startSlideshow(gallery);
    }
    button.focus({preventScroll:true});
  }, {once:true});
  dialog.append(copy);
  document.body.append(dialog);
  dialog.showModal();
  observeVideoPreview(copy);
  if (slideshow) observeSlideshows(dialog);
}
function openMobileVideo(gallery, button) {
  const screen = button.closest('.cs-screen');
  const video = screen.querySelector('video');
  const play = screen.querySelector('[data-cs-load-video]');
  const controls = screen.querySelector('.cs-clip-controls');
  const ratio = screen.querySelector('.cs-stage').style.getPropertyValue('--cs-ratio');
  const placeholder = document.createElement('div');
  placeholder.style.aspectRatio = ratio;
  screen.before(placeholder);
  const dialog = document.createElement('dialog');
  dialog.className = 'cs-mobile-video';
  dialog.setAttribute('aria-label','Video im Vollbild');
  dialog.innerHTML = '<button type="button" class="cs-mobile-video-close" aria-label="Video schließen">×</button><div class="cs-published"></div>';
  const player = dialog.querySelector('.cs-published');
  player.dataset.csPost = gallery.dataset.csPost;
  player.style.setProperty('--cs-video-ratio',ratio);
  player.append(screen);
  video.controls = false;
  play.hidden = false;
  const tapVideo = event => {
    if (!event.target.closest('button,input') && event.target.closest('.cs-stage')) play.click();
  };
  screen.addEventListener('click',tapVideo);
  dialog.addEventListener('click',event => {
    if (event.target === dialog || event.target.closest('.cs-mobile-video-close')) dialog.close();
  });
  dialog.addEventListener('close',() => {
    video.pause();
    screen.removeEventListener('click',tapVideo);
    if (!hasVideoEdit(video)) {
      controls.hidden = true;
      play.innerHTML = playbackIcon(false);
      play.setAttribute('aria-label','Video abspielen');
    }
    screen.classList.remove('is-playing');
    if (placeholder.isConnected) placeholder.replaceWith(screen);
    dialog.remove();
    releaseDetachedVideos();
    button.focus({preventScroll:true});
  },{once:true});
  document.body.append(dialog);
  dialog.showModal();
  play.click();
}
document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if ('csShowSlideshow' in data || 'csShowCollage' in data) {
    const view = button.closest('[data-cs-photo-view]');
    const collage = view.querySelector('[data-cs-collage]');
    const carousel = view.querySelector('[data-cs-carousel]');
    const gallery = carousel.querySelector('[data-cs-auto]');
    if ('csShowSlideshow' in data) openPublishedViewer(gallery, button, true);
    else {
      pauseSlideshow(gallery);
      carousel.hidden = true;
      collage.hidden = false;
      collage.querySelector('[data-cs-show-slideshow]').focus({preventScroll:true});
    }
    return;
  }
  const gallery = button.closest('.cs-published');
  if (gallery && button.matches('.cs-image-hit') && Date.now() < (carouselClickSuppression.get(gallery) || 0)) {
    event.preventDefault();
    return;
  }
  if (gallery && 'csNextPhoto' in data) {
    const current = gallery.querySelector('[data-cs-published-page]:not([hidden])');
    pickGalleryPage(gallery, Number(current?.dataset.csPublishedPage || 0) + 1);
    return;
  }
  if (gallery && 'csStep' in data) {
    const current = gallery.querySelector('[data-cs-published-page]:not([hidden])');
    pickGalleryPage(gallery, Number(current?.dataset.csPublishedPage || 0) + Number(data.csStep));
    return;
  }
  if (gallery && 'csClipMute' in data) {
    const video = button.closest('.cs-screen').querySelector('video');
    video.muted = !video.muted;
    button.textContent = video.muted ? 'Ton an' : 'Ton aus';
    button.setAttribute('aria-pressed',String(video.muted));
    return;
  }
  if (gallery && 'csPublishedDot' in data) { pickGalleryPage(gallery, Number(data.csPublishedDot)); return; }
  if (gallery && 'csSlideshow' in data) {
    const state = slideshowState(gallery);
    state.paused = state.frame !== null;
    if (state.paused) pauseSlideshow(gallery); else startSlideshow(gallery);
    return;
  }
  if (gallery && 'csPublishedFull' in data) {
    if (button.closest('.cs-screen')?.querySelector('video') &&
        (event.pointerType === 'touch' || matchMedia('(pointer: coarse)').matches)) {
      openMobileVideo(gallery,button);
      return;
    }
    openPublishedViewer(gallery, button);
    return;
  }
  if (gallery && 'csLoadVideo' in data) {
    const mobilePlayer = button.closest('.cs-mobile-video');
    if (!mobilePlayer && !button.closest('.cs-viewer') &&
        (event.pointerType === 'touch' || matchMedia('(pointer: coarse)').matches)) {
      openMobileVideo(gallery,button);
      return;
    }
    button.disabled = true;
    try {
      const source = button.closest('.cs-screen').querySelector('video');
      const video = source.readyState >= 1 ? source : await loadPublishedVideo(button);
      if (!video.isConnected) return;
      if (!video.paused) video.pause();
      else await playClip(video);
      if (hasVideoEdit(video) || mobilePlayer) button.closest('.cs-screen').querySelector('.cs-clip-controls').hidden = false;
      else {
        video.controls = true;
        button.hidden = true;
      }
    } catch (error) {
      TFB.ui.toast(error.message);
    } finally {
      button.disabled = false;
    }
    return;
  }
  if (!studio?.contains(button)) return;
  if ('csCancel' in data) { studio.close(); return; }
  if ('csCrop' in data) { cropMode = !cropMode; drawEditor(); }
  if ('csLayer' in data) selectLayer(Number(data.csLayer));
  if ('csResetClip' in data) {
    delete currentSlide().videoEdit;
    studio.querySelector('[data-cs-clip-editor]').innerHTML = clipEditorMarkup();
    refreshClipEditor();
    inspectClipAt(0);
    studio.querySelector('[name="clipStart"]').focus();
  }
  if ('csEditVideo' in data) {
    const video = studio.querySelector('video');
    if (video.paused) {
      await editorFrames.get(video);
      if (!video.isConnected) return;
      playClip(video, Boolean(video.dataset.inspect)).catch(() => {});
    }
    else { video.pause(); button.innerHTML = playbackIcon(false); }
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
  document.querySelector('.cs-viewer, .cs-mobile-video')?.close();
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
  if (design.videoEdit && draft.duration && design.videoEdit.start === 0 && design.videoEdit.end === draft.duration &&
      design.videoEdit.fadeIn === 'none' && design.videoEdit.fadeOut === 'none') delete design.videoEdit;
  liveEditor(design,draft.dots);
  studio.close();
});
