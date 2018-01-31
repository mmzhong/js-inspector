/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
import * as React from 'react';
import { observer } from 'mobx-react';
import { fibonacci, gpu, worker } from '../sample-code';
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
      value: fibonacci,
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
      if (type === MessageType.console) {
        // 欺骗 rollup 的空数据
        if (data.length) {
          this.props.store.log(data);
        }
        return;
      }
      const selection = location2Selection(data.location);
      const range = location2Range(data.location);
      if (type === MessageType.executeBefore) {
        const code = this.editor.getModel().getValueInRange(range);
        this.props.store.pushCallstack(code);
        this.selections.push(selection);
      } else if (type === MessageType.executeAfter) {
        this.props.store.popCallstack();
        this.selections.pop();
      }
      if (this.selections.length) {
        this.editor.setSelection(selection);
      } else {
        this.editor.setPosition(this.editor.getPosition())
      }
    }
  }
  run() {
    this.editor.getValue();
  }
  parse() {
    const code = this.editor.getValue();
    const data: MessageData = {
      type: MessageType.transform,
      value: code
    }
    this.worker.postMessage(data);
  }
  instrument() {
    const code = this.editor.getValue();
    const data: MessageData = {
      type: MessageType.transform,
      value: code
    }
    this.worker.postMessage(data);
  }
  render() {
    return (
      <div
        className="js-editor"
        ref={(container => { this.container = container!; })}
      >
      <div className="control">
        <button onClick={ this.run.bind(this) }>Run</button>
        <button onClick={ this.parse.bind(this) }>Parse</button>
        <button onClick={ this.instrument.bind(this) }>Instrument</button>
      </div>
      </div>
    )
  }
}