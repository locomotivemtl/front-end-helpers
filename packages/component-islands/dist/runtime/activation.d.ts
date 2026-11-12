import type { ClientDirective, RuntimeOptions } from '../options.js';
export interface RevivePayload {
    islands: Record<string, () => Promise<unknown>>;
    options: RuntimeOptions;
    customDirectives: Map<string, ClientDirective>;
}
export interface Activation {
    walk($root: Element): void;
    observe($root: Element): void;
    unobserve($root: Element): void;
    /** Aborts pending activations whose element left the document. */
    prune(): void;
    stop(): void;
}
/** One activation per tag: the first element's directives gate the module load. */
export declare function createActivation(payload: RevivePayload): Activation;
