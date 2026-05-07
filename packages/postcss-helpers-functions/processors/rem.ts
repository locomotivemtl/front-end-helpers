import { replaceCSSFunction } from './_utils.ts';

const ROOT_SIZE = 16;

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
export default function rem(value: string): string {
    return replaceCSSFunction(value, 'rem', ([pixels, rootSize]) => {
        if (!pixels) return null;
        const pxNum = parseFloat(pixels);
        const rootNum = rootSize ? parseFloat(rootSize) : ROOT_SIZE;
        const rootVal = rootSize ?? String(ROOT_SIZE);
        if (!isNaN(rootNum) && rootNum === 0) return null;
        if (!isNaN(pxNum) && !isNaN(rootNum)) return `${pxNum / rootNum}rem`;
        return `calc(${pixels} / ${isNaN(rootNum) ? rootVal : rootNum} * 1rem)`;
    });
}
