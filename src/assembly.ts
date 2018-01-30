import fiboJs = require('./fibonacci');
import measure = require('./measure');

const assemblyUrl = '/fibo.wasm';

declare const WebAssembly: {
  instantiate: (bytes: ArrayBuffer) => Promise<{ module: any, instance: any }>;
};

fetch(assemblyUrl).then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(({ module, instance }) => {
    const fiboAsam = instance.exports.fibo;
    // measure(() => fiboJs(43));
    // measure(() => fiboAsam(43));
  })