import * as React from 'react';
import { observer } from 'mobx-react';
import AppStore from '../AppStore';

class Statement extends React.Component<{statement: string}, {}> {
  render() {
    return (
      <div className="statement">{ this.props.statement }</div>
    )
  }
}

const loopingClassName = 'running';

@observer
export default class CallStack extends React.Component<{store: AppStore}, {}> {
  render() {
    const { isLooping, callstack } = this.props.store;
    return (
      <div className="callstack visiual-container">
        <div className="title">CallStack</div>
        <div className="content stack">
          { callstack.reverse().map(s => <Statement statement={s} />) }
        </div>
        <div className="looper">
          <img className={`${isLooping ? loopingClassName : ''}`} src="/arrows.png" />
        </div>
      </div>
    )
  }
}