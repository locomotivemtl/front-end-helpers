const LOAD_EVENT = 'islands:load';
const ERROR_EVENT = 'islands:error';
export function dispatchIslandLoad(detail) {
    document.dispatchEvent(new CustomEvent(LOAD_EVENT, { detail }));
}
export function dispatchIslandError(detail) {
    document.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail }));
}
/** Listens for `islands:load`. Returns the unsubscribe function. */
export function onIslandLoad(fn) {
    const listener = (e) => fn(e.detail);
    document.addEventListener(LOAD_EVENT, listener);
    return () => document.removeEventListener(LOAD_EVENT, listener);
}
/** Listens for `islands:error`. Returns the unsubscribe function. */
export function onIslandError(fn) {
    const listener = (e) => fn(e.detail);
    document.addEventListener(ERROR_EVENT, listener);
    return () => document.removeEventListener(ERROR_EVENT, listener);
}
