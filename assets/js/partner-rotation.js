// TFB – Partner-Rotation, übernommen aus der Padel-App (sponsor-rotation.js).
//
// Regeln wie dort:
// - Gewichtete, gleichmäßig gemischte Reihum-Liste: Premium 3 · Partner 3 · Regional 1.
// - Jede Seite bekommt zwei Partner; ein Premium-Partner steht immer links,
//   pro Paar höchstens ein Premium-Partner.
// - Innerhalb eines Besuchs kein Partner doppelt, bis alle einmal dran waren.
// - Jeder Besuch startet an einer anderen Stelle der Liste.
// Die Padel-App holt den Startpunkt vom Server; hier zählt die Sitzung im Browser.
(function () {
  const ROT_KEY = 'tfbPartnerRot';
  const SEEN_KEY = 'tfbPartnersSeenThisVisit';
  const WEIGHTS = { premium: 3, partner: 3, regional: 1 };

  let seen = {};
  try { seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) || '{}') || {}; } catch (_) {}
  let rotationIndex = 0;
  try {
    rotationIndex = parseInt(sessionStorage.getItem(ROT_KEY) || '', 10);
    if (!Number.isFinite(rotationIndex)) {
      rotationIndex = Math.floor(Math.random() * 1000);   // neuer Besuch: zufälliger Einstieg
    }
    sessionStorage.setItem(ROT_KEY, String(rotationIndex + 1));
  } catch (_) { rotationIndex = 0; }

  const key = (p) => (p ? String(p.logo || p.name).toLowerCase() : '');
  const byOrder = (a, b) => (a.sort || 0) - (b.sort || 0) || String(a.name).localeCompare(String(b.name), 'de');

  // Gleichmäßig gemischte Liste nach Gewichten (wie buildFairPlaylist in der Padel-App).
  function buildFairPlaylist(groups) {
    const active = groups
      .map((g) => ({ rows: g.rows, total: g.rows.length * g.weight, current: 0, cursor: 0 }))
      .filter((g) => g.rows.length && g.total);
    const total = active.reduce((sum, g) => sum + g.total, 0);
    const playlist = [];
    for (let slot = 0; slot < total; slot++) {
      active.forEach((g) => { g.current += g.total; });
      let chosen = active[0];
      for (let i = 1; i < active.length; i++) if (active[i].current > chosen.current) chosen = active[i];
      chosen.current -= total;
      playlist.push(chosen.rows[chosen.cursor % chosen.rows.length]);
      chosen.cursor++;
    }
    return playlist;
  }

  const all = (TFB.partners || []).filter((p) => p.logo);
  const tier = (t) => all.filter((p) => p.tier === t).sort(byOrder);
  const playlist = buildFairPlaylist([
    { rows: tier('premium'), weight: WEIGHTS.premium },
    { rows: tier('partner'), weight: WEIGHTS.partner },
    { rows: tier('regional'), weight: WEIGHTS.regional },
  ]);

  const assignments = {};
  function nextPair() {
    const pair = [];
    const used = {};
    const n = playlist.length;
    const assigned = Object.keys(assignments).length;
    const collect = (skipSeen) => {
      for (let step = 0; step < n && pair.length < 2; step++) {
        const p = playlist[(rotationIndex * 2 + assigned * 2 + step) % n];
        const k = key(p);
        if (k && (!skipSeen || !seen[k]) && !used[k] && !(p.tier === 'premium' && pair.some((x) => x.tier === 'premium'))) {
          used[k] = true;
          pair.push(p);
        }
      }
    };
    collect(true);
    if (pair.length < 2 && n) {
      // Nach dem letzten ungesehenen Partner beginnt sofort ein neuer Umlauf.
      seen = {};
      pair.forEach((p) => { seen[key(p)] = true; });
      collect(false);
    }
    pair.forEach((p) => { seen[key(p)] = true; });
    try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (_) {}
    if (pair[1] && pair[1].tier === 'premium' && !(pair[0] && pair[0].tier === 'premium')) pair.reverse();
    return pair;
  }

  // Zwei Partner für eine Seite – je Seite und Besuch fest, damit nichts springt.
  TFB.partnerPair = function (page) {
    if (!playlist.length) return [];
    if (!assignments[page]) assignments[page] = nextPair();
    return assignments[page];
  };
})();
