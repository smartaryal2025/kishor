// EMERGENCY KILL SWITCH
// This forces the browser to delete all caches and unregister the Service Worker.

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force this new worker to take over immediately
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName); // Nuke all saved files
                })
            );
        }).then(() => {
            console.log('Unregistering Service Worker...');
            self.registration.unregister(); // Tell the Service Worker to destroy itself
        })
    );
});