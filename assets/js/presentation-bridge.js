(function () {
  if (window.parent === window || !new URLSearchParams(location.search).has('tfbPresentation')) return;
  document.documentElement.classList.add('tfb-presentation-page');
  const send = data => window.parent.postMessage({ type: 'tfb-presentation', ...data }, '*');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('.lightbox') && !document.getElementById('sheet-root')?.classList.contains('open')) send({ action: 'exit-focus' });
    if (event.altKey && ['Digit1', 'Digit2', 'Digit3', 'KeyP'].includes(event.code)) {
      event.preventDefault(); send({ action: 'key', code: event.code });
    }
  });
  document.addEventListener('pointermove', event => {
    if (event.clientY > innerHeight - 14) send({ action: 'edge' });
  });
  window.addEventListener('hashchange', () => send({ action: 'route', hash: location.hash }));
})();
