import { dispatchIslandError } from '../events.js';
const PREFIX = '[component-islands]';
export function warn(...args) {
    console.warn(PREFIX, ...args);
}
export function createDebugLog(debug) {
    return (...args) => {
        if (debug)
            console.log(PREFIX, ...args);
    };
}
/** Logs the error and dispatches `islands:error`. */
export function reportError(tag, error, attempt) {
    console.error(PREFIX, `<${tag}> failed on attempt ${attempt}`, error);
    dispatchIslandError({ tag, error, attempt });
}
