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
  const CATALOG_VERSION = 3;
  const DEFAULT_CATALOG = {
    sections: [
      { id: 'bier', title: 'Bier', note: 'Frisch gezapft und kalt', status: 'open' },
      { id: 'alkoholfrei', title: 'Alkoholfrei', note: 'Für die Seitenwechsel', status: 'open' },
      { id: 'snacks', title: 'Snacks & Eis', note: '', status: 'open' },
      { id: 'shop', title: 'Vereinsshop', note: 'Bälle, Griffbänder und Vereinskleidung – bald direkt hier.', status: 'soon' },
    ],
    products: [
      { id: 'koelsch', section: 'bier', name: 'Kölsch', detail: 'Ein frisches Kölsch aus Bielstein.', price: 200, art: 'stange', color: '#E9B949' },
      { id: 'koelsch-kranz', section: 'bier', name: 'Kölsch-Kranz', detail: '10 Gläser für die ganze Runde.', price: 2000, art: 'kranz', color: '#E9B949' },
      { id: 'radler', section: 'bier', name: 'Radler', detail: 'Erfrischend und fruchtig.', price: 200, art: 'bottle', color: '#F0C93A' },
      { id: 'weissbier', section: 'bier', name: 'Weißbier', detail: 'Alkoholfrei, bayrisch herb.', price: 200, art: 'weizen', color: '#E3A33B' },
      { id: 'sportsfreund', section: 'alkoholfrei', name: 'Sportsfreund', detail: 'Isotonisch und alkoholfrei.', price: 200, art: 'water', color: '#5BB98B' },
      { id: 'gerolsteiner', section: 'alkoholfrei', name: 'Gerolsteiner', detail: 'Mineralwasser Medium.', price: 200, art: 'water', color: '#7FB7D9' },
      { id: 'coca-cola', section: 'alkoholfrei', name: 'Coca-Cola', detail: 'Eiskalt genießen.', price: 280, art: 'cola', color: '#B7282E' },
      { id: 'fanta', section: 'alkoholfrei', name: 'Fanta Orange', detail: 'Fruchtig frisch.', price: 200, art: 'cola', color: '#F08A24' },
      { id: 'red-bull', section: 'alkoholfrei', name: 'Red Bull', detail: 'Verleiht Flügel.', price: 200, art: 'slimcan', color: '#2E4E9E' },
      { id: 'snickers', section: 'snacks', name: 'Snickers', detail: 'Und der Hunger ist gegessen.', price: 100, art: 'bar', color: '#5A3825' },
      { id: 'mars', section: 'snacks', name: 'Mars', detail: '… macht mobil.', price: 100, art: 'bar', color: '#2B2B2B' },
      { id: 'hanuta', section: 'snacks', name: 'Hanuta', detail: 'Für dich gebacken.', price: 100, art: 'wafer', color: '#2F5D8A' },
      { id: 'pringles', section: 'snacks', name: 'Pringles', detail: 'Heute schon gepoppt?', price: 300, art: 'tube', color: '#C8202F' },
      { id: 'chipsfrisch', section: 'snacks', name: 'Chipsfrisch', detail: 'Ungarisch. Oft kopiert, nie erreicht.', price: 250, art: 'bag', color: '#E07A2F' },
      { id: 'haribo', section: 'snacks', name: 'Haribo Colorado', detail: 'Süße Evergreens.', price: 250, art: 'bear', color: '#E8B22B' },
      { id: 'bockwurst', section: 'snacks', name: 'Bockwurst', detail: 'Dicke Sauerländer · Dose mit 5 Stück.', price: 1000, art: 'sausage', color: '#B5462F' },
      { id: 'cornetto', section: 'snacks', name: 'Cornetto', detail: 'Vanille-Nuss. So schmeckt der Sommer.', price: 300, art: 'cone', color: '#D9A066' },
      { id: 'baelle', section: 'shop', name: 'Tennisbälle', detail: '4er-Dose', price: 1200, art: 'ball', color: '#D7E04B' },
      { id: 'griffband', section: 'shop', name: 'Overgrip', detail: '3er-Pack', price: 900, art: 'grip', color: '#F4F1EA' },
      { id: 'shirt', section: 'shop', name: 'Vereinsshirt', detail: 'Mit TFB-Logo', price: 2500, art: 'shirt', color: '#2A2D2E' },
      { id: 'cap', section: 'shop', name: 'Vereinscap', detail: 'Einheitsgröße', price: 1800, art: 'cap', color: '#C4553A' },
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
    db.catalogVersion = CATALOG_VERSION;
    save(db);
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
      for (const item of db.items) {
        if (item.status === 'cancelled' || dayKey(new Date(item.createdAt)) < firstDay) continue;
        const row = byMember.get(item.memberId) || { counts: {}, total: 0 };
        row.counts[item.productName] = (row.counts[item.productName] || 0) + 1;
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
      setSession(null);
      db = load();
    },
  };

  TFB.time = { monthKey, previousMonthKey };
})();
