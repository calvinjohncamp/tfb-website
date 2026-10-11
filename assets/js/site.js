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
  let preview = null;        // Live-Vorschau beim Bearbeiten eines Themas: { id, draft, tab }
  const ui = () => TFB.ui;

  // Seiten-Schlüssel → Adresse im Menü (die Seite „verein“ heißt seit 10.10. „Club“)
  const ROUTE = { verein: 'club' };
  const routeOf = (key) => ROUTE[key] || key;
  const MAX_TEAM_POSTS = 10;
  const chatText = () => ({ ...TFB.siteSeed.chatText, ...site?.chatText });
  const chatEditButton = () => ui().state.member?.isAdmin ? `<button type="button" class="view-close" data-action="chat-text-edit" aria-label="Chat-Texte bearbeiten">${ui().icon.pencil}</button>` : '';

  const BLOCK_TYPES = [
    ['feature', 'Thema (Home)', 'großes Bild, Überschrift, Text und Link mit Vorschau'],
    ['post', 'Beitrag', 'Foto, Datum, Überschrift und Text'],
    ['event', 'Termin', 'Datum, Uhrzeit, Ort'],
    ['text', 'Text', 'Überschrift und Absätze'],
    ['heading', 'Zwischenüberschrift', 'gliedert die Seite'],
    ['image', 'Foto', 'ein Bild mit Bildunterschrift'],
    ['gallery', 'Galerie', 'mehrere Fotos, groß ansehbar'],
    ['people', 'Ansprechpartner', 'Rolle und Name'],
    ['facts', 'Zahlen', 'bis zu fünf große Kennzahlen'],
    ['button', 'Knopf', 'Link zu einer Seite oder Website'],
    ['teams', 'Mannschaften', 'automatisch aus nuLiga'],
  ];

  let teamCounts = {};
  let boardPeople = [];
  async function ensure() {
    if (!site) site = await ui().api.site();
    if (!imagesLoaded) { images = await ui().api.images(); imagesLoaded = true; }
    try { teamCounts = await ui().api.teamPostCounts(); } catch (_) { teamCounts = {}; }
    boardPeople = await ui().api.boardPeople();
  }

  // ---------- Formatierung ----------
  const esc = (s) => ui().esc(s);
  // Fließtext mit Auszeichnungen. Im Editor gestaltet man direkt (WYSIWYG); gespeichert wird als
  // schlichter Text mit Zeichen – so bleibt alles klein, sicher und übertragbar:
  //   [Text](https://… | #seite)  Link       **Text** fett     *Text* kursiv    __Text__ unterstrichen
  //   {rot}…{/rot} {grau}…{/grau} {marker}…{/marker} Farbe   {gross}…{/gross} {sehrgross}…{/sehrgross} Größe
  //   ## Text (Zeilenanfang) Zwischenüberschrift
  const SPANS = { rot: 'tx-red', grau: 'tx-gray', marker: 'tx-mark', gross: 'tx-l', sehrgross: 'tx-xl' };
  function inline(raw) {
    const links = [];
    let h = esc(raw).replace(/\[([^\]]+)\]\(((?:https?:\/\/|#)[^\s)]+)\)/g, (_, label, url) => {
      links.push([label, url]);
      return `\u0000${links.length - 1}\u0000`;
    });
    h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__([\s\S]+?)__/g, '<u>$1</u>')
      .replace(/(^|[^*])\*([^*\s][\s\S]*?)\*(?!\*)/g, '$1<em>$2</em>');
    for (let i = 0; i < 3; i++) {   // verschachtelte Farben/Größen
      h = h.replace(/\{(rot|grau|marker|gross|sehrgross)\}([\s\S]*?)\{\/\1\}/g, (_, k, t) => `<span class="${SPANS[k]}">${t}</span>`);
    }
    h = h.replace(/\u0000(\d+)\u0000/g, (_, i) => {
      const [label, url] = links[Number(i)];
      const ext = /^https?:/.test(url);
      return `<a class="inline-link" href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}${ext ? '<span class="inline-ext" aria-hidden="true">↗</span>' : ''}</a>`;
    });
    return h.replace(/\n/g, '<br>');
  }
  // Rückweg: gestaltetes HTML aus dem Editor → gespeicherter Text mit Zeichen
  function toMarkup(root) {
    const kids = (node) => [...node.childNodes].map(walk).join('');
    function walk(n) {
      if (n.nodeType === 3) return n.nodeValue.replace(/ /g, ' ');
      if (n.nodeType !== 1) return '';
      const tag = n.tagName;
      if (tag === 'BR') return '\n';
      if (tag === 'B' || tag === 'STRONG') return wrapIf(kids(n), '**', '**');
      if (tag === 'I' || tag === 'EM') return wrapIf(kids(n), '*', '*');
      if (tag === 'U') return wrapIf(kids(n), '__', '__');
      if (tag === 'A') {
        const href = n.getAttribute('href') || '';
        const t = n.textContent.replace(/↗/g, '').trim();
        return /^(https?:\/\/|#)/.test(href) && t ? `[${t}](${href})` : t;
      }
      if (tag === 'SPAN') {
        const key = Object.keys(SPANS).find((k) => n.classList.contains(SPANS[k]));
        if (n.classList.contains('inline-ext')) return '';
        return key ? wrapIf(kids(n), `{${key}}`, `{/${key}}`) : kids(n);
      }
      return kids(n);
    }
    const wrapIf = (t, a, b) => (t.trim() ? a + t + b : t);
    const blocks = [];
    [...root.childNodes].forEach((n) => {
      if (n.nodeType === 1 && /^H[1-6]$/.test(n.tagName)) blocks.push('## ' + kids(n).replace(/\n/g, ' ').trim());
      else if (n.nodeType === 1 && (n.tagName === 'P' || n.tagName === 'DIV')) blocks.push(kids(n).replace(/\n+$/, ''));
      else { const t = walk(n); if (t.trim()) blocks.push(t); }
    });
    return blocks.map((x) => x.trim()).filter(Boolean).join('\n\n');
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
  function picture(ref, seed, alt = '', original = false) {
    const src = ref && (images[ref] || (/^assets\//.test(ref) ? ref : ''));
    if (src) {
      const frame = !original && TFB.photoFrame?.normalize(site?.photoFrames?.[ref]);
      const img = `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${original ? '' : ` data-photo-ref="${esc(ref)}"`}>`;
      return frame ? `<span class="photo-frame active" style="${TFB.photoFrame.style(frame)}">${img}</span>` : img;
    }
    if (/padel/.test(String(seed))) return padelArt();
    if (/^ph:/.test(String(ref))) return /padel/.test(ref) ? padelArt() : placeholder(ref);
    if (seed === 'h-kiosk') return `<div class="ph ph-kiosk" aria-hidden="true">${['stange:#E9B949', 'cola:#B7282E', 'gerolsteiner:#CFE6E0'].map((x) => TFB.art(...x.split(':'))).join('')}</div>`;
    if (seed === 'h-50') return '<div class="ph ph-50" aria-hidden="true"><b>50</b><span class="tfb-mark"></span><small>1976 – 2026</small></div>';
    return placeholder(seed);
  }
  // Symbol für Links innerhalb der App (rundes Zeichen wie beim Padel-Link)
  function pageIcon(url) {
    const { icon } = ui();
    const key = String(url || '').replace('#', '').split('/')[0];
    const map = { kiosk: icon.kiosk, strichliste: icon.tally, abrechnungen: icon.receipt, aktuell: icon.news, sport: icon.sport, club: icon.club, verein: icon.club, treffen: icon.news, team: icon.sport };
    return map[key] || icon.chevron;
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
        ${link.image ? `<span class="link-chip-img">${picture(link.image, link.url)}</span>`
          : link.icon && ui().icon[link.icon] ? `<span class="link-chip-img icon">${ui().icon[link.icon]}</span>` : !ext ? `<span class="link-chip-img icon">${pageIcon(link.url)}</span>` : ''}
        <span class="link-chip-label">${ext ? esc(hostOf(link.url)) : label}</span>
        <small aria-hidden="true">${ext ? '↗' : '→'}</small>
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
        const list = page === 'home' ? homeBlocks().filter((x) => x.type === 'feature' && (!x._new || (preview && x.id === preview.id))) : [];
        const n = String(Math.max(1, list.findIndex((x) => x.id === b.id) + 1)).padStart(2, '0');
        const mode = b.navigation || (hasMore(b) ? 'detail' : 'link');
        const more = mode === 'detail' && hasMore(b) && (editing !== page || preview) ? `#home/${b.id}` : '';
        const hit = (editing !== page || preview) ? (mode === 'link' ? safeLink(b.link?.url) : more) : '';
        const wrap = (html) => (hit ? `<a class="feature-hit" href="${esc(hit)}"${/^https?:/i.test(hit) ? ' target="_blank" rel="noopener"' : ''}>${html}</a>` : html);
        // Link-Platz (immer linksbündig): „left“ = links unter der Unterzeile, „right-<n>“ = rechts
        // vor Absatz n, „right“ = rechts unter dem Text (Standard). Im Bearbeiten-Modus mit der Maus
        // auf eine der Ablagelinien ziehen, die beim Ziehen erscheinen – oder im Editor unter „Platz“.
        const links = featureLinks(b);
        const isEdit = editing === page && !preview;
        const slot = (name, hint) => {
          if (!links.length) return '';
          const placed = links.filter(({ link }) => (link.position || 'right') === name);
          if (!isEdit) return placed.map(({ link }) => `<div class="link-place">${linkMarkup(link)}</div>`).join('');
          if (placed.length) return `<div class="link-slot filled" data-slot="${name}" data-block="${esc(b.id)}">${placed.map(({ key, link }, i) => `<div class="link-drag" draggable="true" data-block="${esc(b.id)}" data-link="${key}" title="Mit der Maus an eine andere Stelle ziehen">${linkMarkup(link)}${placed.length > 1 ? `<button type="button" class="link-order" data-action="link-order" data-block="${esc(b.id)}" data-link="${key}" aria-label="Link ${i ? 'nach oben' : 'nach unten'} verschieben" title="Link ${i ? 'nach oben' : 'nach unten'} verschieben">${i ? ui().icon.up : ui().icon.down}</button>` : ''}</div>`).join('')}</div>`;
          return `<div class="link-slot empty ${hint ? 'with-button' : ''}" data-slot="${name}" data-block="${esc(b.id)}">${hint
            ? `<button type="button" data-action="link-move" data-block="${esc(b.id)}" data-slot="${name}">${hint}</button>`
            : '<span class="link-drop" aria-hidden="true">hier ablegen</span>'}</div>`;
        };
        const parts = String(b.text || '').split(/\n{2,}/).filter((x) => x.trim());
        const textHtml = parts.map((p, i) => slot(`right-${i}`) + paragraphs(p)).join('');
        return `
          <article class="feature feature-${esc(String(b.layout || 'wide').replace('-right', ''))} ${/-right$/.test(b.layout || '') ? 'img-right' : ''} ${more ? 'has-more' : ''} ${n === '01' ? 'feature-first' : ''} ${Number(n) % 2 === 0 ? 'feature-even' : ''}" data-feature="${esc(b.id)}">
            ${(b.images || []).filter(shownImage).length ? newsCollage(b) : wrap(`<div class="feature-media">${picture(b.image, b.id, b.title)}</div>`)}
            <div class="feature-body">
              <div class="feature-left">
                <p class="feature-kicker"><span>${n}</span>${esc(b.kicker || '')}</p>
                ${wrap(`<h2>${esc(b.title)}</h2>`)}
                ${b.subtitle ? `<p class="feature-sub">${esc(b.subtitle)}</p>` : ''}
                ${slot('left', 'Link hierher')}
              </div>
              <div class="feature-right">
                <div class="feature-text ${b.textSize === 'gross' ? 'text-l' : ''}">${textHtml}</div>
                ${slot('right', 'Link hierher')}
                ${more && b.showMore !== false ? `<p class="feature-more"><a class="more-link" href="${esc(more)}">Mehr erfahren <span aria-hidden="true">→</span></a></p>` : ''}
              </div>
            </div>
          </article>`;
      }
      case 'heading':
        return `<h2 class="block-heading">${esc(b.title)}</h2>`;
      case 'text':
        if (b.id === 's-training') return `<section class="training-coach">
          <div class="training-coach-copy">${b.subtitle ? `<p class="feature-sub">${esc(b.subtitle)}</p>` : ''}
          ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}${paragraphs(b.text)}
          <div class="training-contact">${b.phone ? `<a href="tel:${esc(b.phone.replace(/[^+0-9]/g, ''))}">${esc(b.phone)}</a>` : ''}
          ${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}</div></div>
          ${b.image ? `<figure class="training-coach-photo">${picture(b.image, b.id, b.title)}</figure>` : ''}</section>`;
        return `<section class="block-text">${b.title ? `<h2>${esc(b.title)}</h2>` : ''}${paragraphs(b.text)}</section>`;
      case 'event':
        return `
          <article class="event card">
            <div class="event-side">${dateBadge(b.date)}${attachmentThumb(b)}</div>
            <div class="event-body">
              <h3>${esc(b.title)}</h3>
              <p class="muted small">${[b.time && `${esc(b.time)} Uhr`, esc(b.place)].filter(Boolean).join(' · ')}</p>
              ${b.text ? `<p class="event-text">${esc(b.text)}</p>` : ''}
            </div>
          </article>`;
      case 'post':
        return `
          <article class="post card">
            ${(b.images || []).filter(shownImage).length ? newsCollage(b) : `<div class="post-media">${picture(b.image, b.id, b.title)}${dateBadge(b.date)}</div>`}
            <div class="post-body">
              <p class="post-date">${esc(fmt(b.date, { day: 'numeric', month: 'long', year: 'numeric' }))}</p>
              <h3>${esc(b.title)}</h3>
              ${paragraphs(b.text)}
            </div>
          </article>`;
      case 'image':
        return b.original
          ? `<figure class="block-image natural ${alignClass(b.align)}">${picture(b.image, b.id, b.caption)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`
          : `<figure class="block-image card">${picture(b.image, b.id, b.caption)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
      case 'gallery': {
        const list = (b.images || []).filter((ref) => images[ref]);
        if (!list.length && editing !== page) return '';
        return `
          <section class="block-gallery">
            ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
            ${list.length
              ? `<div class="gallery-grid">${list.map((ref, i) => `<button type="button" class="gallery-item" data-action="gallery-open" data-block="${esc(b.id)}" data-index="${i}" aria-label="Foto ${i + 1} groß ansehen">${picture(ref, ref)}</button>`).join('')}</div>`
              : '<p class="muted small empty-hint">Noch keine Fotos – über den Stift Fotos hinzufügen.</p>'}
          </section>`;
      }
      case 'people':
        return `
          <section class="block-people ${b.id === 'v-vorstand' ? 'block-board' : ''}">
            ${b.title ? `<h2>${esc(b.title)}</h2>` : ''}
            <div class="people-grid">${(b.id === 'v-vorstand' ? boardPeople : b.people || []).map((p, i) => `
              <div class="person card">${b.id === 'v-vorstand' && p.avatar ? `<button type="button" class="person-dot board-photo" data-action="board-photo-open" data-index="${i}" title="Originalfoto von ${esc(p.name)} ansehen" aria-label="Originalfoto von ${esc(p.name)} ansehen"><img src="${esc(p.avatar)}" alt=""></button>` : `<span class="person-dot">${p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc((p.name || p.role || '?').split(/\s+/).filter(Boolean).map((n) => n[0]).slice(0, 2).join(''))}</span>`}<div><small>${esc(p.role)}</small><strong>${esc(p.name)}</strong>${p.phone ? `<a class="board-email" href="tel:${esc(p.phone.replace(/[^+0-9]/g, ''))}">${esc(p.phone)}</a>` : ''}${p.email ? `<a class="board-email" href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : ''}</div></div>`).join('')}
            </div>
          </section>`;
      case 'facts':
        return `<section class="block-facts">${(b.items || []).map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join('')}</section>`;
      case 'button': {
        if (b.id === 'v-mitglied-btn' || b.url === '#aufnahme') return `<div class="block-button membership-actions"><button type="button" class="btn membership-fees-button" data-action="membership-fees">Mitgliedsbeiträge</button><button type="button" class="btn membership-apply-button" data-action="membership-open">${esc(b.label || 'Zum Anmeldeformular')}</button>${b.note ? `<p class="membership-benefit">${esc(b.note)}</p>` : ''}</div>`;
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
            const photo = extra.photo && (images[extra.photo] || /^assets\//.test(extra.photo)) ? picture(extra.photo, t.name, `Teamfoto ${t.name}`) : '';
            const count = teamCounts[teamKey(t.name)] || 0;
            return `
            <a class="team team-row" href="#team/${esc(teamKey(t.name))}">
              <span class="team-thumb ${photo ? '' : 'empty'}">${photo || ui().icon.camera}${count ? `<span class="team-dot">${count}</span>` : ''}</span>
              <span class="team-name"><strong>${esc(t.name.replace(/\s*\(.*?\)/g, ''))}${/\((.*?)\)/.test(t.name) ? ` <i>${esc(t.name.match(/\((.*?)\)/)[1])}</i>` : ''}</strong><small>${esc(t.group)}</small></span>
              <span class="team-news-btn ${count ? 'has' : ''}">Mannschaftsporträt + News${count ? `<b>${count}</b>` : ''}<span aria-hidden="true">→</span></span>
              <span class="team-stand"><b class="${t.rank === '1' ? 'top' : ''}">${esc(t.rank || '–')}.</b><small>Platz · ${esc(t.points)}</small></span>
            </a>`;
          }).join('')}
        </div>
        <p class="fineprint">Stand ${esc(data.updated)} · Daten aus <a href="${esc(data.source)}" target="_blank" rel="noopener">nuLiga</a> · Antippen öffnet die Seite der Mannschaft</p>
      </section>`;
  }

  // Home-Blöcke – während der Live-Vorschau mit dem aktuellen Entwurf statt dem gespeicherten Stand
  const homeBlocks = () => site.pages.home.blocks.map((x) => (preview && x.id === preview.id ? preview.draft : x));

  // ---------- Live-Vorschau beim Bearbeiten (WYSIWYG für den Bereich, der gerade bearbeitet wird) ----------
  let previewTimer = null;
  let readDraft = null;
  let lastTab = null;
  function startLive(id, draft, read) {
    readDraft = read;
    preview = { id, draft, tab: read() };
    document.getElementById('sheet-root').classList.add('side-mode');
    document.body.classList.add('side-editing');
    document.body.classList.remove('no-scroll');
    refreshPreview(lastTab !== preview.tab || !document.querySelector(`[data-feature="${id}"]`));
  }
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => refreshPreview(false), 220);
  }
  async function refreshPreview(jump) {
    if (!preview || !readDraft) return;
    preview.tab = readDraft();
    const tabChanged = lastTab !== preview.tab;
    lastTab = preview.tab;
    const y = window.scrollY;
    await ui().renderView();
    if (jump || tabChanged) {
      if (preview.tab === 'album') { window.scrollTo(0, 0); return; }
      const el = preview.tab === 'sub' ? document.querySelector('.story') : document.querySelector(`[data-feature="${preview.id}"]`);
      if (el) window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 150));
    } else window.scrollTo(0, y);
  }
  function endLive() {
    if (!preview) return;
    preview = null; readDraft = null; lastTab = null;
    clearTimeout(previewTimer);
    const root = document.getElementById('sheet-root');
    root.classList.remove('side-mode', 'peek');
    document.body.classList.remove('side-editing');
  }
  // Handy: Editor-Blatt nach unten wegschieben (Vorschau) – oben bleibt die Kopfzeile sichtbar
  function togglePeek(btn) {
    const root = document.getElementById('sheet-root');
    const sheet = root.querySelector('.sheet');
    const on = root.classList.toggle('peek');
    if (on) { sheet.dataset.keep = sheet.scrollTop; sheet.scrollTop = 0; } else sheet.scrollTop = Number(sheet.dataset.keep || 0);
    btn.textContent = on ? 'Weiter bearbeiten' : 'Vorschau ansehen';
  }
  // Handy: weggeschobenes Editor-Blatt per Tipp auf die sichtbare Kopfzeile zurückholen
  document.addEventListener('click', (e) => {
    const root = document.getElementById('sheet-root');
    if (!root || !root.classList.contains('peek') || e.target.closest('.sheet-close, [data-ed-peek]') || !e.target.closest('.sheet')) return;
    e.preventDefault();
    const b = root.querySelector('[data-ed-peek]');
    if (b) togglePeek(b); else root.classList.remove('peek');
  }, true);
  // Wird das Fenster geschlossen (Kreuz, Abbrechen), endet die Vorschau und der gespeicherte Stand erscheint wieder.
  new MutationObserver(() => {
    const root = document.getElementById('sheet-root');
    if (preview && root && !root.querySelector('[data-editor=block]')) { endLive(); ui().renderView(); }
  }).observe(document.getElementById('sheet-root') || document.body, { childList: true });

  // ---------- Unterseite eines Home-Themas („Mehr erfahren“) ----------
  const hasMore = (b) => Boolean(b.more && ((b.more.text || '').trim() || (b.more.images || []).length || b.more.quote));
  const safeLink = (url) => /^(#|https?:\/\/)/i.test(url || '') ? url : '';
  function featureLinks(b) {
    const list = [];
    if (safeLink(b.link?.url)) list.push({ key: 'main', link: b.link });
    if (b.album?.enabled) list.push({ key: 'album', link: { ...b.album, label: b.album.label || 'Fotos der Veranstaltung', url: `#home/${b.id}/fotos`, style: 'chip', icon: b.album.icon || 'camera' } });
    return list.sort((a, z) => (a.link.order || 0) - (z.link.order || 0));
  }
  const shownImage = (ref) => ref && (images[ref] || /^assets\//.test(ref) || /^ph:/.test(ref));

  // Fotokollage: wechselnde Kachelgrößen, damit es nach Magazin aussieht – Antippen zeigt das Foto groß.
  const alignClass = (a) => `align-${a === 'left' || a === 'right' ? a : 'center'}`;
  function collage(list, blockId, original = false, align = 'center') {
    const imgs = list.filter(shownImage);
    if (!imgs.length) return '';
    return `
      <div class="collage ${original ? `natural ${alignClass(align)}` : ''} collage-${Math.min(imgs.length, 5)}">
        ${imgs.map((ref, i) => `
          <button type="button" class="collage-item" data-action="collage-open" data-block="${esc(blockId)}" data-index="${i}" aria-label="Foto ${i + 1} groß ansehen">
            ${picture(ref, ref, '')}
          </button>`).join('')}
      </div>`;
  }

  function newsCollage(b) {
    const refs = (b.images || []).filter(shownImage).slice(0, 100);
    const preview = refs.slice(0, 5);
    return `<div class="news-collage-wrap"><div class="collage news-collage collage-${preview.length}">${preview.map((ref, i) => `<button type="button" class="collage-item" data-action="news-gallery" data-block="${esc(b.id)}" aria-label="Fotokollage mit ${refs.length} Fotos ansehen">${picture(ref, ref, b.title)}${i === preview.length - 1 && refs.length > 5 ? `<span class="photo-count">+${refs.length - 5}</span>` : ''}</button>`).join('')}</div>${b.type === 'post' ? dateBadge(b.date) : ''}</div>`;
  }

  // Großer Textanfang (Initiale): die ersten n Zeichen des ersten Absatzes groß und rot (0 = aus).
  // Gezählt werden nur sichtbare Zeichen; an einer Formatierung endet der große Anfang.
  function leadLetters(html, n) {
    if (!n) return html;
    const start = html.indexOf('<p>');
    if (start !== 0) return html;
    let i = 3; let count = 0;
    while (i < html.length && count < n) {
      if (html[i] === '<') break;
      if (html[i] === '&') { const end = html.indexOf(';', i); i = end > i ? end + 1 : i + 1; } else i++;
      count++;
    }
    while (i > 3 && /\s/.test(html[i - 1])) i--;   // kein Leerzeichen am Ende des großen Anfangs
    if (i <= 3) return html;
    return `<p><span class="lead-letters">${html.slice(3, i)}</span>${html.slice(i)}`;
  }

  // Magazin-Seite (Unterseite der Home-Themen und Mannschaftsporträt) aus einem Block mit `more`
  const storyIndex = {};   // Block je Kennung – für Großansicht von Titelfotos und Kollage
  function storyHtml(b, { n = '', editHtml = '', closeHref = '#home', backLabel = 'Zur Startseite', partner = '' } = {}) {
    const { icon } = ui();
    storyIndex[b.id] = b;
    const more = b.more || {};
    const parts = String(more.text || '').split(/\n{2,}/);
    const cut = Math.min(2, parts.length);
    const size = b.textSize === 'gross' ? 'text-l' : '';
    // Titelbild: wie Startseite (bzw. Teamfoto) oder eigene Fotos; breit, im Originalformat oder 2–4 Quadrate
    const own = more.heroSource === 'own' ? (more.heroImages || []).filter(shownImage) : [];
    const mode = more.heroMode || 'wide';
    const heroRefs = own.length ? own : [b.image];
    const seed = own.length ? own[0] : b.id;
    const sideImage = !own.length && mode === 'wide' && /^(portrait|square)/.test(b.layout || '');
    let heroHtml = '';
    if (!own.length && !b.image && b.noPlaceholder) heroHtml = '';
    else if ((b.images || []).filter(shownImage).length && !own.length) {
      heroHtml = newsCollage(b);
    } else if (mode === 'squares' && heroRefs.length >= 2) {
      heroHtml = `<div class="story-squares n${heroRefs.length}">${heroRefs.map((r, i) => `<button type="button" class="story-square" data-action="hero-open" data-block="${esc(b.id)}" data-index="${i}" aria-label="Foto groß ansehen">${picture(r, r)}</button>`).join('')}</div>`;
    } else if (mode === 'original') {
      heroHtml = `<div class="story-photo natural ${alignClass(more.heroAlign)}">${picture(heroRefs[0], seed, b.title)}</div>`;
    } else if (!sideImage) {
      heroHtml = `<div class="story-photo">${picture(heroRefs[0], seed, b.title)}</div>`;
    }
    return `
      <article class="story">
        <div class="story-tools">
          ${editHtml}
          <a class="view-close" href="${esc(closeHref)}" aria-label="Zurück">${icon.close}</a>
        </div>
        ${heroHtml}
        <div class="story-grid ${sideImage ? 'with-side' : ''}">
          <header class="story-head">
            ${sideImage ? `<div class="story-side-img ${esc(String(b.layout).replace('-right', ''))}">${picture(b.image, b.id, b.title)}</div>` : ''}
            <p class="feature-kicker">${n ? `<span>${esc(n)}</span>` : ''}${esc(b.kicker || '')}</p>
            <h1>${esc(b.title)}</h1>
            ${b.subtitle ? `<p class="feature-sub">${esc(b.subtitle)}</p>` : ''}
            ${b.link && b.link.url ? `<div class="story-link">${linkMarkup(b.link)}</div>` : ''}
          </header>
          <div class="story-body">
            <div class="story-text ${size}">${leadLetters(paragraphs(parts.slice(0, cut).join('\n\n') || b.text || ''), more.dropcap == null ? 1 : Number(more.dropcap))}</div>
            ${more.quote ? `<blockquote class="story-quote"><p>${esc(more.quote)}</p>${more.quoteBy ? `<cite>${esc(more.quoteBy)}</cite>` : ''}</blockquote>` : ''}
            ${parts.length > cut ? `<div class="story-text ${size}">${paragraphs(parts.slice(cut).join('\n\n'))}</div>` : ''}
          </div>
        </div>
        ${collage(more.images || [], b.id, Boolean(more.original), more.collageAlign)}
        <div class="story-foot">
          <a class="more-link back" href="${esc(closeHref)}"><span aria-hidden="true">←</span> ${esc(backLabel)}</a>
        </div>
      </article>
      ${partner}`;
  }

  async function featureDetail(id) {
    const { icon, state, partnerSlot } = ui();
    const b = homeBlocks().find((x) => x.id === id);
    if (!b) return `${ui().viewHead('Home', 'Diesen Beitrag gibt es nicht mehr.', false)}<p><a class="btn" href="#home">Zur Startseite</a></p>`;
    const admin = state.member && state.member.isAdmin;
    return storyHtml(b, {
      n: String(homeBlocks().filter((x) => x.type === 'feature').indexOf(b) + 1).padStart(2, '0'),
      editHtml: admin ? `<button type="button" class="view-close" data-action="feature-edit" data-id="${esc(b.id)}" aria-label="Bearbeiten">${icon.pencil}</button>` : '',
      partner: partnerSlot('home', site.pages.home.partnerKicker || 'Präsentiert von'),
    });
  }

  function albumDetail(id) {
    const b = homeBlocks().find((x) => x.id === id);
    if (!b?.album?.enabled) return `<p>Diese Fotokollage ist nicht verfügbar.</p><a href="#home">Zur Startseite</a>`;
    const album = b.album;
    const gallery = { id: `album-${b.id}`, title: album.title || b.title, more: { images: (album.images || []).slice(0, 100) } };
    storyIndex[gallery.id] = gallery;
    const admin = ui().state.member?.isAdmin;
    return `<article class="story album-page"><div class="story-tools">${admin ? `<button type="button" class="view-close" data-action="album-edit" data-id="${esc(b.id)}" aria-label="Fotokollage bearbeiten">${ui().icon.pencil}</button>` : ''}<a class="view-close" href="#home" aria-label="Zurück zur Startseite">${ui().icon.close}</a></div><h1>${esc(album.title || b.title)}</h1>${gallery.more.images.length ? collage(gallery.more.images, gallery.id, Boolean(album.original)) : '<p class="muted">Noch keine Fotos veröffentlicht.</p>'}<div class="story-foot"><a class="more-link" href="#home">Zur Startseite</a></div></article>`;
  }

  // ---------- Seite ----------
  async function pageView(key) {
    await ensure();
    if (key === 'home' && preview?.tab === 'album') return albumDetail(preview.id);
    if (key === 'home' && preview && preview.tab === 'sub') return featureDetail(preview.id);
    if (key === 'home' && !preview && location.hash.split('/')[2] === 'fotos') return albumDetail(location.hash.split('/')[1]);
    if (key === 'home' && !preview && location.hash.split('/')[1]) return featureDetail(location.hash.split('/')[1]);
    const { state, icon, partnerSlot } = ui();
    const page = site.pages[key];
    const edit = editing === key && state.member && state.member.isAdmin && !preview;
    const admin = state.member && state.member.isAdmin;
    const training = key === 'sport' && location.hash.split('/')[1] === 'training';
    const list = (key === 'home' ? homeBlocks() : page.blocks).filter((b) => (!b._new || (preview && b.id === preview.id))
      && (key !== 'sport' || (training ? b.type !== 'teams' : b.type === 'teams')));
    const legal = key === 'impressum' || key === 'satzung';
    const blocks = edit
      ? list.map((b, i) => editWrap(b, i, list.length, renderBlock(b, key))).join('')
      : legal ? `<div class="legal-document">${list.map(b => renderBlock(b, key)).join('')}</div>` : layoutBlocks(list, key);
    return `
      <div class="site-page ${edit ? 'editing-page' : ''} ${key === 'home' ? `home-look-${homeLook()}` : ''}" data-page="${key}">
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
        ${key === 'sport' ? `<nav class="seg sport-switch" aria-label="Sportbereiche">
          <a class="${training ? '' : 'on'}" href="#sport" ${training ? '' : 'aria-current="page"'}>Mannschaften</a>
          <a class="${training ? 'on' : ''}" href="#sport/training" ${training ? 'aria-current="page"' : ''}>Training</a>
        </nav>` : ''}
        ${key === 'home' ? `<div class="home-masthead"><span>Neu im Club</span><span>${esc(new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }))}</span></div>` : ''}
        ${key === 'home' && edit ? lookPicker() : ''}
        ${blocks}
        ${edit && key === 'home' ? homeAddButton(list) : ''}
        ${edit && key !== 'home' && (key !== 'sport' || training) ? `<button type="button" class="btn block add-section" data-action="block-new">${icon.plus} Baustein hinzufügen</button>` : ''}
        ${edit || legal ? '' : partnerSlot(key, page.partnerKicker || 'Präsentiert von')}
      </div>`;
  }
  // Home: Look der Startseite – im Admin wählbar, gilt für alle Besucher (Standard: Wechselspiel)
  const HOME_LOOKS = [['6', 'Wechselspiel', 'Foto und Text je zur Hälfte, Seiten wechseln, große Ziffer – ruhig und gut lesbar'],
    ['1', 'Klassisch', 'Breite, Hoch- und Quadratfotos wie im Editor gewählt'],
    ['3', 'Magazin', 'Zentrierte Serifen-Überschriften, gerahmte Fotos, rote Trenner']];
  const MAX_HOME_FEATURES = 10;
  function homeAddButton(list) {
    const n = list.filter((b) => b.type === 'feature').length;
    return n >= MAX_HOME_FEATURES
      ? `<p class="muted small add-limit">Die Startseite zeigt höchstens ${MAX_HOME_FEATURES} Themen. Für ein neues Thema bitte zuerst eines löschen.</p>`
      : `<button type="button" class="btn block add-section add-feature" data-action="block-add" data-type="feature">${ui().icon.plus} Neues Thema <small>${n} von ${MAX_HOME_FEATURES}</small></button>`;
  }
  const homeLook = () => (HOME_LOOKS.some(([k]) => k === site?.homeLook) ? site.homeLook : '6');
  function lookPicker() {
    const cur = homeLook();
    return `<section class="look-picker" aria-label="Look der Startseite">
      <h2>Look der Startseite</h2>
      <div class="look-options">${HOME_LOOKS.map(([k, l, d]) => `<button type="button" class="${k === cur ? 'on' : ''}" data-action="home-look" data-look="${k}" aria-pressed="${k === cur}">
        <b>${esc(l)}${k === '6' ? ' <small>Standard</small>' : ''}</b><span>${esc(d)}</span></button>`).join('')}</div>
      <p class="muted small">Gilt für alle Besucher. Die Seite darunter zeigt sofort den gewählten Look – so bearbeitest du genau, was die Besucher sehen.</p>
    </section>`;
  }
  ['home', 'aktuell', 'sport', 'verein', 'impressum', 'satzung'].forEach((key) => { TFB.views[routeOf(key)] = () => pageView(key); });

  // Ansicht (nicht Bearbeiten): Bausteine zu Gruppen bündeln, damit sie sich auf
  // breiten Bildschirmen in Spalten ordnen. Termine (mit ihrer Überschrift davor)
  // wandern in eine eigene Spalte – auf dem Handy stehen sie oben.
  let aktuellTab = 'news';
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
      else units.push({ kind: b.id === 's-training' ? 'trainer' : b.type === 'text' ? 'text' : b.type, html: renderBlock(b, key) });
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
    if (key === 'aktuell' && aside.length) {
      return `
        <div class="seg aktuell-switch" role="tablist">
          ${[['news', 'News'], ['dates', 'Save the Date']].map(([v, l]) => `<button type="button" role="tab" aria-selected="${aktuellTab === v}" class="${aktuellTab === v ? 'on' : ''}" data-action="aktuell-tab" data-tab="${v}">${l}</button>`).join('')}
        </div>
        <div class="page-grid news-dates show-${aktuellTab}">
          <div class="page-main col-news">${html}</div>
          <aside class="page-aside col-dates">${aside.map((b) => renderBlock(b, key)).join('')}</aside>
        </div>`;
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

  // ---------- Clubgeflüster & Insider News ----------
  // Mitglieder schreiben selbst: Text plus bis zu 6 Fotos. Lesen darf jeder, schreiben nur Mitglieder;
  // Insider News nur die gemeldeten Spieler der Mannschaft. Jugendliche nach Einverständnis der Eltern.
  const FEED_PAGE = 10;
  const feedOpen = {};          // „Ältere anzeigen“ je Bereich
  const agoText = (iso) => {
    const min = Math.round((Date.now() - new Date(iso)) / 60000);
    if (min < 1) return 'gerade eben';
    if (min < 60) return `vor ${min} Min.`;
    if (min < 1440) return `vor ${Math.round(min / 60)} Std.`;
    const d = Math.round(min / 1440);
    if (d < 7) return d === 1 ? 'gestern' : `vor ${d} Tagen`;
    return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  };
  // Datum und Uhrzeit eines Beitrags, z. B. „11. Okt. · 09:12“ (älter als dieses Jahr: mit Jahr)
  const whenText = (iso) => {
    const d = new Date(iso);
    const sameYear = d.getFullYear() === new Date().getFullYear();
    const day = d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) });
    return `${day} · ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  };
  const postText = (t) => esc(t).replace(/(https?:\/\/[^\s<]+)/g, '<a class="inline-link" href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g, '<br>');
  const teamLabel = (key) => { const f = findTeam(key); return f ? f.team.name.replace(/\s*\(.*?\)/g, '') : key; };
  const initialsOf = (name) => String(name || '?').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase();

  function postHtml(p, loggedIn) {
    const imgs = (p.images || []).filter(shownImage);
    return `
      <article class="fpost ${p.hidden ? 'is-hidden' : ''} ${p.teaser ? 'is-teaser' : ''}" data-post="${esc(p.id)}">
        <header class="fpost-head">
          <span class="fpost-avatar">${p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc(initialsOf(p.author))}</span>
          <span class="fpost-who"><b>${esc(p.author)}</b>
            <small>${esc(whenText(p.createdAt))}${p.editedAt ? ' · bearbeitet' : ''}${p.fromClub ? ' · auch im Clubgeflüster' : ''}${p.teaser ? ` · <a href="#team/${esc(p.team)}">Insider News · ${esc(teamLabel(p.team))}</a>` : ''}${p.hidden ? ' · <em>ausgeblendet</em>' : ''}</small></span>
        </header>
        ${p.text ? `<div class="fpost-text">${postText(p.text)}</div>` : ''}
        ${imgs.length ? `<div class="message-collage n${imgs.length}">${imgs.map((ref, index) => `<button type="button" class="message-photo" data-action="post-gallery" data-id="${esc(p.id)}" data-index="${index}" aria-label="Foto ${index + 1} von ${imgs.length} ansehen">${picture(ref, ref, '')}</button>`).join('')}</div>` : ''}
        ${loggedIn ? `<footer class="fpost-tools">
          ${p.mine ? `<button type="button" data-action="post-edit" data-id="${esc(p.id)}">Bearbeiten</button><button type="button" data-action="post-delete" data-id="${esc(p.id)}">Löschen</button>` : ''}
          ${p.canModerate && !p.mine ? `<button type="button" data-action="post-hide" data-id="${esc(p.id)}" data-hidden="${p.hidden ? '0' : '1'}">${p.hidden ? 'Wieder zeigen' : 'Ausblenden (Admin)'}</button>` : ''}
          ${!p.mine && !p.canModerate ? `<button type="button" data-action="post-report" data-id="${esc(p.id)}">Melden</button>` : ''}
        </footer>` : ''}
      </article>`;
  }
  let postCache = {};
  async function feedSection(scope, opts = {}) {
    const { api, state, icon } = ui();
    const copy = chatText();
    const list = await api.posts(scope, { withTeams: Boolean(opts.withTeams) });
    list.forEach((p) => { postCache[p.id] = p; });
    const may = await api.canWrite(scope);
    const isTeam = scope.startsWith('team:');
    const shown = feedOpen[scope] ? list : list.slice(0, FEED_PAGE);
    const roster = isTeam && state.member ? await api.teamRoster(scope.slice(5)) : [];
    let action = '';
    if (!state.member) action = `<button type="button" class="btn small" data-action="login">${esc(copy.loginLabel)}</button>`;
    else if (may.ok || may.reason === 'rules' || may.reason === 'parents') action = `<button type="button" class="btn signal small" data-action="post-new" data-scope="${esc(scope)}">${icon.plus} ${esc(copy.writeLabel)}</button>`;
    else if (may.reason === 'team') action = '<small class="muted">Schreiben dürfen die Spieler dieser Mannschaft.</small>';
    const overviewLink = opts.chat ? `<a class="btn small" href="#chat/alle">${esc(copy.allLabel)} ${icon.chevron}</a>` : `<a class="feed-overview" href="${isTeam ? '#gefluester/' + esc(scope.slice(5)) : '#chat/alle'}" title="Übersicht aller Beiträge mit Suche und Filtern" aria-label="Übersicht aller Beiträge">${icon.chevron}</a>`;
    return `
      <section class="feed" data-scope="${esc(scope)}">
        <header class="feed-head">
          ${opts.chat ? '' : `<h2 class="block-heading">${esc(isTeam ? copy.teamLabel : copy.feedTitle)}</h2>`}
          <div class="feed-sub">
            <p class="muted small">${isTeam ? `Hier schreiben die Spieler${opts.teamName ? ` von ${esc(opts.teamName)}` : ''} – Spielberichte, Touren, Training.` : esc(copy.feedIntro)}</p>
            <div class="feed-actions">${action}${overviewLink}</div>
          </div>
        </header>
        ${shown.length ? `<div class="feed-list">${shown.map((p) => postHtml(p, Boolean(state.member))).join('')}</div>`
          : `<p class="feed-empty muted">${isTeam ? 'Noch keine Insider News – schreibt den ersten Bericht!' : esc(copy.feedEmpty)}</p>`}
        ${list.length > shown.length ? `<button type="button" class="link center" data-action="feed-more" data-scope="${esc(scope)}">${esc(copy.olderLabel)} (${list.length - shown.length})</button>` : ''}
        ${isTeam && state.member ? `<details class="feed-roster"><summary>Wer darf hier schreiben?</summary><p class="small muted">Die gemeldeten Spieler der Mannschaft – im Echtbetrieb automatisch aus der nuLiga-Spielermeldung – und die Admins${roster.length ? `: ${esc(roster.join(', '))}` : '.'}</p></details>` : ''}
      </section>`;
  }

  // Übersicht aller Beiträge (Clubgeflüster + Insider News) – kompakt, mit Suche und Filtern
  async function overviewView() {
    await ensure();
    const { api, icon, state } = ui();
    const copy = chatText();
    const preset = location.hash.startsWith('#chat') ? '' : location.hash.split('/')[1] || '';
    const list = await api.posts('club', { withTeams: true });
    list.forEach((p) => { postCache[p.id] = p; });
    const teamsIn = [...new Set(list.map((p) => [p.team, ...(p.alsoTeams || [])]).flat().filter(Boolean))]
      .map((k) => [k, teamLabel(k)]).sort((a, b) => a[1].localeCompare(b[1], 'de'));
    const authors = [...new Set(list.map((p) => p.author))].sort((a, b) => a.localeCompare(b, 'de'));
    const card = (p) => {
      const imgs = (p.images || []).filter(shownImage);
      const teams = [p.team, ...(p.alsoTeams || [])].filter(Boolean);
      return `
        <button type="button" class="mini ${p.hidden ? 'is-hidden' : ''}" data-action="post-open" data-id="${esc(p.id)}"
          data-author="${esc(p.author.toLowerCase())}" data-text="${esc(String(p.text || '').toLowerCase())}"
          data-teams="${esc(teams.join(' '))}" data-where="${p.team ? 'team' : 'club'}" data-photos="${imgs.length}" data-at="${esc(p.createdAt)}">
          ${imgs.length ? `<span class="message-collage n${imgs.length}">${imgs.map(ref => `<span class="message-photo">${picture(ref, ref, '')}</span>`).join('')}</span>` : ''}
          <span class="mini-head"><span class="fpost-avatar">${p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc(initialsOf(p.author))}</span>
            <span><b>${esc(p.author)}</b><small>${esc(whenText(p.createdAt))}</small></span></span>
          <span class="mini-where">${p.team ? `${esc(copy.teamLabel)} · ${esc(teamLabel(p.team))}` : esc(copy.feedTitle)}</span>
          ${p.text ? `<span class="mini-text">${esc(p.text)}</span>` : ''}
        </button>`;
    };
    return `
      <div class="overview">
        <header class="view-head page-head">
          <div><p class="page-kicker">${esc(copy.overviewKicker)}</p><h1>${esc(copy.overviewTitle)}</h1><p class="muted">${esc(copy.overviewIntro)}</p></div>
          <div class="chat-page-tools">${chatEditButton()}<a class="view-close" href="${preset ? '#team/' + esc(preset) : '#chat'}" aria-label="Zurück">${icon.close}</a></div>
        </header>
        <div class="ov-filters">
          <label class="ov-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input type="search" data-ov="q" placeholder="${esc(copy.searchPlaceholder)}" list="ov-authors" autocomplete="off"></label>
          <datalist id="ov-authors">${authors.map((a) => `<option value="${esc(a)}">`).join('')}</datalist>
          <select data-ov="where">
            <option value="">${esc(copy.allAreas)}</option>
            <option value="club">${esc(copy.clubFilter)}</option>
            <option value="team">${esc(copy.teamFilter)}</option>
            ${teamsIn.map(([k, n]) => `<option value="t:${esc(k)}" ${preset === k ? 'selected' : ''}>${esc(copy.teamLabel)} · ${esc(n)}</option>`).join('')}
          </select>
          <div class="seg ov-period">${[['', copy.periodAll], ['7', copy.periodWeek], ['30', copy.periodMonth]].map(([v, l]) => `<button type="button" class="${v ? '' : 'on'}" data-ovperiod="${v}">${esc(l)}</button>`).join('')}</div>
          <label class="meet-check ov-photos"><input type="checkbox" data-ov="photos"><span>${esc(copy.photosOnly)}</span></label>
        </div>
        <p class="ov-count muted small" data-ovcount></p>
        <div class="mini-grid">${list.map(card).join('')}</div>
        <p class="ov-empty muted" hidden>${esc(copy.overviewEmpty)}</p>
        ${state.member ? '' : `<p class="fineprint">${esc(copy.guestNote)}</p>`}
      </div>`;
  }
  TFB.views.gefluester = overviewView;
  TFB.views.chat = async () => {
    if (location.hash.split('/')[1] === 'alle') return overviewView();
    await ensure();
    return `<div class="chat-page"><header class="view-head page-head"><div><p class="page-kicker">${esc(chatText().feedTitle)}</p><h1>${esc(chatText().title)}</h1></div>${chatEditButton()}</header>
      <div class="chat-stream">${await feedSection('club', { withTeams: true, chat: true })}</div>
      ${ui().partnerSlot('aktuell', 'Der Chat wird dir präsentiert von')}</div>`;
  };
  let ovPeriod = '';
  function applyOverviewFilters() {
    const root = document.querySelector('.overview');
    if (!root) return;
    const q = (root.querySelector('[data-ov=q]').value || '').trim().toLowerCase();
    const where = root.querySelector('[data-ov=where]').value;
    const photos = root.querySelector('[data-ov=photos]').checked;
    const since = ovPeriod ? Date.now() - Number(ovPeriod) * 864e5 : 0;
    let n = 0;
    root.querySelectorAll('.mini').forEach((c) => {
      const ok = (!q || c.dataset.author.includes(q) || c.dataset.text.includes(q))
        && (!where || (where === 'club' && c.dataset.where === 'club') || (where === 'team' && c.dataset.where === 'team')
          || (where.startsWith('t:') && c.dataset.teams.split(' ').includes(where.slice(2))))
        && (!photos || Number(c.dataset.photos) > 0)
        && (!since || new Date(c.dataset.at).getTime() >= since);
      c.hidden = !ok;
      if (ok) n++;
    });
    root.querySelector('[data-ovcount]').textContent = `${n} ${n === 1 ? chatText().countOne : chatText().countMany}`;
    root.querySelector('.ov-empty').hidden = n > 0;
  }
  document.addEventListener('input', (e) => { if (e.target.closest && e.target.closest('.ov-filters')) applyOverviewFilters(); });
  document.addEventListener('change', (e) => { if (e.target.closest && e.target.closest('.ov-filters')) applyOverviewFilters(); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ovperiod]');
    if (!b) return;
    ovPeriod = b.dataset.ovperiod;
    document.querySelectorAll('[data-ovperiod]').forEach((x) => x.classList.toggle('on', x === b));
    applyOverviewFilters();
  });
  // Nach dem Aufbau einmal filtern (z. B. voreingestellte Mannschaft)
  new MutationObserver(() => { const r = document.querySelector('.overview:not([data-ready])'); if (r) { r.dataset.ready = '1'; ovPeriod = ''; applyOverviewFilters(); } })
    .observe(document.body, { childList: true, subtree: true });
  // Einzelnen Beitrag aus der Übersicht groß öffnen
  function openPost(id) {
    const p = postCache[id];
    if (!p) return;
    ui().openSheet(`<div class="editor post-sheet">${postHtml(p, Boolean(ui().state.member))}</div>`);
  }

  // Schreiben: Hinweise (einmalig) → bei Jugendlichen Einverständnis der Eltern → Beitrag mit bis zu 6 Fotos
  async function openCompose(scope, editId = null) {
    const { api, openSheet, closeSheet, toast, state } = ui();
    if (!state.member) { toast('Bitte zuerst anmelden'); return; }
    const may = await api.canWrite(scope);
    if (!editId && may.reason === 'team') { toast('Insider News schreiben die Spieler dieser Mannschaft.'); return; }
    if (!editId && may.reason === 'parents') return openParentConsent(scope);
    if (!editId && may.reason === 'rules') return openRules(scope);
    const existing = editId ? postCache[editId] : null;
    const draft = { text: existing ? existing.text : '', images: existing ? (existing.images || []).filter(shownImage) : [], alsoTeams: existing ? (existing.alsoTeams || []) : [] };
    const myTeams = scope === 'club' ? (state.member.teams || []) : [];
    const allTeams = () => [...new Map(((TFB.teams && TFB.teams.seasons) || []).flatMap((x) => x.teams)
      .map((t) => [teamKey(t.name), t.name.replace(/\s*\(.*?\)/g, '')])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'de'));
    const isTeam = scope.startsWith('team:');
    const render = () => {
      openSheet(`
        <form class="editor compose" data-compose novalidate>
          <h2>${existing ? 'Beitrag bearbeiten' : isTeam ? `${esc(chatText().teamLabel)} · ${esc(teamLabel(scope.slice(5)))}` : esc(chatText().feedTitle)}</h2>
          <textarea name="text" rows="5" maxlength="2000" placeholder="${isTeam ? 'Wie lief das Spiel? Was war los bei der Tour?' : 'Was gibt’s Neues im Club?'}">${esc(draft.text)}</textarea>
          <div class="compose-photos">
            ${draft.images.map((ref, i) => `<div class="gallery-thumb">${picture(ref, ref)}${frameButton(ref, true)}<button type="button" data-cremove="${i}" aria-label="Foto entfernen">×</button>
              <span class="thumb-move"><button type="button" data-cmove="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach vorne">‹</button><button type="button" data-cmove="${i}" data-dir="1" ${i === draft.images.length - 1 ? 'disabled' : ''} aria-label="Nach hinten">›</button></span></div>`).join('')}
            ${draft.images.length < 6 ? `<label class="gallery-add">${ui().icon.camera}<span>Foto${draft.images.length ? '' : 's'}</span><input type="file" accept="image/*" multiple data-cphoto hidden></label>` : ''}
          </div>
          <p class="small muted">Bis zu 6 Fotos.</p>
          ${draft.images.length ? '<label class="meet-check"><input type="checkbox" name="photoOk" required><span>Die abgebildeten Personen sind mit der Veröffentlichung einverstanden.</span></label>' : ''}
          ${scope === 'club' && (myTeams.length || state.member.isAdmin) ? `<div class="compose-teams">
            ${[...new Set([...myTeams, ...draft.alsoTeams])].map((k) => `<label class="meet-check"><input type="checkbox" name="alsoTeam" value="${esc(k)}" ${draft.alsoTeams.includes(k) ? 'checked' : ''}><span>Auch in den <b>Insider News · ${esc(teamLabel(k))}</b> zeigen</span></label>`).join('')}
            ${state.member.isAdmin ? `<label class="field compose-team-add"><span>Auch in einer anderen Mannschaft zeigen (Admin)</span>
              <select data-addteam><option value="">Mannschaft wählen …</option>${allTeams().filter(([k]) => !myTeams.includes(k) && !draft.alsoTeams.includes(k)).map(([k, n]) => `<option value="${esc(k)}">${esc(n)}</option>`).join('')}</select></label>` : ''}
          </div>` : ''}
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn signal block big">${existing ? 'Speichern' : 'Veröffentlichen'}</button>
          <p class="fineprint">Öffentlich sichtbar mit deinem Namen${state.member.isMinor ? ' (Vorname und Anfangsbuchstabe)' : ''}.</p>
        </form>`);
      const form = document.querySelector('[data-compose]');
      const keep = () => {
        draft.text = form.elements.text.value;
        if (myTeams.length) draft.alsoTeams = [...form.querySelectorAll('[name=alsoTeam]:checked')].map((x) => x.value);
      };
      form.addEventListener('click', (e) => {
        const rm = e.target.closest('[data-cremove]');
        if (rm) { keep(); draft.images.splice(Number(rm.dataset.cremove), 1); render(); return; }
        const mv = e.target.closest('[data-cmove]');
        if (mv) { keep(); const a = Number(mv.dataset.cmove); const b = a + Number(mv.dataset.dir); [draft.images[a], draft.images[b]] = [draft.images[b], draft.images[a]]; render(); }
      });
      form.addEventListener('change', async (e) => {
        if (e.target.matches('[data-addteam]') && e.target.value) { keep(); draft.alsoTeams.push(e.target.value); render(); return; }
        if (!e.target.matches('[data-cphoto]') || !e.target.files.length) return;
        keep();
        const files = [...e.target.files];
        if (files.length + draft.images.length > 6) { toast('Pro Beitrag sind höchstens 6 Fotos möglich.'); e.target.value = ''; return; }
        try {
          for (const file of files) {
            const img = await ui().loadImage(file);
            const url = ui().largeImage(img, 1600);
            const ref = await api.putMemberImage(url);
            images[ref] = url;
            draft.images.push(ref);
          }
          render();
        } catch (err) { toast(err.message); }
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        keep();
        const err = form.querySelector('.form-error');
        if (draft.images.length && !form.elements.photoOk.checked) { err.textContent = 'Bitte bestätigen, dass die Abgebildeten einverstanden sind.'; return; }
        try {
          if (existing) await api.editPost(existing.id, draft);
          else await api.addPost({ scope, ...draft });
          closeSheet();
          toast(existing ? 'Gespeichert' : 'Veröffentlicht – danke!', true);
          ui().renderView();
        } catch (ex) { err.textContent = ex.message; }
      });
      form.elements.text.focus();
    };
    render();
  }
  function openRules(scope) {
    const { openSheet, closeSheet, api } = ui();
    openSheet(`
      <form class="editor" data-rules novalidate>
        <h2>Kurz vorab</h2>
        <p class="muted">Clubgeflüster und Insider News sind öffentlich – jeder Besucher kann sie lesen. Damit es für alle angenehm bleibt:</p>
        <ul class="rules-list">
          <li>Freundlich und fair bleiben – wie auf dem Platz.</li>
          <li>Fotos von anderen nur, wenn sie einverstanden sind.</li>
          <li>Keine Werbung, keine privaten Daten (Telefonnummern, Adressen).</li>
          <li>Der Vorstand kann Beiträge ausblenden.</li>
        </ul>
        <label class="meet-check"><input type="checkbox" name="ok"><span>Verstanden – ich halte mich daran.</span></label>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn signal block">Weiter zum Schreiben</button>
      </form>`);
    const form = document.querySelector('[data-rules]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.elements.ok.checked) { form.querySelector('.form-error').textContent = 'Bitte kurz bestätigen.'; return; }
      ui().state.member = await api.acceptFeedRules();
      closeSheet();
      openCompose(scope);
    });
  }
  function openParentConsent(scope) {
    const { openSheet, closeSheet, api, state } = ui();
    openSheet(`
      <form class="editor" data-parents novalidate>
        <h2>Hallo ${esc(state.member.firstName)}! 👋</h2>
        <p>Schön, dass du mitschreiben willst. Weil du noch nicht 18 bist, brauchen wir einmal das <b>Einverständnis deiner Eltern</b>.</p>
        <p class="muted small">Deine Beiträge erscheinen mit Vorname und Anfangsbuchstaben (z. B. „${esc(state.member.firstName)} ${esc(state.member.lastName[0])}.“). Deine Eltern können das Einverständnis jederzeit beim Vorstand zurückziehen.</p>
        <label class="field"><span>Name eines Elternteils</span><input name="parent" autocomplete="off" placeholder="Vor- und Nachname"></label>
        <label class="meet-check"><input type="checkbox" name="ok"><span>Mein Elternteil hat das gelesen und ist einverstanden, dass ich Beiträge und Fotos veröffentliche.</span></label>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn signal block">Einverständnis speichern</button>
        <p class="fineprint">Im Echtbetrieb bekommt der Elternteil zusätzlich eine E-Mail zur Bestätigung.</p>
      </form>`);
    const form = document.querySelector('[data-parents]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = form.querySelector('.form-error');
      if (!form.elements.ok.checked) { err.textContent = 'Bitte das Häkchen setzen.'; return; }
      try {
        ui().state.member = await api.setParentConsent(form.elements.parent.value);
        closeSheet();
        openCompose(scope);
      } catch (ex) { err.textContent = ex.message; }
    });
  }

  // Galerie eines Beitrags: erst alle Fotos als Kollage, dann einzeln blättern (Pfeile, Wischen, Tasten)
  function openGallery(refs, title, magazine = false) {
    const list = refs.filter(shownImage);
    if (!list.length) return;
    let index = list.length > 1 ? -1 : 0;
    const box = document.createElement('div');
    box.className = 'viewer gallery';
    const draw = () => {
      const single = index >= 0;
      box.innerHTML = `
        <div class="viewer-stage">
          ${single
            ? `<button type="button" class="gal-single" aria-label="${list.length > 1 ? 'Nächstes Foto' : 'Foto'}">${picture(list[index], list[index], title, true)}</button>`
            : `<div class="${magazine ? `collage gal-album collage-${Math.min(list.length, 5)}` : `gal-collage message-collage n${list.length}`}">${list.map((r, i) => `<button type="button" class="${magazine ? 'collage-item' : 'gal-tile message-photo'}" data-gi="${i}" aria-label="Foto ${i + 1} ansehen">${picture(r, r, '')}</button>`).join('')}</div>`}
        </div>
        <div class="viewer-bar">
          ${single && list.length > 1 ? `<button type="button" class="gal-back" data-gback>▦ Alle Fotos</button><span>${index + 1} / ${list.length}</span>` : `<span>${esc(title)}</span>`}
        </div>
        ${single && list.length > 1 ? `<button type="button" class="gal-nav prev" data-gstep="-1" aria-label="Vorheriges Foto">‹</button><button type="button" class="gal-nav next" data-gstep="1" aria-label="Nächstes Foto">›</button>` : ''}
        <button type="button" class="viewer-close" aria-label="Schließen">${ui().icon.close}</button>`;
    };
    const step = (d) => { if (index < 0) return; index = (index + d + list.length) % list.length; draw(); };
    const close = () => {
      box.classList.remove('open');
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      setTimeout(() => box.remove(), 200);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    let suppressClickUntil = 0;
    box.addEventListener('click', (e) => {
      if (Date.now() < suppressClickUntil && e.target.closest('.viewer-stage')) { e.preventDefault(); return; }
      if (e.target.closest('.viewer-close')) return close();
      const tile = e.target.closest('[data-gi]');
      if (tile) { index = Number(tile.dataset.gi); draw(); return; }
      if (e.target.closest('[data-gback]')) { index = -1; draw(); return; }
      const st = e.target.closest('[data-gstep]');
      if (st) { step(Number(st.dataset.gstep)); return; }
      if (e.target.closest('.gal-single')) { step(1); return; }
      if (e.target.closest('.viewer-bar')) return;
      close();
    });
    let touch = null;
    box.addEventListener('touchstart', (e) => {
      touch = e.touches.length === 1 && e.target.closest('.viewer-stage')
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }, { passive: true });
    box.addEventListener('touchmove', (e) => { if (e.touches.length !== 1) touch = null; }, { passive: true });
    box.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (!touch || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touch.x;
      const dy = e.changedTouches[0].clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        suppressClickUntil = Date.now() + 500;
        if (index < 0) { index = 0; draw(); } else step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
    draw();
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => box.classList.add('open'));
  }

  // ---------- Anhänge an Terminen (Bild oder PDF) mit Großansicht ----------
  const readDataUrl = (file) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Datei lässt sich nicht lesen.'));
    r.readAsDataURL(file);
  });
  async function uploadAttachment(file) {
    const { api, loadImage, largeImage } = ui();
    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      const url = await readDataUrl(file);
      const ref = await api.putFile(url.replace(/^data:[^;]*;/, 'data:application/pdf;'));
      images[ref] = url.replace(/^data:[^;]*;/, 'data:application/pdf;');
      return { ref, kind: 'pdf', name: file.name };
    }
    const img = await loadImage(file);
    const dataUrl = largeImage(img, 2400);   // Flyer sollen lesbar bleiben
    const ref = await api.putImage(dataUrl);
    images[ref] = dataUrl;
    return { ref, kind: 'image', name: file.name };
  }
  const PDF_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M9.5 16.5h5M9.5 13h5"/></svg>';
  function attachmentThumb(b, inEditor = false) {
    const a = b.attachment;
    if (!a || !images[a.ref]) return '';
    const inner = a.kind === 'pdf'
      ? `<span class="att-pdf">${PDF_ICON}<b>PDF</b></span>`
      : picture(a.ref, a.ref);
    if (inEditor) return `<span class="event-att ${a.kind}">${inner}</span>`;
    return `<button type="button" class="event-att ${a.kind}" data-action="att-open" data-ref="${esc(a.ref)}" data-kind="${esc(a.kind)}" data-title="${esc(b.title || '')}" aria-label="${a.kind === 'pdf' ? 'PDF' : 'Bild'} groß ansehen">${inner}</button>`;
  }
  function dataUrlToBlobUrl(dataUrl) {
    const [head, body] = dataUrl.split(',');
    const bin = atob(body);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: head.slice(5).split(';')[0] }));
  }
  // Großansicht: Bild in Seitengröße (Klick = Lesegröße), PDF im Betrachter; schließen mit ×, Klick daneben oder Esc
  function openViewer(ref, kind, title) {
    const src = images[ref];
    if (!src) return;
    const blobUrl = kind === 'pdf' ? dataUrlToBlobUrl(src) : null;
    const box = document.createElement('div');
    box.className = `viewer ${kind}`;
    box.innerHTML = `
      <div class="viewer-stage">
        ${kind === 'pdf'
          ? `<iframe class="viewer-doc" src="${blobUrl}" title="${esc(title)}"></iframe>`
          : `<img class="viewer-img" src="${src}" alt="${esc(title)}" title="Klicken: Lesegröße / Seitenansicht">`}
      </div>
      <div class="viewer-bar">
        <span>${esc(title)}</span>
        ${kind === 'pdf' ? `<a href="${blobUrl}" target="_blank" rel="noopener">In neuem Tab öffnen ↗</a>` : '<span class="viewer-hint">Bild antippen: Lesegröße</span>'}
      </div>
      <button type="button" class="viewer-close" aria-label="Schließen">${ui().icon.close}</button>`;
    const close = () => {
      box.classList.remove('open');
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      setTimeout(() => { box.remove(); if (blobUrl) URL.revokeObjectURL(blobUrl); }, 200);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    box.addEventListener('click', (e) => {
      if (e.target.closest('.viewer-close')) return close();
      const img = e.target.closest('.viewer-img');
      if (img) { box.classList.toggle('zoomed'); box.querySelector('.viewer-hint').textContent = box.classList.contains('zoomed') ? 'Bild antippen: Seitenansicht' : 'Bild antippen: Lesegröße'; return; }
      if (e.target.closest('.viewer-doc, .viewer-bar')) return;
      close();   // Klick außerhalb von Bild/PDF
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => box.classList.add('open'));
  }

  // ---------- Baustein-Editor ----------
  const wideScreen = () => window.matchMedia('(min-width: 1100px)').matches;
  function field(label, name, value, opts = {}) {
    const v = esc(value == null ? '' : value);
    if (opts.area && opts.rich) return `<div class="field rich-field"><span>${label}</span>
      <div class="rich-tools" role="toolbar" aria-label="Text gestalten">
        <button type="button" data-rich="bold" title="Fett"><b>F</b></button>
        <button type="button" data-rich="italic" title="Kursiv"><i>K</i></button>
        <button type="button" data-rich="underline" title="Unterstrichen"><u>U</u></button>
        <span class="rich-sep"></span>
        <button type="button" data-rich="rot" title="Rot"><span class="tx-red">A</span></button>
        <button type="button" data-rich="grau" title="Grau"><span class="tx-gray">A</span></button>
        <button type="button" data-rich="marker" title="Textmarker"><span class="tx-mark">A</span></button>
        <span class="rich-sep"></span>
        <button type="button" data-rich="gross" title="Größer">A+</button>
        <button type="button" data-rich="sehrgross" title="Sehr groß">A++</button>
        <span class="rich-sep"></span>
        <button type="button" data-rich="link" title="Link">↗ Link</button>
        <button type="button" data-rich="h" title="Zwischenüberschrift">Überschrift</button>
        <button type="button" data-rich="clear" title="Gestaltung entfernen">⌫ Format</button>
      </div>
      <div class="rich-area" contenteditable="true" data-rich-for="${name}" data-placeholder="${esc(opts.placeholder || '')}">${paragraphs(value || '')}</div>
      <textarea name="${name}" hidden>${v}</textarea></div>`;
    if (opts.area) return `<label class="field"><span>${label}</span><textarea name="${name}" rows="${opts.rows || 5}" placeholder="${esc(opts.placeholder || '')}">${v}</textarea></label>`;
    return `<label class="field"><span>${label}</span><input name="${name}" type="${opts.type || 'text'}" value="${v}" placeholder="${esc(opts.placeholder || '')}"></label>`;
  }
  // Link-Ziel: entweder eine Website oder eine Seite der App (Menüpunkte und Home-Unterseiten)
  function appTargets() {
    const list = [['#home', 'Home'], ['#kiosk', 'Kiosk'], ['#strichliste', 'Kiosk · Strichliste'], ['#abrechnungen', 'Kiosk · Abrechnungen'],
      ['#chat', 'Chat'], ['#chat/alle', 'Chat · Alle Beiträge'], ['#aktuell', 'Aktuell'], ['#sport', 'Sport'], ['#club', 'Club']];
    if (TFB.config.features && TFB.config.features.treffen) list.push(['#treffen', 'Verabreden']);
    (site.pages.home.blocks || []).filter((x) => x.type === 'feature' && hasMore(x) && (!x.navigation || x.navigation === 'detail'))
      .forEach((x) => list.push([`#home/${x.id}`, `Home · ${x.title}`]));
    (site.pages.home.blocks || []).filter(x => x.album?.enabled).forEach(x => list.push([`#home/${x.id}/fotos`, `Fotos · ${x.title}`]));
    return list;
  }
  function linkTargetField(url) {
    const isApp = /^#/.test(url || '');
    const targets = appTargets();
    return `
      <div class="field link-target"><span>Ziel</span>
        <div class="seg link-kind-seg">
          <button type="button" class="${isApp ? '' : 'on'}" data-linkkind="web">Website</button>
          <button type="button" class="${isApp ? 'on' : ''}" data-linkkind="app">Seite der App</button>
        </div>
        ${isApp
          ? `<select name="linkApp">${targets.map(([v, l]) => `<option value="${esc(v)}" ${v === url ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
             <input type="hidden" name="linkUrl" value="${esc(url)}">`
          : `<input name="linkUrl" type="url" inputmode="url" value="${esc(url || '')}" placeholder="https://www.beispiel.de">`}
      </div>`;
  }
  // Foto in einer Fotoliste des Editors: × entfernen, ‹ › verschieben, mit der Maus ziehen
  function frameButton(ref, compact = false) {
    if (!ref || !ui().state.member?.isAdmin || !shownImage(ref)) return '';
    return `<button type="button" class="${compact ? 'thumb-frame' : 'btn small'}" data-action="photo-frame" data-ref="${esc(ref)}" title="Rahmen und Bildausschnitt anpassen" aria-label="Rahmen und Bildausschnitt anpassen">${ui().icon.camera}${compact ? '' : ' Foto einpassen'}</button>`;
  }
  function thumbEdit(ref, list, i, n, removeAttr) {
    return `<div class="gallery-thumb sortable" draggable="true" data-list="${list}" data-index="${i}">
      ${picture(ref, ref)}${frameButton(ref, true)}
      <span class="thumb-grip" aria-hidden="true" title="Ziehen zum Sortieren">⠿</span>
      <button type="button" ${removeAttr}="${esc(ref)}" aria-label="Foto entfernen">×</button>
      <span class="thumb-move">
        <button type="button" data-move-list="${list}" data-move-index="${i}" data-move-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach vorne">‹</button>
        <button type="button" data-move-list="${list}" data-move-index="${i}" data-move-dir="1" ${i === n - 1 ? 'disabled' : ''} aria-label="Nach hinten">›</button>
      </span>
    </div>`;
  }
  function newsPhotoField(draft) {
    const refs = (draft.images || []).filter(shownImage);
    return `<div class="field"><span>Fotokollage (${refs.length} / 100)</span><div class="gallery-edit">${refs.map((ref, i) => thumbEdit(ref, 'news', i, refs.length, 'data-news-remove')).join('')}${refs.length < 100 ? `<label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-news-input hidden></label>` : ''}</div></div>`;
  }

  function imageField(ref, seed, label = 'Foto', target = '') {
    return `
      <div class="field"><span>${label}</span>
        <div class="image-field">
          <div class="image-preview">${picture(ref, seed)}</div>
          <div class="image-actions">
            <label class="btn small">${ref ? 'Foto ersetzen' : 'Foto wählen'}<input type="file" accept="image/*" data-image-input data-target="${target}" hidden></label>
            ${frameButton(ref)}
            ${ref ? `<button type="button" class="btn small" data-image-remove="${target}">Foto entfernen</button>` : ''}
          </div>
        </div>
      </div>`;
  }

  function openBlockEditor(id, isNew = false, startTab = 'home') {
    if (id === 'v-vorstand') return TFB.board.open();
    const { openSheet, closeSheet } = ui();
    const original = findBlock(id);
    if (!original) return;
    const draft = JSON.parse(JSON.stringify(original));
    let edTab = startTab;
    const edMore = {};   // „Mehr Gestaltung“ je Reiter auf/zu (bleibt beim Neuzeichnen)
    const moreBox = (k, inner) => `<details class="ed-more" data-edmore="${k}" ${edMore[k] ? 'open' : ''}><summary>Mehr Gestaltung <small>freiwillig – ohne Änderung sieht alles gut aus</small></summary>${inner}</details>`;
    const live = draft.type === 'feature';   // Themen: Seitenleiste mit Live-Vorschau
    const label = (BLOCK_TYPES.find(([t]) => t === draft.type) || [0, 'Baustein'])[1];

    const body = () => {
      switch (draft.type) {
        case 'feature': {
          const lk = draft.link || {};
          const ext = /^https?:/i.test(lk.url || '');
          const more = draft.more || {};
          const heroSrc = more.heroSource === 'own' ? 'own' : 'same';
          const heroImgs = (more.heroImages || []).filter(shownImage);
          const heroMode = more.heroMode || 'wide';
          const album = draft.album || {};
          const positions = () => [['left', 'Unter der Unterzeile'], ...String(draft.text || '').split(/\n{2,}/).filter(x => x.trim()).map((_, i) => [`right-${i}`, i ? `Nach Absatz ${i}` : 'Vor dem Text']), ['right', 'Unter dem Text']];
          const positionField = (name, value) => `<label class="field"><span>Position auf der Startseite</span><select name="${name}">${positions().map(([v, label]) => `<option value="${v}" ${v === (value || 'right') ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;
          const iconField = (name, value) => `<label class="field"><span>Symbol</span><select name="${name}">${[['', 'Automatisch'], ['kiosk', 'Kiosk'], ['club', 'Club'], ['sport', 'Sport'], ['news', 'Aktuell'], ['camera', 'Fotos'], ['user', 'Person'], ['receipt', 'Dokument'], ['chevron', 'Pfeil']].map(([v,l]) => `<option value="${v}" ${v === (value || '') ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
          const seg = (attr, cur, opts) => `<div class="seg">${opts.map(([v, l, off]) =>
            `<button type="button" class="${cur === v ? 'on' : ''}" data-${attr}="${v}" ${off ? 'disabled' : ''}>${l}</button>`).join('')}</div>`;
          const homePanel = `
            <p class="ed-hint">So erscheint das Thema auf der <b>Startseite</b>. ${wideScreen() ? 'Links siehst du jede Änderung sofort.' : 'Mit „Vorschau ansehen“ siehst du die Seite.'}</p>
            <h3 class="editor-sub">1 · Foto</h3>`
            + ((draft.images || []).length ? newsPhotoField(draft) : imageField(draft.image, draft.id, ''))
            + `<h3 class="editor-sub">2 · Überschrift</h3>` + field('', 'title', draft.title)
            + `<h3 class="editor-sub">3 · Kurzer Text</h3>`
            + field('', 'text', draft.text, { area: true, rich: true, rows: 5, placeholder: 'Zwei, drei Sätze – Wörter markieren und oben gestalten' })
            + `<h3 class="editor-sub">4 · Link (freiwillig)</h3>`
            + linkTargetField(lk.url)
            + field('Link-Text', 'linkLabel', lk.label, { placeholder: 'z. B. Jetzt Platz buchen' })
            + moreBox('home', `
              <div class="field"><span>Anordnung des Fotos</span>${seg('layout', draft.layout || 'wide', [['wide', 'Breit oben'], ['portrait', 'Hochformat links'], ['square', 'Quadrat links'], ['portrait-right', 'Hochformat rechts'], ['square-right', 'Quadrat rechts']])}</div>`
              + ((draft.images || []).length ? '' : newsPhotoField(draft))
              + field('Kleine Zeile über der Überschrift', 'kicker', draft.kicker, { placeholder: 'z. B. Neu in Bielstein' })
              + field('Unterzeile', 'subtitle', draft.subtitle)
              + `<div class="field"><span>Textgröße (gilt auch auf der Unterseite)</span>${seg('textsize', draft.textSize || 'normal', [['normal', 'Normal'], ['gross', 'Groß']])}</div>`
              + `<label class="field"><span>Klick auf Bild und Überschrift öffnet</span><select name="navigation" data-rerender>${[['detail','Eigene Detailseite'],['link','Verknüpften Link'],['none','Nichts']].map(([v,l]) => `<option value="${v}" ${v === (draft.navigation || (hasMore(draft) ? 'detail' : 'link')) ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
              <label class="meet-check"><input type="checkbox" name="showMore" ${draft.showMore !== false ? 'checked' : ''}><span>„Mehr erfahren“ bei eigener Detailseite anzeigen</span></label>`
              + (() => {
                const n = String(draft.text || '').split(/\n{2,}/).filter((x) => x.trim()).length;
                const cur = lk.position || 'right';
                const opts = [['left', 'Links unter der Unterzeile'], ...Array.from({ length: n }, (_, i) => [`right-${i}`, i === 0 ? 'Rechts vor dem Text' : `Rechts nach Absatz ${i}`]), ['right', 'Rechts unter dem Text']];
                return `<label class="field"><span>Platz des Links (oder auf der Seite mit der Maus ziehen)</span><select name="linkPos">${opts.map(([v, l]) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
              })()
              + `<div class="field"><span>Link-Darstellung</span>${seg('linkstyle', lk.style || 'chip', [['chip', 'Dezent'], ['button', 'Knopf'], ['card', 'Vorschau-Karte']])}</div>`
              + iconField('linkIcon', lk.icon)
              + (ext ? `<p class="muted small">Für die Vorschau (kleines Bild beim dezenten Link, große Karte): im Echtbetrieb holt die App Bild, Titel und Text automatisch von der Website – bis dahin hier eintragen.</p>`
                + field('Vorschau: Titel', 'linkTitle', lk.title) + field('Vorschau: Text', 'linkText', lk.text, { area: true, rows: 3 })
                + imageField(lk.image, lk.url, 'Vorschau: Bild', 'link')
                : imageField(lk.image, lk.url || 'intern', 'Rundes Bild im Link (leer = Symbol der Seite)', 'link')));
          const subPanel = `
            <p class="ed-hint">Die <b>Unterseite</b> öffnet sich über „Mehr erfahren“, sobald hier ein Text, ein Zitat oder Fotos stehen. Überschrift und Link kommen vom Reiter „Startseite“.</p>
            <h3 class="editor-sub">1 · Ausführlicher Text</h3>`
            + field('', 'moreText', more.text, { area: true, rich: true, rows: 10, placeholder: 'Beliebig lang – Wörter markieren und oben gestalten' })
            + `<h3 class="editor-sub">2 · Fotos (unten als Kollage, freiwillig)</h3>
               <div class="field"><div class="gallery-edit">
                  ${(() => { const l = (more.images || []).filter(shownImage); return l.map((ref, i) => thumbEdit(ref, 'more', i, l.length, 'data-more-remove')).join(''); })()}
                  <label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-more-input hidden></label>
                </div></div>`
            + moreBox('sub', `
              <div class="field"><span>Titelbild oben</span>${seg('herosrc', heroSrc, [['same', 'Wie auf der Startseite'], ['own', 'Eigene Fotos']])}</div>
              ${heroSrc === 'own' ? `<div class="field"><span>Eigene Titelfotos (1 bis 4)</span>
                <div class="gallery-edit">
                  ${heroImgs.map((ref, i) => thumbEdit(ref, 'hero', i, heroImgs.length, 'data-hero-remove')).join('')}
                  ${heroImgs.length < 4 ? `<label class="gallery-add">${ui().icon.plus}<span>Foto</span><input type="file" accept="image/*" multiple data-hero-input hidden></label>` : ''}
                </div></div>` : ''}
              <div class="field"><span>Titelbild: Darstellung</span>${seg('heromode', heroMode, [['wide', 'Breit'], ['original', 'Originalformat'], ['squares', '2–4 Quadrate nebeneinander', heroSrc !== 'own' || heroImgs.length < 2]])}</div>
              ${heroMode === 'original' ? `<div class="field"><span>Ausrichtung</span><div class="seg align-seg">${[['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts']].map(([v, l]) =>
                  `<button type="button" class="${(more.heroAlign || 'center') === v ? 'on' : ''}" data-align="hero:${v}">${l}</button>`).join('')}</div></div>` : ''}`
              + `<div class="field"><span>Großer Textanfang (rot)</span>${seg('dropcap', String(more.dropcap == null ? 1 : more.dropcap), [['0', 'Aus'], ['1', '1 Zeichen'], ['2', '2 Zeichen'], ['3', '3 Zeichen']])}</div>`
              + field('Zitat', 'moreQuote', more.quote, { placeholder: 'z. B. „Nach zehn Minuten hatte jeder ein Grinsen im Gesicht.“' })
              + field('Zitat von', 'moreQuoteBy', more.quoteBy, { placeholder: 'z. B. Jan, Herren 40' })
              + `<label class="meet-check"><input type="checkbox" name="moreOriginal" data-rerender ${more.original ? 'checked' : ''}><span>Kollage: Fotos im Originalformat zeigen (nicht zuschneiden)</span></label>
                 ${more.original ? `<div class="field"><span>Ausrichtung der Kollage</span><div class="seg align-seg">${[['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts']].map(([v, l]) =>
                  `<button type="button" class="${(more.collageAlign || 'center') === v ? 'on' : ''}" data-align="collage:${v}">${l}</button>`).join('')}</div></div>` : ''}`);
          const albumPanel = `<label class="meet-check"><input type="checkbox" name="albumEnabled" data-rerender ${album.enabled ? 'checked' : ''}><span>Separate Fotokollage veröffentlichen</span></label>
            ${field('Überschrift der Fotoseite', 'albumTitle', album.title || draft.title)}
            ${field('Link-Text', 'albumLabel', album.label || 'Fotos der Veranstaltung')}
            ${positionField('albumPos', album.position)}${iconField('albumIcon', album.icon || 'camera')}
            <label class="meet-check"><input type="checkbox" name="albumOriginal" data-rerender ${album.original ? 'checked' : ''}><span>Originalformate erhalten</span></label>
            <div class="field"><span>Fotos (${(album.images || []).length} / 100)</span><div class="gallery-edit">${(album.images || []).filter(shownImage).map((ref,i,list) => thumbEdit(ref, 'album', i, list.length, 'data-album-remove')).join('')}
            ${(album.images || []).length < 100 ? `<label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-album-input hidden></label>` : ''}</div></div>`;
          return `
            <div class="ed-tabs" role="tablist">
              <button type="button" role="tab" class="${edTab === 'home' ? 'on' : ''}" data-edtab="home">Startseite</button>
              <button type="button" role="tab" class="${edTab === 'sub' ? 'on' : ''}" data-edtab="sub">Unterseite</button>
              <button type="button" role="tab" class="${edTab === 'album' ? 'on' : ''}" data-edtab="album">Fotokollage</button>
            </div>
            <div class="ed-panel" data-panel="home" ${edTab === 'home' ? '' : 'hidden'}>${homePanel}</div>
            <div class="ed-panel" data-panel="sub" ${edTab === 'sub' ? '' : 'hidden'}>${subPanel}</div>
            <div class="ed-panel" data-panel="album" ${edTab === 'album' ? '' : 'hidden'}>${albumPanel}</div>`;
        }
        case 'heading': return field('Überschrift', 'title', draft.title);
        case 'text': return field('Überschrift', 'title', draft.title)
          + (draft.id === 's-training' ? field('Funktion', 'subtitle', draft.subtitle) + imageField(draft.image, draft.id, 'Trainerfoto') + field('Telefon', 'phone', draft.phone) + field('E-Mail', 'email', draft.email) : '')
          + field(draft.id === 's-schnupper-dates' ? 'Termine' : 'Text', 'text', draft.text, { area: true, rich: true, rows: 8, placeholder: draft.id === 's-schnupper-dates' ? 'Datum, Uhrzeit, Treffpunkt und weitere Informationen eintragen' : 'Text schreiben – Wörter markieren und oben gestalten' });
        case 'event': return `<div class="field-row">${field('Datum', 'date', draft.date, { type: 'date' })}${field('Uhrzeit', 'time', draft.time, { type: 'time' })}</div>`
          + field('Titel', 'title', draft.title) + field('Ort', 'place', draft.place) + field('Kurzinfo', 'text', draft.text, { area: true, rows: 3 })
          + `<div class="field"><span>Anhang: Bild oder PDF (z. B. Flyer, Ausschreibung)</span>
              ${draft.attachment && images[draft.attachment.ref]
                ? `<div class="att-edit">${attachmentThumb(draft, true)}<div><strong>${esc(draft.attachment.name || (draft.attachment.kind === 'pdf' ? 'PDF' : 'Bild'))}</strong>
                    <div class="image-actions"><label class="btn small">Ersetzen<input type="file" accept="image/*,application/pdf" data-att-input hidden></label>
                    ${draft.attachment.kind === 'pdf' ? '' : frameButton(draft.attachment.ref)}
                    <button type="button" class="link" data-att-remove>Entfernen</button></div></div></div>`
                : `<label class="btn">Bild oder PDF wählen<input type="file" accept="image/*,application/pdf" data-att-input hidden></label>`}
            </div>`;
        case 'post': return ((draft.images || []).length ? '' : imageField(draft.image, draft.id)) + newsPhotoField(draft) + field('Datum', 'date', draft.date, { type: 'date' })
          + field('Überschrift', 'title', draft.title) + field('Text', 'text', draft.text, { area: true, rich: true, rows: 7, placeholder: 'Text schreiben – Wörter markieren und oben gestalten' });
        case 'image': return imageField(draft.image, draft.id) + field('Bildunterschrift', 'caption', draft.caption)
          + `<label class="meet-check"><input type="checkbox" name="imgOriginal" data-rerender ${draft.original ? 'checked' : ''}><span>Originalformat (nicht zuschneiden)</span></label>`
          + (draft.original ? `<div class="field"><span>Ausrichtung</span><div class="seg align-seg">${[['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts']].map(([v, l]) =>
                `<button type="button" class="${(draft.align || 'center') === v ? 'on' : ''}" data-align="image:${v}">${l}</button>`).join('')}</div></div>` : '');
        case 'gallery': return field('Überschrift', 'title', draft.title) + `
          <div class="field"><span>Fotos</span>
            <div class="gallery-edit">
              ${(() => { const l = (draft.images || []).filter((r) => images[r]); return l.map((ref, i) => thumbEdit(ref, 'gallery', i, l.length, 'data-gallery-remove')).join(''); })()}
              <label class="gallery-add">${ui().icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-gallery-input hidden></label>
            </div>
          </div>`;
        case 'people': return field('Überschrift', 'title', draft.title)
          + field('Personen – je Zeile „Rolle: Name“', 'people', (draft.people || []).map((p) => `${p.role}: ${p.name}`).join('\n'), { area: true, rows: 6 });
        case 'facts': return `<div class="facts-editor">${(draft.items || []).map((f, i, list) => `
          <div class="fact-editor-row" data-fact-row>
            <div class="field-row">${field('Zahl', 'fact_value_' + i, f.value)}${field('Beschriftung', 'fact_label_' + i, f.label)}</div>
            <div class="fact-order">
              <button type="button" data-fact-move="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Nach vorne" title="Nach vorne">${ui().icon.up}</button>
              <button type="button" data-fact-move="${i}" data-dir="1" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Nach hinten" title="Nach hinten">${ui().icon.down}</button>
            </div>
          </div>`).join('')}</div>`;
        case 'button': return field('Beschriftung', 'label', draft.label) + field('Ziel (Website oder #aktuell, #sport, #club, #kiosk)', 'url', draft.url) + (draft.id === 'v-mitglied-btn' || draft.url === '#aufnahme' ? field('Hinweis neben den Buttons (optional)', 'note', draft.note) : '');
        case 'teams': return field('Überschrift', 'title', draft.title) + '<p class="muted small">Die Liste kommt automatisch aus nuLiga.</p>';
        default: return '';
      }
    };

    const render = () => {
      const keepScroll = document.querySelector('#sheet-root .sheet') ? document.querySelector('#sheet-root .sheet').scrollTop : 0;
      openSheet(`
        <form class="editor ${live ? 'editor-live' : ''}" data-editor="block" novalidate>
          <h2>${isNew ? (live ? 'Neues Thema' : `Neuer Baustein: ${esc(label)}`) : live ? 'Thema bearbeiten' : `${esc(label)} bearbeiten`}</h2>
          ${body()}
          <p class="form-error" role="alert"></p>
          <div class="ed-actions">
            <button type="submit" class="btn primary block">Speichern</button>
            ${live ? '<button type="button" class="btn block ed-peek" data-ed-peek>Vorschau ansehen</button>' : ''}
          </div>
          <button type="button" class="btn block danger" data-delete>${live ? 'Thema löschen' : 'Baustein löschen'}</button>
        </form>`);
      const form = document.querySelector('[data-editor=block]');
      // Fotos per Ziehen umsortieren (innerhalb derselben Liste)
      let dragThumb = null;
      form.addEventListener('dragstart', (e) => {
        const t = e.target.closest && e.target.closest('.gallery-thumb.sortable');
        if (!t) return;
        dragThumb = t;
        t.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', t.dataset.index); } catch (_) {}
      });
      form.addEventListener('dragover', (e) => {
        const t = e.target.closest && e.target.closest('.gallery-thumb.sortable');
        if (!dragThumb || !t || t.dataset.list !== dragThumb.dataset.list) return;
        e.preventDefault();
        form.querySelectorAll('.gallery-thumb.drop-target').forEach((x) => x !== t && x.classList.remove('drop-target'));
        if (t !== dragThumb) t.classList.add('drop-target');
      });
      form.addEventListener('drop', (e) => {
        const t = e.target.closest && e.target.closest('.gallery-thumb.sortable');
        if (!dragThumb || !t || t.dataset.list !== dragThumb.dataset.list) return;
        e.preventDefault();
        collect(form);
        moveInList(t.dataset.list, Number(dragThumb.dataset.index), Number(t.dataset.index));
        dragThumb = null;
        render();
      });
      form.addEventListener('dragend', () => {
        if (dragThumb) dragThumb.classList.remove('dragging');
        dragThumb = null;
        form.querySelectorAll('.drop-target').forEach((x) => x.classList.remove('drop-target'));
      });
      if (live) {
        startLive(id, draft, () => { collect(form); return edTab; });
        document.querySelector('#sheet-root .sheet').scrollTop = keepScroll;
        form.addEventListener('input', () => schedulePreview());
        form.addEventListener('change', () => schedulePreview());
      }
      form.addEventListener('toggle', (e) => { if (e.target.dataset && e.target.dataset.edmore) edMore[e.target.dataset.edmore] = e.target.open; }, true);
      form.addEventListener('submit', (e) => { e.preventDefault(); save(form); });
      form.addEventListener('click', async (e) => {
        const factMove = e.target.closest('[data-fact-move]');
        if (factMove) {
          collect(form);
          const from = Number(factMove.dataset.factMove);
          const to = from + Number(factMove.dataset.dir);
          if (to >= 0 && to < draft.items.length) {
            const [item] = draft.items.splice(from, 1);
            draft.items.splice(to, 0, item);
          }
          render();
          return;
        }
        const del = e.target.closest('[data-delete]');
        if (del) {
          if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Wirklich löschen? Nochmal tippen'; return; }
          site.pages[editing].blocks = blocksOf().filter((b) => b.id !== id);
          closeSheet();
          commit('Baustein gelöscht');
        }
        if (e.target.closest('[data-att-remove]')) { collect(form); delete draft.attachment; render(); return; }
        const dc = e.target.closest('[data-dropcap]');
        if (dc) { collect(form); draft.more = { ...(draft.more || {}), dropcap: Number(dc.dataset.dropcap) }; render(); return; }
        const al = e.target.closest('[data-align]');
        if (al) {
          collect(form);
          const [where, val] = al.dataset.align.split(':');
          if (where === 'image') draft.align = val;
          else draft.more = { ...(draft.more || {}), [where === 'hero' ? 'heroAlign' : 'collageAlign']: val };
          render();
          return;
        }
        const mv = e.target.closest('[data-move-list]');
        if (mv) { collect(form); moveInList(mv.dataset.moveList, Number(mv.dataset.moveIndex), Number(mv.dataset.moveIndex) + Number(mv.dataset.moveDir)); render(); return; }
        const tabBtn = e.target.closest('[data-edtab]');
        if (tabBtn) {
          collect(form);
          edTab = tabBtn.dataset.edtab;
          form.querySelectorAll('[data-edtab]').forEach((x) => x.classList.toggle('on', x === tabBtn));
          form.querySelectorAll('.ed-panel').forEach((x) => { x.hidden = x.dataset.panel !== edTab; });
          document.querySelector('#sheet-root .sheet').scrollTop = 0;
          refreshPreview(true);
          return;
        }
        if (e.target.closest('[data-ed-peek]')) { togglePeek(e.target.closest('[data-ed-peek]')); return; }
        const hs = e.target.closest('[data-herosrc]');
        if (hs) { collect(form); draft.more = { ...(draft.more || {}), heroSource: hs.dataset.herosrc }; if (hs.dataset.herosrc !== 'own' && draft.more.heroMode === 'squares') draft.more.heroMode = 'wide'; render(); return; }
        const hm = e.target.closest('[data-heromode]');
        if (hm) { collect(form); draft.more = { ...(draft.more || {}), heroMode: hm.dataset.heromode }; render(); return; }
        const hr = e.target.closest('[data-hero-remove]');
        if (hr) { collect(form); draft.more.heroImages = (draft.more.heroImages || []).filter((r) => r !== hr.dataset.heroRemove); if (draft.more.heroImages.length < 2 && draft.more.heroMode === 'squares') draft.more.heroMode = 'wide'; render(); return; }
        const lk2 = e.target.closest('[data-linkkind]');
        if (lk2) {
          collect(form);
          const cur = (draft.link || {}).url || '';
          const toApp = lk2.dataset.linkkind === 'app';
          if (toApp !== /^#/.test(cur)) draft.link = { ...(draft.link || {}), url: toApp ? '#kiosk' : '', image: toApp ? null : (draft.link || {}).image };
          render();
          return;
        }
        const ts = e.target.closest('[data-textsize]');
        if (ts) { collect(form); draft.textSize = ts.dataset.textsize; render(); return; }
        const lay = e.target.closest('[data-layout]');
        if (lay) { collect(form); draft.layout = lay.dataset.layout; render(); return; }
        const ls = e.target.closest('[data-linkstyle]');
        if (ls) { collect(form); draft.link = { ...(draft.link || {}), style: ls.dataset.linkstyle }; render(); return; }
        const mr = e.target.closest('[data-more-remove]');
        if (mr) { collect(form); draft.more.images = draft.more.images.filter((r) => r !== mr.dataset.moreRemove); render(); return; }
        const ar = e.target.closest('[data-album-remove]');
        if (ar) { collect(form); draft.album.images = draft.album.images.filter(r => r !== ar.dataset.albumRemove); render(); return; }
        const nr = e.target.closest('[data-news-remove]');
        if (nr) { collect(form); draft.images = draft.images.filter(r => r !== nr.dataset.newsRemove); render(); return; }
        const rmImg = e.target.closest('[data-image-remove]');
        if (rmImg) { collect(form); if (rmImg.dataset.imageRemove === 'link') draft.link.image = null; else draft.image = null; render(); }
        const rm = e.target.closest('[data-gallery-remove]');
        if (rm) { collect(form); draft.images = draft.images.filter((r) => r !== rm.dataset.galleryRemove); render(); }
      });
      form.addEventListener('change', async (e) => {
        const input = e.target;
        if (input.matches('[data-rerender]')) { collect(form); render(); return; }
        if (input.matches('[data-att-input]') && input.files && input.files[0]) {
          collect(form);
          try {
            draft.attachment = await uploadAttachment(input.files[0]);
            ui().toast('Anhang hinzugefügt', true);
            render();
          } catch (err) { ui().toast(err.message); }
          return;
        }
        if (!input.files || !input.files.length) return;
        collect(form);
        try {
          const files = [...input.files];
          if (input.matches('[data-news-input]') && files.length + (draft.images || []).length + (draft.image ? 1 : 0) > 100) {
            ui().toast('Eine Fotokollage kann höchstens 100 Bilder enthalten. Bitte weniger Fotos auswählen.');
            input.value = ''; return;
          }
          if (input.matches('[data-album-input]') && files.length + (draft.album?.images || []).length > 100) {
            ui().toast('Eine Fotokollage kann höchstens 100 Bilder enthalten. Bitte weniger Fotos auswählen.');
            input.value = ''; return;
          }
          const ids = await uploadFiles(files);
          if (input.matches('[data-news-input]')) {
            draft.images = [...(draft.images || []), ...(draft.image ? [draft.image] : []), ...ids];
            draft.image = null;
          }
          if (input.matches('[data-album-input]')) draft.album = { ...(draft.album || {}), images: [...(draft.album?.images || []), ...ids] };
          if (input.matches('[data-image-input]')) {
            if (input.dataset.target === 'link') draft.link = { ...(draft.link || {}), image: ids[0] };
            else draft.image = ids[0];
          }
          if (input.matches('[data-gallery-input]')) draft.images = [...(draft.images || []), ...ids];
          if (input.matches('[data-hero-input]')) {
            const list = [...((draft.more || {}).heroImages || []), ...ids].slice(0, 4);
            draft.more = { ...(draft.more || {}), heroImages: list, heroMode: list.length >= 2 ? 'squares' : ((draft.more || {}).heroMode || 'wide') };
          }
          if (input.matches('[data-more-input]')) draft.more = { ...(draft.more || {}), images: [...((draft.more || {}).images || []).filter((r) => !/^ph:/.test(r)), ...ids] };
          ui().toast(ids.length > 1 ? `${ids.length} Fotos hinzugefügt` : 'Foto hinzugefügt', true);
          render();
        } catch (err) { ui().toast(err.message); }
      });
    };

    // Foto in einer Liste von Position a nach b verschieben (nur angezeigte Fotos zählen)
    function moveInList(list, a, b) {
      const get = () => (list === 'album' ? draft.album?.images : list === 'hero' ? (draft.more || {}).heroImages : list === 'more' ? (draft.more || {}).images : draft.images) || [];
      const visible = get().filter(list === 'gallery' ? (r) => images[r] : shownImage);
      if (b < 0 || b >= visible.length || a === b) return;
      const [item] = visible.splice(a, 1);
      visible.splice(b, 0, item);
      if (list === 'album') draft.album = { ...(draft.album || {}), images: visible };
      else if (list === 'hero') draft.more = { ...(draft.more || {}), heroImages: visible };
      else if (list === 'more') draft.more = { ...(draft.more || {}), images: visible };
      else draft.images = visible;
    }

    // Formularwerte in den Entwurf übernehmen
    const collect = (form) => {
      const f = form.elements;
      ['title', 'text', 'date', 'time', 'place', 'caption', 'label', 'url', 'kicker', 'subtitle', 'note', 'phone', 'email'].forEach((k) => { if (f[k]) draft[k] = f[k].value.trim(); });
      if (f.imgOriginal) draft.original = f.imgOriginal.checked;
      if (f.navigation) { draft.navigation = f.navigation.value; draft.showMore = f.showMore.checked; }
      if (f.albumEnabled) draft.album = { ...(draft.album || {}), enabled: f.albumEnabled.checked, title: f.albumTitle.value.trim(), label: f.albumLabel.value.trim() || 'Fotos der Veranstaltung', position: f.albumPos.value, icon: f.albumIcon.value, original: f.albumOriginal.checked };
      if (f.moreText) draft.more = { ...(draft.more || {}), text: f.moreText.value.trim(), quote: f.moreQuote.value.trim(), quoteBy: f.moreQuoteBy.value.trim(), original: Boolean(f.moreOriginal && f.moreOriginal.checked) };
      if (f.linkUrl) {
        const url = f.linkApp ? f.linkApp.value : f.linkUrl.value.trim();
        draft.link = { ...(draft.link || {}), url: url && !/^(https?:\/\/|#)/i.test(url) ? 'https://' + url : url, label: f.linkLabel.value.trim(), ...(f.linkPos ? { position: f.linkPos.value } : {}), ...(f.linkIcon ? { icon: f.linkIcon.value } : {}) };
        if (f.linkTitle) Object.assign(draft.link, { title: f.linkTitle.value.trim(), text: f.linkText.value.trim() });
      }
      if (f.people) draft.people = f.people.value.split('\n').map((l) => l.trim()).filter(Boolean)
        .map((l) => { const [role, ...rest] = l.split(':'); return { role: role.trim(), name: rest.join(':').trim() || '–' }; });
      if (draft.type === 'facts') draft.items = Array.from(form.querySelectorAll('[data-fact-row]'), (_, i) => ({
        value: f['fact_value_' + i].value.trim(), label: f['fact_label_' + i].value.trim(),
      }));
    };
    const save = (form) => {
      collect(form);
      if (['event', 'post', 'feature'].includes(draft.type) && !draft.title) { form.querySelector('.form-error').textContent = 'Bitte einen Titel eingeben.'; return; }
      delete draft._new;
      const list = blocksOf();
      list[list.findIndex((b) => b.id === id)] = draft;
      endLive();
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
      facts: { items: Array.from({ length: 5 }, () => ({ value: '–', label: 'Kennzahl' })) }, button: { label: 'Mehr erfahren', url: '' }, teams: { title: 'Mannschaften' },
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

  // ---------- Mannschaftsporträt: Magazin-Seite wie die Unterseiten der Startseite ----------
  let portraitDraft = null;   // Live-Vorschau beim Bearbeiten: { key, data }
  const portraitOf = (key) => (portraitDraft && portraitDraft.key === key ? portraitDraft.data : (teamContent(key).portrait || {}));
  const portraitFilled = (p) => Boolean(p && ((p.text || '').trim() || (p.heroImages || []).length || (p.images || []).length || p.quote || p.title));
  const teamName = (team) => team.name.replace(/\s*\(.*?\)/g, '');
  function portraitCard(key, team, canEdit, photo) {
    const p = portraitOf(key);
    if (portraitFilled(p)) {
      const img = (p.heroImages || []).filter(shownImage)[0] || photo;
      return `
        <a class="portrait-cta" href="#team/${esc(key)}/portraet">
          ${img ? `<span class="portrait-cta-img">${picture(img, img, '')}</span>` : ''}
          <span class="portrait-cta-body"><small>Mannschaftsporträt</small><b>${esc(p.title || teamName(team))}</b>
            ${p.subtitle ? `<span>${esc(p.subtitle)}</span>` : ''}<em>Porträt ansehen <i aria-hidden="true">→</i></em></span>
        </a>`;
    }
    if (!canEdit) return '';
    return `
      <button type="button" class="portrait-cta empty" data-action="portrait-edit" data-team="${esc(key)}">
        <span class="portrait-cta-body"><small>Mannschaftsporträt</small><b>+ Porträt anlegen</b>
          <span>Wer seid ihr? Teamfotos, Geschichte, Ziele, Mannschaftstour – wie eine Magazinseite.</span></span>
      </button>`;
  }
  async function teamPortraitView(key) {
    await ensure();
    const found = findTeam(key);
    if (!found) return `${ui().viewHead('Mannschaft', 'Diese Mannschaft gibt es nicht (mehr).', false)}`;
    const { team, season } = found;
    const { icon, state, partnerSlot } = ui();
    const extra = teamContent(key);
    const p = portraitOf(key);
    const can = Boolean(state.member && (state.member.isAdmin || (state.member.teams || []).includes(key)));
    const photo = extra.photo && (images[extra.photo] || /^assets\//.test(extra.photo)) ? extra.photo : null;
    if (!portraitFilled(p) && !portraitDraft) {
      return `
        ${ui().viewHead(`Mannschaftsporträt · ${esc(teamName(team))}`, 'Noch gibt es hier kein Porträt.', false)}
        ${can ? `<p><button type="button" class="btn signal" data-action="portrait-edit" data-team="${esc(key)}">+ Porträt anlegen</button></p>` : ''}
        <p><a class="more-link back" href="#team/${esc(key)}"><span aria-hidden="true">←</span> Zur Mannschaft</a></p>`;
    }
    const b = {
      id: 'tp-' + key, layout: 'wide', image: photo, noPlaceholder: !photo, textSize: p.textSize,
      kicker: p.kicker || `Mannschaftsporträt · ${season}`, title: p.title || teamName(team), subtitle: p.subtitle || team.group,
      more: { ...p, heroSource: (p.heroImages || []).filter(shownImage).length ? 'own' : 'same' },
    };
    return storyHtml(b, {
      editHtml: can ? `<button type="button" class="view-close" data-action="portrait-edit" data-team="${esc(key)}" aria-label="Porträt bearbeiten">${icon.pencil}</button>` : '',
      closeHref: `#team/${key}`, backLabel: `Zur Mannschaft · ${teamName(team)}`,
      partner: partnerSlot('sport', 'Der Sport wird dir präsentiert von'),
    });
  }

  function openPortraitEditor(key) {
    const route = `#team/${key}/portraet`;
    if (location.hash !== route) {
      window.addEventListener('hashchange', () => setTimeout(() => openPortraitEditor(key), 120), { once: true });
      location.hash = route;
      return;
    }
    const { openSheet, closeSheet, api, toast, icon } = ui();
    const found = findTeam(key);
    const draft = JSON.parse(JSON.stringify(teamContent(key).portrait || {}));
    portraitDraft = { key, data: draft };
    let timer = null;
    let moreOpen = false;   // „Mehr Gestaltung“ bleibt beim Neuzeichnen auf/zu
    const refresh = () => { clearTimeout(timer); timer = setTimeout(async () => { const y = window.scrollY; await ui().renderView(); window.scrollTo(0, y); }, 220); };
    const seg = (attr, cur, opts) => `<div class="seg">${opts.map(([v, l, off]) => `<button type="button" class="${cur === v ? 'on' : ''}" data-${attr}="${v}" ${off ? 'disabled' : ''}>${l}</button>`).join('')}</div>`;
    const align = (key2, cur) => `<div class="field"><span>Ausrichtung</span>${seg('palign', `${key2}:${cur || 'center'}`, [['left', 'Links'], ['center', 'Mitte'], ['right', 'Rechts']].map(([v, l]) => [`${key2}:${v}`, l]))}</div>`;
    const render = () => {
      const heroImgs = (draft.heroImages || []).filter(shownImage);
      const coll = (draft.images || []).filter(shownImage);
      const mode = draft.heroMode || 'wide';
      const keep = document.querySelector('#sheet-root .sheet') ? document.querySelector('#sheet-root .sheet').scrollTop : 0;
      openSheet(`
        <form class="editor editor-live" data-editor="portrait" novalidate>
          <h2>Mannschaftsporträt</h2>
          <p class="ed-hint">${esc(found ? teamName(found.team) : key)} – so sieht es jeder Besucher. ${wideScreen() ? 'Links siehst du jede Änderung sofort.' : 'Mit „Vorschau ansehen“ siehst du die Seite.'} Ohne eigene Fotos erscheint oben das Teamfoto.</p>
          <h3 class="editor-sub">1 · Fotos oben (bis zu 4)</h3>
          <div class="field"><div class="gallery-edit">
            ${heroImgs.map((ref, i) => thumbEdit(ref, 'hero', i, heroImgs.length, 'data-premove')).join('')}
            ${heroImgs.length < 4 ? `<label class="gallery-add">${icon.plus}<span>Foto</span><input type="file" accept="image/*" multiple data-pphoto="hero" hidden></label>` : ''}
          </div></div>
          <h3 class="editor-sub">2 · Überschrift</h3>
          ${field('', 'title', draft.title, { placeholder: found ? teamName(found.team) : '' })}
          <h3 class="editor-sub">3 · Text über die Mannschaft</h3>
          ${field('', 'text', draft.text, { area: true, rich: true, rows: 10, placeholder: 'Wer seid ihr, was macht euch aus, was habt ihr vor?' })}
          <h3 class="editor-sub">4 · Weitere Fotos (unten als Kollage, freiwillig)</h3>
          <div class="field"><div class="gallery-edit">
            ${coll.map((ref, i) => thumbEdit(ref, 'more', i, coll.length, 'data-premove')).join('')}
            <label class="gallery-add">${icon.plus}<span>Fotos</span><input type="file" accept="image/*" multiple data-pphoto="more" hidden></label>
          </div></div>
          <details class="ed-more" data-pmore ${moreOpen ? 'open' : ''}>
            <summary>Mehr Gestaltung <small>freiwillig – ohne Änderung sieht alles gut aus</small></summary>
            <div class="field"><span>Fotos oben: Darstellung</span>${seg('pmode', mode, [['wide', 'Breit'], ['original', 'Originalformat'], ['squares', '2–4 Quadrate nebeneinander', heroImgs.length < 2]])}</div>
            ${mode === 'original' ? align('hero', draft.heroAlign) : ''}
            ${field('Kleine Zeile über der Überschrift', 'kicker', draft.kicker, { placeholder: 'z. B. Mannschaftsporträt · Saison 2026' })}
            ${field('Unterzeile', 'subtitle', draft.subtitle, { placeholder: 'z. B. Aufsteiger, Freunde, Kölschliebhaber' })}
            <div class="field"><span>Großer Textanfang (rot)</span>${seg('pdrop', String(draft.dropcap == null ? 1 : draft.dropcap), [['0', 'Aus'], ['1', '1 Zeichen'], ['2', '2 Zeichen'], ['3', '3 Zeichen']])}</div>
            <div class="field"><span>Textgröße</span>${seg('psize', draft.textSize || 'normal', [['normal', 'Normal'], ['gross', 'Groß']])}</div>
            ${field('Zitat', 'quote', draft.quote, { placeholder: 'z. B. „Wir spielen, um danach zusammenzusitzen.“' })}
            ${field('Zitat von', 'quoteBy', draft.quoteBy)}
            <label class="meet-check"><input type="checkbox" name="original" ${draft.original ? 'checked' : ''}><span>Kollage: Fotos im Originalformat zeigen (nicht zuschneiden)</span></label>
            ${draft.original ? align('collage', draft.collageAlign) : ''}
          </details>
          <p class="form-error" role="alert"></p>
          <div class="ed-actions"><button type="submit" class="btn primary block">Speichern</button><button type="button" class="btn block ed-peek" data-ed-peek>Vorschau ansehen</button></div>
        </form>`);
      document.getElementById('sheet-root').classList.add('side-mode');
      document.body.classList.add('side-editing');
      document.body.classList.remove('no-scroll');
      document.querySelector('#sheet-root .sheet').scrollTop = keep;
      const form = document.querySelector('[data-editor=portrait]');
      const collect = () => {
        ['kicker', 'title', 'subtitle', 'text', 'quote', 'quoteBy'].forEach((k) => { draft[k] = form.elements[k].value.trim(); });
        draft.original = form.elements.original.checked;
      };
      const list = (name) => (name === 'hero' ? 'heroImages' : 'images');
      form.addEventListener('input', () => { setTimeout(() => { collect(); refresh(); }, 0); });
      form.querySelector('[data-pmore]').addEventListener('toggle', (e) => { moreOpen = e.target.open; });
      form.addEventListener('click', (e) => {
        const pk = e.target.closest('[data-ed-peek]');
        if (pk) { togglePeek(pk); return; }
        const t = e.target.closest('[data-pmode],[data-pdrop],[data-psize],[data-palign],[data-premove],[data-move-list]');
        if (!t) return;
        collect();
        if (t.dataset.pmode) draft.heroMode = t.dataset.pmode;
        if (t.dataset.pdrop) draft.dropcap = Number(t.dataset.pdrop);
        if (t.dataset.psize) draft.textSize = t.dataset.psize;
        if (t.dataset.palign) { const [w, v] = t.dataset.palign.split(':'); draft[w === 'hero' ? 'heroAlign' : 'collageAlign'] = v; }
        if (t.dataset.premove) {
          const box = t.closest('[data-list]');
          const l = list(box.dataset.list);
          draft[l] = (draft[l] || []).filter((r) => r !== t.dataset.premove);
          if ((draft.heroImages || []).length < 2 && draft.heroMode === 'squares') draft.heroMode = 'wide';
        }
        if (t.dataset.moveList) {
          const l = list(t.dataset.moveList);
          const arr = (draft[l] || []).filter(shownImage);
          const a = Number(t.dataset.moveIndex); const b = a + Number(t.dataset.moveDir);
          if (b >= 0 && b < arr.length) { [arr[a], arr[b]] = [arr[b], arr[a]]; draft[l] = arr; }
        }
        render(); refresh();
      });
      form.addEventListener('change', async (e) => {
        if (e.target.name === 'original') { collect(); render(); refresh(); return; }
        const which = e.target.dataset.pphoto;
        if (!which || !e.target.files.length) return;
        collect();
        try {
          for (const file of [...e.target.files]) {
            if (which === 'hero' && (draft.heroImages || []).length >= 4) break;
            const img = await ui().loadImage(file);
            const url = ui().largeImage(img, 1800);
            const ref = await api.putMemberImage(url);
            images[ref] = url;
            const l = list(which);
            draft[l] = [...(draft[l] || []), ref];
          }
          if (which === 'hero' && draft.heroImages.length >= 2 && !draft.heroMode) draft.heroMode = 'squares';
          render(); refresh();
        } catch (err) { toast(err.message); }
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        collect();
        try {
          site = await api.setTeamPortrait(key, draft);
          portraitDraft = null;
          endPortraitLive();
          closeSheet();
          toast('Porträt gespeichert', true);
          ui().renderView();
        } catch (err) { form.querySelector('.form-error').textContent = err.message; }
      });
    };
    render();
    refresh();
  }
  function endPortraitLive() {
    document.getElementById('sheet-root').classList.remove('side-mode', 'peek');
    document.body.classList.remove('side-editing');
  }
  new MutationObserver(() => {
    const root = document.getElementById('sheet-root');
    if (portraitDraft && root && !root.querySelector('[data-editor=portrait]')) { portraitDraft = null; endPortraitLive(); ui().renderView(); }
  }).observe(document.getElementById('sheet-root') || document.body, { childList: true });

  async function teamView() {
    await ensure();
    const { icon, partnerSlot } = ui();
    const key = location.hash.split('/')[1] || '';
    if (location.hash.split('/')[2] === 'portraet') return teamPortraitView(key);
    const found = findTeam(key);
    if (!found) return `${ui().viewHead('Mannschaft', 'Diese Mannschaft gibt es nicht (mehr).', false)}<p><a class="btn" href="#sport">Zu den Mannschaften</a></p>`;
    const { team, season } = found;
    const extra = teamContent(key);
    const can = canEditTeam();
    const me = ui().state.member;
    const canPhoto = Boolean(me && (me.isAdmin || (me.teams || []).includes(key)));
    const posts = extra.posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const hasPhoto = extra.photo && (images[extra.photo] || /^assets\//.test(extra.photo));
    return `
      <div class="team-page">
        <header class="view-head page-head">
          <div><p class="page-kicker">Mannschaft · ${esc(season)}</p><h1>${esc(team.name.replace(/\s*\(.*?\)/g, ''))}</h1><p class="muted">${esc(team.group)}</p></div>
          <a class="view-close" href="#sport" aria-label="Zurück zu den Mannschaften">${icon.close}</a>
        </header>
        <div class="team-top">
          <figure class="team-photo ${hasPhoto ? '' : 'empty'}">
            ${hasPhoto ? picture(extra.photo, key, `Teamfoto ${team.name}`) : `<div class="team-photo-empty">${icon.camera}<span>Noch kein Teamfoto</span></div>`}
            ${canPhoto ? `<button type="button" class="btn small team-photo-btn" data-action="team-photo" data-team="${esc(key)}">${icon.camera} ${hasPhoto ? 'Teamfoto ändern' : 'Teamfoto hinzufügen'}</button>` : ''}
          </figure>
          <aside class="team-card">
            <div class="team-card-stats">
              <div><b class="${team.rank === '1' ? 'top' : ''}">${esc(team.rank || '–')}.</b><span>Tabellenplatz</span></div>
              <div><b>${esc(team.points || '–')}</b><span>Punkte</span></div>
            </div>
            <div class="team-card-row"><span>Mannschaftsführer</span><b>${esc(team.captain || '–')}</b></div>
            <div class="team-card-row"><span>Liga</span><b>${esc(team.group)}</b></div>
            <div class="team-card-links">
              <a href="${esc(team.teamUrl)}" target="_blank" rel="noopener">Spielplan &amp; Mannschaft <span>nuLiga ↗</span></a>
              ${team.groupUrl ? `<a href="${esc(team.groupUrl)}" target="_blank" rel="noopener">Tabelle der Gruppe <span>nuLiga ↗</span></a>` : ''}
            </div>
          </aside>
        </div>

        ${portraitCard(key, team, canPhoto, hasPhoto ? extra.photo : null)}
        <div class="team-feed">${await feedSection('team:' + key, { teamName: team.name.replace(/\s*\(.*?\)/g, '') })}</div>
        ${posts.length ? `
          <h2 class="block-heading">Berichte vom Club</h2>
          <div class="run run-posts">${posts.map((b) => `
            <div class="team-post">${renderBlock({ ...b, type: 'post' }, 'team')}
              ${can ? `<button type="button" class="view-close team-post-edit" data-action="team-post" data-team="${esc(key)}" data-id="${esc(b.id)}" aria-label="Beitrag bearbeiten">${icon.pencil}</button>` : ''}
            </div>`).join('')}</div>` : ''}
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
        try {
          const img = await ui().loadImage(e.target.files[0]);
          const url = ui().largeImage(img, 1800);
          const id = await ui().api.putMemberImage(url);
          images[id] = url;
          content.photo = id;
          render();
        } catch (err) { ui().toast(err.message); }
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          site = await ui().api.setTeamPhoto(key, content.photo);
          closeSheet();
          ui().toast('Teamfoto gespeichert', true);
          ui().renderView();
        } catch (err) { ui().toast(err.message); }
      });
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
  async function editChatText() {
    if (!ui().state.member?.isAdmin) return;
    await ensure();
    const groups = [
      ['Chat und Clubgeflüster', [['title','Seitentitel'],['feedTitle','Überschrift der Beiträge'],['feedIntro','Beschreibung'],['writeLabel','Button zum Schreiben'],['allLabel','Button zur Übersicht'],['olderLabel','Ältere Beiträge'],['feedEmpty','Hinweis ohne Beiträge'],['loginLabel','Anmeldebutton']]],
      ['Übersicht aller Beiträge', [['overviewKicker','Zeile über der Überschrift'],['overviewTitle','Überschrift'],['overviewIntro','Beschreibung'],['searchPlaceholder','Suchfeld'],['overviewEmpty','Hinweis ohne Suchergebnisse'],['guestNote','Hinweis für Gäste']]],
      ['Filter und Beschriftungen', [['allAreas','Alle Bereiche'],['clubFilter','Club-Filter'],['teamFilter','Mannschafts-Filter'],['teamLabel','Mannschaftsbeiträge'],['periodAll','Gesamter Zeitraum'],['periodWeek','Sieben Tage'],['periodMonth','Dreißig Tage'],['photosOnly','Fotofilter'],['countOne','Ein einzelner Beitrag'],['countMany','Mehrere Beiträge']]],
    ];
    const copy = chatText();
    ui().openSheet(`<form class="editor chat-text-editor" data-chat-text><h2>Chat-Texte bearbeiten</h2>
      ${groups.map(([title, fields]) => `<fieldset><legend>${esc(title)}</legend>${fields.map(([key, label]) => field(label, key, copy[key])).join('')}</fieldset>`).join('')}
      <p class="form-error" role="alert"></p><button type="submit" class="btn primary block">Speichern</button></form>`);
    const form = document.querySelector('[data-chat-text]');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = form.querySelector('[type=submit]');
      button.disabled = true;
      const next = JSON.parse(JSON.stringify(site));
      next.chatText = Object.fromEntries(groups.flatMap(([, fields]) => fields.map(([key]) => [key, form.elements[key].value.trim()])));
      try {
        site = await ui().api.saveSite(next);
        ui().closeSheet();
        ui().toast('Chat-Texte gespeichert', true);
        await ui().renderView();
      } catch (error) { form.querySelector('.form-error').textContent = error.message; button.disabled = false; }
    });
  }
  TFB.refreshSite = async () => { site = null; await ui().renderView(); };
  Object.assign(TFB.actions, {
    'photo-frame': async (el) => {
      await ensure();
      if (!ui().state.member?.isAdmin) return;
      const ref = el.dataset.ref;
      const src = images[ref] || (/^assets\//.test(ref || '') ? ref : '');
      if (!src) return;
      TFB.photoFrame.open(src, site.photoFrames?.[ref], async frame => {
        site.photoFrames = await ui().api.setPhotoFrame(ref, frame);
        document.querySelectorAll('img[data-photo-ref]').forEach(img => {
          if (img.dataset.photoRef === ref) (img.closest('.photo-frame') || img).outerHTML = picture(ref, ref, img.alt);
        });
        ui().toast('Fotoausschnitt gespeichert', true);
      }, el);
    },
    'chat-text-edit': editChatText,
    'membership-fees': () => {
      const rows = [
        ['Kinder bis 6 Jahre', 'Beitragsfrei'],
        ['Kinder von 7 bis 10 Jahren', '36,00 €'],
        ['Jugendliche von 11 bis 18 Jahren', '75,00 €'],
        ['Erwachsene', '189,00 €'],
        ['Ehepartner', '129,00 €'],
        ['Passive Mitglieder', '50,00 €'],
        ['Auszubildende, Studierende, FSJ und Bufdi', '95,00 €'],
        ['Zweitmitgliedschaft für Erwachsene', '95,00 €'],
      ];
      ui().openSheet(`<section class="editor membership-fees" aria-labelledby="membership-fees-title">
        <p class="fees-eyebrow">Tennisfreunde Bielstein</p>
        <h2 id="membership-fees-title">Mitgliedsbeiträge</h2>
        <p class="fees-intro">Alle Beiträge gelten pro Kalenderjahr.</p>
        <section class="fees-trial" aria-labelledby="fees-trial-title">
          <h3 id="fees-trial-title">Erst mal Tennis ausprobieren</h3>
          <p>Schnuppermitgliedschaft für Tennisanfänger im ersten Jahr der Vereinszugehörigkeit.</p>
          <dl><div><dt>Erwachsene</dt><dd>60,00 €</dd></div><div><dt>Kinder und Jugendliche</dt><dd>36,00 €</dd></div></dl>
        </section>
        <h3 class="fees-regular-title">Reguläre Mitgliedschaft</h3>
        <dl class="fees-list">${rows.map(([label, price]) => `<div><dt>${esc(label)}</dt><dd>${esc(price)}</dd></div>`).join('')}</dl>
        <div class="fees-notes"><p>Das dritte Kind einer Familie ist bis zur Volljährigkeit beitragsfrei.</p><p>Der Aufnahmetermin ist jeweils der 1. Januar.</p></div>
      </section>`);
      const dialog = document.querySelector('.membership-fees')?.closest('[role="dialog"]');
      if (dialog) {
        dialog.setAttribute('aria-labelledby', 'membership-fees-title');
        const close = dialog.querySelector('.sheet-close');
        close.focus();
        dialog.addEventListener('keydown', (event) => {
          if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
        });
      }
    },
    'board-photo-open': async (el) => {
      const people = await ui().api.boardPeople();
      const person = people[Number(el.dataset.index)];
      if (person && person.avatar && person.avatarLarge) ui().openLightbox(person.avatarLarge, person.name);
    },
    'site-edit': async (el) => {
      editing = el.dataset.page;
      ui().closeSheet();
      if (ui().currentView() === routeOf(editing)) ui().renderView(); else location.hash = '#' + routeOf(editing);
      window.scrollTo(0, 0);
    },
    'home-look': async (el) => {
      try {
        site = await ui().api.saveSite({ ...JSON.parse(JSON.stringify(site)), homeLook: el.dataset.look });
        ui().toast(`Look „${(HOME_LOOKS.find(([k]) => k === el.dataset.look) || [])[1]}“ gewählt`, true);
        const y = window.scrollY; await ui().renderView(); window.scrollTo(0, y);
      } catch (err) { ui().toast(err.message); }
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
      if (editing === 'home' && el.dataset.type === 'feature' && blocksOf().filter((b) => b.type === 'feature' && !b._new).length >= MAX_HOME_FEATURES) { ui().toast(`Höchstens ${MAX_HOME_FEATURES} Themen auf der Startseite.`); return; }
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
    'link-move': (el) => moveLink(el.dataset.block, el.dataset.slot, el.dataset.link || 'main'),
    'link-order': (el) => {
      const b = site.pages.home.blocks.find(x => x.id === el.dataset.block);
      if (!b?.link || !b.album) return;
      const mainFirst = (b.link.order || 0) <= (b.album.order || 0);
      b.link.order = mainFirst ? 1 : 0;
      b.album.order = mainFirst ? 0 : 1;
      return commit('Links sortiert');
    },
    'album-edit': (el) => { editing = 'home'; detailEditing = true; openBlockEditor(el.dataset.id, false, 'album'); },
    'feature-edit': (el) => { editing = 'home'; detailEditing = true; openBlockEditor(el.dataset.id, false, 'sub'); },
    'aktuell-tab': (el) => {
      aktuellTab = el.dataset.tab;
      document.querySelectorAll('.aktuell-switch button').forEach((b) => { b.classList.toggle('on', b === el); b.setAttribute('aria-selected', String(b === el)); });
      const grid = document.querySelector('.page-grid.news-dates');
      if (grid) grid.className = `page-grid news-dates show-${aktuellTab}`;
    },
    'post-new': (el) => openCompose(el.dataset.scope),
    'portrait-edit': (el) => openPortraitEditor(el.dataset.team),
    'post-open': (el) => openPost(el.dataset.id),
    'post-edit': (el) => { const p = postCache[el.dataset.id]; if (p) openCompose(p.scope, p.id); },
    'post-delete': async (el) => {
      if (!el.dataset.armed) { el.dataset.armed = '1'; el.textContent = 'Wirklich löschen?'; return; }
      try { await ui().api.deletePost(el.dataset.id); ui().toast('Beitrag gelöscht', true); ui().renderView(); } catch (err) { ui().toast(err.message); }
    },
    'post-hide': async (el) => { await ui().api.hidePost(el.dataset.id, el.dataset.hidden === '1'); ui().toast(el.dataset.hidden === '1' ? 'Ausgeblendet' : 'Wieder sichtbar', true); ui().renderView(); },
    'post-report': async (el) => { await ui().api.reportPost(el.dataset.id); ui().toast('Danke – der Vorstand schaut sich das an.', true); },
    'post-gallery': (el) => { const p = postCache[el.dataset.id]; if (p) openGallery(p.images || [], `${p.author} · ${whenText(p.createdAt)}`); },
    'news-gallery': (el) => {
      const b = Object.values(site.pages).flatMap(p => p.blocks).find(b => b.id === el.dataset.block);
      if (b) openGallery((b.images || []).slice(0, 100), b.title, true);
    },
    'feed-more': (el) => { feedOpen[el.dataset.scope] = true; ui().renderView(); },
    'att-open': (el) => openViewer(el.dataset.ref, el.dataset.kind, el.dataset.title),
    'hero-open': (el) => {
      const b = storyIndex[el.dataset.block] || homeBlocks().find((x) => x.id === el.dataset.block);
      const ref = ((b.more || {}).heroImages || []).filter(shownImage)[Number(el.dataset.index)];
      const src = images[ref] || (/^assets\//.test(ref) ? ref : null);
      if (src) ui().openLightbox(src, b.title);
    },
    'collage-open': (el) => {
      const b = storyIndex[el.dataset.block] || site.pages.home.blocks.find((x) => x.id === el.dataset.block);
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

  // Link eines Home-Themas an den anderen Platz setzen
  function moveLink(blockId, slotName, key = 'main', beforeKey = null) {
    const b = site.pages.home.blocks.find((x) => x.id === blockId);
    const link = key === 'album' ? b?.album : b?.link;
    if (!link) return;
    link.position = /^(left|right|right-\d+)$/.test(slotName) ? slotName : 'right';
    if (beforeKey && beforeKey !== key && b.link && b.album) {
      link.order = 0;
      (key === 'album' ? b.link : b.album).order = 1;
    }
    return commit('Link verschoben');
  }
  let dragBlock = null;
  let dragLink = 'main';
  document.addEventListener('dragstart', (e) => {
    const d = e.target.closest && e.target.closest('.link-drag');
    if (!d) return;
    dragBlock = d.dataset.block;
    dragLink = d.dataset.link || 'main';
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', dragBlock); } catch (_) {}
    document.body.classList.add('dragging-link');
    const art = d.closest('.feature');
    if (art) art.classList.add('drag-src');
  });
  document.addEventListener('dragend', () => {
    dragBlock = null;
    document.body.classList.remove('dragging-link');
    document.querySelectorAll('.link-slot.over').forEach((x) => x.classList.remove('over'));
    document.querySelectorAll('.feature.drag-src').forEach((x) => x.classList.remove('drag-src'));
  });
  document.addEventListener('dragover', (e) => {
    const slot = e.target.closest && e.target.closest('.link-slot');
    if (!slot || !dragBlock || slot.dataset.block !== dragBlock) return;
    e.preventDefault();
    document.querySelectorAll('.link-slot.over').forEach((x) => x !== slot && x.classList.remove('over'));
    slot.classList.add('over');
  });
  document.addEventListener('drop', (e) => {
    const slot = e.target.closest && e.target.closest('.link-slot');
    if (!slot || !dragBlock || slot.dataset.block !== dragBlock) return;
    e.preventDefault();
    const id = dragBlock;
    dragBlock = null;
    document.body.classList.remove('dragging-link');
    moveLink(id, slot.dataset.slot, dragLink, e.target.closest('.link-drag')?.dataset.link);
  });
  // Im Bearbeiten-Modus öffnen Links nicht (sonst stört es beim Ziehen und Antippen)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.editing-page .link-drag a, .editing-page .feature-link a')) e.preventDefault();
  }, true);

  // WYSIWYG-Textfelder: Auswahl gestalten, Ergebnis laufend als Text mit Zeichen speichern
  const syncRich = (area) => {
    const ta = area.parentElement.querySelector(`textarea[name="${area.dataset.richFor}"]`);
    if (ta) ta.value = toMarkup(area);
  };
  document.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('.rich-area')) syncRich(e.target); });
  document.addEventListener('focusin', (e) => {
    if (e.target.matches && e.target.matches('.rich-area')) { try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (_) {} }
  });
  // Eingefügter Text kommt ohne fremde Formatierung an
  document.addEventListener('paste', (e) => {
    const area = e.target.closest && e.target.closest('.rich-area');
    if (!area) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });
  // Toolbar-Knöpfe dürfen die Auswahl im Textfeld nicht aufheben
  document.addEventListener('mousedown', (e) => { if (e.target.closest('.rich-tools button')) e.preventDefault(); });

  function wrapSelection(area, className) {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed || !area.contains(sel.anchorNode)) { ui().toast('Bitte zuerst Wörter im Text markieren'); return; }
    const range = sel.getRangeAt(0);
    // Gleiche Gestaltung nochmal = wieder entfernen
    const inside = sel.anchorNode.parentElement && sel.anchorNode.parentElement.closest(`span.${className}`);
    if (inside && area.contains(inside)) { inside.replaceWith(...inside.childNodes); return; }
    const span = document.createElement('span');
    span.className = className;
    span.appendChild(range.extractContents());
    range.insertNode(span);
    sel.removeAllRanges();
    const r = document.createRange(); r.selectNodeContents(span); sel.addRange(r);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rich]');
    if (!btn) return;
    const area = btn.closest('.field').querySelector('.rich-area');
    if (!area) return;
    if (document.activeElement !== area) {
      // Fokus zurückholen, ohne die Markierung zu verlieren
      const sel = window.getSelection();
      const keep = sel.rangeCount && area.contains(sel.anchorNode) ? sel.getRangeAt(0).cloneRange() : null;
      area.focus();
      if (keep) { sel.removeAllRanges(); sel.addRange(keep); }
    }
    const cmd = btn.dataset.rich;
    if (['bold', 'italic', 'underline'].includes(cmd)) document.execCommand(cmd);
    else if (SPANS[cmd]) wrapSelection(area, SPANS[cmd]);
    else if (cmd === 'h') {
      const block = window.getSelection().anchorNode && window.getSelection().anchorNode.parentElement.closest('h3, p, div');
      document.execCommand('formatBlock', false, block && block.tagName === 'H3' ? 'p' : 'h3');
    } else if (cmd === 'clear') {
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) { ui().toast('Bitte zuerst den Text markieren, der wieder schlicht werden soll'); return; }
      const range = sel.getRangeAt(0);
      const text = range.toString();
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    } else if (cmd === 'link') {
      const sel = window.getSelection();
      const chosen = sel.rangeCount ? sel.toString() : '';
      const range = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      const url = prompt('Wohin soll der Link führen?\n(Website mit https://… oder eine Seite wie #kiosk, #sport, #club)', 'https://');
      if (!url || url === 'https://' || !/^(https?:\/\/|#)/.test(url.trim())) return;
      const label = chosen || prompt('Welcher Text soll im Fließtext stehen?', '') || url.replace(/^https?:\/\/(www\.)?/, '');
      const a = document.createElement('a');
      a.className = 'inline-link';
      a.href = url.trim();
      a.textContent = label;
      if (range && area.contains(range.commonAncestorContainer)) { range.deleteContents(); range.insertNode(a); } else area.appendChild(a);
    }
    syncRich(area);
  });
})();
