/**
 * Replaces `map-clamp(val, start1, stop1, start2, stop2)` with a clamped linear map expression.
 *
 * Maps `val` from range [start1, stop1] to range [start2, stop2], clamped to the output range.
 *
 * @example
 * ```css
 * // Input
 * div {
 *  height: map-clamp(var(--progress, 0), .3, .8, 20px, 80px);
 * }
 * ```
 *
 * ```css
 * // Output
 * div {
 *  height: clamp(min(20px, 80px), calc(20px + (80px - 20px) * ((var(--progress) - .3) / (.8 - .3))), max(20px, 80px));
 *  // Progress at 0: height: 20px
 *  // Progress at .3: height: 20px
 *  // Progress at .55: height: 50px
 *  // Progress at .8: height: 80px
 *  // Progress at 1: height: 80px
 * }
 * ```
 */
export default function mapClamp(value: string): string;
