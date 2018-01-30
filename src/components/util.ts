import md5 from '../lib/md5';

export function mine<T>(fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`mine time: ${end - start}ms`);
  return result;
}

