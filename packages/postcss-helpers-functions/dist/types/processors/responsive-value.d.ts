/**
 * Replaces `responsive-value(minSize, maxSize, breakpoint)` with a fluid
 * `clamp()` expression that scales linearly between `minSize` and `maxSize`
 * across the viewport width up to `breakpoint`.
 *
 * @example
 * ```css
 * // Input
 * p {
 *  font-size: responsive-value(30px, 60px, 1800px);
 *
 *  --font-size: 30px;
 *  --max-size: 60px;
 *  --breakpoint: 1800px;
 *  font-size: responsive-value(var(--font-size), var(--max-size), var(--breakpoint)); // with CSS variables
 * }
 * ```
 *
 * ```css
 * // Output
 * p {
 *  font-size: clamp(30px, calc(0.0333 * var(--vw, 1vw) * 100), 60px);
 *  font-size: clamp(var(--font-size), calc(var(--max-size) / var(--breakpoint) * var(--vw, 1vw) * 100), var(--max-size)); // with CSS variables
 * }
 * ```
 */
export default function responsiveValue(value: string): string;
