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
  const CATALOG_VERSION = 9;
  const DEFAULT_CATALOG = {
    sections: [
      { id: 'alkoholfrei', title: 'Alkoholfrei', note: 'Für die Seitenwechsel', status: 'open' },
      { id: 'bier', title: 'Bier', note: 'Frisch gezapft und kalt', status: 'open' },
      { id: 'snacks', title: 'Snacks & Eis', note: '', status: 'open' },
      { id: 'shop', title: 'Vereinsshop', note: 'Bälle, Griffbänder und Vereinskleidung – bald direkt hier.', status: 'soon' },
    ],
    products: [
      { id: 'koelsch', section: 'bier', name: 'Kölsch', detail: 'Ein frisches Kölsch aus Bielstein.', price: 200, art: 'stange', color: '#E9B949' },
      { id: 'koelsch-kranz', section: 'bier', name: 'Kölsch-Kranz', detail: '10 Gläser für die ganze Runde.', price: 2000, art: 'kranz', color: '#E9B949' },
      { id: 'radler', section: 'bier', name: 'Radler', detail: 'Erfrischend und fruchtig.', price: 200, art: 'radler', color: '#7A4A1E' },
      { id: 'weissbier', section: 'bier', name: 'Weißbier', detail: 'Alkoholfrei, bayrisch herb.', price: 200, art: 'weizen', color: '#E3A33B' },
      { id: 'gerolsteiner', section: 'alkoholfrei', name: 'Gerolsteiner', detail: 'Mineralwasser Medium.', price: 200, art: 'gerolsteiner', color: '#CFE6E0' },
      { id: 'coca-cola', section: 'alkoholfrei', name: 'Coca-Cola', detail: 'Eiskalt genießen.', price: 280, art: 'cola', color: '#B7282E' },
      { id: 'fanta', section: 'alkoholfrei', name: 'Fanta Orange', detail: 'Fruchtig frisch.', price: 200, art: 'cola', color: '#F08A24' },
      { id: 'sportsfreund', section: 'alkoholfrei', name: 'Sportsfreund', detail: 'Isotonisch und alkoholfrei.', price: 200, art: 'sportsfreund', color: '#5A2A1A' },
      { id: 'malzbier', section: 'alkoholfrei', name: 'Malzbier', detail: 'Golden Malz aus Bielstein.', price: 200, art: 'malz', color: '#3B2314' },
      { id: 'red-bull', section: 'alkoholfrei', name: 'Red Bull', detail: 'Verleiht Flügel.', price: 200, art: 'redbull', color: '#1E3A8A' },
      { id: 'snickers', section: 'snacks', name: 'Snickers', detail: 'Und der Hunger ist gegessen.', price: 100, art: 'snickers', color: '#5A3825' },
      { id: 'mars', section: 'snacks', name: 'Mars', detail: '… macht mobil.', price: 100, art: 'mars', color: '#C8202F' },
      { id: 'hanuta', section: 'snacks', name: 'Hanuta', detail: 'Quadratisch, praktisch, für dich gebacken.', price: 100, art: 'wafer', color: '#1E4FA0' },
      { id: 'pringles', section: 'snacks', name: 'Pringles', detail: 'Heute schon gepoppt?', price: 300, art: 'tube', color: '#C8202F' },
      { id: 'chipsfrisch', section: 'snacks', name: 'Chipsfrisch', detail: 'Ungarisch. Oft kopiert, nie erreicht.', price: 250, art: 'bag', color: '#E07A2F' },
      { id: 'haribo', section: 'snacks', name: 'Haribo Colorado', detail: 'Süße Evergreens.', price: 250, art: 'bear', color: '#E8B22B' },
      { id: 'bockwurst', section: 'snacks', name: 'Bockwurst', detail: 'Dicke Sauerländer · Dose mit 5 Stück.', price: 1000, art: 'hotdog', color: '#B5462F' },
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
    db.catalogVersion = CATALOG_VERSION;
    save(db);
  }
  // Website-Inhalte (Home, Aktuell, Sport, Club) einmalig aus den Startinhalten anlegen.
  if (!db.site && TFB.siteSeed) {
    db.site = clone(TFB.siteSeed);
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
      const block = page && page.blocks.find((x) => x.id === u.block);
      if (block) {
        // Hochgeladenes Titelfoto auf die Unterseite verschieben (Kollage, vorne) – Startseite zeigt wieder das Motiv
        if (u.moveImageToMore && /^img:/.test(block.image || '')) {
          const imgs = ((block.more && block.more.images) || []).filter((r) => !/^ph:/.test(r));
          block.more = { ...(block.more || {}), images: [block.image, ...imgs] };
          block.image = null;
        }
        Object.assign(block, clone(u.set || {}));
        if (u.more) block.more = { ...(block.more || {}), ...clone(u.more) };
      }
      db.site.applied.push(u.id);
      changed = true;
    });
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
    const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
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
      posts: [
        { id: 'p-s1', scope: 'club', authorId: 'm13', createdAt: ago(42), images: ['ph:c1', 'ph:c2'],
          text: 'Was für ein Sonnenuntergang heute auf Platz 3! 🌅 Wer kommt morgen Abend zum lockeren Doppel? Ich bin ab 18 Uhr da.' },
        { id: 'p-s2', scope: 'club', authorId: 'm6', createdAt: ago(60 * 5), images: [],
          text: 'Großes Danke an alle, die beim Arbeitseinsatz am Samstag geholfen haben. Die Plätze sehen top aus – und das Kölsch danach hatten wir uns verdient.' },
        { id: 'p-s3', scope: 'club', authorId: 'm1', createdAt: ago(60 * 26), images: ['ph:c3', 'ph:c4', 'ph:c5', 'ph:c6'],
          text: 'Unser Damen-30-Ausflug an die Mosel – vier Tage Tennis, Wein und viel gelacht. Danke an Petra für die Organisation!' },
        { id: 'p-s4', scope: 'club', authorId: 'm4', createdAt: ago(60 * 24 * 3), images: [],
          text: 'Hat jemand eine Ballmaschine, die man mal ausleihen könnte? Meine Vorhand braucht dringend Nachhilfe 😅' },
        { id: 'p-t1', scope: 'team:herren-40-1', authorId: 'm2', createdAt: ago(60 * 9), images: ['ph:t5', 'ph:t2'],
          text: 'Auswärtssieg in Hennef! 4:2 nach den Einzeln, dann beide Doppel souverän. Jan mit einem Match-Tiebreak für die Geschichtsbücher.' },
        { id: 'p-t2', scope: 'team:herren-40-1', authorId: 'm14', createdAt: ago(60 * 24 * 4), images: [],
          text: 'Saisonvorbereitung läuft: ab sofort dienstags 19 Uhr Training auf Platz 1–2. Wer Bälle mitbringt, hat einen gut.' },
        { id: 'p-t3', scope: 'team:junioren-15-1', authorId: 'm-j1', createdAt: ago(60 * 30), images: ['ph:t3'],
          text: 'Erstes Medenspiel gewonnen!!! 🎉 Danke an unseren Trainer und an alle Eltern, die gefahren sind.' },
      ],
    };
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
  const isMinor = (m) => Boolean(m && m.birthYear && new Date().getFullYear() - m.birthYear < 18);
  const displayName = (m) => (m ? (isMinor(m) ? `${m.firstName} ${m.lastName[0]}.` : `${m.firstName} ${m.lastName}`) : 'Mitglied');
  const teamOf = (scope) => (String(scope).startsWith('team:') ? scope.slice(5) : null);
  function mayWrite(member, scope) {
    if (!member) return { ok: false, reason: 'login' };
    const team = teamOf(scope);
    if (team && !member.isAdmin && !((db.community.rosters[team] || []).includes(member.id))) return { ok: false, reason: 'team' };
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
    return { ...clone(p), author: displayName(author), avatar: (acc && acc.avatar) || null,
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
  function imgStore(mode) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('Dieser Browser kann keine Fotos speichern.'));
      const req = indexedDB.open(IMG_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore('images');
      req.onerror = () => reject(new Error('Der Bildspeicher ist nicht erreichbar.'));
      req.onsuccess = () => resolve(req.result.transaction('images', mode).objectStore('images'));
    });
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
      isMinor: isMinor(member),
      parentConsent: (account && account.parentConsent) || null,
      feedRules: Boolean(account && account.feedRules),
      teams: Object.entries((db.community && db.community.rosters) || {}).filter(([, ids]) => ids.includes(member.id)).map(([k]) => k),
    };
  }

  // ---------- Öffentliche Schnittstelle ----------
  TFB.api = {
    mode: 'demo',
    demoLogin: DEMO_LOGIN,

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
    async updateProfile({ firstName, lastName, email, phone, infoMails, openInvites }) {
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
      if (!save(db)) throw new Error('Speichern nicht möglich.');
      return publicMember(member);
    },

    // ---------- Clubgeflüster & Insider News ----------
    // Lesen: öffentlich. Schreiben: nur angemeldete Mitglieder (Insider News: gemeldete Spieler).
    async posts(scope, { withTeams = false } = {}) {
      const me = db.members.find((m) => m.id === sessionMemberId());
      return db.community.posts
        .filter((p) => p.scope === scope || (withTeams && String(p.scope).startsWith('team:'))
          || (teamOf(scope) && (p.alsoTeams || []).includes(teamOf(scope))))
        .filter((p) => !p.hidden || (me && (me.isAdmin || p.authorId === me.id)))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((p) => ({ ...publicPost(p), teaser: withTeams && p.scope !== scope, fromClub: Boolean(teamOf(scope)) && p.scope === 'club' }));
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
      if (!member.isAdmin && !((db.community.rosters[team] || []).includes(member.id))) throw new Error('Das Teamfoto ändern die Spieler dieser Mannschaft.');
      db.site = db.site || clone(TFB.siteSeed);
      db.site.teams = db.site.teams || {};
      db.site.teams[team] = { posts: [], ...(db.site.teams[team] || {}), photo: ref || null };
      save(db);
      return clone(db.site);
    },
    // Mannschaftsporträt (Magazin-Seite): Admins und die Spieler der Mannschaft
    async setTeamPortrait(team, portrait) {
      const member = requireMember();
      if (!member.isAdmin && !((db.community.rosters[team] || []).includes(member.id))) throw new Error('Das Porträt pflegen die Spieler dieser Mannschaft.');
      db.site = db.site || clone(TFB.siteSeed);
      db.site.teams = db.site.teams || {};
      db.site.teams[team] = { posts: [], ...(db.site.teams[team] || {}), portrait: clone(portrait || {}) };
      if (!save(db)) throw new Error('Speichern nicht möglich – der Gerätespeicher ist voll.');
      return clone(db.site);
    },
    async teamRoster(team) {
      return (db.community.rosters[team] || []).map((id) => displayName(db.members.find((m) => m.id === id))).filter(Boolean);
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
    async addPost({ scope, text, images = [], alsoTeams = [] }) {
      const member = requireMember();
      const allowed = mayWrite(member, scope);
      if (!allowed.ok) throw new Error(allowed.reason === 'team' ? 'Insider News schreiben die Spieler dieser Mannschaft.' : 'Bitte zuerst die Hinweise bestätigen.');
      const t = String(text || '').trim();
      if (!t && !images.length) throw new Error('Bitte einen Text schreiben oder ein Foto wählen.');
      const mine = alsoTeams.filter((k) => member.isAdmin || (db.community.rosters[k] || []).includes(member.id));
      const post = { id: 'p-' + uid(), scope, authorId: member.id, createdAt: new Date().toISOString(), text: t.slice(0, 2000), images: images.slice(0, 4), ...(scope === 'club' && mine.length ? { alsoTeams: mine } : {}) };
      db.community.posts.push(post);
      if (!save(db)) throw new Error('Speichern nicht möglich.');
      return publicPost(post);
    },
    async editPost(id, { text, images, alsoTeams }) {
      const member = requireMember();
      const p = db.community.posts.find((x) => x.id === id);
      if (!p || (p.authorId !== member.id && !member.isAdmin)) throw new Error('Diesen Beitrag kannst du nicht ändern.');
      Object.assign(p, { text: String(text || '').trim().slice(0, 2000), images: (images || []).slice(0, 4), editedAt: new Date().toISOString() });
      if (alsoTeams && p.scope === 'club') p.alsoTeams = alsoTeams.filter((k) => member.isAdmin || (db.community.rosters[k] || []).includes(member.id));
      save(db);
      return publicPost(p);
    },
    async deletePost(id) {
      const member = requireMember();
      const p = db.community.posts.find((x) => x.id === id);
      if (!p || (p.authorId !== member.id && !member.isAdmin)) throw new Error('Diesen Beitrag kannst du nicht löschen.');
      db.community.posts = db.community.posts.filter((x) => x.id !== id);
      save(db);
    },
    async hidePost(id, hidden = true) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Beiträge ausblenden.');
      const p = db.community.posts.find((x) => x.id === id);
      if (p) { p.hidden = hidden; save(db); }
    },
    async reportPost(id) {
      const p = db.community.posts.find((x) => x.id === id);
      if (p) { p.reports = (p.reports || 0) + 1; save(db); }
    },

    // ---------- Sichern und Laden (alle Demo-Inhalte inkl. Fotos in einer Datei) ----------
    async exportAll() {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen sichern.');
      const images = await this.images();
      return { format: 'tfb-sicherung', version: 1, createdAt: new Date().toISOString(), db: clone(db), images };
    },
    async importAll(data) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen Sicherungen laden.');
      if (!data || data.format !== 'tfb-sicherung' || !data.db || !data.db.members) throw new Error('Das ist keine TFB-Sicherung.');
      const before = db;
      db = clone(data.db);
      if (!save(db)) { db = before; throw new Error('Laden nicht möglich – der Gerätespeicher ist voll.'); }
      const store = await imgStore('readwrite');
      await done(store.clear());
      const write = await imgStore('readwrite');
      await Promise.all(Object.entries(data.images || {})
        .filter(([id, url]) => (/^img:/.test(id) && /^data:image\//.test(url)) || (/^doc:/.test(id) && /^data:application\/pdf/.test(url)))
        .map(([id, url]) => done(write.put(url, id))));
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
      const before = { avatar: account.avatar, avatarLarge: account.avatarLarge };
      account.avatar = small || null;
      account.avatarLarge = small ? (large || small) : null;
      if (!save(db)) {
        Object.assign(account, before);
        throw new Error('Das Bild ist zu groß für den Demo-Speicher.');
      }
      return publicMember(member);
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
        .map((m) => ({ id: m.id, firstName: m.firstName, lastName: m.lastName }));
    },
    async memberNames(ids) {
      requireMember();
      return Object.fromEntries(db.members.filter((m) => ids.includes(m.id)).map((m) => [m.id, `${m.firstName} ${m.lastName}`]));
    },
    // Kleine Profilbilder (nur von Mitgliedern, die eins hochgeladen haben).
    async memberAvatars(ids) {
      requireMember();
      return Object.fromEntries(db.accounts.filter((a) => ids.includes(a.memberId) && a.avatar).map((a) => [a.memberId, a.avatar]));
    },
    async allMemberIds() {
      requireMember();
      return db.members.filter((m) => m.active).map((m) => m.id);
    },

    // ---------- Website ----------
    async site() {
      return clone(db.site || TFB.siteSeed);
    },

    async saveSite(site) {
      const member = requireMember();
      if (!member.isAdmin) throw new Error('Nur Admins dürfen die Seiten ändern.');
      if (!site || !site.pages) throw new Error('Ungültige Seiteninhalte.');
      const before = db.site;
      db.site = clone(site);
      if (!save(db)) { db.site = before; throw new Error('Speichern nicht möglich – der Gerätespeicher ist voll.'); }
      return clone(db.site);
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
    async images() {
      // Manche Browser beantworten den Bildspeicher bei lokal geöffneten Dateien nie –
      // dann nach kurzer Zeit ohne Fotos weitermachen statt hängen zu bleiben.
      const read = (async () => {
        const store = await imgStore('readonly');
        const [keys, values] = await Promise.all([done(store.getAllKeys()), done(store.getAll())]);
        return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
      })();
      const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      try { return (await Promise.race([read, timeout])) || {}; } catch (_) { return {}; }
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
      return db.statements
        .filter((s) => s.memberId === member.id)
        .sort((a, b) => b.month.localeCompare(a.month));
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
        if (p.section === 'snacks') return 'snacks';
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

    async resetDemo() {
      try { localStorage.removeItem(STORE_KEY); } catch (_) {}
      try { indexedDB.deleteDatabase(IMG_DB); } catch (_) {}
      setSession(null);
      db = load();
    },
  };

  TFB.time = { monthKey, previousMonthKey };
})();
