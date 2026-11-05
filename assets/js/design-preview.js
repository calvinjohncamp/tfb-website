(function () {
  const brandKey = 'tfb_brand_theme';
  let brand = 'signature';
  const normalizeBrand = value => value === 'club' ? 'club' : 'signature';
  try { brand = normalizeBrand(localStorage.getItem(brandKey)); } catch (_) {}

  function applyBrand() {
    document.documentElement.classList.toggle('tfb-logo-midnight-amber', brand === 'club');
    document.querySelectorAll('button[data-tfb-brand]').forEach(button => {
      button.setAttribute('aria-pressed', String(brand === 'club'));
    });
  }

  function brandButton(position, content = '') {
    return `<button type="button" class="tfb-brand-button ${position}" data-tfb-brand aria-label="Farbwelt wechseln" title="Farbwelt wechseln" aria-pressed="${brand === 'club'}">${content}</button>`;
  }

  document.addEventListener('click', event => {
    if (!event.target.closest('button[data-tfb-brand]')) return;
    brand = brand === 'club' ? 'signature' : 'club';
    try { localStorage.setItem(brandKey, brand); } catch (_) {}
    applyBrand();
  });

  window.addEventListener('storage', event => {
    if (event.key !== brandKey && event.key !== null) return;
    brand = normalizeBrand(event.newValue);
    applyBrand();
  });

  const worldLabels = { cool: 'Kühle Welt', warm: 'Warme Welt', custom: 'Eigene Hintergründe' };
  let world = 'cool';
  const isAdmin = () => Boolean(TFB.ui?.state.member?.isAdmin);
  const activeWorld = () => isAdmin() ? world : 'cool';

  function apply() {
    const active = activeWorld();
    document.body.classList.toggle('editorial-preview-active', active === 'cool');
    document.body.dataset.designWorld = active;
    document.dispatchEvent(new Event('tfb-design-preview'));
    window.dispatchEvent(new Event('resize'));
  }

  function selectWorld(value) {
    if (!isAdmin() || !Object.hasOwn(worldLabels, value)) return;
    world = value;
    apply();
  }

  function buttons() {
    const active = activeWorld();
    const choices = active === 'cool' ? ['cool', 'warm'] : ['cool', 'warm', 'custom'];
    return `<div class="world-switch" role="group" aria-label="Gestaltung">${choices.map(value =>
      `<button type="button" data-design-world="${value}" aria-pressed="${active === value}">${worldLabels[value]}</button>`
    ).join('')}</div>`;
  }

  document.addEventListener('click', async event => {
    const choice = event.target.closest('button[data-design-world]');
    if (!choice || !isAdmin() || choice.dataset.designWorld === world) return;
    selectWorld(choice.dataset.designWorld);
    await TFB.ui.renderView();
    document.querySelector(`button[data-design-world="${world}"]`)?.focus({ preventScroll: true });
  });

  TFB.designPreview = { apply, buttons, brandButton, selectWorld, usesCustomBackgrounds: () => activeWorld() === 'custom' };
  applyBrand();
  apply();
})();
