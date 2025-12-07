// main.ts
import CanvasSimulation, { type CanvasConfig } from "./lib/canvasSimulation";
import centerMassSimulation from "./lib/simulations/centerMass";
// import centerMassSimulation from "./lib/simulations/centerMass";
import randomSpawnSimulation from "./lib/simulations/randomSpawn";
import scatterSimulation from "./lib/simulations/scatter";
import "./style.css";

const SPEED_CONSTANT = 365 * 24 * 60 * 60;

const config: CanvasConfig = {
  tailingFade: true,
  tailLength: 10,
  speed: SPEED_CONSTANT * 1e9 * 4,
  absorb: true,
  bounded: false,
  metersPerPixel: 9.461e11,
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

// scatterSimulation(simulation, {
//   count: 50,
//   sizeRange: [1, 2],
// });
// scatterSimulation(simulation, {
//   count: 250,
//   sizeRange: [0.1, 1],
// });

scatterSimulation(simulation, {
  count: 100,
  sizeRange: [2, 4],
});
randomSpawnSimulation(simulation, {
  interval: 1000,
  sizeRange: [0.1, 1],
  count: 100,
});

randomSpawnSimulation(simulation, {
  interval: 1000,
  sizeRange: [2, 4],
  count: 20,
});

centerMassSimulation(simulation, { size: 1 });

simulation.start();
