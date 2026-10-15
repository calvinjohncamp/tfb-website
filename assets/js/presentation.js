(function () {
  const viewport = document.getElementById('viewport');
  const frame = document.getElementById('site');
  const nav = document.querySelector('nav');
  const widths = { desktop: 1440, tablet: 834, phone: 390 };
  const embedded = window.parent !== window;
  if (location.hash) frame.src = 'index.html?tfbPresentation=1' + location.hash;
  const sendParent = data => { if (embedded) window.parent.postMessage(data, '*'); };
  let hideTimer;
  let dragging = false;
  lucide.createIcons();

  function reveal() {
    document.body.classList.add('controls');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!nav.matches(':hover') && !nav.contains(document.activeElement)) document.body.classList.remove('controls');
    }, 2000);
  }
  function setWidth(width, mode = '') {
    width = Math.min(Math.max(320, width), Math.max(320, innerWidth));
    viewport.style.setProperty('--width', width + 'px');
    document.querySelectorAll('[data-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    });
  }
  function setMode(mode) {
    setWidth(widths[mode], mode);
    frame.focus();
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) { reveal(); }
  }
  function keyAction(code) {
    const mode = { Digit1: 'desktop', Digit2: 'tablet', Digit3: 'phone' }[code];
    if (mode) setMode(mode);
    if (code === 'KeyP') reveal();
  }
  window.addEventListener('keydown', event => {
    if (event.altKey && ['Digit1', 'Digit2', 'Digit3', 'KeyP'].includes(event.code)) {
      event.preventDefault(); keyAction(event.code);
    }
  });
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.data?.type !== 'tfb-presentation') return;
    if (event.data.action === 'key') keyAction(event.data.code);
    if (event.data.action === 'edge') reveal();
    if (event.data.action === 'route') sendParent({ type: 'tfb-focus-route', hash: event.data.hash });
    if (event.data.action === 'exit-focus') {
      if (embedded) sendParent({ type: 'tfb-focus-close' });
      else window.close();
    }
  });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
  document.getElementById('close').addEventListener('click', () => {
    if (embedded) sendParent({ type: 'tfb-focus-close' }); else window.close();
  });
  document.getElementById('reveal').addEventListener('pointerenter', reveal);
  nav.addEventListener('pointerenter', reveal);
  nav.addEventListener('pointerleave', reveal);
  nav.addEventListener('focusout', reveal);
  nav.querySelectorAll('button').forEach(button => {
    const tooltip = () => { nav.querySelector('.tooltip').textContent = button.title; };
    button.addEventListener('pointerenter', tooltip);
    button.addEventListener('focus', tooltip);
  });
  document.querySelectorAll('.grip').forEach(grip => {
    grip.addEventListener('pointerdown', event => {
      dragging = true;
      grip.setPointerCapture(event.pointerId);
    });
    grip.addEventListener('pointermove', event => {
      if (dragging) setWidth(Math.abs(event.clientX - innerWidth / 2) * 2);
    });
    grip.addEventListener('pointerup', () => { dragging = false; });
    grip.addEventListener('pointercancel', () => { dragging = false; });
    grip.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setWidth(viewport.getBoundingClientRect().width + (event.key === 'ArrowRight' ? 20 : -20));
    });
  });
  setMode('desktop');
  reveal();
})();
