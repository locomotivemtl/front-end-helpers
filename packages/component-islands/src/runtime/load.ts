import type { RuntimeOptions } from '../options.js';
import { waitDelay } from './directives.js';
import { reportError } from './log.js';

export interface LoadResult {
    duration: number;
    attempt: number;
}

/**
 * Runs the loader, retrying with a doubling delay.
 * Returns null when every attempt failed or the signal aborted.
 */
export async function loadIsland(
    tag: string,
    loader: () => Promise<unknown>,
    { retries, delay }: RuntimeOptions['retry'],
    signal: AbortSignal
): Promise<LoadResult | null> {
    const startedAt = performance.now();

    for (let attempt = 1; ; attempt++) {
        try {
            await loader();
            return signal.aborted ? null : { duration: performance.now() - startedAt, attempt };
        } catch (error) {
            reportError(tag, error, attempt);
        }

        if (attempt > retries || signal.aborted) return null;

        try {
            await waitDelay(delay * 2 ** (attempt - 1), signal);
        } catch (error) {
            if (signal.aborted) return null;
            throw error;
        }
    }
}
