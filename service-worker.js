const CACHE_NAME = 'utility-studio-v2.0';

// 1. Core assets to pre-cache immediately upon installation
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/Assets/master.css',
    '/Assets/logo.png',
    '/Assets/pdf.png',
    
    // Nepali Date Converter
    '/Projects/DateConverter/index.html',
    '/Projects/DateConverter/libs/script.js',

    // Image Tools
    '/Projects/Image-Tools/index.html',
    '/Projects/Image-Tools/libs/cropper.min.css',
    '/Projects/Image-Tools/libs/cropper.min.js',
    '/Projects/Image-Tools/libs/jszip.min.js',

    // PDF Tools
    '/Projects/PDF-Tools/index.html',
    '/Projects/PDF-Tools/libs/pdf-lib.min.js',
    '/Projects/PDF-Tools/libs/pdf.min.js',
    '/Projects/PDF-Tools/libs/Sortable.min.js',

    // QR & Barcode Tools
    '/Projects/QR-Tools/index.html',
    '/Projects/QR-Tools/libs/cropper.min.css',
    '/Projects/QR-Tools/libs/cropper.min.js',
    '/Projects/QR-Tools/libs/FileSaver.min.js',
    '/Projects/QR-Tools/libs/html5-qrcode.min.js',
    '/Projects/QR-Tools/libs/JsBarcode.all.min.js',
    '/Projects/QR-Tools/libs/qrcode.min.js',

    // Unicode Tools
    '/Projects/Uni-Tools/index.html',
    '/Projects/Uni-Tools/libs/mammoth.browser.min.js',
    '/Projects/Uni-Tools/libs/script.js',

    // Media Studio (Video)
    '/Projects/Video-Tools/index.html',
    '/Projects/Video-Tools/libs/814.ffmpeg.js',
    '/Projects/Video-Tools/libs/ffmpeg-core.js',
    '/Projects/Video-Tools/libs/ffmpeg-core.wasm',
    '/Projects/Video-Tools/libs/ffmpeg.js',
    '/Projects/Video-Tools/libs/index.js',
    '/Projects/Video-Tools/libs/download.js',
    '/Projects/Video-Tools/libs/util.js'
];

// INSTALL: Cache all core assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching offline assets');
                return cache.addAll(CORE_ASSETS);
            })
            .catch(err => console.error('[Service Worker] Precaching failed:', err))
    );
});

// ACTIVATE: Clean up old caches if the version number changes
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith('utility-studio')) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH: "Cache First, fallback to Network" Strategy
self.addEventListener('fetch', (event) => {
    // Ignore external APIs, browser extensions, and the UnitConverterWeb (Flutter has its own service worker)
    if (!event.request.url.startsWith(self.location.origin) || event.request.url.includes('/UnitConverterWeb/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // 1. Return the cached file if we have it (instant offline load)
            if (cachedResponse) {
                return cachedResponse;
            }

            // 2. Otherwise, fetch from the network
            return fetch(event.request).then((networkResponse) => {
                // Ensure the response is valid before caching it
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Dynamically cache new files so they work offline next time
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Optional: Return a custom offline HTML page here if network fails and it's not in cache
                console.warn('[Service Worker] Network request failed and no cache available for:', event.request.url);
            });
        })
    );
});
