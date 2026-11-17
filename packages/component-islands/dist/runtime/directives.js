import { abortable } from './abortable.js';
export function waitVisible($el, rootMargin, threshold, signal) {
    return abortable(signal, (done) => {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting))
                done();
        }, { rootMargin, threshold });
        observer.observe($el);
        return () => observer.disconnect();
    });
}
export function waitMedia(query, signal) {
    return abortable(signal, (done) => {
        const list = window.matchMedia(query);
        if (list.matches) {
            done();
            return () => { };
        }
        list.addEventListener('change', done);
        return () => list.removeEventListener('change', done);
    });
}
export function waitIdle(timeout, signal) {
    return abortable(signal, (done) => {
        if (!('requestIdleCallback' in window)) {
            const timer = setTimeout(done, timeout);
            return () => clearTimeout(timer);
        }
        const id = window.requestIdleCallback(() => done(), { timeout });
        return () => window.cancelIdleCallback(id);
    });
}
export function waitDelay(ms, signal) {
    return abortable(signal, (done) => {
        const timer = setTimeout(done, ms);
        return () => clearTimeout(timer);
    });
}
export function waitInteraction($el, events, signal) {
    return abortable(signal, (done) => {
        // Passive keeps touchstart from triggering Chrome's non-passive listener warning.
        for (const name of events)
            $el.addEventListener(name, done, { passive: true });
        return () => {
            for (const name of events)
                $el.removeEventListener(name, done);
        };
    });
}
/** Resolves when the directive calls `load()`. A throw or rejection fails the wait. */
export function waitCustom(directive, options, $el, signal) {
    return abortable(signal, (done, fail) => {
        const cleanups = [];
        const ctx = { signal, onCleanup: (fn) => void cleanups.push(fn) };
        const load = () => {
            done();
            return Promise.resolve();
        };
        try {
            Promise.resolve(directive(load, options, $el, ctx)).catch(fail);
        }
        catch (error) {
            fail(error);
        }
        return () => {
            for (const fn of cleanups)
                fn();
        };
    });
}
