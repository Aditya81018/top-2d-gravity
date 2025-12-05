import {
  calAngle,
  calAttraction,
  calDistance,
  modifyColor,
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
  isFixed: boolean;

  // 🔥 trail data
  private trail: TrailPoint[] = [];

  // New property to prevent multiple collision checks for the same event
  public isAlive: boolean = true;

  constructor(x = 50, y = 50, size = 25, color = randomColor()) {
    this.id = crypto.randomUUID();
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.mass = 0;
    this.setSize(size);
    this.linearSpeed = 0;
    this.angularSpeed = 0;
    this.direction = 0;
    this.color = color;
    this.simulation = null;
    this.isFixed = false;
  }

  setSize(size: number) {
    this.radius = size;
    this.mass = Math.pow(size, 3) * 10_000;
  }

  update() {
    // 🛑 Check if the body has been absorbed
    if (!this.isAlive || this.isFixed) {
      return;
    }

    const dt = this.dtSeconds;

    const canvas = this.simulation!.canvas;

    if (
      this.x < this.radius ||
      this.x > canvas.width - this.radius ||
      this.y < this.radius ||
      this.y > canvas.height - this.radius
    ) {
      if (this.simulation!.config.bounded) {
        // horizontal wall
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
          this.direction = Math.PI - this.direction;
        }

        // vertical wall
        if (this.y < this.radius || this.y > canvas.height - this.radius) {
          this.direction = -this.direction;
        }
      } else {
        this.simulation?.markForRemoval(this.id);
      }
      // this.linearSpeed /= 2;
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
      if (!body.isAlive) return; // Skip bodies already marked for removal

      const distance = calDistance(this, body);
      const isColliding = distance <= this.radius + body.radius;

      // 💥 COLLISION AND ABSORPTION LOGIC START
      if (isColliding) {
        if (!this.simulation!.config.absorb) return;
        // The bigger body (more mass) absorbs the smaller one.
        // If masses are equal, one can be arbitrarily chosen to absorb the other.
        if (this.mass >= body.mass) {
          this.absorbBody(body);
        } else {
          // The other body is bigger, so this one will be absorbed.
          // Note: The other body will handle its own absorption in its update loop
          // or in the next iteration of this loop.
          // To prevent double-absorption or errors, we set isAlive to false.
          this.isAlive = false;
        }
        return; // Skip gravitational calculation after a collision
      }
      // 💥 COLLISION AND ABSORPTION LOGIC END

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

    // Only update position if still alive (not absorbed in this frame)
    if (this.isAlive) {
      this.x += this.linearSpeed * Math.cos(this.direction) * dt;
      this.y += this.linearSpeed * Math.sin(this.direction) * dt;
      this.direction += this.angularSpeed * dt;
    }
  }

  /**
   * Absorbs the properties of another body and marks the absorbed body for removal.
   * Uses Conservation of Momentum for the new velocity.
   * @param absorbedBody The body to absorb.
   */
  absorbBody(absorbedBody: Body) {
    // 1. **Conservation of Momentum (for new velocity)**
    // Calculate total momentum components (P_total)
    const v1x = this.linearSpeed * Math.cos(this.direction);
    const v1y = this.linearSpeed * Math.sin(this.direction);
    const v2x = absorbedBody.linearSpeed * Math.cos(absorbedBody.direction);
    const v2y = absorbedBody.linearSpeed * Math.sin(absorbedBody.direction);

    const pTotalX = this.mass * v1x + absorbedBody.mass * v2x;
    const pTotalY = this.mass * v1y + absorbedBody.mass * v2y;

    // 2. **Calculate New Mass**
    const newMass = this.mass + absorbedBody.mass;

    // 3. **Update Position to Center of Mass** (Recommended for accuracy)
    // The new position should be the mass-weighted average of the two original positions.
    const newX =
      (this.x * this.mass + absorbedBody.x * absorbedBody.mass) / newMass;
    const newY =
      (this.y * this.mass + absorbedBody.y * absorbedBody.mass) / newMass;

    this.x = newX;
    this.y = newY;

    // 4. **Update Velocity (New direction and linearSpeed)**
    const vNewX = pTotalX / newMass;
    const vNewY = pTotalY / newMass;

    this.linearSpeed = Math.sqrt(vNewX * vNewX + vNewY * vNewY);
    this.direction = Math.atan2(vNewY, vNewX);

    // 5. **Update Mass and Radius**

    // Store old mass and radius for the correct radius calculation
    const oldMass = this.mass;
    const oldRadius = this.radius;

    // Update Mass
    this.mass = newMass;

    // Update Radius: If density ($\rho = m/V$) is constant, then $m \propto r^3$, or $r \propto \sqrt[3]{m}$.
    // New Radius $r_{new} = r_{old} \cdot \sqrt[3]{\frac{m_{new}}{m_{old}}}$
    this.radius = oldRadius * Math.cbrt(this.mass / oldMass);
    // Note: The previous formula: this.radius = this.radius * Math.cbrt(1 / (1 - massRatio));
    // was algebraically equivalent but less intuitive. This version is cleaner.

    // 6. **Mark the absorbed body for removal**
    absorbedBody.isAlive = false;
    this.simulation?.markForRemoval(absorbedBody.id);
  }
  render() {
    // 🛑 Do not render if the body has been absorbed
    if (!this.isAlive) {
      return;
    }

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

  get maxTrailPoints() {
    return this.simulation?.config.tailLength || 40;
  }
}
