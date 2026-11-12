import type { GridHelperConfig } from './types';
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
    private container;
    private gridContainer;
    private storageKey;
    private isActive;
    constructor(config?: Partial<GridHelperConfig>);
    /**
     * Remove the grid overlay and its event listeners.
     */
    destroy(): void;
    /**
     * Get the current breakpoint configuration based on the window width.
     */
    private getBreakpointConfig;
    /**
     * Resolve the column count, reading the CSS variable when `columns` is one.
     */
    private getColumnCount;
    /**
     * Set grid container styles.
     */
    private setGridHelperStyles;
    /**
     * Set grid columns.
     */
    private setGridHelperColumns;
    /**
     * Set grid events for resize, load and keydown.
     */
    private setGridEvents;
    /**
     * Refresh the visible grid when the viewport or the styles change.
     */
    private handleViewportChange;
    /**
     * Handle keydown event to toggle the grid.
     */
    private handleKeyDown;
    /**
     * Show or hide the grid and remember the choice for the next page load.
     */
    private setActive;
    /**
     * Apply the configuration that matches the current viewport.
     */
    private update;
    private readStoredState;
    private writeStoredState;
}
export * from './types';
