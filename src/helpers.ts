import Body from "./lib/body";

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

export function modifyColor(color: string, sat: number, lit: number) {
  const hue = Number(color.replace("hsl(", "").substring(0, 3));
  return `hsl(${hue} ${sat} ${lit})`;
}

export function randomNo(min: number, max: number, precision = 0) {
  return Number((Math.random() * (max - min) + min).toFixed(precision));
}

export function pickOne(...options: any) {
  return options[randomNo(0, options.length - 1, 0)];
}

export function calAngle(bodyA: Body, bodyB: Body) {
  return Math.atan2(bodyB.y - bodyA.y, bodyB.x - bodyA.x);
}

export function calDistance(bodyA: Body, bodyB: Body) {
  return Math.sqrt(
    Math.pow(bodyA.x - bodyB.x, 2) + Math.pow(bodyA.y - bodyB.y, 2)
  );
}

export function calAttraction(bodyA: Body, bodyB: Body) {
  // const G = 6.67 * Math.pow(10, -11);
  const r = calDistance(bodyA, bodyB);
  const F = (bodyA.mass * bodyB.mass) / Math.pow(r, 2);
  return F;
}
