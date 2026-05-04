export interface UseDPRInstance {
    value: number;
    start: () => void;
    stop: () => void;
}
export declare function useDPR(onUpdate?: (value: number) => void): UseDPRInstance;
