export = function(fn: () => any) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`time: ${end - start} ms`);
}