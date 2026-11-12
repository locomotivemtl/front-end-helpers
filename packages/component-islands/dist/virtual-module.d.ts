import { type Inventory } from './discovery.js';
import type { ResolvedOptions } from './options.js';
export declare const VIRTUAL_ID = "@locomotivemtl/component-islands/revive";
export declare const RESOLVED_VIRTUAL_ID = "\0@locomotivemtl/component-islands/revive";
interface VirtualModuleInput {
    root: string;
    inventory: Inventory;
    options: ResolvedOptions;
    /** Resolves a custom directive entrypoint to a file id, or null. */
    resolve(entrypoint: string): Promise<string | null>;
}
/** Emits the module behind `@locomotivemtl/component-islands/revive`. */
export declare function createVirtualModule({ root, inventory, options, resolve }: VirtualModuleInput): Promise<string>;
export {};
