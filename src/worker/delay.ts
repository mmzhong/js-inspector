export default function delay(ms = 750): void {
  const start = Date.now();
  // 不能写 `while(Date.now() - start < ms)`, 会被 rollup 移除
  while(new Date().getTime() - start < ms) {
    // noop
  }
}