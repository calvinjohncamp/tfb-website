(function () {
  const ui = () => TFB.ui;
  const embedded = window.parent !== window && new URLSearchParams(location.search).has('tfbPresentation');
  let installPrompt = null;
  let overlay = null;
  let previousFocus = null;
  let latestRoute = location.hash;
  let previousScroll = 0;
  let closing = false;
  const symbol = name => lucide.createElement(lucide.icons[name]).outerHTML;
  const tile = '<img class="signature-app-icon" src="assets/icons/icon-512.png" alt="TFB">';
  function headerButton() {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (mobile) return '';
    const label = embedded ? 'Fokus beenden' : 'Fokus';
    return `<button class="header-focus" type="button" data-action="focus-open" aria-label="${label}" title="${label}"><span aria-hidden="true">F</span><span class="header-focus-tooltip" aria-hidden="true">${label}</span></button>`;
  }
  const settings = value => ({
    enabled: value?.enabled !== false,
    after: Math.max(1, Math.min(3, Math.round(Number(value?.after) || 2))),
    height: Math.max(180, Math.min(480, Math.round(Number(value?.height) || 240))),
  });
  const guides = () => `<dl class="focus-platforms">
    <div><dt>Mac</dt><dd>Chrome: installieren · Safari: zum Dock hinzufügen.</dd></div>
    <div><dt>Windows</dt><dd>In Chrome oder Edge als App installieren.</dd></div>
    <div><dt>Mobil</dt><dd>iPhone/iPad: Teilen → Home-Bildschirm · Android: App installieren.</dd></div>
  </dl>`;
  const actions = () => `<div class="focus-actions">
    <button class="btn focus-enter" type="button" data-action="focus-open">${symbol(embedded ? 'Minimize' : 'Scan')} ${embedded ? 'Fokus beenden' : 'Fokus'}</button>
    <button class="btn focus-install" type="button" data-action="focus-install">${symbol('Download')} Als App installieren</button>
  </div>`;
  function strip(value, admin = false) {
    const config = settings(value);
    if (!config.enabled) return '';
    return `<section class="focus-strip" style="--focus-height:${config.height}px" aria-label="TF Bielstein als App">
      <div class="focus-strip-main">${tile}<div class="focus-copy"><h2>TF Bielstein</h2><p>Dein Verein, direkt auf deinem Bildschirm.</p></div>${actions()}</div>
      ${guides()}
      ${admin ? `<button class="focus-strip-edit" type="button" data-action="focus-strip-edit" aria-label="Fokus-Streifen bearbeiten" title="Fokus-Streifen bearbeiten">${symbol('Pencil')}</button>` : ''}
    </section>`;
  }
  function accountCard() {
    return `<section class="acct-install signature-install">${tile}<div class="focus-actions"><button class="btn focus-enter" type="button" data-action="focus-open">${symbol(embedded ? 'Minimize' : 'Scan')} ${embedded ? 'Fokus beenden' : 'Fokus'}</button></div></section>`;
  }
  function install() {
    const offline = location.protocol === 'file:';
    const installed = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    ui().openSheet(`<section class="editor focus-install-sheet">
      <div class="focus-install-heading">${tile}<div><h2>TF Bielstein</h2><p>Dein App-Symbol auf Mac, Windows und Mobilgeräten.</p></div></div>
      ${installed ? '<p>Du verwendest TF Bielstein bereits als App.</p>' : ''}
      ${offline ? `<p class="focus-local-note">Du verwendest die lokale Website. Ein Startknopf öffnet genau diesen Websiteordner als eigenes App-Fenster. Der Ordner muss auf deinem Rechner bleiben.</p>
        <div class="focus-downloads"><a class="btn primary" href="assets/downloads/tf-bielstein-mac-v2.zip" download>${symbol('Download')} Mac-Startknopf laden</a>
        <a class="btn" href="assets/downloads/TF-Bielstein-Windows.cmd" download>${symbol('Download')} Windows-Startknopf laden</a></div>
        <dl class="focus-install-steps"><div><dt>Mac</dt><dd>Lokaler Test-Startknopf für Apple Silicon und Chrome. ZIP öffnen und „TF Bielstein“ auf den Schreibtisch oder ins Dock ziehen. Falls gefragt, den lokalen Websiteordner auswählen. Dieser Download ist noch nicht von Apple beglaubigt und kann deshalb von macOS blockiert werden. Die spätere Browser-Installation der veröffentlichten Website benötigt diesen Download nicht.</dd></div>
        <div><dt>Windows</dt><dd>Den Startknopf ausführen und den lokalen Websiteordner auswählen. Danach liegt „TF Bielstein“ auf dem Desktop. Chrome oder Edge muss installiert sein.</dd></div></dl>`
        : `${!installed && installPrompt ? `<button class="btn primary" type="button" data-action="focus-install-confirm">${symbol('Download')} Jetzt installieren</button>` : ''}
        <dl class="focus-install-steps"><div><dt>Mac · Chrome</dt><dd>Im Browsermenü „Speichern und teilen“ → „Seite als App installieren“.</dd></div>
        <div><dt>Mac · Safari</dt><dd>„Ablage“ → „Zum Dock hinzufügen“ (ab macOS Sonoma).</dd></div>
        <div><dt>Windows</dt><dd>In Chrome „Seite als App installieren“; in Edge „Apps“ → „Diese Website als App installieren“.</dd></div></dl>`}
      <dl class="focus-install-steps"><div><dt>iPhone &amp; iPad</dt><dd>Die veröffentlichte Website in Safari öffnen: „Teilen“ → „Zum Home-Bildschirm“ → „Hinzufügen“.</dd></div>
      <div><dt>Android</dt><dd>Die veröffentlichte Website in Chrome öffnen: Menü → „App installieren“.</dd></div></dl>
    </section>`);
  }
  async function closeFocus() {
    if (!overlay || closing) return;
    closing = true;
    if (document.fullscreenElement === overlay) await document.exitFullscreen().catch(() => {});
    overlay.remove(); overlay = null;
    document.body.classList.remove('tfb-focus-active');
    const oldMember = ui().state.member?.id;
    await ui().api.reloadLocalState?.();
    ui().state.member = await ui().api.session();
    ui().state.catalog = await ui().api.catalog();
    if (oldMember !== ui().state.member?.id) {
      history.replaceState(null, '', latestRoute || '#home');
      location.reload();
      return;
    }
    ui().refreshAvatars?.();
    await TFB.refreshSite?.(true);
    if (latestRoute && latestRoute !== location.hash) location.hash = latestRoute;
    window.scrollTo(0, previousScroll);
    previousFocus?.focus();
    closing = false;
  }
  function openFocus() {
    if (embedded) { window.parent.postMessage({ type: 'tfb-presentation', action: 'exit-focus' }, '*'); return; }
    if (overlay) return;
    previousFocus = document.activeElement;
    previousScroll = scrollY;
    latestRoute = location.hash;
    ui().closeSheet();
    overlay = document.createElement('div');
    overlay.className = 'tfb-focus-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Fokus');
    const frame = document.createElement('iframe');
    const url = new URL('praesentation.html', location.href);
    url.hash = location.hash || '#home';
    frame.src = url.href;
    frame.title = 'TF Bielstein im Fokus';
    frame.allow = 'fullscreen; clipboard-write';
    frame.allowFullscreen = true;
    overlay.append(frame);
    document.body.append(overlay);
    document.body.classList.add('tfb-focus-active');
    if (overlay.requestFullscreen) overlay.requestFullscreen().catch(() => {
      ui().toast('Fokus ist geöffnet. Vollbild wurde vom Browser nicht freigegeben.');
    });
    frame.focus();
  }
  window.addEventListener('message', event => {
    if (!overlay || event.source !== overlay.firstChild.contentWindow) return;
    if (event.data?.type === 'tfb-focus-close') closeFocus();
    if (event.data?.type === 'tfb-focus-route' && /^#[a-z][a-z0-9_/-]*$/i.test(event.data.hash || '')) latestRoute = event.data.hash;
  });
  document.addEventListener('fullscreenchange', () => {
    if (overlay && !document.fullscreenElement) closeFocus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay && !document.fullscreenElement) closeFocus();
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); installPrompt = event;
  });
  window.addEventListener('appinstalled', () => { installPrompt = null; });
  TFB.actions = TFB.actions || {};
  TFB.actions['focus-open'] = openFocus;
  TFB.actions['focus-install'] = install;
  TFB.actions['focus-install-confirm'] = async () => {
    if (!installPrompt) { install(); return; }
    const prompt = installPrompt; installPrompt = null;
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === 'accepted') { ui().closeSheet(); ui().toast('TF Bielstein wird installiert.', true); }
    } catch (_) { install(); }
  };
  TFB.focus = { settings, strip, accountCard, tile, symbol, headerButton };
})();
