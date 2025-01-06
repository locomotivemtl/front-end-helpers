/**
 * Generates a CSS `calc()` string to calculate a percentage of the grid cell width,
 * with an optional grid gutter inset.
 *
 * This function mimics the behavior of a Sass function and is suitable for use in PostCSS plugins.
 *
 * Example usage:
 * ```javascript
 * gridSpace(6/12); // Calculates a width based on 6/12 of the grid
 * gridSpace(1/12, 1); // Calculates with a gutter inset
 * ```
 *
 * @param {number} percentage - The fraction of the grid (e.g., 6/12 or 0.5 for half the grid width).
 * @param {number} [inset=0] - An optional inset multiplier for the grid gutter (default is 0).
 * @returns {string} - The CSS `calc()` string for the grid spacing.
 */
export default function gridSpace(percentage: any, inset?: number): string;
