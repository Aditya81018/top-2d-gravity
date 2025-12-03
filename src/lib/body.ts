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

  update() {
    this.x += this.linearSpeed * Math.cos(this.direction) * this.dtSeconds;
    this.y += this.linearSpeed * Math.sin(this.direction) * this.dtSeconds;
    this.direction += this.angularSpeed * this.dtSeconds;
  }

  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  get ctx() {
    return this.simulation!.getCtx();
  }

  get dtSeconds() {
    return this.simulation!.dtSeconds;
  }
}
