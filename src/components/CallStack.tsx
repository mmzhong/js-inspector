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

@observer
export default class CallStack extends React.Component<{store: AppStore}, {}> {
  render() {
    const displayStack = this.props.store.callstack;
    return (
      <div className="callstack visiual-container">
        <div className="title">CallStack</div>
        <div className="content stack">
          { displayStack.reverse().map(s => <Statement statement={s} />) }
        </div>
        <div className="looper"><img src="/arrows.png" /></div>
      </div>
    )
  }
}