self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-app-cache').then((cache) => {
      return cache.addAll([
        '/',
        'service-worker.js',
        'manifest.json',
        'index.html',
        'login.html',
        'home.html',
        'error.html',
        'styles/Theme_Light.css',
        'styles/Theme_Dark.css',
        'styles/Theme_Dark-Home.css',
        'scripts/default-page-transition.js',
        'scripts/home.js',
        'scripts/login.js',
        'images/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});