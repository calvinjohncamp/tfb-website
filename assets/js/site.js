// TFB-Website – Seiten "Home", "Aktuell", "Sport", "Club" aus Bausteinen, dazu je Mannschaft eine eigene Seite.
// Darstellung und Bearbeitung direkt auf der Seite (wie "Kiosk bearbeiten").
// Nutzt die gemeinsamen Helfer aus app.js über TFB.ui (erst beim Rendern verfügbar).
(function () {
  TFB.views = TFB.views || {};
  TFB.actions = TFB.actions || {};

  let site = null;          // Seiteninhalte
  let images = {};          // hochgeladene Fotos: { "img:<id>": dataUrl }
  let imagesLoaded = false;
  let editing = null;       // Seite, die gerade bearbeitet wird
  let detailEditing = false; // Thema wird direkt auf seiner Unterseite bearbeitet
  const ui = () => TFB.ui;

  // Seiten-Schlüssel → Adresse im Menü (die Seite „verein“ heißt seit 10.10. „Club“)
  const ROUTE = { verein: 'club' };
  const routeOf = (key) => ROUTE[key] || key;
  const MAX_TEAM_POSTS = 10;

  const BLOCK_TYPES = [
    ['feature', 'Thema (Home)', 'großes Bild, Überschrift, Text und Link mit Vorschau'],
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
  // Fließtext mit kleinen Auszeichnungen (im Editor über die Knöpfe „Link“ und „Fett“):
  //   [Text](https://… oder #seite)  →  Link     **Text** → fett     ## Text → Zwischenüberschrift
  function inline(raw) {
    return esc(raw)
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|#)[^\s)]+)\)/g, (_, label, url) => {
        const ext = /^https?:/.test(url);
        return `<a class="inline-link" href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}${ext ? '<span class="inline-ext" aria-hidden="true">↗</span>' : ''}</a>`;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
  const paragraphs = (text) => String(text || '').split(/\n{2,}/).map((p) => {
    const h = p.match(/^##\s+(.+)/);
    return h ? `<h3 class="text-sub">${inline(h[1])}</h3>` : `<p>${inline(p)}</p>`;
  }).join('');
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
  // Gezeichnetes Padel-Motiv (bis ein echtes Foto hochgeladen ist)
  const padelArt = () => `
    <div class="ph ph-padel" aria-hidden="true">
      <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="90" fill="#161616"/>
        <path d="M30 84 L56 30 H104 L130 84 Z" fill="#1E5F74"/>
        <g fill="none" stroke="#F4EFE6" stroke-width=".9" opacity=".9">
          <path d="M30 84 L56 30 H104 L130 84 Z"/><path d="M41 61.5 H119M80 30 V84M47.5 47 H112.5"/>
        </g>
        <path d="M43 57 H117" stroke="#F4EFE6" stroke-width="2.2" opacity=".85"/>
        <g fill="none" stroke="#F4EFE6" stroke-width=".7" opacity=".35"><path d="M56 30 V14 H104 V30M30 84 V60M130 84 V60"/></g>
        <path d="M62 70 l10-9 M76 58 l9-7" stroke="#E8573A" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 3"/>
        <circle cx="96" cy="44" r="6.5" fill="#E8573A"/>
        <path d="M91.5 40 c3 2 3 6 0 8.5 M100.5 40 c-3 2 -3 6 0 8.5" stroke="#fff" stroke-width=".9" fill="none" opacity=".9"/>
      </svg>
    </div>`;
  function picture(ref, seed, alt = '') {
    if (ref && images[ref]) return `<img src="${images[ref]}" alt="${esc(alt)}" loading="lazy">`;
    if (ref && /^assets\//.test(ref)) return `<img src="${esc(ref)}" alt="${esc(alt)}" loading="lazy">`;
    if (/padel/.test(String(seed))) return padelArt();
    if (/^ph:/.test(String(ref))) return /padel/.test(ref) ? padelArt() : placeholder(ref);
    if (seed === 'h-kiosk') return `<div class="ph ph-kiosk" aria-hidden="true">${['stange:#E9B949', 'cola:#B7282E', 'gerolsteiner:#CFE6E0'].map((x) => TFB.art(...x.split(':'))).join('')}</div>`;
    if (seed === 'h-50') return '<div class="ph ph-50" aria-hidden="true"><b>50</b><span class="tfb-mark"></span><small>1976 – 2026</small></div>';
    return placeholder(seed);
  }
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return ''; } };

  // Link als Knopf – bei Websites mit Vorschau-Karte wie in einer Mail oder in WhatsApp.
  function linkMarkup(link) {
    if (!link || !link.url) return '';
    const ext = /^https?:/i.test(link.url);
    const label = esc(link.label || 'Mehr erfahren');
    const style = link.style || 'chip';
    const target = ext ? ' target="_blank" rel="noopener"' : '';
    if (style === 'button' || (!ext && style === 'card')) return `<p class="feature-link"><a class="btn signal" href="${esc(link.url)}"${target}>${label} <span aria-hidden="true">${ext ? '↗' : '→'}</span></a></p>`;
    if (style === 'chip') return `
      <p class="feature-link"><a class="link-chip" href="${esc(link.url)}"${target}>
        ${ext && link.image ? `<span class="link-chip-img">${picture(link.image, link.url)}</span>` : ''}
        <span class="link-chip-label">${label}</span>
        ${ext ? `<small>${esc(hostOf(link.url))} ↗</small>` : '<small aria-hidden="true">→</small>'}
      </a></p>`;
    return `
      <a class="link-card" href="${esc(link.url)}" target="_blank" rel="noopener">
        ${link.image ? `<span class="link-card-img">${picture(link.image, link.url)}</span>` : ''}
        <span class="link-card-body">
          <small>${esc(hostOf(link.url))}</small>
          ${link.title ? `<b>${esc(link.title)}</b>` : ''}
          ${link.text ? `<span>${esc(link.text)}</span>` : ''}
          <em>${label} <span aria-hidden="true">↗</span></em>
        </span>
      </a>`;
  }

  // ---------- Bausteine darstellen ----------
  function renderBlock(b, page) {
    switch (b.type) {
      case 'feature': {
        const list = site.pages[page] ? site.pages[page].blocks.filter((x) => x.type === 'feature' && !x._new) : [];
        const n = String(Math.max(1, list.findIndex((x) => x.id === b.id) + 1)).padStart(2, '0');
        const more = hasMore(b) && editing !== page ? `#home/${esc(b.id)}` : '';
        const wrap = (html) => (more ? `<a class="feature-hit" href="${more}">${html}</a>` : html);
        return `
          <article class="feature feature-${esc(b.layout || 'wide')} ${more ? 'has-more' : ''}">
            ${wrap(`<div class="feature-media">${picture(b.image, b.id, b.title)}</div>`)}
            <div class="feature-body">
              <p class="feature-kicker"><span>${n}</span>${esc(b.kicker || '')}</p>
              ${wrap(`<h2>${esc(b.title)}</h2>`)}
              ${b.subtitle ? `<p class="feature-sub">${esc(b.subtitle)}</p>` : ''}
              <div class="feature-text">${paragraphs(b.text)}</div>
              <div class="feature-actions">
                ${more ? `<a class="more-link" href="${more}">Mehr erfahren <span aria-hidden="true">→</span></a>` : ''}
                ${linkMarkup(b.link)}
              </div>
            </div>
          </article>`;
      }
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
          ${current.teams.map((t) => {
            const extra = teamContent(teamKey(t.name));
            const photo = extra.photo && (images[extra.photo] || /^assets\//.test(extra.photo)) ? picture(extra.photo, t.name) : '';
            const count = extra.posts.length;
            return `
            <a class="team" href="#team/${esc(teamKey(t.name))}">
              <span class="team-rank ${t.rank === '1' ? 'top' : ''}" title="Tabellenplatz">${esc(t.rank || '–')}</span>
              <span class="team-main">
                ${photo ? `<span class="team-thumb">${photo}</span>` : ''}
                <span class="team-name"><strong>${esc(t.name)}</strong><small>${esc(t.group)}</small>
                ${count ? `<em class="team-news">${count === 1 ? '1 Beitrag' : `${count} Beiträge`}</em>` : ''}</span>
              </span>
              <span class="team-captain"><small>Mannschaftsführer</small>${esc(t.captain)}</span>
              <span class="team-points">${esc(t.points)}<small>Punkte</small></span>
            </a>`;
          }).join('')}
        </div>
        <p class="fineprint">Stand ${esc(data.updated)} · Daten aus <a href="${esc(data.source)}" target="_blank" rel="noopener">nuLiga</a> · Antippen öffnet die Seite der Mannschaft</p>
      </section>`;
  }

  // ---------- Unterseite eines Home-Themas („Mehr erfahren“) ----------
  const hasMore = (b) => Boolean(b.more && ((b.more.text || '').trim() || (b.more.images || []).length || b.more.quote));
  const shownImage = (ref) => ref && (images[ref] || /^assets\//.test(ref) || /^ph:/.test(ref));

  // Fotokollage: wechselnde Kachelgrößen, damit es nach Magazin aussieht – Antippen zeigt das Foto groß.
  function collage(list, blockId) {
    const imgs = list.filter(shownImage);
    if (!imgs.length) return '';
    return `
      <div class="collage collage-${Math.min(imgs.length, 5)}">
        ${imgs.map((ref, i) => `
          <button type="button" class="collage-item" data-action="collage-open" data-block="${esc(blockId)}" data-index="${i}" aria-label="Foto ${i + 1} groß ansehen">
            ${picture(ref, ref, '')}
          </button>`).join('')}
      </div>`;
  }

  async function featureDetail(id) {
    const { icon, state, partnerSlot } = ui();
    const b = site.pages.home.blocks.find((x) => x.id === id);
    if (!b) return `${ui().viewHead('Home', 'Diesen Beitrag gibt es nicht mehr.', false)}<p><a class="btn" href="#home">Zur Startseite</a></p>`;
    const more = b.more || {};
    const parts = String(more.text || '').split(/\n{2,}/);
    const cut = Math.min(2, parts.length);
    const admin = state.member && state.member.isAdmin;
    return `
      <article class="story">
        <header class="story-hero">
          <div class="story-hero-img">${picture(b.image, b.id, b.title)}</div>
          <div class="story-hero-text">
            <p class="feature-kicker"><span>${esc(String(site.pages.home.blocks.filter((x) => x.type === 'feature').indexOf(b) + 1).padStart(2, '0'))}</span>${esc(b.kicker || '')}</p>
            <h1>${esc(b.title)}</h1>
          </div>
          <a class="view-close story-close" href="#home" aria-label="Zurück zur Startseite">${icon.close}</a>
          ${admin ? `<button type="button" class="view-close story-edit" data-action="feature-edit" data-id="${esc(b.id)}" aria-label="Bearbeiten">${icon.pencil}</button>` : ''}
        </header>
        <div class="story-body">
          ${b.subtitle ? `<p class="story-lead">${esc(b.subtitle)}</p>` : ''}
          <div class="story-text dropcap">${paragraphs(parts.slice(0, cut).join('\n\n') || b.text)}</div>
          ${more.quote ? `<blockquote class="story-quote"><p>${esc(more.quote)}</p>${more.quoteBy ? `<cite>${esc(more.quoteBy)}</cite>` : ''}</blockquote>` : ''}
          ${parts.length > cut ? `<div class="story-text">${paragraphs(parts.slice(cut).join('\n\n'))}</div>` : ''}
        </div>
        ${collage(more.images || [], b.id)}
        <div class="story-foot">
          ${linkMarkup(b.link)}
          <a class="more-link back" href="#home"><span aria-hidden="true">←</span> Zur Startseite</a>
        </div>
      </article>
      ${partnerSlot('home', site.pages.home.partnerKicker || 'Präsentiert von')}`;
  }

  // ---------- Seite ----------
  async function pageView(key) {
    await ensure();
    if (key === 'home' && location.hash.split('/')[1]) return featureDetail(location.hash.split('/')[1]);
    const { state, icon, partnerSlot } = ui();
    const page = site.pages[key];
    const edit = editing === key && state.member && state.member.isAdmin;
    const admin = state.member && state.member.isAdmin;
    const list = page.blocks.filter((b) => !b._new);
    const blocks = edit
      ? list.map((b, i) => editWrap(b, i, list.length, renderBlock(b, key))).join('')
      : layoutBlocks(list, key);
    return `
      <div class="site-page ${edit ? 'editing-page' : ''}" data-page="${key}">
        ${edit ? `
          <div class="editbar">
            <div><strong>${esc(page.title)} bearbeiten</strong><span>Bausteine antippen zum Ändern · Pfeile zum Sortieren</span></div>
            <button type="button" class="btn primary" data-action="site-done">Fertig</button>
          </div>` : ''}
        ${key === 'home' && !edit
          ? (admin ? `<div class="home-tools"><button type="button" class="view-close" data-action="site-edit" data-page="home" aria-label="Startseite bearbeiten">${icon.pencil}</button></div>` : '')
          : `<header class="view-head page-head">
          <div><h1>${esc(page.title)}</h1>${page.intro ? `<p class="muted">${esc(page.intro)}</p>` : ''}</div>
          ${admin && !edit ? `<button type="button" class="view-close" data-action="site-edit" data-page="${key}" aria-label="Seite bearbeiten">${icon.pencil}</button>` : ''}
        </header>`}
        ${blocks}
        ${edit ? `<button type="button" class="btn block add-section" data-action="block-new">${icon.plus} Baustein hinzufügen</button>` : ''}
        ${['aktuell', 'home'].includes(key) && !edit ? `<p class="fineprint">Vorführversion: ${key === 'home' ? 'Texte und Bilder sind Beispiele.' : 'Termine und Beiträge sind Beispiele.'}</p>` : ''}
        ${edit ? '' : partnerSlot(key, page.partnerKicker || 'Präsentiert von')}
      </div>`;
  }
  ['home', 'aktuell', 'sport', 'verein'].forEach((key) => { TFB.views[routeOf(key)] = () => pageView(key); });

  // Ansicht (nicht Bearbeiten): Bausteine zu Gruppen bündeln, damit sie sich auf
  // breiten Bildschirmen in Spalten ordnen. Termine (mit ihrer Überschrift davor)
  // wandern in eine eigene Spalte – auf dem Handy stehen sie oben.
  function layoutBlocks(list, key) {
    const eventIdx = list.map((b, i) => (b.type === 'event' ? i : -1)).filter((i) => i >= 0);
    const asideIdx = new Set(eventIdx);
    if (eventIdx.length && list[eventIdx[0] - 1] && list[eventIdx[0] - 1].type === 'heading') asideIdx.add(eventIdx[0] - 1);
    const main = list.filter((_, i) => !asideIdx.has(i));
    const aside = list.filter((_, i) => asideIdx.has(i));

    // Einheiten: Knopf gehört zum Text davor.
    const units = [];
    main.forEach((b) => {
      const last = units[units.length - 1];
      if (b.type === 'button' && last && last.kind === 'text') last.html += renderBlock(b, key);
      else units.push({ kind: b.type === 'text' ? 'text' : b.type, html: renderBlock(b, key) });
    });
    // Läufe gleicher Art zusammenfassen (Beiträge, Texte)
    let html = '';
    for (let i = 0; i < units.length;) {
      const kind = units[i].kind;
      let j = i;
      while (j < units.length && units[j].kind === kind) j++;
      const run = units.slice(i, j).map((u) => u.html).filter(Boolean);
      if (kind === 'post' && run.length) html += `<div class="run run-posts">${run.join('')}</div>`;
      else if (kind === 'text' && run.length > 1) html += `<div class="run run-texts">${run.map((h) => `<div class="unit">${h}</div>`).join('')}</div>`;
      else html += run.join('');
      i = j;
    }
    if (!aside.length) return `<div class="page-grid single"><div class="page-main">${html}</div></div>`;
    return `
      <div class="page-grid">
        <div class="page-main">${html}</div>
        <aside class="page-aside">${aside.map((b) => renderBlock(b, key)).join('')}</aside>
      </div>`;
  }

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
    if (detailEditing) { editing = null; detailEditing = false; }
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
    if (opts.area) return `<div class="field"><span>${label}</span>
      ${opts.rich ? `<div class="rich-tools" role="toolbar" aria-label="Text gestalten">
        <button type="button" data-rich="link">↗ Link</button><button type="button" data-rich="bold"><b>F</b> Fett</button><button type="button" data-rich="h">Zwischenüberschrift</button></div>` : ''}
      <textarea name="${name}" rows="${opts.rows || 5}" placeholder="${esc(opts.placeholder || '')}">${v}</textarea></div>`;
    return `<label class="field"><span>${label}</span><input name="${name}" type="${opts.type || 'text'}" value="${v}" placeholder="${esc(opts.placeholder || '')}"></label>`;
  }
  function imageField(ref, seed, label = 'Foto', target = '') {
    return `
      <div class="field"><span>${label}</span>
        <div class="image-field">
          <div class="image-preview">${picture(ref, seed)}</div>
          <div class="image-actions">
            <label class="btn">${ref ? 'Foto ersetzen' : 'Foto wählen'}<input type="file" accept="image/*" data-image-input data-target="${target}" hidden></label>
            ${ref ? `<button type="button" class="link" data-image-remove="${target}">Foto entfernen</button>` : ''}
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
        case 'feature': {
          const lk = draft.link || {};
          const ext = /^https?:/i.test(lk.url || '');
          return `
            <div class="field"><span>Bild-Anordnung</span>
              <div class="seg layout-seg">${[['wide', 'Breit oben'], ['portrait', 'Hochformat links'], ['square', 'Quadrat links']].map(([v, l]) =>
                `<button type="button" class="${(draft.layout || 'wide') === v ? 'on' : ''}" data-layout="${v}">${l}</button>`).join('')}</div>
            </div>`
            + imageField(draft.image, draft.id)
            + field('Kleine Zeile über der Überschrift', 'kicker', draft.kicker, { placeholder: 'z. B. Neu in Bielstein' })
            + field('Überschrift', 'title', draft.title) + field('Unterzeile', 'subtitle', draft.subtitle)
            + field('Kurzer Text auf der Startseite', 'text', draft.text, { area: true, rich: true, rows: 5, placeholder: 'Zwei, drei Sätze. Leerzeile = neuer Absatz' })
            + `<h3 class="editor-sub">Link</h3>`
            + field('Ziel (Website oder #kiosk, #aktuell, #sport, #club)', 'linkUrl', lk.url, { placeholder: 'https://… oder #kiosk' })
            + field('Link-Text', 'linkLabel', lk.label, { placeholder: 'z. B. Jetzt Platz buchen' })
            + `<div class="field"><span>Darstellung</span><div class="seg link-style-seg">${[['chip', 'Dezent'], ['button', 'Knopf'], ['card', 'Vorschau-Karte']].map(([v, l]) =>
                `<button type="button" class="${(lk.style || 'chip') === v ? 'on' : ''}" data-linkstyle="${v}">${l}</button>`).join('')}</div></div>`
            + (ext ? `<p class="muted small">Für die Vorschau (kleines Bild beim dezenten Link, große Karte): im Echtbetrieb holt die App Bild, Titel und Text automatisch von der Website – bis dahin hier eintragen.</p>`
              + field('Vorschau: Titel', 'linkTitle', lk.title) + field('Vorschau: Text', 'linkText', lk.text, { area: true, rows: 3 })
              + imageField(lk.image, lk.url, 'Vorschau: Bild', 'link') : '')
            + `<h3 class="editor-sub">Unterseite „Mehr erfahren“</h3><p class="muted small">Erscheint, sobald hier etwas steht. Großes Titelbild oben, der Text wie ein Magazinartikel, dazu ein Zitat und eine Fotokollage.</p>`
            + field('Ausführlicher Text', 'moreText', (draft.more || {}).text, { area: true, rich: true, rows: 10, placeholder: 'Beliebig lang. Leerzeile = neuer Absatz, ## am Zeilenanfang = Zwischenüberschrift' })
            + field('Zitat (freiwillig)', 'moreQuote', (draft.more || {}).quote, { placeholder: 'z. B. „Nach zehn Minuten hatte jeder ein Grinsen im Gesicht.“' })
            + field('Zitat von', 'moreQuoteBy', (draft.more || {}).quoteBy, { placeholder: 'z. B. Jan, Herren 40' })
            + `<div class="field"><span>Fotokollage</span>
                <div class="gallery-edit">
                  ${((draft.more || {}).images || []).filter(shownImage).map((ref) => `<div class="gallery-thumb">${picture(ref, ref)}<button type="button" data-more-remove="${esc(ref)}" aria-label="Foto entfernen">×</button></div>`).join('')}
                  <label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-more-input hidden></label>
                </div></div>`;
        }
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
        case 'button': return field('Beschriftung', 'label', draft.label) + field('Ziel (Website oder #aktuell, #sport, #club, #kiosk)', 'url', draft.url);
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
        const lay = e.target.closest('[data-layout]');
        if (lay) { collect(form); draft.layout = lay.dataset.layout; render(); return; }
        const ls = e.target.closest('[data-linkstyle]');
        if (ls) { collect(form); draft.link = { ...(draft.link || {}), style: ls.dataset.linkstyle }; render(); return; }
        const mr = e.target.closest('[data-more-remove]');
        if (mr) { collect(form); draft.more.images = draft.more.images.filter((r) => r !== mr.dataset.moreRemove); render(); return; }
        const rmImg = e.target.closest('[data-image-remove]');
        if (rmImg) { collect(form); if (rmImg.dataset.imageRemove === 'link') draft.link.image = null; else draft.image = null; render(); }
        const rm = e.target.closest('[data-gallery-remove]');
        if (rm) { collect(form); draft.images = draft.images.filter((r) => r !== rm.dataset.galleryRemove); render(); }
      });
      form.addEventListener('change', async (e) => {
        const input = e.target;
        if (!input.files || !input.files.length) return;
        collect(form);
        try {
          const ids = await uploadFiles([...input.files]);
          if (input.matches('[data-image-input]')) {
            if (input.dataset.target === 'link') draft.link = { ...(draft.link || {}), image: ids[0] };
            else draft.image = ids[0];
          }
          if (input.matches('[data-gallery-input]')) draft.images = [...(draft.images || []), ...ids];
          if (input.matches('[data-more-input]')) draft.more = { ...(draft.more || {}), images: [...((draft.more || {}).images || []).filter((r) => !/^ph:/.test(r)), ...ids] };
          ui().toast(ids.length > 1 ? `${ids.length} Fotos hinzugefügt` : 'Foto hinzugefügt', true);
          render();
        } catch (err) { ui().toast(err.message); }
      });
    };

    // Formularwerte in den Entwurf übernehmen
    const collect = (form) => {
      const f = form.elements;
      ['title', 'text', 'date', 'time', 'place', 'caption', 'label', 'url', 'kicker', 'subtitle'].forEach((k) => { if (f[k]) draft[k] = f[k].value.trim(); });
      if (f.moreText) draft.more = { ...(draft.more || {}), text: f.moreText.value.trim(), quote: f.moreQuote.value.trim(), quoteBy: f.moreQuoteBy.value.trim() };
      if (f.linkUrl) {
        draft.link = { ...(draft.link || {}), url: f.linkUrl.value.trim(), label: f.linkLabel.value.trim() };
        if (f.linkTitle) Object.assign(draft.link, { title: f.linkTitle.value.trim(), text: f.linkText.value.trim() });
      }
      if (f.people) draft.people = f.people.value.split('\n').map((l) => l.trim()).filter(Boolean)
        .map((l) => { const [role, ...rest] = l.split(':'); return { role: role.trim(), name: rest.join(':').trim() || '–' }; });
      if (f.facts) draft.items = f.facts.value.split('\n').map((l) => l.trim()).filter(Boolean)
        .map((l) => { const [value, ...rest] = l.split('|'); return { value: value.trim(), label: rest.join('|').trim() }; }).slice(0, 4);
    };
    const save = (form) => {
      collect(form);
      if (['event', 'post', 'feature'].includes(draft.type) && !draft.title) { form.querySelector('.form-error').textContent = 'Bitte einen Titel eingeben.'; return; }
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
      feature: { layout: 'wide', image: null, kicker: '', title: '', subtitle: '', text: '', link: { url: '', label: '' } },
      heading: { title: 'Neue Überschrift' }, text: { title: '', text: '' },
      event: { date: today(), time: '', title: '', place: 'Tennisanlage', text: '' },
      post: { date: today(), title: '', text: '', image: null }, image: { image: null, caption: '' },
      gallery: { title: 'Galerie', images: [] }, people: { title: 'Ansprechpartner', people: [] },
      facts: { items: [] }, button: { label: 'Mehr erfahren', url: '' }, teams: { title: 'Mannschaften' },
    };
    return { id, type, ...defaults[type] };
  };

  // ---------- Mannschaften: eigene Seite mit Teamfoto und bis zu 10 Beiträgen ----------
  // Schlüssel ohne Zusatz wie „(4er)“, damit Sommer- und Winterteam dieselbe Seite teilen.
  const teamKey = (name) => String(name || '').replace(/\(.*?\)/g, '').trim().toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function teamContent(key) {
    if (!site.teams) site.teams = {};
    return site.teams[key] || { photo: null, posts: [] };
  }
  // Neueste Saison zuerst, in der das Team vorkommt
  function findTeam(key) {
    for (const season of (TFB.teams && TFB.teams.seasons) || []) {
      const t = season.teams.find((x) => teamKey(x.name) === key);
      if (t) return { team: t, season: season.season };
    }
    return null;
  }
  // Wer darf schreiben? Admins – und später der Mannschaftsführer seines Teams (mit echter Mitgliederliste).
  const canEditTeam = () => Boolean(ui().state.member && ui().state.member.isAdmin);

  async function teamView() {
    await ensure();
    const { icon, partnerSlot } = ui();
    const key = location.hash.split('/')[1] || '';
    const found = findTeam(key);
    if (!found) return `${ui().viewHead('Mannschaft', 'Diese Mannschaft gibt es nicht (mehr).', false)}<p><a class="btn" href="#sport">Zu den Mannschaften</a></p>`;
    const { team, season } = found;
    const extra = teamContent(key);
    const can = canEditTeam();
    const posts = extra.posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const hasPhoto = extra.photo && (images[extra.photo] || /^assets\//.test(extra.photo));
    return `
      <div class="team-page">
        <header class="view-head page-head">
          <div><p class="page-kicker">Mannschaft · ${esc(season)}</p><h1>${esc(team.name.replace(/\s*\(.*?\)/g, ''))}</h1><p class="muted">${esc(team.group)}</p></div>
          <a class="view-close" href="#sport" aria-label="Zurück zu den Mannschaften">${icon.close}</a>
        </header>
        ${hasPhoto || can ? `
          <figure class="team-photo ${hasPhoto ? '' : 'empty'}">
            ${hasPhoto ? picture(extra.photo, key, `Teamfoto ${team.name}`) : `<div class="team-photo-empty">${icon.camera}<span>Noch kein Teamfoto</span></div>`}
            ${can ? `<button type="button" class="btn small team-photo-btn" data-action="team-photo" data-team="${esc(key)}">${icon.camera} ${hasPhoto ? 'Teamfoto ändern' : 'Teamfoto hinzufügen'}</button>` : ''}
          </figure>` : ''}
        <section class="team-facts">
          <div><b class="${team.rank === '1' ? 'top' : ''}">${esc(team.rank || '–')}</b><span>Tabellenplatz</span></div>
          <div><b>${esc(team.points || '–')}</b><span>Punkte</span></div>
          <div><b class="team-facts-name">${esc(team.captain || '–')}</b><span>Mannschaftsführer</span></div>
        </section>
        <p class="block-button"><a class="btn" href="${esc(team.teamUrl)}" target="_blank" rel="noopener">Spielplan &amp; Tabelle bei nuLiga ↗</a></p>

        <div class="section-head team-news-head">
          <h2 class="block-heading">Aus dem Team</h2>
          ${can ? `<button type="button" class="btn primary small" data-action="team-post" data-team="${esc(key)}">${icon.plus} Beitrag</button>` : ''}
        </div>
        ${posts.length
          ? `<div class="run run-posts">${posts.map((b) => `
              <div class="team-post">${renderBlock({ ...b, type: 'post' }, 'team')}
                ${can ? `<button type="button" class="view-close team-post-edit" data-action="team-post" data-team="${esc(key)}" data-id="${esc(b.id)}" aria-label="Beitrag bearbeiten">${icon.pencil}</button>` : ''}
              </div>`).join('')}</div>`
          : `<p class="muted">${can ? 'Noch keine Beiträge. Spielberichte, Mannschaftstouren, Erfolge – bis zu 10 Beiträge passen hier untereinander.' : 'Hier berichtet die Mannschaft bald über Spiele und Touren.'}</p>`}
        ${can ? `<p class="fineprint">Schreiben dürfen Admins – im Echtbetrieb auch der Mannschaftsführer. Höchstens ${MAX_TEAM_POSTS} Beiträge; beim elften fällt der älteste weg.</p>` : ''}
        ${partnerSlot('sport', 'Der Sport wird dir präsentiert von')}
      </div>`;
  }
  TFB.views.team = teamView;

  async function saveTeam(key, content, message) {
    site.teams = { ...(site.teams || {}), [key]: content };
    await commit(message);
  }

  function openTeamPhoto(key) {
    const { openSheet, closeSheet } = ui();
    const content = JSON.parse(JSON.stringify(teamContent(key)));
    const render = () => {
      openSheet(`
        <form class="editor" data-editor="team-photo" novalidate>
          <h2>Teamfoto</h2>
          ${imageField(content.photo, key, 'Foto (am besten quer)')}
          <button type="submit" class="btn primary block">Speichern</button>
        </form>`);
      const form = document.querySelector('[data-editor=team-photo]');
      form.addEventListener('click', (e) => { if (e.target.closest('[data-image-remove]')) { content.photo = null; render(); } });
      form.addEventListener('change', async (e) => {
        if (!e.target.files || !e.target.files.length) return;
        const [id] = await uploadFiles([e.target.files[0]]);
        content.photo = id;
        render();
      });
      form.addEventListener('submit', (e) => { e.preventDefault(); closeSheet(); saveTeam(key, content, 'Teamfoto gespeichert'); });
    };
    render();
  }

  function openTeamPost(key, postId) {
    const { openSheet, closeSheet } = ui();
    const content = JSON.parse(JSON.stringify(teamContent(key)));
    const existing = content.posts.find((p) => p.id === postId);
    const draft = existing ? { ...existing } : { id: 'tp-' + Date.now().toString(36), date: today(), title: '', text: '', image: null };
    const full = !existing && content.posts.length >= MAX_TEAM_POSTS;
    const render = () => {
      openSheet(`
        <form class="editor" data-editor="team-post" novalidate>
          <h2>${existing ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}</h2>
          ${full ? `<p class="small muted">Es gibt schon ${MAX_TEAM_POSTS} Beiträge – beim Speichern fällt der älteste weg.</p>` : ''}
          ${imageField(draft.image, draft.id)}
          ${field('Datum', 'date', draft.date, { type: 'date' })}
          ${field('Überschrift', 'title', draft.title, { placeholder: 'z. B. Auswärtssieg in Hennef' })}
          ${field('Text', 'text', draft.text, { area: true, rows: 8, placeholder: 'Leerzeile = neuer Absatz' })}
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn primary block">Speichern</button>
          ${existing ? '<button type="button" class="btn block danger" data-delete>Beitrag löschen</button>' : ''}
        </form>`);
      const form = document.querySelector('[data-editor=team-post]');
      const collect = () => ['date', 'title', 'text'].forEach((k) => { draft[k] = form.elements[k].value.trim(); });
      form.addEventListener('click', (e) => {
        if (e.target.closest('[data-image-remove]')) { collect(); draft.image = null; render(); return; }
        const del = e.target.closest('[data-delete]');
        if (del) {
          if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
          content.posts = content.posts.filter((p) => p.id !== draft.id);
          closeSheet();
          saveTeam(key, content, 'Beitrag gelöscht');
        }
      });
      form.addEventListener('change', async (e) => {
        if (!e.target.files || !e.target.files.length) return;
        collect();
        const [id] = await uploadFiles([e.target.files[0]]);
        draft.image = id;
        render();
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        collect();
        if (!draft.title) { form.querySelector('.form-error').textContent = 'Bitte eine Überschrift eingeben.'; return; }
        if (existing) content.posts = content.posts.map((p) => (p.id === draft.id ? draft : p));
        else {
          content.posts.push(draft);
          content.posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
          content.posts = content.posts.slice(0, MAX_TEAM_POSTS);
        }
        closeSheet();
        saveTeam(key, content, existing ? 'Gespeichert' : 'Beitrag veröffentlicht');
      });
    };
    render();
  }

  // ---------- Aktionen (aus dem zentralen Klick-Handler in app.js) ----------
  Object.assign(TFB.actions, {
    'site-edit': async (el) => {
      editing = el.dataset.page;
      ui().closeSheet();
      if (ui().currentView() === routeOf(editing)) ui().renderView(); else location.hash = '#' + routeOf(editing);
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
    'team-photo': (el) => openTeamPhoto(el.dataset.team),
    'feature-edit': (el) => { editing = 'home'; detailEditing = true; openBlockEditor(el.dataset.id); },
    'collage-open': (el) => {
      const b = site.pages.home.blocks.find((x) => x.id === el.dataset.block);
      const list = ((b.more || {}).images || []).filter(shownImage);
      const ref = list[Number(el.dataset.index)];
      const src = images[ref] || (/^assets\//.test(ref) ? ref : null);
      if (src) ui().openLightbox(src, b.title); else ui().toast('Beispielbild – eigene Fotos über den Stift hochladen');
    },
    'team-post': (el) => openTeamPost(el.dataset.team, el.dataset.id),
    'gallery-open': (el) => {
      const block = Object.values(site.pages).flatMap((p) => p.blocks).find((b) => b.id === el.dataset.block);
      const list = (block.images || []).filter((r) => images[r]);
      ui().openLightbox(images[list[Number(el.dataset.index)]], block.title || 'Galerie');
    },
  });

  // Bearbeitungsmodus verlassen, wenn eine andere Seite geöffnet wird.
  window.addEventListener('hashchange', () => {
    if (detailEditing || (editing && location.hash.replace('#', '') !== routeOf(editing))) { editing = null; detailEditing = false; }
  });

  // Werkzeugleiste über Textfeldern: Link, Fett, Zwischenüberschrift an der Cursor-Stelle einfügen
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rich]');
    if (!btn) return;
    const area = btn.closest('.field').querySelector('textarea');
    const { selectionStart: a, selectionEnd: z, value } = area;
    const sel = value.slice(a, z);
    let insert = '';
    if (btn.dataset.rich === 'link') {
      const url = prompt('Wohin soll der Link führen?\n(Website mit https://… oder eine Seite wie #kiosk, #sport, #club)', 'https://');
      if (!url || url === 'https://') return;
      const label = sel || prompt('Welcher Text soll im Fließtext stehen?', '') || url.replace(/^https?:\/\/(www\.)?/, '');
      insert = `[${label}](${url.trim()})`;
    } else if (btn.dataset.rich === 'bold') insert = `**${sel || 'fetter Text'}**`;
    else insert = `${a > 0 && value[a - 1] !== '\n' ? '\n\n' : ''}## ${sel || 'Zwischenüberschrift'}\n\n`;
    area.value = value.slice(0, a) + insert + value.slice(z);
    area.focus();
    area.selectionStart = area.selectionEnd = a + insert.length;
  });
})();
