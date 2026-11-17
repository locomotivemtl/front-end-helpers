import { createActivation, type RevivePayload } from './activation.js';

export type { RevivePayload };

export interface IslandsRuntime {
    scan(root?: Element | null): void;
    observe(root?: Element | null): void;
    unobserve(root?: Element | null): void;
    disconnect(): void;
}

const noop = () => {};
const inertRuntime: IslandsRuntime = {
    scan: noop,
    observe: noop,
    unobserve: noop,
    disconnect: noop
};

/**
 * Starts the runtime. A missing root means `document.body`; `null` does nothing,
 * so a failed `querySelector` never scans or disconnects by accident.
 */
export function revive(payload: RevivePayload): IslandsRuntime {
    // The module may be imported during SSR, where there is no document.
    if (typeof document === 'undefined') return inertRuntime;

    const activation = createActivation(payload);
    let stopped = false;

    // The html element, not body: a router that swaps body still gets observed.
    const observer = new MutationObserver((records) => {
        activation.prune();
        for (const record of records) {
            for (const node of record.addedNodes) {
                if (node instanceof Element) activation.walk(node);
            }
        }
    });

    function start() {
        observer.observe(document.documentElement, { childList: true, subtree: true });
        activation.walk(document.body);
    }

    function disconnect() {
        if (stopped) return;
        stopped = true;
        document.removeEventListener('DOMContentLoaded', start);
        observer.disconnect();
        activation.stop();
    }

    function withRoot(root: Element | null | undefined, fn: ($root: Element) => void) {
        if (stopped || root === null) return;
        fn(root ?? document.body);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

    return {
        scan: (root) => withRoot(root, activation.walk),
        observe: (root) => withRoot(root, activation.observe),
        unobserve(root) {
            if (root === undefined || root === document.body) disconnect();
            else withRoot(root, activation.unobserve);
        },
        disconnect
    };
}
