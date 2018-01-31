importScripts('../acorn/acorn.js');

import { transform, generate, execute } from './code';
import { MessageData, MessageType } from '../components/WorkerMessage';
import delay from './delay';

const logFn = generate(function(type) {
  function log(...args: any[]) {
    postMessage({
      type: "$type$",
      data: args
    })
  }
  (self as any).log = log;
}, MessageType.console);

const delayFn = delay.toString();

const timeoutFn = generate(function(timeoutStart, timeoutEnd, timeoutFinished) {
  if (!(self as any).hasHackTimeout) {
    const _setTimeout = self.setTimeout;
    self.setTimeout = (fn: (...args: any[]) => void, timeout: number): number => {
      let timerId: number;
      const fnName = fn.name || 'anonymous';
      postMessage({
        type: "$timeoutStart$",
        data: {
          name: `${fnName}()`
        }
      });
      delay();
      const _fn = function() {
        postMessage({
          type: "$timeoutEnd$",
          data: {
            name: `${fnName}()`
          }
        });
        delay();
        postMessage({
          type: "$timeoutFinished$",
          data: {
            name: `${fnName}()`
          }
        });
        fn.apply(fn);
        delay();
      }
      const args = [_fn, timeout];
      return _setTimeout.apply(self, args);
    }
    (self as any).hasHackTimeout = true;
  }
}, MessageType.timeoutStart, MessageType.timeoutEnd, MessageType.timeoutFinished);

function onMessage(e: MessageEvent): void {
  const data = e.data as MessageData;
  if (data.type === MessageType.transform) {
    const code = transform(data.value);
    const workerCode = generate(function(delayFn, logFn, timeoutFn, code) {
      "$logFn$";
      "$delayFn$";
      "$timeoutFn$";
      "$code$";
    }, delayFn, logFn, timeoutFn, code);
    execute(workerCode);
  }
}

onmessage = onMessage;