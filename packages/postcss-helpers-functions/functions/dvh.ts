/**
 * Calculates a percentage of the viewport dynamic height (dvh).
 *
 * Example usage:
 * ```js
 * const height = dvh(100); // Returns "calc(100 * var(--dvh, 1dvh))"
 * ```
 *
 * @param {number} percentage - The percentage of the dynamic viewport height.
 * @return {string} The calculated CSS value as a string.
 */
export default function dvh(percentage: number): string {
    return `calc(${percentage} * var(--dvh, 1dvh))`;
}
