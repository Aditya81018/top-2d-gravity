import Body from "../body";
import type CanvasSimulation from "../canvasSimulation";
import seedrandom from "seedrandom";

export interface ScatterSimulationConfig {
  count?: number;
  sizeRange?: [number, number];
  seed?: string;
}

export default function scatterSimulation(
  simulation: CanvasSimulation,
  config: ScatterSimulationConfig = {}
) {
  const { canvas } = simulation;

  const { count = 500, sizeRange: sizeRanger = [0.1, 4], seed } = config;

  const rng = seed ? seedrandom(seed) : Math.random;

  const seededRandomNo = (
    min: number,
    max: number,
    precision?: number
  ): number => {
    const value = min + rng() * (max - min);
    if (precision) {
      const multiplier = Math.pow(10, precision);
      return Math.round(value * multiplier) / multiplier;
    }
    return value;
  };

  for (let i = 0; i < count; i++) {
    // 1. Determine the radius (size)
    const size = seededRandomNo(sizeRanger[0], sizeRanger[1], 10);

    const body = new Body(
      // Ensure position is far enough from edges

      seededRandomNo(size, canvas.width - size),
      seededRandomNo(size, canvas.height - size),
      size
    );
    simulation.addBody(body);
  }
}
