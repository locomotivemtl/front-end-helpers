/**
 * Calculates a percentage of the viewport width (vw).
 *
 * Example usage:
 * ```js
 * const width = vw(100); // Returns "calc(100 * var(--vw, 1vw))"
 * ```
 *
 * @param {number} percentage - The percentage of the viewport width.
 * @return {string} The calculated CSS value as a string.
 */
export default function vw(percentage: number): string {
    return `calc(${percentage} * var(--vw, 1vw))`;
}
