(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GridHelper = factory());
})(this, (function () {
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _createForOfIteratorHelperLoose(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (t) return (t = t.call(r)).next.bind(t);
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var o = 0;
      return function () {
        return o >= r.length ? {
          done: !0
        } : {
          done: !1,
          value: r[o++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }
  function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
      if (e.includes(n)) continue;
      t[n] = r[n];
    }
    return t;
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var _excluded = ["container", "breakpoints"];
  var DEFAULT_COLUMNS = 12;
  var DEFAULT_CONFIG = {
    columns: DEFAULT_COLUMNS,
    gutterWidth: '16px',
    marginWidth: '16px',
    color: 'red',
    opacity: 0.1,
    key: 'g'
  };
  var STORAGE_PREFIX = 'grid-helper:';
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
      var _this = this;
      if (config === void 0) {
        config = {};
      }
      this.sharedConfig = void 0;
      this.breakpoints = void 0;
      this.currentBreakpointConfig = void 0;
      this.container = void 0;
      this.gridContainer = void 0;
      this.storageKey = void 0;
      this.isActive = false;
      /**
       * Refresh the visible grid when the viewport or the styles change.
       */
      this.handleViewportChange = function () {
        if (_this.isActive) {
          _this.update();
        }
      };
      /**
       * Handle keydown event to toggle the grid.
       */
      this.handleKeyDown = function (e) {
        if (!e.ctrlKey || e.repeat) {
          return;
        }
        if (e.key.toLowerCase() === _this.sharedConfig.key.toLowerCase()) {
          _this.setActive(!_this.isActive);
        }
      };
      var _config = config,
        container = _config.container,
        _config$breakpoints = _config.breakpoints,
        breakpoints = _config$breakpoints === void 0 ? {} : _config$breakpoints,
        sharedConfig = _objectWithoutPropertiesLoose(_config, _excluded);
      this.container = container != null ? container : document.body;
      this.sharedConfig = _extends({}, DEFAULT_CONFIG, sharedConfig);
      this.storageKey = "" + STORAGE_PREFIX + this.sharedConfig.key;
      this.breakpoints = Object.keys(breakpoints).map(function (minWidth) {
        return [parseInt(minWidth), breakpoints[minWidth]];
      }).sort(function (a, b) {
        return a[0] - b[0];
      });
      this.currentBreakpointConfig = this.getBreakpointConfig();
      this.gridContainer = document.createElement('div');
      this.container.append(this.gridContainer);
      this.setGridEvents();
      this.setActive(this.readStoredState());
    }
    /**
     * Remove the grid overlay and its event listeners.
     */
    var _proto = GridHelper.prototype;
    _proto.destroy = function destroy() {
      window.removeEventListener('resize', this.handleViewportChange);
      window.removeEventListener('load', this.handleViewportChange);
      document.removeEventListener('keydown', this.handleKeyDown);
      this.gridContainer.remove();
    }
    /**
     * Get the current breakpoint configuration based on the window width.
     */;
    _proto.getBreakpointConfig = function getBreakpointConfig() {
      var width = window.innerWidth;
      var matchedBreakpointConfig = this.sharedConfig;
      // Breakpoints are sorted, so the last match is the widest one that fits
      for (var _iterator = _createForOfIteratorHelperLoose(this.breakpoints), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
          minWidth = _step$value[0],
          config = _step$value[1];
        if (width >= minWidth) {
          matchedBreakpointConfig = _extends({}, this.sharedConfig, config);
        }
      }
      return matchedBreakpointConfig;
    }
    /**
     * Resolve the column count, reading the CSS variable when `columns` is one.
     */;
    _proto.getColumnCount = function getColumnCount() {
      var _columns$match;
      var columns = this.currentBreakpointConfig.columns;
      if (typeof columns === 'number') {
        return columns;
      }
      var cssVariable = (_columns$match = columns.match(/var\(\s*(--[\w-]+)/)) == null ? void 0 : _columns$match[1];
      if (!cssVariable) {
        return DEFAULT_COLUMNS;
      }
      // Read from the grid element so a variable scoped to the container resolves
      var cssValue = getComputedStyle(this.gridContainer).getPropertyValue(cssVariable);
      var count = parseInt(cssValue);
      return isNaN(count) ? DEFAULT_COLUMNS : count;
    }
    /**
     * Set grid container styles.
     */;
    _proto.setGridHelperStyles = function setGridHelperStyles() {
      var elStyles = this.gridContainer.style;
      elStyles.zIndex = '10000';
      elStyles.position = this.container === document.body ? 'fixed' : 'absolute';
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
      this.gridContainer.innerHTML = '';
      var columns = this.getColumnCount();
      for (var i = 0; i < columns; i++) {
        var column = document.createElement('div');
        column.style.flex = '1 1 0';
        column.style.backgroundColor = this.currentBreakpointConfig.color;
        column.style.opacity = "" + this.currentBreakpointConfig.opacity;
        this.gridContainer.appendChild(column);
      }
    }
    /**
     * Set grid events for resize, load and keydown.
     */;
    _proto.setGridEvents = function setGridEvents() {
      window.addEventListener('resize', this.handleViewportChange);
      // A grid restored before the stylesheets load reads its CSS variables too early
      window.addEventListener('load', this.handleViewportChange);
      document.addEventListener('keydown', this.handleKeyDown);
    };
    /**
     * Show or hide the grid and remember the choice for the next page load.
     */
    _proto.setActive = function setActive(isActive) {
      this.isActive = isActive;
      this.update();
      this.writeStoredState();
    }
    /**
     * Apply the configuration that matches the current viewport.
     */;
    _proto.update = function update() {
      this.currentBreakpointConfig = this.getBreakpointConfig();
      this.setGridHelperStyles();
      this.setGridHelperColumns();
    };
    _proto.readStoredState = function readStoredState() {
      try {
        return sessionStorage.getItem(this.storageKey) !== null;
      } catch (_unused) {
        // Storage is blocked: the grid works, it just starts hidden
        return false;
      }
    };
    _proto.writeStoredState = function writeStoredState() {
      try {
        if (this.isActive) {
          sessionStorage.setItem(this.storageKey, '1');
        } else {
          sessionStorage.removeItem(this.storageKey);
        }
      } catch (_unused2) {
        // Storage is blocked: the grid works, it just is not remembered
      }
    };
    return GridHelper;
  }();

  return GridHelper;

}));
