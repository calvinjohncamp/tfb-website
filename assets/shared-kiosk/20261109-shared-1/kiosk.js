/* Canonical kiosk module, extracted from the TFB kiosk. Both apps load this release. */
(function(global){
  const create = (env) => {
    const {TFB,cfg,api,state,icon,logo,esc,euro,monthName,nextMonthDebit,timeOf,dayKey,dayLabel,visual,strokesWord,same,viewHead,partnerSlot,showAuth,consentMarkup,openSheet,closeSheet,toast,renderView,$sheet} = env;
    const document=env.document||global.document, window=env.window||global;
  // Der Bierdeckel gilt – wie in der Kneipe – für heute; der Monat steht klein darunter.
  function coasterMarkup(open) {
    const today = dayKey(new Date().toISOString());
    const todays = open.items.filter((i) => dayKey(i.createdAt) === today);
    const count = todays.reduce((sum,i)=>sum+(i.quantity||1),0);
    const totalToday = todays.reduce((sum, i) => sum + i.priceCents, 0);
    const strokes = count
      ? TFB.strokes(Math.min(count, 25), state.member.id + today) + (count > 25 ? `<em>+${count - 25}</em>` : '')
      : '<em>Noch leer</em>';
    const dateLabel = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: cfg.timeZone });
    const ownerName = [state.member.firstName, state.member.lastName].filter(Boolean).join(' ').trim();
    const label = `Mein Bierdeckel heute: ${euro(totalToday)}. ${monthName(open.month, false)} gesamt ${euro(open.totalCents)}.${ownerName ? ` Für ${ownerName}.` : ''}`;
    const storno = state.lastAdd && state.lastAdd.until > Date.now() ? state.lastAdd : null;
    return `
      <div class="deckel-wrap">
      ${storno ? `
        <button type="button" class="storno" data-action="storno" data-until="${storno.until}" aria-label="${esc(storno.text)} stornieren">
          <span class="storno-ring"></span><span class="storno-label">Storno</span><small>${Math.ceil((storno.until - Date.now()) / 1000)}</small>
        </button>` : ''}
      <a class="deckel" href="#abrechnungen" aria-label="${esc(label)}">
        <div class="deckel-face">
          <div class="deckel-top">${logo('ball', 'deckel-ball')}<span class="coaster-kicker">Mein Bierdeckel</span><span class="deckel-month">${esc(dateLabel)}</span></div>
          <strong class="coaster-amount">${euro(totalToday)}</strong>
          <div class="coaster-strokes">${strokes}</div>
          <span class="coaster-note">${esc(monthName(open.month, false))} gesamt <b>${euro(open.totalCents)}</b></span>
          ${ownerName ? `<span class="coaster-owner" title="${esc(ownerName)}">${esc(ownerName)}</span>` : ''}
        </div>
      </a>
      </div>`;
  }

  const isEditing = () => state.editMode && state.member?.isAdmin;

  async function kioskView() {
    const open = await api.myOpenMonth();
    const cat = !state.member && api.publicCatalog ? await api.publicCatalog() : state.catalog;
    state.catalog = cat;
    const edit = isEditing();
    // Zwei Bereiche: Deckel (auf großen Bildschirmen links feststehend) und Sortiment.
    return `
      <header class="view-head page-head kiosk-head"><div><h1>Kiosk</h1></div></header>
      <div class="kiosk-layout ${edit ? 'editing' : ''}">
        <aside class="kiosk-side">
          ${edit ? `
            <div class="editbar">
              <div><strong>Kiosk bearbeiten</strong><span>Artikel antippen zum Ändern · Pfeile zum Sortieren</span></div>
              <button type="button" class="btn primary" data-action="edit-done">Fertig</button>
            </div>` : `
            <div class="kiosk-hero">
              ${state.member ? coasterMarkup(open) : `<div class="card"><h2>Unser Club-Kiosk</h2><p>Entdecke unser Sortiment. Zum Anschreiben auf deinen Deckel bitte anmelden.</p><button type="button" class="btn primary" data-action="login">Anmelden</button></div>`}
              <div class="kiosk-links"${state.member?'':' hidden'}>
                <a class="kiosk-link" href="#strichliste">${icon.tally}<span>Strichliste</span></a>
                <a class="kiosk-link" href="#abrechnungen">${icon.receipt}<span>Abrechnungen</span></a>
              </div>
            </div>`}
        </aside>
        <div class="kiosk-main">
          ${!edit && state.member?.isAdmin ? `<div class="kiosk-tools"><a class="btn small" href="#produktbibliothek">Produktbibliothek</a><button type="button" class="view-close" data-action="edit-start" aria-label="Kiosk bearbeiten" title="Kiosk bearbeiten">${icon.pencil}</button></div>` : ''}

          ${cat.sections.map((section, index) => sectionMarkup(section, index, cat, edit)).join('')}
          ${edit ? `<button type="button" class="btn block add-section" data-action="section-new">${icon.plus} Neuer Bereich</button>` : ''}
        </div>
      </div>
      ${edit ? '' : partnerSlot('kiosk', 'Der TFB-Kiosk wird dir präsentiert von')}`;
  }

  function sectionMarkup(section, index, cat, edit) {
    const items = cat.products.filter((p) => p.section === section.id && !p.archived && (edit || p.active));
    if (!items.length && !edit) return '';
    const soon = section.status === 'soon';
    const tools = edit ? `
      <div class="section-tools">
        <button type="button" data-action="section-move" data-id="${esc(section.id)}" data-dir="-1" ${index === 0 ? 'disabled' : ''} aria-label="Bereich nach oben">${icon.up}</button>
        <button type="button" data-action="section-move" data-id="${esc(section.id)}" data-dir="1" ${index === cat.sections.length - 1 ? 'disabled' : ''} aria-label="Bereich nach unten">${icon.down}</button>
        <button type="button" data-action="section-edit" data-id="${esc(section.id)}" aria-label="Bereich bearbeiten">${icon.pencil}</button>
      </div>` : '';
    const head = `
      <div class="section-head ${edit ? 'editing' : ''}">
        <h2>${esc(section.title)}</h2>
        ${soon ? '<span class="pill soon">Bald</span>' : ''}
        ${!soon && section.note && !edit ? `<span class="muted small">${esc(section.note)}</span>` : ''}
        ${tools}
      </div>
      ${soon && section.note ? `<p class="muted small section-note">${esc(section.note)}</p>` : ''}`;
    const addTile = edit ? `<button type="button" class="tile tile-new" data-action="product-new" data-section="${esc(section.id)}">${icon.plus}<span>Artikel</span></button>` : '';
    return `
      <section class="menu ${soon ? 'is-soon' : ''}">
        ${head}
        <div class="tiles">
          ${items.map((p, i) => edit ? editWrap(p, i, items.length, tile(p, true)) : tile(p, false, soon)).join('')}
          ${addTile}
        </div>
      </section>`;
  }

  // Kachel – bei Bereichen mit Status "bald" gleich groß, aber nur zum Anschauen.
  function tile(p, edit, soon = false) {
    if (soon) {
      return `
        <div class="tile is-soon" aria-disabled="true">
          <div class="tile-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
          <div class="tile-text"><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div>
          <div class="tile-foot"><b>${euro(p.price)}${p.kind==='rental'?` <small>/ ${esc(p.unit||'Nutzung')}</small>`:''}</b><span class="soon-tag">bald</span></div>
        </div>`;
    }
    return `
      <button class="tile" type="button" data-action="${edit ? 'product-edit' : 'pick'}" data-id="${esc(p.id)}">
        <div class="tile-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
        <div class="tile-text"><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div>
        <div class="tile-foot"><b>${euro(p.price)}${p.kind==='rental'?` <small>/ ${esc(p.unit||'Nutzung')}</small>`:''}</b><span class="tile-add">${edit ? icon.pencil : icon.plus}</span></div>
      </button>`;
  }

  // Im Bearbeitungsmodus: Kachel plus Pfeile zum Verschieben innerhalb des Bereichs.
  function editWrap(p, index, total, inner) {
    return `
      <div class="edit-wrap ${p.active ? '' : 'is-hidden'}">
        ${inner}
        ${p.active ? '' : '<span class="hidden-badge">ausgeblendet</span>'}
        <div class="move-tools">
          <button type="button" data-action="product-move" data-id="${esc(p.id)}" data-dir="-1" ${index === 0 ? 'disabled' : ''} aria-label="Nach vorne">${icon.back}</button>
          <button type="button" data-action="product-move" data-id="${esc(p.id)}" data-dir="1" ${index === total - 1 ? 'disabled' : ''} aria-label="Nach hinten">${icon.chevron}</button>
        </div>
      </div>`;
  }

  function openPick(productId) {
    if(!state.member){showAuth();return;}
    const p = state.catalog.products.find((x) => x.id === productId);
    if (!p) return;
    const rental=p.kind==='rental',hourly=rental&&/stund/i.test(p.unit||''),unit=p.unit||'Stück';
    const expected={priceCents:p.price,productName:p.name,unit,kind:p.kind||'sale'};
    const owner=state.member.id, payment=api.purchaseState?.(p)||{ready:true};
    let qty = 1;
    const update = () => {
      $sheet.querySelector('[data-qty]').textContent = qty;
      const total=$sheet.querySelector('[data-total]');if(total)total.textContent = euro(qty * p.price);
      $sheet.querySelector('[data-step="-1"]').disabled = qty <= 1;
      $sheet.querySelector('[data-step="1"]').disabled = qty >= cfg.maxQuantity;
      $sheet.querySelector('[data-hint]').textContent = rental?(hourly?`${qty} ${qty===1?'Stunde':'Stunden'} · ${euro(qty*p.price)} insgesamt`:`${qty} ${unit} · ${euro(qty*p.price)} insgesamt`):qty > 1 ? `Runde: ${qty} Striche auf deinen Deckel` : 'Eine Runde ausgeben? Einfach die Anzahl erhöhen.';
    };
    openSheet(`
      <div class="pick">
        <div class="pick-art" style="--tint:${esc(p.color)}">${visual(p)}</div>
        <h2>${esc(p.name)}</h2>
        <p class="muted">${esc(p.detail)} · ${euro(p.price)}${rental?' / '+esc(unit):''}</p>
        <p class="muted small">${hourly?'Mietdauer in Stunden':rental?'Anzahl der Verleiheinheiten':'Anzahl'}</p><div class="stepper" role="group" aria-label="${hourly?'Mietdauer in Stunden':'Anzahl'}">
          <button type="button" class="step" data-step="-1" aria-label="Weniger">${icon.minus}</button>
          <output data-qty aria-live="polite">1</output>
          <button type="button" class="step" data-step="1" aria-label="Mehr">${icon.plus}</button>
        </div>
        <p class="muted small" data-hint></p>
        ${payment.message?`<p class="muted small">${esc(payment.message)}</p>`:''}
        ${payment.needsConsent?'<label class="agree"><input type="checkbox" data-payment-consent><span>Ich stimme der täglichen Sammelbelastung meines bei Stripe hinterlegten Zahlungsmittels zu.</span></label>':''}
        <p class="form-error" role="alert" data-purchase-error></p>
        <button type="button" class="btn primary block big" data-confirm>
          Auf meinen Bierdeckel · <span data-total>${euro(p.price)}</span>
        </button>
      </div>`);
    update();
    const purchaseButton=$sheet.querySelector('[data-confirm]'), consent=$sheet.querySelector('[data-payment-consent]');
    if(!payment.ready)purchaseButton.innerHTML=esc(payment.label||'Stripe-Bierdeckel aktivieren');
    purchaseButton.disabled=!!payment.blocked||!!consent;
    consent?.addEventListener('change',()=>purchaseButton.disabled=!!payment.blocked||!consent.checked);
    $sheet.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => {
      qty = Math.max(1, Math.min(cfg.maxQuantity, qty + Number(b.dataset.step)));
      update();
    }));
    $sheet.querySelector('[data-confirm]').addEventListener('click', async (e) => {
      const confirm=e.currentTarget;confirm.disabled = true;
      try {
        if(state.member?.id!==owner)throw Error('Die Anmeldung hat sich geändert. Bitte erneut öffnen.');
        if(!payment.ready){await api.preparePayment?.();return;}
        const ids = await api.addToTab(p.id, qty, expected);
        if(state.member?.id!==owner)return;
        closeSheet();
        if (navigator.vibrate) navigator.vibrate(12);
        const text = `${qty > 1 ? qty + ' × ' : ''}${p.name}`;
        state.lastAdd = { ids, until: Date.now() + cfg.undoSeconds * 1000, text };
        toast(`${text} auf deinem Deckel`, true);
        await renderView();
        // Hoch zum Deckel: neuer Strich und Storno-Stempel sind sofort sichtbar.
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        const d = document.querySelector('a.deckel');
        if (d) { d.classList.add('wobble'); setTimeout(() => d.classList.remove('wobble'), 600); }
      } catch (err) {
        confirm.disabled = false;
        const error=$sheet.querySelector('[data-purchase-error]');if(error)error.textContent=err.message;else toast(err.message);
        await api.onPurchaseError?.(err);
        if(err.code==='catalog_changed'||/Artikel.*geändert|Artikel gibt|Artikel nicht|Daten.*geändert/.test(err.message)){await api.refreshKiosk?.();state.catalog=await api.catalog();closeSheet();if(state.catalog.products.some(x=>x.id===p.id&&x.active&&!x.archived))openPick(p.id);}
      }
    });
  }

  // ---------- Strichliste ----------
  // Zuordnung der fünf Strichlistenspalten über den Bereich im Sortiment (demo-backend.js).
  const TALLY_CATS = [['drinks', 'Getränke', 'Getränke'], ['kranz', 'Kränze', 'Kränze'], ['snacks', 'Snacks', 'Snacks'], ['spielbetrieb', 'Match', 'Match'], ['equipment', 'Shop', 'Shop']];
  async function tallyView() {
    const rows = await api.tally();
    const from = new Date(Date.now() - (cfg.tallyDays - 1) * 864e5);
    const range = `${from.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', timeZone: cfg.timeZone })} – heute`;
    return `
      ${viewHead('Strichliste', `Letzte ${cfg.tallyDays} Tage · ${esc(range)}`)}
      <section class="paper tally-paper">
        ${rows.length ? `<div class="tally-head" aria-hidden="true"><span></span>${TALLY_CATS.map(([c, l, short]) => `<span class="${c}" title="${l}"><b class="full">${l}</b><b class="short">${short}</b></span>`).join('')}</div>` : ''}
        ${rows.length ? rows.map((r, i) => {
          const key = `${r.lastName}|${r.firstName}`;
          const open = state.openTallyRow === key;
          const detail = Object.entries(r.counts).sort((a, b) => b[1] - a[1]).map(([name, n]) => `${n} × ${esc(name)}`).join(' · ');
          const cell = (cat) => {
            const n = r.cats[cat] || 0;
            const max = cat === 'drinks' ? 15 : 10;   // Getränke: Platz für drei Bündel (15 Striche)
            return `<span class="tally-cell ${cat}" aria-label="${TALLY_CATS.find(([c]) => c === cat)[1]}: ${strokesWord(n)}">${n ? TFB.strokes(Math.min(n, max), key + cat) + (n > max ? `<em>+${n - max}</em>` : '') : ''}</span>`;
          };
          return `
            <button type="button" class="paper-row tally-row ${r.isMe ? 'me' : ''} ${open ? 'open' : ''}" data-action="tally-row" data-key="${esc(key)}" aria-expanded="${open}">
              <span class="paper-name"><span class="paper-name-part">${esc(r.lastName)}<span class="paper-name-comma">,</span></span> <span class="paper-name-part">${esc(r.firstName)}</span>${r.isMe ? ' <em>du</em>' : ''}</span>
              ${TALLY_CATS.map(([c]) => cell(c)).join('')}
              ${open ? `<span class="paper-detail">${detail}</span>` : ''}
            </button>`;
        }).join('') : '<p class="paper-empty">In den letzten sieben Tagen hat noch niemand angeschrieben.</p>'}
      </section>
      <p class="fineprint tally-note">Deine Beträge findest du unter „Abrechnungen“. Die Strichliste zeigt die letzten sieben Tage.</p>
      ${partnerSlot('strichliste', 'Die Strichliste wird dir präsentiert von')}`;
  }

  // ---------- Abrechnungen ----------
  async function statementsView() {
    if(api.centralSync&&TFB.kioskBilling)return TFB.kioskBilling.memberView();
    const [open, closed] = await Promise.all([api.myOpenMonth(), api.myStatements()]);
    const groups = new Map();
    // Eine Runde (gleicher Artikel, gleicher Zeitpunkt) erscheint als eine Zeile.
    for (const item of open.items) {
      const key = dayKey(item.createdAt);
      if (!groups.has(key)) groups.set(key, { label: dayLabel(item.createdAt), lines: [] });
      const lines = groups.get(key).lines;
      const last = lines[lines.length - 1];
      if (last && last.productId === item.productId && last.createdAt === item.createdAt) {
        last.ids.push(item.id);
        last.qty++;
        last.priceCents += item.priceCents;
      } else {
        lines.push({ ...item, ids: [item.id], qty: 1 });
      }
    }
    const now = Date.now();
    return `
      ${viewHead('Meine Abrechnungen', 'Nur für dich sichtbar')}

      <section class="card month-card">
        <div class="month-top">
          <span class="pill live">läuft</span>
          <span class="muted">${esc(monthName(open.month))}</span>
        </div>
        <strong class="month-amount">${euro(open.totalCents)}</strong>
        ${groups.size ? [...groups.values()].map((g) => `
          <div class="day">
            <h3>${esc(g.label)}</h3>
            ${g.lines.map((i) => {
              const until = Date.parse(i.createdAt) + cfg.undoSeconds * 1000;
              return `
                <div class="line">
                  <span class="line-time">${timeOf(i.createdAt)}</span>
                  <span class="line-name">${i.qty > 1 ? `${i.qty} × ` : ''}${esc(i.productName)}</span>
                  ${until > now ? `<button type="button" class="undo-chip" data-action="undo" data-ids="${esc(i.ids.join(','))}" data-until="${until}">stornieren</button>` : ''}
                  <span class="line-price">${euro(i.priceCents)}</span>
                </div>`;
            }).join('')}
          </div>`).join('') : '<p class="empty">Diesen Monat noch nichts angeschrieben.</p>'}
      </section>

      <section>
        <div class="section-head"><h2>Abgeschlossene Monate</h2></div>
        ${closed.length ? `<div class="card list">${closed.map((s) => `
          <div class="statement">
            <div><strong>${esc(monthName(s.month))}</strong><span class="muted small">${strokesWord(s.itemCount)}</span></div>
            <div class="statement-right">
              <b>${euro(s.totalCents)}</b>
              <span class="pill soon">Abrechnungsbetrag</span>
            </div>
          </div>`).join('')}</div>` : '<p class="empty">Noch keine abgeschlossenen Monate.</p>'}
      </section>
      ${partnerSlot('abrechnungen', 'Deine Abrechnung wird dir präsentiert von')}`;
  }

  async function commitCatalog(next, message, expected=JSON.stringify(state.catalog)) {
    try {
      state.catalog = await api.saveCatalog(next,{expected});
      if (message) toast(message);
    } catch (err) {
      toast(err.message);
    }
    renderView();
  }

  function moveProduct(id, dir) {
    const next = JSON.parse(JSON.stringify(state.catalog));
    const p = next.products.find((x) => x.id === id);
    const siblings = next.products.filter((x) => x.section === p.section);
    const target = siblings[siblings.indexOf(p) + dir];
    if (!target) return;
    const a = next.products.indexOf(p);
    const b = next.products.indexOf(target);
    [next.products[a], next.products[b]] = [next.products[b], next.products[a]];
    commitCatalog(next);
  }

  function moveSection(id, dir) {
    const next = JSON.parse(JSON.stringify(state.catalog));
    const a = next.sections.findIndex((x) => x.id === id);
    const b = a + dir;
    if (b < 0 || b >= next.sections.length) return;
    [next.sections[a], next.sections[b]] = [next.sections[b], next.sections[a]];
    commitCatalog(next);
  }

  const PRODUCT_COLORS = ['#E9B949', '#F0C93A', '#E3A33B', '#F08A24', '#C4553A', '#B7282E', '#6B2E4F',
    '#2E4E9E', '#2F5D8A', '#7FB7D9', '#5BB98B', '#5E6B2A', '#5A3825', '#2A2D2E'];
  const parsePrice = (text) => {
    const v = Number(String(text).trim().replace(/\s|€/g, '').replace(',', '.'));
    return Number.isFinite(v) ? Math.round(v * 100) : NaN;
  };
  const priceText = (cents) => (cents / 100).toFixed(2).replace('.', ',');

  function openProductEditor(id, sectionId, copy = null) {
    const signatureArt = env.signatureArt;
    const original = state.catalog.products.find((x) => x.id === id);
    const draft = original
      ? { ...original }
      : { ...(copy||{}), id: 'p-' + crypto.randomUUID(), section: sectionId, name: '', detail: '', price: 200, art: 'bottle', color: signatureArt?.find(option => option.art === 'bottle')?.color || '#C4553A', active: true,archived:false,unit:'Stück',kind:'sale' };
    if(copy)Object.assign(draft,copy,{id:draft.id,active:true,archived:false});
    const options = signatureArt || TFB.artKinds.map(([art, label]) => ({ art, label }));
    let selected = options.findIndex(option => option.art === draft.art && same(option.color, draft.color));
    if (selected < 0) selected = options.findIndex(option => option.art === draft.art);
    let useSignature = !!signatureArt && (!original && !copy || same(options[selected]?.color, draft.color));
    const catalogAtOpen=JSON.stringify(state.catalog);
    const sections = state.catalog.sections;
    openSheet(`
      <form class="editor${signatureArt ? ' signature-product-editor' : ''}" data-editor="product" novalidate>
        <h2>${original ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h2>
        <div class="editor-preview" data-preview></div>
        <label class="field"><span>Name</span>
          <input name="name" maxlength="40" value="${esc(draft.name)}" placeholder="z. B. Chipsfrisch" required>
        </label>
        <label class="field"><span>Zusatzzeile</span>
          <input name="detail" maxlength="80" value="${esc(draft.detail)}" placeholder="z. B. Ungarisch · 175 g">
        </label>
        <div class="field-row">
          <label class="field"><span>Preis in €</span>
            <input name="price" inputmode="decimal" value="${priceText(draft.price)}" required>
          </label>
          <label class="field"><span>Kategorie</span>
            <select name="section" required aria-label="Kategorie">${sections.map((x) => `<option value="${esc(x.id)}" ${x.id === draft.section ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select>
          </label>
        </div>
        <div class="field-row"><label class="field"><span>Abrechnungseinheit</span><input name="unit" maxlength="40" value="${esc(draft.unit||'Stück')}" placeholder="z. B. pro Nutzung / pro Satz"></label><label class="field"><span>Artikelart</span><select name="kind"><option value="sale"${draft.kind!=='rental'?' selected':''}>Verkauf</option><option value="rental"${draft.kind==='rental'?' selected':''}>Verleih</option></select></label></div>
        <p class="fineprint">Die Kategorie bestimmt die Gruppe im Kiosk und in der Produktbibliothek. Änderungen gelten für neue Buchungen; frühere Namen und Preise bleiben erhalten.</p>
        <div class="field"><span>Symbol</span>
          <div class="symbol-grid">
            ${options.map(({art, label, color}, index) => `<button type="button" class="symbol" data-art="${art}" data-symbol-index="${index}" title="${label}" aria-label="${label}">${TFB.art(art, color || draft.color)}${signatureArt ? `<span>${label}</span>` : ''}</button>`).join('')}
          </div>
        </div>
        <div class="field"><span>Farbe</span>
          <div class="swatches">
            ${signatureArt ? '<button type="button" class="btn small" data-signature-color>Signature-Farbe</button>' : ''}
            ${PRODUCT_COLORS.map((hex) => `<button type="button" class="swatch ${same(hex, draft.color) ? 'on' : ''}" style="--c:${hex}" data-color="${hex}" aria-label="Farbe ${hex}"></button>`).join('')}
            <label class="swatch empty" title="Eigene Farbe oder Pipette">${icon.plus}<input type="color" value="${esc(draft.color)}" data-color-picker aria-label="Eigene Farbe"></label>
          </div>
        </div>
        <label class="agree"><input type="checkbox" name="active" ${draft.active ? 'checked' : ''}><span>Im Kiosk sichtbar</span></label>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn primary block">Speichern</button>
        ${original ? '<button type="button" class="btn block danger" data-delete>Aus Sortiment entfernen</button>' : ''}
      </form>`);

    const form = $sheet.querySelector('[data-editor]');
    const preview = () => {
      form.querySelector('[data-preview]').innerHTML = tile(draft, false).replace('data-action="pick"', 'tabindex="-1"');
      form.querySelectorAll('.symbol').forEach((b) => {
        const active = Number(b.dataset.symbolIndex) === selected;
        b.classList.toggle('on', active);
        b.setAttribute('aria-pressed', String(active));
        if (!signatureArt) b.innerHTML = TFB.art(b.dataset.art, draft.color);
      });
      form.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('on', !useSignature && same(b.dataset.color, draft.color)));
      const signatureButton = form.querySelector('[data-signature-color]');
      if (signatureButton) {
        signatureButton.setAttribute('aria-pressed', String(useSignature));
        signatureButton.disabled = selected < 0;
        form.querySelector('[data-color-picker]').value = draft.color;
      }
    };
    preview();
    form.addEventListener('input', (e) => {
      const t = e.target;
      if (t.name === 'name' || t.name === 'detail' || t.name === 'unit') draft[t.name] = t.value;
      if (t.name === 'price') { const c = parsePrice(t.value); if (Number.isFinite(c)) draft.price = c; }
      if (t.matches('[data-color-picker]')) { draft.color = t.value; useSignature = false; }
      preview();
    });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'section') draft.section = e.target.value;
      if (e.target.name === 'kind') draft.kind = e.target.value;
      if (e.target.name === 'active') draft.active = e.target.checked;
    });
    form.addEventListener('click', (e) => {
      const sym = e.target.closest('[data-art]');
      const col = e.target.closest('[data-color]');
      if (sym) {
        selected = Number(sym.dataset.symbolIndex);
        draft.art = sym.dataset.art;
        if (signatureArt) {
          useSignature = true;
          draft.color = options[selected].color;
        }
        preview();
      }
      if (e.target.closest('[data-signature-color]') && options[selected]) {
        useSignature = true;
        draft.color = options[selected].color;
        preview();
      }
      if (col) { draft.color = col.dataset.color; useSignature = false; preview(); }
      const del = e.target.closest('[data-delete]');
      if (del) {
        if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = 'Entfernen? Frühere Buchungen bleiben erhalten'; return; }
        const next = JSON.parse(JSON.stringify(state.catalog));
        next.products = next.products.filter((x) => x.id !== draft.id);
        closeSheet();
        commitCatalog(next, `„${draft.name}“ aus dem Sortiment genommen`,catalogAtOpen);
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = form.querySelector('.form-error');
      draft.name = draft.name.trim();
      draft.price = parsePrice(form.elements.price.value);
      if (!draft.name) { err.textContent = 'Bitte einen Namen eingeben.'; return; }
      if (!state.catalog.sections.some(x=>x.id===draft.section)) { err.textContent = 'Bitte eine gültige Kategorie auswählen.'; return; }
      if (!Number.isFinite(draft.price) || draft.price < 0 || draft.price > 50000) { err.textContent = 'Bitte einen gültigen Preis eingeben, z. B. 2,50.'; return; }
      const next = JSON.parse(JSON.stringify(state.catalog));
      const i = next.products.findIndex((x) => x.id === draft.id);
      if (i >= 0 && next.products[i].section === draft.section) next.products[i] = draft;
      else {
        if (i >= 0) next.products.splice(i, 1);
        next.products.push(draft); // neu oder in anderen Bereich verschoben: hinten anstellen
      }
      closeSheet();
      commitCatalog(next, original ? 'Gespeichert' : `„${draft.name}“ angelegt`,catalogAtOpen);
    });
  }

  function openSectionEditor(id) {
    if (!rawMember?.isAdmin) return;
    const original = state.catalog.sections.find((x) => x.id === id);
    const draft = original ? { ...original } : { id: 's-' + crypto.randomUUID(), title: '', note: '', status: 'open' };
    const catalogAtOpen = JSON.stringify(state.catalog);
    const used = original ? state.catalog.products.filter((p) => p.section === id).length : 0;
    const targets = state.catalog.sections.filter(x=>x.id!==id);
    openSheet(`
      <form class="editor" data-editor="section" novalidate>
        <h2>${original ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</h2>
        <label class="field"><span>Name</span><input name="title" maxlength="40" value="${esc(draft.title)}" placeholder="z. B. Heißgetränke" required></label>
        <label class="field"><span>Hinweis (optional)</span><input name="note" maxlength="120" value="${esc(draft.note)}" placeholder="z. B. Kalt aus dem Kühlschrank"></label>
        <div class="field"><span>Status</span>
          <div class="seg">
            <button type="button" class="${draft.status === 'open' ? 'on' : ''}" data-status="open">Geöffnet</button>
            <button type="button" class="${draft.status === 'soon' ? 'on' : ''}" data-status="soon">Bald (nur Vorschau)</button>
          </div>
        </div>
        <p class="fineprint">Die Kategorie wird gemeinsam im Kiosk und in der Produktbibliothek verwendet. Frühere Buchungen behalten ihre damaligen Angaben.</p>
        <p class="form-error" role="alert"></p>
        <button type="submit" class="btn primary block">Speichern</button>
        ${original ? `<div class="pl-category-removal">${used?`<p class="fineprint">Dieser Kategorie sind ${used} Artikel zugeordnet. Wähle zum Entfernen eine Zielkategorie. Aktive, inaktive und archivierte Artikel werden dorthin verschoben; Preise und Status bleiben erhalten.</p>${targets.length?`<label class="field"><span>Artikel verschieben nach</span><select name="moveTo" aria-label="Zielkategorie"><option value="">Bitte Kategorie wählen</option>${targets.map(x=>`<option value="${esc(x.id)}">${esc(x.title)}</option>`).join('')}</select></label>`:'<p class="fineprint">Lege zuerst eine weitere Kategorie an oder entferne die zugeordneten Artikel.</p>'}`:''}<button type="button" class="btn block danger" data-delete${used&&!targets.length?' disabled':''}>Kategorie entfernen</button></div>` : ''}
      </form>`);
    const form = $sheet.querySelector('[data-editor]');
    form.addEventListener('change',()=>{const del=form.querySelector('[data-delete]');if(del){delete del.dataset.armed;del.textContent='Kategorie entfernen';}});
    form.addEventListener('click', (e) => {
      const st = e.target.closest('[data-status]');
      if (st) {
        draft.status = st.dataset.status;
        form.querySelectorAll('[data-status]').forEach((b) => b.classList.toggle('on', b === st));
      }
      const del = e.target.closest('[data-delete]');
      if (del&&!del.disabled) {
        const target = form.elements.moveTo?.value;
        if(used&&!targets.some(x=>x.id===target)){form.querySelector('.form-error').textContent='Bitte zuerst eine Zielkategorie für die Artikel wählen.';return;}
        if (!del.dataset.armed) { del.dataset.armed = '1'; del.textContent = used?'Kategorie entfernen und Artikel verschieben?':'Kategorie wirklich entfernen?';return; }
        const next = structuredClone(state.catalog);
        next.sections = next.sections.filter((x) => x.id !== id);
        if(used)next.products=next.products.map(p=>p.section===id?{...p,section:target}:p);
        closeSheet();
        commitCatalog(next, 'Kategorie entfernt',catalogAtOpen);
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      draft.title = form.elements.title.value.trim();
      draft.note = form.elements.note.value.trim();
      if (!draft.title) { form.querySelector('.form-error').textContent = 'Bitte einen Namen eingeben.'; return; }
      const next = structuredClone(state.catalog);
      const i = next.sections.findIndex((x) => x.id === draft.id);
      if (i >= 0) next.sections[i] = draft; else next.sections.push(draft);
      closeSheet();
      commitCatalog(next, original ? 'Kategorie gespeichert' : `Kategorie „${draft.title}“ angelegt`,catalogAtOpen);
    });
  }

  function tickStorno() {
    const now = Date.now();
    document.querySelectorAll('.undo-chip[data-until]').forEach((b) => {
      if (Number(b.dataset.until) <= now) b.remove();
    });
    const badge = document.querySelector('.storno[data-until]');
    if (!badge) return;
    const left = Number(badge.dataset.until) - now;
    if (left <= 0) {
      state.lastAdd = null;
      badge.classList.add('gone');
      setTimeout(() => badge.remove(), 250);
      return;
    }
    badge.style.setProperty('--p', (left / (cfg.undoSeconds * 1000)).toFixed(3));
    badge.querySelector('small').textContent = Math.ceil(left / 1000);
  }

    async function handleAction(el,event){
      const action=el.dataset.action;
      if(action==='pick'){openPick(el.dataset.id);return true;}
      if(action==='tally-row'){state.openTallyRow=state.openTallyRow===el.dataset.key?null:el.dataset.key;await renderView('strichliste');return true;}
      if(action==='storno'||action==='undo'){
        const last=state.lastAdd;el.disabled=true;state.lastAdd=null;
        try{const ids=action==='storno'?last?.ids:el.dataset.ids.split(',');if(ids?.length)await api.undo(ids);toast('Storniert',true);}catch(err){toast(err.message);}
        await renderView();return true;
      }
      return false;
    }
    return {isEditing,coasterMarkup,kioskView,sectionMarkup,tile,editWrap,openPick,tallyView,statementsView,commitCatalog,moveProduct,moveSection,openProductEditor,openSectionEditor,tickStorno,handleAction};
  };
  global.ClubKiosk={...(global.ClubKiosk||{}),version:'20261109-shared-1',create};
})(globalThis);
