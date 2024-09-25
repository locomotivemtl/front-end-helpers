(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GridHelper = factory());
})(this, (function () {
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  // Default configuration
  var defaultConfig = {
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
  var GridHelper = /*#__PURE__*/function () {
    function GridHelper(config) {
      if (config === void 0) {
        config = {};
      }
      this.sharedConfig = void 0;
      this.breakpoints = void 0;
      this.currentBreakpointConfig = void 0;
      this.previousBreakpointConfig = null;
      this.gridContainer = void 0;
      this.isActive = false;
      this.ctrlDown = false;
      var mergedConfig = this.mergeConfig(config, defaultConfig);
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
    var _proto = GridHelper.prototype;
    _proto.mergeConfig = function mergeConfig(userConfig, defaultConfig) {
      var breakpoints = _extends({}, defaultConfig.breakpoints, userConfig.breakpoints);
      if (userConfig.breakpoints) {
        for (var key in userConfig.breakpoints) {
          breakpoints[key] = _extends({}, breakpoints[key], userConfig.breakpoints[key]);
        }
      }
      delete userConfig.breakpoints;
      var sharedConfig = _extends({}, defaultConfig, userConfig);
      return _extends({}, sharedConfig, {
        breakpoints: breakpoints
      });
    }
    /**
     * Initialize the grid helper by setting styles, columns, and events.
     */;
    _proto.initialize = function initialize() {
      this.setGridEvents();
    }
    /**
     * Get the current breakpoint configuration based on the window width.
     */;
    _proto.getBreakpointConfig = function getBreakpointConfig() {
      var width = window.innerWidth;
      var matchedBreakpointConfig = this.sharedConfig;
      // Find the closest breakpoint that is less than or equal to the current window width.
      for (var _i = 0, _Object$entries = Object.entries(this.breakpoints); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _Object$entries[_i],
          breakpoint = _Object$entries$_i[0],
          config = _Object$entries$_i[1];
        if (width >= parseInt(breakpoint)) {
          matchedBreakpointConfig = _extends({}, this.sharedConfig, config);
        }
      }
      return matchedBreakpointConfig;
    };
    _proto.extractCSSVariable = function extractCSSVariable(value) {
      var match = value.match(/var\((--[\w-]+)\)/);
      return match ? match[1] : null;
    }
    /**
     * Set grid container styles.
     */;
    _proto.setGridHelperStyles = function setGridHelperStyles() {
      var elStyles = this.gridContainer.style;
      elStyles.zIndex = '10000';
      elStyles.position = 'fixed';
      elStyles.top = '0';
      elStyles.left = '0';
      elStyles.display = 'flex';
      elStyles.width = '100%';
      elStyles.height = '100%';
      elStyles.columnGap = "" + this.currentBreakpointConfig.gutterWidth;
      elStyles.paddingLeft = "" + this.currentBreakpointConfig.marginWidth;
      elStyles.paddingRight = "" + this.currentBreakpointConfig.marginWidth;
      elStyles.pointerEvents = 'none';
      elStyles.visibility = this.isActive ? 'visible' : 'hidden';
    }
    /**
     * Set grid columns.
     */;
    _proto.setGridHelperColumns = function setGridHelperColumns() {
      // Clear previous columns
      this.gridContainer.innerHTML = '';
      var columns = 0;
      // Get the columns value, which can be either a number or a string
      var configColumns = this.currentBreakpointConfig.columns;
      // If configColumns is a string, check if it's a CSS variable
      if (typeof configColumns === 'string') {
        var cssVariable = this.extractCSSVariable(configColumns);
        if (cssVariable) {
          var computedStyle = getComputedStyle(document.documentElement);
          var cssValue = computedStyle.getPropertyValue(cssVariable);
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
      for (var i = 0; i < columns; i++) {
        var column = document.createElement('div');
        column.style.flex = '1 1 0';
        column.style.backgroundColor = this.currentBreakpointConfig.color;
        column.style.opacity = "" + this.currentBreakpointConfig.opacity;
        this.gridContainer.appendChild(column);
      }
    }
    /**
     * Set grid events for resize and keydown.
     */;
    _proto.setGridEvents = function setGridEvents() {
      var _this = this;
      // Handle resize to update the grid columns and styles
      window.addEventListener('resize', function () {
        _this.currentBreakpointConfig = _this.getBreakpointConfig();
        _this.setGridHelperStyles();
        _this.setGridHelperColumns();
      });
      // Toggle grid visibility with keyboard events
      document.addEventListener('keydown', function (e) {
        return _this.handleKeyDown(e);
      });
      document.addEventListener('keyup', function (e) {
        return _this.handleKeyUp(e);
      });
    }
    /**
     * Handle keydown event to toggle the grid.
     */;
    _proto.handleKeyDown = function handleKeyDown(e) {
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
     */;
    _proto.handleKeyUp = function handleKeyUp(e) {
      if (e.key === 'Control') {
        this.ctrlDown = false;
      }
    }
    /**
     * Toggle the visibility of the grid.
     */;
    _proto.toggleGridVisibility = function toggleGridVisibility() {
      this.gridContainer.style.visibility = this.isActive ? 'hidden' : 'visible';
      this.isActive = !this.isActive;
    };
    return GridHelper;
  }();

  return GridHelper;

}));
