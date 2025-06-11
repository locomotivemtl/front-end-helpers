(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('nanostores')) :
  typeof define === 'function' && define.amd ? define(['exports', 'nanostores'], factory) :
  (global = global || self, factory(global.ComponentManager = {}, global.nanostores));
})(this, (function (exports, nanostores) {
  function _inheritsLoose(t, o) {
    t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }

  /**
   * Component Manager debug configuration
   * Automatically enables debug if window.COMPONENT_MANAGER_DEBUG is set to true
   */
  var isDebugEnabled = function isDebugEnabled() {
    try {
      return typeof window !== 'undefined' && window.COMPONENT_MANAGER_DEBUG === true;
    } catch (e) {
      return false;
    }
  };
  /**
   * Store to manage custom elements and their lifecycle
   */
  var $componentsManagerIncrement = nanostores.atom(0);
  var $componentsManager = nanostores.atom([]);
  /**
   * Cache management for getComponentsByPrototype optimization
   */
  var prototypeCache = new Map();
  var cacheStoreSnapshot = [];
  /**
   * Initialize global window bridge for component manager
   * This allows external libraries to access components without nanostores dependency
   * Only exposes safe, read-only operations
   */
  var initializeWindowBridge = function initializeWindowBridge() {
    if (typeof window !== 'undefined') {
      var componentManager = {
        getById: function getById(id) {
          return getComponentById(id);
        },
        getByPrototype: function getByPrototype(prototype) {
          return getComponentsByPrototype(prototype);
        },
        find: function find(predicate) {
          return findComponents(predicate);
        },
        getRegisteredPrototypes: function getRegisteredPrototypes() {
          return _getRegisteredPrototypes();
        },
        getComponentCount: function getComponentCount() {
          return _getComponentCount();
        }
      }; // Type assertion to avoid TypeScript issues with Object.defineProperty
      // Define the components getter using Object.defineProperty for better compatibility
      Object.defineProperty(componentManager, 'components', {
        get: function get() {
          return $componentsManager.get();
        },
        enumerable: true,
        configurable: false
      });
      window.ComponentManager = componentManager;
    }
  };
  /**
   * Class to create custom elements with management features
   */
  var ComponentElement = function ComponentElement(Base, className) {
    return /*#__PURE__*/function (_Base) {
      function _class() {
        var _this;
        _this = _Base.call.apply(_Base, [this].concat([].slice.call(arguments))) || this;
        _this.prototypeType = void 0;
        _this.prototypeType = className;
        if (!_this.id) {
          var index = $componentsManagerIncrement.get() + 1;
          $componentsManagerIncrement.set(index);
          _this.id = _this.prototypeType.toLowerCase() + "-" + index;
        }
        if (isDebugEnabled()) {
          console.log("\uD83D\uDD27 ComponentManager: \"" + _this.id + "\" (" + _this.prototypeType + ") registered");
        }
        return _this;
      }
      _inheritsLoose(_class, _Base);
      var _proto = _class.prototype;
      _proto.connectedCallback = function connectedCallback() {
        if (typeof Base.prototype.connectedCallback === 'function') {
          Base.prototype.connectedCallback.call(this);
        }
        $componentsManager.set([].concat($componentsManager.get(), [this]));
        if (isDebugEnabled()) {
          console.log("\u2705 ComponentManager: \"" + this.id + "\" connected to DOM");
        }
      };
      _proto.disconnectedCallback = function disconnectedCallback() {
        var _this2 = this;
        if (typeof Base.prototype.disconnectedCallback === 'function') {
          Base.prototype.disconnectedCallback.call(this);
        }
        $componentsManager.set($componentsManager.get().filter(function ($component) {
          return $component.id !== _this2.id;
        }));
        if (isDebugEnabled()) {
          console.log("\u274C ComponentManager: \"" + this.id + "\" disconnected from DOM");
        }
      };
      return _class;
    }(Base);
  };
  /**
   * Get a component by its unique ID with improved type safety
   */
  var getComponentById = function getComponentById(id) {
    return $componentsManager.get().find(function ($component) {
      return $component.id === id;
    });
  };
  /**
   * Get all components of a specific prototype, with optional exclusion filters
   * Includes performance optimization with caching for frequently called queries
   */
  var getComponentsByPrototype = function getComponentsByPrototype(prototype, selectorsToExclude) {
    if (selectorsToExclude === void 0) {
      selectorsToExclude = [];
    }
    var currentStore = $componentsManager.get();
    // Invalidate cache if store changed
    if (currentStore !== cacheStoreSnapshot) {
      prototypeCache.clear();
      cacheStoreSnapshot = currentStore;
    }
    // Only cache when no exclusions (most common case)
    var hasExclusions = Array.isArray(selectorsToExclude) ? selectorsToExclude.length > 0 : selectorsToExclude !== '';
    if (!hasExclusions) {
      if (prototypeCache.has(prototype)) {
        return prototypeCache.get(prototype);
      }
    }
    // Build exclusion selectors
    var excludedSelectors = [];
    if (typeof selectorsToExclude === 'string') {
      excludedSelectors = [selectorsToExclude];
    } else if (Array.isArray(selectorsToExclude)) {
      excludedSelectors = selectorsToExclude;
    } else if (selectorsToExclude instanceof HTMLElement && selectorsToExclude.id) {
      excludedSelectors = ["#" + selectorsToExclude.id];
    }
    // Filter components
    var result = currentStore.filter(function ($component) {
      return prototype === $component.prototypeType && !excludedSelectors.some(function (selector) {
        return $component.matches && $component.matches(selector);
      });
    });
    // Cache result if no exclusions
    if (!hasExclusions) {
      prototypeCache.set(prototype, result);
    }
    return result;
  };
  /**
   * Find components using a custom predicate function
   * @param predicate - Function that returns true for components to include
   * @returns Array of matching components
   *
   * @example
   * // Find components with specific attributes
   * const activeComponents = findComponents($component => $component.hasAttribute('active'));
   *
   * // Find components by custom criteria
   * const openDialogs = findComponents(comp =>
   *   comp.prototypeType === 'Dialog' && comp.hasAttribute('open')
   * );
   */
  var findComponents = function findComponents(predicate) {
    return $componentsManager.get().filter(predicate);
  };
  /**
   * Get all registered prototype types
   * @returns Array of unique prototype names
   */
  var _getRegisteredPrototypes = function _getRegisteredPrototypes() {
    var prototypes = new Set($componentsManager.get().map(function ($component) {
      return $component.prototypeType;
    }));
    return Array.from(prototypes);
  };
  var getComponentStats = function getComponentStats() {
    var stats = {};
    $componentsManager.get().forEach(function ($component) {
      var type = $component.prototypeType;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };
  /**
   * Get the total number of managed components
   */
  var _getComponentCount = function _getComponentCount() {
    return $componentsManager.get().length;
  };
  initializeWindowBridge();

  exports.$componentsManager = $componentsManager;
  exports.$componentsManagerIncrement = $componentsManagerIncrement;
  exports.ComponentElement = ComponentElement;
  exports.findComponents = findComponents;
  exports.getComponentById = getComponentById;
  exports.getComponentCount = _getComponentCount;
  exports.getComponentStats = getComponentStats;
  exports.getComponentsByPrototype = getComponentsByPrototype;
  exports.getRegisteredPrototypes = _getRegisteredPrototypes;

}));
