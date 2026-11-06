// Das Clubarchiv liest die redaktionellen Beiträge und den importierten Bestand.
(() => {
  const root = '#club/archiv';
  const mediaHost = 'https://tfb-clubarchiv-media.calvinjohncamp.workers.dev/';
  const liveMedia = location.protocol === 'https:' && TFB.config.memberDirectory?.hosts.includes(location.hostname);
  const mediaKey = ref => /^assets\/clubarchiv\/medien\/([a-f0-9]{22}\.(?:webp|pdf|mp4))$/.exec(ref)?.[1];
  const mediaUrl = ref => liveMedia && mediaKey(ref) ? mediaHost + mediaKey(ref) : ref;
  function resolveMedia(template) {
    for (const node of template.content.querySelectorAll('img[src], a[href]')) {
      const attr = node.tagName === 'IMG' ? 'src' : 'href';
      const ref = node.getAttribute(attr);
      if (mediaKey(ref)) node.setAttribute(attr, mediaUrl(ref));
    }
  }
  const overviewRoute = root + '/alle';
  const collections = ['Bielstein Open', 'Fotogalerien', 'TFB-Life', 'Chronik', 'Mannschaften', 'Vereinsleben'];
  const older = 8;
  const batch = 24;
  const datesBatch = 12;
  const esc = value => TFB.ui.esc(value ?? '');
  const detail = item => root + '/beitrag/' + encodeURIComponent(item.id);
  const date = value => new Intl.DateTimeFormat('de-DE', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value));
  const newestFirst = (a, b) => (b.date || b.year || '').localeCompare(a.date || a.year || '');
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss');
  let loading;
  let entries = [];
  let byId = new Map();
  let render;
  let resultLimit = batch;
  let feedLimit = older;
  let datesLimit = datesBatch;
  let archiveTab = 'news';
  let dates = [];

  async function loadArchive() {
    loading ||= fetch('assets/clubarchiv/bestand.json').then(response => {
      if (!response.ok) throw new Error('Das Clubarchiv konnte nicht geladen werden.');
      return response.json();
    }).catch(error => { loading = undefined; throw error; });
    return loading;
  }

  function heading(back, tools = '') {
    return `<header class="view-head page-head archive-head"><h1>Clubarchiv</h1>
      ${tools || `<a class="view-close" href="${back}" aria-label="Zurück">${TFB.ui.icon.close}</a>`}</header>`;
  }

  function card(item) {
    return `<a class="mini" href="${detail(item)}">
      ${item.photos.length ? `<span class="mini-img">${render.picture(item.photos[0], item.id, item.title)}</span>` : ''}
      <span class="mini-head"><span><b>${esc(item.title)}</b>${item.year ? `<small>${esc(item.date ? date(item.date) : item.year)}</small>` : ''}</span></span>
      ${item.summary ? `<span class="mini-text">${esc(item.summary)}</span>` : ''}</a>`;
  }

  function options(values, selected, all) {
    return `<option value="">${all}</option>` + values.map(value =>
      `<option${value === selected ? ' selected' : ''}>${esc(value)}</option>`).join('');
  }

  function feed() {
    const overviewLink = render.contentOverviewLink('club/archiv');
    const news = `
      <div class="aktuell-column-head"><h2 class="block-heading">News</h2>${overviewLink}</div>
      <div class="run run-posts archive-feed" data-archive-feed>${entries.slice(0, feedLimit).map(item => article(item)).join('')}</div>
      <button class="btn" type="button" data-archive-feed-more ${entries.length <= feedLimit ? 'hidden' : ''}>Ältere Beiträge anzeigen</button>`;
    const appointments = `
      <h2 class="block-heading">Save the Date</h2>
      <div class="archive-dates" data-archive-dates>${dates.slice(0, datesLimit).map(dateCard).join('')}</div>
      <button class="btn" type="button" data-archive-dates-more ${dates.length <= datesLimit ? 'hidden' : ''}>Ältere Termine anzeigen</button>`;
    return `<section class="site-page club-archive archive-home">
      ${heading('#club', overviewLink)}
      ${render.newsDatesLayout(news, appointments, archiveTab, 'archive-tab')}
    </section>`;
  }

  function historicalDate(item) {
    const template = document.createElement('template');
    template.innerHTML = item.html;
    const refs = [item.cover, ...[...template.content.querySelectorAll('a[href$=".pdf"], img[src]')]
      .map(el => el.getAttribute('href') || el.getAttribute('src'))];
    const attachments = [...new Set(refs.filter(ref => /^assets\/clubarchiv\/medien\/[a-f0-9]+\.(?:webp|pdf)$/.test(ref)))]
      .map(ref => ({ ref, kind: ref.endsWith('.pdf') ? 'pdf' : 'image', name: item.title + (ref.endsWith('.pdf') ? '.pdf' : '.webp') }));
    const calendarInfo = item.id.startsWith('kalender-') ? template.content.querySelector('p') : null;
    const meta = calendarInfo?.textContent || '';
    const summary = meta && item.summary.startsWith(meta) ? item.summary.slice(meta.length).trim() : item.summary;
    const text = summary.length > 180 ? summary.slice(0, 180).replace(/\s+\S*$/, '') + ' …' : summary;
    resolveMedia(template);
    return { ...item, attachments, text, place: meta, html: template.innerHTML };
  }

  function dateCard(item) {
    if (!item.attachments) return render.eventCard(item);
    return render.eventCard(item, { attachments: item.attachments, href: detail(item) });
  }

  function dateView(item) {
    return `<section class="site-page club-archive archive-reading">
      ${heading(root)}
      <h2 class="block-heading">Save the Date</h2>
      ${render.eventCard({ ...item, place: '' }, { attachments: item.attachments, body: `<div class="archive-text">${item.html}</div>` })}
      ${item.source ? `<p class="archive-source"><a class="more-link" href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">Quelle auf der alten Website</a></p>` : ''}
    </section>`;
  }

  function overview(years, params) {
    return `<section class="club-archive content-overview">
      ${heading(root)}
      <div class="ov-filters archive-filters">
        <label class="ov-search"><input type="search" data-archive-filter="search" aria-label="Clubarchiv durchsuchen" placeholder="Titel oder Stichwort" autocomplete="off"></label>
        <select data-archive-filter="year" aria-label="Jahrgang">${options(years, params.get('jahr'), 'Alle Jahre')}</select>
        <select data-archive-filter="topic" aria-label="Sammlung">${options(collections, params.get('thema'), 'Alle Themen')}</select>
        <label class="meet-check ov-photos"><input type="checkbox" data-archive-filter="photos"><span>Nur mit Fotos</span></label>
      </div>
      <p class="ov-count muted small" data-archive-count aria-live="polite"></p>
      <div class="mini-grid" data-archive-results></div>
      <button class="btn" type="button" data-archive-more hidden>Weitere Beiträge anzeigen</button>
      <p class="ov-empty muted" data-archive-empty hidden>Keine Beiträge gefunden.</p>
    </section>`;
  }

  function article(item, full = false) {
    const body = `
      <div class="archive-text">${full ? item.fullBody : item.body}</div>
      ${!full && item.hasAlbums ? `<p><a class="more-link" href="${detail(item)}">Zur vollständigen Galerie</a></p>` : ''}`;
    return render.newsPost({ id: 'archive-' + item.id, title: item.title, date: item.date, images: item.photos }, {
      href: full ? '' : detail(item), year: item.year, body,
    });
  }

  function articleView(item) {
    if (!item) return `<section class="club-archive">${heading(overviewRoute)}<p>Beitrag nicht gefunden.</p></section>`;
    const related = item.series ? entries.filter(other => other.id !== item.id && other.series === item.series) : [];
    return `<section class="site-page club-archive archive-reading">
      ${heading(overviewRoute)}
      ${article(item, true)}
      ${related.length ? `<section class="archive-panel"><h2>${esc(item.series)}</h2><ul>${related.map(other =>
        `<li><a href="${detail(other)}">${esc(other.title)}</a></li>`).join('')}</ul></section>` : ''}
      ${item.source ? `<p class="archive-source"><a class="more-link" href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">Quelle auf der alten Website</a></p>` : ''}
    </section>`;
  }

  function imported(item) {
    const template = document.createElement('template');
    template.innerHTML = item.html;
    const images = [...template.content.querySelectorAll('img[src]')];
    const photos = [...new Set([item.cover, ...images.map(img => img.getAttribute('src'))].filter(render.shownImage))];
    const hasAlbums = Boolean(template.content.querySelector('details .archive-gallery'));
    const plain = template.content.textContent.trim();
    for (const img of images) {
      if (img.closest('details')) continue;
      const link = img.closest('a');
      if (link && !link.textContent.trim()) {
        const href = link.getAttribute('href') || '';
        if (/\.pdf(?:[?#]|$)/i.test(href)) link.textContent = 'PDF öffnen';
        else if (/\.mp4(?:[?#]|$)/i.test(href)) link.textContent = 'Video öffnen';
        else link.remove();
      } else img.remove();
    }
    resolveMedia(template);
    const fullBody = template.innerHTML;
    template.content.querySelectorAll('details').forEach(el => el.remove());
    if (hasAlbums) template.content.querySelectorAll('h2').forEach(el => {
      if (el.textContent === 'Fotogalerie') el.remove();
    });
    return { ...item, photos, hasAlbums, fullBody, body: template.innerHTML, search: item.search || normalize(item.title + ' ' + plain) };
  }

  function editorial({ b, page }, prior, sortYear) {
    const gallery = b.type === 'gallery' || b.type === 'collage';
    const more = b.more || {};
    const sections = Array.isArray(more.sections) ? more.sections : [];
    const story = sections.length ? sections.map(section => {
      if (section.type === 'h') return section.text ? `## ${section.text}` : '';
      if (section.type === 'quote') return [section.text, section.by].filter(Boolean).join(' · ');
      return section.text || '';
    }).filter(Boolean).join('\n\n') : more.text;
    const text = [b.subtitle, b.showText === false ? '' : b.text, story]
      .filter((value, index, all) => value && all.indexOf(value) === index).join('\n\n');
    const photos = [...new Set([
      ...(b.images || []), b.image, ...(more.heroImages || []), ...(more.images || []),
      ...(b.album?.enabled ? b.album.images || [] : []),
    ].filter(ref => ref && !ref.startsWith('ph:') && render.shownImage(ref)))];
    const year = b.date?.slice(0, 4) || '';
    const title = b.title || b.caption || 'Fotos aus dem Club';
    const topic = gallery ? 'Fotogalerien' : 'Vereinsleben';
    const topics = [...new Set([topic, ...(prior?.topics || [])])];
    const links = b.type === 'feature' ? [b.link, b.link2]
      .filter(link => /^(?:https?:\/\/|#[a-z])/i.test(link?.url || ''))
      .map(link => `<p><a class="more-link" href="${esc(link.url)}">${esc(link.label || 'Mehr erfahren')}</a></p>`).join('') : '';
    const body = (text ? render.paragraphs(text) : '') + links;
    const summary = text.replace(/\{\/?[a-z]+\}|\*\*/g, '').replace(/\s+/g, ' ').trim();
    return { id: prior?.id || `${page}-${b.id}`, title, date: b.date || '', year, sortYear, gallery, photos, topics,
      body, fullBody: body, source: prior?.source, search: normalize(`${title} ${text} ${topics.join(' ')} ${year}`),
      summary: summary.length > 180 ? summary.slice(0, 180).replace(/\s+\S*$/, '') + ' …' : summary };
  }

  function combine(items, blocks) {
    const newest = blocks.map(({ b }) => b.date || '').sort().at(-1)?.slice(0, 4) || String(new Date().getFullYear());
    const mirrored = new Map(items.filter(item => item.existing?.startsWith('#aktuell/beitrag/'))
      .map(item => [item.existing.split('/').at(-1), item]));
    const replaced = new Set();
    const current = [];
    for (const entry of blocks) {
      const prior = entry.page === 'aktuell' ? mirrored.get(entry.b.id) : undefined;
      const item = editorial(entry, prior, newest);
      if (prior) replaced.add(prior.id);
      // Home und Aktuell enthalten teilweise dieselbe Fotostrecke.
      if (item.gallery && item.date && item.photos.length && current.some(other =>
        other.gallery && other.date === item.date && item.photos.every(ref => other.photos.includes(ref)))) continue;
      current.push(item);
    }
    return [...current, ...items.filter(item => !replaced.has(item.id)).map(imported)]
      .sort((a, b) => (b.year || b.sortYear || '').localeCompare(a.year || a.sortYear || '') || b.date.localeCompare(a.date));
  }

  function showResults() {
    const output = document.querySelector('[data-archive-results]');
    if (!output) return;
    const scope = output.closest('.club-archive');
    const field = name => scope.querySelector(`[data-archive-filter="${name}"]`);
    const words = normalize(field('search').value).trim().split(/\s+/).filter(Boolean);
    const year = field('year').value;
    const topic = field('topic').value;
    const photos = field('photos').checked;
    const results = entries.filter(item => (!year || item.year === year) && (!topic || item.topics.includes(topic))
      && (!photos || item.photos.length) && words.every(word => item.search.includes(word)))
      .sort(newestFirst);
    output.innerHTML = results.slice(0, resultLimit).map(card).join('');
    scope.querySelector('[data-archive-count]').textContent = `${results.length} ${results.length === 1 ? 'Beitrag' : 'Beiträge'}`;
    scope.querySelector('[data-archive-more]').hidden = results.length <= resultLimit;
    scope.querySelector('[data-archive-empty]').hidden = results.length > 0;
  }

  function filterChanged(event) {
    if (!event.target.matches('[data-archive-filter]')) return;
    if ((event.type === 'input') !== (event.target.type === 'search')) return;
    resultLimit = batch;
    showResults();
  }

  document.addEventListener('input', filterChanged);
  document.addEventListener('change', filterChanged);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-archive-more]')) {
      resultLimit += batch;
      showResults();
    }
    const feedMore = event.target.closest('[data-archive-feed-more]');
    if (feedMore) {
      feedMore.previousElementSibling.insertAdjacentHTML('beforeend', entries.slice(feedLimit, feedLimit + older).map(item => article(item)).join(''));
      feedLimit += older;
      feedMore.hidden = entries.length <= feedLimit;
    }
    const datesMore = event.target.closest('[data-archive-dates-more]');
    if (datesMore) {
      datesMore.previousElementSibling.insertAdjacentHTML('beforeend', dates.slice(datesLimit, datesLimit + datesBatch).map(dateCard).join(''));
      datesLimit += datesBatch;
      datesMore.hidden = dates.length <= datesLimit;
    }
    const photo = event.target.closest('[data-archive-photo]');
    if (photo && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      TFB.ui.openLightbox(photo.href, photo.querySelector('img')?.alt);
    }
  });

  TFB.clubArchive = {
    rendered: showResults,
    mediaUrl,
    downloadUrl(ref, filename) {
      const url = mediaUrl(ref);
      return url !== ref ? url + '?' + new URLSearchParams({ download: filename }) : url;
    },
    selectTab: tab => { archiveTab = tab; },
    photoEntry: id => id.startsWith('archive-') ? byId.get(id.slice('archive-'.length)) : undefined,
    teaser: () => `<a class="club-archive-link" href="${root}">
      <span class="club-archive-link-icon" aria-hidden="true">${TFB.ui.icon.news}</span>
      <span class="club-archive-link-copy"><strong>Clubarchiv</strong><span>Geschichten, Fotos und Termine aus dem Vereinsleben</span></span>
      <span class="club-archive-link-arrow" aria-hidden="true">${TFB.ui.icon.chevron}</span>
    </a>`,
    async view(hash, toolkit) {
      const [path, query] = hash.split('?');
      const [, , mode, id] = path.split('/');
      const { items } = await loadArchive();
      render = toolkit;
      entries = combine(items.filter(item => !item.event), toolkit.blocks.filter(({ b }) => b.type !== 'event'));
      byId = new Map(entries.map(item => [item.id, item]));
      const historical = items.filter(item => item.event).map(historicalDate);
      const historicalById = new Map(historical.map(item => [item.id, item]));
      dates = [...toolkit.blocks.filter(({ b }) => b.type === 'event').map(({ b }) => b), ...historical].sort(newestFirst);
      if (mode === 'beitrag') {
        const key = decodeURIComponent(id || '');
        return historicalById.has(key) ? dateView(historicalById.get(key)) : articleView(byId.get(key));
      }
      if (mode === 'alle') {
        resultLimit = batch;
        const years = [...new Set(entries.map(item => item.year).filter(Boolean))].sort().reverse();
        return overview(years, new URLSearchParams(query));
      }
      feedLimit = older;
      datesLimit = datesBatch;
      return feed();
    },
  };
})();
