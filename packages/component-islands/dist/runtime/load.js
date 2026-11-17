import { waitDelay } from './directives.js';
import { reportError } from './log.js';
/**
 * Runs the loader, retrying with a doubling delay.
 * Returns null when every attempt failed or the signal aborted.
 */
export async function loadIsland(tag, loader, { retries, delay }, signal) {
    const startedAt = performance.now();
    for (let attempt = 1;; attempt++) {
        try {
            await loader();
            return signal.aborted ? null : { duration: performance.now() - startedAt, attempt };
        }
        catch (error) {
            reportError(tag, error, attempt);
        }
        if (attempt > retries || signal.aborted)
            return null;
        try {
            await waitDelay(delay * 2 ** (attempt - 1), signal);
        }
        catch (error) {
            if (signal.aborted)
                return null;
            throw error;
        }
    }
}
