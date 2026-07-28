/**
 * SPECTOR V2 - Service Worker for Offline PWA Support
 */

const CACHE_NAME = 'spector-v2-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/styles/main.css',
  './src/styles/components.css',
  './src/app.js',
  './src/engine/dataParser.js',
  './src/engine/sqlEngine.js',
  './src/engine/githubSync.js',
  './src/engine/piiMasker.js',
  './src/engine/tokenCounter.js',
  './src/components/header.js',
  './src/components/dropZone.js',
  './src/components/tableView.js',
  './src/components/sqlConsole.js',
  './src/components/diffViewer.js',
  './src/components/healthDashboard.js',
  './src/components/drawer.js',
  './src/components/githubModal.js',
  './src/components/piiModal.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
