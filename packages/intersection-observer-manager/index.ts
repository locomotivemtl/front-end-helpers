/**
 * Static class to manage IntersectionObservers for all elements
 * Automatically creates separate observers for different rootMargin values
 * Usage: Add data-inview attribute to elements you want to observe
 */
export class IntersectionObserverManager {
    private static observers: Map<string, IntersectionObserver> = new Map();
    private static observedElements: Map<Element, ObserverConfig> = new Map();
    private static defaultRootMargin: string = '0px 0px 0px 0px';

    private static readonly CONFIG = {
        ATTRIBUTES: {
            TRIGGER: 'data-inview',
            CLASS: 'data-inview-class',
            TOGGLE: 'data-inview-toggle',
            ROOT_MARGIN: 'data-inview-root-margin'
        },
        DEFAULT_CLASS: 'is-inview',
        EVENTS: {
            READY: 'intersectionObserverManager:ready',
            DESTROYED: 'intersectionObserverManager:destroyed'
        }
    } as const;

    // =============================================================================
    // Public API
    // =============================================================================

    /**
     * Initialize the IntersectionObserver(s) and observe all elements with data-inview
     * @param defaultRootMargin - Default root margin for elements without data-inview-root-margin
     */
    public static init(defaultRootMargin: string = this.defaultRootMargin): void {
        this.defaultRootMargin = defaultRootMargin;
        this.observeAll();
        window.dispatchEvent(new CustomEvent(this.CONFIG.EVENTS.READY));
    }

    /**
     * Destroy all IntersectionObservers and clear all observed elements
     */
    public static destroy(): void {
        this.observers.forEach((observer) => observer.disconnect());
        this.observers.clear();
        this.observedElements.clear();
        window.dispatchEvent(new CustomEvent(this.CONFIG.EVENTS.DESTROYED));
    }

    /**
     * Add a single element to be observed
     * Useful for dynamically added elements
     * @param element - Element to observe
     * @param callback - Optional callback function called on intersection changes
     * @param options - Optional configuration overrides
     */
    public static observe(
        element: Element,
        callback?: IntersectionCallback,
        options?: Partial<ObserveOptions>
    ): void {
        if (this.observedElements.has(element)) {
            return; // Already observed
        }

        const config =
            callback || options
                ? this.getElementConfigWithOverrides(element, callback, options)
                : this.getElementConfig(element);

        const observer = this.getOrCreateObserver(config.rootMargin);

        this.observedElements.set(element, config);
        observer.observe(element);
    }

    /**
     * Remove a single element from observation
     * @param element - Element to unobserve
     */
    public static unobserve(element: Element): void {
        const config = this.observedElements.get(element);
        if (!config) return;

        const observer = this.observers.get(config.rootMargin);
        if (observer) {
            observer.unobserve(element);
        }

        this.observedElements.delete(element);
    }

    /**
     * Refresh: re-observe all elements with data-inview attribute
     * Useful when you don't control when elements are added or removed
     */
    public static refresh(): void {
        // Unobserve elements that no longer exist in DOM
        const elementsToRemove: Element[] = [];
        this.observedElements.forEach((_, element) => {
            if (!document.body.contains(element)) {
                elementsToRemove.push(element);
            }
        });
        elementsToRemove.forEach((el) => this.unobserve(el));

        // Observe new elements
        this.observeAll();
    }

    /**
     * Get stats about observers (useful for debugging)
     */
    public static getStats(): ObserverStats {
        return {
            observerCount: this.observers.size,
            elementCount: this.observedElements.size,
            rootMargins: Array.from(this.observers.keys())
        };
    }

    // =============================================================================
    // Private Methods
    // =============================================================================

    /**
     * Get or create an IntersectionObserver for a specific rootMargin
     * @param rootMargin - Root margin value
     * @returns IntersectionObserver instance
     */
    private static getOrCreateObserver(rootMargin: string): IntersectionObserver {
        if (!this.observers.has(rootMargin)) {
            const observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin,
                    threshold: 0
                }
            );
            this.observers.set(rootMargin, observer);
        }

        return this.observers.get(rootMargin)!;
    }

    /**
     * Find and observe all elements with data-inview attribute
     */
    private static observeAll(): void {
        const elements = document.querySelectorAll(`[${this.CONFIG.ATTRIBUTES.TRIGGER}]`);
        elements.forEach((element) => this.observe(element));
    }

    /**
     * Get configuration for a specific element
     * @param element - Element to get config for
     * @returns ObserverConfig object
     */
    private static getElementConfig(element: Element): ObserverConfig {
        const rootMargin =
            element.getAttribute(this.CONFIG.ATTRIBUTES.ROOT_MARGIN) || this.defaultRootMargin;

        return {
            className:
                element.getAttribute(this.CONFIG.ATTRIBUTES.CLASS) || this.CONFIG.DEFAULT_CLASS,
            shouldToggle: element.hasAttribute(this.CONFIG.ATTRIBUTES.TOGGLE),
            rootMargin
        };
    }

    /**
     * Get configuration with JavaScript overrides
     * @param element - Element to get config for
     * @param callback - Optional callback
     * @param options - Optional config overrides
     * @returns ObserverConfig object
     */
    private static getElementConfigWithOverrides(
        element: Element,
        callback?: IntersectionCallback,
        options?: Partial<ObserveOptions>
    ): ObserverConfig {
        const baseConfig = this.getElementConfig(element);

        return {
            ...baseConfig,
            ...(options?.className && { className: options.className }),
            ...(options?.shouldToggle !== undefined && { shouldToggle: options.shouldToggle }),
            ...(options?.rootMargin && { rootMargin: options.rootMargin }),
            ...(callback && { callback })
        };
    }

    /**
     * Handle intersection events
     * @param entries - IntersectionObserver entries
     */
    private static handleIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            const config = this.observedElements.get(entry.target);
            if (!config) return;

            const isIntersecting = entry.isIntersecting;

            // Call custom callback if provided
            if (config.callback) {
                config.callback(entry, isIntersecting);
            }

            // Handle class toggling
            if (isIntersecting) {
                entry.target.classList.add(config.className);

                // If not toggling, unobserve after first intersection
                if (!config.shouldToggle) {
                    this.unobserve(entry.target);
                }
            } else if (config.shouldToggle) {
                entry.target.classList.remove(config.className);
            }
        });
    }
}

// =============================================================================
// Types
// =============================================================================

interface ObserverConfig {
    className: string;
    shouldToggle: boolean;
    rootMargin: string;
    callback?: IntersectionCallback;
}

interface ObserveOptions {
    className: string;
    shouldToggle: boolean;
    rootMargin: string;
}

interface ObserverStats {
    observerCount: number;
    elementCount: number;
    rootMargins: string[];
}

type IntersectionCallback = (entry: IntersectionObserverEntry, isIntersecting: boolean) => void;
