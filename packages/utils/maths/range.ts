export const clamp = (value: number, min: number = 0, max: number = 1) => {
    return Math.max(min, Math.min(value, max));
};

export const map = (value: number, min: number, max: number, nmin: number, nmax: number) => {
    return ((value - min) / (max - min)) * (nmax - nmin) + nmin;
};

export function mapClamp(
    value: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number
): number {
    const v = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    let min = start2;
    let max = stop2;
    if (start2 > stop2) {
        min = stop2;
        max = start2;
    }
    return Math.max(min, Math.min(max, v));
}

export const normalize = (value: number, min: number, max: number) => {
    return clamp((value - min) / (max - min), 0, 1);
};

export const smoothstep = (x: number, min: number, max: number): number => {
    const t = clamp((x - min) / (max - min), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
};
