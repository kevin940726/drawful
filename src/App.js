import React, { PureComponent } from 'react';
import { TwitterPicker } from 'react-color';
import './App.css';

class Drawful extends PureComponent {
  state = {
    now: 0,
    history: [''],
    color: '#b80000',
    size: 3,
  };

  componentDidMount() {
    const canvas = this.ref;
    this.ctx = canvas.getContext('2d');

    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
  }

  handleMouseMove = (e) => {
    if (this.isMouseDown) {
      this.ctx.lineWidth = this.state.size;
      this.ctx.strokeStyle = this.state.color;

      const mouse = {
        x: e.pageX - this.ref.offsetLeft,
        y: e.pageY - this.ref.offsetTop,
      };

      this.ctx.globalAlpha = 1;
      this.ctx.moveTo(this.mouse.x, this.mouse.y);
      this.ctx.lineTo(mouse.x, mouse.y);
      this.ctx.stroke();

      this.ctx.moveTo(this.mouse.x - 2, this.mouse.y - 2);
      this.ctx.lineTo(mouse.x - 2, mouse.y - 2);
      this.ctx.stroke();

      this.ctx.moveTo(this.mouse.x + 2, this.mouse.y + 2);
      this.ctx.lineTo(mouse.x + 2, mouse.y + 2);
      this.ctx.stroke();

      this.mouse = mouse;
    }
  }

  handleMouseDown = (e) => {
    this.ctx.beginPath();
    this.isMouseDown = true;

    this.mouse = {
      x: e.pageX - this.ref.offsetLeft,
      y: e.pageY - this.ref.offsetTop,
    }
  }

  handleMouseUp = () => {
    this.isMouseDown = false;

    this.setState(({ now, history }) => ({
      history: [...history.slice(0, now + 1), this.ref.toDataURL("image/png")],
      now: now + 1,
    }));
  }

  handleColorChange = (color) => {
    this.setState({
      color: color.hex,
    });
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

  clear = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.handleMouseUp();
  }

  handleSizeChange = (e) => {
    this.setState({
      size: +e.target.value,
    });
  }

  ref = null;
  ctx = null;
  mouse = {
    x: 0,
    y: 0,
  };
  isMouseDown = false;

  render() {
    const { now, history, color, size } = this.state;

    return (
      <div>
        <button disabled={now <= 0} onClick={this.undo}>undo</button>
        <button disabled={now >= history.length - 1} onClick={this.redo}>redo</button>
        <button onClick={this.clear}>clear</button>
        <input type="range" min="2" max="22" onChange={this.handleSizeChange} value={size} />
        <TwitterPicker
          color={color}
          onChangeComplete={this.handleColorChange}
        />
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
