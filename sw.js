/* ============================================
   SERVICE WORKER - Portal PWA
   ============================================ */

const CACHE_NAME = 'portal-v1';
const STATIC_ASSETS = [
    '/portal/',
    '/portal/index.html',
    '/portal/calendar.html',
    '/portal/weather.html',
    '/portal/news.html',
    '/portal/contact.html',
    '/portal/css/style.css',
    '/portal/js/main.js',
    '/portal/js/lunar.js',
    '/portal/js/calendar.js',
    '/portal/js/weather.js',
    '/portal/js/news.js',
    '/portal/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
        .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests (always fetch fresh)
    if (url.pathname.includes('/api/') || 
        url.hostname.includes('open-meteo.com') ||
        url.hostname.includes('newsapi.org')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(request)
                    .then((networkResponse) => {
                        // Cache successful responses
                        if (networkResponse.ok && 
                            (request.destination === 'document' ||
                             request.destination === 'script' ||
                             request.destination === 'style' ||
                             request.destination === 'image')) {
                            const clone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(request, clone));
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/portal/index.html');
                        }
                    });
            })
    );
});
