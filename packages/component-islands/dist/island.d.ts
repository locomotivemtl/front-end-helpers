/**
 * Marks a file as an island so the plugin discovers it wherever it lives.
 * Returns the base class unchanged.
 */
export default function Island<T extends abstract new (...args: any[]) => HTMLElement>(Base: T): T;
