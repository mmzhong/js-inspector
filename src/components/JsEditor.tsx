/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
import * as React from 'react';
import { observer } from 'mobx-react';
import { fibonacci, gpu, worker, timeout } from '../sample-code';
import { MessageData, MessageType } from './WorkerMessage';
import AppStore from '../AppStore';

function location2Selection(location: any): monaco.ISelection {
  return {
    selectionStartColumn: location.start.column + 1,
    selectionStartLineNumber: location.start.line,
    positionColumn: location.end.column + 1,
    positionLineNumber: location.end.line,
  }
}

function location2Range(location: any): monaco.IRange {
  return {
    startColumn: location.start.column + 1,
    startLineNumber: location.start.line,
    endColumn: location.end.column + 1,
    endLineNumber: location.end.line,
  }
}

interface JsEditorProps {
  store: AppStore
};
interface JsEditorState {
  // callstack: any[];
}

@observer
export default class JsEditor extends React.Component<JsEditorProps, JsEditorState> {
  container: HTMLElement;
  editor: monaco.editor.IStandaloneCodeEditor;
  worker: Worker;
  selections: monaco.ISelection[] = [];
  constructor(props: JsEditorProps) {
    super(props);
    window.addEventListener('resize', () => {
      this.editor && this.editor.layout();
    });
  }
  componentDidMount() {
    require(['vs/editor/editor.main'], this.ready.bind(this));
  }
  componentWillUnmount() {
    // destory
  }
  ready() {
    this.editor = monaco.editor.create(this.container, {
      value: timeout,
      language: 'javascript',
      theme: 'hc-black',
      minimap: {
        enabled: false
      }
    });
    this.editor.focus();
    this.worker = new Worker('worker/main.js');
    this.worker.onmessage = (e) => {
      const { type, data } = e.data;
      let selection: monaco.ISelection, range, code;
      switch(type) {
        case MessageType.console:
          this.props.store.log(data);
          return;
        case MessageType.scriptBefore:
          this.props.store.isWorkerRunning = true;
          return;
        case MessageType.scriptAfter:
          // this.props.store.isWorkerRunning = false;
          return;
        case MessageType.timeoutStart:
          this.props.store.pushBrowserApis(data.name);
          return;
        case MessageType.timeoutEnd:
          this.props.store.popBrowserApis(data.name);
          this.props.store.pushQueue(data.name);
        return;
        case MessageType.timeoutFinished:
          this.props.store.shiftQueue();
        return;
        case MessageType.executeBefore:
          selection = location2Selection(data.location);
          range = location2Range(data.location);
          code = this.editor.getModel().getValueInRange(range);
          this.props.store.pushCallstack(code);
          this.selections.push(selection);
          break;
        case MessageType.executeAfter:
          selection = location2Selection(data.location);        
          this.props.store.popCallstack();
          this.selections.pop();
          break;
      }

      if (this.selections.length) {
        this.editor.setSelection(selection!);
      } else {
        this.editor.setPosition(this.editor.getPosition())
      }
    }
  }
  run() {
    const code = this.editor.getValue();
    const data: MessageData = {
      type: MessageType.transform,
      value: code
    }
    this.worker.postMessage(data);
  }
  stop() {
    this.props.store.isWorkerRunning = false;    
  }
  render() {
    return (
      <div
        className="js-editor"
        ref={(container => { this.container = container!; })}
      >
      <div className="control">
        <button onClick={ this.run.bind(this) }>Run</button>
        <button onClick={ this.stop.bind(this) }>Stop</button>
      </div>
      </div>
    )
  }
}