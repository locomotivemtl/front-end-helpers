/**
 * A reference to a CSS custom property, e.g. `var(--grid-columns)`.
 */
export type CSSVariable = `var(--${string})`;
export type GridHelperConfig = SharedGridConfig & {
    /**
     * The breakpoints for the grid. The key is the minimum viewport width of the breakpoint, in pixels.
     * A breakpoint overrides the main options; it does not inherit from narrower breakpoints.
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
    /**
     * Number of columns, or a CSS variable that holds it.
     */
    columns: number | CSSVariable;
    /**
     * Width of the gutter between columns. Any CSS length or expression:
     * `16px`, `2vw`, `1.5vmin`, `2vmax`, `var(--grid-gutter)`, `clamp(12px, 2vmin, 24px)`.
     */
    gutterWidth: string;
    /**
     * Width of the margin on each side of the grid. Any CSS length or expression:
     * `16px`, `2vw`, `1.5vmin`, `2vmax`, `var(--grid-margin)`, `clamp(12px, 2vmin, 24px)`.
     */
    marginWidth: string;
    /**
     * Color of the columns, in any CSS color format.
     */
    color: string;
    /**
     * Opacity of the columns, from 0 to 1.
     */
    opacity: number;
    /**
     * Key that toggles the grid while Control is held. Only read from the main options.
     */
    key: string;
};
export type GridHelperBreakpointConfig = SharedGridConfig;
