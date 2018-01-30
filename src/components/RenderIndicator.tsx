import * as React from 'react';

enum AnimationType {
  css,
  js
}

interface RenderIndicatorProps {
  renderType?: AnimationType;
  period?: number;
}

export default class RenderIndicator extends React.Component<RenderIndicatorProps, {}> {
  static defaultProps: Partial<RenderIndicatorProps> = {
    renderType: AnimationType.css,
    period: 1000
  };
  square: HTMLElement;
  requestAnimationId: number | null;
  constructor(props: RenderIndicatorProps) {
    super(props);
  }
  componentDidMount() {
    if (this.props.renderType === AnimationType.js) {
      this.rotateByJs();
    }
    if (this.props.renderType === AnimationType.css) {
      this.rotateByCss();
    }
  }
  rotateByJs() {
    let startTimestamp: number | null = null;
    const self = this;
    const period = this.props.period;
    function rotate(timestamp:number) {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const progress = timestamp - startTimestamp;
      const degree = progress / period! * 360 % 360;
      self.square.style.transform = `rotate(${degree}deg)`;
      self.requestAnimationId = requestAnimationFrame(rotate);
    }
    this.requestAnimationId = requestAnimationFrame(rotate);
  }
  rotateByCss() {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId);
      this.requestAnimationId = null;
    }
    this.square.classList.add('rotate');
  }
  render() {
    return (
      <div className="render-indicator">
        <div
          className="square"
          ref={ square => { this.square = square!; }}
        />
      </div>
    )
  }
}