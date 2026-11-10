// Dedicated tournament history; original archive records remain the single content source.
(() => {
  const root = '#club/history/bielstein-open';
  const years = ['2024', '2023', '2022', '2021'];
  const tabs = [['bericht', 'Turnierbericht', 'report'], ['bilder', 'Bildergalerie', 'gallery'], ['presse', 'Presse', 'press'], ['zeitung', 'Turnierzeitung', 'paper'], ['ergebnisse', 'Ergebnisse', 'results'], ['sponsoren', 'Sponsoren', 'sponsors'], ['video', 'Video', 'video']];
  const esc = value => TFB.ui.esc(value ?? '');
  const data = () => TFB.bielsteinOpenData;
  const link = (year = '2024', tab = 'bericht', id = '') => `${root}/${year}/${tab}${id ? '/' + encodeURIComponent(id) : ''}`;
  const source = ref => TFB.clubArchive.mediaUrl(ref);
  let toolkit;
  let albums = new Map();
  const batch = 24;

  function routeFor(item) {
    const id = typeof item === 'string' ? item : item?.id;
    for (const year of years) {
      const d = data()[year];
      for (const [tab, , key] of tabs) if (key !== 'sponsors' && d[key] === id) return link(year, tab);
      if (d.extras.includes(id)) return link(year, 'bericht', id);
    }
    return typeof item === 'object' && item?.topics?.includes('Bielstein Open') && years.includes(item.year) ? link(item.year) : '';
  }

  const available = year => tabs.filter(([, , key]) => data()[year][key]);
  const yearPills = (year, tab = 'bericht') => `<nav class="bo-years" aria-label="Bielstein Open Jahrgänge">${years.map(y => `<a class="history-pill${year === y ? ' on' : ''}" href="${link(y, data()[y][tabs.find(t => t[0] === tab)?.[2]] ? tab : 'bericht')}"${year === y ? ' aria-current="true"' : ''}>${y}</a>`).join('')}</nav>`;
  const contentPills = (year, tab) => `<nav class="bo-tabs" aria-label="Inhalte Bielstein Open ${year}">${available(year).map(([key, label]) => `<a class="history-pill${key === tab ? ' on' : ''}" href="${link(year, key)}"${key === tab ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;

  function teaser(render) {
    const d = data()['2024'];
    return `<section class="bo-teaser" aria-labelledby="bo-teaser-title">
      <header><p class="page-kicker">Vier Jahre Spitzentennis in Bielstein</p><h2 id="bo-teaser-title">Bielstein Open</h2><p>Turniergeschichten, Bilder und die Menschen, die sie möglich gemacht haben.</p></header>
      ${yearPills('2024')}
      <div class="bo-teaser-grid"><a class="bo-teaser-image" href="${link()}" aria-label="Bielstein Open 2024 ansehen">${render.picture(d.hero, d.hero, 'Finalisten und Turnierdirektor bei den Bielstein Open 2024', true)}</a>
        <div class="bo-teaser-copy"><h3>Bielstein Open 2024</h3><p>${esc(d.intro)}</p>${contentPills('2024', '')}</div></div>
    </section>`;
  }

  function template(item) {
    const t = document.createElement('template');
    t.innerHTML = item?.html || '';
    for (const a of t.content.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (href.startsWith('assets/clubarchiv/')) a.href = source(href);
      const legacy = /#club\/archiv\/beitrag\/([^/?#]+)/.exec(href);
      if (legacy && routeFor(decodeURIComponent(legacy[1]))) a.href = routeFor(decodeURIComponent(legacy[1]));
    }
    for (const img of t.content.querySelectorAll('img[src]')) { img.dataset.boRef = img.getAttribute('src'); img.src = source(img.dataset.boRef); }
    return t;
  }

  function sponsors(year) {
    const rows = data()[year].sponsors;
    return `<section class="bo-sponsors" aria-labelledby="bo-sponsors-title"><h2 id="bo-sponsors-title">Die Partner ${year}</h2><p>Mit ihrer Unterstützung wurden die Bielstein Open ${year} möglich.</p>
      ${['Premium Partner', 'Exklusiv Partner'].map(group => `<section class="bo-sponsor-group"><h3>${group}</h3><div class="bo-sponsor-grid">${rows.filter(s => s.group === group).map(s => {
        const logo = `<img src="${esc(s.logo)}" alt="${esc(s.name)}" loading="lazy" decoding="async">`;
        return /^https?:\/\//i.test(s.url) ? `<a class="bo-sponsor-tile" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.name)} – Website öffnen">${logo}</a>` : `<div class="bo-sponsor-tile">${logo}</div>`;
      }).join('')}</div></section>`).join('')}</section>`;
  }

  function report(item, year, byId) {
    const d = data()[year], t = template(item);
    const isMain = item.id === d.report;
    // Keep the complete report text, with one real tournament photo instead of repeated title logos.
    let caption = '';
    if (isMain) {
      caption = t.content.querySelector('figcaption')?.textContent || '';
      t.content.querySelectorAll('figure').forEach(f => f.remove());
      t.content.querySelectorAll('img').forEach(img => img.remove());
      if (year === '2021' || year === '2023') caption = 'Foto: Lysann Sander';
    }
    return `<article class="bo-report">
      <h2>${isMain ? 'Bielstein Open ' + year : esc(item.title)}</h2>
      ${isMain ? `<figure class="bo-report-photo">${toolkit.picture(d.hero, d.hero, `Bielstein Open ${year}`, true)}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>` : ''}
      <div class="bo-prose">${t.innerHTML}</div>
      ${d.extras.length ? `<details class="bo-additional"><summary>Weitere Beiträge aus ${year}</summary><ul>${[d.report, ...d.extras].filter(id => id !== item.id).map(id => `<li><a href="${link(year, 'bericht', id === d.report ? '' : id)}">${esc(byId.get(id)?.title || 'Turnierbeitrag')}</a></li>`).join('')}</ul></details>` : ''}
    </article>${sponsors(year)}`;
  }

  function photoButton(photo, index, key) {
    return `<button class="bo-photo" type="button" data-action="bielstein-open-photo" data-album="${esc(key)}" data-index="${index}" aria-label="Foto ${index + 1} groß ansehen">${toolkit.picture(photo.ref, photo.ref, photo.alt, true)}</button>`;
  }

  function gallery(item, year) {
    const t = document.createElement('template');t.innerHTML = item.html;
    const groups = [...t.content.querySelectorAll('details')];
    const labels = year === '2023' ? ['Finaltag', 'Tag 4', 'Tag 3', 'Tag 2', 'Tag 1'] : year === '2021' ? ['Finaltag · 29. August', '28. August', '27. August', '26. August', '25. August'] : [];
    const sets = (groups.length ? groups : [t.content]).map((group, i) => {
      const refs = new Set();
      const photos = [...group.querySelectorAll('img[src]')].map(img => ({ ref: img.getAttribute('src'), alt: img.alt || `Bielstein Open ${year}` })).filter(p => !refs.has(p.ref) && refs.add(p.ref));
      const label = labels[i] || (groups.length === 1 ? 'Die Turnierwoche' : group.querySelector('summary')?.textContent.split(' · ')[0]) || 'Turnierbilder';
      const key = `${year}-${i}`;albums.set(key, { title: `Bielstein Open ${year} · ${label}`, photos, limit: batch });
      return { key, label, photos };
    });
    return `<section class="bo-gallery"><h2>Bildergalerie ${year}</h2><p>${sets.reduce((sum, s) => sum + s.photos.length, 0)} Erinnerungen an die Turnierwoche.</p>
      ${sets.map((set, i) => `<details class="bo-album"${i === 0 ? ' open' : ''}><summary>${esc(set.label)} <span>${set.photos.length} Bilder</span></summary><div class="bo-photo-grid" data-bo-grid="${set.key}">${set.photos.slice(0, batch).map((p, index) => photoButton(p, index, set.key)).join('')}</div>${set.photos.length > batch ? `<button class="history-pill bo-more" type="button" data-action="bielstein-open-more" data-album="${set.key}">Weitere Bilder</button>` : ''}</details>`).join('')}</section>`;
  }

  function resources(item, year, title) {
    const t = template(item), files = [];
    for (const a of t.content.querySelectorAll('a[href]')) {
      if (!/\.pdf(?:[?#]|$)/i.test(a.getAttribute('href'))) continue;
      const img = a.querySelector('img');
      files.push({ href: a.href, cover: img?.src || '', label: a.textContent.trim().replace(/[_-]+/g, ' ') || `${title} ${year}` });
      const figure = a.closest('figure');(figure || a).remove();
    }
    const photos = [...t.content.querySelectorAll('img[src]')].map(img => ({ref: img.dataset.boRef || img.getAttribute('src'), alt: img.alt || `${title} ${year}`}));
    const key = `${year}-resources`;albums.set(key, { title: `${title} ${year}`, photos, limit: photos.length });
    t.content.querySelectorAll('figure').forEach(f => f.remove());t.content.querySelectorAll('img').forEach(img => img.remove());
    // Cover instructions from the old site become a clear, accessible document link.
    for (const p of t.content.querySelectorAll('p')) if (/Zum Anzeigen.*Bild klicken/i.test(p.textContent)) p.remove();
    return `<section class="bo-resources"><h2>${title} ${year}</h2><div class="bo-prose">${t.innerHTML}</div>
      <div class="bo-files">${files.map(file => `<a class="bo-file${file.cover ? ' has-cover' : ''}" href="${esc(file.href)}" target="_blank" rel="noopener noreferrer">${file.cover ? `<span class="bo-file-cover"><img src="${esc(file.cover)}" alt="${esc(title)}" loading="lazy"></span>` : ''}<span class="bo-file-copy"><b>${esc(file.label)}</b><span>Dokument öffnen <span aria-hidden="true">↗</span></span></span></a>`).join('')}</div>
      ${photos.length ? `<div class="bo-document-images">${photos.map((p, i) => photoButton(p, i, key)).join('')}</div>` : ''}
    </section>`;
  }

  function video(item, year) {
    const t = template(item), href = t.content.querySelector('a[href*=".mp4"]')?.href;
    return `<section class="bo-video"><h2>Turnierfilm ${year}</h2>${href ? `<video controls playsinline preload="none" poster="${esc(source(data()[year].hero))}"><source src="${esc(href)}" type="video/mp4"></video><p><a class="history-pill" href="${esc(href)}" target="_blank" rel="noopener">Video öffnen</a></p>` : '<p>Das Video ist gerade nicht verfügbar.</p>'}</section>`;
  }

  async function view(hash, render) {
    toolkit = render;albums = new Map();
    const parts = hash.split('?')[0].split('/');
    const year = years.includes(parts[3]) ? parts[3] : '2024';
    const d = data()[year];
    const tab = available(year).some(t => t[0] === parts[4]) ? parts[4] : 'bericht';
    const { items } = await TFB.clubArchive.load();
    const byId = new Map(items.map(i => [i.id, i]));
    const key = tabs.find(t => t[0] === tab)[2];
    let id = d[key];
    if (tab === 'bericht' && d.extras.includes(parts[5])) id = parts[5];
    const item = byId.get(id);
    let body;
    if (tab === 'sponsoren') body = sponsors(year);
    else if (!item) body = '<p>Dieser Turnierbeitrag ist gerade nicht verfügbar.</p>';
    else if (tab === 'bericht') body = report(item, year, byId);
    else if (tab === 'bilder') body = gallery(item, year);
    else if (tab === 'video') body = video(item, year);
    else body = resources(item, year, tabs.find(t => t[0] === tab)[1]);
    return `<section class="site-page bielstein-open-page">
      <header class="view-head page-head"><div><p class="page-kicker">Unsere Turniergeschichte</p><h1>Bielstein Open</h1><p>Spitzentennis in Bielstein · ${year}</p></div><a class="view-close" href="#club" aria-label="Zurück zur Clubseite">${TFB.ui.icon.close}</a></header>
      ${yearPills(year, tab)}${contentPills(year, tab)}<div class="bo-content" data-bo-year="${year}" data-bo-tab="${tab}">${body}</div>
      <p class="bo-back"><a class="history-pill" href="#club">Zur Clubseite</a></p>
    </section>`;
  }

  TFB.actions = TFB.actions || {};
  TFB.actions['bielstein-open-photo'] = el => {
    const album = albums.get(el.dataset.album);
    if (album) toolkit.openGallery(album.photos.map(p => p.ref), album.title, true, Number(el.dataset.index) || 0);
  };
  TFB.actions['bielstein-open-more'] = el => {
    const album = albums.get(el.dataset.album);if (!album) return;
    const grid = el.previousElementSibling;
    grid.insertAdjacentHTML('beforeend', album.photos.slice(album.limit, album.limit + batch).map((p, i) => photoButton(p, album.limit + i, el.dataset.album)).join(''));
    album.limit += batch;if (album.limit >= album.photos.length) el.remove();
  };
  TFB.bielsteinOpen = { teaser, view, routeFor, isEntry: item => Boolean(routeFor(item)) };
})();
