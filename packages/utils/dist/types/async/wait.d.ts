export declare const wait: (ms: number) => Promise<void>;
export declare const nextFrame: () => Promise<null>;
export declare const nextTick: (times?: number) => Promise<void>;
export declare const nextMicrotask: () => Promise<void>;
export declare const rafSetInterval: (cb: (cancel: () => void) => void, ms: number) => {
    cancel: () => void;
};
export declare const rafWait: (ms: number) => Promise<void>;
