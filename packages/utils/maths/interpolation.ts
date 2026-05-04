export function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

export function lerpPrecise(start: number, end: number, t: number, limit: number = 0.001): number {
    const v = start * (1 - t) + end * t;
    return Math.abs(end - v) < limit ? end : v;
}

export function damp(a: number, b: number, smoothing: number, dt: number): number {
    return lerp(a, b, 1 - Math.exp(-smoothing * 0.05 * Math.max(dt, 0)));
}

export function dampPrecise(
    a: number,
    b: number,
    smoothing: number,
    dt: number,
    limit: number = 0.001
): number {
    return lerpPrecise(a, b, 1 - Math.exp(-smoothing * 0.05 * Math.max(dt, 0)), limit);
}

export function yoyo(value: number): number {
    return 1 - Math.abs(2 * value - 1);
}
