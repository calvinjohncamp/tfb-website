(function () {
  const brandKey = 'tfb_brand_theme';
  let brand = 'club';
  const normalizeBrand = value => value === 'signature' ? 'signature' : 'club';
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

  function apply() {
    document.body.classList.add('editorial-preview-active');
    document.body.dataset.designWorld = 'cool';
    document.dispatchEvent(new Event('tfb-design-preview'));
    window.dispatchEvent(new Event('resize'));
  }

  TFB.designPreview = { apply, brandButton };
  applyBrand();
  apply();
})();
