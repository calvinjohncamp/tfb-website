(function () {
  function apply() {
    document.body.classList.add('editorial-preview-active');
    document.body.dataset.designWorld = 'cool';
    document.dispatchEvent(new Event('tfb-design-preview'));
    window.dispatchEvent(new Event('resize'));
  }

  TFB.designPreview = { apply };
  document.documentElement.classList.add('tfb-logo-midnight-amber');
  apply();
})();
