/**
 * Calculates a percentage of the viewport small height (svh).
 *
 * Example usage:
 * ```js
 * const height = svh(100); // Returns "calc(100 * var(--svh, 1svh))"
 * ```
 *
 * @param {number} percentage - The percentage of the small viewport height.
 * @return {string} The calculated CSS value as a string.
 */
export default function svh(percentage: number): string {
    return `calc(${percentage} * var(--svh, 1svh))`;
}
