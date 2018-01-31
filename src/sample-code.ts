export const fibonacci = `function fibo(n) {
  if (n < 2) {
    return n;
  }
  return fibo(n - 1) + fibo(n - 2);
}
console.log(fibo(4));`;

export const gpu = `
const gpu = new GPU();
console.log(gpu)
`;

export const worker = `
const worker = new Worker('worker.js');
worker.onmessage = function(e) {
  console.log('result: ' + e.data);
}
worker.postMessage(4);
`

export const timeout = `
setTimeout(function() {
  console.log(1);
}, 2000);
`;