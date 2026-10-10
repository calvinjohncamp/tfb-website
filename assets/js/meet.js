// TFB – „Treffen“: Verabreden in der App (Vorführung).
//
// Idee: Alle einer Gruppe haben die App installiert (iPhone: „Zum Home-Bildschirm“).
// Eine Einladung zeigt eine Tabelle aller Eingeladenen: ✓ dabei · Ersatz · ○ offen · ✗ abgesagt.
// Arten: Training (ganze Gruppe, wöchentlich), Einzel (2 Plätze), Doppel (4 Plätze), Anderes.
// Bei Einzel/Doppel gilt: Wer zuerst zusagt, spielt. Wer später zusagt, steht auf der
// Ersatzbank und rückt automatisch nach, wenn jemand absagt.
// Mitteilungen werden in der Vorführung als Banner oben gezeigt; später echte Push-Mitteilungen.
//
// Bewusst eigenständig, damit es sich schnell wieder entfernen lässt:
//   - Abschalten: in config.js  features: { treffen: false }
//   - Entfernen:  diese Datei + <script> in index.html + Abschnitt „Treffen“ in app.css
// Daten liegen im Demo-Modus in einem eigenen Speicher (localStorage: tfb_meet_demo_v2).
(function () {
  if (!(TFB.config.features && TFB.config.features.treffen)) return;
  TFB.views = TFB.views || {};
  TFB.actions = TFB.actions || {};
  const ui = () => TFB.ui;
  const esc = (s) => ui().esc(s);

  const KEY = 'tfb_meet_demo_v2';
  const DAY = 864e5;
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const WD_LONG = ['sonntags', 'montags', 'dienstags', 'mittwochs', 'donnerstags', 'freitags', 'samstags'];

  const KINDS = {
    training: { label: 'Training', hint: 'Gruppe', slots: null },
    einzel: { label: 'Einzel', hint: '2 Spieler', slots: 2 },
    doppel: { label: 'Doppel', hint: '4 Spieler', slots: 4 },
    frei: { label: 'Anderes', hint: 'frei', slots: null },
  };
  const NOTES = ['komme 10 Min. später', 'bringe neue Bälle mit', '', '', '', 'danach Kölsch?', ''];

  // ---------- Speicher ----------
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {} };
  try { localStorage.removeItem('tfb_meet_demo_v1'); } catch (_) {}
  const isoDay = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const today = () => isoDay(new Date());
  const nextWeekday = (wd) => {
    const d = new Date();
    if (wd == null) return isoDay(new Date(d.getTime() + DAY));
    const add = ((wd - d.getDay()) + 7) % 7 || 7;
    return isoDay(new Date(d.getTime() + add * DAY));
  };
  const weekdayOf = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getDay(); };
  const uid = () => 'mt-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const ans = (a, minsAgo, note = '') => ({ a, at: Date.now() - minsAgo * 6e4, note });

  let data = load();
  if (!data) {
    const H40 = ['m-demo', 'm2', 'm4', 'm6', 'm8', 'm10', 'm12', 'm14', 'm16'];
    data = {
      groups: [
        { id: 'g-h40', name: 'Herren 40', members: H40, weekday: 2, time: '19:00', place: 'Platz 1–2' },
        { id: 'g-so', name: 'Sonntags-Doppel', members: ['m-demo', 'm4', 'm9', 'm18', 'm12'], weekday: 0, time: '10:00', place: 'Platz 3' },
      ],
      meets: [
        { id: uid(), kind: 'training', groupId: 'g-h40', weekly: true, title: 'Training Herren 40', date: nextWeekday(2), time: '19:00', place: 'Platz 1–2', note: '',
          createdBy: 'm2', invitees: H40, slots: null,
          responses: { m2: ans('yes', 300), m6: ans('yes', 240, 'bringe neue Bälle mit'), m10: ans('no', 200, 'Dienstreise'), m14: ans('yes', 90), m16: ans('yes', 30, 'komme 10 Min. später') } },
        { id: uid() + 'd', kind: 'doppel', title: 'Doppel', date: nextWeekday(4), time: '18:00', place: 'Platz 3', note: 'Wer hat Lust?',
          createdBy: 'm4', invitees: ['m4', 'm-demo', 'm9', 'm12', 'm14', 'm18', 'm8'], slots: 4,
          responses: { m4: ans('yes', 120), m12: ans('yes', 60), m18: ans('no', 40) } },
        { id: uid() + 'e', kind: 'einzel', title: 'Einzel', date: nextWeekday(6), time: '11:00', place: 'Platz 2', note: '',
          createdBy: 'm6', invitees: ['m6', 'm-demo', 'm8', 'm16'], slots: 2,
          responses: { m6: ans('yes', 20) } },
      ],
    };
    save();
  }

  // Wöchentliche Trainings rollen nach dem Termin auf die nächste Woche weiter (Antworten neu).
  function rollWeekly() {
    let changed = false;
    data.meets.forEach((m) => {
      if (!m.weekly) return;
      while (m.date < today()) {
        const [y, mo, d] = m.date.split('-').map(Number);
        m.date = isoDay(new Date(y, mo - 1, d + 7));
        m.responses = { [m.createdBy]: ans('yes', 0) };
        changed = true;
      }
    });
    if (changed) save();
  }
  rollWeekly();

  // ---------- Hilfen ----------
  const me = () => ui().state.member;
  const fmtDate = (iso, opts) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', { timeZone: 'UTC', ...opts }); };
  const shortDate = (iso) => fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'numeric' }).replace(',', '');
  const initials = (name) => (name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const firstName = (name) => (name || 'Jemand').split(' ')[0];
  const ago = (t) => {
    const min = Math.round((Date.now() - t) / 6e4);
    if (min < 1) return 'gerade eben';
    if (min < 60) return `vor ${min} Min.`;
    if (min < 1440) return `vor ${Math.round(min / 60)} Std.`;
    return `vor ${Math.round(min / 1440)} Tagen`;
  };
  const linkFor = (id) => {
    const base = /^https?:/.test(location.protocol) ? location.origin + location.pathname : TFB.config.publicUrl + '/';
    return `${base}#treffen/${id}`;
  };
  const shareText = (m) => `🎾 ${m.title} · ${shortDate(m.date)}, ${m.time} · ${m.place}\n${m.note ? m.note + '\n' : ''}Zu- oder absagen in der TFB-App: ${linkFor(m.id)}`;
  const waLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
  const group = (id) => data.groups.find((g) => g.id === id);
  const meetById = (id) => data.meets.find((x) => x.id === id);

  // Wer spielt, wer ist Ersatz, wer ist offen, wer hat abgesagt?
  function lineup(m) {
    const r = (id) => m.responses[id];
    const yes = m.invitees.filter((id) => r(id) && r(id).a === 'yes').sort((a, b) => r(a).at - r(b).at);
    const players = m.slots ? yes.slice(0, m.slots) : yes;
    const ersatz = m.slots ? yes.slice(m.slots) : [];
    const open = m.invitees.filter((id) => !r(id));
    const no = m.invitees.filter((id) => r(id) && r(id).a === 'no');
    const full = Boolean(m.slots) && players.length >= m.slots;
    return { players, ersatz, open, no, full, missing: m.slots ? Math.max(0, m.slots - players.length) : 0 };
  }
  function statusText(m, L = lineup(m)) {
    if (m.slots) {
      if (L.full) return `${m.kind === 'frei' ? 'Runde' : KINDS[m.kind].label} steht`;
      return L.missing === 1 ? 'Noch 1 Platz frei' : `Noch ${L.missing} Plätze frei`;
    }
    return `${L.players.length} dabei`;
  }

  // Mitteilungs-Vorschau (später echte Push-Mitteilung aufs Handy).
  const pushQueue = [];
  let pushBusy = false;
  function push(title, body) {
    pushQueue.push({ title, body });
    if (!pushBusy) nextPush();
  }
  function nextPush() {
    const n = pushQueue.shift();
    if (!n) { pushBusy = false; return; }
    pushBusy = true;
    const el = document.createElement('div');
    el.className = 'push-banner';
    el.setAttribute('role', 'status');
    el.innerHTML = `<span class="push-app">TFB</span><span class="push-text"><b>${esc(n.title)}</b><span>${esc(n.body)}</span></span><small>jetzt</small>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => { el.classList.remove('in'); setTimeout(() => { el.remove(); nextPush(); }, 350); }, 2800);
  }
  const rerender = () => {
    if (location.hash.startsWith('#treffen') && !document.querySelector('#sheet-root .sheet')) ui().renderView();
  };

  // Antwort setzen – mit Nachrück-Logik und Mitteilungen.
  async function setAnswer(m, id, a, note, by) {
    const before = lineup(m);
    if (a) m.responses[id] = { a, at: Date.now(), note: note || '', ...(by ? { by } : {}) };
    else delete m.responses[id];
    save();
    const after = lineup(m);
    const names = await ui().api.memberNames(m.invitees.concat(m.createdBy));
    // Nachrücker: war Ersatz, spielt jetzt
    after.players.filter((p) => !before.players.includes(p) && before.ersatz.includes(p)).forEach((p) => {
      push(m.title, p === me().id ? 'Du bist nachgerückt – du spielst!' : `${names[p]} rückt nach und spielt.`);
    });
    if (m.createdBy === me().id && id !== me().id && !by) {
      const who = names[id] || 'Jemand';
      const count = m.slots ? ` · ${after.players.length}/${m.slots}` : ` · ${after.players.length} dabei`;
      if (a === 'yes') push(m.title, after.ersatz.includes(id) ? `${who} steht auf der Ersatzbank.` : `${who} hat zugesagt${count}`);
      if (a === 'no') push(m.title, `${who} hat abgesagt${count}`);
    }
    if (after.full && !before.full) push(m.title, `${statusText(m, after)}! ${shortDate(m.date)}, ${m.time} Uhr 🎾`);
    return after;
  }

  // Vorführung: Eingeladene antworten nach ein paar Sekunden von selbst.
  function simulateReplies(m, maxReplies = 99) {
    const ids = m.invitees.filter((id) => id !== me().id && !m.responses[id]).slice(0, maxReplies);
    ids.forEach((id, i) => {
      setTimeout(async () => {
        const cur = meetById(m.id);
        if (!cur || cur.responses[id]) return;
        const yes = Math.random() < (cur.slots ? 0.65 : 0.75);
        await setAnswer(cur, id, yes ? 'yes' : 'no', yes ? NOTES[Math.floor(Math.random() * NOTES.length)] : '');
        rerender();
      }, 2600 + i * 2300 + Math.random() * 1200);
    });
  }

  // ---------- Übersicht ----------
  async function view() {
    const { state, icon } = ui();
    if (!state.member) {
      return `
        ${ui().viewHead('Treffen', 'Verabreden ohne Chat-Chaos.', false)}
        <section class="card meet-login"><p>Zum Verabreden bitte einmal anmelden – danach bleibt dein Handy angemeldet.</p>
        <button type="button" class="btn primary" data-action="login">Anmelden</button></section>`;
    }
    rollWeekly();
    const id = location.hash.split('/')[1];
    if (id) return detail(id);
    const mine = data.meets
      .filter((m) => m.invitees.includes(me().id) || m.createdBy === me().id)
      .filter((m) => m.date >= today())
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const allIds = [...new Set(mine.flatMap((m) => m.invitees))];
    const names = await ui().api.memberNames(allIds);
    const myGroups = data.groups.filter((g) => g.members.includes(me().id));
    return `
      ${ui().viewHead('Treffen', 'Verabreden ohne Chat-Chaos.', false)}
      <section class="meet-new-row">
        ${Object.entries(KINDS).map(([k, v]) => `
          <button type="button" class="meet-kind-tile" data-action="meet-new" data-kind="${k}">
            <span class="meet-kind-icon">${kindIcon(k)}</span><strong>${v.label}</strong><small>${v.hint}</small>
          </button>`).join('')}
      </section>
      <h2 class="block-heading">Anstehend</h2>
      ${mine.length ? `<div class="meet-list">${mine.map((m) => card(m, names)).join('')}</div>` : '<p class="muted">Gerade keine Verabredungen.</p>'}
      <h2 class="block-heading">Meine Gruppen</h2>
      <div class="meet-groups">
        ${myGroups.map((g) => `<button type="button" class="meet-group" data-action="meet-group" data-id="${g.id}"><strong>${esc(g.name)}</strong><small>${g.members.length} Mitglieder${g.weekday != null ? ` · ${WD[g.weekday]} ${esc(g.time)}` : ''}</small></button>`).join('')}
        <button type="button" class="meet-group add" data-action="meet-group">${icon.plus}<strong>Gruppe anlegen</strong></button>
      </div>
      <p class="fineprint">Vorführung: Die anderen antworten nach ein paar Sekunden von selbst. Mitteilungen erscheinen oben als Vorschau – im Echtbetrieb kommen sie als Push-Mitteilung aufs Handy.</p>`;
  }

  function kindIcon(k) {
    const person = (x, r = 3.2) => `<circle cx="${x}" cy="9" r="${r}"/><path d="M${x - r * 1.7} 22c0-4 ${r * .8}-6.5 ${r * 1.7}-6.5s${r * 1.7} 2.5 ${r * 1.7} 6.5"/>`;
    if (k === 'einzel') return `<svg viewBox="0 0 32 24">${person(9)}${person(23)}</svg>`;
    if (k === 'doppel') return `<svg viewBox="0 0 32 24">${person(4.5, 2.5)}${person(12.2, 2.5)}${person(19.8, 2.5)}${person(27.5, 2.5)}</svg>`;
    if (k === 'training') return '<svg viewBox="0 0 32 24"><rect x="4" y="4" width="24" height="18" rx="3"/><path d="M4 9.5h24M11 2v4M21 2v4M12 15.5l3 3 5.5-5.5"/></svg>';
    return '<svg viewBox="0 0 32 24"><circle cx="16" cy="12" r="8.5"/><path d="M10.5 5.5c3.2 3 3.2 10 0 13M21.5 5.5c-3.2 3-3.2 10 0 13"/></svg>';
  }

  function slotDots(m, L, names) {
    if (!m.slots) {
      const shown = L.players.slice(0, 7);
      return `<span class="meet-faces">${shown.map((p) => `<i class="yes" title="${esc(names[p] || '')}">${esc(initials(names[p]))}</i>`).join('')}${L.players.length > 7 ? `<i>+${L.players.length - 7}</i>` : ''}</span>`;
    }
    return `<span class="meet-faces slots">${Array.from({ length: m.slots }, (_, i) => {
      const p = L.players[i];
      return p ? `<i class="yes" title="${esc(names[p] || '')}">${esc(initials(names[p]))}</i>` : '<i class="free">?</i>';
    }).join('')}</span>`;
  }

  function myState(m, L) {
    const r = m.responses[me().id];
    if (!m.invitees.includes(me().id)) return null;
    return !r ? 'open' : r.a === 'no' ? 'no' : L.players.includes(me().id) ? 'yes' : 'ersatz';
  }

  function card(m, names) {
    const L = lineup(m);
    const s = myState(m, L);
    const label = s && { yes: '✓ dabei', ersatz: `Ersatz ${L.ersatz.indexOf(me().id) + 1}`, no: '✗ abgesagt', open: 'Antworten' }[s];
    return `
      <a class="card meet-card ${L.full ? 'is-full' : ''}" href="#treffen/${m.id}">
        <span class="date-badge"><small>${esc(fmtDate(m.date, { weekday: 'short' }))}</small><b>${esc(fmtDate(m.date, { day: 'numeric' }))}</b><small>${esc(fmtDate(m.date, { month: 'short' }).replace('.', ''))}</small></span>
        <span class="meet-card-text">
          <strong>${esc(m.title)}</strong>
          <small>${esc(m.time)} Uhr · ${esc(m.place)}${m.weekly ? ' · wöchentlich' : ''}</small>
          <span class="meet-card-status"><b class="${L.full ? 'ok' : ''}">${esc(statusText(m, L))}</b>${slotDots(m, L, names)}</span>
        </span>
        ${label ? `<span class="meet-mine ${s}">${esc(label)}</span>` : ''}
      </a>`;
  }

  // ---------- Einladung mit Tabelle ----------
  async function detail(id) {
    const m = meetById(id);
    if (!m) return `${ui().viewHead('Treffen', 'Diese Verabredung gibt es nicht mehr.')}`;
    const names = await ui().api.memberNames(m.invitees.concat(m.createdBy));
    const L = lineup(m);
    const r = m.responses[me().id];
    const isOrg = m.createdBy === me().id;
    const g = m.groupId && group(m.groupId);
    const rows = [
      ...L.players.map((p) => [p, 'yes']), ...L.ersatz.map((p, i) => [p, 'ersatz', i + 1]),
      ...L.open.map((p) => [p, 'open']), ...L.no.map((p) => [p, 'no']),
    ];
    const pill = (s, n) => ({ yes: '✓ dabei', ersatz: `Ersatz ${n}`, open: '○ offen', no: '✗ abgesagt' }[s]);
    const meIn = m.invitees.includes(me().id);
    const kind = KINDS[m.kind] ? KINDS[m.kind].label : '';
    const kicker = [kind !== m.title && !m.title.startsWith(kind) ? kind : '', g ? g.name : '', m.weekly ? `jede Woche ${WD_LONG[weekdayOf(m.date)]}` : '']
      .filter(Boolean).join(' · ');
    return `
      <header class="view-head">
        <div>${kicker ? `<p class="meet-kicker">${esc(kicker)}</p>` : ''}
          <h1>${esc(m.title)}</h1>
          <p class="muted">${esc(fmtDate(m.date, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(m.time)} Uhr · ${esc(m.place)}</p></div>
        <a class="view-close" href="#treffen" aria-label="Zurück zur Übersicht">${ui().icon.close}</a>
      </header>
      ${m.note ? `<p class="meet-note">„${esc(m.note)}“ <span class="muted">– ${esc(firstName(names[m.createdBy]))}</span></p>` : ''}

      <section class="meet-status ${L.full ? 'is-full' : ''}">
        <div><strong>${esc(statusText(m, L))}</strong>
          <small>${m.slots ? `${L.players.length} von ${m.slots}` : `${m.invitees.length} eingeladen`} · ${L.open.length} offen · ${L.no.length} abgesagt${L.ersatz.length ? ` · ${L.ersatz.length} Ersatz` : ''}</small></div>
        ${slotDots(m, L, names)}
      </section>
      ${m.slots ? '<p class="small muted meet-rule">Wer zuerst zusagt, spielt. Spätere Zusagen kommen auf die Ersatzbank und rücken automatisch nach.</p>' : ''}

      ${meIn ? myAnswer(m, r, L) : ''}

      <section class="card meet-table" aria-label="Teilnehmer">
        ${rows.map(([p, s, n]) => {
          const resp = m.responses[p];
          const sub = [p === m.createdBy ? 'lädt ein' : '', resp && resp.note ? `„${resp.note}“` : '', resp && resp.by ? `eingetragen von ${resp.by === me().id ? 'dir' : firstName(names[resp.by])}` : '', resp ? ago(resp.at) : ''].filter(Boolean).join(' · ');
          const proxy = isOrg && p !== me().id;
          const open = proxy ? `<button type="button" class="meet-row ${s}" data-action="meet-proxy" data-id="${m.id}" data-member="${p}">` : `<div class="meet-row ${s}">`;
          return `${open}
            <span class="meet-avatar">${esc(initials(names[p]))}</span>
            <span class="meet-who"><b>${esc(names[p] || 'Mitglied')}${p === me().id ? ' <em>du</em>' : ''}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>
            <span class="meet-pill ${s}">${pill(s, n)}</span>
          ${proxy ? '</button>' : '</div>'}`;
        }).join('')}
      </section>
      ${isOrg ? '<p class="small muted meet-rule">Tipp auf einen Namen: Antwort für jemanden eintragen, der dir im Chat oder am Platz Bescheid gegeben hat.</p>' : ''}

      <section class="meet-send">
        ${L.open.length && (isOrg || meIn) ? `<button type="button" class="btn block" data-action="meet-remind" data-id="${m.id}">Erinnerung an ${L.open.length === 1 ? 'den Offenen' : `die ${L.open.length} Offenen`}</button>` : ''}
        <a class="btn whatsapp-soft block" href="${esc(waLink(shareText(m)))}" target="_blank" rel="noopener">Für alle ohne App: per WhatsApp teilen</a>
        ${isOrg ? `<button type="button" class="link center danger-link" data-action="meet-delete" data-id="${m.id}">${m.weekly ? 'Wöchentliches Training beenden' : 'Verabredung absagen'}</button>` : ''}
      </section>`;
  }

  function myAnswer(m, r, L) {
    const state = !r ? 'open' : r.a;
    const fullForMe = L.full && !L.players.includes(me().id);
    const yesLabel = fullForMe && state !== 'yes' ? 'Als Ersatz eintragen' : 'Bin dabei';
    return `
      <section class="card meet-my">
        <div class="meet-answer">
          <button type="button" class="${state === 'yes' ? 'on yes' : ''}" data-action="meet-answer" data-id="${m.id}" data-answer="yes">${yesLabel}</button>
          <button type="button" class="${state === 'no' ? 'on no' : ''}" data-action="meet-answer" data-id="${m.id}" data-answer="no">Kann nicht</button>
        </div>
        <form class="meet-note-form" data-meet-note="${m.id}">
          <input name="note" maxlength="60" value="${esc(r && r.note ? r.note : '')}" placeholder="Notiz, z. B. komme später" aria-label="Notiz">
          <button type="submit" class="btn">OK</button>
        </form>
      </section>`;
  }

  // ---------- Neue Verabredung ----------
  async function openCreate(kind = 'training', preset = {}) {
    const { openSheet, closeSheet, icon } = ui();
    const myGroups = data.groups.filter((g) => g.members.includes(me().id));
    const g0 = myGroups.find((g) => g.id === preset.groupId) || myGroups[0];
    const isTraining = kind === 'training' && g0;
    const draft = {
      kind,
      groupId: isTraining ? g0.id : null,
      title: kind === 'training' ? (g0 ? `Training ${g0.name}` : 'Training') : kind === 'frei' ? '' : KINDS[kind].label,
      date: isTraining ? nextWeekday(g0.weekday) : preset.date || nextWeekday(null),
      time: isTraining ? g0.time : preset.time || '18:00',
      place: isTraining ? g0.place : preset.place || 'Tennisanlage',
      note: preset.note || '',
      weekly: kind === 'training',
      slots: KINDS[kind].slots,
      invitees: isTraining ? g0.members.slice() : (preset.invitees || [me().id]).slice(),
    };
    if (!draft.invitees.includes(me().id)) draft.invitees.unshift(me().id);
    let names = await ui().api.memberNames(draft.invitees);

    const render = () => {
      const rule = draft.kind === 'einzel' ? 'Die erste Zusage spielt mit dir.' : draft.kind === 'doppel' ? 'Die ersten drei Zusagen spielen mit dir.' : '';
      openSheet(`
        <form class="editor meet-editor" data-meet-form novalidate>
          <h2>Neue Verabredung</h2>
          <div class="seg meet-kinds">${Object.entries(KINDS).map(([k, v]) => `<button type="button" class="${k === draft.kind ? 'on' : ''}" data-kind="${k}">${v.label}</button>`).join('')}</div>
          ${draft.kind === 'training' ? `
            <div class="field"><span>Gruppe</span>
              <div class="seg">${myGroups.map((g) => `<button type="button" class="${g.id === draft.groupId ? 'on' : ''}" data-group="${g.id}">${esc(g.name)}</button>`).join('')}</div>
            </div>` : ''}
          ${draft.kind === 'frei' || draft.kind === 'training' ? `<label class="field"><span>Was</span><input name="title" value="${esc(draft.title)}" placeholder="z. B. Spiel gegen Hennef"></label>` : ''}
          <div class="field-row">
            <label class="field"><span>Datum</span><input name="date" type="date" value="${esc(draft.date)}"></label>
            <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(draft.time)}"></label>
          </div>
          <label class="field"><span>Wo</span><input name="place" value="${esc(draft.place)}"></label>
          ${draft.kind === 'training' ? `<label class="meet-check"><input type="checkbox" name="weekly" ${draft.weekly ? 'checked' : ''}><span>Jede Woche wiederholen</span></label>` : ''}
          ${draft.kind === 'frei' ? `<label class="field"><span>Plätze (leer = unbegrenzt)</span><input name="slots" type="number" min="2" max="40" inputmode="numeric" value="${draft.slots || ''}"></label>` : ''}
          <div class="field"><span>${draft.kind === 'einzel' || draft.kind === 'doppel' ? 'Wen fragen?' : 'Wer?'} · ${draft.invitees.length} eingeladen</span>
            ${rule ? `<p class="small muted meet-rule">${rule} Wer später zusagt, steht auf der Ersatzbank und rückt automatisch nach.</p>` : ''}
            <div class="meet-chips">${draft.invitees.map((id) => `<span class="chip">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : `<button type="button" data-remove="${id}" aria-label="Entfernen">×</button>`}</span>`).join('')}</div>
            ${draft.kind !== 'training' ? `<div class="meet-quick">${myGroups.filter((g) => g.members.some((i) => !draft.invitees.includes(i))).map((g) => `<button type="button" data-addgroup="${g.id}">${icon.plus}<span>ganze Gruppe ${esc(g.name)}</span></button>`).join('')}</div>` : ''}
            <input name="search" autocomplete="off" placeholder="Name tippen, z. B. Klein oder anna.b">
            <div class="meet-suggest" data-suggest></div>
          </div>
          <label class="field"><span>Notiz (freiwillig)</span><input name="note" value="${esc(draft.note)}" placeholder="z. B. Wer hat Lust?"></label>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block big">Einladen</button>
        </form>`);
      const form = document.querySelector('[data-meet-form]');
      const collect = () => {
        ['title', 'date', 'time', 'place', 'note'].forEach((k) => { if (form.elements[k]) draft[k] = form.elements[k].value.trim(); });
        if (form.elements.weekly) draft.weekly = form.elements.weekly.checked;
        if (form.elements.slots) draft.slots = parseInt(form.elements.slots.value, 10) || null;
      };
      form.addEventListener('click', async (e) => {
        const k = e.target.closest('[data-kind]');
        if (k) {
          collect();
          const keep = draft.kind !== 'training' ? { date: draft.date, time: draft.time, place: draft.place, note: draft.note, invitees: draft.invitees } : { date: draft.date, note: draft.note };
          openCreate(k.dataset.kind, keep);
          return;
        }
        const gb = e.target.closest('[data-group]');
        if (gb) { openCreate('training', { groupId: gb.dataset.group }); return; }
        const rm = e.target.closest('[data-remove]');
        if (rm) { collect(); draft.invitees = draft.invitees.filter((i) => i !== rm.dataset.remove); render(); return; }
        const ag = e.target.closest('[data-addgroup]');
        const add = e.target.closest('[data-add]');
        if (ag || add) {
          collect();
          const ids = ag ? group(ag.dataset.addgroup).members : [add.dataset.add];
          ids.forEach((i) => { if (!draft.invitees.includes(i)) draft.invitees.push(i); });
          names = await ui().api.memberNames(draft.invitees);
          render();
          if (add) document.querySelector('[data-meet-form] [name=search]').focus();
        }
      });
      form.elements.search.addEventListener('input', async (e) => {
        const hits = await ui().api.searchMembers(e.target.value);
        form.querySelector('[data-suggest]').innerHTML = hits
          .filter((h) => !draft.invitees.includes(h.id))
          .map((h) => `<button type="button" data-add="${h.id}">${icon.plus}<span>${esc(h.firstName)} ${esc(h.lastName)}</span></button>`).join('');
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        collect();
        const err = form.querySelector('.form-error');
        if (!draft.title) { err.textContent = 'Bitte kurz eintragen, worum es geht.'; return; }
        if (draft.invitees.length < 2) { err.textContent = 'Bitte mindestens eine Person einladen.'; return; }
        if (draft.slots && draft.invitees.length < draft.slots) { err.textContent = `Bitte mindestens ${draft.slots} Personen einladen (inkl. dir).`; return; }
        const meet = {
          id: uid(), kind: draft.kind, groupId: draft.groupId, weekly: draft.kind === 'training' && draft.weekly,
          title: draft.title, date: draft.date, time: draft.time, place: draft.place, note: draft.note,
          createdBy: me().id, invitees: draft.invitees, slots: draft.slots,
          responses: { [me().id]: ans('yes', 0) }, createdAt: new Date().toISOString(),
        };
        data.meets.push(meet);
        save();
        closeSheet();
        location.hash = '#treffen/' + meet.id;
        push(meet.title, `Mitteilung an ${meet.invitees.length - 1} ${meet.invitees.length === 2 ? 'Person' : 'Personen'} geschickt`);
        simulateReplies(meet);
      });
    };
    render();
  }

  // ---------- Gruppen ----------
  async function openGroup(groupId) {
    const { openSheet, closeSheet, icon } = ui();
    const g = groupId ? group(groupId) : null;
    const draft = g ? { ...g, members: g.members.slice() } : { id: 'g-' + Date.now().toString(36), name: '', members: [me().id], weekday: 2, time: '19:00', place: 'Tennisanlage' };
    let names = await ui().api.memberNames(draft.members);
    const render = () => {
      openSheet(`
        <form class="editor meet-editor" data-group-form novalidate>
          <h2>${g ? 'Gruppe' : 'Neue Gruppe'}</h2>
          <label class="field"><span>Name</span><input name="name" value="${esc(draft.name)}" placeholder="z. B. Herren 40"></label>
          <div class="field-row">
            <label class="field"><span>Trainingstag</span><select name="weekday">${WD.map((w, i) => `<option value="${i}" ${i === draft.weekday ? 'selected' : ''}>${w}</option>`).join('')}</select></label>
            <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(draft.time)}"></label>
          </div>
          <label class="field"><span>Wo</span><input name="place" value="${esc(draft.place)}"></label>
          <div class="field"><span>Mitglieder · ${draft.members.length}</span>
            <div class="meet-chips">${draft.members.map((id) => `<span class="chip">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : `<button type="button" data-remove="${id}" aria-label="Entfernen">×</button>`}</span>`).join('')}</div>
            <input name="search" autocomplete="off" placeholder="Name tippen">
            <div class="meet-suggest" data-suggest></div>
          </div>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block big">Speichern</button>
          ${g ? `<button type="button" class="btn block meet-gap" data-start>Training für diese Gruppe anlegen</button>
                 <button type="button" class="link center danger-link" data-del>Gruppe löschen</button>` : ''}
        </form>`);
      const form = document.querySelector('[data-group-form]');
      const collect = () => {
        draft.name = form.elements.name.value.trim();
        draft.weekday = Number(form.elements.weekday.value);
        draft.time = form.elements.time.value;
        draft.place = form.elements.place.value.trim();
      };
      form.addEventListener('click', async (e) => {
        if (e.target.closest('[data-start]')) { openCreate('training', { groupId: g.id }); return; }
        const del = e.target.closest('[data-del]');
        if (del) {
          if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
          data.groups = data.groups.filter((x) => x.id !== g.id);
          save(); closeSheet(); ui().renderView(); return;
        }
        const rm = e.target.closest('[data-remove]');
        if (rm) { collect(); draft.members = draft.members.filter((i) => i !== rm.dataset.remove); render(); return; }
        const add = e.target.closest('[data-add]');
        if (add) {
          collect();
          if (!draft.members.includes(add.dataset.add)) draft.members.push(add.dataset.add);
          names = await ui().api.memberNames(draft.members);
          render();
          document.querySelector('[data-group-form] [name=search]').focus();
        }
      });
      form.elements.search.addEventListener('input', async (e) => {
        const hits = await ui().api.searchMembers(e.target.value);
        form.querySelector('[data-suggest]').innerHTML = hits
          .filter((h) => !draft.members.includes(h.id))
          .map((h) => `<button type="button" data-add="${h.id}">${icon.plus}<span>${esc(h.firstName)} ${esc(h.lastName)}</span></button>`).join('');
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        collect();
        if (!draft.name) { form.querySelector('.form-error').textContent = 'Bitte einen Namen eingeben.'; return; }
        if (g) Object.assign(g, draft); else data.groups.push(draft);
        save(); closeSheet(); ui().toast('Gruppe gespeichert', true); ui().renderView();
      });
    };
    render();
  }

  // Für jemanden eintragen (nur der Einladende)
  async function openProxy(m, memberId) {
    const { openSheet, closeSheet } = ui();
    const names = await ui().api.memberNames([memberId]);
    const r = m.responses[memberId];
    openSheet(`
      <div class="editor meet-proxy">
        <h2>${esc(names[memberId] || 'Mitglied')}</h2>
        <p class="small muted">Antwort eintragen, wenn ${esc(firstName(names[memberId]))} dir im Chat oder am Platz Bescheid gegeben hat.</p>
        <div class="meet-answer">
          <button type="button" class="${r && r.a === 'yes' ? 'on yes' : ''}" data-set="yes">Ist dabei</button>
          <button type="button" class="${r && r.a === 'no' ? 'on no' : ''}" data-set="no">Kann nicht</button>
        </div>
        ${r ? '<button type="button" class="link center" data-set="">Antwort zurücksetzen</button>' : ''}
      </div>`);
    document.querySelector('.meet-proxy').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-set]');
      if (!b) return;
      await setAnswer(m, memberId, b.dataset.set || null, '', me().id);
      closeSheet();
      ui().renderView();
    });
  }

  // ---------- Aktionen ----------
  Object.assign(TFB.actions, {
    'meet-new': (el) => openCreate(el.dataset.kind || 'training'),
    'meet-group': (el) => openGroup(el.dataset.id),
    'meet-proxy': (el) => openProxy(meetById(el.dataset.id), el.dataset.member),
    'meet-answer': async (el) => {
      const m = meetById(el.dataset.id);
      if (!m) return;
      const a = el.dataset.answer;
      const prev = m.responses[me().id];
      const L = await setAnswer(m, me().id, a, prev ? prev.note : '');
      if (a === 'yes') {
        const clash = data.meets.find((x) => x.id !== m.id && x.date === m.date && x.time === m.time && x.responses[me().id] && x.responses[me().id].a === 'yes');
        if (clash) ui().toast(`Achtung: Um ${m.time} hast du schon bei „${clash.title}“ zugesagt`);
        else ui().toast(L.ersatz.includes(me().id) ? `Du bist Ersatz ${L.ersatz.indexOf(me().id) + 1} – du rückst automatisch nach` : 'Super – du bist dabei', true);
      } else ui().toast('Abgesagt – danke fürs Bescheid geben', true);
      ui().renderView();
    },
    'meet-remind': async (el) => {
      const m = meetById(el.dataset.id);
      const L = lineup(m);
      const names = await ui().api.memberNames(L.open);
      push('Erinnerung verschickt', `an ${L.open.map((i) => firstName(names[i])).join(', ')}`);
      simulateReplies(m, 2);
    },
    'meet-delete': (el) => {
      if (!el.dataset.armed) { el.dataset.armed = '1'; el.textContent = 'Wirklich? Nochmal tippen – alle bekommen Bescheid'; return; }
      const m = meetById(el.dataset.id);
      data.meets = data.meets.filter((x) => x.id !== el.dataset.id);
      save();
      push(m.title, 'Abgesagt – alle Eingeladenen haben eine Mitteilung bekommen.');
      location.hash = '#treffen';
    },
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-meet-note]');
    if (!f) return;
    e.preventDefault();
    const m = meetById(f.dataset.meetNote);
    const r = m && m.responses[me().id];
    if (!r) { ui().toast('Bitte erst zu- oder absagen'); return; }
    r.note = f.elements.note.value.trim();
    save();
    ui().toast(r.note ? 'Notiz gespeichert' : 'Notiz entfernt', true);
    ui().renderView();
  });

  TFB.views.treffen = view;
})();
