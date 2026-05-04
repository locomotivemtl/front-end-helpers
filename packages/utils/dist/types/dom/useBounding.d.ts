import { type WritableAtom } from 'nanostores';
export interface DynamicBoundingRect {
    $el: HTMLElement;
    data: WritableAtom<DOMRectReadOnly>;
    update: () => void;
    dispose: () => void;
}
export declare function useBoundingRect($el: HTMLElement, options?: {
    callback: (rect: DOMRectReadOnly) => void;
    updateOnResize: boolean;
}): DynamicBoundingRect;
