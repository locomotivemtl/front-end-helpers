export declare function warn(...args: unknown[]): void;
export declare function createDebugLog(debug: boolean): (...args: unknown[]) => void;
/** Logs the error and dispatches `islands:error`. */
export declare function reportError(tag: string, error: unknown, attempt: number): void;
