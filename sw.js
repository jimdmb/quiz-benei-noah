// Généré par tools/deploy-site.mjs : ne pas modifier à la main.
const CACHE = "quiz-benei-noah-fc59d4954529";
const FILES = ["confidentialite.html","en/jeux.js","en/quiz.js","fonts/atkinson-hyperlegible-latin-400-normal.woff2","fonts/atkinson-hyperlegible-latin-700-normal.woff2","fonts/frank-ruhl-libre-hebrew-500-normal.woff2","fonts/frank-ruhl-libre-hebrew-700-normal.woff2","fonts/frank-ruhl-libre-latin-500-normal.woff2","fonts/frank-ruhl-libre-latin-700-normal.woff2","icon-192.png","icon.png","./","jeux/carte-fonds.js","jeux/carte.js","jeux/frise.js","jeux/jeux.css","jeux/memoire.js","jeux/mot-mystere.js","jeux/qui-suis-je.js","manifest.webmanifest","privacy.html"];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

// le cache d'abord, le réseau seulement pour ce qui n'y est pas
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
