import { atom } from 'nanostores';

/**
 * Global window interface for component manager bridge
 */
declare global {
    interface Window {
        COMPONENT_MANAGER_DEBUG?: boolean;
        ComponentManager?: {
            components: ManagedComponent[];
            getById: (id: string) => ManagedComponent | undefined;
            getByPrototype: (prototype: string) => ManagedComponent[];
            find: (predicate: (component: ManagedComponent) => boolean) => ManagedComponent[];
            getRegisteredPrototypes: () => string[];
            getComponentCount: () => number;
        };
    }
}

/**
 * Improve TypeScript support
 */
export type ManagedComponent = HTMLElement & {
    prototypeType: string;
    id: string;
};

/**
 * Base interface for components that can be used with getComponentById generic
 */
export interface ComponentLike extends Partial<ManagedComponent> {
    id: string;
}

export type ComponentElementType =
    | InstanceType<ReturnType<typeof ComponentElement>>
    | ManagedComponent;

/**
 * Component Manager debug configuration
 * Automatically enables debug if window.COMPONENT_MANAGER_DEBUG is set to true
 */
const isDebugEnabled = (): boolean => {
    try {
        return typeof window !== 'undefined' && window.COMPONENT_MANAGER_DEBUG === true;
    } catch (e) {
        return false;
    }
};

/**
 * Store to manage custom elements and their lifecycle
 */
export const $componentsManagerIncrement = atom<number>(0);
export const $componentsManager = atom<ManagedComponent[]>([]);

/**
 * Cache management for getComponentsByPrototype optimization
 */
let prototypeCache = new Map<string, ManagedComponent[]>();
let cacheStoreSnapshot: ManagedComponent[] = [];

/**
 * Initialize global window bridge for component manager
 * This allows external libraries to access components without nanostores dependency
 * Only exposes safe, read-only operations
 */
const initializeWindowBridge = () => {
    if (typeof window !== 'undefined') {
        const componentManager = {
            getById: (id: string) => getComponentById(id),
            getByPrototype: (prototype: string) => getComponentsByPrototype(prototype),
            find: (predicate: (component: ManagedComponent) => boolean) =>
                findComponents(predicate),
            getRegisteredPrototypes: () => getRegisteredPrototypes(),
            getComponentCount: () => getComponentCount()
        } as any; // Type assertion to avoid TypeScript issues with Object.defineProperty

        // Define the components getter using Object.defineProperty for better compatibility
        Object.defineProperty(componentManager, 'components', {
            get: () => $componentsManager.get(),
            enumerable: true,
            configurable: false
        });

        window.ComponentManager = componentManager;
    }
};

/**
 * Class to create custom elements with management features
 */
export const ComponentElement = <BaseClass extends CustomElementConstructor>(
    Base: BaseClass,
    className: string
) => {
    return class extends Base {
        prototypeType: string;

        constructor(...args: any[]) {
            super(...args);
            this.prototypeType = className;

            if (!this.id) {
                const index = $componentsManagerIncrement.get() + 1;
                $componentsManagerIncrement.set(index);
                this.id = `${this.prototypeType.toLowerCase()}-${index}`;
            }

            if (isDebugEnabled()) {
                console.log(`🔧 ComponentManager: "${this.id}" (${this.prototypeType}) registered`);
            }
        }

        connectedCallback() {
            if (typeof (Base.prototype as any).connectedCallback === 'function') {
                (Base.prototype as any).connectedCallback.call(this);
            }
            $componentsManager.set([
                ...$componentsManager.get(),
                this as unknown as ManagedComponent
            ]);

            if (isDebugEnabled()) {
                console.log(`✅ ComponentManager: "${this.id}" connected to DOM`);
            }
        }

        disconnectedCallback() {
            if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
                (Base.prototype as any).disconnectedCallback.call(this);
            }
            $componentsManager.set(
                $componentsManager.get().filter(($component) => $component.id !== this.id)
            );

            if (isDebugEnabled()) {
                console.log(`❌ ComponentManager: "${this.id}" disconnected from DOM`);
            }
        }
    };
};

/**
 * Get a component by its unique ID with improved type safety
 */
export const getComponentById = <T extends ComponentLike = ManagedComponent>(
    id: string
): T | undefined => {
    return $componentsManager.get().find(($component) => $component.id === id) as T | undefined;
};

/**
 * Get all components of a specific prototype, with optional exclusion filters
 * Includes performance optimization with caching for frequently called queries
 */
export const getComponentsByPrototype = (
    prototype: string,
    selectorsToExclude: string[] | string | HTMLElement | ManagedComponent = []
): ManagedComponent[] => {
    const currentStore = $componentsManager.get();
    
    // Invalidate cache if store changed
    if (currentStore !== cacheStoreSnapshot) {
        prototypeCache.clear();
        cacheStoreSnapshot = currentStore;
    }

    // Only cache when no exclusions (most common case)
    const hasExclusions = Array.isArray(selectorsToExclude) ? selectorsToExclude.length > 0 
        : selectorsToExclude !== '';
        
    if (!hasExclusions) {
        if (prototypeCache.has(prototype)) {
            return prototypeCache.get(prototype)!;
        }
    }

    // Build exclusion selectors
    let excludedSelectors: string[] = [];

    if (typeof selectorsToExclude === 'string') {
        excludedSelectors = [selectorsToExclude];
    } else if (Array.isArray(selectorsToExclude)) {
        excludedSelectors = selectorsToExclude;
    } else if (selectorsToExclude instanceof HTMLElement && selectorsToExclude.id) {
        excludedSelectors = [`#${selectorsToExclude.id}`];
    }

    // Filter components
    const result = currentStore.filter(($component: ManagedComponent) => {
        return (
            prototype === $component.prototypeType &&
            !excludedSelectors.some(
                (selector: string) => $component.matches && $component.matches(selector)
            )
        );
    });

    // Cache result if no exclusions
    if (!hasExclusions) {
        prototypeCache.set(prototype, result);
    }

    return result;
};

/**
 * Find components using a custom predicate function
 * @param predicate - Function that returns true for components to include
 * @returns Array of matching components
 *
 * @example
 * // Find components with specific attributes
 * const activeComponents = findComponents($component => $component.hasAttribute('active'));
 * 
 * // Find components by custom criteria
 * const openDialogs = findComponents(comp => 
 *   comp.prototypeType === 'Dialog' && comp.hasAttribute('open')
 * );
 */
export const findComponents = (
    predicate: (component: ManagedComponent) => boolean
): ManagedComponent[] => {
    return $componentsManager.get().filter(predicate);
};

/**
 * Get all registered prototype types
 * @returns Array of unique prototype names
 */
export const getRegisteredPrototypes = (): string[] => {
    const prototypes = new Set(
        $componentsManager.get().map(($component) => $component.prototypeType)
    );
    return Array.from(prototypes);
};

/**
 * Get component statistics
 * @returns Object with component counts by prototype
 */
export const getComponentStats = (): Record<string, number> => {
    const stats: Record<string, number> = {};

    $componentsManager.get().forEach(($component) => {
        const type = $component.prototypeType;
        stats[type] = (stats[type] || 0) + 1;
    });

    return stats;
};

/**
 * Get the total number of managed components
 */
export const getComponentCount = (): number => {
    return $componentsManager.get().length;
};

// Initialize the bridge after all functions are defined  
initializeWindowBridge();

// Default export for convenience
export default {
    ComponentElement,
    getComponentById,
    getComponentsByPrototype,
    findComponents,
    getRegisteredPrototypes,
    getComponentStats,
    getComponentCount
};