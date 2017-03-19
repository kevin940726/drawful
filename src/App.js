import React, { PureComponent } from 'react';
import './App.css';

class Drawful extends PureComponent {
  state = {
    now: 0,
    history: [''],
  };

  componentDidMount() {
    const canvas = this.ref;
    this.ctx = canvas.getContext('2d');

    this.ctx.lineWidth = 3;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
  }

  handleMouseMove = (e) => {
    this.mouseX = e.pageX - this.ref.offsetLeft;
    this.mouseY = e.pageY - this.ref.offsetTop;
    
    if (this.isMouseDown) {
      this.ctx.lineTo(this.mouseX, this.mouseY);
      this.ctx.stroke();
    }
  }

  handleMouseDown = () => {
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseX, this.mouseY);
    this.isMouseDown = true;
  }

  handleMouseUp = () => {
    this.isMouseDown = false;

    this.setState(({ now, history }) => ({
      history: [...history.slice(0, now + 1), this.ref.toDataURL("image/png")],
      now: now + 1,
    }));
  }

  refCallback = (ref) => {
    this.ref = ref;
  }

  setImg = (src) => {
    const img = new Image();

    img.src = src;

    if (src) {
      img.onload = () => {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.drawImage(img, 0, 0);
      };
    } else {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    
  }

  undo = () => {
    this.setState(({ now }) => ({
      now: now - 1 || 0,
    }), () => {
      this.setImg(this.state.history[this.state.now]);
    });
  }

  redo = () => {
    this.setState(({ now, history }) => ({
      now: now >= history.length ? now : now + 1,
    }), () => {
      this.setImg(this.state.history[this.state.now]);
    });
  }

  ref = null;
  ctx = null;
  mouseX = 0;
  mouseY = 0;
  isMouseDown = false;

  render() {
    const { now, history } = this.state;

    return (
      <div>
        <button disabled={now <= 0} onClick={this.undo}>undo</button>
        <button disabled={now >= history.length - 1} onClick={this.redo}>redo</button>
        <canvas
          width={window.innerWidth}
          height={window.innerHeight}
          ref={this.refCallback}
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }
}

export default Drawful;
