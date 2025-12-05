import Body from "../body";
import type CanvasSimulation from "../canvasSimulation";

export interface CenterMassSimulationConfig {
  size?: number;
}

export default function centerMassSimulation(
  simulation: CanvasSimulation,
  config: CenterMassSimulationConfig = {}
) {
  const { canvas } = simulation;
  const { size = 20 } = config;

  const hookBody = new Body(canvas.width / 2, canvas.height / 2, size);
  hookBody.isFixed = true;
  simulation.addBody(hookBody);
}
