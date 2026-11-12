export interface IslandLoadDetail {
    /** The custom element tag, for example `product-form`. */
    tag: string;
    /** Milliseconds from the start of loading to success, retries included. */
    duration: number;
    /** The attempt that succeeded. 1 is the first try. */
    attempt: number;
}

export interface IslandErrorDetail {
    tag: string;
    /** What the loader or a custom directive threw. */
    error: unknown;
    /** The attempt that failed. 1 is the first try. */
    attempt: number;
}

declare global {
    interface DocumentEventMap {
        'islands:load': CustomEvent<IslandLoadDetail>;
        'islands:error': CustomEvent<IslandErrorDetail>;
    }
}

const LOAD_EVENT = 'islands:load';
const ERROR_EVENT = 'islands:error';

export function dispatchIslandLoad(detail: IslandLoadDetail): void {
    document.dispatchEvent(new CustomEvent(LOAD_EVENT, { detail }));
}

export function dispatchIslandError(detail: IslandErrorDetail): void {
    document.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail }));
}

/** Listens for `islands:load`. Returns the unsubscribe function. */
export function onIslandLoad(fn: (detail: IslandLoadDetail) => void): () => void {
    const listener = (e: CustomEvent<IslandLoadDetail>) => fn(e.detail);
    document.addEventListener(LOAD_EVENT, listener);
    return () => document.removeEventListener(LOAD_EVENT, listener);
}

/** Listens for `islands:error`. Returns the unsubscribe function. */
export function onIslandError(fn: (detail: IslandErrorDetail) => void): () => void {
    const listener = (e: CustomEvent<IslandErrorDetail>) => fn(e.detail);
    document.addEventListener(ERROR_EVENT, listener);
    return () => document.removeEventListener(ERROR_EVENT, listener);
}
