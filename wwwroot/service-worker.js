self.addEventListener('install', event => {
});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', function (event) {
    console.log('fetch', event.request.url);
});