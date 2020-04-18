// Receive message from main file
self.onmessage = function (e) {
    console.log('Receive message in web worker from main file', e.data);
    if (e.data === 'close') {
        self.close();
    } else if (e.data === 'error') {
        throw new Error('A fatal error');
    }
}

setInterval(() => {
    // Send message to main file
    self.postMessage('Hello from web worker at ' + new Date().toLocaleTimeString());
}, 5000);

// https://stackoverflow.com/questions/22168033/a-function-to-print-prototype-chain-for-a-given-object
function tracePrototypeChainOf(object) {
    var proto = object.constructor.prototype;
    var result = '';
    while (proto) {
        result += proto.constructor.name + ' -> ';
        proto = Object.getPrototypeOf(proto)
    }
    return result.substring(0, result.length - ' -> '.length);
}

// DedicatedWorkerGlobalScope -> WorkerGlobalScope -> EventTarget -> Object
console.log(tracePrototypeChainOf(self));