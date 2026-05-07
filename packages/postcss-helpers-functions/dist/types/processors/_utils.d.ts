/** Split a string by top-level commas, ignoring commas inside parentheses. */
export declare function splitArgs(input: string): string[];
/**
 * Find all `processor_name(...)` calls in a CSS value string and replace them.
 * Handles nested parentheses (e.g. CSS vars with fallbacks).
 * Return null from transform to leave the call unchanged.
 */
export declare function replaceCSSFunction(value: string, name: string, transform: (args: string[]) => string | null): string;
