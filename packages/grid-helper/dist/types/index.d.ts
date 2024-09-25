import { GridHelperConfig } from './types';
/**
 * Grid Helper
 *
 * Provides a grid based on the design guidelines and is helpful for web integration.
 *
 * - `Control + g` to toggle the grid
 *
 */
export default class GridHelper {
    private sharedConfig;
    private breakpoints;
    private currentBreakpointConfig;
    private previousBreakpointConfig;
    private gridContainer;
    private isActive;
    private ctrlDown;
    constructor(config?: Partial<GridHelperConfig>);
    /**
     * Deep merge user config with default config
     */
    private mergeConfig;
    /**
     * Initialize the grid helper by setting styles, columns, and events.
     */
    private initialize;
    /**
     * Get the current breakpoint configuration based on the window width.
     */
    private getBreakpointConfig;
    private extractCSSVariable;
    /**
     * Set grid container styles.
     */
    private setGridHelperStyles;
    /**
     * Set grid columns.
     */
    private setGridHelperColumns;
    /**
     * Set grid events for resize and keydown.
     */
    private setGridEvents;
    /**
     * Handle keydown event to toggle the grid.
     */
    private handleKeyDown;
    /**
     * Handle keyup event to reset Control key state.
     */
    private handleKeyUp;
    /**
     * Toggle the visibility of the grid.
     */
    private toggleGridVisibility;
}
export * from './types';
