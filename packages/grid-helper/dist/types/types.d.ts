type CSSVariable = `var(--${string})`;
export type GridHelperConfig = SharedGridConfig & {
    /**
    * The breakpoints for the grid. The key is the minimum width of the breakpoint.
    */
    breakpoints?: {
        [key: string]: Partial<GridHelperBreakpointConfig>;
    };
    /**
     * The element to mount the grid overlay into. Defaults to `document.body`.
     * When a custom element is provided, the grid uses `position: absolute` instead of `position: fixed`.
     * The container element must have a non-static CSS position (e.g. `position: relative`).
     */
    container?: HTMLElement;
};
export type SharedGridConfig = {
    columns: number | CSSVariable;
    gutterWidth: string;
    marginWidth: string;
    color: string;
    opacity: number;
    key: string;
};
export type GridHelperBreakpointConfig = SharedGridConfig;
export {};
