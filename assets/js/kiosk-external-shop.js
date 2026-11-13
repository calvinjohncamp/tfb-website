// External equipment shop, separate from Club Kiosk purchases and the personal tab.
(() => {
  const url = 'https://team.jako.com/de-de/team/tennisfreunde_bielstein_e_v_/';
  const preview = 'assets/jako/tfb-jako-sortiment-v2.png';
  TFB.kioskShop = {
    async render(editing) {
      const visible = await TFB.api.site()
        .then(site => site.pages.home?.showJakoShop !== false)
        .catch(() => null);
      if (visible === null) return '';
      if (editing) {
        return `<section class="card kiosk-external-shop">
          <button type="button" class="btn" data-action="jako-shop-toggle">
            JAKO-Shop ${visible ? 'ausblenden' : 'einblenden'}
          </button>
        </section>`;
      }
      if (!visible) return '';
      return `<section class="kiosk-external-shop" aria-labelledby="jako-shop-title">
        <header class="jako-shop-head"><div><p class="jako-shop-eyebrow">Externer Online-Shop</p><h2 id="jako-shop-title">TFB Online Shop bei JAKO</h2></div><img class="jako-shop-logo" src="assets/jako/jako-logo.png" alt="JAKO" loading="lazy"></header>
        <div class="jako-shop-body"><div class="jako-shop-copy"><h3>TFB Equipment kaufen</h3><p>Bestellung und Bezahlung erfolgen im separaten JAKO-Shop. Kein Anschreiben auf deinem Bierdeckel.</p>
          <a class="history-pill jako-shop-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Zum externen JAKO Online-Shop – öffnet in einem neuen Tab">Zum JAKO Online-Shop <svg class="link-arrow" viewBox="0 0 806 1000" aria-hidden="true" focusable="false"><path transform="translate(0 755) scale(1 -1)" d="M528 -14 448 66 546 164 587 189 581 206 533 198H50V312H533L581 304L587 321L546 346L448 444L528 524L756 296V214Z"/></svg></a><span class="jako-shop-new-tab">Öffnet eine separate Website.</span>
        </div><button type="button" class="jako-shop-preview" data-action="jako-shop-preview" aria-label="Sortimentsvorschau groß ansehen"><img src="${preview}" alt="TFB-JAKO-Sortiment mit neuer TFB-Kopfzeile" loading="lazy"><span>Vorschau öffnen</span></button></div>
      </section>`;
    },
  };
  TFB.actions = TFB.actions || {};
  TFB.actions['jako-shop-toggle'] = async (button) => {
    const ui = TFB.ui;
    if (!ui.isAdmin() || (!ui.state.editMode && ui.currentView() !== 'produktbibliothek') || button.disabled) return;
    button.disabled = true;
    try {
      const site = await TFB.api.site();
      const visible = site.pages.home.showJakoShop === false;
      site.pages.home.showJakoShop = visible;
      await TFB.api.saveSite(site);
      await ui.renderView();
      ui.toast(visible ? 'JAKO-Shop eingeblendet' : 'JAKO-Shop ausgeblendet', true);
    } catch (error) {
      ui.toast(error.message);
    } finally {
      button.disabled = false;
    }
  };
  TFB.actions['jako-shop-preview'] = () => TFB.ui.openLightbox(preview, 'TFB Online Shop bei JAKO · Sortimentsvorschau');
})();
