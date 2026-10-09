// TFB-Kiosk – gezeichnete Produktbilder als Platzhalter, bis echte Fotos da sind.
// Jede Zeichnung bekommt die Produktfarbe; Linien nutzen die Textfarbe des Themas.
(function () {
  const line = 'var(--ink)';
  const glass = 'rgba(255,255,255,.55)';

  const shapes = {
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
