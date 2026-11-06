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

let draft, studio, layerIndex = 0, cropMode = false;
function mediaStyle(slide) {
  return `object-position:${slide.x}% ${slide.y}%;transform-origin:${slide.x}% ${slide.y}%;transform:scale(${slide.zoom})`;
}
function design(slide, editing) {
  const logo = logos[slide.logo];
  return ['top', 'bottom'].map(edge => {
    const { strength, height } = slide[edge];
    return `<div class="cs-gradient ${edge}" style="height:${height}%;--cs-strength:${strength / 100}">${editing ?
      `<button type="button" data-cs-drag="${edge}" aria-label="Höhe des Verlaufs ${edge === 'top' ? 'oben' : 'unten'} ziehen"></button>` : ''}</div>`;
  }).join('') + slide.layers.map((layer, index) => {
    if (!layer.text.trim()) return '';
    const active = editing && index === layerIndex;
    const styles = [
      `left:${layer.x}%`, `top:${layer.y}%`, `font-size:${layer.size}cqw`,
      `color:${layer.color}`, `opacity:${layer.opacity / 100}`, `letter-spacing:${(layer.spacing || 0) / 100}em`,
    ];
    if (typeof layer.bold === 'boolean') styles.push(`font-weight:${layer.bold ? 800 : 400}`);
    if (layer.italic) styles.push('font-style:italic');
    if (layer.underline) styles.push('text-decoration:underline');
    return `<span class="cs-layer cs-font-${layer.font} cs-align-${layer.align || 'center'}${active ? ' selected' : ''}" ${editing ? `data-cs-drag="layer" data-layer="${index}"` : ''}
      style="${styles.join(';')}">${esc(layer.text)}</span>`;
  }).join('') + (logo ? `<img class="cs-logo" ${editing ? 'data-cs-drag="logo"' : ''} src="${logo.src}"
    alt="${logo.label}" draggable="false" style="left:${slide.logoX}%;top:${slide.logoY}%;width:${slide.logoSize}%">` : '');
}
function stage(slide, editing = false) {
  const src = esc(sourceOf(slide.source));
  const media = slide.kind === 'video'
    ? `<video ${src ? `src="${src}"` : ''} style="${mediaStyle(slide)}" playsinline preload="metadata" ${editing ? 'muted' : ''}></video>`
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
  return `<div class="cs-published" data-cs-post="${esc(post.id)}">
    ${post.dots === 'top' ? pageDots(post.designs) : ''}
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
    ${post.dots !== 'top' ? pageDots(post.designs) : ''}
    ${post.designs.length > 1 && post.designs.every(slide => !slide.ref.startsWith('vid:')) ? '<button type="button" class="btn small cs-slideshow" data-cs-slideshow>Diashow</button>' : ''}
  </div>`;
}

function pageDots(slides) {
  return slides.length < 2 ? '' : `<div class="cs-dots" role="group" aria-label="Seite auswählen">${slides.map((_, index) =>
    `<button type="button" data-cs-published-dot="${index}" aria-label="Seite ${index + 1}"${index ? '' : ' aria-current="true"'}></button>`).join('')}</div>`;
}
const slideshows = new WeakMap();
function stopSlideshow(gallery) {
  clearInterval(slideshows.get(gallery));
  slideshows.delete(gallery);
  const button = gallery.querySelector('[data-cs-slideshow]');
  if (button) button.textContent = 'Diashow';
}
function selectPublished(gallery, index) {
  const pages = [...gallery.querySelectorAll('[data-cs-published-page]')];
  if (!pages[index]) return;
  pages.forEach((page, i) => {
    if (i !== index) page.querySelector('video')?.pause();
    page.hidden = i !== index;
  });
  gallery.querySelectorAll('[data-cs-published-dot]').forEach((button, i) => {
    if (i === index) button.setAttribute('aria-current','true');
    else button.removeAttribute('aria-current');
  });
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
  const current = gallery.querySelector('[data-cs-published-page]:not([hidden])');
  stopSlideshow(gallery);
  if (current) selectPublished(gallery, Number(current.dataset.csPublishedPage) + (dx < 0 ? 1 : -1));
}, {passive:true});

let liveEditor;
export function openLiveMediaEditor(design, source, dots, onSave) {
  liveEditor = onSave;
  const slide = {...structuredClone(design),source,kind:design.ref.startsWith('vid:') ? 'video' : 'image'};
  while (slide.layers.length < textLabels.length) slide.layers.push(newLayer(slide.layers.length));
  mountEditor({dots,slide});
}

