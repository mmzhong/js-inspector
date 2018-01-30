import * as React from 'react';

export default class HtmlEditor extends React.Component<{}, {}> {
  container: HTMLElement;
  editor: monaco.editor.IStandaloneCodeEditor;
  componentDidMount() {
    require(['vs/editor/editor.main'], this.ready.bind(this));
  }
  ready() {
    this.editor = monaco.editor.create(this.container, {
      value: [
        '<button>Click</button>',
      ].join('\n'),
      language: 'html',
      // theme: 'hc-black',
      minimap: {
        enabled: false
      }
    });
  }
  render() {
    return (
      <div
        className="html-editor"
        ref={(container => { this.container = container!; })
      } />
    )
  }
}