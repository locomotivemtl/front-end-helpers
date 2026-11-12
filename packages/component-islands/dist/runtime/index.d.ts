import { type RevivePayload } from './activation.js';
export type { RevivePayload };
export interface IslandsRuntime {
    scan(root?: Element | null): void;
    observe(root?: Element | null): void;
    unobserve(root?: Element | null): void;
    disconnect(): void;
}
/**
 * Starts the runtime. A missing root means `document.body`; `null` does nothing,
 * so a failed `querySelector` never scans or disconnects by accident.
 */
export declare function revive(payload: RevivePayload): IslandsRuntime;
