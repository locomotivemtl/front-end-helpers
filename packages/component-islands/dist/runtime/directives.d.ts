import type { ClientDirective, ClientDirectiveOptions } from '../options.js';
export declare function waitVisible($el: Element, rootMargin: string, threshold: number, signal: AbortSignal): Promise<void>;
export declare function waitMedia(query: string, signal: AbortSignal): Promise<void>;
export declare function waitIdle(timeout: number, signal: AbortSignal): Promise<void>;
export declare function waitDelay(ms: number, signal: AbortSignal): Promise<void>;
export declare function waitInteraction($el: Element, events: string[], signal: AbortSignal): Promise<void>;
/** Resolves when the directive calls `load()`. A throw or rejection fails the wait. */
export declare function waitCustom(directive: ClientDirective, options: ClientDirectiveOptions, $el: HTMLElement, signal: AbortSignal): Promise<void>;
