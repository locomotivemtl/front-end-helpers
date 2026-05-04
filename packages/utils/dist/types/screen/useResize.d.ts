export interface UseResizeInstance {
    width: number;
    height: number;
    ratio: number;
    start: () => void;
    stop: () => void;
    destroy: () => void;
}
export interface UseResizeOptions {
    onUpdate?: (api: UseResizeInstance) => void;
    onDebouncedUpdate?: (api: UseResizeInstance) => void;
    debounceTime?: number;
    autoStart?: boolean;
}
export declare function useResize($el: HTMLElement, options?: UseResizeOptions): UseResizeInstance;
