export interface ComponentIslandsOptions {
    /** Directories scanned for island files. Root-relative or a Vite alias. Default `['/src/scripts/islands/']`. */
    directories?: string | string[];
    directives?: {
        visible?: {
            attribute?: string;
            rootMargin?: string;
            threshold?: number;
        };
        idle?: {
            attribute?: string;
            timeout?: number;
        };
        media?: {
            attribute?: string;
        };
        defer?: {
            attribute?: string;
            delay?: number;
        };
        interaction?: {
            attribute?: string;
            events?: string[];
        };
        /** `name` is the HTML attribute, `entrypoint` a module whose default export is a `ClientDirective`. */
        custom?: CustomDirectiveEntry[];
    };
    /** `delay` is the base in ms and doubles on each attempt. */
    retry?: {
        retries?: number;
        delay?: number;
    };
    debug?: boolean;
}
export interface CustomDirectiveEntry {
    name: string;
    entrypoint: string;
}
/** Options the runtime reads. Every field is set. */
export interface RuntimeOptions {
    directives: {
        visible: {
            attribute: string;
            rootMargin: string;
            threshold: number;
        };
        idle: {
            attribute: string;
            timeout: number;
        };
        media: {
            attribute: string;
        };
        defer: {
            attribute: string;
            delay: number;
        };
        interaction: {
            attribute: string;
            events: string[];
        };
    };
    retry: {
        retries: number;
        delay: number;
    };
    debug: boolean;
}
export interface ResolvedOptions {
    directories: string[];
    custom: CustomDirectiveEntry[];
    runtime: RuntimeOptions;
}
/** Called once the element's other directives have passed. Call `load()` when the condition is met. */
export type ClientDirective = (load: () => Promise<void>, options: ClientDirectiveOptions, $el: HTMLElement, ctx: ClientDirectiveContext) => void | Promise<void>;
export interface ClientDirectiveOptions {
    /** The matched attribute name, for example `island:hash`. */
    name: string;
    /** The attribute value. Empty string when the attribute has no value. */
    value: string;
}
export interface ClientDirectiveContext {
    /** Aborts when the element is removed, unobserved or the runtime disconnects. */
    signal: AbortSignal;
    /** Registers work that runs once, when the directive resolves or aborts. */
    onCleanup(fn: () => void): void;
}
export declare function resolveOptions(options?: ComponentIslandsOptions): ResolvedOptions;
