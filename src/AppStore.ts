import { observable, computed } from 'mobx';

export default class AppStore {
  @observable callstack: any[] = [];
  @observable consoleOutput: string[] = [];
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