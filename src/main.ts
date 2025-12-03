// main.ts
import { randomColor, randomNo } from "./helpers";
import Body from "./lib/body";
import CanvasSimulation, { type CanvasConfig } from "./lib/canvasSimulation";
import "./style.css";

const config: CanvasConfig = {
  tailingFade: true,
  speed: 10_000 * 2,
  absorb: false,
};

const addHookBody = false;
const count = 3;

// DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Create simulation
const simulation = new CanvasSimulation(canvas, config);

if (addHookBody) {
  const hookBodyRadius = 10;
  const hookBody = new Body(
    canvas.width / 2,
    canvas.height / 2,
    hookBodyRadius,
    Math.pow(hookBodyRadius, 3) * 10_000,
    randomColor()
  );
  hookBody.update = () => {};
  simulation.addBody(hookBody);
}

for (let i = 0; i < count; i++) {
  // 1. Determine the radius (size)
  const size = randomNo(32, 32, 3);
  const radius = size;

  // 2. 💥 CORRECT MASS CALCULATION: m is proportional to r cubed.
  // We use 10,000 as a scaling factor (k) to keep the masses in a reasonable range.
  // $m = k \cdot r^3$
  const mass = radius * radius * radius * 10_000;

  const body = new Body(
    // Ensure position is far enough from edges
    randomNo(radius, canvas.width - radius),
    randomNo(radius, canvas.height - radius),
    radius,
    mass
  );
  simulation.addBody(body);
}

simulation.start();
