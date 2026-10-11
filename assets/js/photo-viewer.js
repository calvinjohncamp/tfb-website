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
  function open(event) {
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    const img = photo(event.target);
    const src = img?.getAttribute('src');
    if (!src || !TFB.ui?.openLightbox) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    TFB.ui.openLightbox(src, img.getAttribute('alt') || 'Foto');
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
