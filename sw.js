// TFB-Kiosk – Service Worker.
// Netz zuerst, damit Änderungen sofort ankommen; ohne Netz startet die App aus dem Zwischenspeicher.
const CACHE = 'tfb-kiosk-v148';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './assets/css/brand.css', './assets/css/app.css',
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
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))),
  );
});
