// main.ts
import CanvasSimulation, { type CanvasConfig } from "./lib/canvasSimulation";
import centerMassSimulation from "./lib/simulations/centerMass";
import randomSpawnSimulation from "./lib/simulations/randomSpawn";
import scatterSimulation from "./lib/simulations/scatter";
import "./style.css";

const SPEED_CONSTANT = 365 * 24 * 60 * 60 * (1 / 1000);

const config: CanvasConfig = {
  tailingFade: true,
  tailLength: 10,
  speed: SPEED_CONSTANT,
  absorb: true,
  bounded: true,
  metersPerPixel: 1000,
};

// DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    config.speed *= 2;
  } else if (event.key === "ArrowDown") {
    config.speed /= 2;
  }
});

// Create simulation
const simulation = new CanvasSimulation(canvas, config);

scatterSimulation(simulation, {
  count: 50,
  sizeRange: [4, 8],
});
scatterSimulation(simulation, {
  count: 250,
  sizeRange: [1, 2],
});

// scatterSimulation(simulation, {
//   count: 200,
//   sizeRange: [0.1, 2],
// });
randomSpawnSimulation(simulation, {
  interval: 500,
  sizeRange: [0.1, 4],
  count: 2,
});

// centerMassSimulation(simulation, { size: 16 });

simulation.start();
