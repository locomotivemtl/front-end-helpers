/**
 * Replace interpolate(a, b, t) with a linear interpolation between two values.
 *
 * @example
 * ```css
 * // Input
 * p {
 *  font-size: interpolate(16px, 24px, 0.5);
 * }
 * ```
 *
 * ```css
 * // Output
 * p {
 *  font-size: calc(16px * (1 - 0.5) + 24px * 0.5);
 * }
 * ```
 */
export default function interpolate(value: string): string;
