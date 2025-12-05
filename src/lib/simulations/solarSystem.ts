import Body from "../body";
import type CanvasSimulation from "../canvasSimulation";

export default function solarSystem(simulation: CanvasSimulation) {
  const { canvas } = simulation;

  const sun = new Body(canvas.width / 2, canvas.height / 2, 20);
  sun.update = () => {};

  const earth = new Body(canvas.width / 2 + 200, canvas.height / 2, 10);
  earth.direction = Math.PI / 2;
  earth.linearSpeed = 0.0045;

  const moon = new Body(canvas.width / 2 + 250, canvas.height / 2, 2);
  moon.direction = Math.PI / 2;
  moon.linearSpeed = 0.00754;

  simulation.addBody(sun, earth, moon);

  // scatterSimulation(simulation);
}
