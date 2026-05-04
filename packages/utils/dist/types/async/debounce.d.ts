export type Debounce<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};
export type Throttle<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;
export declare const debounce: <T extends (...args: any[]) => void>(fn: T, ms: number) => Debounce<T>;
export declare const throttle: <T extends (...args: any[]) => void>(fn: T, ms: number) => Throttle<T>;
