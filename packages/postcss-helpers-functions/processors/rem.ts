/**
 * Converts pixel values to rem units based on a configurable root font size.
 *
 * Example usage:
 * ```js
 * const fontSize = rem(16);     // Returns "1rem" (if root is 16px)
 * const margin = rem("24px");   // Returns "1.5rem" (if root is 16px)
 * const padding = rem(8);       // Returns "0.5rem" (if root is 16px)
 * const spacing = rem("32px");  // Returns "2rem" (if root is 16px)
 * ```
 *
 * @param {number | string} pixels - The pixel value to convert to rem (number or string with "px").
 * @param {number} rootSize - The root font size in pixels. Defaults to 16.
 * @return {string} The calculated rem value as a string.
 */
export default function rem(pixels: number | string, rootSize: number = 16): string {
    // Parse the pixels value if it's a string
    const pixelValue = typeof pixels === 'string' ? parseFloat(pixels.replace('px', '')) : pixels;

    const remValue = pixelValue / rootSize;
    // Trailing space to preserve spacing in CSS output
    return `${remValue}rem `;
}
