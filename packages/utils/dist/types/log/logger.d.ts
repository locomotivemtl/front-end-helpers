interface LoggerOptions {
    id?: string;
    color?: string;
    backgroundColor?: string;
}
export interface Logger {
    log: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    table: (tabularData: unknown) => void;
    time: (label?: string) => void;
    timeEnd: (label?: string) => void;
    group: (...label: unknown[]) => void;
    groupEnd: () => void;
    groupCollapsed: (...label: unknown[]) => void;
    clear: () => void;
}
export declare function createLogger(options?: LoggerOptions): Logger;
export {};
