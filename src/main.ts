// main.ts
import { randomColor, randomNo } from "./helpers";
import Body from "./lib/body";
import CanvasSimulation, { type CanvasConfig } from "./lib/canvasSimulation";
import "./style.css";

const config: CanvasConfig = {
  tailingFade: true,
  speed: 0.25,
};

const addHookBody = true;
const count = 200;

// DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Create simulation
const simulation = new CanvasSimulation(canvas, config);

if (addHookBody) {
  const hookBody = new Body(
    canvas.width / 2,
    canvas.height / 2,
    25,
    1_000_000,
    randomColor()
  );
  hookBody.update = () => {};
  simulation.addBody(hookBody);
}

for (let i = 0; i < count; i++) {
  const size = randomNo(0.1, 4, 3);
  const radius = size;
  const mass = size * 10_000;
  const body = new Body(
    randomNo(radius, canvas.width - radius),
    randomNo(radius, canvas.height - radius),
    radius,
    mass
  );
  simulation.addBody(body);
}

simulation.start();
