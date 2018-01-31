import * as React from 'react';
import { observer } from 'mobx-react';
import AppStore from '../AppStore';

class OutputLine extends React.Component<{output: string}, {}> {
  render() {
    return (
      <div className="line">
        <span className="output-arrow">></span> { this.props.output }
      </div>
    );
  }
}

@observer
export default class ConsoleOutput extends React.Component<{store: AppStore}, {}> {
  content: HTMLElement;
  componentDidUpdate() {
    this.content.scrollTop = 10000;
  }
  render() {
    return (
      <div className="console-output visiual-container">
        <div className="title">Console</div>
        <div
          className="content"
          ref={(content => { this.content = content!; })}
        >
          { this.props.store.consoleOutput.map(o => <OutputLine output={o} />)}
        </div>
      </div>
    );
  }
}