// Bumped to v1.5 to guarantee a clean install
const CACHE_NAME = 'utility-studio-v1.5';

// Every file in your directory tree that needs to be cached for offline use
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/Assets/logo.png',
    '/Assets/master.css',
    '/Assets/hub.css',
    
    // Date Converter
    '/Projects/DateConverter/index.html',
    '/Projects/DateConverter/libs/style.css',
    '/Projects/DateConverter/libs/script.js', 
    
    // Image Tools
    '/Projects/Image-Tools/index.html',
    '/Projects/Image-Tools/libs/style.css',
    '/Projects/Image-Tools/libs/cropper.min.css',
    '/Projects/Image-Tools/libs/cropper.min.js',
    '/Projects/Image-Tools/libs/jszip.min.js',
    
    // PDF Tools
    '/Projects/PDF-Tools/index.html',
    '/Projects/PDF-Tools/libs/style.css',
    '/Projects/PDF-Tools/libs/pdf-lib.min.js',
    '/Projects/PDF-Tools/libs/pdf.min.js',
    '/Projects/PDF-Tools/libs/Sortable.min.js',
    
    // QR Tools
    '/Projects/QR-Tools/index.html',
    '/Projects/QR-Tools/libs/style.css',
    '/Projects/QR-Tools/libs/cropper.min.css',
    '/Projects/QR-Tools/libs/cropper.min.js',
    '/Projects/QR-Tools/libs/FileSaver.min.js',
    '/Projects/QR-Tools/libs/html5-qrcode.min.js',
    '/Projects/QR-Tools/libs/JsBarcode.all.min.js',
    '/Projects/QR-Tools/libs/qrcode.min.js',
    
    // Unicode Tools
    '/Projects/Uni-Tools/index.html',
    '/Projects/Uni-Tools/libs/style.css',
    '/Projects/Uni-Tools/libs/script.js',
    
    // Video Tools (Media Studio)
    '/Projects/Video-Tools/index.html',
    '/Projects/Video-Tools/libs/style.css',
    '/Projects/Video-Tools/libs/814.ffmpeg.js',
    '/Projects/Video-Tools/libs/download.js',
    '/Projects/Video-Tools/libs/ffmpeg-core.js',
    
    // Cache the heavy WASM file directly from the Cloud CDN
    'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm',
    
    '/Projects/Video-Tools/libs/ffmpeg.js',
    '/Projects/Video-Tools/libs/index.js',
    '/Projects/Video-Tools/libs/util.js'
];

// 1. Install Event: Cache all essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching offline assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 2. Activate Event: Clean up old caches if the version number changes
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. The Safe Fetch Strategy (Stops the Mobile Loop!)
self.addEventListener('fetch', event => {
    // Only intercept basic GET requests to avoid breaking iframe loading logic
    if (event.request.method !== 'GET') return;

    event.respondWith(
        // ignoreSearch: true forces the Service Worker to ignore Cloudflare's tracking tags
        caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // Serve offline file safely
            }
            // If not in cache, fetch from the live internet
            return fetch(event.request);
        })
    );
});