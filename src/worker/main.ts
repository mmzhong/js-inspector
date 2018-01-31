importScripts('../acorn/acorn.js', '../acorn/walk.js');

import { transform, generate, execute } from './code';
import { MessageData, MessageType } from '../components/WorkerMessage';
import delay from './delay';

function onMessage(e: MessageEvent): void {
  const data = e.data as MessageData;
  if (data.type === MessageType.transform) {
    const code = transform(data.value);
    const workerCode = generate(function(code, delayFn, console) {
      "$console$";
      "$delayFn$";
      "$code$";
    }, code, delay.toString(), generate(function(type) {
      const console = {
        log(...args: any[]) {
          postMessage({
            type: "$type$",
            data: args
          })
        }
      }
      console.log(); // 欺骗 rollup 以防被删
    }, MessageType.console));
    execute(workerCode);
  }
}

onmessage = onMessage;