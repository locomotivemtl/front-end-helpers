import { replaceCSSFunction } from './_utils';

/**
 * Replaces `max-screen(value)` with `max({value}lvh, {value}vw)`.
 *
 * Returns the larger of the value in large viewport height vs. width units,
 * sizing relative to the larger viewport dimension.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: max-screen(50);
 *
 *  --size: 50;
 *  height: max-screen(var(--size)); // with CSS variable
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: max(50lvh, 50vw);
 *  height: max(calc(var(--size) * 1lvh), calc(var(--size) * 1vw)); // with CSS variable
 * }
 * ```
 */
export default function maxScreen(value: string): string {
    return replaceCSSFunction(value, 'max-screen', ([val]) => {
        if (!val) return null;
        if (isNaN(parseFloat(val))) return `max(lvh(${val}), vw(${val}))`;
        return `max(lvh(${val}), vw(${val}))`;
    });
}
