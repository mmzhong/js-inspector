import * as React from 'react';
import JsEditor from './components/JsEditor';
import RenderIndicator from './components/RenderIndicator';
import CallStack from './components/CallStack';
import CallbackQueue from './components/CallbackQueue';
import BrowserApi from './components/BrowserApi';
import ConsoleOutput from './components/ConsoleOutput';
import HtmlEditor from './components/HtmlEditor';

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <main>
        <div className="code-area">
          <JsEditor />
          <HtmlEditor />
        </div>
        <RenderIndicator />
        <div className="display-area">
          <div className="runtime-panel">
            <CallStack />
            <div className="browser-panel">
              <ConsoleOutput />
              <BrowserApi />
            </div>
          </div>
          <CallbackQueue />
        </div>
      </main>
    )
  }
}