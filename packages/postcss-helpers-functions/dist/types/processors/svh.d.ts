/**
 * Replaces `svh(n)` with `calc(n * var(--svh, 1svh))`.
 *
 * Uses a CSS custom property `--svh` set by JS (small viewport height),
 * falling back to the native `svh` unit.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: svh(100);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: calc(100 * var(--svh, 1svh));
 * }
 * ```
 */
export default function svh(value: string): string;
