// CanvasSimulation.ts
import Body from "./body";
import Timer from "./timer";

export type CanvasConfig = {
  tailingFade: boolean;
  tailLength: number;
  speed: number;
  absorb: boolean;
  bounded: boolean;
  metersPerPixel: number;
};

export default class CanvasSimulation {
  id: string;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: CanvasConfig;

  timer = new Timer();
  bodies: Body[] = [];

  // 💥 NEW: Set to store the IDs of bodies marked for removal after an absorption
  private bodiesToRemove: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig) {
    this.id = crypto.randomUUID();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.config = config;

    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
  }

  // Public API

  /**
   * 💥 NEW: Adds a body's ID to a set for deferred removal.
   * This is called by Body.absorbBody() to safely remove bodies
   * after the current update loop iteration is complete.
   */
  markForRemoval(id: string) {
    this.bodiesToRemove.add(id);
  }

  start() {
    requestAnimationFrame(this.animate);
  }
  // ... (other public methods like addBody, removeBody, etc. remain the same)
  addBody(...bodies: Body[]) {
    this.bodies.push(...bodies);
    bodies.forEach((body) => (body.simulation = this));
  }

  removeBody(body: Body) {
    const idx = this.bodies.indexOf(body);
    if (idx !== -1) this.bodies.splice(idx, 1);
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
    // Use a snapshot to iterate over, in case the array is modified (though it won't be in this loop)
    const snapshot = [...this.bodies];

    // 1. Run update on all bodies (this is where collision/absorption happens)
    for (const body of snapshot) {
      // Body will call this.markForRemoval(id) if it is absorbed
      body.update();
    }

    // 2. 💥 NEW: Remove bodies marked for absorption
    if (this.bodiesToRemove.size > 0) {
      this.bodies = this.bodies.filter(
        (body) => !this.bodiesToRemove.has(body.id)
      );
      this.bodiesToRemove.clear(); // Clear the set for the next frame
    }

    // If you have a timeBoard, you can log here:
    document.getElementById("time")!.innerText = `${
      this.bodies.length
    } bodies / ${(this.timer.lastTimestamp / 1000).toFixed(0)} sec / ${(
      ((this.timer.lastTimestamp / 1000) * this.config.speed) /
      60 /
      60 /
      24
    ).toFixed(0)} days / ${this.timer.fps.toFixed(0)} fps / ${
      this.config.speed
    }x`;
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bodies.forEach((body) => body.render());
  }
}
