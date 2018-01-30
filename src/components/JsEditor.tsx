/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
import * as React from 'react';
import { fibonacci, gpu, worker } from '../sample-code';
import { MessageData, MessageType } from './WorkerMessage';

function location2Selection(location: any): monaco.IRange {
  return {
    startColumn: location.start.column + 1,
    startLineNumber: location.start.line,
    endColumn: location.end.column + 1,
    endLineNumber: location.end.line,
  }
}

interface JsEditorProps {};
interface JsEditorState {
  callstack: any[];
}
export default class JsEditor extends React.Component<JsEditorProps, JsEditorState> {
  container: HTMLElement;
  editor: monaco.editor.IStandaloneCodeEditor;
  worker: Worker;
  constructor(props: JsEditorProps) {
    super(props);
    this.state = {
      callstack: []
    };
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
      const callstack = this.state.callstack;
      const selection = location2Selection(e.data.data.location);
      if (type === MessageType.executeBefore) {
        const code = this.editor.getModel().getValueInRange(selection);
        callstack.push(code);
        this.setState({ callstack });
      } else if (type === MessageType.executeAfter) {
        callstack.pop();
        this.setState({ callstack });
      }
      console.log(callstack);
      this.editor.setSelection(selection);
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