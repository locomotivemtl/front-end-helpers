/**
 * Replaces `rem(pixels)` with a rem value based on a root font size.
 * Default is a 16px root font size.
 *
 * @example
 * ```css
 * // Input
 * p {
 *  font-size: rem(24);
 *  font-size: rem(24, 20); // with custom root size
 *
 *  --font-size: 24px;
 *  font-size: rem(var(--font-size)); // with CSS variable
 *
 * --root-font-size: 20px;
 * font-size: rem(var(--font-size), var(--root-font-size)); // with CSS variables
 * }
 * ```
 *
 * ```css
 * // Output
 * p {
 *  font-size: 1.5rem;
 *  font-size: 1.2rem; // with custom root size
 *  font-size: calc(var(--font-size) / 16 * 1rem); // with CSS variable
 *  font-size: calc(var(--font-size) / var(--root-font-size) * 1rem); // with CSS variables
 * }
 * ```
 */
export default function rem(value: string): string;
