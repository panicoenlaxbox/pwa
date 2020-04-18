let connections = 0; // count active connections

self.addEventListener("connect", e => {
    let port = e.ports[0];
    connections++;
    port.onmessage = e => {
        port.postMessage("Hello " + e.data + " (port #" + connections + ")");
    };
    // port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter
});