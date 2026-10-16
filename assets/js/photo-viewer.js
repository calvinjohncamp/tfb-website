// Shared fullscreen entry for standalone photos; gallery controls keep their own viewer.
(function () {
  const selector = 'img[data-photo-ref], .person-dot img, .meet-avatar img, .fpost-avatar img';
  const excluded = '.viewer, .lightbox, .photo-frame-overlay, .editor, .gallery-thumb, .image-preview, .link-chip-img, .link-card-img, .message-collage, [data-action="board-photo-open"], [data-action="hero-open"], [data-action="collage-open"], [data-action="gallery-open"], [data-action="news-gallery"], [data-action="att-open"]';
  function photo(target) {
    const img = target.closest?.(selector);
    if (!img || img.closest(excluded)) return null;
    // Preserve photo upload/crop buttons and external link previews.
    const control = img.closest('button, a');
    if (control && !control.matches('.feature-hit, .team-row, .portrait-cta, .meet-row, [data-action="post-open"]')) return null;
    return img;
  }
  let request = 0;
  async function open(event) {
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    const img = photo(event.target);
    const src = img?.getAttribute('src');
    if (!src || !TFB.ui?.openLightbox) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const ticket = ++request;
    try {
      const original = TFB.ui.api?.avatarOriginal ? await TFB.ui.api.avatarOriginal(src) : src;
      if (ticket !== request) return;
      if (!original) { TFB.ui.toast?.('Dieses Profilbild ist nicht mehr freigegeben.'); return; }
      TFB.ui.openLightbox(original, img.getAttribute('alt') || 'Profilbild');
    } catch (err) { TFB.ui.toast?.(err.message || 'Das Foto konnte nicht geladen werden.'); }
  }
  function labelPhotos() {
    document.querySelectorAll(selector).forEach(img => {
      if (!photo(img)) return;
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `${img.getAttribute('alt') || 'Foto'} in Vollbild ansehen`);
      img.setAttribute('title', 'Foto in Vollbild ansehen');
      img.classList.add('fullscreen-photo');
    });
  }
  document.addEventListener('click', open, true);
  document.addEventListener('keydown', open, true);
  new MutationObserver(labelPhotos).observe(document.body, { childList: true, subtree: true });
  labelPhotos();
})();
