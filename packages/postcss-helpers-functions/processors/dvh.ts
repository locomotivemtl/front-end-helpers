import { replaceCSSFunction } from './_utils.ts';

/**
 * Replaces `dvh(n)` with `calc(n * var(--dvh, 1dvh))`.
 *
 * Uses a CSS custom property `--dvh` set by JS to work around iOS Safari's
 * dynamic viewport height bug, falling back to the native `dvh` unit.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: dvh(100);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: calc(100 * var(--dvh, 1dvh));
 * }
 * ```
 */
export default function dvh(value: string): string {
    return replaceCSSFunction(value, 'dvh', ([percentage]) => {
        if (!percentage) return null;
        return `calc(${percentage} * var(--dvh, 1dvh))`;
    });
}
