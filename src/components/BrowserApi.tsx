import * as React from 'react';
import { observer } from 'mobx-react';
import AppStore from '../AppStore';

@observer
export default class WebApiList extends React.Component<{store: AppStore}, {}> {
  render() {
    const { browserApis } = this.props.store;
    return (
      <div className="browser-api visiual-container">
        <div className="title">Browser API</div>
        <div className="content">
          { browserApis.map(s => s) }
        </div>
      </div>
    )
  }
}