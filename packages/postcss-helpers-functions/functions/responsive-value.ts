/**
 * Generates a CSS `clamp()` string for a responsive font size calculation.
 * This function calculates the preferred font size based on the given minimum, maximum, and breakpoint values.
 *
 * Example usage:
 * ```js
 * responsiveValue('30px', '60px', '1800px');
 * ```
 *
 * @param {string} minSize - The minimum font size in pixels (e.g., '30px').
 * @param {string} maxSize - The maximum font size in pixels (e.g., '60px').
 * @param {string} breakpoint - The maximum breakpoint (e.g., '1800px').
 * @returns {string} - The CSS `clamp()` string for the responsive font size.
 */
export type ResponsiveValue = (minSize: string, maxSize: string, breakpoint: string) => string;

const responsiveValue: ResponsiveValue = (minSize, maxSize, breakpoint): string => {
    // Calculate delta as the ratio of max-size to breakpoint
    const delta = parseFloat(maxSize) / parseFloat(breakpoint);

    // Construct the `clamp()` function for responsive font size
    return `clamp(${minSize}, calc(${delta} * var(--vw, 1vw) * 100), ${maxSize})`;
}

export default responsiveValue;
