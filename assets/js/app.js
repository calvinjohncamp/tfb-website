// TFB-Kiosk – Oberfläche.
// Eine kleine Single-Page-App ohne Build-Schritt. Alle Daten kommen über TFB.api,
// damit der Wechsel vom Demo-Modus zu Supabase die Oberfläche nicht berührt.
(function () {
  const cfg = TFB.config;
  const api = TFB.api;
  const $app = document.getElementById('app');
  const $sheet = document.getElementById('sheet-root');
  const $toast = document.getElementById('toast-root');

  const VIEWS = ['kiosk', 'strichliste', 'abrechnungen', 'aktuell', 'sport', 'verein', 'treffen', 'verwaltung'];
  const KIOSK_AREA = ['kiosk', 'strichliste', 'abrechnungen'];   // nur mit Anmeldung
  // Reiter unten: Kiosk zuerst, dann die Vereinsseiten, dann der Padel-Link.
  const areaOf = (view) => (KIOSK_AREA.includes(view) ? 'kiosk' : view);
  // Wort neben dem Logo: der aktuelle Bereich
  const AREA_LABEL = { kiosk: 'Kiosk', aktuell: 'Aktuell', sport: 'Sport', verein: 'Verein', verwaltung: 'Verwaltung' };
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

  // ---------- Markenfarbe (Verwaltung) ----------
  // Im Demo-Modus nur auf diesem Gerät gemerkt; mit Supabase gilt sie für alle.
  const LOOK_KEY = 'tfb_kiosk_look_v3';
  const BRAND_COLORS = [['#000000', 'Schwarz'], ['#2A2D2E', 'Anthrazit'], ['#C4553A', 'Sandplatz-Rot']];
  const FREE_SLOTS = 4;
  const isHex = (v) => /^#[0-9a-f]{6}$/i.test(String(v || ''));
  const look = { brand: '#2A2D2E', custom: [] };
  try { Object.assign(look, JSON.parse(localStorage.getItem(LOOK_KEY) || '{}')); } catch (_) {}
  if (!isHex(look.brand)) look.brand = '#2A2D2E';
  look.custom = Array.from({ length: FREE_SLOTS }, (_, i) => (isHex(look.custom[i]) ? look.custom[i] : null));
  function saveLook() { try { localStorage.setItem(LOOK_KEY, JSON.stringify(look)); } catch (_) {} }
  function applyLook() {
    document.documentElement.style.setProperty('--brand', look.brand);
  }
  applyLook();

  const visual = (p) => TFB.art(p.art, p.color);
  const same = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();
  const colorName = (hex) => (BRAND_COLORS.find(([h]) => same(h, hex)) || [0, `Eigene Farbe ${hex.toUpperCase()}`])[1];
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
    if (!location.hash) history.replaceState(null, '', '#kiosk');   // Kiosk ist immer die Startseite
    render();
  }

  function currentView() {
    const v = location.hash.replace('#', '').split('/')[0];   // z. B. #treffen/<id>
    if (v === 'verwaltung' && !(state.member && state.member.isAdmin)) return 'aktuell';
    return VIEWS.includes(v) ? v : 'kiosk';
  }

  async function render() {
    closeSheet();
    return renderShell();
  }

  // ---------- Anmeldung ----------
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
          <input name="password" type="password" autocomplete="current-password" required autofocus>
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
          <input name="password" type="password" autocomplete="new-password" minlength="8" required autofocus placeholder="mindestens 8 Zeichen">
        </label>
        <label class="field"><span>Passwort wiederholen</span>
          <input name="password2" type="password" autocomplete="new-password" minlength="8" required>
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
        ${api.mode === 'demo' ? `
          <aside class="demo-hint">
            <span class="pill">Demo</span>
            <p>Alle Daten bleiben auf diesem Gerät. Zum Ausprobieren:</p>
            <button type="button" class="link" data-action="demo-fill">${esc(api.demoLogin.email)}</button>
          </aside>` : ''}
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
    const tabs = [
      ['kiosk', 'Kiosk', icon.kiosk],
      ['aktuell', 'Aktuell', icon.news],
      ['sport', 'Sport', icon.sport],
      ['verein', 'Verein', icon.club],
      ...(cfg.features && cfg.features.treffen ? [['treffen', 'Treffen', icon.news]] : []),
      ['padel', 'Padel', icon.padel, cfg.padelUrl],
    ];
    $app.innerHTML = `
      <header class="topbar">
        <div class="topbar-row">
          <a class="brand" href="#kiosk" aria-label="${esc(cfg.clubName)} – Startseite">
            ${logo('logo', 'header-logo')}
          </a>
          ${state.member
            ? `<button class="avatar" type="button" data-action="profile" aria-label="Profil">${avatarFace(state.member)}</button>`
            : `<button class="avatar guest" type="button" data-action="login" aria-label="Anmelden">${icon.user}</button>`}
        </div>
        <nav class="topnav" aria-label="Bereiche">
          ${tabs.map(([id, label, ic, url]) => url
            ? `<a href="${esc(url)}" class="tab external" target="_blank" rel="noopener" aria-label="${label} – Buchungs-App öffnen (neues Fenster)">${label}</a>`
            : `<a href="#${id}" class="tab ${id === area ? 'active' : ''}" ${id === area ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
        </nav>
      </header>
      <main class="view" id="view" data-view="${view}"><div class="loading"></div></main>`;
    return renderView(view);
  }

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
      } else if (view === 'verwaltung') $view.innerHTML = adminView();
      else if (TFB.views && TFB.views[view]) $view.innerHTML = await TFB.views[view]();
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
  async function tallyView() {
    const rows = await api.tally();
    const from = new Date(Date.now() - (cfg.tallyDays - 1) * 864e5);
    const range = `${from.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', timeZone: cfg.timeZone })} – heute`;
    return `
      ${viewHead('Strichliste', `Letzte ${cfg.tallyDays} Tage · ${esc(range)}`)}
      <section class="paper">
        ${rows.length ? rows.map((r, i) => {
          const key = `${r.lastName}|${r.firstName}`;
          const open = state.openTallyRow === key;
          const detail = Object.entries(r.counts).sort((a, b) => b[1] - a[1]).map(([name, n]) => `${n} × ${esc(name)}`).join(' · ');
          return `
            <button type="button" class="paper-row ${r.isMe ? 'me' : ''} ${open ? 'open' : ''}" data-action="tally-row" data-key="${esc(key)}" aria-expanded="${open}">
              <span class="paper-name">${esc(r.lastName)}, ${esc(r.firstName)}${r.isMe ? ' <em>du</em>' : ''}</span>
              <span class="paper-strokes" aria-label="${strokesWord(r.total)}">${TFB.strokes(r.total, key)}</span>
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

  // ---------- Verwaltung (nur Admins) ----------
  function brandSwatches() {
    return `
      <div class="swatches" role="group" aria-label="Markenfarbe">
        ${BRAND_COLORS.map(([hex, name]) => `<button type="button" class="swatch ${same(look.brand, hex) ? 'on' : ''}" style="--c:${hex}" data-action="brand" data-value="${hex}" title="${name}" aria-label="${name}"></button>`).join('')}
        <span class="swatch-gap" aria-hidden="true"></span>
        ${look.custom.map((hex, i) => hex
          ? `<span class="swatch-slot">
               <button type="button" class="swatch ${same(look.brand, hex) ? 'on' : ''}" style="--c:${hex}" data-action="brand" data-value="${hex}" aria-label="Eigene Farbe ${hex}"></button>
               <button type="button" class="swatch-clear" data-action="slot-clear" data-slot="${i}" aria-label="Farbe entfernen">${icon.close}</button>
             </span>`
          : `<label class="swatch empty" title="Freies Feld: Farbe wählen oder mit Pipette aufnehmen">
               ${icon.plus}
               <input type="color" value="${esc(look.brand)}" data-slot-picker="${i}" aria-label="Freies Farbfeld belegen">
             </label>`).join('')}
      </div>
      <small class="muted">${esc(colorName(look.brand))}</small>`;
  }

  function adminView() {
    const cat = state.catalog;
    const active = cat.products.filter((p) => p.active).length;
    return `
      ${viewHead('Verwaltung', 'Nur für Admins sichtbar')}
      <section class="card admin-card">
        <h2>Website</h2>
        <p class="muted">Seiten direkt bearbeiten: Bausteine anlegen, Fotos hochladen, Texte und Termine pflegen.</p>
        <div class="admin-links">
          ${['aktuell', 'sport', 'verein'].map((p) => `<button type="button" class="btn" data-action="site-edit" data-page="${p}">${icon.pencil} ${p[0].toUpperCase() + p.slice(1)}</button>`).join('')}
        </div>
      </section>
      <section class="card admin-card">
        <h2>Sortiment</h2>
        <p class="muted">${active} Artikel in ${cat.sections.length} Bereichen. Artikel, Preise, Symbole und Reihenfolge änderst du direkt am Kiosk – so, wie die Mitglieder ihn sehen.</p>
        <button type="button" class="btn primary block" data-action="edit-start">${icon.pencil} Kiosk bearbeiten</button>
      </section>
      <section class="card admin-card">
        <h2>Markenfarbe</h2>
        <p class="muted">Färbt Logo, Bierdeckel und Akzente. Freie Felder mit Farbwähler oder Pipette belegen, mit × wieder leeren.</p>
        ${brandSwatches()}
      </section>
      <section class="card admin-card later">
        <h2>Kommt später</h2>
        <ul>
          <li>Mitgliederliste aus Excel übernehmen</li>
          <li>Monatsabschluss und Lastschrift-Export für den Kassenwart</li>
          <li>Rollen für Kassenwart und Vorstand</li>
        </ul>
      </section>`;
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
  function openProfile() {
    const m = state.member;
    openSheet(`
      <div class="profile">
        <div class="avatar lg">
          ${m.avatar
            ? `<button type="button" class="avatar-zoom" data-action="avatar-zoom" aria-label="Profilbild groß ansehen">${avatarFace(m)}</button>`
            : `<span>${avatarFace(m)}</span>`}
          <label class="avatar-edit" title="Profilbild ändern" aria-label="Profilbild ändern">
            ${icon.camera}
            <input type="file" accept="image/*" data-avatar-input hidden>
          </label>
        </div>
        <h2>${esc(m.firstName)} ${esc(m.lastName)}</h2>
        <p class="muted">${esc(m.email)}<br>Mitgliedsnummer ${esc(m.memberNo)}</p>
        ${m.avatar ? '<button type="button" class="link center small" data-action="avatar-remove">Profilbild entfernen</button>' : '<p class="muted small">Tippe auf die Kamera, um ein Profilbild zu wählen.</p>'}

        <div class="card soft install">
          <strong>Als App aufs Handy</strong>
          <p class="small">iPhone: Teilen-Symbol → „Zum Home-Bildschirm“.<br>Android: Menü ⋮ → „App installieren“.</p>
        </div>
        ${m.isAdmin ? `<a class="btn primary block" href="#verwaltung" data-action="close-sheet">${icon.admin} Verwaltung</a>` : ''}
        <button type="button" class="btn block" data-action="logout">Abmelden</button>
        ${api.mode === 'demo' ? '<button type="button" class="link center" data-action="demo-reset">Demo-Daten zurücksetzen</button>' : ''}
      </div>`);
  }

  // ---------- Bild groß ansehen ----------
  function openLightbox(src, caption) {
    if (!src) return;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.dataset.action = 'lightbox-close';
    box.innerHTML = `
      <figure role="dialog" aria-modal="true" aria-label="${esc(caption)}">
        <img src="${esc(src)}" alt="Profilbild von ${esc(caption)}">
        <figcaption>${logo('ball', 'lightbox-ball')}<span>${esc(caption)}</span></figcaption>
      </figure>
      <button type="button" class="lightbox-close" data-action="lightbox-close" aria-label="Schließen">${icon.close}</button>`;
    document.body.appendChild(box);
    requestAnimationFrame(() => box.classList.add('open'));
  }
  function closeLightbox() {
    document.querySelectorAll('.lightbox').forEach((b) => {
      b.classList.remove('open');
      setTimeout(() => b.remove(), 200);
    });
  }

  // ---------- Sheet & Toasts ----------
  function openSheet(html) {
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

  // Freies Farbfeld: live ausprobieren beim Ziehen, belegen beim Bestätigen.
  document.addEventListener('input', (e) => {
    if (!e.target.matches('[data-slot-picker]')) return;
    document.documentElement.style.setProperty('--brand', e.target.value);
  });

  document.addEventListener('change', async (e) => {
    if (e.target.matches('[data-slot-picker]')) {
      look.custom[Number(e.target.dataset.slotPicker)] = e.target.value;
      look.brand = e.target.value;
      saveLook();
      applyLook();
      renderView();
      return;
    }
    if (e.target.matches('[data-avatar-input]') && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const [small, img] = await Promise.all([shrinkImage(file), loadImage(file)]);
        state.member = await api.setAvatar(small, largeImage(img));
        refreshAvatars();
        openProfile();
        toast('Profilbild gespeichert');
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
    } else if (action === 'brand') {
      look.brand = el.dataset.value;
      saveLook();
      applyLook();
      renderView();
    } else if (action === 'slot-clear') {
      const removed = look.custom[Number(el.dataset.slot)];
      look.custom[Number(el.dataset.slot)] = null;
      if (removed && same(removed, look.brand)) look.brand = '#2A2D2E';
      saveLook();
      applyLook();
      renderView();
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
    } else if (action === 'avatar-zoom') {
      openLightbox(state.member.avatarLarge || state.member.avatar, `${state.member.firstName} ${state.member.lastName}`);
    } else if (action === 'lightbox-close') {
      closeLightbox();
    } else if (action === 'avatar-remove') {
      state.member = await api.setAvatar(null);
      refreshAvatars();
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
    const label = document.querySelector('[data-area-label]');
    if (label) label.textContent = AREA_LABEL[areaOf(view)] || 'Kiosk';
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
  TFB.ui = { state, api, cfg, esc, icon, logo, viewHead, partnerSlot, openSheet, closeSheet, toast, renderView, currentView, loadImage, largeImage, openLightbox };

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  boot();
})();
