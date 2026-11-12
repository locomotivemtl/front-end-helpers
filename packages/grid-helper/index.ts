import type { GridHelperBreakpointConfig, GridHelperConfig, SharedGridConfig } from './types';

const DEFAULT_COLUMNS = 12;

const DEFAULT_CONFIG: SharedGridConfig = {
    columns: DEFAULT_COLUMNS,
    gutterWidth: '16px',
    marginWidth: '16px',
    color: 'red',
    opacity: 0.1,
    key: 'g'
};

/**
 * Grid Helper
 *
 * Provides a grid based on the design guidelines and is helpful for web integration.
 *
 * - `Control + g` to toggle the grid
 *
 */
export default class GridHelper {
    private sharedConfig: SharedGridConfig;
    private breakpoints: [minWidth: number, config: Partial<GridHelperBreakpointConfig>][];
    private currentBreakpointConfig: GridHelperBreakpointConfig;
    private container: HTMLElement;
    private gridContainer: HTMLElement;
    private isActive: boolean = false;

    constructor(config: Partial<GridHelperConfig> = {}) {
        const { container, breakpoints = {}, ...sharedConfig } = config;

        this.container = container ?? document.body;
        this.sharedConfig = { ...DEFAULT_CONFIG, ...sharedConfig };
        this.breakpoints = Object.keys(breakpoints)
            .map((minWidth): [number, Partial<GridHelperBreakpointConfig>] => [
                parseInt(minWidth),
                breakpoints[minWidth]
            ])
            .sort((a, b) => a[0] - b[0]);

        this.currentBreakpointConfig = this.getBreakpointConfig();

        this.gridContainer = document.createElement('div');
        this.container.append(this.gridContainer);

        this.setGridEvents();
        this.update();
    }

    /**
     * Remove the grid overlay and its event listeners.
     */
    public destroy() {
        window.removeEventListener('resize', this.handleViewportChange);
        document.removeEventListener('keydown', this.handleKeyDown);
        this.gridContainer.remove();
    }

    /**
     * Get the current breakpoint configuration based on the window width.
     */
    private getBreakpointConfig(): GridHelperBreakpointConfig {
        const width = window.innerWidth;
        let matchedBreakpointConfig: GridHelperBreakpointConfig = this.sharedConfig;

        // Breakpoints are sorted, so the last match is the widest one that fits
        for (const [minWidth, config] of this.breakpoints) {
            if (width >= minWidth) {
                matchedBreakpointConfig = { ...this.sharedConfig, ...config };
            }
        }

        return matchedBreakpointConfig;
    }

    /**
     * Resolve the column count, reading the CSS variable when `columns` is one.
     */
    private getColumnCount(): number {
        const { columns } = this.currentBreakpointConfig;

        if (typeof columns === 'number') {
            return columns;
        }

        const cssVariable = columns.match(/var\(\s*(--[\w-]+)/)?.[1];

        if (!cssVariable) {
            return DEFAULT_COLUMNS;
        }

        // Read from the grid element so a variable scoped to the container resolves
        const cssValue = getComputedStyle(this.gridContainer).getPropertyValue(cssVariable);
        const count = parseInt(cssValue);

        return isNaN(count) ? DEFAULT_COLUMNS : count;
    }

    /**
     * Set grid container styles.
     */
    private setGridHelperStyles() {
        const elStyles = this.gridContainer.style;
        elStyles.zIndex = '10000';
        elStyles.position = this.container === document.body ? 'fixed' : 'absolute';
        elStyles.top = '0';
        elStyles.left = '0';
        elStyles.display = 'flex';
        elStyles.width = '100%';
        elStyles.height = '100%';
        elStyles.columnGap = `${this.currentBreakpointConfig.gutterWidth}`;
        elStyles.paddingLeft = `${this.currentBreakpointConfig.marginWidth}`;
        elStyles.paddingRight = `${this.currentBreakpointConfig.marginWidth}`;
        elStyles.pointerEvents = 'none';
        elStyles.visibility = this.isActive ? 'visible' : 'hidden';
    }

    /**
     * Set grid columns.
     */
    private setGridHelperColumns() {
        this.gridContainer.innerHTML = '';

        const columns = this.getColumnCount();

        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.style.flex = '1 1 0';
            column.style.backgroundColor = this.currentBreakpointConfig.color;
            column.style.opacity = `${this.currentBreakpointConfig.opacity}`;
            this.gridContainer.appendChild(column);
        }
    }

    /**
     * Set grid events for resize and keydown.
     */
    private setGridEvents() {
        window.addEventListener('resize', this.handleViewportChange);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Refresh the visible grid when the viewport changes.
     */
    private handleViewportChange = () => {
        if (this.isActive) {
            this.update();
        }
    };

    /**
     * Handle keydown event to toggle the grid.
     */
    private handleKeyDown = (e: KeyboardEvent) => {
        if (!e.ctrlKey || e.repeat) {
            return;
        }

        if (e.key.toLowerCase() === this.sharedConfig.key.toLowerCase()) {
            this.setActive(!this.isActive);
        }
    };

    /**
     * Show or hide the grid.
     */
    private setActive(isActive: boolean) {
        this.isActive = isActive;
        this.update();
    }

    /**
     * Apply the configuration that matches the current viewport.
     */
    private update() {
        this.currentBreakpointConfig = this.getBreakpointConfig();

        this.setGridHelperStyles();
        this.setGridHelperColumns();
    }
}

export * from './types';
