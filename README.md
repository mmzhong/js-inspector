

## WebAssembly Tools

相同的 Fibonacci 运算，Wasm 比纯 JS 快一倍。

[WasmFiddle](https://wasdk.github.io/WasmFiddle/)
[入门](https://blog.techbridge.cc/2017/06/17/webassembly-js-future/)

## 注意事项

1. 修改了 `src/lib/escodegen.browser.js` 源文件的第 143 行，使之能用于 worker 。该文件直接 `import { generate } from 'escodegen'` 会抛语法错误，所以改用 `importScripts`。