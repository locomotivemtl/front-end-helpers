/**
 * Mathematical modulo operation that always returns a positive result.
 * Unlike JavaScript's % operator, this handles negative dividends correctly.
 * @example mod(-1, 3) = 2 (whereas -1 % 3 = -1)
 */
export const mod = (dividend: number, divisor: number): number => {
    return ((dividend % divisor) + divisor) % divisor;
};

export function symmetricMod(value: number, base: number): number {
    let m = value % base;
    if (Math.abs(m) > base / 2) {
        m = m > 0 ? m - base : m + base;
    }
    return m;
}
