import * as React from 'react';
import { observer } from 'mobx-react';
import AppStore from '../AppStore';

@observer
export default class CallbackQueue extends React.Component<{store: AppStore}, {}> {
  render() {
    const { queue } = this.props.store;
    return (
      <div className="callback-queue visiual-container">
        <div className="title">Queue</div>
        <div className="content">
          { queue.map(q => q) }
        </div>
      </div>
    )
  }
}