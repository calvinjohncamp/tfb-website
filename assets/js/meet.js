// TFB – „Verabreden“ (intern: treffen): Verabreden in der App (Vorführung).
//
// Arten (Reihenfolge wie oben auf der Seite): Einzel (2 Plätze), Doppel (4 Plätze), Training (Gruppe), Mannschafts-Spiel.
// Gruppen: Wer hinzugefügt wird, bestätigt die Teilnahme im Postfach; erst dann erscheint die Gruppe bei ihm.
// Zwei Wege einzuladen:
//   - Einmalig: Die Einladung geht sofort an alle Eingeladenen.
//   - Jede Woche: Eine regelmäßige Einladung (Serie) von–bis. Zu jedem Termin geht die Einladung
//     automatisch X Tage vorher raus; jede Woche wird neu zu- oder abgesagt.
// Bei Einzel/Doppel gilt: Wer zuerst zusagt, spielt. Spätere Zusagen stehen auf der Ersatzbank und
// rücken automatisch nach, wenn jemand absagt.
//
// Postfach (Glocke oben neben dem Profilbild): Einladungen, Zu-/Absagen an den Einladenden,
// „Runde steht“, Nachrücken, Absagen, Erinnerungen. Keine E-Mails, keine aufploppenden Banner –
// die Glocke zeigt die Zahl der ungelesenen Einträge. (Chat und Insider News bewusst ohne Postfach.)
// Im Echtbetrieb legt ein Serverdienst die wöchentlichen Termine an; hier passiert das beim Öffnen.
//
// Bewusst eigenständig, damit es sich schnell wieder entfernen lässt:
//   - Abschalten: in config.js  features: { treffen: false }
//   - Entfernen:  diese Datei + <script> in index.html + Abschnitt „Treffen“ in app.css
// Daten liegen im Demo-Modus in einem eigenen Speicher (localStorage: tfb_meet_demo_v2).
// Keine Historie: Vorbei ist vorbei. Termine verschwinden nach ihrem Tag, beendete Serien sofort,
// Postfach-Einträge mit ihrem Termin, beantwortete Einladungen sofort, gelesene Gruppen-Infos sofort.
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
    einzel: { label: 'Einzel', hint: '2 Spieler', slots: 2 },
    doppel: { label: 'Doppel', hint: '4 Spieler', slots: 4 },
    training: { label: 'Training', hint: 'Gruppe', slots: null },
    frei: { label: 'Mannschafts-Spiel', hint: 'Heim · Auswärts', slots: null },
  };
  const LEADS = [1, 2, 3, 4, 5, 6, 7];
  const NOTES = ['komme 10 Min. später', 'bringe neue Bälle mit', '', '', '', 'danach Kölsch?', ''];

  // ---------- Speicher ----------
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } };
  const save = () => { prune(); try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {} };
  try { localStorage.removeItem('tfb_meet_demo_v1'); } catch (_) {}
  const isoDay = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const today = () => isoDay(new Date());
  const addDays = (iso, n) => { const [y, m, d] = iso.split('-').map(Number); return isoDay(new Date(y, m - 1, d + n)); };
  const nextWeekday = (wd) => {
    const d = new Date();
    if (wd == null) return isoDay(new Date(d.getTime() + DAY));
    const add = ((wd - d.getDay()) + 7) % 7 || 7;
    return isoDay(new Date(d.getTime() + add * DAY));
  };
  const weekdayOf = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getDay(); };
  const uid = (p = 'mt-') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const ans = (a, minsAgo, note = '') => ({ a, at: Date.now() - minsAgo * 6e4, note });

  let data = load();
  if (!data) {
    data = {
      groups: [],
      meets: [
        { id: uid() + 'd', kind: 'doppel', title: 'Doppel', date: nextWeekday(4), time: '18:00', place: 'Platz 3', note: 'Wer hat Lust?',
          createdBy: 'm4', invitees: ['m4', 'm-demo', 'm9', 'm12', 'm14', 'm18', 'm8'], slots: 4,
          responses: { m4: ans('yes', 120), m12: ans('yes', 60), m18: ans('no', 40) } },
        { id: uid() + 'e', kind: 'einzel', title: 'Einzel', date: nextWeekday(6), time: '11:00', place: 'Platz 2', note: '',
          createdBy: 'm6', invitees: ['m6', 'm-demo', 'm8', 'm16'], slots: 2,
          responses: { m6: ans('yes', 20) } },
      ],
      series: [],
      inbox: [],
    };
    data.meets.forEach((m) => notifyInvite(m, 90));
  }
  // Ältere Demo-Stände: wöchentliche Trainings werden zu regelmäßigen Einladungen, Postfach kommt dazu.
  if (!data.series) {
    data.series = [];
    data.inbox = data.inbox || [];
    data.meets.forEach((m) => {
      if (m.weekly) {
        const s = { id: uid('sr-'), kind: m.kind, groupId: m.groupId || null, title: m.title, time: m.time, place: m.place, note: m.note || '',
          createdBy: m.createdBy, invitees: m.invitees.slice(), slots: m.slots, from: m.date, until: addDays(m.date, 7 * 12), leadDays: 3, skipped: [] };
        data.series.push(s);
        m.seriesId = s.id;
        delete m.weekly;
      }
      notifyInvite(m, 60);
    });
  }
  // 12.10.: Beispielgruppen entfernt (Nutzer legt eigene an) – samt ihren Trainings
  if (!data.noSampleGroups) {
    const sample = ['g-h40', 'g-so'];
    data.groups = data.groups.filter((g) => !sample.includes(g.id));
    data.series = data.series.filter((s) => !sample.includes(s.groupId));
    data.meets = data.meets.filter((m) => !sample.includes(m.groupId));
    data.noSampleGroups = true;
  }
  data.groups.forEach((g) => { if (!g.createdBy) g.createdBy = g.members[0]; if (!g.pending) g.pending = []; });
  materialize();
  save();

  // ---------- Postfach ----------
  // Ein Eintrag: { id, to, type, from, meetId, snap: {title,date,time}, at, read, extra }
  function note(to, type, m, from, extra = {}, minsAgo = 0) {
    data.inbox.push({ id: uid('ib-'), to, type, from: from || null, meetId: m.id, snap: { title: m.title, date: m.date, time: m.time },
      at: Date.now() - minsAgo * 6e4, read: false, extra });
  }
  // Gruppen-Einladung bzw. Antwort darauf
  function groupNote(to, type, g, from) {
    data.inbox.push({ id: uid('ib-'), to, type, from: from || null, groupId: g.id, snap: { title: g.name }, at: Date.now(), read: false, extra: {} });
  }
  function notifyInvite(m, minsAgo = 0) {
    m.invitees.filter((p) => p !== m.createdBy).forEach((p) => {
      note(p, 'invite', m, m.createdBy, {}, minsAgo);
      if (m.responses[p]) data.inbox[data.inbox.length - 1].read = true;   // schon beantwortet
    });
  }
  const myInbox = () => (me() ? data.inbox.filter((n) => n.to === me().id).sort((a, b) => b.at - a.at) : []);
  const unread = () => myInbox().filter((n) => !n.read).length;
  const bellSvg = '<svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>';
  function bellButton() {
    if (!me()) return '';
    const n = unread();
    return `<button type="button" class="inbox-btn ${n ? 'has' : ''}" data-action="inbox" aria-label="Postfach${n ? `, ${n} neu` : ''}">${bellSvg}${n ? `<b class="inbox-badge">${n > 9 ? '9+' : n}</b>` : ''}</button>`;
  }
  function refreshBell() {
    const b = document.querySelector('.inbox-btn');
    if (b) b.outerHTML = bellButton();
  }
  TFB.inbox = { button: bellButton, refresh: refreshBell };

  // ---------- Aufräumen: nichts aufheben, was erledigt ist ----------
  function prune() {
    const now = today();
    data.meets = data.meets.filter((m) => m.date >= now);
    data.series = (data.series || []).filter((s) => s.until >= now);
    data.series.forEach((s) => { s.skipped = (s.skipped || []).filter((d) => d >= now); });
    data.inbox = (data.inbox || []).filter((n) => {
      if (n.groupId) {
        const g = data.groups.find((x) => x.id === n.groupId);
        if (!g) return false;
        return n.type === 'group-invite' ? (g.pending || []).includes(n.to) : !n.read;
      }
      if (n.snap.date < now) return false;
      if (n.type === 'cancel') return true;                // Absage bleibt bis zum Tag stehen
      const m = data.meets.find((x) => x.id === n.meetId);
      if (!m) return false;
      if (n.type === 'invite' || n.type === 'remind') return !m.responses[n.to];   // beantwortet → weg
      return true;
    });
  }

  // ---------- Regelmäßige Einladungen: Termine anlegen, sobald der Vorlauf erreicht ist ----------
  // Gibt die neu angelegten Termine zurück (Einladungen gehen dabei ins Postfach der Eingeladenen).
  function materialize() {
    const created = [];
    const now = today();
    (data.series || []).forEach((s) => {
      for (let d = s.from, i = 0; d <= s.until && i < 200; d = addDays(d, 7), i += 1) {
        if (d < now) continue;
        if (addDays(d, -s.leadDays) > now) break;            // noch nicht dran
        if ((s.skipped || []).includes(d)) continue;
        if (data.meets.some((m) => m.seriesId === s.id && m.date === d)) continue;
        const g = s.groupId && data.groups.find((x) => x.id === s.groupId);
        const invitees = g ? [...new Set([s.createdBy, ...g.members])] : s.invitees.slice();
        const m = { id: uid(), seriesId: s.id, kind: s.kind, groupId: s.groupId, title: s.title, date: d, time: s.time, place: s.place, note: s.note,
          meetAt: s.meetAt || '', departAt: s.departAt || '', createdBy: s.createdBy, invitees, slots: s.slots, responses: { [s.createdBy]: ans('yes', 0) }, createdAt: new Date().toISOString() };
        data.meets.push(m);
        notifyInvite(m);
        created.push(m);
      }
    });
    save();
    return created;
  }
  // Wann geht die nächste Einladung einer Serie raus – und für welchen Termin?
  function nextSend(s) {
    const now = today();
    for (let d = s.from, i = 0; d <= s.until && i < 200; d = addDays(d, 7), i += 1) {
      if (d < now || (s.skipped || []).includes(d) || data.meets.some((m) => m.seriesId === s.id && m.date === d)) continue;
      return { date: d, send: addDays(d, -s.leadDays) };
    }
    return null;
  }

  // ---------- Hilfen ----------
  const me = () => ui() && ui().state.member;
  const fmtDate = (iso, opts) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', { timeZone: 'UTC', ...opts }); };
  const shortDate = (iso) => fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'numeric' }).replace(',', '');
  const longDate = (iso) => fmtDate(iso, { day: 'numeric', month: 'numeric', year: 'numeric' });
  const initials = (name) => (name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const firstName = (name) => (name || 'Jemand').split(' ')[0];
  const ago = (t) => {
    const min = Math.round((Date.now() - t) / 6e4);
    if (min < 1) return 'gerade eben';
    if (min < 60) return `vor ${min} Min.`;
    if (min < 1440) return `vor ${Math.round(min / 60)} Std.`;
    return `vor ${Math.round(min / 1440)} Tagen`;
  };
  const sendText = (iso) => (iso <= today() ? 'heute' : iso === addDays(today(), 1) ? 'morgen' : shortDate(iso));
  const linkFor = (id) => {
    const base = /^https?:/.test(location.protocol) ? location.origin + location.pathname : TFB.config.publicUrl + '/';
    return `${base}#treffen/${id}`;
  };
  const shareText = (m) => `🎾 ${m.title} · ${shortDate(m.date)}, ${m.time} · ${m.place}\n${m.note ? m.note + '\n' : ''}Zu- oder absagen in der TFB-App: ${linkFor(m.id)}`;
  const waLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
  const group = (id) => data.groups.find((g) => g.id === id);
  const meetById = (id) => data.meets.find((x) => x.id === id);
  const seriesById = (id) => (data.series || []).find((x) => x.id === id);
  const extraTimes = (m) => [m.meetAt ? `Treffen ${m.meetAt}` : '', m.departAt ? `Abfahrt ${m.departAt}` : ''].filter(Boolean).join(' · ');
  const rhythm = (s) => `jede Woche ${WD_LONG[weekdayOf(s.from)]} · bis ${longDate(s.until)}`;

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
  const rerender = () => {
    refreshBell();
    if (location.hash.startsWith('#treffen') && !document.querySelector('#sheet-root .sheet')) ui().renderView();
  };

  // Antwort setzen – mit Nachrück-Logik und Postfach-Einträgen.
  function setAnswer(m, id, a, noteText, by) {
    const before = lineup(m);
    if (a) m.responses[id] = { a, at: Date.now(), note: noteText || '', ...(by ? { by } : {}) };
    else delete m.responses[id];
    const after = lineup(m);
    // Nachrücker: war Ersatz, spielt jetzt
    after.players.filter((p) => !before.players.includes(p) && before.ersatz.includes(p)).forEach((p) => note(p, 'moved', m, null));
    // Der Einladende erfährt jede Zu- und Absage
    if (id !== m.createdBy && !by && a) {
      const count = m.slots ? `${after.players.length}/${m.slots}` : `${after.players.length} dabei`;
      note(m.createdBy, a === 'no' ? 'no' : after.ersatz.includes(id) ? 'ersatz' : 'yes', m, id, { count, note: noteText || '' });
    }
    // Runde komplett → alle, die spielen
    if (after.full && !before.full) after.players.forEach((p) => note(p, 'full', m, null));
    save();
    return after;
  }

  // Vorführung: Eingeladene antworten nach ein paar Sekunden von selbst.
  function simulateReplies(m, maxReplies = 99) {
    const ids = m.invitees.filter((id) => id !== me().id && !m.responses[id]).slice(0, maxReplies);
    ids.forEach((id, i) => {
      setTimeout(() => {
        const cur = meetById(m.id);
        if (!cur || cur.responses[id]) return;
        const yes = Math.random() < (cur.slots ? 0.65 : 0.75);
        setAnswer(cur, id, yes ? 'yes' : 'no', yes ? NOTES[Math.floor(Math.random() * NOTES.length)] : '');
        rerender();
      }, 2600 + i * 2300 + Math.random() * 1200);
    });
  }

  // ---------- Übersicht ----------
  async function view() {
    const { state, icon } = ui();
    if (!state.member) {
      return `
        ${ui().viewHead('Verabreden', 'Einzel, Doppel, Training – wer ist dabei?', false)}
        <section class="card meet-login"><p>Zum Verabreden bitte einmal anmelden – danach bleibt dein Handy angemeldet.</p>
        <button type="button" class="btn primary" data-action="login">Anmelden</button></section>
        ${ui().partnerSlot('treffen', 'Verabreden wird dir präsentiert von')}`;
    }
    const fresh = materialize();
    if (fresh.length) setTimeout(refreshBell, 0);
    const id = location.hash.split('/')[1];
    if (id) return detail(id);
    const mine = data.meets
      .filter((m) => m.invitees.includes(me().id) || m.createdBy === me().id)
      .filter((m) => m.date >= today())
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const waiting = mine.filter((m) => m.invitees.includes(me().id) && !m.responses[me().id]);
    const rest = mine.filter((m) => !waiting.includes(m));
    const mySeries = (data.series || []).filter((s) => (s.createdBy === me().id || s.invitees.includes(me().id)));
    const allIds = [...new Set(mine.flatMap((m) => m.invitees).concat(mySeries.map((s) => s.createdBy)))];
    const names = await ui().api.memberNames(allIds);
    const myGroups = data.groups.filter((g) => g.members.includes(me().id));
    const groupAsks = data.groups.filter((g) => (g.pending || []).includes(me().id));
    const gNames = await ui().api.memberNames(groupAsks.map((g) => g.createdBy));
    return `
      ${ui().viewHead('Verabreden', 'Einzel, Doppel, Training – wer ist dabei?', false)}
      <section class="meet-new-row">
        ${Object.entries(KINDS).map(([k, v]) => `
          <button type="button" class="meet-kind-tile" data-action="meet-new" data-kind="${k}">
            <span class="meet-kind-icon">${kindIcon(k)}</span><strong>${v.label}</strong><small>${v.hint}</small>
          </button>`).join('')}
      </section>
      ${waiting.length || groupAsks.length ? `
        <h2 class="block-heading">Wartet auf deine Antwort</h2>
        <div class="meet-list">${groupAsks.map((g) => `
          <button type="button" class="card meet-card meet-series" data-action="group-answer" data-id="${g.id}">
            <span class="meet-series-icon">${kindIcon('training')}</span>
            <span class="meet-card-text"><strong>Gruppe ${esc(g.name)}</strong><small>${esc(firstName(gNames[g.createdBy]))} hat dich hinzugefügt · ${g.members.length} bestätigt</small></span>
            <span class="meet-mine open">Bestätigen</span>
          </button>`).join('')}${waiting.map((m) => card(m, names)).join('')}</div>` : ''}
      <h2 class="block-heading">Anstehend</h2>
      ${rest.length ? `<div class="meet-list">${rest.map((m) => card(m, names)).join('')}</div>` : '<p class="muted">Gerade keine weiteren Verabredungen.</p>'}
      ${mySeries.length ? `
        <h2 class="block-heading">Regelmäßig</h2>
        <div class="meet-series-list">${mySeries.map((s) => seriesCard(s, names)).join('')}</div>` : ''}
      <h2 class="block-heading">Meine Gruppen</h2>
      <div class="meet-groups">
        ${myGroups.map((g) => `<button type="button" class="meet-group" data-action="meet-group" data-id="${g.id}"><strong>${esc(g.name)}</strong><small>${g.members.length} ${g.members.length === 1 ? 'Mitglied' : 'Mitglieder'}${g.weekday != null ? ` · ${WD[g.weekday]} ${esc(g.time)}` : ''}</small>${(g.pending || []).length ? `<small class="meet-unconfirmed">${g.pending.length} unbestätigt</small>` : ''}</button>`).join('')}
        <button type="button" class="meet-group add" data-action="meet-group">${icon.plus}<strong>Gruppe anlegen</strong></button>
      </div>
      <p class="fineprint">Vorführung: Die anderen antworten nach ein paar Sekunden von selbst. Neues landet im Postfach (Glocke oben) – ohne E-Mail und ohne Aufploppen.</p>
      ${ui().partnerSlot('treffen', 'Verabreden wird dir präsentiert von')}`;
  }

  function kindIcon(k) {
    const person = (x, r = 3.2) => `<circle cx="${x}" cy="9" r="${r}"/><path d="M${x - r * 1.7} 22c0-4 ${r * .8}-6.5 ${r * 1.7}-6.5s${r * 1.7} 2.5 ${r * 1.7} 6.5"/>`;
    if (k === 'einzel') return `<svg viewBox="0 0 32 24">${person(9)}${person(23)}</svg>`;
    if (k === 'doppel') return `<svg viewBox="0 0 32 24">${person(4.2, 2.5)}${person(11, 2.5)}${person(21, 2.5)}${person(27.8, 2.5)}</svg>`;
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
    const from = m.createdBy !== me().id ? ` · von ${firstName(names[m.createdBy])}` : '';
    return `
      <a class="card meet-card ${L.full ? 'is-full' : ''}" href="#treffen/${m.id}">
        <span class="date-badge"><small>${esc(fmtDate(m.date, { weekday: 'short' }))}</small><b>${esc(fmtDate(m.date, { day: 'numeric' }))}</b><small>${esc(fmtDate(m.date, { month: 'short' }).replace('.', ''))}</small></span>
        <span class="meet-card-text">
          <strong>${esc(m.title)}</strong>
          <small>${esc(m.time)} Uhr · ${esc(m.place)}${extraTimes(m) ? ` · ${esc(extraTimes(m))}` : ''}${m.seriesId ? ' · wöchentlich' : ''}${esc(from)}</small>
          <span class="meet-card-status"><b class="${L.full ? 'ok' : ''}">${esc(statusText(m, L))}</b>${slotDots(m, L, names)}</span>
        </span>
        ${label ? `<span class="meet-mine ${s}">${esc(label)}</span>` : ''}
      </a>`;
  }

  function seriesCard(s, names) {
    const nx = nextSend(s);
    const own = s.createdBy === me().id;
    const nextLine = nx ? `Nächste Einladung ${sendText(nx.send)} für ${shortDate(nx.date)}` : 'Alle Termine sind verschickt';
    const inner = `
        <span class="meet-series-icon">${kindIcon(s.kind)}</span>
        <span class="meet-card-text">
          <strong>${esc(s.title)}</strong>
          <small>${esc(rhythm(s))} · ${esc(s.time)} Uhr</small>
          <small>${esc(nextLine)} · ${s.leadDays} ${s.leadDays === 1 ? 'Tag' : 'Tage'} vorher${own ? '' : ` · von ${esc(firstName(names[s.createdBy]))}`}</small>
        </span>
        ${own ? '<span class="meet-mine edit">Ändern</span>' : ''}`;
    return own
      ? `<button type="button" class="card meet-card meet-series" data-action="meet-series" data-id="${s.id}">${inner}</button>`
      : `<div class="card meet-card meet-series">${inner}</div>`;
  }

  // ---------- Einladung mit Tabelle ----------
  async function detail(id) {
    const m = meetById(id);
    if (!m) return `${ui().viewHead('Verabreden', 'Diese Verabredung gibt es nicht mehr.')}`;
    const names = await ui().api.memberNames(m.invitees.concat(m.createdBy));
    const pics = await ui().api.memberAvatars(m.invitees);
    const L = lineup(m);
    const r = m.responses[me().id];
    const isOrg = m.createdBy === me().id;
    const g = m.groupId && group(m.groupId);
    const s = m.seriesId && seriesById(m.seriesId);
    // Wer die Seite öffnet, hat die Einträge zu diesem Termin gesehen
    let seen = false;
    data.inbox.filter((n) => n.to === me().id && n.meetId === m.id && !n.read && n.type !== 'invite').forEach((n) => { n.read = true; seen = true; });
    if (seen) { save(); setTimeout(refreshBell, 0); }
    const rows = [
      ...L.players.map((p) => [p, 'yes']), ...L.ersatz.map((p, i) => [p, 'ersatz', i + 1]),
      ...L.open.map((p) => [p, 'open']), ...L.no.map((p) => [p, 'no']),
    ];
    const pill = (st, n) => ({ yes: '✓ dabei', ersatz: `Ersatz ${n}`, open: '○ offen', no: '✗ abgesagt' }[st]);
    const meIn = m.invitees.includes(me().id);
    const kind = KINDS[m.kind] ? KINDS[m.kind].label : '';
    const kicker = [kind !== m.title && !m.title.startsWith(kind) ? kind : '', g ? g.name : '', s ? rhythm(s) : '']
      .filter(Boolean).join(' · ');
    return `
      <header class="view-head">
        <div>${kicker ? `<p class="meet-kicker">${esc(kicker)}</p>` : ''}
          <h1>${esc(m.title)}</h1>
          <p class="muted">${esc(fmtDate(m.date, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(m.time)} Uhr · ${esc(m.place)}</p>
          ${extraTimes(m) ? `<p class="meet-times">${esc(extraTimes(m))}</p>` : ''}
          <p class="small muted">Eingeladen von ${isOrg ? 'dir' : esc(names[m.createdBy] || 'Mitglied')}</p></div>
        <a class="view-close" href="#treffen" aria-label="Zurück zur Übersicht">${ui().icon.close}</a>
      </header>
      ${m.note ? `<p class="meet-note">„${esc(m.note)}“ <span class="muted">– ${esc(firstName(names[m.createdBy]))}</span></p>` : ''}

      ${meIn && !isOrg ? myAnswer(m, r, L) : ''}

      <section class="meet-status ${L.full ? 'is-full' : ''}">
        <div><strong>${esc(statusText(m, L))}</strong>
          <small>${m.slots ? `${L.players.length} von ${m.slots}` : `${m.invitees.length} eingeladen`} · ${L.open.length} offen · ${L.no.length} abgesagt${L.ersatz.length ? ` · ${L.ersatz.length} Ersatz` : ''}</small></div>
        ${slotDots(m, L, names)}
      </section>
      ${m.slots ? '<p class="small muted meet-rule">Wer zuerst zusagt, spielt. Spätere Zusagen kommen auf die Ersatzbank und rücken automatisch nach.</p>' : ''}

      <section class="card meet-table" aria-label="Teilnehmer">
        ${rows.map(([p, st, n]) => {
          const resp = m.responses[p];
          const sub = [p === m.createdBy ? 'lädt ein' : '', resp && resp.note ? `„${resp.note}“` : '', resp && resp.by ? `eingetragen von ${resp.by === me().id ? 'dir' : firstName(names[resp.by])}` : '', resp && p !== m.createdBy ? ago(resp.at) : ''].filter(Boolean).join(' · ');
          const proxy = isOrg && p !== me().id;
          const open = proxy ? `<button type="button" class="meet-row ${st}" data-action="meet-proxy" data-id="${m.id}" data-member="${p}">` : `<div class="meet-row ${st}">`;
          return `${open}
            <span class="meet-avatar">${pics[p] ? `<img src="${esc(pics[p])}" alt="">` : esc(initials(names[p]))}</span>
            <span class="meet-who"><b>${esc(names[p] || 'Mitglied')}${p === me().id ? ' <em>du</em>' : ''}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>
            <span class="meet-pill ${st}">${pill(st, n)}</span>
          ${proxy ? '</button>' : '</div>'}`;
        }).join('')}
      </section>
      ${isOrg ? '<p class="small muted meet-rule">Tipp auf einen Namen: Antwort für jemanden eintragen, der dir im Chat oder am Platz Bescheid gegeben hat.</p>' : ''}
      ${meIn && isOrg ? myAnswer(m, r, L, true) : ''}

      <section class="meet-send">
        ${L.open.length && isOrg ? `<button type="button" class="btn block" data-action="meet-remind" data-id="${m.id}">Erinnerung an ${L.open.length === 1 ? 'den Offenen' : `die ${L.open.length} Offenen`} (ins Postfach)</button>` : ''}
        <a class="btn whatsapp-soft block" href="${esc(waLink(shareText(m)))}" target="_blank" rel="noopener">Für alle ohne App: per WhatsApp teilen</a>
        ${isOrg && s ? `<button type="button" class="btn block" data-action="meet-series" data-id="${s.id}">Regelmäßige Einladung ändern</button>` : ''}
        ${isOrg ? `<button type="button" class="link center danger-link" data-action="meet-delete" data-id="${m.id}">${s ? 'Nur diesen Termin absagen' : 'Verabredung absagen'}</button>` : ''}
      </section>
      ${ui().partnerSlot('treffen', 'Verabreden wird dir präsentiert von')}`;
  }

  function myAnswer(m, r, L, own = false) {
    const state = !r ? 'open' : r.a;
    const fullForMe = L.full && !L.players.includes(me().id);
    const yesLabel = fullForMe && state !== 'yes' ? 'Als Ersatz eintragen' : 'Bin dabei';
    return `
      <section class="card meet-my ${state === 'open' ? 'is-open' : ''}">
        ${own ? '<p class="small muted">Deine eigene Antwort</p>' : state === 'open' ? '<p class="meet-ask"><b>Bist du dabei?</b> Deine Antwort sieht der Einladende sofort in seinem Postfach.</p>' : ''}
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
  async function openCreate(kind = 'einzel', preset = {}) {
    const { openSheet, closeSheet, icon } = ui();
    const myGroups = data.groups.filter((g) => g.members.includes(me().id));
    const g0 = myGroups.find((g) => g.id === preset.groupId) || myGroups[0];
    const isTraining = kind === 'training' && g0;
    const draft = {
      kind,
      groupId: isTraining ? g0.id : null,
      title: kind === 'training' ? (g0 ? `Training ${g0.name}` : 'Training') : kind === 'frei' ? (preset.title || '') : KINDS[kind].label,
      date: isTraining ? nextWeekday(g0.weekday) : preset.date || nextWeekday(null),
      time: isTraining ? g0.time : preset.time || '18:00',
      place: isTraining ? g0.place : preset.place || 'Tennisanlage',
      note: preset.note || '',
      meetAt: preset.meetAt || '',
      departAt: preset.departAt || '',
      weekly: preset.weekly != null ? preset.weekly : kind === 'training',
      until: preset.until || '',
      leadDays: preset.leadDays || 3,
      slots: KINDS[kind].slots,
      invitees: isTraining ? g0.members.slice() : (preset.invitees || [me().id]).slice(),
    };
    if (!draft.invitees.includes(me().id)) draft.invitees.unshift(me().id);
    let names = await ui().api.memberNames(draft.invitees);

    const render = () => {
      if (!draft.until || draft.until < draft.date) draft.until = addDays(draft.date, 7 * 12);
      const rule = draft.kind === 'einzel' ? 'Die erste Zusage spielt mit dir.' : draft.kind === 'doppel' ? 'Die ersten drei Zusagen spielen mit dir.' : '';
      const firstSend = addDays(draft.date, -draft.leadDays);
      const sendDay = WD_LONG[weekdayOf(firstSend)];
      openSheet(`
        <form class="editor meet-editor" data-meet-form novalidate>
          <h2>Neue Verabredung</h2>
          <div class="seg meet-kinds">${Object.entries(KINDS).map(([k, v]) => `<button type="button" class="${k === draft.kind ? 'on' : ''}" data-kind="${k}">${v.label}</button>`).join('')}</div>
          ${draft.kind === 'training' && myGroups.length ? `
            <div class="field"><span>Gruppe</span>
              <div class="seg">${myGroups.map((g) => `<button type="button" class="${g.id === draft.groupId ? 'on' : ''}" data-group="${g.id}">${esc(g.name)}</button>`).join('')}</div>
            </div>` : ''}
          ${draft.kind === 'frei' || draft.kind === 'training' ? `<label class="field"><span>Was</span><input name="title" value="${esc(draft.title)}" placeholder="z. B. Auswärts in Hennef"></label>` : ''}
          <div class="field"><span>Wie oft?</span>
            <div class="seg meet-often">
              <button type="button" class="${draft.weekly ? '' : 'on'}" data-weekly="0">Einmalig</button>
              <button type="button" class="${draft.weekly ? 'on' : ''}" data-weekly="1">Jede Woche</button>
            </div>
          </div>
          <div class="field-row">
            <label class="field"><span>${draft.weekly ? 'Erster Termin' : 'Datum'}</span><input name="date" type="date" value="${esc(draft.date)}"></label>
            <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(draft.time)}"></label>
          </div>
          ${draft.weekly ? `
            <div class="field-row">
              <label class="field"><span>Bis einschließlich</span><input name="until" type="date" value="${esc(draft.until)}" min="${esc(draft.date)}"></label>
              <label class="field"><span>Einladung geht raus</span><select name="leadDays">${LEADS.map((n) => `<option value="${n}" ${n === draft.leadDays ? 'selected' : ''}>${n} ${n === 1 ? 'Tag' : 'Tage'} vorher</option>`).join('')}</select></label>
            </div>
            <p class="small muted meet-rule">Jede Woche ${esc(WD_LONG[weekdayOf(draft.date)])} bis ${esc(longDate(draft.until))}. Die Einladung zum jeweiligen Termin landet automatisch ${draft.leadDays} ${draft.leadDays === 1 ? 'Tag' : 'Tage'} vorher (${esc(sendDay)}) im Postfach aller Eingeladenen${firstSend <= today() ? ' – die erste sofort' : ` – die erste am ${esc(shortDate(firstSend))}`}. Jede Woche wird neu zu- oder abgesagt.</p>` : ''}
          <label class="field"><span>Wo</span><input name="place" value="${esc(draft.place)}"></label>
          ${draft.kind === 'frei' ? `<label class="field"><span>Plätze (leer = unbegrenzt)</span><input name="slots" type="number" min="2" max="40" inputmode="numeric" value="${draft.slots || ''}"></label>` : ''}
          <div class="field"><span>${draft.kind === 'einzel' || draft.kind === 'doppel' ? 'Wen fragen?' : 'Wer?'} · ${draft.invitees.length} eingeladen</span>
            ${draft.kind === 'training' && g0 && (group(draft.groupId) || {}).pending && group(draft.groupId).pending.length ? `<p class="small muted meet-rule">${group(draft.groupId).pending.length} noch unbestätigt – sie bekommen die wöchentlichen Einladungen, sobald sie die Gruppe bestätigt haben.</p>` : ''}
            ${rule ? `<p class="small muted meet-rule">${rule} Wer später zusagt, steht auf der Ersatzbank und rückt automatisch nach.</p>` : ''}
            ${draft.kind !== 'training' ? (myGroups.length
              ? `<div class="meet-quick"><span class="meet-quick-label">Gruppe fragen:</span>${myGroups.map((g) => {
                  const on = g.members.every((i) => draft.invitees.includes(i));
                  return `<button type="button" class="${on ? 'on' : ''}" data-togglegroup="${g.id}" aria-pressed="${on}">${on ? icon.check : icon.plus}<span>${esc(g.name)} · ${g.members.length}</span></button>`;
                }).join('')}</div>`
              : '<p class="small muted meet-rule">Tipp: Lege unten unter „Meine Gruppen“ eine Gruppe an – dann fragst du sie hier mit einem Tipp.</p>') : ''}
            <div class="meet-chips">${draft.invitees.map((id) => `<span class="chip">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : `<button type="button" data-remove="${id}" aria-label="Entfernen">×</button>`}</span>`).join('')}</div>
            <input name="search" autocomplete="off" placeholder="Name tippen, z. B. Klein oder anna.b">
            <div class="meet-suggest" data-suggest></div>
          </div>
          <div class="field-row">
            <label class="field"><span>Treffen um (freiwillig)</span><input name="meetAt" type="time" value="${esc(draft.meetAt)}"></label>
            <label class="field"><span>Abfahrt um (freiwillig)</span><input name="departAt" type="time" value="${esc(draft.departAt)}"></label>
          </div>
          <label class="field"><span>Notiz (freiwillig)</span><input name="note" value="${esc(draft.note)}" placeholder="${draft.kind === 'frei' ? 'z. B. Treffpunkt Parkplatz, Fahrgemeinschaften' : 'z. B. Wer hat Lust?'}"></label>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block big">${draft.weekly ? 'Regelmäßige Einladung einrichten' : 'Einladung verschicken'}</button>
        </form>`);
      const form = document.querySelector('[data-meet-form]');
      const collect = () => {
        ['title', 'date', 'time', 'place', 'note', 'until', 'meetAt', 'departAt'].forEach((k) => { if (form.elements[k]) draft[k] = form.elements[k].value.trim(); });
        if (form.elements.leadDays) draft.leadDays = Number(form.elements.leadDays.value) || 3;
        if (form.elements.slots) draft.slots = parseInt(form.elements.slots.value, 10) || null;
      };
      form.addEventListener('change', (e) => {
        if (['date', 'until', 'leadDays'].includes(e.target.name) && draft.weekly) { collect(); render(); }
      });
      form.addEventListener('click', async (e) => {
        const k = e.target.closest('[data-kind]');
        if (k) {
          collect();
          const keep = draft.kind !== 'training' ? { date: draft.date, time: draft.time, place: draft.place, note: draft.note, invitees: draft.invitees, until: draft.until, leadDays: draft.leadDays, meetAt: draft.meetAt, departAt: draft.departAt } : { date: draft.date, note: draft.note, meetAt: draft.meetAt, departAt: draft.departAt };
          openCreate(k.dataset.kind, keep);
          return;
        }
        const wk = e.target.closest('[data-weekly]');
        if (wk) { collect(); draft.weekly = wk.dataset.weekly === '1'; render(); return; }
        const gb = e.target.closest('[data-group]');
        if (gb) { openCreate('training', { groupId: gb.dataset.group }); return; }
        const rm = e.target.closest('[data-remove]');
        if (rm) { collect(); draft.invitees = draft.invitees.filter((i) => i !== rm.dataset.remove); render(); return; }
        const tg = e.target.closest('[data-togglegroup]');
        if (tg) {
          collect();
          const members = group(tg.dataset.togglegroup).members;
          if (tg.classList.contains('on')) draft.invitees = draft.invitees.filter((i) => i === me().id || !members.includes(i));
          else members.forEach((i) => { if (!draft.invitees.includes(i)) draft.invitees.push(i); });
          names = await ui().api.memberNames(draft.invitees);
          render(); return;
        }
        const add = e.target.closest('[data-add]');
        if (add) {
          collect();
          const ids = [add.dataset.add];
          ids.forEach((i) => { if (!draft.invitees.includes(i)) draft.invitees.push(i); });
          names = await ui().api.memberNames(draft.invitees);
          render();
          document.querySelector('[data-meet-form] [name=search]').focus();
        }
      });
      form.elements.search.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const first = form.querySelector('[data-suggest] [data-add]');
        if (first) first.click();
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
        if (!draft.date || draft.date < today()) { err.textContent = 'Bitte ein Datum ab heute wählen.'; return; }
        if (draft.invitees.length < 2) { err.textContent = 'Bitte mindestens eine Person einladen.'; return; }
        if (draft.slots && draft.invitees.length < draft.slots) { err.textContent = `Bitte mindestens ${draft.slots} Personen einladen (inkl. dir).`; return; }
        if (draft.weekly && (!draft.until || draft.until < draft.date)) { err.textContent = 'Das Ende muss nach dem ersten Termin liegen.'; return; }
        const base = { kind: draft.kind, groupId: draft.groupId, title: draft.title, time: draft.time, place: draft.place, note: draft.note, meetAt: draft.meetAt, departAt: draft.departAt,
          createdBy: me().id, invitees: draft.invitees, slots: draft.slots };
        let target;
        if (draft.weekly) {
          const s = { id: uid('sr-'), ...base, from: draft.date, until: draft.until, leadDays: draft.leadDays, skipped: [], createdAt: new Date().toISOString() };
          data.series.push(s);
          const made = materialize();
          made.forEach((m) => simulateReplies(m));
          target = made[0] ? '#treffen/' + made[0].id : '#treffen';
          ui().toast(made.length ? `Eingerichtet – die erste Einladung ist im Postfach von ${draft.invitees.length - 1} ${draft.invitees.length === 2 ? 'Person' : 'Personen'}` : `Eingerichtet – die erste Einladung geht am ${shortDate(addDays(draft.date, -draft.leadDays))} raus`, true);
        } else {
          const meet = { id: uid(), ...base, date: draft.date, responses: { [me().id]: ans('yes', 0) }, createdAt: new Date().toISOString() };
          data.meets.push(meet);
          notifyInvite(meet);
          simulateReplies(meet);
          target = '#treffen/' + meet.id;
          ui().toast(`Einladung im Postfach von ${draft.invitees.length - 1} ${draft.invitees.length === 2 ? 'Person' : 'Personen'}`, true);
        }
        save();
        closeSheet();
        location.hash = target;
        ui().renderView();
      });
    };
    render();
  }

  // ---------- Regelmäßige Einladung ändern oder beenden (nur der Einladende) ----------
  async function openSeries(seriesId) {
    const { openSheet, closeSheet } = ui();
    const s = seriesById(seriesId);
    if (!s) return;
    const names = await ui().api.memberNames(s.invitees);
    const nx = nextSend(s);
    openSheet(`
      <form class="editor meet-editor" data-series-form novalidate>
        <h2>${esc(s.title)}</h2>
        <p class="small muted">${esc(rhythm(s))} · ${esc(s.time)} Uhr · ${esc(s.place)}<br>
          ${nx ? `Nächste Einladung ${esc(sendText(nx.send))} für ${esc(shortDate(nx.date))}` : 'Alle Termine sind verschickt'}<br>
          Eingeladen: ${esc(s.invitees.map((i) => firstName(names[i])).join(', '))}</p>
        <div class="field-row">
          <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(s.time)}"></label>
          <label class="field"><span>Bis einschließlich</span><input name="until" type="date" value="${esc(s.until)}" min="${esc(today())}"></label>
        </div>
        <label class="field"><span>Wo</span><input name="place" value="${esc(s.place)}"></label>
        <label class="field"><span>Einladung geht raus</span><select name="leadDays">${LEADS.map((n) => `<option value="${n}" ${n === s.leadDays ? 'selected' : ''}>${n} ${n === 1 ? 'Tag' : 'Tage'} vorher</option>`).join('')}</select></label>
        <p class="small muted meet-rule">Änderungen gelten für alle Termine, deren Einladung noch nicht verschickt ist.</p>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn primary block big">Speichern</button>
        <button type="button" class="link center danger-link" data-end>Regelmäßige Einladung beenden</button>
      </form>`);
    const form = document.querySelector('[data-series-form]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const until = form.elements.until.value;
      if (!until) { form.querySelector('.form-error').textContent = 'Bitte ein Enddatum wählen.'; return; }
      Object.assign(s, { time: form.elements.time.value, place: form.elements.place.value.trim() || s.place, until, leadDays: Number(form.elements.leadDays.value) || s.leadDays });
      materialize().forEach((m) => simulateReplies(m));
      save(); closeSheet(); refreshBell(); ui().toast('Regelmäßige Einladung gespeichert', true); ui().renderView();
    });
    form.querySelector('[data-end]').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'Wirklich beenden? Kommende Termine werden abgesagt – nochmal tippen'; return; }
      data.series = data.series.filter((x) => x.id !== s.id);
      data.meets.filter((m) => m.seriesId === s.id && m.date >= today()).forEach((m) => {
        m.invitees.filter((p) => p !== m.createdBy).forEach((p) => note(p, 'cancel', m, m.createdBy));
      });
      data.meets = data.meets.filter((m) => !(m.seriesId === s.id && m.date >= today()));
      save(); closeSheet(); ui().toast('Beendet – alle Eingeladenen haben es im Postfach', true);
      location.hash = '#treffen'; ui().renderView();
    });
  }

  // ---------- Postfach ----------
  async function openInbox() {
    const { openSheet, closeSheet } = ui();
    const items = myInbox().slice(0, 60);
    const names = await ui().api.memberNames([...new Set(items.map((n) => n.from).filter(Boolean))]);
    const who = (n) => firstName(names[n.from]);
    const when = (n) => `${shortDate(n.snap.date)}, ${n.snap.time} Uhr`;
    const text = (n) => ({
      invite: `<b>${esc(who(n))}</b> lädt dich ein: ${esc(n.snap.title)}`,
      yes: `<b>${esc(who(n))}</b> hat zugesagt · ${esc(n.extra.count || '')}`,
      ersatz: `<b>${esc(who(n))}</b> steht auf der Ersatzbank`,
      no: `<b>${esc(who(n))}</b> hat abgesagt · ${esc(n.extra.count || '')}`,
      full: `<b>${esc(n.snap.title)} steht!</b> Alle Plätze sind vergeben`,
      moved: '<b>Du bist nachgerückt</b> – du spielst',
      cancel: `<b>${esc(who(n))}</b> hat abgesagt: ${esc(n.snap.title)}`,
      remind: `<b>Erinnerung von ${esc(who(n))}:</b> bitte zu- oder absagen`,
      'group-invite': `<b>${esc(who(n))}</b> hat dich zur Gruppe „${esc(n.snap.title)}“ hinzugefügt`,
      'group-yes': `<b>${esc(who(n))}</b> ist jetzt in „${esc(n.snap.title)}“`,
      'group-no': `<b>${esc(who(n))}</b> möchte nicht in „${esc(n.snap.title)}“`,
      'group-left': `<b>${esc(who(n))}</b> hat „${esc(n.snap.title)}“ verlassen`,
      'group-complete': `<b>Alle haben bestätigt:</b> „${esc(n.snap.title)}“ ist komplett`,
    }[n.type] || esc(n.snap.title));
    const pending = (n) => {
      if (n.type === 'group-invite') { const g = group(n.groupId); return Boolean(g && (g.pending || []).includes(me().id)); }
      if (n.type !== 'invite' && n.type !== 'remind') return false;
      const m = meetById(n.meetId);
      return Boolean(m && !m.responses[me().id]);
    };
    openSheet(`
      <div class="editor inbox-sheet">
        <h2>Postfach</h2>
        <p class="small muted">Einladungen und Antworten zu deinen Verabredungen. Chat und Insider News stehen bewusst nicht hier – dort schaut jeder selbst rein.</p>
        ${items.length ? `<div class="inbox-list">${items.map((n) => {
          const isGroup = n.type.startsWith('group-');
          const gone = isGroup ? !group(n.groupId) : !meetById(n.meetId);
          const tag = pending(n) ? `<span class="meet-mine open">${isGroup ? 'Bestätigen' : 'Antworten'}</span>` : '';
          return `<button type="button" class="inbox-item ${n.read ? '' : 'unread'} ${gone ? 'gone' : ''}" data-open="${esc(n.id)}">
            <span class="inbox-dot" aria-hidden="true"></span>
            <span class="inbox-text"><span>${text(n)}</span><small>${esc(isGroup ? 'Gruppe' : n.type === 'invite' || n.type === 'remind' || n.type === 'cancel' ? when(n) : `${n.snap.title} · ${when(n)}`)}${n.extra && n.extra.note ? ` · „${esc(n.extra.note)}“` : ''} · ${esc(ago(n.at))}</small></span>
            ${tag}
          </button>`;
        }).join('')}</div>` : '<p class="muted">Noch nichts da. Sobald dich jemand einlädt oder auf deine Einladung antwortet, steht es hier.</p>'}
        ${unread() ? '<button type="button" class="link center" data-allread>Alle als gelesen markieren</button>' : ''}
      </div>`);
    const root = document.querySelector('.inbox-sheet');
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-allread]')) {
        myInbox().forEach((n) => { n.read = true; });
        save(); refreshBell(); openInbox(); return;
      }
      const it = e.target.closest('[data-open]');
      if (!it) return;
      const n = data.inbox.find((x) => x.id === it.dataset.open);
      if (!n) return;
      if (!(n.type === 'invite' || n.type === 'group-invite') || !pending(n)) n.read = true;
      save(); refreshBell(); closeSheet();
      if (n.type === 'group-invite' && pending(n)) { if (!location.hash.startsWith('#treffen')) location.hash = '#treffen'; setTimeout(() => openGroupAnswer(n.groupId), 50); return; }
      if (n.type.startsWith('group-')) { location.hash = '#treffen'; return; }
      if (meetById(n.meetId)) location.hash = '#treffen/' + n.meetId;
      else ui().toast('Diese Verabredung gibt es nicht mehr.');
    });
  }

  // ---------- Gruppen ----------
  // Ersteller legt an und fügt Leute hinzu → sie stehen als „unbestätigt“ in der Gruppe und bekommen
  // eine Einladung ins Postfach. Erst nach „Bestätigen“ erscheint die Gruppe bei ihnen unter „Meine Gruppen“.
  async function openGroup(groupId) {
    const { openSheet, closeSheet, icon } = ui();
    const g = groupId ? group(groupId) : null;
    if (g && g.createdBy !== me().id) return openGroupInfo(g);
    const draft = g ? { ...g, members: g.members.slice(), pending: (g.pending || []).slice() }
      : { id: 'g-' + Date.now().toString(36), name: '', members: [me().id], pending: [], createdBy: me().id, weekday: 2, time: '19:00', place: 'Tennisanlage' };
    const everyone = () => [...draft.members, ...draft.pending];
    let names = await ui().api.memberNames(everyone());
    const render = () => {
      openSheet(`
        <form class="editor meet-editor" data-group-form novalidate>
          <h2>${g ? 'Gruppe' : 'Neue Gruppe'}</h2>
          <label class="field"><span>Name</span><input name="name" value="${esc(draft.name)}" placeholder="z. B. Herren 40 oder Damen 30 Mannschaft"></label>
          <div class="field-row">
            <label class="field"><span>Trainingstag</span><select name="weekday">${WD.map((w, i) => `<option value="${i}" ${i === draft.weekday ? 'selected' : ''}>${w}</option>`).join('')}</select></label>
            <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(draft.time)}"></label>
          </div>
          <label class="field"><span>Wo</span><input name="place" value="${esc(draft.place)}"></label>
          <div class="field"><span>Mitglieder · ${draft.members.length} bestätigt${draft.pending.length ? ` · ${draft.pending.length} unbestätigt` : ''}</span>
            <div class="meet-chips">${everyone().map((id) => `<span class="chip ${draft.pending.includes(id) ? 'pending' : ''}">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : `${draft.pending.includes(id) ? ' <em>unbestätigt</em>' : ''}<button type="button" data-remove="${id}" aria-label="Entfernen">×</button>`}</span>`).join('')}</div>
            <input name="search" autocomplete="off" placeholder="Name tippen">
            <div class="meet-suggest" data-suggest></div>
            <p class="small muted meet-rule">Neu Hinzugefügte bekommen beim Speichern eine Einladung ins Postfach und bestätigen dort. Erst dann erscheint die Gruppe bei ihnen.</p>
          </div>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block big">${g ? 'Speichern' : 'Gruppe anlegen und einladen'}</button>
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
        if (rm) {
          collect();
          draft.members = draft.members.filter((i) => i !== rm.dataset.remove);
          draft.pending = draft.pending.filter((i) => i !== rm.dataset.remove);
          render(); return;
        }
        const add = e.target.closest('[data-add]');
        if (add) {
          collect();
          if (!everyone().includes(add.dataset.add)) draft.pending.push(add.dataset.add);
          names = await ui().api.memberNames(everyone());
          render();
          document.querySelector('[data-group-form] [name=search]').focus();
        }
      });
      form.elements.search.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const first = form.querySelector('[data-suggest] [data-add]');
        if (first) first.click();
      });
      form.elements.search.addEventListener('input', async (e) => {
        const hits = await ui().api.searchMembers(e.target.value);
        form.querySelector('[data-suggest]').innerHTML = hits
          .filter((h) => !everyone().includes(h.id))
          .map((h) => `<button type="button" data-add="${h.id}">${icon.plus}<span>${esc(h.firstName)} ${esc(h.lastName)}</span></button>`).join('');
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        collect();
        if (!draft.name) { form.querySelector('.form-error').textContent = 'Bitte einen Namen eingeben.'; return; }
        const before = g ? [...g.members, ...(g.pending || [])] : [];
        const fresh = draft.pending.filter((id) => !before.includes(id));
        let target = g;
        if (g) Object.assign(g, draft); else { data.groups.push(draft); target = draft; }
        fresh.forEach((id) => groupNote(id, 'group-invite', target, me().id));
        save(); closeSheet();
        ui().toast(fresh.length ? `Gespeichert – ${fresh.length} ${fresh.length === 1 ? 'Einladung' : 'Einladungen'} im Postfach verschickt` : 'Gruppe gespeichert', true);
        simulateGroupReplies(target, fresh);
        ui().renderView();
      });
    };
    render();
  }

  // Gruppe ansehen (Mitglied, nicht Ersteller) – mit „Gruppe verlassen“
  async function openGroupInfo(g) {
    const { openSheet, closeSheet } = ui();
    const names = await ui().api.memberNames([...g.members, ...(g.pending || []), g.createdBy]);
    openSheet(`
      <div class="editor meet-editor" data-group-info>
        <h2>${esc(g.name)}</h2>
        <p class="small muted">Angelegt von ${esc(names[g.createdBy] || 'Mitglied')}${g.weekday != null ? ` · Training ${WD_LONG[g.weekday]} ${esc(g.time)} Uhr` : ''} · ${esc(g.place || '')}</p>
        <div class="meet-chips">${[...g.members, ...(g.pending || [])].map((id) => `<span class="chip ${(g.pending || []).includes(id) ? 'pending' : ''}">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : ''}${(g.pending || []).includes(id) ? ' <em>unbestätigt</em>' : ''}</span>`).join('')}</div>
        ${g.members.includes(me().id) ? '<button type="button" class="link center danger-link" data-leave>Gruppe verlassen</button>' : ''}
      </div>`);
    const leave = document.querySelector('[data-group-info] [data-leave]');
    if (leave) leave.addEventListener('click', () => {
      if (!leave.dataset.armed) { leave.dataset.armed = '1'; leave.textContent = 'Wirklich verlassen? Nochmal tippen'; return; }
      g.members = g.members.filter((i) => i !== me().id);
      groupNote(g.createdBy, 'group-left', g, me().id);
      save(); closeSheet(); ui().toast('Du hast die Gruppe verlassen', true); ui().renderView();
    });
  }

  // Einladung in eine Gruppe beantworten
  async function openGroupAnswer(groupId) {
    const { openSheet, closeSheet } = ui();
    const g = group(groupId);
    if (!g || !(g.pending || []).includes(me().id)) { ui().toast('Diese Gruppen-Einladung ist erledigt.'); return; }
    const names = await ui().api.memberNames([...g.members, g.createdBy]);
    openSheet(`
      <div class="editor meet-editor" data-group-answer>
        <p class="meet-kicker">Einladung in eine Gruppe</p>
        <h2>${esc(g.name)}</h2>
        <p class="small muted">${esc(names[g.createdBy] || 'Jemand')} hat dich hinzugefügt${g.weekday != null ? ` · Training ${WD_LONG[g.weekday]} ${esc(g.time)} Uhr` : ''}.<br>Schon dabei: ${esc(g.members.map((i) => firstName(names[i])).join(', '))}</p>
        <p class="small">Mit „Bestätigen“ erscheint die Gruppe unter „Meine Gruppen“, und du bekommst ihre Trainings-Einladungen.</p>
        <div class="meet-answer">
          <button type="button" data-g="yes">Bestätigen</button>
          <button type="button" data-g="no">Nein danke</button>
        </div>
      </div>`);
    document.querySelector('[data-group-answer]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]');
      if (!b) return;
      answerGroup(g, me().id, b.dataset.g === 'yes');
      closeSheet(); refreshBell();
      ui().toast(b.dataset.g === 'yes' ? `Willkommen in „${g.name}“` : 'Abgelehnt – der Ersteller weiß Bescheid', true);
      ui().renderView();
    });
  }
  function answerGroup(g, id, yes) {
    g.pending = (g.pending || []).filter((i) => i !== id);
    if (yes && !g.members.includes(id)) g.members.push(id);
    groupNote(g.createdBy, yes ? 'group-yes' : 'group-no', g, id);
    if (yes && !g.pending.length) groupNote(g.createdBy, 'group-complete', g, null);
    save();
  }
  // Vorführung: Hinzugefügte bestätigen nach ein paar Sekunden von selbst (meist ja).
  function simulateGroupReplies(g, ids) {
    ids.filter((id) => id !== me().id).forEach((id, i) => {
      setTimeout(() => {
        const cur = group(g.id);
        if (!cur || !(cur.pending || []).includes(id)) return;
        answerGroup(cur, id, Math.random() < 0.85);
        rerender();
      }, 3000 + i * 2500 + Math.random() * 1500);
    });
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
    document.querySelector('.meet-proxy').addEventListener('click', (e) => {
      const b = e.target.closest('[data-set]');
      if (!b) return;
      setAnswer(m, memberId, b.dataset.set || null, '', me().id);
      closeSheet();
      ui().renderView();
    });
  }

  // ---------- Aktionen ----------
  Object.assign(TFB.actions, {
    inbox: () => openInbox(),
    'meet-new': (el) => openCreate(el.dataset.kind || 'einzel'),
    'meet-group': (el) => openGroup(el.dataset.id),
    'group-answer': (el) => openGroupAnswer(el.dataset.id),
    'meet-series': (el) => openSeries(el.dataset.id),
    'meet-proxy': (el) => openProxy(meetById(el.dataset.id), el.dataset.member),
    'meet-answer': (el) => {
      const m = meetById(el.dataset.id);
      if (!m) return;
      const a = el.dataset.answer;
      const prev = m.responses[me().id];
      const L = setAnswer(m, me().id, a, prev ? prev.note : '');
      if (a === 'yes') {
        const clash = data.meets.find((x) => x.id !== m.id && x.date === m.date && x.time === m.time && x.responses[me().id] && x.responses[me().id].a === 'yes');
        if (clash) ui().toast(`Achtung: Um ${m.time} hast du schon bei „${clash.title}“ zugesagt`);
        else ui().toast(L.ersatz.includes(me().id) ? `Du bist Ersatz ${L.ersatz.indexOf(me().id) + 1} – du rückst automatisch nach` : 'Super – du bist dabei', true);
      } else ui().toast('Abgesagt – danke fürs Bescheid geben', true);
      refreshBell();
      ui().renderView();
    },
    'meet-remind': async (el) => {
      const m = meetById(el.dataset.id);
      const L = lineup(m);
      const names = await ui().api.memberNames(L.open);
      L.open.forEach((p) => note(p, 'remind', m, me().id));
      save();
      ui().toast(`Erinnerung im Postfach von ${L.open.map((i) => firstName(names[i])).join(', ')}`, true);
      simulateReplies(m, 2);
    },
    'meet-delete': (el) => {
      if (!el.dataset.armed) { el.dataset.armed = '1'; el.textContent = 'Wirklich? Nochmal tippen – alle bekommen es ins Postfach'; return; }
      const m = meetById(el.dataset.id);
      if (!m) return;
      const s = m.seriesId && seriesById(m.seriesId);
      if (s) s.skipped = [...(s.skipped || []), m.date];
      m.invitees.filter((p) => p !== m.createdBy).forEach((p) => note(p, 'cancel', m, m.createdBy));
      data.meets = data.meets.filter((x) => x.id !== m.id);
      save();
      ui().toast('Abgesagt – alle Eingeladenen haben es im Postfach', true);
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