function typographyMarkup(layer) {
  return `<div class="cs-type-row">
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

function editorMarkup() {
  const slide = currentSlide();
  return `<header class="cs-editor-head"><h2>Chat-Beitrag gestalten</h2><button type="button" class="btn small" data-cs-cancel>Schließen</button></header>
    <form data-cs-form class="cs-editor-form">
      <div class="cs-editor-preview">
        <div data-cs-editor-stage>${stage(slide, true)}</div>
        <div class="cs-page-menu">
          <button type="button" class="btn small" data-cs-crop aria-pressed="${cropMode}">Ausschnitt ziehen</button>
        </div>
      </div>
      <div class="cs-inspector">
        <details><summary>Beitrag und Format</summary>
          ${select('format', 'Rahmen für diese Seite', slide.format, Object.fromEntries(formats.map(value => [value, value.replace(' / ', ':')])))}
          ${select('dots', 'Wischpunkte', draft.dots, { bottom:'Unter dem Bild', top:'Über dem Bild' })}
          ${range('zoom', 'Zoom', slide.zoom, 3, 1, 0.01)}
          ${range('x', 'Ausschnitt horizontal', Math.round(slide.x))}
          ${range('y', 'Ausschnitt vertikal', Math.round(slide.y))}
        </details>
        <details open><summary>Text auf dem Medium</summary>
          ${slide.layers.map((layer, index) => `<label>${layerLabel(index)}<textarea data-cs-text="${index}" rows="1" maxlength="240">${esc(layer.text)}</textarea></label>`).join('')}
          <div class="cs-page-menu cs-type-chooser" role="group" aria-label="Zeile formatieren">${slide.layers.map((_, index) => `<button type="button" class="btn small" data-cs-layer="${index}" aria-label="${layerLabel(index)} formatieren" aria-pressed="${index === layerIndex}">${layerLabel(index)}</button>`).join('')}</div>
          <div data-cs-typography>${typographyMarkup(slide.layers[layerIndex])}</div>
        </details>
        <details><summary>Verlauf oben und unten</summary>
          ${range('topStrength', 'Stärke oben', slide.top.strength)}${range('topHeight', 'Höhe oben', slide.top.height)}
          ${range('bottomStrength', 'Stärke unten', slide.bottom.strength)}${range('bottomHeight', 'Höhe unten', slide.bottom.height)}
        </details>
        <details><summary>Logo</summary>
          ${select('logo', 'Logo auf dieser Seite', slide.logo, { '':'Ohne Logo', ...Object.fromEntries(Object.entries(logos).map(([key, logo]) => [key, logo.label])) })}
          ${slide.logo ? range('logoSize', 'Logobreite', slide.logoSize, 80, 6) : ''}
        </details>
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
}
function mountEditor(value) {
  draft = value;
  layerIndex = 0;
  cropMode = false;
  studio = document.createElement('dialog');
  studio.className = 'cs-editor';
  studio.setAttribute('aria-label', 'Chat-Beitrag gestalten');
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
  const gallery = button.closest('.cs-published');
  if (gallery && 'csPublishedDot' in data) { stopSlideshow(gallery); selectPublished(gallery, Number(data.csPublishedDot)); return; }
  if (gallery && 'csSlideshow' in data) {
    if (slideshows.has(gallery)) { stopSlideshow(gallery); return; }
    selectPublished(gallery,0);
    button.textContent = 'Pause';
    let index = 0;
    slideshows.set(gallery,setInterval(() => {
      if (!gallery.isConnected || ++index >= gallery.querySelectorAll('[data-cs-published-page]').length) stopSlideshow(gallery);
      else selectPublished(gallery,index);
    },2400));
    return;
  }
  if (gallery && 'csPublishedFull' in data) {
    stopSlideshow(gallery);
    const original = button.closest('.cs-screen');
    original.querySelector('video')?.pause();
    const dialog = document.createElement('dialog');
    dialog.className = 'cs-viewer';
    dialog.setAttribute('aria-label', 'Medium im Vollbild');
    const copy = gallery.cloneNode(true);
    copy.querySelectorAll('[data-cs-published-full]').forEach(control => control.remove());
    copy.querySelectorAll('video').forEach(video => { video.removeAttribute('src'); video.controls = false; });
    copy.querySelectorAll('[data-cs-load-video]').forEach(control => { control.hidden = false; control.disabled = false; });
    dialog.innerHTML = '<div class="cs-viewer-tools"><button type="button" aria-pressed="false">16:9</button><button type="button" aria-label="Vollbild schließen">×</button></div>';
    const [wide, close] = dialog.querySelectorAll('button');
    wide.onclick = () => wide.setAttribute('aria-pressed', String(dialog.classList.toggle('wide')));
    close.onclick = () => dialog.close();
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { stopSlideshow(copy); dialog.remove(); button.focus(); }, {once:true});
    dialog.append(copy);
    document.body.append(dialog);
    dialog.showModal();
    return;
  }
  if (gallery && 'csLoadVideo' in data) {
    const video = button.closest('.cs-screen').querySelector('video');
    button.disabled = true;
    try {
      if (!video.getAttribute('src')) {
        const blob = await TFB.ui.api.getMemberVideo(gallery.dataset.csPost, data.csLoadVideo);
        const url = URL.createObjectURL(blob);
        if (!video.isConnected) { URL.revokeObjectURL(url); return; }
        video.src = url;
        video.addEventListener('loadeddata', () => URL.revokeObjectURL(url), {once:true});
      }
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
    if (video.paused) video.play().then(() => { button.textContent = 'Ⅱ'; }).catch(() => {});
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
  liveEditor(design,draft.dots);
  studio.close();
});
