import { replaceCSSFunction } from './_utils.ts';

/**
 * Replaces `lvh(n)` with `calc(n * var(--lvh, 1lvh))`.
 *
 * Uses a CSS custom property `--lvh` set by JS (large viewport height),
 * falling back to the native `lvh` unit.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: lvh(100);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: calc(100 * var(--lvh, 1lvh));
 * }
 * ```
 */
export default function lvh(value: string): string {
    return replaceCSSFunction(value, 'lvh', ([percentage]) => {
        if (!percentage) return null;
        return `calc(${percentage} * var(--lvh, 1lvh))`;
    });
}
