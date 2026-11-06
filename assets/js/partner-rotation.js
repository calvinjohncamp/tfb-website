(function () {
  const storageKey = 'tfb_partner_rotation_v3';
  const defaults = {premium: 3, partner: 3, regional: 1};
  let state;
  let assignment;

  function playlist(partners) {
    const weighted = [...partners.values()];
    const total = weighted.reduce((sum, partner) => sum + partner.weight, 0);
    // A partner can occupy at most one of the two positions on each page.
    const quotas = weighted.map(partner => Math.min(partner.weight, total - partner.weight));
    const quotaTotal = quotas.reduce((sum, quota) => sum + quota, 0);
    const multiplier = quotaTotal % 2 ? 2 : 1;
    const pairCount = quotaTotal * multiplier / 2;
    const rows = weighted.map((partner, i) => ({
      id: partner.id, quota: quotas[i] * multiplier, used: 0
    }));
    const pairs = [];
    for (let index = 0; index < pairCount; index++) {
      const remainingPairs = pairCount - index;
      const available = rows.filter(row => row.used < row.quota);
      available.sort((a, b) => {
        const urgent = row => row.quota - row.used === remainingPairs;
        const score = row => row.quota * (index + 1) - row.used * pairCount;
        return Number(urgent(b)) - Number(urgent(a)) || score(b) - score(a);
      });
      const pair = available.slice(0, 2);
      pair.forEach(row => row.used++);
      // Alternate the sides without changing the partners assigned to the page.
      if (index % 2) pair.reverse();
      pairs.push(pair.map(row => row.id));
    }
    return pairs;
  }

  TFB.resetPartnerRotation = () => { state = undefined; assignment = undefined; };
  TFB.partnerPair = visit => {
    const weights = TFB.partnerContent?.rotation || defaults;
    const partners = new Map((TFB.partners || [])
      .filter(p => p.logo && p.active !== false)
      .map(p => [p.id, { ...p, weight: weights[p.tier] || defaults[p.tier] || 1 }]));
    if (partners.size < 2) return [...partners.values()];
    const signature = [...partners.values()].map(p => p.id + ':' + p.weight).join('|');
    if (state?.signature !== signature) {
      const pairs = playlist(partners);
      let saved;
      try { saved = JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) {}
      const cursor = saved?.signature === signature && Number.isInteger(saved.cursor)
        && saved.cursor >= 0 && saved.cursor < pairs.length
        ? saved.cursor : Math.floor(Math.random() * pairs.length);
      state = { signature, pairs, cursor };
      assignment = undefined;
    }
    if (assignment?.visit === visit) return assignment.ids.map(id => partners.get(id));
    const ids = state.pairs[state.cursor];
    state.cursor = (state.cursor + 1) % state.pairs.length;
    try { sessionStorage.setItem(storageKey, JSON.stringify({signature, cursor: state.cursor})); } catch (_) {}
    assignment = { visit, ids };
    return ids.map(id => partners.get(id));
  };
})();
