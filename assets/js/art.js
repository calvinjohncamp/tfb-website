// TFB-Kiosk – gezeichnete Produktbilder als Platzhalter, bis echte Fotos da sind.
// Jede Zeichnung bekommt die Produktfarbe; Linien nutzen die Textfarbe des Themas.
(function () {
  const line = 'var(--ink)';
  const glass = 'rgba(255,255,255,.55)';

  const shapes = {
    kranz: (c) => `
      <path d="M32 3v40" stroke="${line}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="6.5" r="4" fill="none" stroke="${line}" stroke-width="3"/>
      <g opacity=".75"><rect x="13.5" y="19" width="9" height="27" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M12.5 20c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g><g opacity=".75"><rect x="27.5" y="19" width="9" height="27" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M26.5 20c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g><g opacity=".75"><rect x="41.5" y="19" width="9" height="27" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M40.5 20c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g>
      <g opacity="1"><rect x="6.5" y="25" width="9" height="29" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M5.5 26c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g><g opacity="1"><rect x="20.5" y="25" width="9" height="29" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M19.5 26c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g><g opacity="1"><rect x="34.5" y="25" width="9" height="29" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M33.5 26c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g><g opacity="1"><rect x="48.5" y="25" width="9" height="29" rx="1.5" fill="${c}" stroke="${line}" stroke-width="2.4"/><path d="M47.5 26c0-3 2-4 5.5-4s5.5 1 5.5 4z" fill="#FFFDF5" stroke="${line}" stroke-width="2.2" stroke-linejoin="round"/></g>
      <path d="M4 54c0 4 13 6 28 6s28-2 28-6" fill="none" stroke="${line}" stroke-width="3" stroke-linecap="round"/>`,
    stange: (c) => `
      <path d="M23 13h18v41a3 3 0 0 1-3 3H26a3 3 0 0 1-3-3z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M21 14c-1-5 3-8 6-7 2-3 8-3 10 0 3-1 7 2 6 7z" fill="#FFFDF5" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 20v30" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="35" cy="30" r="1.3" fill="#FFFDF5" opacity=".8"/><circle cx="33" cy="40" r="1" fill="#FFFDF5" opacity=".8"/><circle cx="36" cy="46" r="1.2" fill="#FFFDF5" opacity=".8"/>`,
    weizen: (c) => `
      <path d="M21 13h22c0 7-3 11-3 17 0 6 5 9 5 17v6a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4v-6c0-8 5-11 5-17 0-6-3-10-3-17z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M19 14c-1-6 4-9 8-8 3-3 9-3 11 0 4-1 8 3 6 8z" fill="#FFFDF5" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 20c0 4 2 7 2 10" stroke="${glass}" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    cola: (c) => `
      <path d="M28 4h8v7c0 3 5 5 5 11 0 4-3 6-3 9 0 3 4 5 4 10v13a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5V41c0-5 4-7 4-10 0-3-3-5-3-9 0-6 5-8 5-11z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M23 36c6 3 12-3 18 0" fill="none" stroke="#FFFDF5" stroke-width="3" stroke-linecap="round"/>
      <rect x="27" y="2" width="10" height="5" rx="1.5" fill="${line}"/>
      <path d="M27 17c-1 2-2 3-2 5" stroke="${glass}" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    slimcan: (c) => `
      <path d="M23 10h18v45a3 3 0 0 1-3 3H26a3 3 0 0 1-3-3z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M24 6h16l1 4H23z" fill="#D9D4CA" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M23 40l18-12v8L23 48z" fill="#E8B22B" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M27 16v14" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>`,
    wafer: (c) => `
      <g transform="rotate(-14 32 32)">
        <rect x="8" y="20" width="48" height="24" rx="3" fill="${c}" stroke="${line}" stroke-width="3"/>
        <rect x="18" y="25" width="28" height="14" rx="2" fill="#E9C38A" stroke="${line}" stroke-width="2.5"/>
        <path d="M18 30h28M18 34h28" stroke="#8A5A2B" stroke-width="2"/>
        <path d="M8 26l-3-2M8 32h-4M8 38l-3 2M56 26l3-2M56 32h4M56 38l3 2" stroke="${line}" stroke-width="2.5" stroke-linecap="round"/>
      </g>`,
    tube: (c) => `
      <path d="M20 12h24v42a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="32" cy="11" rx="12" ry="4" fill="#D9D4CA" stroke="${line}" stroke-width="3"/>
      <circle cx="32" cy="33" r="7" fill="#FFFDF5" stroke="${line}" stroke-width="2.5"/>
      <path d="M29 32h.1M35 32h.1M29.5 35.5c1.5 1.2 3.5 1.2 5 0" stroke="${line}" stroke-width="2" stroke-linecap="round" fill="none"/>`,
    bear: (c) => `
      <circle cx="23" cy="13" r="5" fill="${c}" stroke="${line}" stroke-width="3"/>
      <circle cx="41" cy="13" r="5" fill="${c}" stroke="${line}" stroke-width="3"/>
      <circle cx="32" cy="20" r="11" fill="${c}" stroke="${line}" stroke-width="3"/>
      <path d="M21 31c-6 3-6 9-2 11M43 31c6 3 6 9 2 11" fill="none" stroke="${line}" stroke-width="3" stroke-linecap="round"/>
      <path d="M20 46c0-10 5-15 12-15s12 5 12 15c0 7-5 12-12 12s-12-5-12-12z" fill="${c}" stroke="${line}" stroke-width="3"/>
      <path d="M28 18h.1M36 18h.1" stroke="${line}" stroke-width="3" stroke-linecap="round"/>
      <path d="M26 41v.1M38 41v.1" stroke="${glass}" stroke-width="4" stroke-linecap="round"/>`,
    sausage: (c) => `
      <ellipse cx="32" cy="45" rx="27" ry="9" fill="#FFFDF5" stroke="${line}" stroke-width="3"/>
      <g transform="rotate(-8 32 34)">
        <rect x="9" y="33" width="46" height="11" rx="5.5" fill="${c}" stroke="${line}" stroke-width="3"/>
        <rect x="11" y="22" width="44" height="11" rx="5.5" fill="${c}" stroke="${line}" stroke-width="3"/>
        <path d="M16 26c3-2 5 2 8 0s5 2 8 0 5 2 8 0 5 2 8 0" fill="none" stroke="#E8B22B" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M16 37h30" stroke="${glass}" stroke-width="2.5" stroke-linecap="round"/>
      </g>`,
    cone: (c) => `
      <path d="M20 28h24L32 60z" fill="#E3B26B" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M24 34l14 8M22 30l20 12M40 34l-14 8M42 30L22 42" stroke="#A8732E" stroke-width="2"/>
      <path d="M18 29c-2-9 4-17 14-17s16 8 14 17z" fill="#FFF4DD" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M20 26c4-2 8 1 12-1s8-2 12 1" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="28" cy="17" r="1.6" fill="${c}"/><circle cx="35" cy="15" r="1.6" fill="${c}"/><circle cx="38" cy="21" r="1.4" fill="${c}"/>`,
    beer: (c) => `
      <path d="M17 18h24v34a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5z" fill="${c}"/>
      <path d="M41 25h5a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6h-5" fill="none" stroke="${line}" stroke-width="3"/>
      <path d="M17 18h24v34a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5z" fill="none" stroke="${line}" stroke-width="3"/>
      <path d="M14 18c0-5 4-8 8-7 2-4 9-5 12-1 4-2 10 1 9 7-1 3-4 4-6 3H19c-3 1-5-0-5-2z" fill="#FFFDF5" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M24 28v20M31 28v20" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>`,
    bottle: (c) => `
      <path d="M27 6h10v12c0 3 6 6 6 13v24a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V31c0-7 6-10 6-13z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="21" y="34" width="22" height="14" fill="#FFFDF5" stroke="${line}" stroke-width="3"/>
      <path d="M26 6h12" stroke="${line}" stroke-width="4" stroke-linecap="round"/>
      <path d="M26 24c-2 2-2 4-2 6" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>`,
    water: (c) => `
      <path d="M26 5h12v6c4 2 7 6 7 12v31a5 5 0 0 1-5 5H24a5 5 0 0 1-5-5V23c0-6 3-10 7-12z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M19 30h26M19 44h26" stroke="${line}" stroke-width="3"/>
      <path d="M24 34v6" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>
      <rect x="25" y="3" width="14" height="5" rx="1.5" fill="${line}"/>`,
    can: (c) => `
      <path d="M19 12h26v42a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M21 8h22l2 4H19z" fill="#D9D4CA" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M19 27c9 5 17-5 26 0" fill="none" stroke="#FFFDF5" stroke-width="3"/>
      <path d="M24 33v15" stroke="${glass}" stroke-width="3" stroke-linecap="round"/>`,
    cup: (c) => `
      <path d="M13 26h32v12a14 14 0 0 1-14 14h-4a14 14 0 0 1-14-14z" fill="#FFFDF5" stroke="${line}" stroke-width="3"/>
      <path d="M45 30h3a6 6 0 0 1 0 12h-4" fill="none" stroke="${line}" stroke-width="3"/>
      <path d="M15 30h28" stroke="${c}" stroke-width="5"/>
      <path d="M8 56h42" stroke="${line}" stroke-width="3" stroke-linecap="round"/>
      <path d="M23 9c-3 4 3 6 0 11M31 7c-3 4 3 7 0 12" fill="none" stroke="${line}" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`,
    bar: (c) => `
      <g transform="rotate(-18 32 32)">
        <rect x="8" y="22" width="48" height="20" rx="3" fill="${c}" stroke="${line}" stroke-width="3"/>
        <rect x="20" y="22" width="24" height="20" fill="#E9B949" stroke="${line}" stroke-width="3"/>
        <path d="M8 26l-3-2M8 32h-4M8 38l-3 2M56 26l3-2M56 32h4M56 38l3 2" stroke="${line}" stroke-width="2.5" stroke-linecap="round"/>
      </g>`,
    bag: (c) => `
      <path d="M16 10c6 2 26 2 32 0l-2 6c3 10 3 22 0 32l2 6c-6-2-26-2-32 0l2-6c-3-10-3-22 0-32z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="32" cy="32" rx="9" ry="7" fill="#F2D06B" stroke="${line}" stroke-width="2.5"/>`,
    ball: (c) => `
      <circle cx="32" cy="32" r="21" fill="${c}" stroke="${line}" stroke-width="3"/>
      <path d="M15 19c9 6 9 20 0 26M49 19c-9 6-9 20 0 26" fill="none" stroke="#FFFDF5" stroke-width="3"/>`,
    grip: (c) => `
      <rect x="12" y="20" width="40" height="24" rx="12" fill="${c}" stroke="${line}" stroke-width="3"/>
      <path d="M22 20l-6 24M31 20l-6 24M40 20l-6 24M49 22l-5 20" stroke="${line}" stroke-width="2" opacity=".5"/>`,
    shirt: (c) => `
      <path d="M22 9l-13 8 5 10 6-3v31h24V24l6 3 5-10-13-8c-2 4-6 6-10 6s-8-2-10-6z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <text x="32" y="40" text-anchor="middle" font-size="8" font-weight="800" fill="#FFFDF5" font-family="system-ui">TFB</text>`,
    cap: (c) => `
      <path d="M12 40c0-14 9-24 20-24s20 10 20 24z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M8 40h36c6 0 12 2 14 6H8z" fill="${c}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="32" cy="15" r="2.5" fill="${line}"/>`,
  };

  // Auswahl im Admin: Schlüssel und Bezeichnung jedes Symbols.
  TFB.artKinds = [
    ['stange', 'Kölschglas'], ['kranz', 'Kölschkranz'], ['weizen', 'Weizenglas'], ['beer', 'Bierkrug'], ['bottle', 'Bierflasche'],
    ['cola', 'Cola-Flasche'], ['water', 'Wasserflasche'], ['can', 'Dose'], ['slimcan', 'Schlanke Dose'],
    ['cup', 'Tasse'], ['bar', 'Riegel'], ['wafer', 'Waffel'], ['bag', 'Chipstüte'], ['tube', 'Chipsdose'],
    ['bear', 'Gummibär'], ['sausage', 'Würstchen'], ['cone', 'Eis'], ['ball', 'Tennisball'], ['grip', 'Griffband'],
    ['shirt', 'Shirt'], ['cap', 'Cap'],
  ];

  TFB.art = function (kind, color) {
    const draw = shapes[kind] || shapes.bottle;
    return `<svg class="art" viewBox="0 0 64 64" aria-hidden="true">${draw(color || '#C8553D')}</svg>`;
  };

  // Strichliste: echte Striche, jeder fünfte quer durch das Bündel.
  // Leicht verwackelt, damit es nach Kuli auf Papier aussieht – aber stabil je Zeile.
  TFB.strokes = function (count, seedText = '') {
    let s = 0;
    for (const ch of seedText) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    const jitter = () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296 - 0.5);
    const bundles = [];
    for (let left = count; left > 0; left -= 5) {
      const n = Math.min(5, left);
      let paths = '';
      for (let i = 0; i < Math.min(n, 4); i++) {
        const x = 4 + i * 6 + jitter() * 1.4;
        paths += `<path d="M${x.toFixed(1)} ${(4 + jitter() * 1.5).toFixed(1)} L${(x + jitter() * 1.6).toFixed(1)} ${(24 + jitter() * 1.5).toFixed(1)}"/>`;
      }
      if (n === 5) paths += `<path d="M0 ${(19 + jitter() * 2).toFixed(1)} L${(28 + jitter()).toFixed(1)} ${(8 + jitter() * 2).toFixed(1)}"/>`;
      const w = n === 5 ? 30 : 4 + n * 6;
      bundles.push(`<svg class="bundle" viewBox="0 0 ${w} 28" style="width:${w}px">${paths}</svg>`);
    }
    return bundles.join('');
  };
})();
