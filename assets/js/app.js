// TFB-Kiosk – Oberfläche.
// Eine kleine Single-Page-App ohne Build-Schritt. Alle Daten kommen über TFB.api,
// damit der Wechsel vom Demo-Modus zu Supabase die Oberfläche nicht berührt.
(function () {
  const cfg = TFB.config;
  const api = TFB.api;
  const $app = document.getElementById('app');
  const $sheet = document.getElementById('sheet-root');
  const $toast = document.getElementById('toast-root');

  const VIEWS = ['kiosk', 'strichliste', 'abrechnungen'];
  const state = {
    member: null,
    catalog: null,
    authStep: 'email',      // email | password | create | unknown
    authEmail: '',
    authFirstName: '',
    openTallyRow: null,
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

  // ---------- Gestaltung ausprobieren (nur auf diesem Gerät gemerkt) ----------
  // Später wandert das in den Admin-Bereich und gilt dann für alle.
  const LOOK_KEY = 'tfb_kiosk_look_v2';
  const BRAND_COLORS = [
    ['#2A2D2E', 'Anthrazit'], ['#1F4D3A', 'Vereinsgrün'], ['#C4553A', 'Sandplatz'], ['#1E5F74', 'Petrol'],
    ['#22355E', 'Nachtblau'], ['#6B2E4F', 'Pflaume'], ['#5E6B2A', 'Moos'], ['#D9902B', 'Senf'],
  ];
  const COASTERS = [['pappe', 'Pappe'], ['linie', 'Linie'], ['cover', 'Plattencover'], ['welle', 'Wellenrand'], ['stapel', 'Stapel']];
  const look = { brand: '#2A2D2E', coaster: 'pappe' };
  try { Object.assign(look, JSON.parse(localStorage.getItem(LOOK_KEY) || '{}')); } catch (_) {}
  if (!/^#[0-9a-f]{6}$/i.test(look.brand)) look.brand = '#2A2D2E';
  if (!COASTERS.some(([id]) => id === look.coaster)) look.coaster = 'pappe';
  function saveLook() { try { localStorage.setItem(LOOK_KEY, JSON.stringify(look)); } catch (_) {} }
  function applyLook() {
    document.documentElement.style.setProperty('--brand', look.brand);
  }
  applyLook();

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
  };

  // Logo-Bausteine aus brand.css; die Farbe kommt jeweils aus `color`.
  const logo = (part, cls = '') => `<span class="tfb-${part} ${cls}" role="img" aria-label="${esc(cfg.clubName)}"></span>`;

  // ---------- Start ----------
  async function boot() {
    state.catalog = await api.catalog();
    state.member = await api.session();
    if (!location.hash) history.replaceState(null, '', '#kiosk');
    render();
  }

  function currentView() {
    const v = location.hash.replace('#', '');
    return VIEWS.includes(v) ? v : 'kiosk';
  }

  async function render() {
    closeSheet();
    if (!state.member) return renderAuth();
    if (!state.member.hasConsent) return renderConsent();
    return renderShell();
  }

  // ---------- Anmeldung ----------
  function renderAuth(error = '') {
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

    $app.innerHTML = `
      <main class="auth">
        <section class="auth-hero">
          ${logo('logo', 'hero-logo')}
          <p class="app-label">Kiosk</p>
        </section>
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
      </main>`;
    const input = $app.querySelector('input');
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
        return renderAuth();
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
      renderAuth(err.message);
    }
  }

  // ---------- Einmalige Zustimmung ----------
  function renderConsent() {
    const m = state.member;
    $app.innerHTML = `
      <main class="consent">
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
      </main>`;
  }

  // ---------- App-Rahmen ----------
  function renderShell() {
    const view = currentView();
    const tabs = [
      ['kiosk', 'Kiosk', icon.kiosk],
      ['strichliste', 'Strichliste', icon.tally],
      ['abrechnungen', 'Abrechnungen', icon.receipt],
    ];
    $app.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#kiosk">${logo('mark', 'header-mark')}<span class="app-label">Kiosk</span></a>
        <button class="avatar" type="button" data-action="profile" aria-label="Profil">${avatarFace(state.member)}</button>
      </header>
      ${api.mode === 'demo' ? '<div class="demo-ribbon">Demo-Modus · Daten nur auf diesem Gerät</div>' : ''}
      <main class="view" id="view" data-view="${view}"><div class="loading"></div></main>
      <nav class="tabbar" aria-label="Bereiche">
        ${tabs.map(([id, label, ic]) => `
          <a href="#${id}" class="tab ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></a>`).join('')}
      </nav>`;
    return renderView(view);
  }

  async function renderView(view = currentView()) {
    const $view = document.getElementById('view');
    if (!$view) return;
    try {
      if (view === 'kiosk') $view.innerHTML = await kioskView();
      else if (view === 'strichliste') $view.innerHTML = await tallyView();
      else $view.innerHTML = await statementsView();
    } catch (err) {
      $view.innerHTML = `<div class="card error-card"><h2>Das hat nicht geklappt</h2><p>${esc(err.message)}</p></div>`;
    }
  }

  // ---------- Kiosk ----------
  function coasterMarkup(open) {
    const count = open.items.length;
    const strokes = count
      ? TFB.strokes(Math.min(count, 25), state.member.id + open.month) + (count > 25 ? `<em>+${count - 25}</em>` : '')
      : '<em>Noch leer</em>';
    const label = `Mein Bierdeckel: ${euro(open.totalCents)} im ${monthName(open.month, false)}`;
    const ball = logo('ball', 'deckel-ball');
    const back = look.coaster === 'welle'
      ? `<svg class="deckel-shape" viewBox="-11 -11 222 222" aria-hidden="true"><path d="${TFB.scallopSquare(200, 10)}"/></svg>`
      : '';
    return `
      <a class="deckel deckel--${esc(look.coaster)}" href="#abrechnungen" aria-label="${esc(label)}">
        ${back}
        <div class="deckel-face">
          <div class="deckel-top">${ball}<span class="coaster-kicker">Mein Bierdeckel</span><span class="deckel-month">${esc(monthName(open.month, false))}</span></div>
          <strong class="coaster-amount">${euro(open.totalCents)}</strong>
          <div class="coaster-strokes">${strokes}</div>
          <span class="coaster-note">Einzug am ${esc(nextMonthDebit(open.month))}</span>
        </div>
      </a>`;
  }

  async function kioskView() {
    const open = await api.myOpenMonth();
    const { sections, products, shop } = state.catalog;
    return `
      ${coasterMarkup(open)}

      <section class="shop">
        <div class="section-head">
          <h2>${esc(shop.title)}</h2>
          ${shop.status === 'soon' ? '<span class="pill soon">Bald</span>' : ''}
        </div>
        <p class="muted small">${esc(shop.text)}</p>
        <div class="shop-strip">
          ${shop.items.map((item) => `
            <div class="shop-card" aria-disabled="true">
              <div class="shop-art" style="--tint:${esc(item.color)}">${visual(item)}</div>
              <strong>${esc(item.name)}</strong>
              <span>${esc(item.detail)}</span>
              <b>${euro(item.price)}</b>
            </div>`).join('')}
        </div>
      </section>

      ${sections.map((section) => {
        const items = products.filter((p) => p.section === section.id);
        if (!items.length) return '';
        return `
          <section class="menu">
            <div class="section-head"><h2>${esc(section.title)}</h2>${section.note ? `<span class="muted small">${esc(section.note)}</span>` : ''}</div>
            <div class="tiles">
              ${items.map((p) => `
                <button class="tile" type="button" data-action="pick" data-id="${esc(p.id)}">
                  <div class="tile-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
                  <div class="tile-text"><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div>
                  <div class="tile-foot"><b>${euro(p.price)}</b><span class="tile-add">${icon.plus}</span></div>
                </button>`).join('')}
            </div>
          </section>`;
      }).join('')}
      <p class="fineprint">Sortiment und Preise sind Beispiele, bis die echte Strichliste übernommen ist.</p>`;
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
        showUndoToast(`${qty > 1 ? qty + ' × ' : ''}${p.name} auf deinem Deckel`, ids);
        renderView();
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
      <header class="view-head">
        <h1>Strichliste</h1>
        <p class="muted">Letzte ${cfg.tallyDays} Tage · ${esc(range)}</p>
      </header>
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
      <p class="fineprint">Ältere Striche verschwinden automatisch. Beträge siehst du nur für dich selbst unter „Abrechnungen“.</p>`;
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
      <header class="view-head">
        <h1>Meine Abrechnungen</h1>
        <p class="muted">Nur für dich sichtbar</p>
      </header>

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
                  ${until > now ? `<button type="button" class="undo-chip" data-action="undo" data-ids="${esc(i.ids.join(','))}" data-until="${until}">zurück</button>` : ''}
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
      <p class="fineprint">Der Verein zieht den Betrag eines Monats zum ${cfg.debitDayOfMonth}. des Folgemonats über dein bestehendes SEPA-Mandat ein.</p>`;
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

        <div class="card soft lookbox">
          <strong>Gestaltung ausprobieren</strong>
          <p class="small muted">Wirkt sofort und bleibt auf diesem Gerät. Später im Admin für alle.</p>
          <div class="look-row">
            <span>Markenfarbe</span>
            <div class="swatches" role="group" aria-label="Markenfarbe">
              ${BRAND_COLORS.map(([hex, name]) => `<button type="button" class="swatch ${look.brand.toLowerCase() === hex.toLowerCase() ? 'on' : ''}" style="--c:${hex}" data-action="brand" data-value="${hex}" title="${name}" aria-label="${name}"></button>`).join('')}
              <label class="swatch custom ${BRAND_COLORS.some(([hex]) => hex.toLowerCase() === look.brand.toLowerCase()) ? '' : 'on'}" title="Eigene Farbe (mit Pipette)" style="--c:${look.brand}">
                <input type="color" value="${esc(look.brand)}" data-brand-picker aria-label="Eigene Farbe wählen">
              </label>
            </div>
            <small class="muted">${esc((BRAND_COLORS.find(([hex]) => hex.toLowerCase() === look.brand.toLowerCase()) || [0, 'Eigene Farbe ' + look.brand.toUpperCase()])[1])}</small>
          </div>
          <div class="look-row">
            <span>Bierdeckel</span>
            <div class="seg" role="group" aria-label="Bierdeckel">
              ${COASTERS.map(([value, text]) => `<button type="button" class="${look.coaster === value ? 'on' : ''}" data-action="coaster" data-value="${value}">${text}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="card soft install">
          <strong>Als App aufs Handy</strong>
          <p class="small">iPhone: Teilen-Symbol → „Zum Home-Bildschirm“.<br>Android: Menü ⋮ → „App installieren“.</p>
        </div>
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
  function toast(text) {
    clearInterval(toastTimer);
    $toast.innerHTML = `<div class="toast"><span>${esc(text)}</span></div>`;
    toastTimer = setTimeout(() => { $toast.innerHTML = ''; }, 3200);
  }
  function showUndoToast(text, ids) {
    clearInterval(toastTimer);
    clearTimeout(toastTimer);
    const until = Date.now() + cfg.undoSeconds * 1000;
    $toast.innerHTML = `<div class="toast">${icon.check}<span>${esc(text)}</span><button type="button" data-undo>Rückgängig <small></small></button></div>`;
    const small = $toast.querySelector('small');
    const tick = () => {
      const left = Math.ceil((until - Date.now()) / 1000);
      if (left <= 0 || !$toast.querySelector('[data-undo]')) { clearInterval(toastTimer); $toast.innerHTML = ''; return; }
      small.textContent = left;
    };
    tick();
    toastTimer = setInterval(tick, 500);
    $toast.querySelector('[data-undo]').addEventListener('click', async () => {
      clearInterval(toastTimer);
      try {
        await api.undo(ids);
        toast('Zurückgenommen');
      } catch (err) { toast(err.message); }
      renderView();
    });
  }

  // Rücknahme-Knöpfe in der Abrechnung verschwinden nach Ablauf von selbst.
  setInterval(() => {
    document.querySelectorAll('.undo-chip[data-until]').forEach((b) => {
      if (Number(b.dataset.until) <= Date.now()) b.remove();
    });
  }, 1000);

  // ---------- Ereignisse ----------
  document.addEventListener('submit', (e) => {
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

  // Eigene Markenfarbe: live beim Ziehen, gespeichert beim Loslassen.
  document.addEventListener('input', (e) => {
    if (!e.target.matches('[data-brand-picker]')) return;
    look.brand = e.target.value;
    applyLook();
    e.target.parentElement.style.setProperty('--c', look.brand);
  });

  document.addEventListener('change', async (e) => {
    if (e.target.matches('[data-brand-picker]')) {
      saveLook();
      openProfile();
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
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (action === 'pick') openPick(el.dataset.id);
    else if (action === 'profile') openProfile();
    else if (action === 'close-sheet') closeSheet();
    else if (action === 'auth-back') { state.authStep = 'email'; renderAuth(); }
    else if (action === 'forgot') toast('Passwort-Zurücksetzen per Mail kommt mit dem Echtbetrieb.');
    else if (action === 'demo-fill') {
      state.authEmail = api.demoLogin.email;
      state.authStep = 'email';
      renderAuth();
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
    } else if (action === 'brand' || action === 'coaster') {
      look[action] = el.dataset.value;
      saveLook();
      applyLook();
      openProfile();
      renderView();
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
    } else if (action === 'undo') {
      el.disabled = true;
      try { await api.undo(el.dataset.ids.split(',')); toast('Zurückgenommen'); } catch (err) { toast(err.message); }
      renderView();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.lightbox')) closeLightbox(); else closeSheet();
  });

  window.addEventListener('hashchange', () => {
    if (!state.member || !state.member.hasConsent) return;
    const view = currentView();
    document.querySelectorAll('.tabbar .tab').forEach((t) => {
      const active = t.getAttribute('href') === '#' + view;
      t.classList.toggle('active', active);
      if (active) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    document.getElementById('view').dataset.view = view;
    closeSheet();
    window.scrollTo(0, 0);
    renderView(view);
  });

  // Beim Zurückkehren in die App frische Zahlen zeigen (Strichliste rollt weiter).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.member && state.member.hasConsent && !$sheet.innerHTML) renderView();
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  boot();
})();
