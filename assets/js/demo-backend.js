// TFB-Kiosk – Demo-Datenschicht.
//
// Bildet genau die Schnittstelle nach, die später Supabase bekommt
// (TFB.api.*). Alle Daten liegen nur im Browser dieses Geräts.
// Beim ersten Start werden Beispielmitglieder, ein Beispielsortiment und
// ein paar Tage Strichliste erzeugt, damit die App lebendig aussieht.
(function () {
  const cfg = TFB.config;
  const STORE_KEY = 'tfb_kiosk_demo_v1';
  const SESSION_KEY = 'tfb_kiosk_demo_session_v1';
  const DAY = 24 * 60 * 60 * 1000;

  // ---------- Startsortiment (wie im bisherigen Kiosk, im Admin frei änderbar) ----------
  // Bereiche erscheinen in dieser Reihenfolge. status 'soon' = nur Vorschau ("bald").
  const CATALOG_VERSION = 13;
  const DEFAULT_CATALOG = {
    sections: [
      { id: 'alkoholfrei', title: 'Alkoholfreie Getränke', note: '', status: 'open' },
      { id: 'bier', title: 'Bier', note: '', status: 'open' },
      { id: 'aperitif', title: 'Aperol & Wein', note: '', status: 'open' },
      { id: 'spezialitaeten', title: 'Spezialitäten', note: '', status: 'open' },
      { id: 'spielbetrieb', title: 'Spielbetrieb', note: '', status: 'open' },
      { id: 'snacks', title: 'Snacks', note: '', status: 'open' },
      { id: 'shop', title: 'Vereinsshop', note: 'Bälle, Griffbänder und Vereinskleidung – bald direkt hier.', status: 'soon' },
    ],
    products: [
      { id: 'gerolsteiner', section: 'alkoholfrei', name: 'Wasser', detail: 'Flasche · 0,25 l', price: 150, art: 'gerolsteiner', color: '#CFE6E0' },
      { id: 'apfelschorle', section: 'alkoholfrei', name: 'Apfelschorle', detail: 'Flasche · 0,25 l', price: 150, art: 'apfelschorle', color: '#DDBB54' },
      { id: 'coca-cola', section: 'alkoholfrei', name: 'Cola', detail: 'Flasche · 0,25 l', price: 150, art: 'cola', color: '#B7282E' },
      { id: 'fanta', section: 'alkoholfrei', name: 'Fanta', detail: 'Flasche · 0,25 l', price: 150, art: 'cola', color: '#F08A24' },
      { id: 'fassbrause', section: 'alkoholfrei', name: 'Fassbrause', detail: 'Flasche · 0,33 l', price: 210, art: 'fassbrause', color: '#B6C85D' },
      { id: 'sportsfreund', section: 'alkoholfrei', name: 'Sportsfreund', detail: 'Flasche · 0,33 l', price: 210, art: 'sportsfreund', color: '#5A2A1A' },
      { id: 'malzbier', section: 'alkoholfrei', name: 'Malzbier', detail: 'Flasche · 0,33 l', price: 210, art: 'malz', color: '#3B2314' },
      { id: 'koelsch-flasche', section: 'bier', name: 'Zunftkölsch · Flasche', detail: '0,33 l', price: 220, art: 'koelsch-flasche', color: '#E9B949' },
      { id: 'koelsch', section: 'bier', name: 'Zunftkölsch · Glas', detail: '0,2 l', price: 180, art: 'stange', color: '#E9B949' },
      { id: 'koelsch-kranz', section: 'bier', name: 'Zunftkölsch · Kranz', detail: '9 Kölsch · je 0,2 l', price: 1450, art: 'kranz', color: '#E9B949' },
      { id: 'weissbier', section: 'bier', name: 'Weizen', detail: 'Flasche · 0,5 l', price: 350, art: 'weizen-flasche', color: '#D88A2E' },
      { id: 'radler', section: 'bier', name: 'Radler', detail: 'Flasche · 0,33 l', price: 210, art: 'radler', color: '#E9CD70' },
      { id: 'aperol', section: 'aperitif', name: 'Aperol', detail: 'Büchse · 0,25 l', price: 350, art: 'aperol', color: '#F27736' },
      { id: 'grauburgunder', section: 'aperitif', name: 'Grauburgunder Wein', detail: 'Flasche · 0,75 l', price: 1000, art: 'wein', color: '#8FA86D' },
      { id: 'bockwurst', section: 'spezialitaeten', name: 'Bockwurst mit Brot', detail: 'Eine Portion', price: 250, art: 'wurst-brot', color: '#B5462F' },
      { id: 'grillwurst', section: 'spezialitaeten', name: 'Grillwurst mit Brot', detail: 'Eine Portion', price: 300, art: 'grillwurst-brot', color: '#C68C50' },
      { id: 'grillfleisch', section: 'spezialitaeten', name: 'Grillfleisch mit Brot', detail: 'Eine Portion', price: 400, art: 'grillfleisch', color: '#A75A49' },
      { id: 'flutlicht', section: 'spielbetrieb', name: 'Flutlicht (1 h)', detail: 'Eine Stunde', price: 500, art: 'flutlicht', color: '#E9C857' },
      { id: 'gastspieler', section: 'spielbetrieb', name: 'Gastspieler', detail: 'Eine Stunde', price: 800, art: 'tennisspieler', color: '#558D83' },
      { id: 'snickers', section: 'snacks', name: 'Snickers', detail: 'Und der Hunger ist gegessen.', price: 100, art: 'snickers', color: '#5A3825' },
      { id: 'mars', section: 'snacks', name: 'Mars', detail: '… macht mobil.', price: 100, art: 'mars', color: '#C8202F' },
      { id: 'hanuta', section: 'snacks', name: 'Hanuta', detail: 'Quadratisch, praktisch, für dich gebacken.', price: 100, art: 'wafer', color: '#1E4FA0' },
      { id: 'pringles', section: 'snacks', name: 'Pringles', detail: 'Heute schon gepoppt?', price: 300, art: 'tube', color: '#C8202F' },
      { id: 'chipsfrisch', section: 'snacks', name: 'Chipsfrisch', detail: 'Ungarisch. Oft kopiert, nie erreicht.', price: 250, art: 'bag', color: '#E07A2F' },
      { id: 'haribo', section: 'snacks', name: 'Haribo Colorado', detail: 'Süße Evergreens.', price: 250, art: 'bear', color: '#E8B22B' },
      { id: 'cornetto', section: 'snacks', name: 'Cornetto', detail: 'Vanille-Nuss. So schmeckt der Sommer.', price: 300, art: 'cone', color: '#D9A066' },
      { id: 'baelle', section: 'shop', name: 'Tennisbälle', detail: '4er-Dose', price: 1200, art: 'ball', color: '#F2D21B' },
      { id: 'padelbaelle', section: 'shop', name: 'Padelbälle', detail: '3er-Dose', price: 900, art: 'ball', color: '#F08A24' },
      { id: 'padel-schlaeger', section: 'shop', name: 'Padel-Schläger', detail: 'HEAD Speed Pro', price: 15900, art: 'padel', color: '#C4553A' },
      { id: 'griffband', section: 'shop', name: 'Overgrip', detail: '3er-Pack', price: 900, art: 'grip', color: '#F4F1EA' },
      { id: 'shirt', section: 'shop', name: 'Vereinsshirt', detail: 'Mit TFB-Logo', price: 2500, art: 'shirt', color: '#2A2D2E' },
      { id: 'cap', section: 'shop', name: 'Vereinscap', detail: 'Basecap mit TFB-Logo', price: 1800, art: 'cap', color: '#1F2A44' },
    ].map((p) => ({ active: true, ...p })),
  };
  const clone = (v) => JSON.parse(JSON.stringify(v));

  // Erfundene Beispielmitglieder – keine echten Personen.
  const DEMO_MEMBERS = [
    ['Anna', 'Becker'], ['Thomas', 'Brandt'], ['Sabine', 'Dietrich'], ['Markus', 'Engel'],
    ['Petra', 'Fischer'], ['Jan', 'Hoffmann'], ['Claudia', 'Klein'], ['Stefan', 'Krüger'],
    ['Monika', 'Lange'], ['Uwe', 'Meier'], ['Katrin', 'Neumann'], ['Ralf', 'Peters'],
    ['Birgit', 'Richter'], ['Frank', 'Schmitz'], ['Heike', 'Schulte'], ['Dirk', 'Wagner'],
    ['Lena', 'Weber'], ['Michael', 'Zimmermann'],
  ];
  const DEMO_LOGIN = { firstName: 'Max', lastName: 'Mustermann', email: 'max@tfb-demo.de' };

  // ---------- Hilfen ----------
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36));
  const norm = (email) => String(email || '').trim().toLowerCase();
  const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));

  function berlinParts(date) {
    const parts = new Intl.DateTimeFormat('de-DE', {
      timeZone: cfg.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    return Object.fromEntries(parts.map((p) => [p.type, p.value]));
  }
  function monthKey(date) {
    const p = berlinParts(date);
    return `${p.year}-${p.month}`;
  }
  function dayKey(date) {
    const p = berlinParts(date);
    return `${p.year}-${p.month}-${p.day}`;
  }
  function previousMonthKey(key, back = 1) {
    let [y, m] = key.split('-').map(Number);
    m -= back;
    while (m < 1) { m += 12; y -= 1; }
    return `${y}-${String(m).padStart(2, '0')}`;
  }

  async function hash(text) {
    // Beim Öffnen per Doppelklick (file://) fehlt in manchen Browsern crypto.subtle.
    // Für den Demo-Modus reicht dann eine einfache Prüfsumme.
    if (!(crypto && crypto.subtle)) {
      let h = 2166136261;
      for (const ch of 'tfb-demo:' + text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
      return 'f' + h.toString(16);
    }
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('tfb-demo:' + text));
    return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Kleiner deterministischer Zufall, damit die Beispieldaten stabil wirken.
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // ---------- Speicher ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const fresh = seed();
    save(fresh);
    return fresh;
  }
  function save(db) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); return true; } catch (_) { return false; }
  }
  let db = load();
  // Ältere Demo-Stände bekommen das neue Sortiment, ohne Striche und Profilbilder zu verlieren.
  // Version 2 → 3: Kölsch-Kranz direkt hinter dem Kölsch ergänzen, eigene Änderungen bleiben.
  if (db.catalog && db.catalogVersion === 2) {
    const kranz = DEFAULT_CATALOG.products.find((p) => p.id === 'koelsch-kranz');
    if (!db.catalog.products.some((p) => p.id === kranz.id)) {
      const at = db.catalog.products.findIndex((p) => p.id === 'koelsch');
      db.catalog.products.splice(at >= 0 ? at + 1 : 0, 0, clone(kranz));
    }
    db.catalogVersion = 3;
    save(db);
  }
  // Version 3 → 4: Alkoholfrei nach vorn, feste Reihenfolge dort, neue Riegel-/Dosen-/Hotdog-Symbole.
  if (db.catalog && db.catalogVersion === 3) {
    const cat = db.catalog;
    const af = cat.sections.findIndex((x) => x.id === 'alkoholfrei');
    if (af > 0) cat.sections.unshift(...cat.sections.splice(af, 1));
    const wanted = ['gerolsteiner', 'coca-cola', 'fanta', 'sportsfreund', 'red-bull'];
    const slots = cat.products.map((p, i) => (p.section === 'alkoholfrei' ? i : -1)).filter((i) => i >= 0);
    const group = slots.map((i) => cat.products[i]);
    const rank = (p) => (wanted.includes(p.id) ? wanted.indexOf(p.id) : wanted.length);
    group.sort((a, b) => rank(a) - rank(b));
    slots.forEach((slot, k) => { cat.products[slot] = group[k]; });
    for (const fresh of DEFAULT_CATALOG.products) {
      if (!['snickers', 'mars', 'hanuta', 'bockwurst', 'red-bull'].includes(fresh.id)) continue;
      const p = cat.products.find((x) => x.id === fresh.id);
      if (p) Object.assign(p, { art: fresh.art, color: fresh.color, detail: fresh.id === 'hanuta' ? fresh.detail : p.detail });
    }
    db.catalogVersion = 4;
    save(db);
  }
  // Version 4 → 5: Padelbälle und Padel-Schläger im Vereinsshop, Kappe als navyblaue Basecap.
  if (db.catalog && db.catalogVersion === 4) {
    const cat = db.catalog;
    let after = cat.products.findIndex((p) => p.id === 'baelle');
    for (const id of ['padelbaelle', 'padel-schlaeger']) {
      if (cat.products.some((p) => p.id === id)) continue;
      const fresh = clone(DEFAULT_CATALOG.products.find((p) => p.id === id));
      if (!cat.sections.some((x) => x.id === fresh.section)) continue;
      if (after < 0) { cat.products.push(fresh); continue; }
      cat.products.splice(++after, 0, fresh);
    }
    const cap = cat.products.find((p) => p.id === 'cap');
    if (cap) Object.assign(cap, { color: '#1F2A44', detail: 'Basecap mit TFB-Logo' });
    db.catalogVersion = 5;
    save(db);
  }
  // Version 5 → 6: Tennisbälle gelb, Padelbälle orange – damit man sie auseinanderhält.
  if (db.catalog && db.catalogVersion === 5) {
    for (const [id, color] of [['baelle', '#F2D21B'], ['padelbaelle', '#F08A24']]) {
      const p = db.catalog.products.find((x) => x.id === id);
      if (p) p.color = color;
    }
    db.catalogVersion = 6;
    save(db);
  }
  // Version 6 → 7: Malzbier (Golden Malz) im Bereich Alkoholfrei, vor Red Bull.
  if (db.catalog && db.catalogVersion === 6) {
    const cat = db.catalog;
    if (!cat.products.some((p) => p.id === 'malzbier') && cat.sections.some((x) => x.id === 'alkoholfrei')) {
      const fresh = clone(DEFAULT_CATALOG.products.find((p) => p.id === 'malzbier'));
      const at = cat.products.findIndex((p) => p.id === 'red-bull');
      if (at >= 0) cat.products.splice(at, 0, fresh); else cat.products.push(fresh);
    }
    db.catalogVersion = 7;
    save(db);
  }
  // Version 7 → 8: Radler und Sportsfreund in der Erzquell-Flasche wie das Malzbier.
  if (db.catalog && db.catalogVersion === 7) {
    for (const [id, art, color] of [['radler', 'radler', '#7A4A1E'], ['sportsfreund', 'sportsfreund', '#5A2A1A']]) {
      const p = db.catalog.products.find((x) => x.id === id);
      if (p) Object.assign(p, { art, color });
    }
    db.catalogVersion = 8;
    save(db);
  }
  // Version 8 → 9: Gerolsteiner als Gourmet-Glasflasche.
  if (db.catalog && db.catalogVersion === 8) {
    const p = db.catalog.products.find((x) => x.id === 'gerolsteiner');
    if (p) Object.assign(p, { art: 'gerolsteiner', color: '#CFE6E0' });
    db.catalogVersion = 9;
    save(db);
  }
  // Real club price list: update current offers once, retaining snacks, shop and booking history.
  if (db.catalog && db.catalogVersion === 9) {
    const before = clone(db.catalog);
    const cat = db.catalog;
    const managed = new Set(DEFAULT_CATALOG.products.filter(p => ['alkoholfrei', 'bier', 'aperitif'].includes(p.section)
      || ['bockwurst', 'grillwurst', 'grillfleisch'].includes(p.id)).map(p => p.id));
    const existing = new Map(cat.products.map(p => [p.id, p]));
    cat.products = DEFAULT_CATALOG.products.map(fresh => {
      const old = existing.get(fresh.id);
      return old ? (managed.has(fresh.id) ? { ...old, ...clone(fresh) } : old) : clone(fresh);
    });
    cat.products.push(...[...existing.values()].filter(p => !cat.products.some(x => x.id === p.id))
      .map(p => ['alkoholfrei', 'bier', 'aperitif'].includes(p.section) ? { ...p, active: false } : p));
    const sections = new Map(cat.sections.map(s => [s.id, s]));
    cat.sections = DEFAULT_CATALOG.sections.map(s => s.id === 'shop' && sections.has(s.id)
      ? sections.get(s.id) : { ...sections.get(s.id), ...clone(s) });
    cat.sections.splice(3, 0, ...[...sections.values()].filter(s => !cat.sections.some(x => x.id === s.id)));
    db.catalogVersion = 10;
    if (!save(db)) { db.catalog = before; db.catalogVersion = 9; throw new Error('Die neue Getränkeliste konnte nicht gespeichert werden. Bitte Gerätespeicher prüfen.'); }
  }
  if (db.catalog && db.catalogVersion === 10) {
    const before = clone(db.catalog);
    for (const id of ['koelsch-flasche', 'weissbier', 'radler', 'grillwurst']) {
      const product = db.catalog.products.find(p => p.id === id);
      const fresh = DEFAULT_CATALOG.products.find(p => p.id === id);
      if (product) Object.assign(product, { art: fresh.art, color: fresh.color });
    }
    db.catalogVersion = 11;
    if (!save(db)) { db.catalog = before; db.catalogVersion = 10; throw new Error('Die neuen Produktsymbole konnten nicht gespeichert werden.'); }
  }
  if (db.catalog && db.catalogVersion === 11) {
    const before = clone(db.catalog);
    const wine = db.catalog.products.find(p => p.id === 'grauburgunder');
    if (wine && wine.name === 'Grauburgunder') wine.name = 'Grauburgunder Wein';
    db.catalogVersion = 12;
    if (!save(db)) { db.catalog = before; db.catalogVersion = 11; throw new Error('Der Produktname konnte nicht gespeichert werden.'); }
  }
  if (db.catalog && db.catalogVersion === 12) {
    const before = clone(db.catalog);
    const cat = db.catalog;
    for (const id of ['bockwurst', 'grillwurst', 'grillfleisch']) {
      const product = cat.products.find(p => p.id === id);
      if (product) product.section = 'spezialitaeten';
    }
    for (const id of ['flutlicht', 'gastspieler']) {
      if (!cat.products.some(p => p.id === id)) cat.products.push(clone(DEFAULT_CATALOG.products.find(p => p.id === id)));
    }
    const existing = new Map(cat.sections.map(s => [s.id, s]));
    cat.sections = DEFAULT_CATALOG.sections.map(fresh => {
      const old = existing.get(fresh.id);
      return old ? { ...old, ...(fresh.id === 'snacks' ? { title: 'Snacks' } : {}) } : clone(fresh);
    });
    cat.sections.push(...before.sections.filter(s => !cat.sections.some(x => x.id === s.id)));
    db.catalogVersion = 13;
    if (!save(db)) { db.catalog = before; db.catalogVersion = 12; throw new Error('Die neuen Kioskbereiche konnten nicht gespeichert werden.'); }
  }
  // Website-Inhalte (Home, Aktuell, Sport, Club) einmalig aus den Startinhalten anlegen.
  if (!db.site && TFB.siteSeed) {
    db.site = clone(TFB.publicSite || TFB.siteSeed);
    save(db);
  }
  // Seite heißt (wieder) „Aktuell“ – Titel und Partner-Zeile angleichen, eigene Inhalte bleiben.
  if (db.site && db.site.pages && db.site.pages.aktuell && db.site.pages.aktuell.title === 'News') {
    db.site.pages.aktuell.title = 'Aktuell';
    db.site.pages.aktuell.partnerKicker = 'Aktuelles wird dir präsentiert von';
    save(db);
  }
  // Neu am 10.10.: Home-Seite ergänzen, „Verein“ heißt jetzt „Club“, Platz für Team-Inhalte.
  if (db.site && db.site.pages && TFB.siteSeed) {
    let changed = false;
    Object.entries(TFB.legalPages || {}).forEach(([key, page]) => {
      if (!db.site.pages[key]) { db.site.pages[key] = clone(page); changed = true; }
    });
    if (!db.site.pages.home) { db.site.pages = { home: clone(TFB.siteSeed.pages.home), ...db.site.pages }; changed = true; }
    const club = db.site.pages.verein;
    if (club && club.title === 'Verein') { club.title = 'Club'; club.partnerKicker = TFB.siteSeed.pages.verein.partnerKicker; changed = true; }
    if (!db.site.teams) { db.site.teams = {}; changed = true; }
    // Home-Themen bekommen ihre Unterseite („Mehr erfahren“), eigene Texte bleiben unangetastet.
    TFB.siteSeed.pages.home.blocks.forEach((seedBlock) => {
      const mine = db.site.pages.home.blocks.find((x) => x.id === seedBlock.id);
      if (mine && !mine.more && seedBlock.more) { mine.more = clone(seedBlock.more); changed = true; }
    });
    // Einmalige Text-Updates aus site-seed.js (z. B. neuer Padel-Text) – Fotos und Links bleiben.
    db.site.applied = db.site.applied || [];
    (TFB.siteSeed.updates || []).forEach((u) => {
      if (db.site.applied.includes(u.id)) return;
      const page = db.site.pages[u.page];
      // Neuer Baustein oben auf einer Seite (z. B. vier Info-Knöpfe im Club), falls noch nicht vorhanden
      if (u.insertBlock && page && !page.blocks.some((x) => x.id === u.insertBlock.id)) {
        const at = u.insertAfter ? page.blocks.findIndex((x) => x.id === u.insertAfter) : -1;
        if (at >= 0) page.blocks.splice(at + 1, 0, clone(u.insertBlock)); else if (u.insertAfter) page.blocks.push(clone(u.insertBlock)); else page.blocks.unshift(clone(u.insertBlock));
        changed = true;
      }
      if (u.removeBlock && page) {
        const before = page.blocks.length;
        page.blocks = page.blocks.filter((x) => x.id !== u.removeBlock);
        if (page.blocks.length !== before) changed = true;
      }
      const block = page && page.blocks.find((x) => x.id === u.block);
      if (block) {
        // Hochgeladenes Titelfoto auf die Unterseite verschieben (Kollage, vorne) – Startseite zeigt wieder das Motiv
        if (u.moveImageToMore && /^img:/.test(block.image || '')) {
          const imgs = ((block.more && block.more.images) || []).filter((r) => !/^ph:/.test(r));
          block.more = { ...(block.more || {}), images: [block.image, ...imgs] };
          block.image = null;
        }
        if (!u.setWhenText || block.text === u.setWhenText) Object.assign(block, clone(u.set || {}));
        if (u.fillFacts && block.type === 'facts') {
          block.items = block.items || [];
          while (block.items.length < u.fillFacts) block.items.push({ value: '–', label: 'Kennzahl' });
        }
        if (u.more) block.more = { ...(block.more || {}), ...clone(u.more) };
      }
      db.site.applied.push(u.id);
      changed = true;
    });
    if (changed) save(db);
  }
  // Keep edited/imported news; remove only untouched sample copy, never by author.
  if (db.site?.pages && TFB.siteSeed) {
    let changed = false;
    const samples = TFB.siteSeed.pages.aktuell.blocks.filter(b => b.type === 'post');
    for (const page of Object.values(db.site.pages)) {
      const before = page.blocks.length;
      page.blocks = page.blocks.filter(b => !samples.some(s => b.id === s.id && b.type === 'post'
        && b.title === s.title && b.text === s.text && b.date === s.date
        && !b.image && !(b.images || []).length));
      changed ||= before !== page.blocks.length;
    }
    const home = db.site.pages.home;
    if (home) {
      const before = home.blocks.length;
      home.blocks = home.blocks.filter(b => !TFB.siteSeed.pages.home.blocks.some(s => b.id === s.id
        && b.type === 'feature' && b.title === s.title && b.text === s.text && b.subtitle === s.subtitle && b.kicker === s.kicker
        && b.link?.url === s.link?.url && b.link?.label === s.link?.label
        && !b.image && !(b.images || []).length && !(b.album?.images || []).length
        && !(b.more?.heroImages || []).length && !(b.more?.images || []).some(r => !/^ph:/.test(r))
        && (!b.more?.text || b.more.text === s.more?.text)
        && (!b.more?.quote || b.more.quote === s.more?.quote)));
      changed ||= before !== home.blocks.length;
    }
    const training = db.site.pages.sport;
    if (training && !db.site.applied.includes('training-dates-without-calendar-v98')) {
      const at = training.blocks.findIndex(b => b.id === 's-schnupper-btn');
      if (at >= 0) training.blocks.splice(at, 1, { id: 's-schnupper-dates', type: 'text', title: 'Termine für Schnuppertraining demnächst', text: '' });
      const intro = training.blocks.find(b => b.id === 's-schnupper');
      if (intro) intro.text = String(intro.text || '').replace('\nBitte schaut in unseren Kalender, dort sind die Schnuppertrainingstage aufgeführt.', '');
      db.site.applied.push('training-dates-without-calendar-v98');
      changed = true;
    }
    if (changed) save(db);
  }
  // ---------- Clubgeflüster & Insider News (Beiträge der Mitglieder) ----------
  // Beispiel-Jugendliche (erfunden) für die Vorführung der Eltern-Zustimmung
  const YOUTH = [
    { id: 'm-j1', memberNo: '1101', firstName: 'Paul', lastName: 'Jung', email: 'paul.jung@beispiel.de', birthYear: 2011, active: true },
    { id: 'm-j2', memberNo: '1102', firstName: 'Mia', lastName: 'Kramer', email: 'mia.kramer@beispiel.de', birthYear: 2012, active: true },
  ];
  if (db.members && !db.members.some((m) => m.id === 'm-j1')) { db.members.push(...clone(YOUTH)); save(db); }
  if (!db.community) {
    db.community = {
      // Wer darf in den Insider News einer Mannschaft schreiben? Im Echtbetrieb aus der
      // nuLiga-Spielermeldung (Abgleich mit der Mitgliederliste), hier Beispiel-Zuordnung.
      rosters: {
        'herren-40-1': ['m-demo', 'm2', 'm4', 'm6', 'm8', 'm10', 'm12', 'm14', 'm16'],
        'herren-30-1': ['m18', 'm9', 'm11'],
        'damen-30-1': ['m1', 'm3', 'm5', 'm7', 'm13', 'm15', 'm17'],
        'junioren-15-1': ['m-j1', 'm-j2'],
        'herren-1': ['m6', 'm10'],
      },
      posts: [],
    };
    save(db);
  }
  // Remove only the former seed IDs, including after importing an older backup.
  const examplePostIds = new Set(['p-s1', 'p-s2', 'p-s3', 'p-s4', 'p-t1', 'p-t2', 'p-t3']);
  const memberPosts = db.community.posts.filter((post) => !examplePostIds.has(post.id));
  if (memberPosts.length !== db.community.posts.length) {
    db.community.posts = memberPosts;
    save(db);
  }
  // Vorführung der vierspaltigen Strichliste: einmalig ein paar Kränze und Snacks (erfundene Mitglieder)
  if (!db.demoTallyMix && db.catalog) {
    const find = (id) => db.catalog.products.find((p) => p.id === id);
    const at = (h) => new Date(Date.now() - h * 3600000);
    [['m2', 'koelsch-kranz', 26], ['m6', 'koelsch-kranz', 50], ['m6', 'snickers', 49], ['m1', 'hanuta', 30], ['m13', 'mars', 5], ['m13', 'snickers', 5], ['m8', 'koelsch-kranz', 74]]
      .forEach(([m, id, h]) => { const pr = find(id); if (pr && db.members.some((x) => x.id === m)) db.items.push(makeItem(m, pr, at(h))); });
    db.demoTallyMix = true;
    save(db);
  }
  // Wer gehört zu welcher Mannschaft? nuLiga-Spielermeldung (assets/data/rosters.js, lokal) abgeglichen
  // mit der Mitgliederliste über „Nachname, Vorname“ – plus die Beispiel-Zuordnung der Demo.
  const nameKey = (s) => String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z]/g, '');
  const nuligaRosters = () => (TFB.rosters && TFB.rosters.teams) || {};
  function rosterOf(team) {
    const ids = new Set(db.community.rosters[team] || []);
    const names = new Set((nuligaRosters()[team] || []).map(nameKey));
    db.members.forEach(m => {
      if (!m.active) return;
      if (Array.isArray(m.directoryTeams)) { if (m.directoryTeams.includes(team)) ids.add(m.id); }
      else if (names.has(nameKey(`${m.lastName}, ${m.firstName}`))) ids.add(m.id);
    });
    return [...ids];
  }
  const allTeamKeys = () => [...new Set([...Object.keys(db.community.rosters || {}), ...Object.keys(nuligaRosters()), ...db.members.flatMap(m => m.directoryTeams || [])])];
  const teamsOfMember = (id) => {
    const member = db.members.find(m => m.id === id);
    return Array.isArray(member?.directoryTeams) ? member.directoryTeams.slice() : allTeamKeys().filter(k => rosterOf(k).includes(id));
  };
  const inTeam = (member, team) => teamsOfMember(member.id).includes(team);

  // Korrektur 11.10.: Die Demo hatte das Admin-Konto fälschlich Herren 40 1 zugeordnet. Sobald die
  // nuLiga-Meldungen vorliegen, gilt nur noch der echte Abgleich – und Beiträge wandern mit.
  if (Object.keys(nuligaRosters()).length && !db.community.fixedRosters20261011) {
    Object.keys(db.community.rosters).forEach((k) => { db.community.rosters[k] = db.community.rosters[k].filter((id) => id !== 'm-demo'); });
    db.community.posts.forEach((p) => {
      if (!p.alsoTeams || !p.alsoTeams.length) return;
      const author = db.members.find((m) => m.id === p.authorId);
      if (!author) return;
      const valid = p.alsoTeams.filter((k) => rosterOf(k).includes(author.id));
      if (valid.length === p.alsoTeams.length) return;
      // „Ü55“ im Text → Herren 55; sonst die Mannschaften, in denen der Verfasser gemeldet ist
      const mine = teamsOfMember(author.id);
      const guess = /ü\s?55|u55|herren\s?55/i.test(p.text || '') ? mine.filter((k) => k === 'herren-55-1') : [];
      p.alsoTeams = [...new Set([...valid, ...guess])];
    });
    db.community.fixedRosters20261011 = true;
    save(db);
  }

  const isMinor = (m) => Boolean(m && m.birthYear && new Date().getFullYear() - m.birthYear < 18);
  const displayName = (m) => (m ? (isMinor(m) ? `${m.firstName} ${m.lastName[0]}.` : `${m.firstName} ${m.lastName}`) : 'Mitglied');
  const teamOf = (scope) => (String(scope).startsWith('team:') ? scope.slice(5) : null);
  function mayWrite(member, scope) {
    if (!member) return { ok: false, reason: 'login' };
    const team = teamOf(scope);
    if (team && !member.isAdmin && !inTeam(member, team)) return { ok: false, reason: 'team' };
    const acc = accountOf(member.id) || {};
    if (isMinor(member) && !acc.parentConsent) return { ok: false, reason: 'parents' };
    if (!acc.feedRules) return { ok: false, reason: 'rules' };
    return { ok: true };
  }
  function publicPost(p) {
    const author = db.members.find((m) => m.id === p.authorId);
    const acc = author ? accountOf(author.id) : null;
    const me = sessionMemberId();
    const meM = db.members.find((m) => m.id === me);
    return { ...clone(p), commentCount: (db.community.comments || []).filter(c => c.postId === p.id).length, author: displayName(author), avatar: author && photoAllowed(author, meM && meM.active ? 'members' : 'public') ? (acc && acc.avatar) || null : null,
      mine: p.authorId === me, canModerate: Boolean(meM && meM.isAdmin), team: teamOf(p.scope) };
  }

  if (!db.catalog || db.catalogVersion !== CATALOG_VERSION) {
    db.catalog = clone(DEFAULT_CATALOG);
    db.catalogVersion = CATALOG_VERSION;
    const admin = db.members.find((m) => m.id === 'm-demo');
    if (admin) admin.isAdmin = true;
    save(db);
  }

  function seed() {
    const now = Date.now();
    const members = DEMO_MEMBERS.map(([firstName, lastName], i) => ({
      id: 'm' + (i + 1),
      memberNo: String(1001 + i),
      firstName,
      lastName,
      email: `${firstName}.${lastName}`.toLowerCase().replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe') + '@beispiel.de',
      active: true,
    }));
    members.push({ id: 'm-demo', memberNo: '1099', ...DEMO_LOGIN, active: true, isAdmin: true });

    // Beispielmitglieder haben schon zugestimmt, Max Mustermann noch nicht.
    const accounts = members
      .filter((m) => m.id !== 'm-demo')
      .map((m) => ({ memberId: m.id, passwordHash: null, consentVersion: cfg.consentVersion, consentedAt: new Date(now - 40 * DAY).toISOString() }));

    const items = [];
    const r = rng(20261009);
    const pick = (list) => list[Math.floor(r() * list.length)];
    const popular = ['koelsch', 'koelsch', 'koelsch', 'koelsch', 'radler', 'weissbier', 'gerolsteiner', 'gerolsteiner', 'sportsfreund', 'coca-cola', 'fanta', 'snickers', 'haribo'];
    const PRODUCTS = DEFAULT_CATALOG.products;

    // Etwa zehn Tage Betrieb: nicht jeder ist jeden Tag da.
    for (let d = 10; d >= 0; d--) {
      for (const m of members) {
        if (m.id === 'm-demo') continue;
        if (r() > 0.32) continue;
        const count = 1 + Math.floor(r() * 3);
        for (let k = 0; k < count; k++) {
          const productId = pick(popular);
          const product = PRODUCTS.find((p) => p.id === productId);
          const at = now - d * DAY - Math.floor(r() * 5 * 60 * 60 * 1000);
          if (at > now) continue;
          items.push(makeItem(m.id, product, new Date(at)));
        }
      }
    }

    // Für Max Mustermann: zwei abgeschlossene Monate zum Anschauen.
    const statements = [];
    const current = monthKey(new Date(now));
    const lastMonthState = Number(berlinParts(new Date(now)).day) < cfg.debitDayOfMonth ? 'scheduled' : 'collected';
    [[2, 2350, 14, 'collected'], [1, 1700, 10, lastMonthState]].forEach(([back, total, count, state]) => {
      statements.push({ id: uid(), memberId: 'm-demo', month: previousMonthKey(current, back), totalCents: total, itemCount: count, status: state });
    });

    return { version: 1, members, accounts, items, statements, catalog: clone(DEFAULT_CATALOG), catalogVersion: CATALOG_VERSION, createdAt: new Date(now).toISOString() };
  }

  function makeItem(memberId, product, date) {
    return {
      id: uid(),
      memberId,
      productId: product.id,
      productName: product.name,
      priceCents: product.price,
      createdAt: date.toISOString(),
      status: 'open',
    };
  }

  // ---------- Bildspeicher für hochgeladene Fotos (IndexedDB) ----------
  const IMG_DB = 'tfb_kiosk_images';
  const imageDatabase = () => db.imageDatabase || IMG_DB;
  function openImages(name) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('Dieser Browser kann keine Fotos speichern.'));
      let settled = false;
      const finish = (err, connection) => {
        if (settled) { if (connection) connection.close(); return; }
        settled = true; clearTimeout(timer);
        if (err) reject(err); else resolve(connection);
      };
      const timer = setTimeout(() => finish(new Error('Der Bildspeicher antwortet nicht. Sicherung nicht abgeschlossen.')), 10000);
      let req;
      try { req = indexedDB.open(name, 1); } catch (err) { finish(err); return; }
      req.onupgradeneeded = () => req.result.createObjectStore('images');
      req.onerror = () => finish(new Error('Der Bildspeicher ist nicht erreichbar.'));
      req.onblocked = () => finish(new Error('Der Bildspeicher ist blockiert. Bitte andere TFB-Fenster schließen.'));
      req.onsuccess = () => finish(null, req.result);
    });
  }
  function imgStore(mode) {
    return openImages(imageDatabase()).then(connection => {
      const tx = connection.transaction('images', mode);
      tx.addEventListener('complete', () => {
        connection.close();
        if (mode === 'readwrite') TFB.imageRevision = (TFB.imageRevision || 0) + 1;
      });
      tx.addEventListener('abort', () => connection.close());
      return tx.objectStore('images');
    });
  }
  // A request can succeed before its transaction fails; backups wait for the commit.
  async function imageTask(name, mode, run) {
    const connection = await openImages(name);
    return new Promise((resolve, reject) => {
      let tx, result, settled = false;
      const timer = setTimeout(() => {
        finish(new Error('Der Bildspeicher antwortet nicht. Vorgang nicht abgeschlossen.'));
        if (tx) { try { tx.abort(); } catch (_) {} }
      }, 10000);
      const finish = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer); connection.close();
        if (err) reject(err);
        else { try { resolve(result()); } catch (ex) { reject(ex); } }
      };
      try {
        tx = connection.transaction('images', mode);
        tx.oncomplete = () => finish();
        tx.onabort = () => finish(new Error('Fotos konnten nicht vollständig verarbeitet werden. Der bisherige Stand bleibt erhalten.'));
        tx.onerror = () => {}; // Abort reports the final transaction failure.
        result = run(tx.objectStore('images'));
      } catch (err) { if (tx) { try { tx.abort(); } catch (_) {} } finish(err); }
    });
  }
  function validatePhotos(data) {
    if (!data.images || typeof data.images !== 'object' || Array.isArray(data.images)) throw new Error('Die Sicherung enthält keine vollständige Fotosammlung.');
    for (const [id, url] of Object.entries(data.images)) {
      if (typeof url !== 'string' || !((/^img:.+/.test(id) && /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/]+={0,2}$/i.test(url))
        || (/^doc:.+/.test(id) && /^data:application\/pdf;base64,[a-z0-9+/]+={0,2}$/i.test(url)))) {
        throw new Error('Die Sicherung enthält ein ungültiges Foto oder Dokument.');
      }
    }
    const visit = (value) => {
      if (typeof value === 'string' && /^(img:|doc:)/.test(value) && !Object.prototype.hasOwnProperty.call(data.images, value)) {
        throw new Error('In der Sicherung fehlen verknüpfte Fotos oder Dokumente. Der bisherige Stand bleibt erhalten.');
      }
      if (value && typeof value === 'object') Object.values(value).forEach(visit);
    };
    visit(data.db);
  }
  const done = (req) => new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Bildspeicher-Fehler'));
  });

  // ---------- Sitzung ----------
  function sessionMemberId() {
    try { return localStorage.getItem(SESSION_KEY); } catch (_) { return null; }
  }
  function setSession(memberId) {
    try {
      if (memberId) localStorage.setItem(SESSION_KEY, memberId);
      else localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  }
  function requireMember() {
    const id = sessionMemberId();
    const member = db.members.find((m) => m.id === id && m.active);
    if (!member) throw new Error('Bitte melde dich an.');
    return member;
  }
  function accountOf(memberId) {
    return db.accounts.find((a) => a.memberId === memberId) || null;
  }
  const PHOTO_VERSION = 'tfb-fotos-v1';
  function photoMinor(member) {
    if (member.birthDate) {
      const born = new Date(member.birthDate + 'T00:00:00');
      return new Date(born.getFullYear() + 18, born.getMonth(), born.getDate()) > new Date();
    }
    // Ohne Geburtstag bleibt das 18. Lebensjahr vorsorglich freigabepflichtig.
    return Boolean(member.birthYear && new Date().getFullYear() - member.birthYear <= 18);
  }
  function photoState(member) {
    const account = accountOf(member.id) || {};
    return { publicAvatar: Boolean(account.photoPublic), events: Boolean(account.photoEvents),
      approval: clone(account.photoApproval || null), pending: clone(account.photoPending || null),
      revision: account.avatarRevision || 0, version: PHOTO_VERSION };
  }
  function photoAllowed(member, scope) {
    const account = accountOf(member.id) || {};
    if (!account.avatar && scope !== 'events') return false;
    if (scope === 'public' && !account.photoPublic) return false;
    if (scope === 'events' && !account.photoEvents) return false;
    if (!photoMinor(member)) return true;
    if (account.photoPending && account.photoPending.scopes.includes(scope)) return false;
    const approval = account.photoApproval;
    return Boolean(approval && approval.version === PHOTO_VERSION && approval.scopes.includes(scope)
      && (scope === 'events' || approval.revision === (account.avatarRevision || 0)));
  }
  function requireAdmin() {
    const member = requireMember();
    if (!member.isAdmin) throw new Error('Nur Admins dürfen diese Angaben bearbeiten.');
    return member;
  }
  function publicMember(member) {
    const account = accountOf(member.id);
    return {
      id: member.id,
      memberNo: member.memberNo,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      isAdmin: Boolean(member.isAdmin),
      avatar: (account && account.avatar) || null,
      avatarLarge: (account && (account.avatarLarge || account.avatar)) || null,
      hasConsent: Boolean(account && account.consentVersion === cfg.consentVersion),
      consentedAt: (account && account.consentedAt) || null,
      phone: (account && account.phone) || '',
      infoMails: !(account && account.infoMails === false),
      openInvites: !(account && account.openInvites === false),
      groupChatNotices: Boolean(account && account.groupChatNotices),
      isMinor: isMinor(member),
      parentConsent: (account && account.parentConsent) || null,
      photoMinor: photoMinor(member),
      photoPermissions: photoState(member),
      feedRules: Boolean(account && account.feedRules),
      teams: db.community ? teamsOfMember(member.id) : [],
    };
  }

  // ---------- Öffentliche Schnittstelle ----------
  TFB.api = {
    mode: 'demo',
    demoLogin: DEMO_LOGIN,

    // UI bridge for a server-verified identity. No authorization relies on this
    // local record: the protected directory independently verifies its token.
    attachDirectoryMember(member) {
      if (!member) { setSession(null); return null; }
      if (Array.isArray(member.teams)) member = { ...member, directoryTeams: member.teams.filter(t => typeof t === 'string' && /^[a-z0-9-]{1,80}$/.test(t)) };
      const old = db.members.find(m => m.id === member.id);
      if (old) Object.assign(old, member); else db.members.push({ ...member });
      if (!accountOf(member.id)) db.accounts.push({ memberId: member.id, passwordHash: null });
      save(db); setSession(member.id);
      return publicMember(old || db.members.find(m => m.id === member.id));
    },

    async session() {
      const id = sessionMemberId();
      const member = db.members.find((m) => m.id === id && m.active);
      return member ? publicMember(member) : null;
    },

    // Schritt 1 der Anmeldung: Ist die E-Mail in der Mitgliederliste?
    async lookupEmail(email) {
      await wait();
      const member = db.members.find((m) => norm(m.email) === norm(email) && m.active);
      if (!member) return { known: false };
      const account = accountOf(member.id);
      return { known: true, hasPassword: Boolean(account && account.passwordHash), firstName: member.firstName };
    },

    async signIn(email, password) {
      await wait(200);
      const member = db.members.find((m) => norm(m.email) === norm(email) && m.active);
      const account = member && accountOf(member.id);
      if (!member || !account || !account.passwordHash || account.passwordHash !== await hash(password)) {
        throw new Error('E-Mail oder Passwort stimmt nicht.');
      }
      setSession(member.id);
      return publicMember(member);
    },

    // Erstes Anmelden: nur möglich, wenn die E-Mail in der Mitgliederliste steht.
    async createPassword(email, password) {
      await wait(200);
      const member = db.members.find((m) => norm(m.email) === norm(email) && m.active);
      if (!member) throw new Error('Diese E-Mail steht nicht in der Mitgliederliste.');
      if (String(password).length < 8) throw new Error('Bitte mindestens 8 Zeichen verwenden.');
      let account = accountOf(member.id);
      if (account && account.passwordHash) throw new Error('Für diese E-Mail gibt es schon ein Passwort.');
      if (!account) { account = { memberId: member.id, passwordHash: null, consentVersion: null, consentedAt: null }; db.accounts.push(account); }
      account.passwordHash = await hash(password);
      save(db);
      setSession(member.id);
      return publicMember(member);
    },

    async signOut() { setSession(null); },

    // Eigene Angaben im Account (Name und E-Mail kommen aus der Mitgliederliste des Vereins).
    // Eigene Daten ändern. Name und E-Mail sind die Daten der Mitgliederliste des Clubs: eine geänderte
    // E-Mail wird zugleich die beim Club hinterlegte Adresse (Anmeldung, Clubgeflüster, Mannschaftsrechte
    // hängen daran). Jede Änderung landet im Protokoll für den Vorstand (db.changeLog).
    async updateProfile({ firstName, lastName, email, phone, infoMails, openInvites, groupChatNotices }) {
      const member = requireMember();
      const account = accountOf(member.id);
      const tel = String(phone || '').trim();
      if (tel && !/^[+\d][\d\s/()-]{5,}$/.test(tel)) throw new Error('Bitte eine gültige Handynummer eingeben.');
      const changes = [];
      const setField = (field, value) => {
        if (value == null) return;
        const v = String(value).trim();
        if (v && v !== member[field]) { changes.push({ field, from: member[field], to: v }); member[field] = v; }
      };
      if (firstName != null && !String(firstName).trim()) throw new Error('Bitte einen Vornamen eingeben.');
      if (lastName != null && !String(lastName).trim()) throw new Error('Bitte einen Nachnamen eingeben.');
      if (email != null) {
        const e = String(email).trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
        if (db.members.some((m) => m.id !== member.id && norm(m.email) === e)) throw new Error('Diese E-Mail-Adresse gehört schon zu einem anderen Mitglied.');
        if (e !== norm(member.email)) { changes.push({ field: 'email', from: member.email, to: e }); member.email = e; }
      }
      setField('firstName', firstName);
      setField('lastName', lastName);
      if (changes.length) {
        db.changeLog = db.changeLog || [];
        changes.forEach((c) => db.changeLog.push({ memberId: member.id, memberNo: member.memberNo, ...c, at: new Date().toISOString() }));
      }
      Object.assign(account, { phone: tel, infoMails: Boolean(infoMails), openInvites: Boolean(openInvites) });
      if (groupChatNotices != null) {
        if (groupChatNotices && !account.groupChatNotices) {
          account.chatNoticesSince = new Date().toISOString();
          account.chatNoticeRead = db.community.posts.map(p => p.id);
        }
        account.groupChatNotices = Boolean(groupChatNotices);
      }
      if (!save(db)) throw new Error('Speichern nicht möglich.');
      return publicMember(member);
    },

    // ---------- Clubgeflüster & Insider News ----------
    commentNotices() {
      const member = db.members.find(m => m.id === sessionMemberId() && m.active);
      if (!member) return [];
      const seen = new Set(accountOf(member.id)?.commentRead || []);
      const own = new Map(db.community.posts.filter(p => p.authorId === member.id && !p.hidden).map(p => [p.id, p]));
      const grouped = new Map();
      (db.community.comments || []).filter(c => own.has(c.postId) && c.authorId !== member.id && !seen.has(c.id)
        && Date.parse(c.createdAt) >= Date.now() - 7 * DAY).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach(c => {
          if (!grouped.has(c.postId)) grouped.set(c.postId, []);
          grouped.get(c.postId).push(c);
        });
      return [...grouped].map(([postId, comments]) => ({ id: 'comments-' + postId, type: 'comment', postId,
        from: comments[0].authorId, count: comments.length, snap: { title: own.get(postId).title || own.get(postId).text.slice(0, 80) || 'Dein Beitrag' },
        extra: {}, at: Date.parse(comments[0].createdAt), read: false }));
    },
    readCommentPosts(postIds) {
      const member = requireMember();
      const own = new Set(db.community.posts.filter(p => p.authorId === member.id && postIds.includes(p.id)).map(p => p.id));
      const comments = db.community.comments || [];
      const existing = new Set(comments.map(c => c.id));
      const acc = accountOf(member.id);
      acc.commentRead = [...new Set([...(acc.commentRead || []), ...comments.filter(c => own.has(c.postId)).map(c => c.id)])].filter(id => existing.has(id));
      if (!save(db)) throw Error('Speichern nicht möglich.');
    },
    async comments(postId) {
      const post = db.community.posts.find(p => p.id === postId);
      const member = db.members.find(m => m.id === sessionMemberId() && m.active);
      if (!post || (post.hidden && !member?.isAdmin && post.authorId !== member?.id)) return [];
      return (db.community.comments || []).filter(c => c.postId === postId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(c => ({
        ...clone(c), author: displayName(db.members.find(m => m.id === c.authorId)), mine: c.authorId === member?.id, canModerate: Boolean(member?.isAdmin),
      }));
    },
    async addComment(postId, text, { images = [] } = {}) {
      const member = requireMember();
      const post = db.community.posts.find(p => p.id === postId && !p.hidden);
      if (!post) throw Error('Dieser Beitrag ist nicht mehr verfügbar.');
      if (!mayWrite(member, post.scope).ok) throw Error('Bitte zuerst die Hinweise bestätigen oder die Mannschaftsberechtigung prüfen.');
      const value = String(text || '').trim();
      if (!Array.isArray(images) || images.length > 3 || images.some(ref => typeof ref !== 'string' || !/^img:.+/.test(ref))) throw Error('Pro Kommentar sind höchstens 3 Fotos möglich.');
      if ((!value && !images.length) || value.length > 2000) throw Error('Bitte einen Kommentar oder ein Foto hinzufügen (höchstens 2000 Zeichen).');
      const next = clone(db);
      next.community.comments = [...(next.community.comments || []), { id: 'c-' + uid(), postId, authorId: member.id, text: value, images: images.slice(), createdAt: new Date().toISOString() }];
      if (!save(next)) throw Error('Der Kommentar konnte nicht gespeichert werden.');
      db = next; document.dispatchEvent(new Event('tfb-chat-updated'));
    },
    async editComment(id, text, options = {}) {
      const member = requireMember();
      const next = clone(db);
      const comment = (next.community.comments || []).find(c => c.id === id);
      if (!comment || comment.authorId !== member.id) throw Error('Du kannst nur eigene Kommentare bearbeiten.');
      const post = next.community.posts.find(p => p.id === comment.postId && !p.hidden);
      if (!post) throw Error('Dieser Beitrag ist nicht mehr verfügbar.');
      const value = String(text || '').trim();
      const images = options.images === undefined ? (comment.images || []) : options.images;
      if (!Array.isArray(images) || images.length > 3 || images.some(ref => typeof ref !== 'string' || !/^img:.+/.test(ref))) throw Error('Pro Kommentar sind höchstens 3 Fotos möglich.');
      if ((!value && !images.length) || value.length > 2000) throw Error('Bitte einen Kommentar oder ein Foto hinzufügen (höchstens 2000 Zeichen).');
      comment.text = value; comment.images = images.slice(); comment.editedAt = new Date().toISOString();
      if (!save(next)) throw Error('Der Kommentar konnte nicht gespeichert werden.');
      db = next; document.dispatchEvent(new Event('tfb-chat-updated'));
    },
    async deleteComment(id) {
      const member = requireMember();
      const comment = (db.community.comments || []).find(c => c.id === id);
      if (!comment || (comment.authorId !== member.id && !member.isAdmin)) throw Error('Diesen Kommentar kannst du nicht entfernen.');
      const next = clone(db);
      next.community.comments = next.community.comments.filter(c => c.id !== id);
      if (!save(next)) throw Error('Der Kommentar konnte nicht entfernt werden.');
      db = next; document.dispatchEvent(new Event('tfb-chat-updated'));
    },
    chatNotices() {
      const member = db.members.find(m => m.id === sessionMemberId() && m.active);
      const acc = member && accountOf(member.id);
      if (!acc?.groupChatNotices) return [];
      const peers = new Set(teamsOfMember(member.id).flatMap(rosterOf));
      (TFB.meet?.chatPeers(member.id) || []).forEach(id => peers.add(id));
      const seen = new Set(acc.chatNoticeRead || []);
      const since = acc.chatNoticesSince || new Date().toISOString();
      const week = Date.now() - 7 * 864e5;
      const grouped = new Map();
      db.community.posts.filter(p => !p.hidden && p.authorId !== member.id && peers.has(p.authorId)
        && (p.scope === 'club' || String(p.scope).startsWith('team:'))
        && p.createdAt >= since && Date.parse(p.createdAt) >= week && !seen.has(p.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach(p => {
          if (!grouped.has(p.authorId)) grouped.set(p.authorId, []);
          grouped.get(p.authorId).push(p);
        });
      return [...grouped.values()].map(posts => ({
        id: 'chat-' + posts[0].authorId, type: 'chat', from: posts[0].authorId,
        postId: posts[0].id, postIds: posts.map(p => p.id), count: posts.length,
        snap: { title: posts[0].title || 'Chat-Beitrag' }, extra: {}, at: Date.parse(posts[0].createdAt), read: false,
      }));
    },
    readChatPosts(ids) {
      const member = requireMember();
      const acc = accountOf(member.id);
      const existing = new Set(db.community.posts.map(p => p.id));
      acc.chatNoticeRead = [...new Set([...(acc.chatNoticeRead || []), ...ids])].filter(id => existing.has(id));
      if (!save(db)) throw new Error('Speichern nicht möglich.');
    },
    // Lesen: öffentlich. Schreiben: nur angemeldete Mitglieder (Insider News: gemeldete Spieler).
    async posts(scope, { withTeams = false } = {}) {
      const me = db.members.find((m) => m.id === sessionMemberId());
      return db.community.posts
        .filter((p) => p.scope === scope || (withTeams && String(p.scope).startsWith('team:'))
          || (teamOf(scope) && (p.alsoTeams || []).includes(teamOf(scope))))
        .filter((p) => !p.hidden || (me && (me.isAdmin || p.authorId === me.id)))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((p) => ({ ...publicPost(p), teaser: withTeams && p.scope !== scope, fromClub: Boolean(teamOf(scope)) && p.scope === 'club', shownIn: teamOf(scope) || null }));
    },
    async teamPostCounts() {
      const out = {};
      db.community.posts.filter((p) => !p.hidden).forEach((p) => {
        [teamOf(p.scope), ...(p.alsoTeams || [])].filter(Boolean).forEach((t) => { out[t] = (out[t] || 0) + 1; });
      });
      return out;
    },
    // Teamfoto: Admins und die Spieler der Mannschaft
    async setTeamPhoto(team, ref) {
      const member = requireMember();
      if (!member.isAdmin && !inTeam(member, team)) throw new Error('Das Teamfoto ändern die Spieler dieser Mannschaft.');
      db.site = db.site || clone(TFB.siteSeed);
      db.site.teams = db.site.teams || {};
      db.site.teams[team] = { posts: [], ...(db.site.teams[team] || {}), photo: ref || null };
      save(db);
      return clone(db.site);
    },
    // Mannschaftsporträt (Magazin-Seite): Admins und die Spieler der Mannschaft
    async setTeamPortrait(team, portrait) {
      const member = requireMember();
      if (!member.isAdmin && !inTeam(member, team)) throw new Error('Das Porträt pflegen die Spieler dieser Mannschaft.');
      db.site = db.site || clone(TFB.siteSeed);
      db.site.teams = db.site.teams || {};
      db.site.teams[team] = { posts: [], ...(db.site.teams[team] || {}), portrait: clone(portrait || {}) };
      if (!save(db)) throw new Error('Speichern nicht möglich – der Gerätespeicher ist voll.');
      return clone(db.site);
    },
    async teamRoster(team) {
      return rosterOf(team).map((id) => displayName(db.members.find((m) => m.id === id))).filter(Boolean);
    },
    async canWrite(scope) {
      const member = db.members.find((m) => m.id === sessionMemberId() && m.active);
      return mayWrite(member || null, scope);
    },
    async acceptFeedRules() {
      const member = requireMember();
      accountOf(member.id).feedRules = new Date().toISOString();
      save(db);
      return publicMember(member);
    },
    async setParentConsent(parentName) {
      const member = requireMember();
      const name = String(parentName || '').trim();
      if (name.length < 3) throw new Error('Bitte den Namen eines Elternteils eintragen.');
      accountOf(member.id).parentConsent = { name, at: new Date().toISOString() };
      save(db);
      return publicMember(member);
    },
    // Fotos für Beiträge dürfen alle Mitglieder hochladen
    async putMemberImage(dataUrl) {
      requireMember();
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(dataUrl)) throw new Error('Dieses Bild lässt sich nicht verwenden.');
      const id = 'img:' + uid();
      await done((await imgStore('readwrite')).put(dataUrl, id));
      return id;
    },
    async addPost({ scope, title = '', text, images = [], alsoTeams = [] }) {
      const member = requireMember();
      const allowed = mayWrite(member, scope);
      if (!allowed.ok) throw new Error(allowed.reason === 'team' ? 'Insider News schreiben die Spieler dieser Mannschaft.' : 'Bitte zuerst die Hinweise bestätigen.');
      const t = String(text || '').trim();
      if (!t && !images.length) throw new Error('Bitte einen Text schreiben oder ein Foto wählen.');
      if (!Array.isArray(images) || images.length > 6) throw new Error('Pro Beitrag sind höchstens 6 Fotos möglich.');
      const mine = alsoTeams.filter((k) => member.isAdmin || inTeam(member, k));
      const post = { id: 'p-' + uid(), scope, authorId: member.id, createdAt: new Date().toISOString(), ...(String(title || '').trim() ? { title: String(title).trim().slice(0, 90) } : {}), text: t.slice(0, 2000), images: images.slice(0, 6), ...(scope === 'club' && mine.length ? { alsoTeams: mine } : {}) };
      db.community.posts.push(post);
      if (!save(db)) throw new Error('Speichern nicht möglich.');
      document.dispatchEvent(new Event('tfb-chat-updated'));
      return publicPost(post);
    },
    async editPost(id, { title = '', text, images, alsoTeams }) {
      const member = requireMember();
      const p = db.community.posts.find((x) => x.id === id);
      if (!p || (p.authorId !== member.id && !member.isAdmin)) throw new Error('Diesen Beitrag kannst du nicht ändern.');
      if (images && (!Array.isArray(images) || images.length > 6)) throw new Error('Pro Beitrag sind höchstens 6 Fotos möglich.');
      Object.assign(p, { text: String(text || '').trim().slice(0, 2000), images: (images || []).slice(0, 6), editedAt: new Date().toISOString() });
      if (String(title || '').trim()) p.title = String(title).trim().slice(0, 90); else delete p.title;
      if (alsoTeams && p.scope === 'club') p.alsoTeams = alsoTeams.filter((k) => member.isAdmin || inTeam(member, k));
      save(db);
      return publicPost(p);
    },
    async deletePost(id) {
      const member = requireMember();
      const p = db.community.posts.find((x) => x.id === id);
      if (!p || (p.authorId !== member.id && !member.isAdmin)) throw new Error('Diesen Beitrag kannst du nicht löschen.');
      db.community.posts = db.community.posts.filter((x) => x.id !== id);
      if (db.community.comments) db.community.comments = db.community.comments.filter(c => c.postId !== id);
      save(db);
      document.dispatchEvent(new Event('tfb-chat-updated'));
    },
    // Clubgeflüster-Beitrag nur aus einer Mannschaft nehmen – im Clubgeflüster bleibt er stehen
    async removePostFromTeam(id, team) {
      const member = requireMember();
      const p = db.community.posts.find((x) => x.id === id);
      if (!p || (p.authorId !== member.id && !member.isAdmin)) throw new Error('Diesen Beitrag kannst du nicht ändern.');
      if (p.scope !== 'club') throw new Error('Nur Beiträge aus dem Clubgeflüster lassen sich aus einer Mannschaft entfernen.');
      p.alsoTeams = (p.alsoTeams || []).filter((k) => k !== team);
      if (!p.alsoTeams.length) delete p.alsoTeams;
      save(db);
    },
    async hidePost(id, hidden = true) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Beiträge ausblenden.');
      const p = db.community.posts.find((x) => x.id === id);
      if (p) { p.hidden = hidden; save(db); document.dispatchEvent(new Event('tfb-chat-updated')); }
    },
    async reportPost(id) {
      const p = db.community.posts.find((x) => x.id === id);
      if (p) { p.reports = (p.reports || 0) + 1; save(db); }
    },

    // ---------- Mitgliederliste aus Excel (Vorschau, dann übernehmen) ----------
    // Übernommen werden nur Nr., Vorname, Name und E-Mail(s) – Handy und Geschlecht bewusst nicht.
    // Abgleich: Mitgliedsnummer, sonst E-Mail, sonst Name. Wer nicht mehr in der Liste steht, wird nur
    // deaktiviert (Striche und Beiträge bleiben). Beim ersten Import werden die erfundenen
    // Beispielmitglieder ausgeblendet; das eigene Admin-Konto wird zugeordnet, die Anmelde-E-Mail bleibt.
    async importMembers(rows, { apply = false } = {}) {
      const admin = requireMember();
      if (!admin.isAdmin) throw new Error('Nur Admins dürfen die Mitgliederliste laden.');
      const clean = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
      const nameKey = (f, l) => norm(`${f} ${l}`).normalize('NFC');
      const list = (rows || []).map((r) => ({ memberNo: clean(r.memberNo), firstName: clean(r.firstName), lastName: clean(r.lastName),
        email: norm(r.email), email2: norm(r.email2) })).filter((r) => r.firstName || r.lastName);
      if (!list.length) throw new Error('In der Datei wurden keine Mitglieder gefunden.');
      const pool = db.members.filter((m) => m.source === 'import' || m.id === admin.id);
      const used = new Set();
      const plan = { neu: [], geaendert: [], gleich: 0, weg: [], ohneMail: 0, zeilen: list.length };
      const matches = list.map((r) => {
        const hit = pool.find((m) => !used.has(m.id) && r.memberNo && m.memberNo === r.memberNo && m.source === 'import')
          || pool.find((m) => !used.has(m.id) && r.email && [norm(m.email), norm(m.email2)].includes(r.email))
          || pool.find((m) => !used.has(m.id) && nameKey(m.firstName, m.lastName) === nameKey(r.firstName, r.lastName));
        if (hit) used.add(hit.id);
        if (!r.email) plan.ohneMail += 1;
        const name = `${r.firstName} ${r.lastName}`.trim();
        if (!hit) plan.neu.push(name);
        else if (hit.id !== admin.id && (hit.firstName !== r.firstName || hit.lastName !== r.lastName || norm(hit.email) !== r.email || norm(hit.email2) !== r.email2 || !hit.active)) plan.geaendert.push(name);
        else plan.gleich += 1;
        return [r, hit];
      });
      const leaving = pool.filter((m) => m.source === 'import' && m.active && !used.has(m.id));
      plan.weg = leaving.map((m) => `${m.firstName} ${m.lastName}`);
      const samples = db.members.filter((m) => /^m\d+$/.test(m.id) && m.active);
      plan.beispiele = samples.length;
      if (!apply) return plan;
      matches.forEach(([r, hit]) => {
        if (hit && hit.id === admin.id) { if (r.memberNo) hit.memberNo = r.memberNo; hit.listed = true; return; }   // eigenes Konto: Anmeldung bleibt
        if (hit) { Object.assign(hit, { memberNo: r.memberNo || hit.memberNo, firstName: r.firstName, lastName: r.lastName, email: r.email, email2: r.email2, active: true }); return; }
        db.members.push({ id: 'mi-' + uid(), memberNo: r.memberNo, firstName: r.firstName, lastName: r.lastName, email: r.email, email2: r.email2, active: true, source: 'import' });
      });
      leaving.forEach((m) => { m.active = false; });
      samples.forEach((m) => { m.active = false; });
      db.membersImportedAt = new Date().toISOString();
      if (!save(db)) throw new Error('Speichern nicht möglich – der Gerätespeicher ist voll.');
      return plan;
    },
    async memberListInfo() {
      return { imported: db.membersImportedAt ? db.members.filter((m) => m.active && (m.source === 'import' || m.listed)).length : 0, at: db.membersImportedAt || null };
    },

    // ---------- Sichern und Laden (alle Demo-Inhalte inkl. Fotos in einer Datei) ----------
    async exportAll() {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen sichern.');
      const snapshot = clone(db);
      const images = await this.images({ strict: true, database: snapshot.imageDatabase || IMG_DB });
      const data = { format: 'tfb-sicherung', version: 1, createdAt: new Date().toISOString(), db: snapshot, images };
      validatePhotos(data);
      return data;
    },
    // Add only recovered own posts and their photos; never replace the database.
    async restoreChatPosts(data, { apply = false } = {}) {
      const member = requireAdmin();
      if (data?.format !== 'tfb-chat-wiederherstellung' || data.version !== 1 || !Array.isArray(data.posts)
        || !data.posts.length || data.posts.length > 100 || !data.images || typeof data.images !== 'object') throw Error('Das ist keine Datei zur Chat-Wiederherstellung.');
      const clean = data.posts.map(p => {
        if (!p || typeof p.id !== 'string' || !p.id.startsWith('p-') || p.id.length > 160
          || typeof p.text !== 'string' || p.text.length > 20000 || !Number.isFinite(Date.parse(p.createdAt))
          || !(p.scope === 'club' || /^team:[a-z0-9-]{1,80}$/.test(p.scope))
          || !Array.isArray(p.images) || p.images.length > 6 || !Array.isArray(p.alsoTeams || [])
          || (p.alsoTeams || []).some(t => typeof t !== 'string' || !/^[a-z0-9-]{1,80}$/.test(t))) throw Error('Die Chat-Datei enthält einen ungültigen Beitrag.');
        return { id: p.id, scope: p.scope, title: String(p.title || '').slice(0, 90), text: p.text,
          createdAt: p.createdAt, ...(p.editedAt ? { editedAt: p.editedAt } : {}), authorId: member.id,
          images: p.images.slice(), alsoTeams: (p.alsoTeams || []).slice() };
      });
      if (new Set(clean.map(p => p.id)).size !== clean.length) throw Error('Die Chat-Datei enthält doppelte Beiträge.');
      const existing = new Set(db.community.posts.map(p => p.id));
      const fresh = clean.filter(p => !existing.has(p.id));
      const photos = new Map();
      fresh.forEach(p => p.images.forEach(ref => {
        if (typeof ref !== 'string' || !ref.startsWith('img:') || typeof data.images[ref] !== 'string'
          || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(data.images[ref])) throw Error('In der Chat-Datei fehlt ein Foto oder es ist beschädigt.');
        if (!photos.has(ref)) photos.set(ref, { id: 'img:' + uid(), data: data.images[ref] });
      }));
      const plan = { found: clean.length, added: fresh.length, skipped: clean.length - fresh.length, photos: photos.size };
      if (!apply || !fresh.length) return plan;
      await imageTask(imageDatabase(), 'readwrite', store => {
        photos.forEach(photo => store.put(photo.data, photo.id)); return () => null;
      });
      try {
        const next = clone(db);
        fresh.forEach(p => { if (!next.community.posts.some(old => old.id === p.id)) next.community.posts.push({ ...p, images: p.images.map(ref => photos.get(ref).id) }); });
        if (!save(next)) throw Error('Die Beiträge konnten nicht gespeichert werden. Bisherige Daten bleiben erhalten.');
        db = next;
      } catch (error) {
        await imageTask(imageDatabase(), 'readwrite', store => { photos.forEach(photo => store.delete(photo.id)); return () => null; }).catch(() => {});
        throw error;
      }
      TFB.imageRevision = (TFB.imageRevision || 0) + 1;
      document.dispatchEvent(new Event('tfb-chat-updated'));
      return plan;
    },
    async importAll(data) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Sicherungen laden.');
      if (!data || data.format !== 'tfb-sicherung' || data.version !== 1 || !data.db || !Array.isArray(data.db.members)
        || !Array.isArray(data.db.accounts) || !data.db.site?.pages || !data.db.catalog) throw new Error('Das ist keine vollständige TFB-Sicherung.');
      validatePhotos(data);
      const next = clone(data.db);
      // Stage in a new database. The single localStorage write is the activation point;
      // interrupted or failed imports cannot erase the previously active image database.
      next.imageDatabase = IMG_DB + '-restore-' + uid();
      try {
        await imageTask(next.imageDatabase, 'readwrite', store => {
          Object.entries(data.images).forEach(([id, url]) => store.put(url, id));
          return () => null;
        });
        if (!save(next)) throw new Error('Laden nicht möglich – der Gerätespeicher ist voll. Der bisherige Stand bleibt erhalten.');
      } catch (err) {
        try { indexedDB.deleteDatabase(next.imageDatabase); } catch (_) {}
        throw err;
      }
      db = next;
      TFB.imageRevision = (TFB.imageRevision || 0) + 1;
      return { photos: Object.keys(data.images || {}).length };
    },

    async acceptConsent() {
      const member = requireMember();
      const account = accountOf(member.id);
      account.consentVersion = cfg.consentVersion;
      account.consentedAt = new Date().toISOString();
      save(db);
      return publicMember(member);
    },

    // Profilbild: kleines rundes Bild plus großes Original für die Vergrößerung
    // (beides bereits im Browser verkleinert, als data-URL); null entfernt beide.
    async setAvatar(small, large = null) {
      const member = requireMember();
      const ok = (url, max) => /^data:image\/(jpeg|png|webp);base64,/.test(url) && url.length <= max;
      if (small && (!ok(small, 400000) || (large && !ok(large, 2500000)))) {
        throw new Error('Dieses Bild lässt sich nicht verwenden.');
      }
      const account = accountOf(member.id);
      const before = clone(account);
      account.avatar = small || null;
      account.avatarLarge = small ? (large || small) : null;
      account.avatarRevision = (account.avatarRevision || 0) + 1;
      account.photoPublic = false;
      account.photoPending = null;
      if (!save(db)) {
        Object.assign(account, before);
        throw new Error('Das Bild ist zu groß für den Demo-Speicher.');
      }
      return publicMember(member);
    },

    async setPhotoPermissions({ publicAvatar, events, parentName, parentEmail }) {
      const member = requireMember();
      const account = accountOf(member.id);
      const before = clone(account);
      const wantedPublic = Boolean(publicAvatar && account.avatar);
      if (photoMinor(member)) {
        const needsApproval = (account.avatar && !photoAllowed(member, 'members'))
          || (wantedPublic && !photoAllowed(member, 'public')) || (events && !photoAllowed(member, 'events'));
        if (needsApproval && (!String(parentName || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(parentEmail || '').trim()))) {
          throw new Error('Bitte Name und E-Mail einer sorgeberechtigten Person ergänzen.');
        }
        account.photoPending = needsApproval ? { parentName: String(parentName).trim(), parentEmail: norm(parentEmail),
          scopes: [...(account.avatar ? ['members'] : []), ...(wantedPublic ? ['public'] : []), ...(events ? ['events'] : [])],
          revision: account.avatarRevision || 0, version: PHOTO_VERSION, requestedAt: new Date().toISOString() } : null;
      }
      account.photoPublic = wantedPublic;
      account.photoEvents = Boolean(events);
      account.photoConsentAt = new Date().toISOString();
      account.photoConsentVersion = PHOTO_VERSION;
      if (!save(db)) { Object.assign(account, before); throw new Error('Speichern nicht möglich.'); }
      return publicMember(member);
    },
    async photoRequests() {
      requireAdmin();
      return db.members.filter((m) => m.active && accountOf(m.id) && (accountOf(m.id).photoPending || accountOf(m.id).photoApproval || accountOf(m.id).avatar || accountOf(m.id).photoConsentVersion))
        .map((m) => ({ id: m.id, firstName: m.firstName, lastName: m.lastName, photoMinor: photoMinor(m), ...photoState(m) }));
    },
    async reviewPhotoRequest(memberId, approve, acknowledged = false) {
      const reviewer = requireAdmin();
      const member = db.members.find((m) => m.id === memberId && m.active);
      const account = member && accountOf(memberId);
      if (!account) throw new Error('Mitglied nicht gefunden.');
      const before = clone(account);
      if (approve) {
        if (!acknowledged || !account.photoPending) throw new Error('Bitte die vorliegende Elternzustimmung bestätigen.');
        if (account.photoPending.revision !== (account.avatarRevision || 0)) throw new Error('Das Foto wurde inzwischen geändert.');
        account.photoApproval = { ...clone(account.photoPending), confirmedAt: new Date().toISOString(), confirmedBy: reviewer.id };
        account.photoPending = null;
      } else {
        account.photoApproval = null;
        account.photoPending = null;
        account.photoPublic = false;
        account.photoEvents = false;
      }
      if (!save(db)) { Object.assign(account, before); throw new Error('Speichern nicht möglich.'); }
      return true;
    },
    async searchBoardMembers(query) {
      requireAdmin();
      const q = norm(query);
      if (q.length < 2) return [];
      return db.members.filter((m) => m.active && (norm(`${m.firstName} ${m.lastName}`).includes(q) || norm(m.email).includes(q)))
        .slice(0, 30).map((m) => ({ id: m.id, firstName: m.firstName, lastName: m.lastName,
          email: m.email, memberNo: m.memberNo, avatar: photoAllowed(m, 'members') ? (accountOf(m.id) || {}).avatar || null : null,
          publicPhoto: photoAllowed(m, 'public') }));
    },
    async boardMembers(ids) {
      requireAdmin();
      return db.members.filter((m) => m.active && ids.includes(m.id)).map((m) => ({ id: m.id,
        firstName: m.firstName, lastName: m.lastName, email: m.email,
        avatarRevision: (accountOf(m.id) || {}).avatarRevision || 0,
        avatarLarge: photoAllowed(m, 'members') ? (accountOf(m.id) || {}).avatarLarge || (accountOf(m.id) || {}).avatar || null : null,
        avatar: photoAllowed(m, 'members') ? (accountOf(m.id) || {}).avatar || null : null }));
    },
    async boardPeople() {
      const block = ((db.site.pages.verein || {}).blocks || []).find((b) => b.id === 'v-vorstand');
      return (block && block.people || []).map((p) => {
        const member = p.memberId && db.members.find((m) => m.id === p.memberId && m.active);
        if (p.memberId && !member) return { role: p.role, name: 'Nicht besetzt', avatar: null };
        const account = member && photoAllowed(member, 'public') ? accountOf(member.id) || {} : {};
        const source = member ? `member:${member.id}:${account.avatarRevision || 0}` : p.image;
        const avatar = member ? account.avatar || null : (TFB.boardPhotoPreviews || {})[p.image] || p.image || null;
        const cropped = avatar && p.photoCrop && p.photoCrop.source === source ? p.photoCrop.image : null;
        return { role: p.role, name: member ? `${member.firstName} ${member.lastName}` : p.name,
          email: p.publishEmail ? (member ? member.email : p.email || '') : '',
          phone: p.publishPhone ? p.phone || '' : '',
          avatar: cropped || avatar,
          avatarLarge: member ? (account.avatar && (account.avatarLarge || account.avatar)) || null : p.image || null };
      });
    },

    // ---------- Mitgliedersuche (für „Verabreden“) ----------
    // Sucht in Vor-/Nachname und im Namensteil der E-Mail – gibt aber nur Namen zurück.
    async searchMembers(query) {
      requireMember();
      const q = norm(query).replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (q.length < 2) return [];
      return db.members
        .filter((m) => m.active)
        .filter((m) => {
          const local = norm(m.email).split('@')[0].replace(/[._-]+/g, ' ');
          const name = norm(`${m.firstName} ${m.lastName}`);
          return name.includes(q) || local.includes(q) || norm(m.lastName).startsWith(q);
        })
        .slice(0, 8)
        .map((m) => { const acc = accountOf(m.id); return { id: m.id, firstName: m.firstName, lastName: m.lastName, openInvites: !(acc && acc.openInvites === false) }; });
    },
    async memberNames(ids) {
      requireMember();
      return Object.fromEntries(db.members.filter((m) => ids.includes(m.id)).map((m) => [m.id, `${m.firstName} ${m.lastName}`]));
    },
    // Kleine Profilbilder (nur von Mitgliedern, die eins hochgeladen haben).
    async memberAvatars(ids) {
      requireMember();
      return Object.fromEntries(db.members.filter((m) => ids.includes(m.id) && photoAllowed(m, 'members')).map((m) => [m.id, accountOf(m.id).avatar]));
    },
    async allMemberIds() {
      requireMember();
      return db.members.filter((m) => m.active).map((m) => m.id);
    },

    // ---------- Website ----------
    async site() {
      const site = clone(db.site || TFB.siteSeed);
      const member = db.members.find((m) => m.id === sessionMemberId() && m.active);
      if (!member || !member.isAdmin) {
        for (const page of Object.values(site.pages)) {
          for (const block of page.blocks || []) {
            for (const person of block.people || []) delete person.photoCrop;
          }
        }
      }
      return site;
    },

    async saveSite(site) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen die Seiten ändern.');
      if (!site || !site.pages) throw new Error('Ungültige Seiteninhalte.');
      for (const page of Object.values(site.pages)) {
        for (const block of page.blocks || []) {
          if (['post', 'feature', 'gallery', 'collage'].includes(block.type) && block.images != null
            && (!Array.isArray(block.images) || block.images.length > 100)) throw new Error('Eine Fotokollage kann höchstens 100 Bilder enthalten.');
        }
      }
      if ((site.pages.home?.blocks || []).filter((b) => b.type === 'feature').length > 10) throw new Error('Die Startseite zeigt höchstens 10 Themen.');
      for (const block of site.pages.home?.blocks || []) {
        if (block.album && (!Array.isArray(block.album.images || []) || (block.album.images || []).length > 100)) throw new Error('Eine Fotokollage kann höchstens 100 Bilder enthalten.');
      }
      const before = db.site;
      db.site = clone(site);
      if (!save(db)) { db.site = before; throw new Error('Speichern nicht möglich – der Gerätespeicher ist voll.'); }
      return clone(db.site);
    },

    async setPhotoFrame(ref, frame) {
      if (!requireMember().isAdmin) throw new Error('Nur Admins dürfen Fotoausschnitte ändern.');
      if (!/^(img:|assets\/)/.test(ref || '')) throw new Error('Ungültiges Foto.');
      const normalized = frame === null ? null : TFB.photoFrame.normalize(frame);
      if (frame !== null && !normalized) throw new Error('Ungültiger Bildausschnitt.');
      const before = db.site;
      db.site = clone(db.site);
      db.site.photoFrames = { ...(db.site.photoFrames || {}) };
      if (normalized) db.site.photoFrames[ref] = normalized;
      else delete db.site.photoFrames[ref];
      if (!save(db)) { db.site = before; throw new Error('Fotoausschnitt konnte nicht gespeichert werden.'); }
      return clone(db.site.photoFrames);
    },

    // Foto ablegen (bereits verkleinert, data-URL) → Kennung "img:<id>"
    async putImage(dataUrl) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Fotos hochladen.');
      if (!/^data:image\/(jpeg|png|webp);base64,/.test(dataUrl)) throw new Error('Dieses Bild lässt sich nicht verwenden.');
      const id = 'img:' + uid();
      await done((await imgStore('readwrite')).put(dataUrl, id));
      return id;
    },

    // PDF ablegen (z. B. Flyer zu einem Termin) → Kennung "doc:<id>"; höchstens ca. 10 MB
    async putFile(dataUrl) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Dateien hochladen.');
      if (!/^data:application\/pdf;base64,/.test(dataUrl)) throw new Error('Bitte ein PDF wählen.');
      if (dataUrl.length > 14000000) throw new Error('Das PDF ist zu groß (höchstens etwa 10 MB).');
      const id = 'doc:' + uid();
      await done((await imgStore('readwrite')).put(dataUrl, id));
      return id;
    },

    // Alle abgelegten Fotos als { "img:<id>": dataUrl } (für die Anzeige)
    async images({ strict = false, database = imageDatabase() } = {}) {
      // Manche Browser beantworten den Bildspeicher bei lokal geöffneten Dateien nie –
      // dann nach kurzer Zeit ohne Fotos weitermachen statt hängen zu bleiben.
      const read = imageTask(database, 'readonly', store => {
        const keys = store.getAllKeys(), values = store.getAll();
        return () => Object.fromEntries(keys.result.map((k, i) => [k, values.result[i]]));
      });
      if (strict) return read;
      let timer;
      const timeout = new Promise(resolve => { timer = setTimeout(() => resolve({}), 1500); });
      try { return await Promise.race([read, timeout]); } catch (_) { return {}; }
      finally { clearTimeout(timer); }
    },

    async catalog() {
      return clone(db.catalog);
    },

    // Admin: ganzes Sortiment speichern (Reihenfolge der Arrays = Anzeige-Reihenfolge).
    async saveCatalog(catalog) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen das Sortiment ändern.');
      const sections = (catalog.sections || []).map((x) => ({
        id: String(x.id), title: String(x.title || '').trim().slice(0, 40),
        note: String(x.note || '').trim().slice(0, 120), status: x.status === 'soon' ? 'soon' : 'open',
      }));
      if (sections.some((x) => !x.id || !x.title)) throw new Error('Jeder Bereich braucht einen Namen.');
      const ids = new Set(sections.map((x) => x.id));
      const products = (catalog.products || []).map((p) => ({
        id: String(p.id), section: String(p.section), name: String(p.name || '').trim().slice(0, 40),
        detail: String(p.detail || '').trim().slice(0, 80), price: Math.round(Number(p.price)),
        art: String(p.art || 'bottle'), color: /^#[0-9a-f]{6}$/i.test(p.color) ? p.color : '#C4553A', active: p.active !== false,
      }));
      for (const p of products) {
        if (!p.name) throw new Error('Jeder Artikel braucht einen Namen.');
        if (!ids.has(p.section)) throw new Error(`„${p.name}“ hat keinen gültigen Bereich.`);
        if (!Number.isFinite(p.price) || p.price < 0 || p.price > 50000) throw new Error(`Preis von „${p.name}“ ist ungültig.`);
      }
      db.catalog = { sections, products };
      save(db);
      return clone(db.catalog);
    },

    // Striche auf den eigenen Bierdeckel setzen. Preis kommt immer aus dem Katalog.
    async addToTab(productId, quantity = 1) {
      const member = requireMember();
      if (!publicMember(member).hasConsent) throw new Error('Bitte zuerst der Kioskordnung zustimmen.');
      const product = db.catalog.products.find((p) => p.id === productId && p.active);
      const section = product && db.catalog.sections.find((x) => x.id === product.section);
      if (!product || !section || section.status !== 'open') throw new Error('Diesen Artikel gibt es gerade nicht.');
      const qty = Math.max(1, Math.min(cfg.maxQuantity, Math.floor(Number(quantity) || 1)));
      const now = new Date();
      const created = Array.from({ length: qty }, () => makeItem(member.id, product, now));
      db.items.push(...created);
      save(db);
      await wait(80);
      return created.map((i) => i.id);
    },

    // Zurücknehmen nur kurz nach dem Eintragen und nur für eigene Striche.
    async undo(itemIds) {
      const member = requireMember();
      const limit = Date.now() - cfg.undoSeconds * 1000;
      let count = 0;
      for (const item of db.items) {
        if (!itemIds.includes(item.id) || item.memberId !== member.id || item.status !== 'open') continue;
        if (Date.parse(item.createdAt) < limit) continue;
        item.status = 'cancelled';
        count++;
      }
      save(db);
      if (!count) throw new Error('Die Rücknahme ist nicht mehr möglich.');
      return count;
    },

    // Eigener laufender Monat (privat).
    async myOpenMonth() {
      const member = requireMember();
      const key = monthKey(new Date());
      const items = db.items
        .filter((i) => i.memberId === member.id && i.status === 'open' && monthKey(new Date(i.createdAt)) === key)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return {
        month: key,
        items,
        totalCents: items.reduce((sum, i) => sum + i.priceCents, 0),
      };
    },

    // Abgeschlossene Monate (privat).
    async myStatements() {
      const member = requireMember();
      const statements = db.statements.filter((s) => s.memberId === member.id);
      // Show the existing completed-month design in the administrator's demo.
      // These examples are read-only: never persist them or alter current purchases.
      if (cfg.backend === 'demo' && member.isAdmin) {
        const current = monthKey(new Date());
        for (const [back, totalCents, itemCount] of [[1, 3480, 19], [2, 2350, 14]]) {
          const month = previousMonthKey(current, back);
          if (!statements.some(s => s.month === month)) statements.push({
            id: `demo-statement-${member.id}-${month}`, memberId: member.id,
            month, totalCents, itemCount, status: 'collected', demo: true,
          });
        }
      }
      return statements.sort((a, b) => b.month.localeCompare(a.month));
    },

    // Strichliste der letzten 7 Tage: nur Name und Anzahl je Artikel.
    // Ganze Kalendertage (Berliner Zeit): heute plus die sechs Tage davor.
    async tally() {
      requireMember();
      const firstDay = dayKey(new Date(Date.now() - (cfg.tallyDays - 1) * DAY));
      const byMember = new Map();
      // Kategorie je Artikel: Kranz (eigene Spalte, großer Betrag), Snacks, Equipment (Shop), sonst Getränke
      const catOf = (item) => {
        const p = db.catalog.products.find((x) => x.id === item.productId) || {};
        if (p.art === 'kranz' || /kranz/i.test(item.productName || '')) return 'kranz';
        if (p.section === 'snacks' || p.section === 'spezialitaeten') return 'snacks';
        if (p.section === 'spielbetrieb') return 'spielbetrieb';
        if (p.section === 'shop') return 'equipment';
        return 'drinks';
      };
      for (const item of db.items) {
        if (item.status === 'cancelled' || dayKey(new Date(item.createdAt)) < firstDay) continue;
        const row = byMember.get(item.memberId) || { counts: {}, total: 0, cats: {} };
        row.counts[item.productName] = (row.counts[item.productName] || 0) + 1;
        const c = catOf(item);
        row.cats[c] = (row.cats[c] || 0) + 1;
        row.total++;
        byMember.set(item.memberId, row);
      }
      const me = sessionMemberId();
      return [...byMember.entries()]
        .map(([memberId, row]) => {
          const m = db.members.find((x) => x.id === memberId);
          return m && { firstName: m.firstName, lastName: m.lastName, isMe: memberId === me, ...row };
        })
        .filter(Boolean)
        .sort((a, b) => a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de'));
    },

    async reloadLocalState() {
      db = load();
    },

    async resetDemo() {
      const activeImages = imageDatabase();
      try { localStorage.removeItem(STORE_KEY); } catch (_) {}
      try { indexedDB.deleteDatabase(IMG_DB); } catch (_) {}
      if (activeImages !== IMG_DB) { try { indexedDB.deleteDatabase(activeImages); } catch (_) {} }
      setSession(null);
      db = load();
    },
  };

  TFB.time = { monthKey, previousMonthKey };
})();
