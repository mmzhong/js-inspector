import * as React from 'react';
import JsEditor from './components/JsEditor';
import RenderIndicator from './components/RenderIndicator';
import CallStack from './components/CallStack';
import CallbackQueue from './components/CallbackQueue';
import BrowserApi from './components/BrowserApi';
import ConsoleOutput from './components/ConsoleOutput';
import HtmlEditor from './components/HtmlEditor';
import AppStore from './AppStore';
import { observer } from 'mobx-react';

@observer
export default class App extends React.Component<{store: AppStore}, {}> {
  render() {
    return (
      <main>
        <div className="code-area">
          <JsEditor store={ this.props.store }/>
          <HtmlEditor />
        </div>
        <RenderIndicator />
        <div className="display-area">
          <div className="runtime-panel">
            <CallStack store={this.props.store}/>
            <div className="browser-panel">
              <ConsoleOutput store={this.props.store} />
              <BrowserApi />
            </div>
          </div>
          <CallbackQueue />
        </div>
      </main>
    )
  }
}