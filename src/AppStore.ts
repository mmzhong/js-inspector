import { observable, computed } from 'mobx';

export default class AppStore {
  @observable callstack: any[] = [];
  @observable consoleOutput: string[] = [];
  @observable isWorkerRunning: boolean = false;
  @observable browserApis: string[] = [];
  @observable queue: string[] = [];
  @computed get isLooping() {
    return this.isWorkerRunning && this.callstack.length === 0;
  }
  pushBrowserApis(api: string) {
    this.browserApis.push(api);
  }
  popBrowserApis(api: string) {
    let hasRemoveFirst = false;
    this.browserApis = this.browserApis.filter(a => {
      if (a === api) {
        hasRemoveFirst = true;
        return false;
      }
      return hasRemoveFirst || a !== api;
    });
  }
  pushQueue(fn: string) {
    this.queue.push(fn);
  }
  shiftQueue() {
    this.queue.shift();
  }
  pushCallstack(statement: string) {
    this.callstack.push(statement);
  }
  popCallstack() {
    this.callstack.pop();
  }
  log(output: any[]) {
    this.consoleOutput.push(output.map(o => o.toString()).join(' '));
  } 
}