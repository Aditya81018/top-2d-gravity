import { randomNo } from "../../helpers";
import Body from "../body";
import type CanvasSimulation from "../canvasSimulation";

export interface RandomSpawnSimulationConfig {
  sizeRange?: [number, number];
  interval?: number;
  count?: number;
}

export default function randomSpawnSimulation(
  simulation: CanvasSimulation,
  config: RandomSpawnSimulationConfig = {}
) {
  const { canvas } = simulation;
  const { sizeRange = [0.1, 4], interval = 100, count = 1 } = config;

  const spawn = () => {
    for (let i = 0; i < count; i++) {
      const size = randomNo(sizeRange[0], sizeRange[1], 10);
      const body = new Body(
        // Ensure position is far enough from edges
        randomNo(size, canvas.width - size),
        randomNo(size, canvas.height - size),
        size
      );
      simulation.addBody(body);
    }
    setTimeout(spawn, interval);
  };
  spawn();
}
