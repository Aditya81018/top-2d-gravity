// timer.ts
export default class Timer {
  lastTimestamp = 0;
  deltaTime = 0;
  fps = 0;

  update(timestamp: number): boolean {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.deltaTime = 0;
      this.fps = 0;
      return false; // skip first frame
    }

    let dt = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // If the tab was minimized or inactive, dt can be huge.
    // Clamp it so the simulation doesn't "teleport".
    const MAX_DT = 1000 / 15; // cap to ~15 FPS step
    if (dt > MAX_DT) {
      dt = MAX_DT;
    }

    this.deltaTime = dt;
    this.fps = dt > 0 ? 1000 / dt : 0;

    return true;
  }

  reset() {
    this.lastTimestamp = 0;
    this.deltaTime = 0;
    this.fps = 0;
  }
}
