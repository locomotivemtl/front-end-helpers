import { GridHelperBreakpointConfig, GridHelperConfig, SharedGridConfig } from './types';

// Default configuration
const defaultConfig: GridHelperConfig = {
    columns: 12,
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
    private breakpoints: { [key: string]: Partial<GridHelperBreakpointConfig> };
    private currentBreakpointConfig: GridHelperBreakpointConfig;
    private previousBreakpointConfig: GridHelperBreakpointConfig | null = null;
    private gridContainer: HTMLElement;
    private isActive: boolean = false;
    private ctrlDown: boolean = false;

    constructor(config: Partial<GridHelperConfig> = {}) {
        const mergedConfig = this.mergeConfig(config, defaultConfig);
        this.sharedConfig = mergedConfig;
        this.breakpoints = mergedConfig.breakpoints || {};

        // Determine initial breakpoint config
        this.currentBreakpointConfig = this.getBreakpointConfig();
        this.previousBreakpointConfig = this.currentBreakpointConfig;

        // Initialize the grid container
        this.gridContainer = document.createElement('div');
        document.body.append(this.gridContainer);

        this.initialize();
    }

    /**
     * Deep merge user config with default config
     */
    private mergeConfig(
        userConfig: Partial<GridHelperConfig>,
        defaultConfig: GridHelperConfig
    ): GridHelperConfig {
        const breakpoints = { ...defaultConfig.breakpoints, ...userConfig.breakpoints };

        if (userConfig.breakpoints) {
            for (const key in userConfig.breakpoints) {
                breakpoints[key] = { ...breakpoints[key], ...userConfig.breakpoints[key] };
            }
        }

        delete userConfig.breakpoints;

        const sharedConfig = { ...defaultConfig, ...userConfig };

        return {
            ...sharedConfig,
            breakpoints
        };
    }

    /**
     * Initialize the grid helper by setting styles, columns, and events.
     */
    private initialize() {
        this.setGridEvents();
    }

    /**
     * Get the current breakpoint configuration based on the window width.
     */
    private getBreakpointConfig(): GridHelperBreakpointConfig {
        const width = window.innerWidth;
        let matchedBreakpointConfig: Partial<GridHelperBreakpointConfig> = this.sharedConfig;

        // Find the closest breakpoint that is less than or equal to the current window width.
        for (const [breakpoint, config] of Object.entries(this.breakpoints)) {
            if (width >= parseInt(breakpoint)) {
                matchedBreakpointConfig = { ...this.sharedConfig, ...config };
            }
        }

        return matchedBreakpointConfig as GridHelperBreakpointConfig;
    }

    private extractCSSVariable(value: string): string | null {
        const match = value.match(/var\((--[\w-]+)\)/);
        return match ? match[1] : null;
    }

    /**
     * Set grid container styles.
     */
    private setGridHelperStyles() {
        const elStyles = this.gridContainer.style;
        elStyles.zIndex = '10000';
        elStyles.position = 'fixed';
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
        // Clear previous columns
        this.gridContainer.innerHTML = '';

        let columns = 0;

        // Get the columns value, which can be either a number or a string
        let configColumns = this.currentBreakpointConfig.columns;

        // If configColumns is a string, check if it's a CSS variable
        if (typeof configColumns === 'string') {
            const cssVariable = this.extractCSSVariable(configColumns);

            if (cssVariable) {
                const computedStyle = getComputedStyle(document.documentElement);
                const cssValue = computedStyle.getPropertyValue(cssVariable);

                // Parse the CSS variable value to an integer
                columns = parseInt(cssValue);

                // Provide a fallback in case of NaN
                if (isNaN(columns)) {
                    columns = 12; // Default fallback
                }
            }
        } else if (typeof configColumns === 'number') {
            columns = configColumns;
        }

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
        // Handle resize to update the grid columns and styles
        window.addEventListener('resize', () => {
            this.currentBreakpointConfig = this.getBreakpointConfig();

            this.setGridHelperStyles();
            this.setGridHelperColumns();
        });

        // Toggle grid visibility with keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    /**
     * Handle keydown event to toggle the grid.
     */
    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Control') {
            this.ctrlDown = true;
        } else if (this.ctrlDown && e.key === this.sharedConfig.key) {
            this.currentBreakpointConfig = this.getBreakpointConfig();

            this.setGridHelperStyles();
            this.setGridHelperColumns();

            this.toggleGridVisibility();
        }
    }

    /**
     * Handle keyup event to reset Control key state.
     */
    private handleKeyUp(e: KeyboardEvent) {
        if (e.key === 'Control') {
            this.ctrlDown = false;
        }
    }

    /**
     * Toggle the visibility of the grid.
     */
    private toggleGridVisibility() {
        this.gridContainer.style.visibility = this.isActive ? 'hidden' : 'visible';
        this.isActive = !this.isActive;
    }
}

export * from './types';
