type CSSVariable = `var(--${string})`;
export type GridHelperConfig = SharedGridConfig & {
    /**
    * The breakpoints for the grid. The key is the minimum width of the breakpoint.
    */
    breakpoints?: {
        [key: string]: Partial<GridHelperBreakpointConfig>;
    };
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
