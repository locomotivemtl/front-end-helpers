/**
 * Replaces `vw(n)` with `calc(n * var(--vw, 1vw))`.
 *
 * Uses a CSS custom property `--vw` set by JS to avoid the scrollbar width
 * that `100vw` includes on desktop browsers, falling back to the native `vw` unit.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  width: vw(100);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  width: calc(100 * var(--vw, 1vw));
 * }
 * ```
 */
export default function vw(value: string): string;
