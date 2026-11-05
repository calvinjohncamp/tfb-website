(function () {
  const brandKey = 'tfb_brand_theme';
  const logoTest = new URLSearchParams(location.search).get('logo-test') === '1';
  let brand = 'signature';
  const normalizeBrand = value => value === 'club' ? 'club' : 'signature';
  try { if (!logoTest) brand = normalizeBrand(localStorage.getItem(brandKey)); } catch (_) {}

  function applyBrand() {
    document.documentElement.classList.toggle('tfb-logo-midnight-amber', brand === 'club');
    document.querySelectorAll('[data-action="toggle-tfb-logo"]').forEach(button => {
      button.setAttribute('aria-pressed', String(brand === 'club'));
    });
  }

  window.addEventListener('storage', event => {
    if (logoTest || (event.key !== brandKey && event.key !== null)) return;
    brand = normalizeBrand(event.newValue);
    applyBrand();
  });

  const key = 'tfb_design_world_v2';
  const worlds = ['cool', 'warm'];
  const names = ['Kühle Welt', 'Warme Welt'];
  let world = 'cool';
  const normalize = value => worlds.includes(value) ? value : 'cool';
  try { world = normalize(localStorage.getItem(key)); } catch (_) {}
  function apply() {
    document.body.classList.toggle('editorial-preview-active', world === 'cool');
    document.body.dataset.designWorld = world;
    document.querySelectorAll('[data-design-preview]').forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(world !== 'warm'));
      const index = worlds.indexOf(world);
      const label = `${names[index]} – wechseln zu: ${names[(index + 1) % worlds.length]}`;
      button.setAttribute('aria-label', label);
      button.title = label;
    });
    document.querySelectorAll('button[data-design-world]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.designWorld === world));
    });
    document.dispatchEvent(new Event('tfb-design-preview'));
    window.dispatchEvent(new Event('resize'));
  }
  document.addEventListener('click', event => {
    const choice = event.target.closest('button[data-design-world]');
    if (choice) {
      if (!TFB.ui?.state.member?.isAdmin || !worlds.includes(choice.dataset.designWorld)) return;
      world = choice.dataset.designWorld;
    } else {
      if (!event.target.closest('[data-design-preview]')) return;
      world = worlds[(worlds.indexOf(world) + 1) % worlds.length];
    }
    try { if (world !== 'cool') localStorage.setItem(key, world); else localStorage.removeItem(key); } catch (_) {}
    apply();
    document.fonts.ready.then(() => document.dispatchEvent(new Event('tfb-design-preview')));
  });
  window.addEventListener('hashchange', apply);
  window.addEventListener('storage', event => {
    if (event.key === key) { world = normalize(event.newValue); apply(); }
  });
  TFB.designPreview = { apply, buttons: () => `<div class="world-switch" role="group" aria-label="Gestaltung">${worlds.map((value, index) => `<button type="button" data-design-world="${value}" aria-pressed="${world === value}">${names[index]}</button>`).join('')}</div>` };
  TFB.designPreview.isClubBrand = () => brand === 'club';
  TFB.designPreview.toggleBrand = () => {
    brand = brand === 'club' ? 'signature' : 'club';
    try { if (!logoTest) localStorage.setItem(brandKey, brand); } catch (_) {}
    applyBrand();
  };
  applyBrand();
  apply();
})();
