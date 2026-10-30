// Généré par tools/deploy-site.mjs : ne pas modifier à la main.
const CACHE = "quiz-benei-noah-aa7e6fa3e48d";
const FILES = ["aide/carte-en.webp","aide/carte-fr.webp","aide/frise-en.webp","aide/frise-fr.webp","aide/hero-en.webp","aide/hero-fr.webp","aide/mot-mystere-en.webp","aide/mot-mystere-fr.webp","aide/qui-suis-je-en.webp","aide/qui-suis-je-fr.webp","aide/reponse-en.webp","aide/reponse-fr.webp","aider.html","confidentialite.html","en/jeux.js","en/quiz.js","fonts/atkinson-hyperlegible-latin-400-normal.woff2","fonts/atkinson-hyperlegible-latin-700-normal.woff2","fonts/frank-ruhl-libre-hebrew-500-normal.woff2","fonts/frank-ruhl-libre-hebrew-700-normal.woff2","fonts/frank-ruhl-libre-latin-500-normal.woff2","fonts/frank-ruhl-libre-latin-700-normal.woff2","help.html","icon-192.png","icon.png","./","jeux/carte-fonds.js","jeux/carte.js","jeux/frise.js","jeux/jeux.css","jeux/memoire.js","jeux/mot-mystere.js","jeux/qui-suis-je.js","manifest.webmanifest","privacy.html"];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

// le cache d'abord, le réseau seulement pour ce qui n'y est pas
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
