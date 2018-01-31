import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import AppStore from './AppStore';

ReactDOM.render(
  <App store={new AppStore()} />,
  document.getElementById('app')
);
