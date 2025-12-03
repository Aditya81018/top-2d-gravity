// CanvasSimulation.ts
import Body from "./body";
import Timer from "./timer";

export type CanvasConfig = {
  tailingFade: boolean;
  speed: number;
};

export default class CanvasSimulation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CanvasConfig;

  private timer = new Timer();
  private bodies: Body[] = [];

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.config = config;

    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  }

  // Public API
  start() {
    requestAnimationFrame(this.animate);
  }

  addBody(body: Body) {
    this.bodies.push(body);
    body.simulation = this;
  }

  setSpeed(speed: number) {
    this.config.speed = speed;
  }

  setTailingFade(enabled: boolean) {
    this.config.tailingFade = enabled;
  }

  resetTimer() {
    this.timer.reset();
  }

  getCtx() {
    return this.ctx;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get dtSeconds() {
    return (this.timer.deltaTime / 1000) * this.config.speed;
  }

  // Internal helpers
  private resizeCanvas = () => {
    // Keep track of old size to adjust body positions
    const oldWidth = this.canvas.width || window.innerWidth;
    const oldHeight = this.canvas.height || window.innerHeight;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const dx = this.canvas.width - oldWidth;
    const dy = this.canvas.height - oldHeight;

    // Shift all bodies by half the delta so they stay centered visually
    if (dx !== 0 || dy !== 0) {
      this.bodies.forEach((body) => {
        body.x += dx / 2;
        body.y += dy / 2;
      });
    }
  };

  private animate: FrameRequestCallback = (timestamp) => {
    if (!this.timer.update(timestamp)) {
      requestAnimationFrame(this.animate);
      return;
    }

    this.update();
    this.render();

    requestAnimationFrame(this.animate);
  };

  private update() {
    this.bodies.forEach((body) => body.update());

    // If you have a timeBoard, you can log here:
    document.getElementById("time")!.innerText = `${(
      this.timer.lastTimestamp / 1000
    ).toFixed(0)}s / ${this.timer.fps.toFixed(0)}fps / ${this.config.speed}x`;
  }

  private render() {
    const { tailingFade } = this.config;

    if (tailingFade) {
      // Trail fade
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = `rgba(0, 0, 0, ${
        this.timer.fps ? 2 / this.timer.fps : 0.1
      })`;
      this.ctx.fill();
      this.ctx.closePath();
    } else {
      // Clear
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.bodies.forEach((body) => body.render());
  }
}
