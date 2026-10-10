// TFB – „Treffen“: Einladungen mit Zusage, verschickt über WhatsApp (Vorführung).
//
// Bewusst eigenständig, damit es sich schnell wieder entfernen lässt:
//   - Abschalten: in config.js  features: { treffen: false }
//   - Entfernen:  diese Datei + <script> in index.html + Abschnitt „Treffen“ in app.css
// Daten liegen im Demo-Modus in einem eigenen Speicher (localStorage: tfb_meet_demo_v1).
//
// Ablauf: Einladung anlegen (Vorlage = ein Tipp) → „Per WhatsApp senden“ öffnet WhatsApp
// mit fertigem Text + Link → Mitglieder tippen den Link und sagen mit einem Tipp zu/ab
// → alle sehen die Übersicht. In WhatsApp wird nichts ausgefüllt.
(function () {
  if (!(TFB.config.features && TFB.config.features.treffen)) return;
  TFB.views = TFB.views || {};
  TFB.actions = TFB.actions || {};
  const ui = () => TFB.ui;
  const esc = (s) => ui().esc(s);

  const KEY = 'tfb_meet_demo_v1';
  const DAY = 864e5;
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  // Vorlagen: ein Tipp, und Termin, Uhrzeit und Ort stehen drin (nächster passender Wochentag).
  const TEMPLATES = [
    { id: 't-h40', title: 'Training Herren 40', weekday: 2, time: '19:00', place: 'Platz 1–2', group: ['m2', 'm6', 'm8', 'm10', 'm12', 'm14', 'm16'] },
    { id: 't-doppel', title: 'Doppel-Runde', weekday: 0, time: '10:00', place: 'Platz 3', group: ['m4', 'm9', 'm18'] },
    { id: 't-spiel', title: 'Spiel', weekday: null, time: '18:00', place: 'Tennisanlage', group: [] },
  ];

  // ---------- Speicher ----------
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } };
  const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} };
  let data = load();
  const isoDay = (d) => d.toISOString().slice(0, 10);
  const nextWeekday = (wd) => {
    const d = new Date();
    if (wd == null) return isoDay(new Date(d.getTime() + DAY));
    const add = ((wd - d.getDay()) + 7) % 7 || 7;
    return isoDay(new Date(d.getTime() + add * DAY));
  };
  if (!data) {
    // Beispiel: eine laufende Trainingseinladung mit ersten Antworten
    data = {
      phones: {},
      meets: [{
        id: 'mt-' + Date.now().toString(36), title: 'Training Herren 40', date: nextWeekday(2), time: '19:00', place: 'Platz 1–2',
        note: '', createdBy: 'm2', invitees: ['m-demo', 'm2', 'm6', 'm8', 'm10', 'm12', 'm14', 'm16'],
        responses: { m2: 'yes', m6: 'yes', m10: 'no', m14: 'yes' }, createdAt: new Date().toISOString(),
      }],
    };
    save(data);
  }

  const me = () => ui().state.member;
  const fmtDate = (iso, opts) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', { timeZone: 'UTC', ...opts }); };
  const shortDate = (iso) => fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'numeric' }).replace(',', '');
  const linkFor = (id) => {
    const base = /^https?:/.test(location.protocol) ? location.origin + location.pathname : TFB.config.publicUrl + '/';
    return `${base}#treffen/${id}`;
  };
  const shareText = (m, reminder = false) =>
    `${reminder ? 'Erinnerung: ' : ''}🎾 ${m.title} · ${shortDate(m.date)}, ${m.time} · ${m.place}\n`
    + `${m.note ? m.note + '\n' : ''}Bitte zu- oder absagen: ${linkFor(m.id)}`;
  const waLink = (text, phone) => `https://wa.me/${phone ? phone.replace(/[^\d]/g, '').replace(/^0/, '49') : ''}?text=${encodeURIComponent(text)}`;
  const counts = (m) => {
    const vals = m.invitees.map((id) => m.responses[id]);
    return { yes: vals.filter((v) => v === 'yes').length, no: vals.filter((v) => v === 'no').length, open: vals.filter((v) => !v).length };
  };

  // Vorführung: Eingeladene antworten nach ein paar Sekunden von selbst.
  function simulateReplies(meet) {
    meet.invitees.filter((id) => id !== me().id).forEach((id, i) => {
      setTimeout(() => {
        const cur = data.meets.find((x) => x.id === meet.id);
        if (!cur || cur.responses[id]) return;
        cur.responses[id] = Math.random() < .75 ? 'yes' : 'no';
        save(data);
        if (location.hash.startsWith('#treffen') && !document.querySelector('#sheet-root .sheet')) ui().renderView();
      }, 2500 + i * 1800 + Math.random() * 1500);
    });
  }


  // ---------- Ansichten ----------
  async function view() {
    const { state, icon } = ui();
    if (!state.member) {
      return `
        ${ui().viewHead('Treffen', 'Einladen, zusagen, fertig.', false)}
        <section class="card meet-login"><p>Zum Einladen und Zusagen bitte einmal anmelden – danach bleibt dein Handy angemeldet.</p>
        <button type="button" class="btn primary" data-action="login">Anmelden</button></section>`;
    }
    const id = location.hash.split('/')[1];
    if (id) return detail(id);
    const list = data.meets.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const upcoming = list.filter((m) => m.date >= isoDay(new Date()));
    return `
      ${ui().viewHead('Treffen', 'Einladen, zusagen, fertig.', false)}
      <section class="meet-start">
        <button type="button" class="btn primary block big" data-action="meet-new">${icon.plus} Einladung erstellen</button>
        <div class="meet-templates">
          ${TEMPLATES.filter((t) => t.weekday != null).map((t) => `
            <button type="button" class="meet-template" data-action="meet-new" data-template="${t.id}">
              <strong>${esc(t.title)}</strong><span>${WD[t.weekday]} ${esc(t.time)} · ${esc(t.place)}</span>
            </button>`).join('')}
        </div>
      </section>
      <h2 class="block-heading">Einladungen</h2>
      ${upcoming.length ? `<div class="meet-list">${upcoming.map(card).join('')}</div>` : '<p class="muted">Noch keine Einladungen.</p>'}
      ${phoneCard()}
      <p class="fineprint">Vorführung: Antworten der anderen kommen hier nach ein paar Sekunden von selbst. Der Link in WhatsApp funktioniert, sobald die App veröffentlicht ist.</p>`;
  }

  function card(m) {
    const c = counts(m);
    const mine = m.responses[me().id];
    return `
      <article class="card meet-card">
        <a class="meet-card-main" href="#treffen/${m.id}">
          <span class="date-badge"><small>${esc(fmtDate(m.date, { weekday: 'short' }))}</small><b>${esc(fmtDate(m.date, { day: 'numeric' }))}</b><small>${esc(fmtDate(m.date, { month: 'short' }).replace('.', ''))}</small></span>
          <span class="meet-card-text"><strong>${esc(m.title)}</strong><small>${esc(m.time)} Uhr · ${esc(m.place)}</small>
            <span class="meet-counts"><b class="yes">${c.yes} dabei</b> · ${c.no} abgesagt · ${c.open} offen</span></span>
        </a>
        ${m.invitees.includes(me().id) ? answerButtons(m, mine) : ''}
      </article>`;
  }
  const answerButtons = (m, mine) => `
    <div class="meet-answer">
      <button type="button" class="${mine === 'yes' ? 'on yes' : ''}" data-action="meet-answer" data-id="${m.id}" data-answer="yes">Bin dabei</button>
      <button type="button" class="${mine === 'no' ? 'on no' : ''}" data-action="meet-answer" data-id="${m.id}" data-answer="no">Kann nicht</button>
    </div>`;

  async function detail(id) {
    const m = data.meets.find((x) => x.id === id);
    if (!m) return `${ui().viewHead('Treffen', 'Diese Einladung gibt es nicht mehr.')}`;
    const names = await ui().api.memberNames(m.invitees.concat(m.createdBy));
    const c = counts(m);
    const group = (val) => m.invitees.filter((i) => (val ? m.responses[i] === val : !m.responses[i]));
    const people = (ids) => ids.map((i) => `<li>${esc(names[i] || 'Mitglied')}${i === me().id ? ' <em>du</em>' : ''}</li>`).join('');
    const myPhone = data.phones[me().id];
    return `
      <header class="view-head">
        <div><h1>${esc(m.title)}</h1><p class="muted">${esc(fmtDate(m.date, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(m.time)} Uhr · ${esc(m.place)}</p></div>
        <a class="view-close" href="#treffen" aria-label="Zurück zur Übersicht">${ui().icon.close}</a>
      </header>
      ${m.note ? `<p>${esc(m.note)}</p>` : ''}
      ${m.invitees.includes(me().id) ? `<section class="card meet-my">${answerButtons(m, m.responses[me().id])}</section>` : ''}
      <section class="meet-tally">
        <div class="card"><h3>Dabei · ${c.yes}</h3><ul>${people(group('yes')) || '<li class="muted">noch niemand</li>'}</ul></div>
        <div class="card"><h3>Abgesagt · ${c.no}</h3><ul>${people(group('no')) || '<li class="muted">–</li>'}</ul></div>
        <div class="card"><h3>Noch offen · ${c.open}</h3><ul>${people(group(null)) || '<li class="muted">alle haben geantwortet</li>'}</ul></div>
      </section>
      <section class="meet-send">
        <a class="btn whatsapp block" href="${esc(waLink(shareText(m)))}" target="_blank" rel="noopener">Per WhatsApp senden</a>
        ${myPhone && m.invitees.includes(me().id) ? `<a class="btn block" href="${esc(waLink(shareText(m), myPhone))}" target="_blank" rel="noopener">Direkt an mich (${esc(myPhone)})</a>` : ''}
        ${c.open ? `<a class="btn block" href="${esc(waLink(shareText(m, true)))}" target="_blank" rel="noopener">Erinnerung an die Offenen</a>` : ''}
        <button type="button" class="link center" data-action="meet-copy" data-id="${m.id}">Link kopieren</button>
        ${m.createdBy === me().id ? `<button type="button" class="link center danger-link" data-action="meet-delete" data-id="${m.id}">Einladung löschen</button>` : ''}
      </section>`;
  }

  function phoneCard() {
    const phone = data.phones[me().id] || '';
    return `
      <section class="card soft meet-phone">
        <strong>Deine Handynummer für WhatsApp (freiwillig)</strong>
        <p class="small muted">Damit dich Einladende direkt in WhatsApp anschreiben können. Andere Mitglieder sehen sie nicht.</p>
        <form data-meet-phone class="meet-phone-row">
          <input name="phone" type="tel" inputmode="tel" value="${esc(phone)}" placeholder="z. B. 0170 1234567">
          <button type="submit" class="btn">Speichern</button>
        </form>
      </section>`;
  }

  // ---------- Einladung erstellen (so einfach wie möglich) ----------
  async function openCreate(templateId) {
    const { openSheet, closeSheet, icon } = ui();
    const t = TEMPLATES.find((x) => x.id === templateId) || TEMPLATES[2];
    const draft = { title: t.id === 't-spiel' ? '' : t.title, date: nextWeekday(t.weekday), time: t.time, place: t.place, note: '', invitees: [me().id, ...t.group.filter((g) => g !== me().id)] };
    let names = await ui().api.memberNames(draft.invitees);

    const render = () => {
      openSheet(`
        <form class="editor meet-editor" data-meet-form novalidate>
          <h2>Einladung</h2>
          <div class="seg meet-kinds">${TEMPLATES.map((x) => `<button type="button" class="${x.id === t.id ? 'on' : ''}" data-template="${x.id}">${esc(x.title)}</button>`).join('')}</div>
          <label class="field"><span>Was</span><input name="title" value="${esc(draft.title)}" placeholder="z. B. Spiel gegen Hennef"></label>
          <div class="field-row">
            <label class="field"><span>Datum</span><input name="date" type="date" value="${esc(draft.date)}"></label>
            <label class="field"><span>Uhrzeit</span><input name="time" type="time" value="${esc(draft.time)}"></label>
          </div>
          <label class="field"><span>Wo</span><input name="place" value="${esc(draft.place)}"></label>
          <div class="field"><span>Wer (Namen tippen)</span>
            <div class="meet-chips">${draft.invitees.map((id) => `<span class="chip">${esc(names[id] || 'Mitglied')}${id === me().id ? ' (du)' : ''}<button type="button" data-remove="${id}" aria-label="Entfernen">×</button></span>`).join('')}</div>
            <input name="search" autocomplete="off" placeholder="z. B. Klein, Anna oder anna.klein">
            <div class="meet-suggest" data-suggest></div>
          </div>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block big">Einladung erstellen</button>
        </form>`);
      const form = document.querySelector('[data-meet-form]');
      const collect = () => ['title', 'date', 'time', 'place'].forEach((k) => { draft[k] = form.elements[k].value.trim(); });
      form.addEventListener('click', async (e) => {
        const tpl = e.target.closest('[data-template]');
        if (tpl) { collect(); closeSheet(); openCreate(tpl.dataset.template); return; }
        const rm = e.target.closest('[data-remove]');
        if (rm) { collect(); draft.invitees = draft.invitees.filter((i) => i !== rm.dataset.remove); render(); return; }
        const add = e.target.closest('[data-add]');
        if (add) {
          collect();
          if (!draft.invitees.includes(add.dataset.add)) draft.invitees.push(add.dataset.add);
          names = await ui().api.memberNames(draft.invitees);
          render();
          document.querySelector('[data-meet-form] [name=search]').focus();
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
        if (!draft.title) { form.querySelector('.form-error').textContent = 'Bitte kurz eintragen, worum es geht.'; return; }
        const meet = { id: 'mt-' + Date.now().toString(36), ...draft, createdBy: me().id, responses: { [me().id]: 'yes' }, createdAt: new Date().toISOString() };
        delete meet.search;
        data.meets.push(meet);
        save(data);
        closeSheet();
        // Erst zur Einladung wechseln (der Seitenwechsel schließt offene Fenster), dann das Senden-Fenster zeigen.
        window.addEventListener('hashchange', () => setTimeout(() => openShare(meet), 150), { once: true });
        location.hash = '#treffen/' + meet.id;
        simulateReplies(meet);
      });
    };
    render();
  }

  // Direkt nach dem Erstellen: ein großer Knopf zum Senden
  function openShare(m) {
    const { openSheet } = ui();
    const myPhone = data.phones[me().id];
    openSheet(`
      <div class="editor meet-share">
        <h2>Einladung steht – jetzt senden</h2>
        <div class="meet-preview">${esc(shareText(m)).replace(/\n/g, '<br>')}</div>
        <a class="btn whatsapp block big" href="${esc(waLink(shareText(m)))}" target="_blank" rel="noopener" data-action="close-sheet">Per WhatsApp senden</a>
        ${myPhone ? `<a class="btn block" href="${esc(waLink(shareText(m), myPhone))}" target="_blank" rel="noopener" data-action="close-sheet">Testweise direkt an mich</a>` : ''}
        <p class="small muted">WhatsApp öffnet sich mit dem fertigen Text. Gruppe oder Person auswählen, senden – fertig.</p>
      </div>`);
  }

  // ---------- Aktionen ----------
  Object.assign(TFB.actions, {
    'meet-new': (el) => openCreate(el.dataset.template),
    'meet-answer': (el) => {
      const m = data.meets.find((x) => x.id === el.dataset.id);
      if (!m) return;
      m.responses[me().id] = el.dataset.answer;
      save(data);
      ui().toast(el.dataset.answer === 'yes' ? 'Super – du bist dabei' : 'Abgesagt', true);
      ui().renderView();
    },
    'meet-copy': async (el) => {
      try { await navigator.clipboard.writeText(shareText(data.meets.find((x) => x.id === el.dataset.id))); ui().toast('Text mit Link kopiert', true); }
      catch (_) { ui().toast('Kopieren hat nicht geklappt'); }
    },
    'meet-delete': (el) => {
      if (!el.dataset.armed) { el.dataset.armed = '1'; el.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
      data.meets = data.meets.filter((x) => x.id !== el.dataset.id);
      save(data);
      location.hash = '#treffen';
    },
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-meet-phone]');
    if (!f) return;
    e.preventDefault();
    const v = f.elements.phone.value.trim();
    if (v && !/^[+\d][\d\s/-]{5,}$/.test(v)) { ui().toast('Bitte eine gültige Handynummer eingeben'); return; }
    data.phones[me().id] = v;
    save(data);
    ui().toast(v ? 'Nummer gespeichert' : 'Nummer entfernt', true);
    ui().renderView();
  });

  TFB.views.treffen = view;
})();
