interface DomLogOptions {
    duration?: number;
}
declare function domLog(...args: unknown[]): void;
declare function domLog(args: unknown[], options?: DomLogOptions): void;
declare namespace domLog {
    var info: (...args: unknown[]) => void;
    var warn: (...args: unknown[]) => void;
    var error: (...args: unknown[]) => void;
    var debug: (...args: unknown[]) => void;
}
export { domLog };
