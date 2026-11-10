// TFB-Kiosk – Oberfläche.
// Eine kleine Single-Page-App ohne Build-Schritt. Alle Daten kommen über TFB.api,
// damit der Wechsel vom Demo-Modus zu Supabase die Oberfläche nicht berührt.
(async function () {
  try{await TFB.sharedKioskReady;}catch(error){document.getElementById("app").textContent=error.message;return;}
  const cfg = TFB.config;
  const api = TFB.api;
  const $app = document.getElementById('app');
  const $sheet = document.getElementById('sheet-root');
  const $toast = document.getElementById('toast-root');

  const VIEWS = ['home', 'kiosk', 'strichliste', 'abrechnungen', 'chat', 'aktuell', 'gefluester', 'sport', 'team', 'club', 'treffen', 'verwaltung', 'impressum', 'satzung', 'partnerzahlen', 'clubstatistik', 'partner', 'kioskabrechnung', 'produktbibliothek', 'membermail'];
  const KIOSK_AREA = ['kiosk', 'strichliste', 'abrechnungen'];   // nur mit Anmeldung
  // Reiter unten: Kiosk zuerst, dann die Vereinsseiten, dann der Padel-Link.
  // Team-Seiten gehören zu „Sport“
  const areaOf = (view) => (KIOSK_AREA.includes(view) ? 'kiosk' : view === 'produktbibliothek' ? 'kiosk' : view === 'team' ? 'sport' : view === 'gefluester' ? 'chat' : view);
  const state = {
    catalog: null,
    authStep: 'email',      // email | password | create | unknown
    authEmail: '',
    authFirstName: '',
    openTallyRow: null,
    editMode: false,        // Admin bearbeitet den Kiosk direkt
    lastAdd: null,          // { ids, until, text } – Storno-Stempel auf dem Deckel
  };
  // Nur Demo: Admin-Werkzeuge sind beim Laden ausgeblendet (Mitglieder-Ansicht für die Vorführung);
  // der Bleistift blendet sie ein und aus. state.member liefert dann isAdmin = false, adminHidden = true –
  // egal, wo das Mitglied neu geladen oder gespeichert wird.
  let hideAdmin = true;
  let rawMember = null;
  let viewMember = null;
  Object.defineProperty(state, 'member', {
    enumerable: true,
    get() {
      if (!rawMember || !rawMember.isAdmin || !hideAdmin || api.mode !== 'demo') return rawMember;
      if (!viewMember || viewMember._raw !== rawMember) {
        viewMember = { ...rawMember, isAdmin: false, adminHidden: true };
        Object.defineProperty(viewMember, '_raw', { value: rawMember });
      }
      return viewMember;
    },
    set(m) { rawMember = m && m._raw ? m._raw : m; viewMember = null; },
  });

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
  // Unveränderte Basis; die lokale Home/Chat-Vorschau überschreibt nur ihre eigene CSS-Schicht.
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
    chevron: '<svg class="link-arrow" viewBox="0 0 806 1000" aria-hidden="true" focusable="false"><path transform="translate(0 755) scale(1 -1)" d="M528 -14 448 66 546 164 587 189 581 206 533 198H50V312H533L581 304L587 321L546 346L448 444L528 524L756 296V214Z"/></svg>',
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
    const splash = TFB.partnerVisibility?.start();
    await TFB.editorial?.ready;
    state.catalog = await api.catalog();
    state.member = await api.session();
    // Wer die App neu öffnet, landet immer auf Home – egal, welche Seite zuletzt offen war.
    // Ausnahmen: Neu laden (bleibt auf der Seite) und direkte Links wie #treffen/<id>.
    const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    const deepLink = location.hash.includes('/');
    if (!location.hash || (nav.type !== 'reload' && !deepLink && !['#impressum','#satzung','#partnerzahlen','#partner','#clubstatistik','#kioskabrechnung','#produktbibliothek','#membermail'].includes(location.hash))) history.replaceState(null, '', '#home');
    // Decide on the splash before mounting the app shell to avoid exposing a
    // frame of the previous page during a reload.
    await splash;
    await render();
    document.body.classList.remove('tfb-starting');
    TFB.partnerVisibility?.ready();
    TFB.usage?.ready();
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
        <p class="muted">${api.secureDirectory ? 'Nur für aktive TFB-Mitglieder: Melde dich mit deiner beim Verein hinterlegten E-Mail-Adresse oder deiner Mitgliedsnummer an.' : 'Mit der E-Mail-Adresse, die der Verein von dir hat.'}</p>
        <label class="field"><span>${api.secureDirectory ? 'E-Mail oder Mitgliedsnummer' : 'E-Mail'}</span>
          <input name="email" type="${api.secureDirectory ? 'text' : 'email'}" inputmode="${api.secureDirectory ? 'text' : 'email'}" autocomplete="username" required value="${esc(state.authEmail)}" placeholder="${api.secureDirectory ? 'E-Mail oder Mitgliedsnummer' : 'name@beispiel.de'}">
        </label>
        ${api.secureDirectory ? `<p class="muted small">${api.automaticEmail ? 'Zum ersten Mal hier? Lass dir deinen Freischaltcode automatisch per E-Mail senden und lege dein Passwort fest.' : 'Für deinen ersten Zugang brauchst du einen persönlichen Freischaltcode vom Vorstand. Damit legst du dein Passwort fest.'}</p>` : ''}
        <button class="btn primary block" type="submit">Weiter</button>${api.automaticEmail ? '<button type="button" class="btn block" data-action="auth-email-start">Erster Besuch? Zugang anlegen</button>' : ''}`;
    } else if (s === 'password') {
      body = `
        <h2>${api.secureDirectory ? 'Anmelden' : `Hallo ${esc(state.authFirstName)}!`}</h2>
        <p class="muted">${esc(state.authEmail)}</p>
        ${api.secureDirectory ? `<label class="field"><span>Dein Vor- und Nachname (bei Familienadresse)</span><input name="fullName" autocomplete="name" maxlength="160" value="${esc(state.authFullName||'')}" placeholder="Wie in der Mitgliederliste"></label><p class="small muted">Wird die E-Mail auch für andere Familienmitglieder genutzt? Ergänze deinen vollständigen Namen oder melde dich mit deiner Mitgliedsnummer an.</p>` : ''}
        <label class="field"><span>Passwort</span>
          ${pwInput('name="password" autocomplete="current-password" required autofocus')}
        </label>
        <button class="btn primary block" type="submit">Anmelden</button>
        <div class="auth-links">
          <button type="button" class="link" data-action="auth-back">Andere E-Mail</button>
          <button type="button" class="link" data-action="forgot">Passwort vergessen?</button>
          ${api.secureDirectory ? (api.automaticEmail ? '<button type="button" class="link" data-action="auth-email-start">Zugang anlegen / Freischaltmail anfordern</button>' : '<button type="button" class="link" data-action="auth-activate">Ich habe einen Freischaltcode</button>') : ''}
        </div>`;
    } else if (s === 'email-request') {
      body = `<p class="auth-kicker">Willkommen im Club</p><h2>Dein TFB-Zugang.</h2>
        <p class="muted">Wir schicken einen Freischaltcode an deine beim TFB hinterlegte E-Mail-Adresse. Danach legst du dein persönliches Passwort fest.</p>
        <label class="field"><span>E-Mail-Adresse</span><input name="email" type="email" autocomplete="email" required value="${esc(state.authEmail.includes('@') ? state.authEmail : '')}" placeholder="name@beispiel.de"></label>
        <label class="field"><span>Dein Vor- und Nachname (bei Familienadresse)</span><input name="fullName" autocomplete="name" maxlength="160" value="${esc(state.authFullName||'')}" placeholder="Wie in der Mitgliederliste"></label><p class="small muted">Deine E-Mail wird auch für weitere Familienmitglieder verwendet? Ergänze deinen vollständigen Namen. Alternativ kannst du unten deine Mitgliedsnummer angeben.</p><details class="auth-family"><summary>Alternativ: Mitgliedsnummer angeben</summary><label class="field"><span>Mitgliedsnummer</span><input name="memberNo" autocomplete="off" value="${esc(state.authMemberNo||'')}"></label></details>
        <button class="btn primary block" type="submit">Freischaltcode senden</button><button type="button" class="link center" data-action="auth-back">Bereits registriert? Anmelden</button>`;
    } else if (s === 'email-code') {
      body = `<p class="auth-kicker">Noch ein Schritt</p><h2>Prüfe dein Postfach.</h2>
        <p class="muted">Wenn <strong>${esc(state.authEmail)}</strong> eindeutig in unserer Mitgliederliste hinterlegt ist, erhältst du einen sechsstelligen Code. Er ist zehn Minuten gültig. Prüfe bitte auch deinen Spam-Ordner. Keine Mail erhalten? Gehe zurück und ergänze bei einer Familienadresse deinen Vor- und Nachnamen oder deine Mitgliedsnummer.</p>
        <label class="field"><span>Freischaltcode</span><input class="auth-code" name="activationCode" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="000000"></label>
        <label class="field"><span>Dein neues Passwort</span>${pwInput('name="password" autocomplete="new-password" minlength="12" required placeholder="mindestens 12 Zeichen"')}</label>
        <label class="field"><span>Passwort wiederholen</span>${pwInput('name="password2" autocomplete="new-password" minlength="12" required')}</label>
        <button class="btn primary block" type="submit">Zugang aktivieren</button><button type="button" class="link center" data-action="auth-email-start">Keine Mail? Adresse prüfen / erneut senden</button>`;
    } else if (s === 'create') {
      body = `
        <h2>${api.secureDirectory ? 'Zugang freischalten' : `Willkommen, ${esc(state.authFirstName)}!`}</h2>
        <p class="muted">${api.secureDirectory ? 'Verwende deinen persönlichen Freischaltcode vom Verein und lege ein neues Passwort fest. Der Code ist nur einmal verwendbar.' : `Du stehst in der Mitgliederliste der ${esc(cfg.clubName)}. Leg einmalig ein Passwort fest – danach bleibst du auf diesem Handy angemeldet.`}</p>
        ${api.secureDirectory ? '<label class="field"><span>Freischaltcode</span><input name="activationCode" autocomplete="one-time-code" required></label>' : ''}
        <label class="field"><span>Neues Passwort</span>
          ${pwInput(`name="password" autocomplete="new-password" minlength="${api.secureDirectory ? 12 : 8}" required autofocus placeholder="mindestens ${api.secureDirectory ? 12 : 8} Zeichen"`)}
        </label>
        <label class="field"><span>Passwort wiederholen</span>
          ${pwInput(`name="password2" autocomplete="new-password" minlength="${api.secureDirectory ? 12 : 8}" required`)}
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
          <div><h1>Willkommen beim TFB</h1><p class="muted">Melde Dich an, um Beiträge zu schreiben, Mitspieler einzuladen und den Kiosk zu nutzen.</p></div>
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
      if (state.authStep === 'email-request') {
        state.authEmail=String(data.get('email')||'').trim();state.authMemberNo=String(data.get('memberNo')||'').trim();state.authFullName=String(data.get('fullName')||'').trim();
        const result=await api.requestEmailAccess(state.authEmail,state.authMemberNo,state.authFullName);
        state.authChallengeId=result.challengeId;state.authStep='email-code';return showAuth();
      }
      if (state.authStep === 'email') {
        const email = String(data.get('email') || '').trim();
        if (api.secureDirectory ? !email || email.length > 160 || /[\u0000-\u001f]/.test(email) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(api.secureDirectory ? 'Bitte E-Mail oder Mitgliedsnummer eingeben.' : 'Bitte eine gültige E-Mail-Adresse eingeben.');
        state.authEmail = email;
        const res = await api.lookupEmail(email);
        state.authFirstName = res.firstName || '';
        state.authStep = !res.known ? 'unknown' : res.hasPassword ? 'password' : 'create';
        return showAuth();
      }
      if (state.authStep === 'email-code') {
        const password=String(data.get('password')||'');if(password.length<12)throw Error('Bitte mindestens zwölf Zeichen für dein Passwort verwenden.');
        if(password!==String(data.get('password2')||''))throw Error('Die beiden Passwörter sind nicht gleich.');
        state.member=await api.activateEmailAccess(state.authChallengeId,String(data.get('activationCode')||'').trim(),password);
      } else if (state.authStep === 'password') {
        state.authFullName=String(data.get('fullName')||'').trim();
        state.member = await api.signIn(state.authEmail, String(data.get('password') || ''),state.authFullName);
      } else if (state.authStep === 'create') {
        const pw = String(data.get('password') || '');
        if (pw.length < (api.secureDirectory ? 12 : 8)) throw new Error(`Bitte mindestens ${api.secureDirectory ? 12 : 8} Zeichen verwenden.`);
        if (pw !== String(data.get('password2') || '')) throw new Error('Die beiden Passwörter sind nicht gleich.');
        state.member = await api.createPassword(state.authEmail, pw, String(data.get('activationCode') || '').trim());
      }
      state.authStep = 'email';
      history.replaceState(null, '', '#home');
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
          <p class="muted">Der Kiosk ersetzt unsere bisherige Strichliste auf Papier. Das bedeutet:</p>
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
    document.body.classList.toggle('admin-hidden', Boolean(state.member && state.member.adminHidden));
    const area = areaOf(view);
    navArea = area;
    const clubName = esc(cfg.clubName);
    const logo = `<span class="tfb-logo-split header-logo" role="img" aria-label="${clubName}"><span class="tfb-logo-noball"></span><span class="tfb-logo-ball"></span></span>`;
    $app.innerHTML = `
      <header class="topbar">
        <div class="topbar-row">
          <div class="brand brand-logo-controls">
            <a class="brand-home" href="#home" data-action="brand-home" aria-label="${clubName} – Startseite">${logo}</a>
            ${TFB.designPreview.brandButton('header-brand-ball')}
          </div>
          <div class="top-actions">
            ${rawMember?.isAdmin ? `<button type="button" class="header-admin-edit" data-action="admin-toggle" aria-label="Admin-Werkzeuge" title="Admin-Werkzeuge" aria-pressed="${state.member?.isAdmin === true}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4 20 1.4-5.1L16.7 3.6a2.6 2.6 0 0 1 3.7 3.7L9.1 18.6 4 20Z"/><path d="m14.7 5.6 3.7 3.7M5.4 14.9l3.7 3.7"/></svg></button>` : ''}
            ${state.member && TFB.inbox ? TFB.inbox.button() : ''}
            ${state.member
              ? `<button class="avatar" type="button" data-action="profile" aria-label="Profil">${avatarFace(state.member)}</button>`
              : `<button class="avatar guest" type="button" data-action="login" aria-label="Anmelden">${icon.user}</button>`}
          </div>
        </div>
        <nav class="topnav" aria-label="Bereiche">${navLinks(area)}</nav>
      </header>
      <main class="view" id="view" data-view="${view}"><div class="loading"></div></main>
      <footer class="site-footer">
        <nav aria-label="Vereinsinformationen"><a class="footer-link" href="#impressum">Impressum</a><a class="footer-link" href="#satzung">Satzung</a><button type="button" class="footer-link" data-usage-info>Datenschutz zur Statistik</button></nav>
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
    const cs = getComputedStyle(tab);
    act.style.transform = '';
    if (window.innerWidth < 1024) return;
    // Grundlinie direkt an der Schrift: Oberkante der Textzeile + Oberlänge der Schrift
    const range = document.createRange();
    range.selectNodeContents(tab);
    const line = range.getBoundingClientRect();
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const baseline = line.top + ctx.measureText(tab.textContent).fontBoundingBoxAscent;
    const pic = act.matches('.avatar') ? act : act.querySelector('.avatar');
    // Optischer Ausgleich: Kreise wirken höher als sie sind – wie das „O“ einer Schrift ragen sie leicht unter die Linie.
    const OVERSHOOT = 4;
    const shift = baseline + OVERSHOOT - pic.getBoundingClientRect().bottom;
    if (Math.abs(shift) > 0.4 && Math.abs(shift) < 30) act.style.transform = `translateY(${shift.toFixed(1)}px)`;
  }
  window.addEventListener('resize', () => requestAnimationFrame(alignHeader));

  function toggleAdminTools(button) {
    if (!rawMember?.isAdmin || api.mode !== 'demo') return;
    hideAdmin = !hideAdmin;
    viewMember = null;
    state.editMode = false;
    document.body.classList.toggle('admin-hidden', hideAdmin);
    button.setAttribute('aria-pressed', String(!hideAdmin));
    if (hideAdmin) closeSheet();
    renderView();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => alignHeader());

  // Menü oben: Standard oder – sobald geladen – die im Admin gepflegten Punkte (Name + Ziel: Seite der App oder Website)
  let navArea = '';
  const defaultNav = () => [
    { id: 'kiosk', label: 'Kiosk', target: '#kiosk' }, { id: 'chat', label: 'Chat', target: '#chat' },
    { id: 'aktuell', label: 'Aktuell', target: '#aktuell' }, { id: 'sport', label: 'Sport', target: '#sport' },
    { id: 'club', label: 'Club', target: '#club' },
    ...(cfg.features && cfg.features.treffen ? [{ id: 'treffen', label: 'Dating 2.0', target: '#treffen' }] : []),
    { id: 'padel', label: 'Padel', target: cfg.padelUrl },
  ];
  function navLinks(area) {
    const configured = (TFB.navItems && TFB.navItems()) || defaultNav();
    const items = [...configured];
    for(const item of defaultNav().filter(x=>['kiosk','chat','treffen'].includes(x.id)))if(!items.some(x=>x.target===item.target))items.splice(Math.min(defaultNav().findIndex(x=>x.id===item.id),items.length),0,item);
    return items.map((it) => {
      const t = String(it.target || '');
      if (/^https?:\/\//i.test(t)) return `<a href="${esc(t)}" class="tab external" target="_blank" rel="noopener" aria-label="${esc(it.label)} (öffnet in neuem Fenster)">${esc(it.label)}</a>`;
      const page = t.replace(/^#/, '').split('/')[0] || 'home';
      const on = page === area;
      const label=page==='treffen'&&['Verabreden','Dating'].includes(it.label)?'Dating 2.0':it.label;
      return `<a href="${esc(t || '#home')}" class="tab tab-${esc(page)} ${on ? 'active' : ''}" ${on ? 'aria-current="page"' : ''}>${esc(label)}</a>`;
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

  // Allocate the pair only when the requested view has actually rendered.
  let partnerVisit = 0;
  function partnerSlot(page, kicker) {
    return `<section class="pbsp-slot" aria-label="Partner" hidden><div class="pbsp-kicker">${esc(kicker)}</div><div class="pbsp-duo" data-partner-rotation="${esc(page)}"></div></section>`;
  }

  const partnerViews = new Set(['home', 'kiosk', 'strichliste', 'abrechnungen', 'chat', 'aktuell', 'gefluester', 'sport', 'team', 'club', 'treffen']);
  function renderPartnerSlot(root, view) {
    if (root.querySelector('.bielstein-open-page')) return;
    if (!partnerViews.has(view) || root.querySelector('.editing-page, .editbar') || (view === 'kiosk' && isEditing())) return;
    if (!root.querySelector('[data-partner-rotation]')) {
      root.insertAdjacentHTML('beforeend', partnerSlot(view, 'Präsentiert von'));
    }
    const pair = TFB.partnerPair?.(partnerVisit) || [];
    for (const slot of root.querySelectorAll('[data-partner-rotation]')) {
      slot.innerHTML = pair.map(TFB.partnerTile).join('');
      slot.closest('.pbsp-slot').hidden = !pair.length;
    }
  }

  let viewRender = 0;
  async function renderView(view = currentView()) {
    const request = ++viewRender;
    TFB.designPreview?.apply();
    const $view = document.getElementById('view');
    if (!$view) return;
    try {
      if (KIOSK_AREA.includes(view)) {
        if (!state.member && view !== 'kiosk') { $view.innerHTML = viewHead(view==='strichliste'?'Strichliste':'Abrechnungen','Deine persönlichen Kioskdaten findest du nach der Anmeldung.',false)+'<button class="btn primary" data-action="login">Anmelden</button>'; return; }
        const body = state.member && !state.member.hasConsent ? consentMarkup() : view === 'kiosk' ? await kioskView() : view === 'strichliste' ? await tallyView() : await statementsView();
        if(request!==viewRender)return;
        $view.innerHTML = '<div class="shared-kiosk-scope">'+body+'</div>' + (view === 'kiosk' && (!state.member || state.member.hasConsent) ? TFB.kioskShop.render() : '');
        if (view === 'kiosk') {
          const partner = $view.querySelector('.shared-kiosk-scope > .pbsp-slot');
          if (partner) $view.appendChild(partner);
        }
      } else if (TFB.views && TFB.views[view]) {
        const body=await TFB.views[view]();
        if(request!==viewRender)return;
        $view.innerHTML=view==='kioskabrechnung'?'<div class="shared-kiosk-scope">'+body+'</div>':body;
      }
      if (state.member?.isAdmin) {
        const editHome = '<button type="button" class="btn small" data-action="site-edit" data-page="home">Home</button>';
        $view.insertAdjacentHTML('afterbegin', `<div class="tfb-admin-design">${TFB.designPreview.buttons()}
          <div class="tfb-admin-links"><button type="button" class="btn small" data-action="splash-edit">Splash</button>${editHome}<a class="btn small" href="#partner">Partner</a>
            <button type="button" class="btn small" data-action="members-manage">Mitglieder</button>
            <a class="btn small" href="#clubstatistik">Statistik</a>
            <a class="btn small" href="#kioskabrechnung">Kiosk</a>
            <button type="button" class="btn small tfb-backup-icon" data-action="admin-backup" aria-label="Datensicherung" title="Datensicherung"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 3h13l4 4v14H3V3Z"/><path d="M7 3v7h10V3M7 21v-8h10v8M14 5v3"/></svg></button><a class="btn small" href="#membermail">E-Mail an alle Mitglieder</a></div></div>`);
        const activeAdmin = $view.querySelector(`.tfb-admin-links a[href="#${view==='produktbibliothek'?'kioskabrechnung':view}"]`);
        if(activeAdmin) activeAdmin.setAttribute('aria-current','page');
        const homeEditShortcut = view === 'home' && $view.querySelector('.site-page[data-page="home"]') && !$view.querySelector('.editing-page')
          ? $view.querySelector('.tfb-admin-links [data-action="site-edit"]') : null;
        const edit = homeEditShortcut || $view.querySelector('.view-close[data-action="site-edit"], .view-close[data-action="edit-start"], .view-close[data-action="feature-edit"], .view-close[data-action="album-edit"], .view-close[data-action="portrait-edit"], .view-close[data-action="chat-text-edit"]');
        if (edit) {
          const tools = document.createElement('div');
          tools.className = 'page-bottom-tools';
          const button = edit.cloneNode(true);
          if (homeEditShortcut) {
            button.className = 'view-close';
            button.innerHTML = icon.pencil;
            button.setAttribute('aria-label', 'Home bearbeiten');
          }
          button.dataset.keepScroll = '1';
          button.title = button.getAttribute('aria-label') || 'Bearbeiten';
          tools.appendChild(button);
          $view.appendChild(tools);
        }
      }
      renderPartnerSlot($view, view);
      TFB.fitChatReplies?.(view === 'chat' ? $view : null);
      if (view === 'club') TFB.clubArchive?.rendered();
      TFB.scrollToSiteContent?.();
      TFB.partnerVisibility?.rendered();
      TFB.usage?.rendered();
    } catch (err) {
      if(request!==viewRender)return;
      $view.innerHTML = `<div class="card error-card"><h2>Das hat nicht geklappt</h2><p>${esc(err.message)}</p></div>`;
    } finally {
      if (request === viewRender) TFB.loadChatVideoPreviews?.($view);
    }
  }

  // ---------- Kiosk ----------
  TFB.attachKioskSurface=()=> $sheet.classList.add('shared-kiosk-scope');
  function openKioskSheet(html){openSheet(html);TFB.attachKioskSurface();}
  const kiosk=ClubKiosk.create({TFB,cfg,api,state,icon,logo,esc,euro,monthName,nextMonthDebit,timeOf,dayKey,dayLabel,visual,strokesWord,same,viewHead,partnerSlot,showAuth,consentMarkup,openSheet:openKioskSheet,closeSheet,toast,renderView,$sheet});
  const {isEditing,coasterMarkup,kioskView,openPick,tallyView,statementsView,openProductEditor,openSectionEditor,moveProduct,moveSection}=kiosk;

  // ---------- Profil ----------
  // Account-Karte – Aufbau nach dem Vorbild der Padel-App: Profilbild, Name, Mitgliedschaft,
  // nächstes zugesagtes Match, eigene Angaben und Einstellungen; Admin-Bereich ganz unten.
  async function openProfile() {
    const m = state.member;
    let open = null;
    if (m.hasConsent) { try { open = await api.myOpenMonth(); } catch (_) {} }
    const today = dayKey(new Date().toISOString());
    const todayCents = open ? open.items.filter((i) => dayKey(i.createdAt) === today).reduce((s, i) => s + i.priceCents, 0) : 0;
    const consentDate = m.consentedAt ? new Date(m.consentedAt).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const nextMatch = TFB.meet?.nextMatch(m.id);
    const matchDate = nextMatch ? new Date(`${nextMatch.date}T12:00:00`).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', ...(nextMatch.date.slice(0, 4) !== String(new Date().getFullYear()) ? { year: 'numeric' } : {}) }) : '';
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
          ${row(m.hasConsent, 'Kiosk', m.hasConsent
            ? `Freigeschaltet am ${esc(consentDate)}`
            : 'Noch nicht freigeschaltet – beim ersten Besuch im Kiosk einmal zustimmen.')}
        </section>

        ${TFB.meet ? `<section class="acct-next-match" aria-label="Nächstes Match">
          <h3>Nächstes Match</h3>
          ${nextMatch ? `<p>Dein nächstes Match startet am <strong>${esc(matchDate)}</strong> um <strong>${esc(nextMatch.time)} Uhr</strong>.</p>
            <small>${esc(nextMatch.title)}${nextMatch.place ? ` · ${esc(nextMatch.place)}` : ''}${nextMatch.missing ? ` · Noch ${nextMatch.missing} ${nextMatch.missing === 1 ? 'Platz frei' : 'Plätze frei'}` : ''}</small>
            <a href="#treffen/${esc(nextMatch.id)}" data-action="close-sheet">Details ansehen <span aria-hidden="true"><svg class="link-arrow" viewBox="0 0 806 1000" aria-hidden="true" focusable="false"><path transform="translate(0 755) scale(1 -1)" d="M528 -14 448 66 546 164 587 189 581 206 533 198H50V312H533L581 304L587 321L546 346L448 444L528 524L756 296V214Z"/></svg></span></a>`
            : '<p class="muted">Aktuell hast du kein zugesagtes Match.</p>'}
        </section>` : ''}

        ${open ? `
        <section class="acct-kiosk" aria-label="Kiosk-Umsätze">
          <h3 class="acct-section">Kiosk-Umsätze</h3>
          <div class="acct-stats">
          <a href="#kiosk" data-action="close-sheet"><small>Heute</small><b>${euro(todayCents)}</b></a>
          <a href="#abrechnungen" data-action="close-sheet"><small>${esc(monthName(open.month, false))}</small><b>${euro(open.totalCents)}</b></a>
          <a href="#abrechnungen" data-action="close-sheet"><small>Zahlung</small><b>Noch nicht aktiv</b></a>
          </div>
          <a class="acct-details" href="#abrechnungen" data-action="close-sheet">Details ansehen <span aria-hidden="true"><svg class="link-arrow" viewBox="0 0 806 1000" aria-hidden="true" focusable="false"><path transform="translate(0 755) scale(1 -1)" d="M528 -14 448 66 546 164 587 189 581 206 533 198H50V312H533L581 304L587 321L546 346L448 444L528 524L756 296V214Z"/></svg></span></a>
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
          <label class="field"><span>Klingel</span><select name="groupChatNotices">
            <option value="off" ${m.groupChatNotices ? '' : 'selected'}>Einladungen und Kommentare zu meinen Beiträgen</option>
            <option value="on" ${m.groupChatNotices ? 'selected' : ''}>Zusätzlich neue Gruppenbeiträge</option>
          </select></label>
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

        ${TFB.installApp?.profileButton?.()||''}
        ${rawMember?.isAdmin ? '<button type="button" class="link" data-action="splash-open">Einstiegsseite ansehen</button>' : ''}
        <button type="button" class="btn block acct-logout" data-action="logout">Abmelden</button>

      </div>`);
  }

  function openAdminBackup() {
    if (!state.member?.isAdmin) return;
    if (TFB.editorial?.enabled) {
      openSheet(TFB.editorial.backupPanel());
      return;
    }
    openSheet(`<section class="editor admin-card">
        <h2>Sichern &amp; Laden</h2>
        <p class="muted">Sichert die Daten dieser lokalen Vorschau in einer Datei.</p>
        <div class="admin-links">
          <button type="button" class="btn primary" data-action="backup-save">Inhalte sichern</button>
          <label class="btn">Sicherung laden<input type="file" accept=".json,application/json" data-backup-input hidden></label>
          <label class="btn">Chat-Beiträge ergänzen<input type="file" accept=".json,application/json" data-chat-restore-input hidden></label>
        </div>
        ${TFB.autosave ? `<h3 class="font-group">Automatisch sichern</h3>${TFB.autosave.box()}` : ''}
      ${!api.secureDirectory && api.mode === 'demo' ? '<button type="button" class="link center small" data-action="demo-reset">Demo-Daten zurücksetzen</button>' : ''}
    </section>`);
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
      if (event.key === 'Tab') { event.preventDefault(); const controls=[...box.querySelectorAll('a[href],button:not(:disabled)')],index=controls.indexOf(document.activeElement);controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length]?.focus(); }
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
    $sheet.classList.remove('shared-kiosk-scope');
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
    $sheet.classList.remove('shared-kiosk-scope');
    const mailPreview = $sheet.querySelector('.membership-mail-dialog');
    $sheet.classList.remove('open');
    $sheet.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (mailPreview) document.querySelector('[data-action="membership-mail-preview"]')?.focus({ preventScroll: true });
  }

  let toastTimer = null;
  function toast(text, ok = false) {
    clearTimeout(toastTimer);
    $toast.innerHTML = `<div class="toast">${ok ? icon.check : ''}<span>${esc(text)}</span></div>`;
    toastTimer = setTimeout(() => { $toast.innerHTML = ''; }, 2500);
  }

  // Storno-Knöpfe laufen nach einer Minute ab: in der Abrechnung und als Stempel auf dem Deckel.
  setInterval(kiosk.tickStorno, 250);

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
          groupChatNotices: acct.elements.groupChatNotices.value === 'on',
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
    if (btn) {
      const face=avatarFace(state.member);
      if(btn.innerHTML!==face)btn.innerHTML=face;
    }
  }

  // Profilbild-Ausschnitt: Foto im Kreis verschieben und zoomen. Das Original bleibt unverändert,
  // gespeichert wird nur das kleine runde Bild (320 px) als Ausschnitt.
  function openAvatarCropper(src, onSave, options = {}) {
    const V = 260;
    const img = new Image();
    if (/^https?:/i.test(src) && new URL(src).origin !== location.origin) img.crossOrigin = 'anonymous';
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
    if (e.target.matches('[data-chat-restore-input]') && e.target.files[0]) {
      try {
        const file = e.target.files[0]; e.target.value = '';
        const data = JSON.parse(await file.text());
        const plan = await api.restoreChatPosts(data);
        if (!plan.added) { toast('Alle Beiträge sind bereits vorhanden. Es wurde nichts geändert.'); return; }
        if (!confirm(`${plan.added} Chat-Beiträge mit ${plan.photos} Fotos ergänzen?\n\nVorhandene Beiträge und andere Daten bleiben erhalten. Die ergänzten Beiträge gehören zu deinem angemeldeten Konto; ihre Mannschaftszuordnungen bleiben bestehen.`)) return;
        const result = await api.restoreChatPosts(data, { apply: true });
        closeSheet(); location.hash = '#chat'; render();
        toast(`${result.added} Chat-Beiträge wiederhergestellt`, true);
      } catch (error) { toast(error.message || 'Die Chat-Beiträge konnten nicht geladen werden.'); }
      return;
    }
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
      if(reduce||window.matchMedia('(pointer: coarse)').matches){location.hash='#abrechnungen';return;}
      deckel.classList.add('wobble');
      setTimeout(() => { location.hash = '#abrechnungen'; }, 480);
      return;
    }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    if (await kiosk.handleAction(el,e)) return;
    if (action === 'profile') openProfile();
    else if (action === 'brand-home' && location.hash === '#home' && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      closeSheet();
      renderView('home');
      window.scrollTo(0, 0);
    }
    else if (action === 'admin-toggle') toggleAdminTools(el);
    else if (action === 'members-manage' && state.member?.isAdmin) TFB.memberImport.open();
    else if (action === 'admin-backup') openAdminBackup();
    else if (action === 'close-sheet') closeSheet();
    else if (action === 'auth-back') { state.authStep = 'email'; showAuth(); }
    else if (action === 'auth-email-start') { state.authStep = 'email-request'; showAuth(); }
    else if (action === 'auth-activate') { state.authStep = 'create'; showAuth(); }
    else if (action === 'login') { showAuth(); }
    else if (action === 'forgot' && api.automaticEmail) { state.authStep='email-request';showAuth(); }
    else if (action === 'forgot') toast(api.secureDirectory ? 'Bitte beim Verein einen neuen persönlichen Freischaltcode anfordern. Damit kannst du ein neues Passwort festlegen.' : 'Passwort-Zurücksetzen per Mail kommt mit dem Echtbetrieb.');
    else if (action === 'demo-fill') {
      state.authEmail = api.demoLogin.email;
      state.authStep = 'email';
      showAuth();
    } else if (action === 'logout') {
      try { await api.signOut(); }
      catch (error) { toast(error.message); }
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
      const y = window.scrollY;
      state.editMode = true;
      if (currentView() === 'kiosk') { await renderView(); if (el.dataset.keepScroll) window.scrollTo(0, y); } else location.hash = '#kiosk';
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
    } else if (TFB.actions && TFB.actions[action]) {
      TFB.actions[action](el, e);

    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.lightbox')) closeLightbox(); else closeSheet();
  });

  window.addEventListener('hashchange', () => {
    partnerVisit++;
    const view = currentView();
    navArea = areaOf(view);
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
  TFB.partnerTile = (p,index=0) => {
    const attrs=`class="pbsp-tile" data-partner-id="${esc(p.id)}" data-partner-slot="${index?'right':'left'}"`;
    const img=`<img src="${esc(p.logo)}" alt="${esc(p.name)}" decoding="async" fetchpriority="high">`;
    return /^https?:\/\//i.test(p.url||'')?`<a ${attrs} href="${esc(p.url)}" target="_blank" rel="noopener noreferrer nofollow">${img}</a>`:`<div ${attrs}>${img}</div>`;
  };
  TFB.ui = { state, api, cfg, esc, icon, logo, viewHead, partnerSlot, openSheet, closeSheet, toast, renderView, currentView, editProduct:openProductEditor, editCategory:openSectionEditor, loadImage, largeImage, openLightbox, openAvatarCropper, refreshAvatars, isAdmin:()=>Boolean(rawMember?.isAdmin) };

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname))) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  boot();
})();
