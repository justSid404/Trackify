self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-app-cache').then((cache) => {
      // List of resources to cache
      const urlsToCache = [
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
      ];

      // Skip caching the service worker itself
      return cache.addAll(urlsToCache)
        .catch((error) => {
          console.error('Failed to cache resources:', error);
        });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, else fetch from network
      return response || fetch(event.request).catch(() => {
        // Optionally handle errors, e.g., return a fallback response
        return new Response('Network error occurred', { status: 404 });
      });
    })
  );
});
