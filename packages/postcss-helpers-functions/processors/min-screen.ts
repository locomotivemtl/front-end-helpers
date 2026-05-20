import { replaceCSSFunction } from './_utils';

/**
 * Replaces `min-screen(value)` with `min({value}lvh, {value}vw)`.
 *
 * Returns the smaller of the value in large viewport height vs. width units,
 * sizing relative to the smaller viewport dimension.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: min-screen(50);
 *
 *  --size: 50;
 *  height: min-screen(var(--size)); // with CSS variable
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: min(50lvh, 50vw);
 *  height: min(calc(var(--size) * 1lvh), calc(var(--size) * 1vw)); // with CSS variable
 * }
 * ```
 */
export default function minScreen(value: string): string {
    return replaceCSSFunction(value, 'min-screen', ([val]) => {
        if (!val) return null;
        if (isNaN(parseFloat(val))) return `min(lvh(${val}), vw(${val}))`;
        return `min(lvh(${val}), vw(${val}))`;
    });
}
