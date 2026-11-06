(function () {
  const ui = () => TFB.ui;
  const admin = () => Boolean(ui()?.isAdmin());
  const esc = value => ui().esc(value ?? '');
  let partners = [];
  let search = '';
  let rotation, revision;
  const tiers = {premium: 'Premium-Partner', partner: 'Partner', regional: 'Regionalpartner'};

  function rows() {
    const query = search.trim().toLocaleLowerCase('de');
    return partners.filter(p => [p.name, p.company].some(value =>
      (value || '').toLocaleLowerCase('de').includes(query)
    )).map(p => `
      <article class="partner-admin-row" data-partner-row="${esc(p.id)}">
        <div class="partner-admin-logo">${p.logoPreview ? `<img src="${esc(p.logoPreview)}" alt="${esc(p.name)}">` : 'Logo'}</div>
        <div class="partner-admin-name">
          <h3>${esc(p.name)}</h3>
          ${p.company && p.company !== p.name ? `<p>${esc(p.company)}</p>` : ''}
          <small>${tiers[p.tier] || tiers.regional}${p.tier === 'regional' ? ' · 300 € pro Jahr' : ''}</small>
        </div>
        <div class="partner-admin-actions">
          <button type="button" class="btn small" data-action="partner-edit" data-id="${esc(p.id)}">Bearbeiten</button>
          <button type="button" class="link" data-action="partner-remove" data-id="${esc(p.id)}">Entfernen</button>
        </div>
      </article>`).join('') || '<p class="partner-admin-empty">Keine passenden Partner gefunden.</p>';
  }

  async function view() {
    if (!admin()) return '<section class="partner-admin"><h1>Unsere Partner</h1><p>Diese Seite ist nur für angemeldete Admins zugänglich.</p></section>';
    const header = `<section class="partner-admin"><header class="partner-admin-heading">
      <div><h1>Unsere Partner</h1></div>
      <button type="button" class="btn primary small" data-action="partner-new">Partner hinzufügen</button>
    </header>`;
    try {
      if (TFB.partnerContent?.isRemote) {
        ({partners, rotation, revision} = await TFB.directoryCall('/admin/partners'));
      } else {
        partners = (TFB.partners || []).map(p => ({ ...p, logoPreview: p.logo }));
        rotation = {premium: 3, partner: 3, regional: 1};
      }
    } catch (error) {
      partners = [];
      return header + `<p class="partner-admin-empty" role="alert">${esc(error.message)}</p>
        <button type="button" class="btn" data-action="partner-admin-refresh">Erneut laden</button></section>`;
    }
    if (!admin()) return '';
    return header + `
      <details class="partner-admin-rotation">
        <summary>Partnerrotation einstellen</summary>
        <p>Die Gewichte gelten pro Partner der jeweiligen Stufe. Gewicht 3 bedeutet dreimal so viele Einblendungen wie Gewicht 1.</p>
        <form data-editor="partner-rotation">
          <div class="partner-rotation-fields">
            ${Object.entries(tiers).map(([tier,label]) => field(tier,label,rotation[tier],'type="number" min="1" max="12" step="1" required')).join('')}
          </div>
          <p class="form-error" role="alert"></p>
          <button type="submit" class="btn small">Gewichte speichern</button>
        </form>
      </details>
      <label class="partner-admin-search">Partner suchen
        <input type="search" data-partner-search value="${esc(search)}" placeholder="Name oder Firma">
      </label>
      <div id="partner-admin-rows">${rows()}</div>
    </section>`;
  }

  function field(name, label, value, options = '') {
    return `<label class="field"><span>${label}</span><input name="${name}" value="${esc(value)}" ${options}></label>`;
  }

  function submit(form, save) {
    form.onsubmit = async event => {
      event.preventDefault();
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        if (!admin()) throw Error('Nur Admins dürfen Partner ändern.');
        if (!TFB.partnerContent?.isRemote) throw Error('Bitte die veröffentlichte Website zur Partnerpflege öffnen.');
        const message = await save();
        ui().closeSheet();
        await TFB.partnerContent.refresh();
        await ui().renderView('partner');
        ui().toast(message, true);
      } catch (error) {
        form.querySelector('.form-error').textContent = error.message;
        button.disabled = false;
      }
    };
  }

 async function imageData(file){
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024)throw Error('Bitte PNG, JPEG oder WebP bis 8 MB wählen.');
  const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();if(img.naturalWidth*img.naturalHeight>50000000)throw Error('Das Bild ist zu groß.');let side=1200;
   for(let attempt=0;attempt<5;attempt++){const ratio=Math.min(1,side/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const result=canvas.toDataURL(attempt?'image/webp':'image/png',.92);if(result.length<=400000)return result;side=Math.round(side*.7);}throw Error('Das Logo lässt sich nicht ausreichend verkleinern.');
  }finally{URL.revokeObjectURL(url);}
 }

  const details = [
    ['contactName', 'Ansprechpartner', 'maxlength="160"'],
    ['contactEmail', 'Kontakt-E-Mail', 'type="email" maxlength="160"'],
    ['contactPhone', 'Telefon', 'maxlength="80"'],
    ['street', 'Straße / Hausnummer', 'maxlength="200"'],
    ['postalCode', 'Postleitzahl', 'maxlength="24"'],
    ['city', 'Ort', 'maxlength="100"']
  ];
  function edit(id) {
    if (!admin()) return;
    const current = partners.find(p => p.id === id);
    if (id && !current) return;
    const p = current || {id: crypto.randomUUID(), revision: 0};
    ui().openSheet(`<form class="editor partner-editor" data-editor="partner">
      <h2>${current ? 'Partner bearbeiten' : 'Partner hinzufügen'}</h2>
      ${field('name', 'Partnername / Marke', p.name, 'maxlength="160" required')}
      ${field('company', 'Firmenname', p.company, 'maxlength="200"')}
      ${field('url', 'Website', p.url, 'type="url" maxlength="1000" placeholder="https://…"')}
      <label class="field"><span>Partnerstufe</span>
        <select name="tier">${Object.entries(tiers).map(([tier,label]) =>
          `<option value="${tier}" ${(p.tier || 'regional') === tier ? 'selected' : ''}>${label}</option>`).join('')}</select>
      </label>
      <div class="partner-editor-logo">
        ${p.logoPreview ? `<img src="${esc(p.logoPreview)}" alt="Aktuelles Partnerlogo">` : ''}
        <label class="btn small">Logo auswählen<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp" ${current ? '' : 'required'}></label>
        <small data-logo-name>PNG, JPEG oder WebP</small>
      </div>
      <details><summary>Kontakt &amp; Anschrift</summary>
        ${details.map(([name, label, options]) => field(name, label, p[name], options)).join('')}
      </details>
      <p class="form-error" role="alert"></p>
      <button type="submit" class="btn primary block">Speichern</button>
      <button type="button" class="link center" data-action="close-sheet">Abbrechen</button>
    </form>`);
    const form = document.querySelector('[data-editor="partner"]');
    form.elements.logoFile.onchange = () => {
      form.querySelector('[data-logo-name]').textContent = form.elements.logoFile.files[0]?.name || 'PNG, JPEG oder WebP';
    };
    submit(form, async () => {
      const partner = Object.fromEntries(['name', 'company', 'url', 'tier', ...details.map(([name]) => name)]
        .map(name => [name, form.elements[name].value.trim()]));
      const body = {id: p.id, revision: p.revision, partner};
      const file = form.elements.logoFile.files[0];
      if (file) body.logoData = await imageData(file);
      await TFB.directoryCall('/admin/partners/save', body);
      return 'Partner gespeichert';
    });
  }

  function remove(id) {
    const partner = partners.find(p => p.id === id);
    if (!admin() || !partner) return;
    ui().openSheet(`<form class="editor" data-editor="partner-remove">
      <h2>Partner entfernen</h2>
      <p>${esc(partner.name)} aus der Partnerliste und von der Website entfernen?</p>
      <p class="form-error" role="alert"></p>
      <button type="submit" class="btn primary block">Entfernen</button>
      <button type="button" class="link center" data-action="close-sheet">Abbrechen</button>
    </form>`);
    submit(document.querySelector('[data-editor="partner-remove"]'), async () => {
      await TFB.directoryCall('/admin/partners/remove', {id, revision: partner.revision});
      return 'Partner entfernt';
    });
  }

  Object.assign(TFB.actions, {
    'partner-new': () => edit(),
    'partner-edit': el => edit(el.dataset.id),
    'partner-remove': el => remove(el.dataset.id),
    'partner-admin-refresh': () => ui().renderView('partner')
  });
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!form.matches('[data-editor="partner-rotation"]')) return;
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    form.querySelector('.form-error').textContent = '';
    try {
      if (!admin() || !TFB.partnerContent?.isRemote) throw Error('Bitte die veröffentlichte Website als Admin öffnen.');
      const weights = Object.fromEntries(Object.keys(tiers).map(tier => [tier, form.elements[tier].valueAsNumber]));
      const result = await TFB.directoryCall('/admin/partners/rotation', {revision, rotation: weights});
      ({rotation,revision} = result);
      await TFB.partnerContent.refresh();
      ui().toast('Partnerrotation gespeichert', true);
    } catch (error) {
      form.querySelector('.form-error').textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  document.addEventListener('input', event => {
    if (!event.target.matches('[data-partner-search]') || !admin()) return;
    search = event.target.value;
    document.getElementById('partner-admin-rows').innerHTML = rows();
  });
  TFB.views.partner = view;
  TFB.views.partnerzahlen = view;
})();
