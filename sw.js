// TFB-Kiosk – Service Worker.
// Netz zuerst, damit Änderungen sofort ankommen; ohne Netz startet die App aus dem Zwischenspeicher.
const CACHE = 'tfb-kiosk-v214';
const SHELL = [
  './assets/js/member-directory.js', './assets/js/cloud-sync.js',
  './assets/data/public-content.js',
  './', './index.html', './manifest.webmanifest',
  './praesentation.html', './assets/css/focus.css', './assets/js/focus.js',
  './assets/js/presentation-icons.js', './assets/js/presentation.js', './assets/js/presentation-bridge.js',
  './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png', './assets/icons/icon-180.png',
  './assets/css/brand.css', './assets/css/app.css',
  './assets/css/design-preview.css', './assets/js/design-preview.js',
  './assets/css/partner-visibility.css', './assets/js/partner-visibility.js', './assets/js/partner-content.js', './assets/js/partner-admin.js',
  './assets/fonts/editorial/bricolage-grotesque.ttf', './assets/fonts/editorial/dm-sans.ttf',
  './assets/js/config.js', './assets/data/partners.js', './assets/data/teams.js', './assets/data/site-seed.js', './assets/js/partner-rotation.js', './assets/js/site.js', './assets/js/meet.js', './assets/js/demo-backend.js', './assets/js/brand-data.js', './assets/js/art.js', './assets/js/app.js',
  './assets/icons/favicon-64.png', './assets/icons/icon-192.png',
  './assets/js/membership.js',
  './assets/js/photo-drop.js',
  './assets/js/photo-frame.js',
  './assets/js/photo-viewer.js',
  './assets/data/legal-pages.js',
  './assets/js/member-photos.js', './assets/js/board.js', './assets/js/members-import.js', './assets/js/autosave.js',
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
  event.respondWith(
    // Revalidate documents and scripts so a reload sees changed consent/settings
    // even within GitHub Pages' ten-minute HTTP cache lifetime.
    fetch(req, ['document', 'script', 'style'].includes(req.destination) ? { cache: 'no-cache' } : {})
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))),
  );
});
