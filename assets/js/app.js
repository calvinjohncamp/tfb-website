// TFB-Kiosk – Oberfläche.
// Eine kleine Single-Page-App ohne Build-Schritt. Alle Daten kommen über TFB.api,
// damit der Wechsel vom Demo-Modus zu Supabase die Oberfläche nicht berührt.
(function () {
  const cfg = TFB.config;
  const api = TFB.api;
  const $app = document.getElementById('app');
  const $sheet = document.getElementById('sheet-root');
  const $toast = document.getElementById('toast-root');

  const VIEWS = ['home', 'kiosk', 'strichliste', 'abrechnungen', 'chat', 'aktuell', 'gefluester', 'sport', 'team', 'club', 'treffen', 'verwaltung', 'impressum', 'satzung'];
  const KIOSK_AREA = ['kiosk', 'strichliste', 'abrechnungen'];   // nur mit Anmeldung
  // Reiter unten: Kiosk zuerst, dann die Vereinsseiten, dann der Padel-Link.
  // Team-Seiten gehören zu „Sport“
  const areaOf = (view) => (KIOSK_AREA.includes(view) ? 'kiosk' : view === 'team' ? 'sport' : view === 'gefluester' ? 'chat' : view);
  const state = {
    member: null,
    catalog: null,
    authStep: 'email',      // email | password | create | unknown
    authEmail: '',
    authFirstName: '',
    openTallyRow: null,
    editMode: false,        // Admin bearbeitet den Kiosk direkt
    lastAdd: null,          // { ids, until, text } – Storno-Stempel auf dem Deckel
  };

  // ---------- Formatierung ----------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euro = (cents) => (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  const monthName = (key, withYear = true) => {
    const [y, m] = key.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('de-DE', { month: 'long', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' });
  };
  const nextMonthDebit = (key) => {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, cfg.debitDayOfMonth));
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  };
  const timeOf = (iso) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: cfg.timeZone });
  const dayKey = (iso) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: cfg.timeZone });
  function dayLabel(iso) {
    const key = dayKey(iso);
    const today = dayKey(new Date().toISOString());
    const yesterday = dayKey(new Date(Date.now() - 864e5).toISOString());
    if (key === today) return 'Heute';
    if (key === yesterday) return 'Gestern';
    return new Date(iso).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: cfg.timeZone });
  }
  const initials = (m) => ((m.firstName || '')[0] || '') + ((m.lastName || '')[0] || '');
  const avatarFace = (m) => (m.avatar ? `<img src="${esc(m.avatar)}" alt="">` : esc(initials(m)));

  // ---------- Erscheinungsbild (fest) ----------
  // Markenfarbe Anthrazit und Schrift Avenir Next sind gesetzt – keine Umschalter mehr in der App.
  const BRAND = '#2A2D2E';
  const FONT = '"Avenir Next", Avenir, -apple-system, "Segoe UI", sans-serif';
  document.documentElement.style.setProperty('--brand', BRAND);
  document.documentElement.style.setProperty('--serif', FONT);
  document.documentElement.dataset.font = 'sans';

  const same = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();
  const visual = (p) => TFB.art(p.art, p.color);
  const strokesWord = (n) => (n === 1 ? '1 Strich' : `${n} Striche`);

  // ---------- Icons ----------
  const icon = {
    kiosk: '<svg viewBox="0 0 24 24"><path d="M4 9h16l-1.5-4.5h-13zM5 9v10h14V9M9 19v-5h6v5"/></svg>',
    tally: '<svg viewBox="0 0 24 24"><path d="M5 5v14M9 5v14M13 5v14M17 5v14M3 16L20 8"/></svg>',
    receipt: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    pencil: '<svg viewBox="0 0 24 24"><path d="M5 19l1.2-4.2L15.5 5.5a2.1 2.1 0 0 1 3 3L9.2 17.8z"/><path d="M13.5 7.5l3 3"/></svg>',
    padel: '<svg viewBox="0 0 24 24"><path d="M10.3 14.4c-2.1-1.6-2.4-5-.4-7.9 1.9-2.8 5-4.1 7.4-3.1 2.5 1 3.4 4 2.1 7-1.2 2.8-4 4.9-6.6 5-1 0-1.9-.3-2.5-1z"/><path d="M10.3 14.4L5.4 19.3" stroke-width="3.4"/><path d="M13.8 7.4h.01M16.6 7.6h.01M12.6 10.2h.01M15.4 10.4h.01" stroke-width="2.3"/></svg>',
    news: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4M8 13.5h3M8 16.5h6"/></svg>',
    sport: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M5.6 6.6c2.6 2.4 2.6 8.4 0 10.8M18.4 6.6c-2.6 2.4-2.6 8.4 0 10.8"/></svg>',
    club: '<svg viewBox="0 0 24 24"><path d="M4 10.5L12 4l8 6.5M6 9.2V20h12V9.2M10 20v-5h4v5"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.8 3.6-5.8 7-5.8s6.2 2 7 5.8"/></svg>',
    admin: '<svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/></svg>',
  };

  // Logo-Bausteine aus brand.css; die Farbe kommt jeweils aus `color`.
  const logo = (part, cls = '') => `<span class="tfb-${part} ${cls}" role="img" aria-label="${esc(cfg.clubName)}"></span>`;

  // ---------- Start ----------
  async function boot() {
    state.catalog = await api.catalog();
    state.member = await api.session();
    // Wer die App neu öffnet, landet immer auf Home – egal, welche Seite zuletzt offen war.
    // Ausnahmen: Neu laden (bleibt auf der Seite) und direkte Links wie #treffen/<id>.
    const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    const deepLink = location.hash.includes('/');
    if (!location.hash || (nav.type !== 'reload' && !deepLink)) history.replaceState(null, '', '#home');
    render();
  }

  function currentView() {
    let v = location.hash.replace('#', '').split('/')[0];   // z. B. #treffen/<id>
    if (v === 'verein') v = 'club';                           // alte Adresse
    if (v === 'verwaltung') return 'home';   // früher eigene Seite – jetzt im Konto-Fenster
    return VIEWS.includes(v) ? v : 'home';
  }

  async function render() {
    closeSheet();
    return renderShell();
  }

  // ---------- Anmeldung ----------
  // Passwortfeld mit Auge zum Anzeigen/Verbergen
  const EYE = '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 20L20 4"/></svg>';
  const pwInput = (attrs) => `<span class="pw-wrap"><input type="password" ${attrs}><button type="button" class="pw-eye" data-pw-toggle aria-label="Passwort anzeigen" aria-pressed="false" title="Passwort anzeigen">${EYE}</button></span>`;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pw-toggle]');
    if (!b) return;
    const input = b.parentElement.querySelector('input');
    const show = input.type === 'password';
    // Beide Felder (Passwort + Wiederholung) gemeinsam umschalten
    (b.closest('form') || document).querySelectorAll('.pw-wrap').forEach((w) => {
      w.querySelector('input').type = show ? 'text' : 'password';
      const t = w.querySelector('[data-pw-toggle]');
      t.innerHTML = show ? EYE_OFF : EYE;
      t.setAttribute('aria-pressed', String(show));
      t.setAttribute('aria-label', show ? 'Passwort verbergen' : 'Passwort anzeigen');
      t.title = t.getAttribute('aria-label');
    });
    input.focus();
  });

  function showAuth(error = '') {
    const s = state.authStep;
    let body = '';
    if (s === 'email') {
      body = `
        <h2>Anmelden</h2>
        <p class="muted">Mit der E-Mail-Adresse, die der Verein von dir hat.</p>
        <label class="field"><span>E-Mail</span>
          <input name="email" type="email" inputmode="email" autocomplete="email" required value="${esc(state.authEmail)}" placeholder="name@beispiel.de">
        </label>
        <button class="btn primary block" type="submit">Weiter</button>`;
    } else if (s === 'password') {
      body = `
        <h2>Hallo ${esc(state.authFirstName)}!</h2>
        <p class="muted">${esc(state.authEmail)}</p>
        <label class="field"><span>Passwort</span>
          ${pwInput('name="password" autocomplete="current-password" required autofocus')}
        </label>
        <button class="btn primary block" type="submit">Anmelden</button>
        <div class="auth-links">
          <button type="button" class="link" data-action="auth-back">Andere E-Mail</button>
          <button type="button" class="link" data-action="forgot">Passwort vergessen?</button>
        </div>`;
    } else if (s === 'create') {
      body = `
        <h2>Willkommen, ${esc(state.authFirstName)}!</h2>
        <p class="muted">Du stehst in der Mitgliederliste der ${esc(cfg.clubName)}. Leg einmalig ein Passwort fest – danach bleibst du auf diesem Handy angemeldet.</p>
        <label class="field"><span>Neues Passwort</span>
          ${pwInput('name="password" autocomplete="new-password" minlength="8" required autofocus placeholder="mindestens 8 Zeichen"')}
        </label>
        <label class="field"><span>Passwort wiederholen</span>
          ${pwInput('name="password2" autocomplete="new-password" minlength="8" required')}
        </label>
        <button class="btn primary block" type="submit">Passwort festlegen</button>
        <div class="auth-links"><button type="button" class="link" data-action="auth-back">Andere E-Mail</button></div>`;
    } else {
      body = `
        <h2>Nicht gefunden</h2>
        <p class="muted"><strong>${esc(state.authEmail)}</strong> steht nicht in unserer Mitgliederliste. Vielleicht hast du dem Verein eine andere Adresse gegeben? Sonst melde dich kurz beim Vorstand.</p>
        <button type="button" class="btn block" data-action="auth-back">Andere E-Mail versuchen</button>`;
    }

    const $view = document.getElementById('view');
    if (!$view) return;
    $view.innerHTML = `
      <section class="auth inline">
        <header class="auth-intro">
          ${logo('ball', 'auth-ball')}
          <div><h1>Der TFB-Kiosk</h1><p class="muted">Für Mitglieder: Getränke anschreiben, Strichliste, Abrechnungen.</p></div>
        </header>
        <form class="card auth-card" data-form="auth" novalidate>
          ${body}
          <p class="form-error" role="alert">${esc(error)}</p>
        </form>
      </section>`;
    const input = $view.querySelector('input');
    if (input && s !== 'email') input.focus();
  }

  async function submitAuth(form) {
    const data = new FormData(form);
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      if (state.authStep === 'email') {
        const email = String(data.get('email') || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
        state.authEmail = email;
        const res = await api.lookupEmail(email);
        state.authFirstName = res.firstName || '';
        state.authStep = !res.known ? 'unknown' : res.hasPassword ? 'password' : 'create';
        return showAuth();
      }
      if (state.authStep === 'password') {
        state.member = await api.signIn(state.authEmail, String(data.get('password') || ''));
      } else if (state.authStep === 'create') {
        const pw = String(data.get('password') || '');
        if (pw.length < 8) throw new Error('Bitte mindestens 8 Zeichen verwenden.');
        if (pw !== String(data.get('password2') || '')) throw new Error('Die beiden Passwörter sind nicht gleich.');
        state.member = await api.createPassword(state.authEmail, pw);
      }
      state.authStep = 'email';
      render();
    } catch (err) {
      showAuth(err.message);
    }
  }

  // ---------- Einmalige Zustimmung ----------
  function consentMarkup() {
    const m = state.member;
    return `
      <section class="consent inline">
        <section class="auth-hero compact">
          ${logo('mark', 'consent-mark')}
          <h1>Schön, dass du da bist, ${esc(m.firstName)}!</h1>
        </section>
        <form class="card" data-form="consent">
          <h2>Einmal kurz zustimmen</h2>
          <p class="muted">Der Kiosk ersetzt unsere Strichliste auf Papier. Das bedeutet:</p>
          <ul class="checklist">
            ${cfg.consentPoints.map((p) => `<li>${icon.check}<span>${esc(p)}</span></li>`).join('')}
          </ul>
          <div class="namecheck">
            <span>Auf der Strichliste stehst du als</span>
            <strong>${esc(m.lastName)}, ${esc(m.firstName)}</strong>
          </div>
          <label class="agree">
            <input type="checkbox" name="agree" required>
            <span>Einverstanden – ab jetzt schreibe ich hier an.</span>
          </label>
          <button class="btn primary block" type="submit" disabled>Los geht's</button>
          <p class="form-error" role="alert"></p>
        </form>
        <button class="link center" type="button" data-action="logout">Abmelden</button>
      </section>`;
  }

  // ---------- App-Rahmen ----------
  function renderShell() {
    const view = currentView();
    const area = areaOf(view);
    navArea = area;
    $app.innerHTML = `
      <header class="topbar">
        <div class="topbar-row">
          <a class="brand" href="#home" aria-label="${esc(cfg.clubName)} – Startseite">
            <span class="tfb-logo-split header-logo" role="img" aria-label="${esc(cfg.clubName)}"><span class="tfb-logo-noball"></span><span class="tfb-logo-ball"></span></span>
          </a>
          ${state.member
            ? `<div class="top-actions">${TFB.inbox ? TFB.inbox.button() : ''}<button class="avatar" type="button" data-action="profile" aria-label="Profil">${avatarFace(state.member)}</button></div>`
            : `<button class="avatar guest" type="button" data-action="login" aria-label="Anmelden">${icon.user}</button>`}
        </div>
        <nav class="topnav" aria-label="Bereiche">${navLinks(area)}</nav>
      </header>
      <main class="view" id="view" data-view="${view}"><div class="loading"></div></main>
      <footer class="site-footer">
        <nav aria-label="Vereinsinformationen"><a href="#impressum">Impressum</a><a href="#satzung">Satzung</a></nav>
        <p>© ${new Date().getFullYear()} Tennisfreunde Bielstein e.V. · Inhalte, Gestaltung &amp; App-Konzept. Alle Rechte vorbehalten.</p>
      </footer>`;
    alignHeader();
    return renderView(view);
  }

  // Profilbild (bzw. Anmelde-Symbol) und Glocke unten exakt auf die Grundlinie der Menüschrift setzen.
  // Gemessen statt fest eingestellt – Schriftmaße unterscheiden sich je nach Browser, Breite und Zoom.
  // Nur wenn das Menü in derselben Zeile steht (ab 1024 px); auf dem Handy bleibt alles wie gestaltet.
  function alignHeader() {
    const act = document.querySelector('.topbar .top-actions') || document.querySelector('.topbar-row > .avatar');
    const tab = document.querySelector('.topnav .tab');
    if (!act || !tab) return;
    act.style.transform = '';
    if (window.innerWidth < 1024) return;
    // Grundlinie direkt an der Schrift: Oberkante der Textzeile + Oberlänge der Schrift
    const range = document.createRange();
    range.selectNodeContents(tab);
    const line = range.getBoundingClientRect();
    const cs = getComputedStyle(tab);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const baseline = line.top + ctx.measureText(tab.textContent).fontBoundingBoxAscent;
    const pic = act.matches('.avatar') ? act : act.querySelector('.avatar');
    const shift = baseline - pic.getBoundingClientRect().bottom;
    if (Math.abs(shift) > 0.4 && Math.abs(shift) < 30) act.style.transform = `translateY(${shift.toFixed(1)}px)`;
  }
  window.addEventListener('resize', () => requestAnimationFrame(alignHeader));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alignHeader());

  // Menü oben: Standard oder – sobald geladen – die im Admin gepflegten Punkte (Name + Ziel: Seite der App oder Website)
  let navArea = '';
  const defaultNav = () => [
    { id: 'kiosk', label: 'Kiosk', target: '#kiosk' }, { id: 'chat', label: 'Chat', target: '#chat' },
    { id: 'aktuell', label: 'Aktuell', target: '#aktuell' }, { id: 'sport', label: 'Sport', target: '#sport' },
    { id: 'club', label: 'Club', target: '#club' },
    ...(cfg.features && cfg.features.treffen ? [{ id: 'treffen', label: 'Verabreden', target: '#treffen' }] : []),
    { id: 'padel', label: 'Padel', target: cfg.padelUrl },
  ];
  function navLinks(area) {
    const items = (TFB.navItems && TFB.navItems()) || defaultNav();
    return items.map((it) => {
      const t = String(it.target || '');
      if (/^https?:\/\//i.test(t)) return `<a href="${esc(t)}" class="tab external" target="_blank" rel="noopener" aria-label="${esc(it.label)} (öffnet in neuem Fenster)">${esc(it.label)}</a>`;
      const page = t.replace(/^#/, '').split('/')[0] || 'home';
      const on = page === area;
      return `<a href="${esc(t || '#home')}" class="tab tab-${esc(page)} ${on ? 'active' : ''}" ${on ? 'aria-current="page"' : ''}>${esc(it.label)}</a>`;
    }).join('');
  }
  TFB.defaultNav = defaultNav;
  TFB.refreshNav = () => { const n = document.querySelector('.topnav'); if (n) n.innerHTML = navLinks(navArea); };

  // Kopf der Unterseiten mit Schließen-Kreuz oben rechts (zurück zum Kiosk).
  const viewHead = (title, sub, close = true) => `
    <header class="view-head">
      <div><h1>${title}</h1><p class="muted">${sub}</p></div>
      ${close ? `<a class="view-close" href="#kiosk" aria-label="Schließen und zurück zum Kiosk">${icon.close}</a>` : ''}
    </header>`;

  // Umschalter innerhalb des Kiosk-Bereichs
  const kioskNav = (view) => `
    <nav class="subnav" aria-label="Kiosk">
      ${[['kiosk', 'Kiosk'], ['strichliste', 'Strichliste'], ['abrechnungen', 'Abrechnungen']].map(([id, label]) =>
        `<a href="#${id}" class="${id === view ? 'on' : ''}" ${id === view ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>`;

  // Zwei Partner je Seite – Rotation wie in der Padel-App (partner-rotation.js)
  function partnerSlot(page, kicker) {
    const pair = TFB.partnerPair ? TFB.partnerPair(page) : [];
    if (!pair.length) return '';
    const tile = (p) => {
      const img = `<img src="${esc(p.logo)}" alt="${esc(p.name)}" decoding="async">`;
      return p.url
        ? `<a class="pbsp-tile" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer nofollow" title="${esc(p.name)}">${img}</a>`
        : `<div class="pbsp-tile" title="${esc(p.name)}">${img}</div>`;
    };
    return `<section class="pbsp-slot" aria-label="Partner"><div class="pbsp-kicker">${esc(kicker)}</div><div class="pbsp-duo">${pair.map(tile).join('')}</div></section>`;
  }

  async function renderView(view = currentView()) {
    const $view = document.getElementById('view');
    if (!$view) return;
    try {
      if (KIOSK_AREA.includes(view)) {
        if (!state.member) return showAuth();
        if (!state.member.hasConsent) { $view.innerHTML = consentMarkup(); return; }
        const body = view === 'kiosk' ? await kioskView() : view === 'strichliste' ? await tallyView() : await statementsView();
        $view.innerHTML = body;
      } else if (TFB.views && TFB.views[view]) $view.innerHTML = await TFB.views[view]();
    } catch (err) {
      $view.innerHTML = `<div class="card error-card"><h2>Das hat nicht geklappt</h2><p>${esc(err.message)}</p></div>`;
    }
  }

  // ---------- Kiosk ----------
  // Der Bierdeckel gilt – wie in der Kneipe – für heute; der Monat steht klein darunter.
  function coasterMarkup(open) {
    const today = dayKey(new Date().toISOString());
    const todays = open.items.filter((i) => dayKey(i.createdAt) === today);
    const count = todays.length;
    const totalToday = todays.reduce((sum, i) => sum + i.priceCents, 0);
    const strokes = count
      ? TFB.strokes(Math.min(count, 25), state.member.id + today) + (count > 25 ? `<em>+${count - 25}</em>` : '')
      : '<em>Noch leer</em>';
    const dateLabel = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: cfg.timeZone });
    const label = `Mein Bierdeckel heute: ${euro(totalToday)}. ${monthName(open.month, false)} gesamt ${euro(open.totalCents)}.`;
    const storno = state.lastAdd && state.lastAdd.until > Date.now() ? state.lastAdd : null;
    return `
      <div class="deckel-wrap">
      ${storno ? `
        <button type="button" class="storno" data-action="storno" data-until="${storno.until}" aria-label="${esc(storno.text)} stornieren">
          <span class="storno-ring"></span><span class="storno-label">Storno</span><small>${Math.ceil((storno.until - Date.now()) / 1000)}</small>
        </button>` : ''}
      <a class="deckel" href="#abrechnungen" aria-label="${esc(label)}">
        <div class="deckel-face">
          <div class="deckel-top">${logo('ball', 'deckel-ball')}<span class="coaster-kicker">Mein Bierdeckel</span><span class="deckel-month">${esc(dateLabel)}</span></div>
          <strong class="coaster-amount">${euro(totalToday)}</strong>
          <div class="coaster-strokes">${strokes}</div>
          <span class="coaster-note">${esc(monthName(open.month, false))} gesamt <b>${euro(open.totalCents)}</b><br>Einzug am ${esc(nextMonthDebit(open.month))}</span>
        </div>
      </a>
      </div>`;
  }

  const isEditing = () => state.editMode && state.member.isAdmin;

  async function kioskView() {
    const open = await api.myOpenMonth();
    const cat = state.catalog;
    const edit = isEditing();
    // Zwei Bereiche: Deckel (auf großen Bildschirmen links feststehend) und Sortiment.
    return `
      <div class="kiosk-layout ${edit ? 'editing' : ''}">
        <aside class="kiosk-side">
          ${edit ? `
            <div class="editbar">
              <div><strong>Kiosk bearbeiten</strong><span>Artikel antippen zum Ändern · Pfeile zum Sortieren</span></div>
              <button type="button" class="btn primary" data-action="edit-done">Fertig</button>
            </div>` : `
            <div class="kiosk-hero">
              ${coasterMarkup(open)}
              <div class="kiosk-links">
                <a class="kiosk-link" href="#strichliste">${icon.tally}<span>Strichliste</span></a>
                <a class="kiosk-link" href="#abrechnungen">${icon.receipt}<span>Abrechnungen</span></a>
              </div>
            </div>`}
        </aside>
        <div class="kiosk-main">
          ${!edit && state.member.isAdmin ? `<div class="kiosk-tools"><button type="button" class="view-close" data-action="edit-start" aria-label="Kiosk bearbeiten" title="Kiosk bearbeiten">${icon.pencil}</button></div>` : ''}
          ${cat.sections.map((section, index) => sectionMarkup(section, index, cat, edit)).join('')}
          ${edit ? `<button type="button" class="btn block add-section" data-action="section-new">${icon.plus} Neuer Bereich</button>` : ''}
        </div>
      </div>
      ${edit ? '' : partnerSlot('kiosk', 'Der TFB-Kiosk wird dir präsentiert von')}`;
  }

  function sectionMarkup(section, index, cat, edit) {
    const items = cat.products.filter((p) => p.section === section.id && (edit || p.active));
    if (!items.length && !edit) return '';
    const soon = section.status === 'soon';
    const tools = edit ? `
      <div class="section-tools">
        <button type="button" data-action="section-move" data-id="${esc(section.id)}" data-dir="-1" ${index === 0 ? 'disabled' : ''} aria-label="Bereich nach oben">${icon.up}</button>
        <button type="button" data-action="section-move" data-id="${esc(section.id)}" data-dir="1" ${index === cat.sections.length - 1 ? 'disabled' : ''} aria-label="Bereich nach unten">${icon.down}</button>
        <button type="button" data-action="section-edit" data-id="${esc(section.id)}" aria-label="Bereich bearbeiten">${icon.pencil}</button>
      </div>` : '';
    const head = `
      <div class="section-head ${edit ? 'editing' : ''}">
        <h2>${esc(section.title)}</h2>
        ${soon ? '<span class="pill soon">Bald</span>' : ''}
        ${!soon && section.note && !edit ? `<span class="muted small">${esc(section.note)}</span>` : ''}
        ${tools}
      </div>
      ${soon && section.note ? `<p class="muted small section-note">${esc(section.note)}</p>` : ''}`;
    const addTile = edit ? `<button type="button" class="tile tile-new" data-action="product-new" data-section="${esc(section.id)}">${icon.plus}<span>Artikel</span></button>` : '';
    return `
      <section class="menu ${soon ? 'is-soon' : ''}">
        ${head}
        <div class="tiles">
          ${items.map((p, i) => edit ? editWrap(p, i, items.length, tile(p, true)) : tile(p, false, soon)).join('')}
          ${addTile}
        </div>
      </section>`;
  }

  // Kachel – bei Bereichen mit Status "bald" gleich groß, aber nur zum Anschauen.
  function tile(p, edit, soon = false) {
    if (soon) {
      return `
        <div class="tile is-soon" aria-disabled="true">
          <div class="tile-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
          <div class="tile-text"><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div>
          <div class="tile-foot"><b>${euro(p.price)}</b><span class="soon-tag">bald</span></div>
        </div>`;
    }
    return `
      <button class="tile" type="button" data-action="${edit ? 'product-edit' : 'pick'}" data-id="${esc(p.id)}">
        <div class="tile-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
        <div class="tile-text"><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div>
        <div class="tile-foot"><b>${euro(p.price)}</b><span class="tile-add">${edit ? icon.pencil : icon.plus}</span></div>
      </button>`;
  }

  // Im Bearbeitungsmodus: Kachel plus Pfeile zum Verschieben innerhalb des Bereichs.
  function editWrap(p, index, total, inner) {
    return `
      <div class="edit-wrap ${p.active ? '' : 'is-hidden'}">
        ${inner}
        ${p.active ? '' : '<span class="hidden-badge">ausgeblendet</span>'}
        <div class="move-tools">
          <button type="button" data-action="product-move" data-id="${esc(p.id)}" data-dir="-1" ${index === 0 ? 'disabled' : ''} aria-label="Nach vorne">${icon.back}</button>
          <button type="button" data-action="product-move" data-id="${esc(p.id)}" data-dir="1" ${index === total - 1 ? 'disabled' : ''} aria-label="Nach hinten">${icon.chevron}</button>
        </div>
      </div>`;
  }

  function openPick(productId) {
    const p = state.catalog.products.find((x) => x.id === productId);
    if (!p) return;
    let qty = 1;
    const update = () => {
      $sheet.querySelector('[data-qty]').textContent = qty;
      $sheet.querySelector('[data-total]').textContent = euro(qty * p.price);
      $sheet.querySelector('[data-step="-1"]').disabled = qty <= 1;
      $sheet.querySelector('[data-step="1"]').disabled = qty >= cfg.maxQuantity;
      $sheet.querySelector('[data-hint]').textContent = qty > 1 ? `Runde: ${qty} Striche auf deinen Deckel` : 'Eine Runde ausgeben? Einfach die Anzahl erhöhen.';
    };
    openSheet(`
      <div class="pick">
        <div class="pick-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
        <h2>${esc(p.name)}</h2>
        <p class="muted">${esc(p.detail)} · ${euro(p.price)}</p>
        <div class="stepper" role="group" aria-label="Anzahl">
          <button type="button" class="step" data-step="-1" aria-label="Weniger">${icon.minus}</button>
          <output data-qty aria-live="polite">1</output>
          <button type="button" class="step" data-step="1" aria-label="Mehr">${icon.plus}</button>
        </div>
        <p class="muted small" data-hint></p>
        <button type="button" class="btn primary block big" data-confirm>
          Auf meinen Bierdeckel · <span data-total>${euro(p.price)}</span>
        </button>
        <p class="fineprint">Abrechnung am Monatsende per Lastschrift</p>
      </div>`);
    update();
    $sheet.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
      qty = Math.max(1, Math.min(cfg.maxQuantity, qty + Number(b.dataset.step)));
      update();
    }));
    $sheet.querySelector('[data-confirm]').addEventListener('click', async (e) => {
      e.currentTarget.disabled = true;
      try {
        const ids = await api.addToTab(p.id, qty);
        closeSheet();
        if (navigator.vibrate) navigator.vibrate(12);
        const text = `${qty > 1 ? qty + ' × ' : ''}${p.name}`;
        state.lastAdd = { ids, until: Date.now() + cfg.undoSeconds * 1000, text };
        toast(`${text} auf deinem Deckel`, true);
        await renderView();
        // Hoch zum Deckel: neuer Strich und Storno-Stempel sind sofort sichtbar.
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        const d = document.querySelector('a.deckel');
        if (d) { d.classList.add('wobble'); setTimeout(() => d.classList.remove('wobble'), 600); }
      } catch (err) {
        e.currentTarget.disabled = false;
        toast(err.message);
      }
    });
  }

  // ---------- Strichliste ----------
  // Strichliste in vier Spalten – so sieht jeder auf einen Blick, ob Getränke, Kränze, Snacks und
  // Equipment wirklich angeschrieben wurden. Zuordnung über den Bereich im Sortiment (demo-backend.js).
  const TALLY_CATS = [['drinks', 'Getränke', 'Getr.'], ['kranz', 'Kranz', 'Kranz'], ['snacks', 'Snacks', 'Snacks'], ['equipment', 'Equipment', 'Equip.']];
  async function tallyView() {
    const rows = await api.tally();
    const from = new Date(Date.now() - (cfg.tallyDays - 1) * 864e5);
    const range = `${from.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', timeZone: cfg.timeZone })} – heute`;
    return `
      ${viewHead('Strichliste', `Letzte ${cfg.tallyDays} Tage · ${esc(range)}`)}
      <section class="paper tally-paper">
        ${rows.length ? `<div class="tally-head" aria-hidden="true"><span></span>${TALLY_CATS.map(([c, l, short]) => `<span class="${c}"><b class="full">${l}</b><b class="short">${short}</b></span>`).join('')}</div>` : ''}
        ${rows.length ? rows.map((r, i) => {
          const key = `${r.lastName}|${r.firstName}`;
          const open = state.openTallyRow === key;
          const detail = Object.entries(r.counts).sort((a, b) => b[1] - a[1]).map(([name, n]) => `${n} × ${esc(name)}`).join(' · ');
          const cell = (cat) => {
            const n = r.cats[cat] || 0;
            const max = cat === 'drinks' ? 15 : 10;   // Getränke: Platz für drei Bündel (15 Striche)
            return `<span class="tally-cell ${cat}" aria-label="${TALLY_CATS.find(([c]) => c === cat)[1]}: ${strokesWord(n)}">${n ? TFB.strokes(Math.min(n, max), key + cat) + (n > max ? `<em>+${n - max}</em>` : '') : ''}</span>`;
          };
          return `
            <button type="button" class="paper-row tally-row ${r.isMe ? 'me' : ''} ${open ? 'open' : ''}" data-action="tally-row" data-key="${esc(key)}" aria-expanded="${open}">
              <span class="paper-name">${esc(r.lastName)}, ${esc(r.firstName)}${r.isMe ? ' <em>du</em>' : ''}</span>
              ${TALLY_CATS.map(([c]) => cell(c)).join('')}
              ${open ? `<span class="paper-detail">${detail}</span>` : ''}
            </button>`;
        }).join('') : '<p class="paper-empty">In den letzten sieben Tagen hat noch niemand angeschrieben.</p>'}
      </section>
      <p class="fineprint">Ältere Striche verschwinden automatisch. Beträge siehst du nur für dich selbst unter „Abrechnungen“.</p>
      ${partnerSlot('strichliste', 'Die Strichliste wird dir präsentiert von')}`;
  }

  // ---------- Abrechnungen ----------
  async function statementsView() {
    const [open, closed] = await Promise.all([api.myOpenMonth(), api.myStatements()]);
    const groups = new Map();
    // Eine Runde (gleicher Artikel, gleicher Zeitpunkt) erscheint als eine Zeile.
    for (const item of open.items) {
      const key = dayKey(item.createdAt);
      if (!groups.has(key)) groups.set(key, { label: dayLabel(item.createdAt), lines: [] });
      const lines = groups.get(key).lines;
      const last = lines[lines.length - 1];
      if (last && last.productId === item.productId && last.createdAt === item.createdAt) {
        last.ids.push(item.id);
        last.qty++;
        last.priceCents += item.priceCents;
      } else {
        lines.push({ ...item, ids: [item.id], qty: 1 });
      }
    }
    const now = Date.now();
    return `
      ${viewHead('Meine Abrechnungen', 'Nur für dich sichtbar')}

      <section class="card month-card">
        <div class="month-top">
          <span class="pill live">läuft</span>
          <span class="muted">${esc(monthName(open.month))}</span>
        </div>
        <strong class="month-amount">${euro(open.totalCents)}</strong>
        <p class="muted">${strokesWord(open.items.length)} · Einzug am ${esc(nextMonthDebit(open.month))} per SEPA-Lastschrift</p>
        ${groups.size ? [...groups.values()].map((g) => `
          <div class="day">
            <h3>${esc(g.label)}</h3>
            ${g.lines.map((i) => {
              const until = Date.parse(i.createdAt) + cfg.undoSeconds * 1000;
              return `
                <div class="line">
                  <span class="line-time">${timeOf(i.createdAt)}</span>
                  <span class="line-name">${i.qty > 1 ? `${i.qty} × ` : ''}${esc(i.productName)}</span>
                  ${until > now ? `<button type="button" class="undo-chip" data-action="undo" data-ids="${esc(i.ids.join(','))}" data-until="${until}">stornieren</button>` : ''}
                  <span class="line-price">${euro(i.priceCents)}</span>
                </div>`;
            }).join('')}
          </div>`).join('') : '<p class="empty">Diesen Monat noch nichts angeschrieben.</p>'}
      </section>

      <section>
        <div class="section-head"><h2>Abgeschlossene Monate</h2></div>
        ${closed.length ? `<div class="card list">${closed.map((s) => `
          <div class="statement">
            <div><strong>${esc(monthName(s.month))}</strong><span class="muted small">${strokesWord(s.itemCount)}</span></div>
            <div class="statement-right">
              <b>${euro(s.totalCents)}</b>
              ${s.status === 'collected'
                ? '<span class="pill ok">eingezogen</span>'
                : `<span class="pill soon">Einzug am ${esc(nextMonthDebit(s.month))}</span>`}
            </div>
          </div>`).join('')}</div>` : '<p class="empty">Noch keine abgeschlossenen Monate.</p>'}
      </section>
      <p class="fineprint">Der Verein zieht den Betrag eines Monats zum ${cfg.debitDayOfMonth}. des Folgemonats über dein bestehendes SEPA-Mandat ein.</p>
      ${partnerSlot('abrechnungen', 'Deine Abrechnung wird dir präsentiert von')}`;
  }

  async function commitCatalog(next, message) {
    try {
      state.catalog = await api.saveCatalog(next);
      if (message) toast(message);
    } catch (err) {
      toast(err.message);
    }
    renderView();
  }

  function moveProduct(id, dir) {
    const next = JSON.parse(JSON.stringify(state.catalog));
    const p = next.products.find((x) => x.id === id);
    const siblings = next.products.filter((x) => x.section === p.section);
    const target = siblings[siblings.indexOf(p) + dir];
    if (!target) return;
    const a = next.products.indexOf(p);
    const b = next.products.indexOf(target);
    [next.products[a], next.products[b]] = [next.products[b], next.products[a]];
    commitCatalog(next);
  }

  function moveSection(id, dir) {
    const next = JSON.parse(JSON.stringify(state.catalog));
    const a = next.sections.findIndex((x) => x.id === id);
    const b = a + dir;
    if (b < 0 || b >= next.sections.length) return;
    [next.sections[a], next.sections[b]] = [next.sections[b], next.sections[a]];
    commitCatalog(next);
  }

  const PRODUCT_COLORS = ['#E9B949', '#F0C93A', '#E3A33B', '#F08A24', '#C4553A', '#B7282E', '#6B2E4F',
    '#2E4E9E', '#2F5D8A', '#7FB7D9', '#5BB98B', '#5E6B2A', '#5A3825', '#2A2D2E'];
  const parsePrice = (text) => {
    const v = Number(String(text).trim().replace(/\s|€/g, '').replace(',', '.'));
    return Number.isFinite(v) ? Math.round(v * 100) : NaN;
  };
  const priceText = (cents) => (cents / 100).toFixed(2).replace('.', ',');

  function openProductEditor(id, sectionId) {
    const original = state.catalog.products.find((x) => x.id === id);
    const draft = original
      ? { ...original }
      : { id: 'p-' + Date.now().toString(36), section: sectionId, name: '', detail: '', price: 200, art: 'bottle', color: '#C4553A', active: true };
    const sections = state.catalog.sections;
    openSheet(`
      <form class="editor" data-editor="product" novalidate>
        <h2>${original ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h2>
        <div class="editor-preview" data-preview></div>
        <label class="field"><span>Name</span>
          <input name="name" maxlength="40" value="${esc(draft.name)}" placeholder="z. B. Chipsfrisch" required>
        </label>
        <label class="field"><span>Zusatzzeile</span>
          <input name="detail" maxlength="80" value="${esc(draft.detail)}" placeholder="z. B. Ungarisch · 175 g">
        </label>
        <div class="field-row">
          <label class="field"><span>Preis in €</span>
            <input name="price" inputmode="decimal" value="${priceText(draft.price)}" required>
          </label>
          <label class="field"><span>Bereich</span>
            <select name="section">${sections.map((x) => `<option value="${esc(x.id)}" ${x.id === draft.section ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select>
          </label>
        </div>
        <div class="field"><span>Symbol</span>
          <div class="symbol-grid">
            ${TFB.artKinds.map(([kind, label]) => `<button type="button" class="symbol ${kind === draft.art ? 'on' : ''}" data-art="${kind}" title="${label}" aria-label="${label}">${TFB.art(kind, draft.color)}</button>`).join('')}
          </div>
        </div>
        <div class="field"><span>Farbe</span>
          <div class="swatches">
            ${PRODUCT_COLORS.map((hex) => `<button type="button" class="swatch ${same(hex, draft.color) ? 'on' : ''}" style="--c:${hex}" data-color="${hex}" aria-label="Farbe ${hex}"></button>`).join('')}
            <label class="swatch empty" title="Eigene Farbe oder Pipette">${icon.plus}<input type="color" value="${esc(draft.color)}" data-color-picker aria-label="Eigene Farbe"></label>
          </div>
        </div>
        <label class="agree"><input type="checkbox" name="active" ${draft.active ? 'checked' : ''}><span>Im Kiosk sichtbar</span></label>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn primary block">Speichern</button>
        ${original ? '<button type="button" class="btn block danger" data-delete>Artikel löschen</button>' : ''}
      </form>`);

    const form = $sheet.querySelector('[data-editor]');
    const preview = () => {
      form.querySelector('[data-preview]').innerHTML = tile(draft, false).replace('data-action="pick"', 'tabindex="-1"');
      form.querySelectorAll('.symbol').forEach((b) => {
        b.classList.toggle('on', b.dataset.art === draft.art);
        b.innerHTML = TFB.art(b.dataset.art, draft.color);
      });
      form.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('on', same(b.dataset.color, draft.color)));
    };
    preview();
    form.addEventListener('input', (e) => {
      const t = e.target;
      if (t.name === 'name' || t.name === 'detail') draft[t.name] = t.value;
      if (t.name === 'price') { const c = parsePrice(t.value); if (Number.isFinite(c)) draft.price = c; }
      if (t.matches('[data-color-picker]')) draft.color = t.value;
      preview();
    });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'section') draft.section = e.target.value;
      if (e.target.name === 'active') draft.active = e.target.checked;
    });
    form.addEventListener('click', (e) => {
      const sym = e.target.closest('[data-art]');
      const col = e.target.closest('[data-color]');
      if (sym) { draft.art = sym.dataset.art; preview(); }
      if (col) { draft.color = col.dataset.color; preview(); }
      const del = e.target.closest('[data-delete]');
      if (del) {
        if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
        const next = JSON.parse(JSON.stringify(state.catalog));
        next.products = next.products.filter((x) => x.id !== draft.id);
        closeSheet();
        commitCatalog(next, `„${draft.name}“ gelöscht`);
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = form.querySelector('.form-error');
      draft.name = draft.name.trim();
      draft.price = parsePrice(form.elements.price.value);
      if (!draft.name) { err.textContent = 'Bitte einen Namen eingeben.'; return; }
      if (!Number.isFinite(draft.price) || draft.price < 0 || draft.price > 50000) { err.textContent = 'Bitte einen gültigen Preis eingeben, z. B. 2,50.'; return; }
      const next = JSON.parse(JSON.stringify(state.catalog));
      const i = next.products.findIndex((x) => x.id === draft.id);
      if (i >= 0 && next.products[i].section === draft.section) next.products[i] = draft;
      else {
        if (i >= 0) next.products.splice(i, 1);
        next.products.push(draft); // neu oder in anderen Bereich verschoben: hinten anstellen
      }
      closeSheet();
      commitCatalog(next, original ? 'Gespeichert' : `„${draft.name}“ angelegt`);
    });
  }

  function openSectionEditor(id) {
    const original = state.catalog.sections.find((x) => x.id === id);
    const draft = original ? { ...original } : { id: 's-' + Date.now().toString(36), title: '', note: '', status: 'open' };
    const used = original ? state.catalog.products.filter((p) => p.section === id).length : 0;
    openSheet(`
      <form class="editor" data-editor="section" novalidate>
        <h2>${original ? 'Bereich bearbeiten' : 'Neuer Bereich'}</h2>
        <label class="field"><span>Name</span><input name="title" maxlength="40" value="${esc(draft.title)}" placeholder="z. B. Heißgetränke" required></label>
        <label class="field"><span>Hinweis (optional)</span><input name="note" maxlength="120" value="${esc(draft.note)}" placeholder="z. B. Kalt aus dem Kühlschrank"></label>
        <div class="field"><span>Status</span>
          <div class="seg">
            <button type="button" class="${draft.status === 'open' ? 'on' : ''}" data-status="open">Geöffnet</button>
            <button type="button" class="${draft.status === 'soon' ? 'on' : ''}" data-status="soon">Bald (nur Vorschau)</button>
          </div>
        </div>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn primary block">Speichern</button>
        ${original ? (used
          ? `<p class="fineprint">Zum Löschen zuerst die ${used} Artikel verschieben oder löschen.</p>`
          : '<button type="button" class="btn block danger" data-delete>Bereich löschen</button>') : ''}
      </form>`);
    const form = $sheet.querySelector('[data-editor]');
    form.addEventListener('click', (e) => {
      const st = e.target.closest('[data-status]');
      if (st) {
        draft.status = st.dataset.status;
        form.querySelectorAll('[data-status]').forEach((b) => b.classList.toggle('on', b === st));
      }
      const del = e.target.closest('[data-delete]');
      if (del) {
        if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
        const next = JSON.parse(JSON.stringify(state.catalog));
        next.sections = next.sections.filter((x) => x.id !== id);
        closeSheet();
        commitCatalog(next, 'Bereich gelöscht');
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      draft.title = form.elements.title.value.trim();
      draft.note = form.elements.note.value.trim();
      if (!draft.title) { form.querySelector('.form-error').textContent = 'Bitte einen Namen eingeben.'; return; }
      const next = JSON.parse(JSON.stringify(state.catalog));
      const i = next.sections.findIndex((x) => x.id === draft.id);
      if (i >= 0) next.sections[i] = draft; else next.sections.push(draft);
      closeSheet();
      commitCatalog(next, original ? 'Gespeichert' : `Bereich „${draft.title}“ angelegt`);
    });
  }

  // ---------- Profil ----------
  // Account-Karte – Aufbau nach dem Vorbild der Padel-App: Profilbild, Name, Mitgliedschaft,
  // eigene Angaben und Einstellungen; Admin-Bereich (Mitgliederliste, Sichern, Foto-Freigaben) und „Als App aufs Handy“ ganz unten.
  async function openProfile() {
    const m = state.member;
    let open = null;
    if (m.hasConsent) { try { open = await api.myOpenMonth(); } catch (_) {} }
    const today = dayKey(new Date().toISOString());
    const todayCents = open ? open.items.filter((i) => dayKey(i.createdAt) === today).reduce((s, i) => s + i.priceCents, 0) : 0;
    const consentDate = m.consentedAt ? new Date(m.consentedAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const row = (on, title, sub) => `
      <div class="acct-row">
        <span class="acct-check ${on ? 'on' : ''}" aria-hidden="true">${on ? icon.check : ''}</span>
        <div><strong>${title}</strong><small>${sub}</small></div>
      </div>`;
    openSheet(`
      <div class="acct">
        <header class="acct-head">
          <div class="avatar lg acct-avatar">
            ${m.avatar
              ? `<button type="button" class="avatar-zoom" data-action="avatar-zoom" aria-label="Profilbild groß ansehen">${avatarFace(m)}</button>`
              : `<span>${avatarFace(m)}</span>`}
            <label class="avatar-edit" title="Profilbild ändern" aria-label="Profilbild ändern">
              ${icon.camera}<input type="file" accept="image/*" data-avatar-input hidden>
            </label>
          </div>
          <p class="acct-kicker">Dein Account</p>
          <h2 class="acct-name">${esc(m.firstName)} ${esc(m.lastName)}</h2>
          <p class="acct-meta">Mitglied Nr. ${esc(m.memberNo)}${m.isAdmin ? '<span class="acct-badge">Admin</span>' : ''}</p>
        </header>

        <section class="acct-card">
          ${row(true, `Mitglied der ${esc(cfg.clubName)}`, 'Erkannt über deine E-Mail-Adresse aus der Mitgliederliste – du musst nichts eintragen.')}
          ${row(m.hasConsent, 'Kiosk &amp; Lastschrift', m.hasConsent
            ? `Freigeschaltet am ${esc(consentDate)} · Einzug zum ${cfg.debitDayOfMonth}. des Folgemonats`
            : 'Noch nicht freigeschaltet – beim ersten Besuch im Kiosk einmal zustimmen.')}
        </section>

        ${open ? `
        <section class="acct-stats">
          <a href="#kiosk" data-action="close-sheet"><small>Heute</small><b>${euro(todayCents)}</b></a>
          <a href="#abrechnungen" data-action="close-sheet"><small>${esc(monthName(open.month, false))}</small><b>${euro(open.totalCents)}</b></a>
          <a href="#abrechnungen" data-action="close-sheet"><small>Einzug</small><b>${esc(nextMonthDebit(open.month).replace(/(\d+)\. (\w{3})\w*/, '$1. $2'))}</b></a>
        </section>` : ''}

        <form class="acct-card acct-form" data-account-form novalidate>
          <h3 class="acct-section">Deine Angaben</h3>
          <div class="field-row">
            <label class="field"><span>Vorname</span><input name="firstName" value="${esc(m.firstName)}" autocomplete="given-name"></label>
            <label class="field"><span>Nachname</span><input name="lastName" value="${esc(m.lastName)}" autocomplete="family-name"></label>
          </div>
          <label class="field"><span>E-Mail</span><input name="email" type="email" inputmode="email" value="${esc(m.email)}" autocomplete="email"></label>
          <p class="acct-hint">Name und E-Mail sind deine Daten in der Mitgliederliste des Clubs. Änderst du sie hier, gelten sie auch beim Club – mit der neuen E-Mail meldest du dich künftig an. Der Vorstand sieht jede Änderung.</p>
          <label class="field"><span>Handynummer <em>freiwillig</em></span><input name="phone" type="tel" inputmode="tel" value="${esc(m.phone)}" placeholder="z. B. 0170 1234567"></label>

          <h3 class="acct-section">Benachrichtigungen</h3>
          <label class="acct-pref"><input type="checkbox" name="infoMails" ${m.infoMails !== false ? 'checked' : ''}>
            <span><strong>E-Mail-Benachrichtigungen vom Club</strong><em>Termine, Turniere, Platzsperrungen zusätzlich per E-Mail. In der App stehen sie ohnehin unter Aktuell und im Chat. Abrechnungen bekommst du unabhängig davon.</em></span></label>
          <label class="acct-pref"><input type="checkbox" name="openInvites" ${m.openInvites !== false ? 'checked' : ''}>
            <span><strong>Einladungen von allen</strong><em>Alle Mitglieder finden dich beim Verabreden über deinen Namen oder deine E-Mail. Ausgeschaltet laden dich nur deine Gruppen ein.</em></span></label>

          <h3 class="acct-section">Profilbild</h3>
          <div class="acct-photo">
            <span class="acct-photo-preview">${avatarFace(m)}</span>
            <div class="acct-photo-actions">
              <label class="btn small">Bild auswählen<input type="file" accept="image/*" data-avatar-input hidden></label>
              ${m.avatar ? '<button type="button" class="btn small" data-action="avatar-crop">Ausschnitt anpassen</button><button type="button" class="btn small ghost-danger" data-action="avatar-remove">Entfernen</button>' : ''}
            </div>
            <p class="acct-hint">Freiwillig. ${m.photoMinor ? 'Für die Anzeige bei anderen Mitgliedern ist eine Elternfreigabe erforderlich.' : 'Sichtbar für angemeldete Mitglieder. Öffentlich nur mit deiner zusätzlichen Freigabe.'}</p>
            <button type="button" class="btn small acct-photo-rights" data-action="photo-settings">Foto-Freigaben</button>
          </div>
          <button type="submit" class="btn primary block">Speichern</button>
        </form>

        ${m.isAdmin ? `
        <section class="acct-adminbox">
          <h3 class="acct-section">Admin</h3>
          <p class="acct-hint">Seiten und Kiosk bearbeitest du direkt dort über den Stift oben rechts.</p>
          ${TFB.memberImport ? TFB.memberImport.card() : ''}
          <section class="card admin-card">
            <h2>Sichern &amp; Laden</h2>
            <p class="muted">Alle Inhalte – Seiten, Fotos, Mitglieder, Sortiment, Striche, Verabredungen – in einer Datei. So bist du vor Datenverlust geschützt und kannst alles auf einen anderen Rechner übertragen.</p>
            <div class="admin-links">
              <button type="button" class="btn primary" data-action="backup-save">Inhalte sichern</button>
              <label class="btn">Sicherung laden<input type="file" accept=".json,application/json" data-backup-input hidden></label>
            </div>
            ${TFB.autosave ? `<h3 class="font-group">Automatisch sichern</h3>${TFB.autosave.box()}` : ''}
          </section>
          <section class="card admin-card">
            <h2>Foto-Freigaben</h2>
            <p class="muted">Öffentliche Profilfotos und Elternfreigaben prüfen.</p>
            <button type="button" class="btn" data-action="photo-admin">${icon.camera} Freigaben prüfen</button>
          </section>
        </section>` : ''}

        <button type="button" class="btn block acct-logout" data-action="logout">Abmelden</button>

        <section class="acct-install">
          <span class="acct-install-icon" aria-hidden="true">${logo('ball', 'acct-install-ball')}</span>
          <div>
            <strong>Als App aufs Handy</strong>
            <ol>
              <li><b>iPhone:</b> unten auf <i>Teilen</i> tippen → <i>Zum Home-Bildschirm</i></li>
              <li><b>Android:</b> Menü <i>⋮</i> → <i>App installieren</i></li>
            </ol>
          </div>
        </section>
        ${api.mode === 'demo' ? '<button type="button" class="link center small" data-action="demo-reset">Demo-Daten zurücksetzen</button>' : ''}
      </div>`);
  }

  // ---------- Bild groß ansehen ----------
  function openLightbox(src, caption) {
    if (!src) return;
    if (document.querySelector('.lightbox')) return;
    const focus = document.activeElement;
    const wasLocked = document.body.classList.contains('no-scroll');
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <figure role="dialog" aria-modal="true" aria-label="${esc(caption || 'Foto')}">
        <img src="${esc(src)}" alt="${esc(caption || 'Foto')}">
        <figcaption>${logo('ball', 'lightbox-ball')}<span>${esc(caption)}</span></figcaption>
      </figure>
      <button type="button" class="lightbox-close" data-action="lightbox-close" aria-label="Schließen">${icon.close}</button>`;
    const close = () => {
      box.classList.remove('open');
      document.removeEventListener('keydown', onKey, true);
      if (!wasLocked) document.body.classList.remove('no-scroll');
      focus?.focus?.();
      setTimeout(() => box.remove(), 200);
    };
    box.closePhoto = close;
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(); }
      if (event.key === 'Tab') { event.preventDefault(); box.querySelector('.lightbox-close').focus(); }
    };
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target === box || event.target.closest('.lightbox-close')) close();
    });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => { box.classList.add('open'); box.querySelector('.lightbox-close').focus(); });
  }
  function closeLightbox() {
    document.querySelectorAll('.lightbox').forEach((b) => {
      b.closePhoto();
    });
  }

  // ---------- Sheet & Toasts ----------
  function openSheet(html) {
    // Schon offen (z. B. Neuaufbau nach einem Tipp im Formular): nur den Inhalt tauschen –
    // ohne neues Einblenden und an derselben Scroll-Position.
    const open = $sheet.classList.contains('open') && $sheet.querySelector('.sheet');
    if (open) {
      const top = open.scrollTop;
      open.innerHTML = `<button type="button" class="sheet-close" data-action="close-sheet" aria-label="Schließen">${icon.close}</button>${html}`;
      open.scrollTop = top;
      return;
    }
    $sheet.innerHTML = `
      <div class="sheet-backdrop" data-action="close-sheet"></div>
      <div class="sheet" role="dialog" aria-modal="true">
        <button type="button" class="sheet-close" data-action="close-sheet" aria-label="Schließen">${icon.close}</button>
        ${html}
      </div>`;
    requestAnimationFrame(() => $sheet.classList.add('open'));
    document.body.classList.add('no-scroll');
  }
  function closeSheet() {
    $sheet.classList.remove('open');
    $sheet.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }

  let toastTimer = null;
  function toast(text, ok = false) {
    clearTimeout(toastTimer);
    $toast.innerHTML = `<div class="toast">${ok ? icon.check : ''}<span>${esc(text)}</span></div>`;
    toastTimer = setTimeout(() => { $toast.innerHTML = ''; }, 2500);
  }

  // Storno-Knöpfe laufen nach einer Minute ab: in der Abrechnung und als Stempel auf dem Deckel.
  function tickStorno() {
    const now = Date.now();
    document.querySelectorAll('.undo-chip[data-until]').forEach((b) => {
      if (Number(b.dataset.until) <= now) b.remove();
    });
    const badge = document.querySelector('.storno[data-until]');
    if (!badge) return;
    const left = Number(badge.dataset.until) - now;
    if (left <= 0) {
      state.lastAdd = null;
      badge.classList.add('gone');
      setTimeout(() => badge.remove(), 250);
      return;
    }
    badge.style.setProperty('--p', (left / (cfg.undoSeconds * 1000)).toFixed(3));
    badge.querySelector('small').textContent = Math.ceil(left / 1000);
  }
  setInterval(tickStorno, 250);

  // ---------- Ereignisse ----------
  document.addEventListener('submit', async (e) => {
    const acct = e.target.closest('[data-account-form]');
    if (acct) {
      e.preventDefault();
      try {
        const before = state.member.email;
        state.member = await api.updateProfile({
          firstName: acct.elements.firstName.value, lastName: acct.elements.lastName.value, email: acct.elements.email.value,
          phone: acct.elements.phone.value, infoMails: acct.elements.infoMails.checked, openInvites: acct.elements.openInvites.checked,
        });
        toast(before !== state.member.email ? `Gespeichert – anmelden künftig mit ${state.member.email}` : 'Angaben gespeichert', true);
        refreshAvatars();
        await TFB.refreshSite();
        openProfile();
      } catch (err) { toast(err.message); }
      return;
    }
  });
  document.addEventListener('submit', (e) => {
    if (e.target.closest('[data-editor]')) return; // Editoren haben eigene Handler
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    if (form.dataset.form === 'auth') submitAuth(form);
    if (form.dataset.form === 'consent') {
      api.acceptConsent()
        .then((m) => { state.member = m; render(); })
        .catch((err) => { form.querySelector('.form-error').textContent = err.message; });
    }
  });

  // Profilbild: mittig quadratisch zuschneiden, auf 256 px verkleinern, als JPEG speichern.
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Dieses Bild lässt sich nicht öffnen.')); };
      img.src = url;
    });
  }
  function largeImage(img, maxSide = 1400) {
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.86);
  }
  function shrinkImage(file, size = 256) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        canvas.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Dieses Bild lässt sich nicht öffnen.')); };
      img.src = url;
    });
  }
  function refreshAvatars() {
    const btn = document.querySelector('.topbar .avatar');
    if (btn) btn.innerHTML = avatarFace(state.member);
  }

  // Profilbild-Ausschnitt: Foto im Kreis verschieben und zoomen. Das Original bleibt unverändert,
  // gespeichert wird nur das kleine runde Bild (320 px) als Ausschnitt.
  function openAvatarCropper(src, onSave, options = {}) {
    const V = 260;
    const img = new Image();
    img.onload = () => {
      const base = Math.max(V / img.naturalWidth, V / img.naturalHeight);
      let zoom = Math.max(1, Math.min(4, Number(options.initial?.zoom) || 1));
      let x = Number(options.initial?.x) || 0, y = Number(options.initial?.y) || 0;
      openSheet(`
        <div class="editor cropper">
          <h2>Ausschnitt wählen</h2>
          <p class="muted small">Foto mit dem Finger oder der Maus verschieben, mit dem Regler vergrößern. Das Originalfoto bleibt unverändert.</p>
          <div class="crop-view" data-crop><img class="crop-img" src="${src}" alt="" draggable="false"></div>
          <label class="crop-zoom"><span>−</span><input type="range" min="1" max="4" step="0.01" value="${zoom}" data-crop-zoom aria-label="Zoom"><span>+</span></label>
          <button type="button" class="btn primary block" data-crop-save>Übernehmen</button>
          <button type="button" class="link center" data-crop-cancel>Abbrechen</button>
        </div>`);
      const view = document.querySelector('[data-crop]');
      const el = view.querySelector('img');
      const size = () => ({ w: img.naturalWidth * base * zoom, h: img.naturalHeight * base * zoom });
      const clamp = () => {
        const { w, h } = size();
        x = Math.max(-(w - V) / 2, Math.min((w - V) / 2, x));
        y = Math.max(-(h - V) / 2, Math.min((h - V) / 2, y));
      };
      const draw = () => {
        clamp();
        const { w, h } = size();
        Object.assign(el.style, { width: `${w}px`, height: `${h}px`, left: `${V / 2 - w / 2 + x}px`, top: `${V / 2 - h / 2 + y}px` });
      };
      let drag = null;
      view.addEventListener('pointerdown', (e) => { drag = { sx: e.clientX, sy: e.clientY, x, y }; view.setPointerCapture(e.pointerId); });
      view.addEventListener('pointermove', (e) => { if (!drag) return; x = drag.x + e.clientX - drag.sx; y = drag.y + e.clientY - drag.sy; draw(); });
      view.addEventListener('pointerup', () => { drag = null; });
      view.addEventListener('pointercancel', () => { drag = null; });
      document.querySelector('[data-crop-cancel]').addEventListener('click', () => options.onCancel ? options.onCancel() : closeSheet());
      view.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.max(1, Math.min(4, zoom - e.deltaY * 0.002)); document.querySelector('[data-crop-zoom]').value = zoom; draw(); }, { passive: false });
      document.querySelector('[data-crop-zoom]').addEventListener('input', (e) => { zoom = Number(e.target.value); draw(); });
      document.querySelector('[data-crop-save]').addEventListener('click', async () => {
        const out = 320, k = out / V;
        const { w, h } = size();
        const c = document.createElement('canvas');
        c.width = out; c.height = out;
        c.getContext('2d').drawImage(img, (V / 2 - w / 2 + x) * k, (V / 2 - h / 2 + y) * k, w * k, h * k);
        try { await onSave(c.toDataURL('image/jpeg', 0.88), { zoom, x, y }); } catch (err) { toast(err.message); }
      });
      draw();
    };
    img.onerror = () => toast('Dieses Foto lässt sich nicht öffnen.');
    img.src = src;
  }

  document.addEventListener('change', async (e) => {
    if (e.target.matches('[data-backup-input]') && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = '';
      try {
        const data = JSON.parse(await file.text());
        const when = data.createdAt ? new Date(data.createdAt).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) : 'unbekannt';
        if (!confirm(`Sicherung vom ${when} laden?\n\nAlle Inhalte auf diesem Gerät werden durch die Sicherung ersetzt.`)) return;
        const { photos } = await api.importAll(data);
        Object.entries(data.extra || {}).forEach(([k, v]) => { try { if (v != null) localStorage.setItem(k, v); } catch (_) {} });
        toast(`Geladen: ${photos} Fotos – die App startet neu`, true);
        setTimeout(() => location.reload(), 1200);
      } catch (err) { toast(err.message || 'Diese Datei lässt sich nicht laden.'); }
      return;
    }
    if (e.target.matches('[data-avatar-input]') && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const large = largeImage(await loadImage(file));
        openAvatarCropper(large, async (small) => {
          state.member = await api.setAvatar(small, large);
          refreshAvatars();
          await TFB.refreshSite();
          openProfile();
          toast('Profilbild gespeichert', true);
        });
      } catch (err) { toast(err.message); }
      return;
    }
    if (e.target.name === 'agree') e.target.form.querySelector('button[type=submit]').disabled = !e.target.checked;
  });

  document.addEventListener('click', async (e) => {
    // Bierdeckel: erst kurz wackeln lassen, dann zur Abrechnung.
    const deckel = e.target.closest('a.deckel');
    if (deckel) {
      e.preventDefault();
      if (deckel.classList.contains('wobble')) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      deckel.classList.add('wobble');
      setTimeout(() => { location.hash = '#abrechnungen'; }, reduce ? 0 : 480);
      return;
    }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action === 'pick') openPick(el.dataset.id);
    else if (action === 'profile') openProfile();
    else if (action === 'close-sheet') closeSheet();
    else if (action === 'auth-back') { state.authStep = 'email'; showAuth(); }
    else if (action === 'login') { if (currentView() === 'kiosk') renderView(); else location.hash = '#kiosk'; }
    else if (action === 'forgot') toast('Passwort-Zurücksetzen per Mail kommt mit dem Echtbetrieb.');
    else if (action === 'demo-fill') {
      state.authEmail = api.demoLogin.email;
      state.authStep = 'email';
      showAuth();
    } else if (action === 'logout') {
      await api.signOut();
      state.member = null;
      state.authStep = 'email';
      render();
    } else if (action === 'demo-reset') {
      await api.resetDemo();
      state.member = null;
      state.authStep = 'email';
      state.authEmail = '';
      render();
      toast('Demo-Daten wurden neu erzeugt.');
    } else if (action === 'backup-save') {
      try {
        el.disabled = true;
        const data = await api.exportAll();
        data.extra = {};
        ['tfb_kiosk_look_v3', 'tfb_meet_demo_v2'].forEach((k) => { try { data.extra[k] = localStorage.getItem(k); } catch (_) {} });
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const stamp = new Date().toLocaleString('sv-SE', { timeZone: cfg.timeZone }).slice(0, 16).replace(' ', '_').replace(':', '-');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `TFB-Sicherung_${stamp}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast(`Gesichert: ${Object.keys(data.images).length} Fotos – Datei liegt in „Downloads“`, true);
      } catch (err) { toast(err.message); } finally { el.disabled = false; }
    } else if (action === 'edit-start') {
      state.editMode = true;
      if (currentView() === 'kiosk') renderView(); else location.hash = '#kiosk';
    } else if (action === 'edit-done') {
      state.editMode = false;
      renderView();
      window.scrollTo(0, 0);
    } else if (action === 'product-edit') openProductEditor(el.dataset.id);
    else if (action === 'product-new') openProductEditor(null, el.dataset.section);
    else if (action === 'product-move') moveProduct(el.dataset.id, Number(el.dataset.dir));
    else if (action === 'section-move') moveSection(el.dataset.id, Number(el.dataset.dir));
    else if (action === 'section-edit') openSectionEditor(el.dataset.id);
    else if (action === 'section-new') { openSectionEditor(null);
    } else if (action === 'avatar-crop') {
      const large = state.member.avatarLarge || state.member.avatar;
      openAvatarCropper(large, async (small) => {
        state.member = await api.setAvatar(small, large);
        refreshAvatars();
        await TFB.refreshSite();
        openProfile();
        toast('Ausschnitt gespeichert', true);
      });
    } else if (action === 'avatar-zoom') {
      openLightbox(state.member.avatarLarge || state.member.avatar, `${state.member.firstName} ${state.member.lastName}`);
    } else if (action === 'lightbox-close') {
      closeLightbox();
    } else if (action === 'avatar-remove') {
      state.member = await api.setAvatar(null);
      refreshAvatars();
      await TFB.refreshSite();
      openProfile();
    } else if (action === 'tally-row') {
      state.openTallyRow = state.openTallyRow === el.dataset.key ? null : el.dataset.key;
      renderView('strichliste');
    } else if (action === 'storno') {
      const last = state.lastAdd;
      el.disabled = true;
      state.lastAdd = null;
      try { if (last) await api.undo(last.ids); toast(`${last ? last.text : 'Eintrag'} storniert`, true); } catch (err) { toast(err.message); }
      renderView();
    } else if (TFB.actions && TFB.actions[action]) {
      TFB.actions[action](el, e);
    } else if (action === 'undo') {
      el.disabled = true;
      try { await api.undo(el.dataset.ids.split(',')); state.lastAdd = null; toast('Storniert', true); } catch (err) { toast(err.message); }
      renderView();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.lightbox')) closeLightbox(); else closeSheet();
  });

  window.addEventListener('hashchange', () => {
    const view = currentView();
    document.querySelectorAll('.topnav .tab').forEach((t) => {
      const active = t.getAttribute('href') === '#' + areaOf(view);
      t.classList.toggle('active', active);
      if (active) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    document.getElementById('view').dataset.view = view;
    if (view !== 'kiosk') state.editMode = false;
    closeSheet();
    window.scrollTo(0, 0);
    renderView(view);
  });

  // Beim Zurückkehren in die App frische Zahlen zeigen (Strichliste rollt weiter).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !$sheet.innerHTML && !document.querySelector('.editing-page')) renderView();
  });

  // Schnittstelle für die Vereinsseiten (site.js)
  TFB.ui = { state, api, cfg, esc, icon, logo, viewHead, partnerSlot, openSheet, closeSheet, toast, renderView, currentView, loadImage, largeImage, openLightbox, openAvatarCropper };

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  boot();
})();
