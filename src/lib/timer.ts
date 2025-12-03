export default class Timer {
  public lastTimestamp = 0;
  public deltaTime = 0; // ms

  get fps() {
    return this.deltaTime > 0 ? 1000 / this.deltaTime : 0;
  }

  update(timestamp: number): boolean {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return false; // Indicates not to continue the main loop
    }

    this.deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    return true; // Indicates to continue
  }
}
