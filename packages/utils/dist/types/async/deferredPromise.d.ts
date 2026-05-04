export interface DeferredPromise<T = PromiseLike<unknown>> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export type DeferredPromiseResolve<T = unknown> = (value: T | PromiseLike<T>) => void;
export type DeferredPromiseReject = (reason?: any) => void;
export declare function deferredPromise<T = unknown>(): DeferredPromise<T>;
