export interface UseScreenInstance {
    width: number;
    height: number;
    ratio: number;
    dpr: number;
    start: () => void;
    stop: () => void;
}
export interface UseScreenOptions {
    onUpdate?: (api: UseScreenInstance) => void;
    onDebouncedUpdate?: (api: UseScreenInstance) => void;
    debounceTime?: number;
}
export declare function useScreen(options?: UseScreenOptions): UseScreenInstance;
