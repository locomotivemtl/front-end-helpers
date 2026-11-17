import { dispatchIslandLoad } from '../events.js';
import type { ClientDirective, RuntimeOptions } from '../options.js';
import { waitForGate } from './gate.js';
import { loadIsland } from './load.js';
import { createDebugLog, reportError } from './log.js';

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

interface Pending {
    $el: HTMLElement;
    controller: AbortController;
    /** Once the gate has passed the module load runs to the end, whoever leaves. */
    loading: boolean;
}

/** One activation per tag: the first element's directives gate the module load. */
export function createActivation(payload: RevivePayload): Activation {
    const { options, customDirectives } = payload;
    const loaders = new Map(Object.entries(payload.islands));
    const selector = [...loaders.keys()].join(',');
    const log = createDebugLog(options.debug);
    const loaded = new Set<string>();
    const pending = new Map<string, Pending>();
    const unobserved = new Set<Element>();

    const isUnobserved = ($el: Element) => [...unobserved].some(($root) => $root.contains($el));

    // A tag imported eagerly elsewhere is already in the registry, so it needs no gate.
    const isLoaded = (tag: string) => loaded.has(tag) || customElements.get(tag) !== undefined;

    // A child island waits for its parent module so it activates with its own directives.
    function hasUnloadedParent($el: Element): boolean {
        for (let $parent = $el.parentElement; $parent; $parent = $parent.parentElement) {
            if (loaders.has($parent.localName) && !isLoaded($parent.localName)) return true;
        }
        return false;
    }

    function activate($el: HTMLElement) {
        const tag = $el.localName;
        if (isLoaded(tag) || pending.has(tag)) return;
        if (isUnobserved($el) || hasUnloadedParent($el)) return;
        void run(tag, $el);
    }

    async function run(tag: string, $el: HTMLElement) {
        const entry: Pending = { $el, controller: new AbortController(), loading: false };
        const { signal } = entry.controller;
        pending.set(tag, entry);
        log(`<${tag}> discovered`);

        try {
            await waitForGate($el, options, customDirectives, signal);
        } catch (error) {
            if (signal.aborted) return;
            pending.delete(tag);
            reportError(tag, error, 1);
            return;
        }

        entry.loading = true;
        log(`<${tag}> gate passed, loading`);
        const loader = loaders.get(tag)!;
        const result = await loadIsland(tag, loader, options.retry, signal);
        if (pending.get(tag) === entry) pending.delete(tag);
        if (!result) return;

        loaded.add(tag);
        log(`<${tag}> loaded in ${Math.round(result.duration)}ms`);
        dispatchIslandLoad({ tag, ...result });
        for (const $loaded of document.getElementsByTagName(tag)) walk($loaded);
    }

    // Hands the tag to the next connected, observed element, if there is one.
    function abort(tag: string) {
        pending.get(tag)?.controller.abort();
        pending.delete(tag);
        for (const $next of document.getElementsByTagName(tag)) {
            activate($next as HTMLElement);
            if (pending.has(tag)) return;
        }
    }

    function walk($root: Element) {
        if (!selector || isUnobserved($root)) return;
        if ($root.matches(selector)) activate($root as HTMLElement);
        for (const $el of $root.querySelectorAll<HTMLElement>(selector)) activate($el);
    }

    return {
        walk,
        observe($root) {
            unobserved.delete($root);
            walk($root);
        },
        unobserve($root) {
            unobserved.add($root);
            for (const [tag, entry] of [...pending]) {
                if (!entry.loading && $root.contains(entry.$el)) abort(tag);
            }
        },
        prune() {
            for (const [tag, entry] of [...pending]) {
                if (!entry.loading && !entry.$el.isConnected) abort(tag);
            }
        },
        stop() {
            for (const entry of pending.values()) entry.controller.abort();
            pending.clear();
            unobserved.clear();
        }
    };
}
