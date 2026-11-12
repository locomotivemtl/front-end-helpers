import { dispatchIslandError } from '../events.js';

const PREFIX = '[component-islands]';

export function warn(...args: unknown[]): void {
    console.warn(PREFIX, ...args);
}

export function createDebugLog(debug: boolean): (...args: unknown[]) => void {
    return (...args) => {
        if (debug) console.log(PREFIX, ...args);
    };
}

/** Logs the error and dispatches `islands:error`. */
export function reportError(tag: string, error: unknown, attempt: number): void {
    console.error(PREFIX, `<${tag}> failed on attempt ${attempt}`, error);
    dispatchIslandError({ tag, error, attempt });
}
