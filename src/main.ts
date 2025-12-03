// main.ts
import { circumference } from "./helpers";
import Body from "./lib/body";
import CanvasSimulation, { type CanvasConfig } from "./lib/canvasSimulation";
import "./style.css";

const config: CanvasConfig = {
  tailingFade: false,
  speed: 1,
};

// DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Create simulation
const simulation = new CanvasSimulation(canvas, config);

// START THE CODE FROM HERE
const rpm = 60;

// Use simulation width/height to center the body
const A = new Body(simulation.width / 2, simulation.height / 2 - 100, 25);
A.linearSpeed = (circumference(100) * rpm) / 60;
A.angularSpeed = (2 * Math.PI * rpm) / 60;

simulation.addBody(A);
simulation.start();
