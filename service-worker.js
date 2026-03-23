// Change this version number whenever you update your code to force a cache refresh
const CACHE_NAME = 'utility-studio-v1.2';

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
    
    //'/Projects/Video-Tools/libs/ffmpeg-core.wasm',
    // Cache the heavy WASM file directly from the Cloud CDN
    'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm',
    
    '/Projects/Video-Tools/libs/ffmpeg.js',
    '/Projects/Video-Tools/libs/index.js',
    '/Projects/Video-Tools/libs/util.js'
];

// Install Event: Cache all essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches if the version number changes
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Serve from cache first, fall back to network, ignore query strings
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                // Return the cached file if found (ignoring Cloudflare ? variables)
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request);
            })
    );
});