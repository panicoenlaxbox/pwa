const cacheName = "v8";

self.addEventListener('install', e => {
    console.log('install');
    // self.skipWaiting();
    const preCache = async () => {
        let cache = await caches.open(cacheName);
        return cache.addAll([
            'long-task?delay=2000',
        ]);
    };
    e.waitUntil(preCache());
});

self.addEventListener('activate', e => {
    console.log('activate');
    // self.clients.claim();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            })
        ))
    );
});

self.addEventListener('fetch', function (e) {
    console.log('fetch', e.request.url);
});