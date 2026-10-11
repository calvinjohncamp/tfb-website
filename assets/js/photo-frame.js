// Non-destructive photo framing; no canvas export or file:// image access required.
(function () {
  const ratios = { portrait: 3 / 4, landscape: 3 / 2, square: 1 };
  const clamp = (n, min, max, fallback) => Number.isFinite(Number(n)) ? Math.max(min, Math.min(max, Number(n))) : fallback;
  const normalize = (value) => value && Object.hasOwn(ratios, value.format) ? {
    format: value.format, zoom: clamp(value.zoom, 1, 4, 1),
    x: clamp(value.x, 0, 1, .5), y: clamp(value.y, 0, 1, .5),
  } : null;
  function geometry(iw, ih, width, format, zoom) {
    const height = width / ratios[format];
    const scale = Math.max(width / iw, height / ih) * zoom;
    return { width, height, excessX: iw * scale - width, excessY: ih * scale - height };
  }
  const style = (frame) => `--photo-ratio:${ratios[frame.format]};--photo-zoom:${frame.zoom};--photo-x:${frame.x * 100}%;--photo-y:${frame.y * 100}%`;
  function open(src, initial, save, trigger) {
    const ui = TFB.ui;
    let frame = normalize(initial) || { format: 'landscape', zoom: 1, x: .5, y: .5 };
    let loaded = false, drag = null, busy = false;
    const root = document.createElement('div');
    root.className = 'photo-frame-overlay';
    root.innerHTML = `<section class="photo-frame-dialog" role="dialog" aria-modal="true" aria-labelledby="photo-frame-title">
      <header><h2 id="photo-frame-title">Foto einpassen</h2><button type="button" data-frame-close aria-label="Schließen">${ui.icon.close}</button></header>
      <div class="seg frame-formats" aria-label="Rahmenformat">${[['portrait','Hochformat'],['landscape','Querformat'],['square','Quadratisch']].map(([v,l]) => `<button type="button" data-frame-format="${v}" aria-pressed="${v === frame.format}">${l}</button>`).join('')}</div>
      <div class="frame-stage"><div class="photo-frame active" data-frame-stage><img src="${ui.esc(src)}" alt="Bildausschnitt" draggable="false"></div></div>
      <label class="field"><span>Zoom</span><input type="range" min="1" max="4" step=".01" value="${frame.zoom}" data-frame-zoom></label>
      <div class="field-row"><label class="field"><span>Horizontal</span><input type="range" min="0" max="1" step=".001" value="${frame.x}" data-frame-x></label><label class="field"><span>Vertikal</span><input type="range" min="0" max="1" step=".001" value="${frame.y}" data-frame-y></label></div>
      <p class="form-error" role="alert"></p>
      <div class="frame-actions"><button type="button" class="btn" data-frame-original>Originalansicht</button><button type="button" class="btn primary" data-frame-save disabled>Übernehmen</button></div>
    </section>`;
    document.body.append(root);
    const inertTargets = [document.getElementById('app'), document.getElementById('sheet-root')].filter(Boolean);
    const inertBefore = inertTargets.map(el => el.inert);
    inertTargets.forEach(el => { el.inert = true; });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const stage = root.querySelector('[data-frame-stage]'), image = stage.querySelector('img');
    const error = root.querySelector('.form-error');
    const draw = () => {
      stage.style.cssText = style(frame);
      root.querySelectorAll('[data-frame-format]').forEach(b => { const on = b.dataset.frameFormat === frame.format; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      ['zoom','x','y'].forEach(k => { root.querySelector(`[data-frame-${k}]`).value = frame[k]; });
    };
    function close() {
      document.removeEventListener('keydown', keydown, true);
      inertTargets.forEach((el, i) => { el.inert = inertBefore[i]; });
      document.body.style.overflow = previousOverflow;
      root.remove();
      if (trigger?.isConnected) trigger.focus();
    }
    function keydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); if (!busy) close(); }
      if (e.key === 'Tab') {
        const controls = [...root.querySelectorAll('button:not(:disabled),input:not(:disabled)')];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', keydown, true);
    root.querySelector('[data-frame-close]').focus();
    const persist = async (value) => {
      if (busy) return;
      busy = true;
      root.querySelectorAll('button,input').forEach(el => { el.disabled = true; });
      try { await save(value); close(); } catch (err) {
        error.textContent = err.message; busy = false;
        root.querySelectorAll('button,input').forEach(el => { el.disabled = false; });
        root.querySelector('[data-frame-save]').disabled = !loaded;
      }
    };
    root.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (busy) return;
      if (e.target === root || button?.hasAttribute('data-frame-close')) close();
      if (button?.dataset.frameFormat) { frame.format = button.dataset.frameFormat; drag = null; draw(); }
      if (button?.hasAttribute('data-frame-original')) persist(null);
      if (button?.hasAttribute('data-frame-save') && loaded) persist(normalize(frame));
    });
    root.addEventListener('input', e => {
      for (const k of ['zoom','x','y']) if (e.target.hasAttribute(`data-frame-${k}`)) { frame[k] = Number(e.target.value); draw(); }
    });
    stage.addEventListener('pointerdown', e => {
      if (!loaded || busy || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: frame.x, y: frame.y };
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const g = geometry(image.naturalWidth, image.naturalHeight, stage.clientWidth, frame.format, frame.zoom);
      frame.x = g.excessX > .01 ? clamp(drag.x - (e.clientX - drag.sx) / g.excessX, 0, 1, .5) : .5;
      frame.y = g.excessY > .01 ? clamp(drag.y - (e.clientY - drag.sy) / g.excessY, 0, 1, .5) : .5;
      draw();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(event => stage.addEventListener(event, () => { drag = null; }));
    image.onload = () => {
      if (loaded) return;
      loaded = true;
      if (!normalize(initial)) {
        const ratio = image.naturalWidth / image.naturalHeight;
        frame.format = ratio < .95 ? 'portrait' : ratio > 1.05 ? 'landscape' : 'square';
        draw();
      }
      root.querySelector('[data-frame-save]').disabled = false;
    };
    image.onerror = () => { error.textContent = 'Dieses Foto lässt sich nicht öffnen.'; };
    if (image.complete && image.naturalWidth) image.onload();
    draw();
  }
  TFB.photoFrame = { normalize, geometry, style, open };
})();
