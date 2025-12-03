import { randomColor } from "../helpers";
import type CanvasSimulation from "./canvasSimulation";

export default class Body {
  x: number;
  y: number;
  radius: number;
  linearSpeed: number;
  angularSpeed: number;
  direction: number;
  color: string;
  simulation: CanvasSimulation | null;

  constructor(x = 50, y = 50, radius = 25, color = randomColor()) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.linearSpeed = 0;
    this.angularSpeed = 0;
    this.direction = 0;
    this.color = color;
    this.simulation = null;
  }

  update(dtSeconds: number) {
    this.x += this.linearSpeed * Math.cos(this.direction) * dtSeconds;
    this.y += this.linearSpeed * Math.sin(this.direction) * dtSeconds;
    this.direction += this.angularSpeed * dtSeconds;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
