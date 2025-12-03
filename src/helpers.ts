export function circumference(radius: number): number {
  return 2 * Math.PI * radius;
}

export function isApprox(
  value: number,
  target: number,
  range: number
): boolean {
  return value >= target - range / 2 && value <= target + range / 2;
}

export function randomColor(sat = 90, lit = 60) {
  return `hsl(${Math.random() * 360} ${sat} ${lit})`;
}
