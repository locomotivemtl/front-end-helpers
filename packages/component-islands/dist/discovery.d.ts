import type { Alias } from 'vite';
/** Maps each tag to the file that defines it. */
export type Inventory = Map<string, string>;
/** Turns root-relative paths and alias paths into absolute directories. */
export declare function resolveDirectories(directories: string[], root: string, aliases: readonly Alias[]): string[];
export declare function isSourceFile(file: string): boolean;
export declare function isInDirectories(file: string, directories: string[]): boolean;
export declare function importsMixin(code: string): boolean;
/** The import path for a file: root-relative inside the root, absolute outside it. */
export declare function toImportPath(file: string, root: string): string;
/** Reads the one static `customElements.define('tag', ...)` of an island file. */
export declare function extractTag(file: string, code: string, root: string): string;
/**
 * Finds every island: all sources under the island directories, plus any source
 * in the project that imports the Island mixin. Throws when a tag is missing or owned twice.
 */
export declare function discoverIslands(root: string, directories: string[]): Promise<Inventory>;
