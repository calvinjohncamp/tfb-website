// TFB-Kiosk – Service Worker.
// Netz zuerst, damit Änderungen sofort ankommen; ohne Netz startet die App aus dem Zwischenspeicher.
const CACHE = 'tfb-20261114-kiosk-buchungen-2';
const SHELL = [
  './assets/css/admin-signature.css?v=20261114-dating-kiosk-1',
  './assets/css/product-library.css?v=20261113-kiosk-signature',
  './assets/css/backup.css?v=20261110-unified-backup-1',
  './assets/css/pdf-viewer.css?v=20261110-pdf-return-1',
  './assets/js/pdf-viewer.js?v=20261110-pdf-return-1',
  './assets/brand/tfb-highlight-freihand-mail.png',
  './assets/js/club-gallery.js?v=20261110-gallery-complete-1',
  './assets/css/club-gallery.css?v=20261110-gallery-complete-1',
  './assets/js/member-mail-renderer.mjs?v=20261110-mail-freehand-1',
  './assets/css/member-mail.css?v=20261110-mail-freehand-1',
  './assets/js/member-mail-template.js?v=20261110-mail-freehand-1',
  './assets/js/member-mail.js?v=20261110-mail-freehand-1',
  './assets/js/search.js?v=20261110-search-pdfs-1',
  './assets/docs/tfb-platzordnung-rot.pdf?v=20261110-search-pdfs-1',
  './assets/docs/tfb-hausordnung-rot.pdf?v=20261110-search-pdfs-1',
  './assets/docs/tfb-regeln-spielbetrieb-rot.pdf?v=20261110-search-pdfs-1',
  './assets/docs/tfb-jugendkonzept-rot.pdf?v=20261110-search-pdfs-1',
  './assets/docs/tfb-platzordnung.pdf?v=20261110-platzordnung-2',
  './assets/docs/tfb-hausordnung.pdf?v=20261110-mitgliederinfos-1',
  './assets/docs/tfb-regeln-spielbetrieb.pdf?v=20261110-mitgliederinfos-1',
  './assets/docs/tfb-jugendkonzept.pdf?v=20261110-mitgliederinfos-1',

  './assets/css/kiosk-external-shop.css?v=20261110-mitgliederinfos-1',
  './assets/js/kiosk-external-shop.js?v=20261113-kiosk-signature',
  './assets/js/app.js?v=20261114-kiosk-buchungen-2',
  './assets/jako/jako-logo.png',
  './assets/jako/tfb-jako-sortiment-v2.png',
  './assets/css/bielstein-open.css?v=20261110-search-pdfs-1',
  './assets/data/bielstein-open.js?v=20261110-mitgliederinfos-1',
  './assets/js/bielstein-open.js?v=20261110-club-return-1',
  './assets/js/club-archive.js?v=20261114-home-workflow-1',
  './assets/css/club-history.css?v=20261110-mail-freehand-1',
  './assets/css/sport-rulebook.css?v=20261110-search-pdfs-1',
  './assets/js/sport-rulebook.js?v=20261110-search-pdfs-1',
  './assets/js/site.js?v=20261114-aktuell-pencil-1',
  './assets/docs/tfb-chronik-25-jahre-cover.png',
  './assets/css/statement-layout.css?v=20261109-statement-layout-1',
  './assets/docs/tfb-platzbelegung-sommer-2027-black-crail.pdf', './assets/docs/tfb-platzbelegung-sommer-2027-black-crail.pdf?v=20261109-statement-layout-1', './assets/docs/tfb-platzbelegung-sommer-2027-black-crail.jpg', './assets/docs/tfb-platzbelegung-sommer-2027-black-crail.jpg?v=20261109-statement-layout-1',
  './assets/docs/tfb-platzbelegung-sommer-2027-midnight-amber.pdf', './assets/docs/tfb-platzbelegung-sommer-2027-midnight-amber.pdf?v=20261109-statement-layout-1', './assets/docs/tfb-platzbelegung-sommer-2027-midnight-amber.jpg', './assets/docs/tfb-platzbelegung-sommer-2027-midnight-amber.jpg?v=20261109-statement-layout-1',
  './assets/data/court-plan.js', './assets/js/court-plan.js', './assets/css/court-plan.css',
  './assets/data/court-plan.js?v=20261109-statement-layout-1', './assets/js/court-plan.js?v=20261109-statement-layout-1', './assets/css/court-plan.css?v=20261109-statement-layout-1',
  './assets/shared-kiosk/20261109-shared-1/asset-base.js',
  './assets/shared-kiosk/20261109-shared-1/art.js',
  './assets/shared-kiosk/20261109-shared-1/kiosk.js?v=20261113-admin-signature',
  './assets/shared-kiosk/20261109-shared-1/billing.js?v=20261114-dating-kiosk-1',
  './assets/shared-kiosk/20261109-shared-1/standalone.css',
  './assets/shared-kiosk/20261109-shared-1/native.css',
  './assets/shared-kiosk/20261109-shared-1/fonts.css',
  './assets/shared-kiosk/20261109-shared-1/kiosk-export.js',
  './assets/shared-kiosk/20261109-shared-1/kiosk-day-image.js',
  './assets/shared-kiosk/20261109-shared-1/kiosk-domain.mjs',
  './assets/shared-kiosk/20261109-shared-1/manifest.json',
  './assets/js/club-people.js', './assets/css/club-people.css',
  './assets/js/product-library.js?v=20261113-kiosk-signature',
  './assets/css/kiosk-billing.css', './assets/js/kiosk-billing.js', './assets/js/kiosk-export.js', './assets/js/kiosk-day-image.js',
  './assets/css/club-usage.css', './assets/js/club-usage.js',
  './assets/css/member-access.css', './assets/js/app-install.js',
  './assets/css/yellow-editorial.css', './assets/brand/tfb-highlight-freihand.svg',
  './assets/js/member-directory.js?v=20261110-unified-backup-1', './assets/js/member-directory.js', './assets/js/cloud-sync.js?v=20261114-dating-kiosk-1',
  './assets/js/snapshot-zip.js', './assets/js/editorial.js?v=20261114-dating-kiosk-1',
  './assets/data/public-content.js',
  './assets/docs/tfb-mitgliedsanmeldung-muster.pdf',
  './assets/docs/tfb-mitgliedsanmeldung-muster.html', './assets/docs/tfb-mitgliedsanmeldung-muster-gelb.html', './assets/docs/tfb-mail-logo.png',
  './', './index.html', './manifest.webmanifest', './manifest.webmanifest?v=309',
  './praesentation.html',
  './assets/js/presentation-icons.js', './assets/js/presentation.js', './assets/js/presentation-bridge.js',
  './assets/icons/icon-512.png?v=305', './assets/icons/icon-192.png?v=305',
  './assets/icons/icon-maskable-512.png?v=305', './assets/icons/icon-180.png?v=305',
  './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png', './assets/icons/icon-180.png',
  './assets/brand/tfb-logo-black-crail.svg', './assets/brand/tfb-logo-midnight-amber.svg',
  './assets/css/chat-media.css', './assets/js/chat-media.js', './assets/js/chat-media.js?v=20261114-home-editor-1',
  './assets/css/home-media.css?v=20261114-news-preview-1', './assets/js/home-media.js?v=20261114-aktuell-1', './assets/js/newsroom.js?v=20261114-aktuell-1',
  './assets/css/club-archive.css?v=20261110-club-return-1', './assets/js/club-archive.js?v=20261114-home-workflow-1',
  './assets/css/brand.css', './assets/css/app.css?v=20261113-home-gallery', './assets/css/app.css?v=20261113-home-gallery',
  './assets/css/design-preview.css?v=20261110-gallery-complete-1', './assets/js/design-preview.js?v=20261113-brand-gallery-4k',
  './assets/css/partner-visibility.css', './assets/css/partner-visibility.css?v=20261109-statement-layout-1', './assets/js/partner-visibility.js?v=20261113-brand-gallery-4k', './assets/js/partner-content.js', './assets/js/partner-admin.js?v=20261110-search-pdfs-1',
  './assets/fonts/editorial/bricolage-grotesque.ttf', './assets/fonts/editorial/dm-sans.ttf',
  './assets/js/config.js', './assets/data/partners.js', './assets/data/teams.js', './assets/data/site-seed.js', './assets/js/partner-rotation.js', './assets/js/site.js?v=20261114-aktuell-pencil-1', './assets/js/meet.js?v=20261114-dating-kiosk-1', './assets/js/demo-backend.js?v=20261114-dating-kiosk-1', './assets/js/brand-data.js', './assets/js/art.js', './assets/js/app.js?v=20261114-kiosk-buchungen-2', './assets/js/app.js?v=20261114-kiosk-buchungen-2',
  './assets/icons/favicon-64.png', './assets/icons/icon-192.png',
  './assets/js/membership.js', './assets/js/membership-fees.js', './assets/js/site.js?v=20261114-aktuell-pencil-1',
  './assets/js/photo-drop.js',
  './assets/js/photo-frame.js',
  './assets/js/photo-viewer.js?v=20261113-home-gallery',
  './assets/data/legal-pages.js',
  './assets/js/member-photos.js', './assets/js/board.js', './assets/js/members-import.js?v=20261110-search-pdfs-1', './assets/js/autosave.js',
  './assets/images/leon-kaufmann.jpg',
  './assets/images/board/kai-eichmann.jpg', './assets/images/board/sebastian-manz.jpg',
  './assets/images/board/katja-kuepper.jpg', './assets/images/board/daniel-pollmann.jpg',
  './assets/images/board/thomas-heine.jpg', './assets/images/board/marco-hennes.jpg',
  './assets/images/board/katharina-pollmann.jpg',
  './assets/images/board/sebastian-manz-aufgehellt.png', './assets/images/board/marco-hennes-aufgehellt.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (/\/api\/membership(?:\/|$)|\/mitgliedschaft-bestaetigen\.html$/.test(new URL(req.url).pathname)) return;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Große Archivdateien und Teilabrufe (auch PDF-Seiten) bleiben im Browsercache.
  if (req.headers.has('Range') || new URL(req.url).pathname.includes('/assets/clubarchiv/medien/')) return;
  event.respondWith(
    // Revalidate documents and scripts so a reload sees changed consent/settings
    // even within GitHub Pages' ten-minute HTTP cache lifetime.
    fetch(req, (['document', 'script', 'style'].includes(req.destination) || new URL(req.url).pathname.endsWith('/assets/clubarchiv/bestand.json')) ? { cache: 'no-cache' } : {})
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))),
  );
});
