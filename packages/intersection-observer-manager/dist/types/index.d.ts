/**
 * Static class to manage IntersectionObservers for all elements
 * Automatically creates separate observers for different rootMargin values
 * Usage: Add data-inview attribute to elements you want to observe
 */
export declare class IntersectionObserverManager {
    private static observers;
    private static observedElements;
    private static defaultRootMargin;
    private static readonly CONFIG;
    /**
     * Initialize the IntersectionObserver(s) and observe all elements with data-inview
     * @param defaultRootMargin - Default root margin for elements without data-inview-root-margin
     */
    static init(defaultRootMargin?: string): void;
    /**
     * Destroy all IntersectionObservers and clear all observed elements
     */
    static destroy(): void;
    /**
     * Add a single element to be observed
     * Useful for dynamically added elements
     * @param element - Element to observe
     * @param callback - Optional callback function called on intersection changes
     * @param options - Optional configuration overrides
     */
    static observe(element: Element, callback?: IntersectionCallback, options?: Partial<ObserveOptions>): void;
    /**
     * Remove a single element from observation
     * @param element - Element to unobserve
     */
    static unobserve(element: Element): void;
    /**
     * Refresh: re-observe all elements with data-inview attribute
     * Useful when you don't control when elements are added or removed
     */
    static refresh(): void;
    /**
     * Get stats about observers (useful for debugging)
     */
    static getStats(): ObserverStats;
    /**
     * Get or create an IntersectionObserver for a specific rootMargin
     * @param rootMargin - Root margin value
     * @returns IntersectionObserver instance
     */
    private static getOrCreateObserver;
    /**
     * Find and observe all elements with data-inview attribute
     */
    private static observeAll;
    /**
     * Get configuration for a specific element
     * @param element - Element to get config for
     * @returns ObserverConfig object
     */
    private static getElementConfig;
    /**
     * Get configuration with JavaScript overrides
     * @param element - Element to get config for
     * @param callback - Optional callback
     * @param options - Optional config overrides
     * @returns ObserverConfig object
     */
    private static getElementConfigWithOverrides;
    /**
     * Handle intersection events
     * @param entries - IntersectionObserver entries
     */
    private static handleIntersection;
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
export {};
