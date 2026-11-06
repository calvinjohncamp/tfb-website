// Each regular partner gets one slot per round. BMW gets three, plus the Splash.
(function () {
  const key = 'tfb_partner_weighted_rotation_v2';
  const premiumId = 'bmw-kaltenbach-gruppe';
  let state;
  const assignments = new Map();

  function round(ids) {
    const regular = ids.filter(id => id !== premiumId);
    for (let i = regular.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [regular[i], regular[j]] = [regular[j], regular[i]];
    }
    if (!ids.includes(premiumId)) return regular;
    if (!regular.length) return [premiumId];
    const count = regular.length;
    for (let slot = 2; slot >= 0; slot--) {
      regular.splice(Math.floor(slot * count / 3), 0, premiumId);
    }
    return regular;
  }

  TFB.resetPartnerRotation = () => { state = undefined; assignments.clear(); };
  TFB.partnerPair = page => {
    const partners = new Map((TFB.partners || [])
      .filter(p => p.logo && p.active !== false).map(p => [p.id, p]));
    if (!partners.size) return [];
    const ids = [...partners.keys()].sort();
    const signature = ids.join('|');
    if (state?.signature !== signature) {
      const order = round(ids);
      let saved;
      try { saved = JSON.parse(sessionStorage.getItem(key)); } catch (_) {}
      const counts = sequence => sequence.slice().sort().join('|');
      state = saved?.signature === signature && Array.isArray(saved.order)
        && counts(saved.order) === counts(order) && Number.isInteger(saved.cursor)
        && saved.cursor >= 0 && saved.cursor <= order.length
        ? saved : { signature, order, cursor: Math.floor(Math.random() * order.length) };
      assignments.clear();
    }
    if (assignments.has(page)) return assignments.get(page);
    const pair = [];
    while (pair.length < Math.min(2, partners.size)) {
      if (state.cursor >= state.order.length) {
        state.order = round(ids);
        state.cursor = 0;
        // A regular-only round can end and start with the same partner.
        if (!partners.has(premiumId) && state.order[0] === pair[0]?.id) {
          [state.order[0], state.order[1]] = [state.order[1], state.order[0]];
        }
      }
      const id = state.order[state.cursor];
      if (id === pair[0]?.id) break;
      state.cursor++;
      pair.push(partners.get(id));
    }
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
    assignments.set(page, pair);
    return pair;
  };
})();
