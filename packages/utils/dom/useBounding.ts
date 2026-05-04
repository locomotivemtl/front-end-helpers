import { map, type WritableAtom } from 'nanostores';

export interface DynamicBoundingRect {
    $el: HTMLElement;
    data: WritableAtom<DOMRectReadOnly>;
    update: () => void;
    dispose: () => void;
}

export function useBoundingRect(
    $el: HTMLElement,
    options: {
        callback: (rect: DOMRectReadOnly) => void;
        updateOnResize: boolean;
    } = {
        callback: () => {},
        updateOnResize: true
    }
): DynamicBoundingRect {
    if (!($el instanceof HTMLElement)) {
        throw new TypeError('Expected an HTMLElement');
    }

    let _unlistenResize: () => void = () => {};
    let _unlistenScroll: () => void = () => {};

    const data = map($el.getBoundingClientRect());
    const update = () => {
        data.set($el.getBoundingClientRect());
        options.callback(data.get());
    };

    if (options.updateOnResize) {
        // Use ResizeObserver callback result to
        // avoid compute twice bounding client rect
        const _update = (entries: ResizeObserverEntry[]) => {
            const entry = entries[0] as ResizeObserverEntry;
            data.set(entry.contentRect);
            options.callback(data.get());
        };
        const RO = new ResizeObserver(_update);
        RO.observe($el);
        _unlistenResize = () => {
            RO.unobserve($el);
            RO.disconnect();
        };
    }

    update();

    return {
        $el,
        update,
        data,
        dispose: () => {
            _unlistenResize?.();
            data.off();
        }
    };
}
