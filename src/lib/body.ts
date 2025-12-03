import {
  calAngle,
  calAttraction,
  calDistance,
  modifyColor,
  pickOne,
  randomColor,
} from "../helpers";
import type CanvasSimulation from "./canvasSimulation";

type TrailPoint = { x: number; y: number };

export default class Body {
  id: string;
  x: number;
  y: number;
  radius: number;
  mass: number; // kg
  linearSpeed: number;
  angularSpeed: number;
  direction: number;
  color: string;
  simulation: CanvasSimulation | null;

  // 🔥 trail data
  private trail: TrailPoint[] = [];
  private readonly maxTrailPoints = 40; // how long the trail is

  constructor(
    x = 50,
    y = 50,
    radius = 25,
    mass = 1_000_000,
    color = randomColor()
  ) {
    this.id = crypto.randomUUID();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.linearSpeed = 0;
    this.angularSpeed = 0;
    this.direction = 0;
    this.color = color;
    this.simulation = null;
  }

  update() {
    const dt = this.dtSeconds;

    const canvas = this.simulation!.canvas;

    if (
      this.x < -this.radius ||
      this.x > canvas.width + this.radius ||
      this.y < -this.radius ||
      this.y > canvas.height + this.radius
    ) {
      this.direction = calAngle(this, pickOne(...this.simulation!.bodies));
      this.linearSpeed /= 2;
    }

    if (this.simulation!.config.tailingFade) {
      // 👉 store current position in trail BEFORE moving
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailPoints) {
        this.trail.shift();
      }
    }

    this.simulation!.bodies.forEach((body) => {
      if (body === this) return;

      const distance = calDistance(this, body);
      if (distance <= this.radius + body.radius) return;

      const F = calAttraction(this, body); // scalar force
      const angleToB = calAngle(this, body); // φ
      const diff = angleToB - this.direction; // φ − θ

      // Project force into forward + turning components
      const a_forward = (F / this.mass) * Math.cos(diff);
      const a_turn = (F / this.mass) * Math.sin(diff);

      // Update linear speed (with dt)
      this.linearSpeed += a_forward * dt;

      // Update direction (curvature) with dt
      if (this.linearSpeed !== 0) {
        this.direction += (a_turn / this.linearSpeed) * dt;
      }
    });

    this.x += this.linearSpeed * Math.cos(this.direction) * dt;
    this.y += this.linearSpeed * Math.sin(this.direction) * dt;
    this.direction += this.angularSpeed * dt;
  }

  render() {
    const ctx = this.simulation!.ctx;

    if (this.simulation!.config.tailingFade) {
      // 🌈 draw trail first
      const n = this.trail.length;
      for (let i = 0; i < n; i++) {
        const p = this.trail[i];
        const t = i / (n - 1 || 1); // 0 → tail, 1 → head

        const alpha = t * 0.6; // tail faint, near-body stronger
        const r = this.radius * (0.3 + 0.7 * t); // smaller at tail

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = modifyColor(this.color, 100, 40);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }

    // 🟢 draw main body
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  get dtSeconds() {
    return this.simulation!.dtSeconds;
  }
}
