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
export declare function dispatchIslandLoad(detail: IslandLoadDetail): void;
export declare function dispatchIslandError(detail: IslandErrorDetail): void;
/** Listens for `islands:load`. Returns the unsubscribe function. */
export declare function onIslandLoad(fn: (detail: IslandLoadDetail) => void): () => void;
/** Listens for `islands:error`. Returns the unsubscribe function. */
export declare function onIslandError(fn: (detail: IslandErrorDetail) => void): () => void;
