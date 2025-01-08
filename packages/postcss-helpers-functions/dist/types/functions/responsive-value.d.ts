/**
 * Generates a CSS `clamp()` string for a responsive font size calculation.
 * This function calculates the preferred font size based on the given minimum, maximum, and breakpoint values.
 *
 * Example usage:
 * ```javascript
 * responsiveValue('30px', '60px', 1800);
 * ```
 *
 * @param {string} minSize - The minimum font size in pixels (e.g., '30px').
 * @param {string} maxSize - The maximum font size in pixels (e.g., '60px').
 * @param {number} breakpoint - The maximum breakpoint (e.g., 1800 for 1800px).
 * @returns {string} - The CSS `clamp()` string for the responsive font size.
 */
export type ResponsiveValue = (minSize: string, maxSize: string, breakpoint: number) => string;
declare const responsiveValue: ResponsiveValue;
export default responsiveValue;
