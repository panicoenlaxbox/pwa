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
    const url = new URL(e.request.url);

    if (url.pathname.indexOf("chrome-extension") !== -1) {
        // Uncaught (in promise) TypeError: Request scheme 'chrome-extension' is unsupported at service-worker.js:41
        return;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    self.clients.matchAll({ type: "window" }).then((clients) => {
        if (clients && clients.length) {
            clients.forEach(client => {                
                const message = "You are fetching " + url.pathname + " from " + client.url;
                console.log(message);
                client.postMessage(message);
            });
        }
    });    

    // if (url.origin == location.origin && url.pathname.endsWith('dog.jpg')) {
    //     event.respondWith(fetch('/images/cat.png'));
    //     return;
    // }

    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).then(async (response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        return new Response('Ups, not found', {
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    } else if (response.status === 500) {
                        throw new Error(await response.text());
                    }
                }
                let responseClone = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(e.request, responseClone);
                });

                return response;
            });
        }).catch((err) => {
            console.log(err);
            return new Response('Ups, error in fetch event', {
                headers: { 'Content-Type': 'text/plain' }
            });;
        })
    );
});