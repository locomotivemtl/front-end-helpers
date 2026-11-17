/**
 * Wraps a wait in a promise that settles on `done`, `fail` or abort.
 * The cleanup returned by `setup` runs once, whichever happens first.
 */
export declare function abortable(signal: AbortSignal, setup: (done: () => void, fail: (error: unknown) => void) => () => void): Promise<void>;
