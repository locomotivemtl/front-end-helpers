/**
 * Replaces `grid-space(fraction, inset?)` with a `calc()` expression for
 * a column-based width using CSS custom properties `--vw`, `--grid-margin`, and `--grid-gutter`.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: grid-space(6/12, 1);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: calc(6/12 * (calc(100 * var(--vw, 1vw)) - 2 * var(--grid-margin, 0px)) - (1 - 6/12) * var(--grid-gutter, 0px) + 1 * var(--grid-gutter, 0px));
 * }
 * ```
 */
export default function gridSpace(value: string): string;
