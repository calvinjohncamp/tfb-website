// TFB-Website – Seiten "Aktuell", "Sport", "Verein" aus Bausteinen.
// Darstellung und Bearbeitung direkt auf der Seite (wie "Kiosk bearbeiten").
// Nutzt die gemeinsamen Helfer aus app.js über TFB.ui (erst beim Rendern verfügbar).
(function () {
  TFB.views = TFB.views || {};
  TFB.actions = TFB.actions || {};

  let site = null;          // Seiteninhalte
  let images = {};          // hochgeladene Fotos: { "img:<id>": dataUrl }
  let imagesLoaded = false;
  let editing = null;       // Seite, die gerade bearbeitet wird
  const ui = () => TFB.ui;

  const BLOCK_TYPES = [
    ['post', 'Beitrag', 'Foto, Datum, Überschrift und Text'],
    ['event', 'Termin', 'Datum, Uhrzeit, Ort'],
    ['text', 'Text', 'Überschrift und Absätze'],
    ['heading', 'Zwischenüberschrift', 'gliedert die Seite'],
    ['image', 'Foto', 'ein Bild mit Bildunterschrift'],
    ['gallery', 'Galerie', 'mehrere Fotos, groß ansehbar'],
    ['people', 'Ansprechpartner', 'Rolle und Name'],
    ['facts', 'Zahlen', 'drei große Kennzahlen'],
    ['button', 'Knopf', 'Link zu einer Seite oder Website'],
    ['teams', 'Mannschaften', 'automatisch aus nuLiga'],
  ];

  async function ensure() {
    if (!site) site = await ui().api.site();
    if (!imagesLoaded) { images = await ui().api.images(); imagesLoaded = true; }
  }

  // ---------- Formatierung ----------
  const esc = (s) => ui().esc(s);
  const paragraphs = (text) => String(text || '').split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const parseDate = (iso) => { const [y, m, d] = String(iso || '').split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)) : null; };
  const fmt = (iso, opts) => { const d = parseDate(iso); return d ? d.toLocaleDateString('de-DE', { timeZone: 'UTC', ...opts }) : ''; };
  const dateBadge = (iso) => `
    <span class="date-badge" aria-hidden="true">
      <small>${esc(fmt(iso, { weekday: 'short' }))}</small>
      <b>${esc(fmt(iso, { day: 'numeric' }))}</b>
      <small>${esc(fmt(iso, { month: 'short' }).replace('.', ''))}</small>
    </span>`;

  // Gezeichneter Platzhalter: Tennisplatz von oben, je Baustein in einer anderen Farbe.
  const TINTS = ['#C4553A', '#1F4D3A', '#1E5F74', '#2A2D2E', '#D9902B'];
  function placeholder(seed) {
    let h = 0;
    for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const c = TINTS[h % TINTS.length];
    return `
      <div class="ph" style="--ph:${c}" aria-hidden="true">
        <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
          <rect width="160" height="90" fill="${c}"/>
          <g fill="none" stroke="#fff" stroke-width="1.4" opacity=".55">
            <rect x="18" y="12" width="124" height="66"/>
            <path d="M18 20h124M18 70h124M80 12v66M49 20v50M111 20v50M49 45h62"/>
          </g>
          <circle cx="118" cy="30" r="5" fill="#E9DA4A"/>
        </svg>
      </div>`;
  }
  const picture = (ref, seed, alt = '') =>
    ref && images[ref] ? `<img src="${images[ref]}" alt="${esc(alt)}" loading="lazy">` : placeholder(seed);

  // ---------- Bausteine darstellen ----------
  function renderBlock(b, page) {
    switch (b.type) {
      case 'heading':
        return `<h2 class="block-heading">${esc(b.title)}</h2>`;
      case 'text':
        return `<section class="block-text">${b.title ? `<h2>${esc(b.title)}</h2>` : ''}${paragraphs(b.text)}</section>`;
      case 'event':
        return `
          <article class="event card">
            ${dateBadge(b.date)}
            <div class="event-body">
              <h3>${esc(b.title)}</h3>
              <p class="muted small">${[b.time && `${esc(b.time)} Uhr`, esc(b.place)].filter(Boolean).join(' · ')}</p>
              ${b.text ? `<p class="small">${esc(b.text)}</p>` : ''}
            </div>
          </article>`;
      case 'post':
        return `
          <article class="post card">
            <div class="post-media">${picture(b.image, b.id, b.title)}${dateBadge(b.date)}</div>
            <div class="post-body">
              <p class="post-date">${esc(fmt(b.date, { day: 'numeric', month: 'long', year: 'numeric' }))}</p>
              <h3>${esc(b.title)}</h3>
              ${paragraphs(b.text)}
            </div>
          </article>`;
      case 'image':
        return `<figure class="block-image card">${picture(b.image, b.id, b.caption)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      case 'gallery': {
        const list = (b.images || []).filter((ref) => images[ref]);
        if (!list.length && editing !== page) return '';
        return `
          <section class="block-gallery">
            ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
            ${list.length
              ? `<div class="gallery-grid">${list.map((ref, i) => `<button type="button" class="gallery-item" data-action="gallery-open" data-block="${esc(b.id)}" data-index="${i}" aria-label="Foto ${i + 1} groß ansehen"><img src="${images[ref]}" alt="" loading="lazy"></button>`).join('')}</div>`
              : '<p class="muted small empty-hint">Noch keine Fotos – über den Stift Fotos hinzufügen.</p>'}
          </section>`;
      }
      case 'people':
        return `
          <section class="block-people">
            ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
            <div class="people-grid">${(b.people || []).map((p) => `
              <div class="person card"><span class="person-dot">${esc((p.role || '?')[0])}</span><div><small>${esc(p.role)}</small><strong>${esc(p.name)}</strong></div></div>`).join('')}
            </div>
          </section>`;
      case 'facts':
        return `<section class="block-facts">${(b.items || []).map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}</section>`;
      case 'button': {
        const ext = /^https?:/i.test(b.url || '');
        return `<p class="block-button"><a class="btn primary" href="${esc(b.url || '#')}" ${ext ? 'target="_blank" rel="noopener"' : ''}>${esc(b.label || 'Mehr')}${ext ? ' ↗' : ''}</a></p>`;
      }
      case 'teams':
        return teamsMarkup(b);
      default:
        return '';
    }
  }

  // Mannschaften aus nuLiga (assets/data/teams.js, später täglich automatisch)
  let teamSeason = null;
  function teamsMarkup(b) {
    const data = TFB.teams;
    if (!data || !data.seasons || !data.seasons.length) return '';
    const seasons = data.seasons;
    const current = seasons.find((s) => s.season === teamSeason)
      || seasons.slice().sort((a, b) => b.teams.length - a.teams.length)[0];
    return `
      <section class="block-teams">
        ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
        <div class="seg team-seasons">${seasons.map((s) => `<button type="button" class="${s === current ? 'on' : ''}" data-action="team-season" data-season="${esc(s.season)}">${esc(s.season)}</button>`).join('')}</div>
        <div class="card team-list">
          ${current.teams.map((t) => `
            <a class="team" href="${esc(t.teamUrl)}" target="_blank" rel="noopener">
              <span class="team-rank ${t.rank === '1' ? 'top' : ''}" title="Tabellenplatz">${esc(t.rank || '–')}</span>
              <span class="team-main"><strong>${esc(t.name)}</strong><small>${esc(t.group)}</small></span>
              <span class="team-points">${esc(t.points)}<small>Punkte</small></span>
            </a>`).join('')}
        </div>
        <p class="fineprint">Stand ${esc(data.updated)} · Daten aus <a href="${esc(data.source)}" target="_blank" rel="noopener">nuLiga</a> · Antippen öffnet Spielplan und Mannschaft</p>
      </section>`;
  }

  // ---------- Seite ----------
  async function pageView(key) {
    await ensure();
    const { state, icon, partnerSlot } = ui();
    const page = site.pages[key];
    const edit = editing === key && state.member && state.member.isAdmin;
    const admin = state.member && state.member.isAdmin;
    const blocks = page.blocks.filter((b) => !b._new).map((b, i) => edit ? editWrap(b, i, page.blocks.length, renderBlock(b, key)) : renderBlock(b, key)).join('');
    return `
      <div class="site-page ${edit ? 'editing-page' : ''}" data-page="${key}">
        ${edit ? `
          <div class="editbar">
            <div><strong>${esc(page.title)} bearbeiten</strong><span>Bausteine antippen zum Ändern · Pfeile zum Sortieren</span></div>
            <button type="button" class="btn primary" data-action="site-done">Fertig</button>
          </div>` : ''}
        <header class="view-head page-head">
          <div><h1>${esc(page.title)}</h1><p class="muted">${esc(page.intro)}</p></div>
          ${admin && !edit ? `<button type="button" class="view-close" data-action="site-edit" data-page="${key}" aria-label="Seite bearbeiten">${icon.pencil}</button>` : ''}
        </header>
        ${partnerSlot(key, page.partnerKicker || 'Präsentiert von')}
        ${blocks}
        ${edit ? `<button type="button" class="btn block add-section" data-action="block-new">${icon.plus} Baustein hinzufügen</button>` : ''}
        ${key === 'aktuell' && !edit ? '<p class="fineprint">Vorführversion: Termine und Beiträge sind Beispiele.</p>' : ''}
      </div>`;
  }
  ['aktuell', 'sport', 'verein'].forEach((key) => { TFB.views[key] = () => pageView(key); });

  function editWrap(b, i, total, inner) {
    const { icon } = ui();
    const label = (BLOCK_TYPES.find(([t]) => t === b.type) || [0, b.type])[1];
    return `
      <div class="block-edit">
        <div class="block-tools">
          <span class="block-type">${esc(label)}</span>
          <button type="button" data-action="block-move" data-id="${esc(b.id)}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach oben">${icon.up}</button>
          <button type="button" data-action="block-move" data-id="${esc(b.id)}" data-dir="1" ${i === total - 1 ? 'disabled' : ''} aria-label="Nach unten">${icon.down}</button>
          <button type="button" data-action="block-edit" data-id="${esc(b.id)}" aria-label="Bearbeiten">${icon.pencil}</button>
        </div>
        ${inner || `<p class="muted small empty-hint">${esc(label)} – noch leer</p>`}
      </div>`;
  }

  // Neu angelegte, aber nie gespeicherte Bausteine (Editor abgebrochen) verwerfen.
  const dropUnsaved = () => Object.values(site.pages).forEach((p) => { p.blocks = p.blocks.filter((b) => !b._new); });

  async function commit(message) {
    dropUnsaved();
    try {
      site = await ui().api.saveSite(site);
      if (message) ui().toast(message, true);
    } catch (err) {
      ui().toast(err.message);
      site = await ui().api.site();
    }
    ui().renderView();
  }
  const blocksOf = () => site.pages[editing].blocks;
  const findBlock = (id) => blocksOf().find((b) => b.id === id);

  // ---------- Fotos hochladen (verkleinert auf max. 1600 px) ----------
  async function uploadFiles(files) {
    const { api, loadImage, largeImage, toast } = ui();
    const ids = [];
    let n = 0;
    for (const file of files) {
      n++;
      if (files.length > 1) toast(`Foto ${n} von ${files.length} wird verkleinert …`);
      const img = await loadImage(file);
      const dataUrl = largeImage(img, 1600);
      const id = await api.putImage(dataUrl);
      images[id] = dataUrl;
      ids.push(id);
    }
    return ids;
  }

  // ---------- Baustein-Editor ----------
  function field(label, name, value, opts = {}) {
    const v = esc(value == null ? '' : value);
    if (opts.area) return `<label class="field"><span>${label}</span><textarea name="${name}" rows="${opts.rows || 5}" placeholder="${esc(opts.placeholder || '')}">${v}</textarea></label>`;
    return `<label class="field"><span>${label}</span><input name="${name}" type="${opts.type || 'text'}" value="${v}" placeholder="${esc(opts.placeholder || '')}"></label>`;
  }
  function imageField(ref, seed) {
    return `
      <div class="field"><span>Foto</span>
        <div class="image-field">
          <div class="image-preview">${picture(ref, seed)}</div>
          <div class="image-actions">
            <label class="btn">${ref ? 'Foto ersetzen' : 'Foto wählen'}<input type="file" accept="image/*" data-image-input hidden></label>
            ${ref ? '<button type="button" class="link" data-image-remove>Foto entfernen</button>' : ''}
          </div>
        </div>
      </div>`;
  }

  function openBlockEditor(id, isNew = false) {
    const { openSheet, closeSheet } = ui();
    const original = findBlock(id);
    if (!original) return;
    const draft = JSON.parse(JSON.stringify(original));
    const label = (BLOCK_TYPES.find(([t]) => t === draft.type) || [0, 'Baustein'])[1];

    const body = () => {
      switch (draft.type) {
        case 'heading': return field('Überschrift', 'title', draft.title);
        case 'text': return field('Überschrift', 'title', draft.title) + field('Text', 'text', draft.text, { area: true, rows: 8, placeholder: 'Leerzeile = neuer Absatz' });
        case 'event': return `<div class="field-row">${field('Datum', 'date', draft.date, { type: 'date' })}${field('Uhrzeit', 'time', draft.time, { type: 'time' })}</div>`
          + field('Titel', 'title', draft.title) + field('Ort', 'place', draft.place) + field('Kurzinfo', 'text', draft.text, { area: true, rows: 3 });
        case 'post': return imageField(draft.image, draft.id) + field('Datum', 'date', draft.date, { type: 'date' })
          + field('Überschrift', 'title', draft.title) + field('Text', 'text', draft.text, { area: true, rows: 7, placeholder: 'Leerzeile = neuer Absatz' });
        case 'image': return imageField(draft.image, draft.id) + field('Bildunterschrift', 'caption', draft.caption);
        case 'gallery': return field('Überschrift', 'title', draft.title) + `
          <div class="field"><span>Fotos</span>
            <div class="gallery-edit">
              ${(draft.images || []).filter((r) => images[r]).map((ref) => `<div class="gallery-thumb"><img src="${images[ref]}" alt=""><button type="button" data-gallery-remove="${esc(ref)}" aria-label="Foto entfernen">×</button></div>`).join('')}
              <label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-gallery-input hidden></label>
            </div>
          </div>`;
        case 'people': return field('Überschrift', 'title', draft.title)
          + field('Personen – je Zeile „Rolle: Name“', 'people', (draft.people || []).map((p) => `${p.role}: ${p.name}`).join('\n'), { area: true, rows: 6 });
        case 'facts': return field('Zahlen – je Zeile „Wert | Beschriftung“', 'facts', (draft.items || []).map((f) => `${f.value} | ${f.label}`).join('\n'), { area: true, rows: 4 });
        case 'button': return field('Beschriftung', 'label', draft.label) + field('Ziel (Website oder #aktuell, #sport, #verein, #kiosk)', 'url', draft.url);
        case 'teams': return field('Überschrift', 'title', draft.title) + '<p class="muted small">Die Liste kommt automatisch aus nuLiga.</p>';
        default: return '';
      }
    };

    const render = () => {
      openSheet(`
        <form class="editor" data-editor="block" novalidate>
          <h2>${isNew ? `Neuer Baustein: ${esc(label)}` : `${esc(label)} bearbeiten`}</h2>
          ${body()}
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block">Speichern</button>
          <button type="button" class="btn block danger" data-delete>Baustein löschen</button>
        </form>`);
      const form = document.querySelector('[data-editor=block]');
      form.addEventListener('submit', (e) => { e.preventDefault(); save(form); });
      form.addEventListener('click', async (e) => {
        const del = e.target.closest('[data-delete]');
        if (del) {
          if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
          site.pages[editing].blocks = blocksOf().filter((b) => b.id !== id);
          closeSheet();
          commit('Baustein gelöscht');
        }
        if (e.target.closest('[data-image-remove]')) { collect(form); draft.image = null; render(); }
        const rm = e.target.closest('[data-gallery-remove]');
        if (rm) { collect(form); draft.images = draft.images.filter((r) => r !== rm.dataset.galleryRemove); render(); }
      });
      form.addEventListener('change', async (e) => {
        const input = e.target;
        if (!input.files || !input.files.length) return;
        collect(form);
        try {
          const ids = await uploadFiles([...input.files]);
          if (input.matches('[data-image-input]')) draft.image = ids[0];
          if (input.matches('[data-gallery-input]')) draft.images = [...(draft.images || []), ...ids];
          ui().toast(ids.length > 1 ? `${ids.length} Fotos hinzugefügt` : 'Foto hinzugefügt', true);
          render();
        } catch (err) { ui().toast(err.message); }
      });
    };

    // Formularwerte in den Entwurf übernehmen
    const collect = (form) => {
      const f = form.elements;
      ['title', 'text', 'date', 'time', 'place', 'caption', 'label', 'url'].forEach((k) => { if (f[k]) draft[k] = f[k].value.trim(); });
      if (f.people) draft.people = f.people.value.split('\n').map((l) => l.trim()).filter(Boolean)
        .map((l) => { const [role, ...rest] = l.split(':'); return { role: role.trim(), name: rest.join(':').trim() || '–' }; });
      if (f.facts) draft.items = f.facts.value.split('\n').map((l) => l.trim()).filter(Boolean)
        .map((l) => { const [value, ...rest] = l.split('|'); return { value: value.trim(), label: rest.join('|').trim() }; }).slice(0, 4);
    };
    const save = (form) => {
      collect(form);
      if (['event', 'post'].includes(draft.type) && !draft.title) { form.querySelector('.form-error').textContent = 'Bitte einen Titel eingeben.'; return; }
      delete draft._new;
      const list = blocksOf();
      list[list.findIndex((b) => b.id === id)] = draft;
      closeSheet();
      commit(isNew ? 'Baustein hinzugefügt' : 'Gespeichert');
    };
    render();
  }

  function openBlockPicker() {
    const { openSheet } = ui();
    openSheet(`
      <div class="editor">
        <h2>Baustein hinzufügen</h2>
        <div class="type-list">
          ${BLOCK_TYPES.map(([type, label, hint]) => `<button type="button" class="type-option" data-action="block-add" data-type="${type}"><strong>${label}</strong><span>${hint}</span></button>`).join('')}
        </div>
      </div>`);
  }

  const today = () => new Date().toISOString().slice(0, 10);
  const newBlock = (type) => {
    const id = 'b-' + Date.now().toString(36);
    const defaults = {
      heading: { title: 'Neue Überschrift' }, text: { title: '', text: '' },
      event: { date: today(), time: '', title: '', place: 'Tennisanlage', text: '' },
      post: { date: today(), title: '', text: '', image: null }, image: { image: null, caption: '' },
      gallery: { title: 'Galerie', images: [] }, people: { title: 'Ansprechpartner', people: [] },
      facts: { items: [] }, button: { label: 'Mehr erfahren', url: '' }, teams: { title: 'Mannschaften' },
    };
    return { id, type, ...defaults[type] };
  };

  // ---------- Aktionen (aus dem zentralen Klick-Handler in app.js) ----------
  Object.assign(TFB.actions, {
    'site-edit': async (el) => {
      editing = el.dataset.page;
      ui().closeSheet();
      if (ui().currentView() === editing) ui().renderView(); else location.hash = '#' + editing;
      window.scrollTo(0, 0);
    },
    'site-done': () => { editing = null; ui().renderView(); window.scrollTo(0, 0); },
    'block-move': (el) => {
      const list = blocksOf();
      const a = list.findIndex((b) => b.id === el.dataset.id);
      const b = a + Number(el.dataset.dir);
      if (b < 0 || b >= list.length) return;
      [list[a], list[b]] = [list[b], list[a]];
      commit();
    },
    'block-edit': (el) => openBlockEditor(el.dataset.id),
    'block-new': () => openBlockPicker(),
    'block-add': (el) => {
      dropUnsaved();
      const block = { ...newBlock(el.dataset.type), _new: true };
      // Neue Beiträge/Termine direkt hinter den letzten gleicher Art, sonst ans Ende.
      const list = blocksOf();
      const lastSame = list.map((b) => b.type).lastIndexOf(block.type);
      list.splice(lastSame >= 0 ? lastSame + 1 : list.length, 0, block);
      openBlockEditor(block.id, true);
    },
    'team-season': (el) => { teamSeason = el.dataset.season; ui().renderView(); },
    'gallery-open': (el) => {
      const block = Object.values(site.pages).flatMap((p) => p.blocks).find((b) => b.id === el.dataset.block);
      const list = (block.images || []).filter((r) => images[r]);
      ui().openLightbox(images[list[Number(el.dataset.index)]], block.title || 'Galerie');
    },
  });

  // Bearbeitungsmodus verlassen, wenn eine andere Seite geöffnet wird.
  window.addEventListener('hashchange', () => {
    if (editing && location.hash.replace('#', '') !== editing) editing = null;
  });
})();
