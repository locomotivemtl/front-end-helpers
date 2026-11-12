declare module '@locomotivemtl/component-islands/revive' {
    /** Walks a subtree now. Defaults to `document.body`. */
    export function scan(root?: Element | null): void;
    /** Lifts an earlier `unobserve` on the subtree and walks it. */
    export function observe(root?: Element | null): void;
    /** Skips the subtree and aborts pending activations inside it. No argument or `document.body` disconnects. */
    export function unobserve(root?: Element | null): void;
    /** Stops the runtime and aborts everything pending. */
    export function disconnect(): void;
}
