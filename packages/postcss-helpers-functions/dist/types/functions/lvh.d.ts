/**
 * Calculates a percentage of the viewport large height (lvh).
 *
 * Example usage:
 * ```js
 * const height = lvh(100); // Returns "calc(100 * var(--lvh, 1lvh))"
 * ```
 *
 * @param {number} percentage - The percentage of the large viewport height.
 * @return {string} The calculated CSS value as a string.
 */
export default function lvh(percentage: any): string;
