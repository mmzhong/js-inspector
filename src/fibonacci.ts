export = function fibo(n: number): number {
  if (n < 2) {
    return n;
  }
  return fibo(n - 1) + fibo(n - 2);
}