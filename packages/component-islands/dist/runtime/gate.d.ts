import type { ClientDirective, RuntimeOptions } from '../options.js';
/**
 * Waits for every directive on the element, in order:
 * visible, media, idle, defer, interaction, then custom directives.
 * Without any directive it resolves at once.
 */
export declare function waitForGate($el: HTMLElement, { directives }: RuntimeOptions, customDirectives: Map<string, ClientDirective>, signal: AbortSignal): Promise<void>;
