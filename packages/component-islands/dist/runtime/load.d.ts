import type { RuntimeOptions } from '../options.js';
export interface LoadResult {
    duration: number;
    attempt: number;
}
/**
 * Runs the loader, retrying with a doubling delay.
 * Returns null when every attempt failed or the signal aborted.
 */
export declare function loadIsland(tag: string, loader: () => Promise<unknown>, { retries, delay }: RuntimeOptions['retry'], signal: AbortSignal): Promise<LoadResult | null>;
