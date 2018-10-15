const urlsToCache = [
  // '/',
  '/bundle.js',
  // '/login',
  '/main.css',
  // '/map',
  // '/profile',
  // '/graphql',
];

// just a comment

self.addEventListener('install', (event) => {
  console.log('installing LAN...');
  event.waitUntil(
    caches.open('app-offline')
      .then(cache => cache.addAll(urlsToCache)),
  );
});

self.addEventListener('activate', (event) => {
  console.log('listening');
});

self.addEventListener('fetch', (event => event.respondWith(caches.match(event.request)
  .then(response => response || fetch(event.request)))));
