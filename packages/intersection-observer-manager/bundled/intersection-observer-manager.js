(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.IntersectionObserverManager = {}));
})(this, (function (exports) {
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

  /**
   * Static class to manage IntersectionObservers for all elements
   * Automatically creates separate observers for different rootMargin values
   * Usage: Add data-inview attribute to elements you want to observe
   */
  var IntersectionObserverManager = /*#__PURE__*/function () {
    function IntersectionObserverManager() {}
    // =============================================================================
    // Public API
    // =============================================================================
    /**
     * Initialize the IntersectionObserver(s) and observe all elements with data-inview
     * @param defaultRootMargin - Default root margin for elements without data-inview-root-margin
     */
    IntersectionObserverManager.init = function init(defaultRootMargin) {
      if (defaultRootMargin === void 0) {
        defaultRootMargin = this.defaultRootMargin;
      }
      this.defaultRootMargin = defaultRootMargin;
      this.observeAll();
      document.dispatchEvent(new CustomEvent(this.CONFIG.EVENTS.READY));
    }
    /**
     * Destroy all IntersectionObservers and clear all observed elements
     */;
    IntersectionObserverManager.destroy = function destroy() {
      this.observers.forEach(function (observer) {
        return observer.disconnect();
      });
      this.observers.clear();
      this.observedElements.clear();
      document.dispatchEvent(new CustomEvent(this.CONFIG.EVENTS.DESTROYED));
    }
    /**
     * Add a single element to be observed
     * Useful for dynamically added elements
     * @param element - Element to observe
     * @param callback - Optional callback function called on intersection changes
     * @param options - Optional configuration overrides
     */;
    IntersectionObserverManager.observe = function observe(element, callback, options) {
      if (this.observedElements.has(element)) {
        return; // Already observed
      }
      var config = callback || options ? this.getElementConfigWithOverrides(element, callback, options) : this.getElementConfig(element);
      var observer = this.getOrCreateObserver(config.rootMargin);
      this.observedElements.set(element, config);
      observer.observe(element);
    }
    /**
     * Remove a single element from observation
     * @param element - Element to unobserve
     */;
    IntersectionObserverManager.unobserve = function unobserve(element) {
      var config = this.observedElements.get(element);
      if (!config) return;
      var observer = this.observers.get(config.rootMargin);
      if (observer) {
        observer.unobserve(element);
      }
      this.observedElements["delete"](element);
    }
    /**
     * Refresh: re-observe all elements with data-inview attribute
     * Useful when you don't control when elements are added or removed
     */;
    IntersectionObserverManager.refresh = function refresh() {
      var _this = this;
      // Unobserve elements that no longer exist in DOM
      var elementsToRemove = [];
      this.observedElements.forEach(function (_, element) {
        if (!document.body.contains(element)) {
          elementsToRemove.push(element);
        }
      });
      elementsToRemove.forEach(function (el) {
        return _this.unobserve(el);
      });
      // Observe new elements
      this.observeAll();
    }
    /**
     * Get stats about observers (useful for debugging)
     */;
    IntersectionObserverManager.getStats = function getStats() {
      return {
        observerCount: this.observers.size,
        elementCount: this.observedElements.size,
        rootMargins: Array.from(this.observers.keys())
      };
    }
    // =============================================================================
    // Private Methods
    // =============================================================================
    /**
     * Get or create an IntersectionObserver for a specific rootMargin
     * @param rootMargin - Root margin value
     * @returns IntersectionObserver instance
     */;
    IntersectionObserverManager.getOrCreateObserver = function getOrCreateObserver(rootMargin) {
      var _this2 = this;
      if (!this.observers.has(rootMargin)) {
        var observer = new IntersectionObserver(function (entries) {
          return _this2.handleIntersection(entries);
        }, {
          rootMargin: rootMargin,
          threshold: 0
        });
        this.observers.set(rootMargin, observer);
      }
      return this.observers.get(rootMargin);
    }
    /**
     * Find and observe all elements with data-inview attribute
     */;
    IntersectionObserverManager.observeAll = function observeAll() {
      var _this3 = this;
      var elements = document.querySelectorAll("[" + this.CONFIG.ATTRIBUTES.TRIGGER + "]");
      elements.forEach(function (element) {
        return _this3.observe(element);
      });
    }
    /**
     * Get configuration for a specific element
     * @param element - Element to get config for
     * @returns ObserverConfig object
     */;
    IntersectionObserverManager.getElementConfig = function getElementConfig(element) {
      var rootMargin = element.getAttribute(this.CONFIG.ATTRIBUTES.ROOT_MARGIN) || this.defaultRootMargin;
      return {
        className: element.getAttribute(this.CONFIG.ATTRIBUTES.CLASS) || this.CONFIG.DEFAULT_CLASS,
        shouldToggle: element.hasAttribute(this.CONFIG.ATTRIBUTES.TOGGLE),
        rootMargin: rootMargin
      };
    }
    /**
     * Get configuration with JavaScript overrides
     * @param element - Element to get config for
     * @param callback - Optional callback
     * @param options - Optional config overrides
     * @returns ObserverConfig object
     */;
    IntersectionObserverManager.getElementConfigWithOverrides = function getElementConfigWithOverrides(element, callback, options) {
      var baseConfig = this.getElementConfig(element);
      return _extends({}, baseConfig, (options == null ? void 0 : options.className) && {
        className: options.className
      }, (options == null ? void 0 : options.shouldToggle) !== undefined && {
        shouldToggle: options.shouldToggle
      }, (options == null ? void 0 : options.rootMargin) && {
        rootMargin: options.rootMargin
      }, callback && {
        callback: callback
      });
    }
    /**
     * Handle intersection events
     * @param entries - IntersectionObserver entries
     */;
    IntersectionObserverManager.handleIntersection = function handleIntersection(entries) {
      var _this4 = this;
      entries.forEach(function (entry) {
        var config = _this4.observedElements.get(entry.target);
        if (!config) return;
        var isIntersecting = entry.isIntersecting;
        // Call custom callback if provided
        if (config.callback) {
          config.callback(entry, isIntersecting);
        }
        // Handle class toggling
        if (isIntersecting) {
          entry.target.classList.add(config.className);
          // If not toggling, unobserve after first intersection
          if (!config.shouldToggle) {
            _this4.unobserve(entry.target);
          }
        } else if (config.shouldToggle) {
          entry.target.classList.remove(config.className);
        }
      });
    };
    return IntersectionObserverManager;
  }();
  IntersectionObserverManager.observers = new Map();
  IntersectionObserverManager.observedElements = new Map();
  IntersectionObserverManager.defaultRootMargin = '0px 0px 0px 0px';
  IntersectionObserverManager.CONFIG = {
    ATTRIBUTES: {
      TRIGGER: 'data-inview',
      CLASS: 'data-inview-class',
      TOGGLE: 'data-inview-toggle',
      ROOT_MARGIN: 'data-inview-root-margin'
    },
    DEFAULT_CLASS: 'is-inview',
    EVENTS: {
      READY: 'intersectionObserverManager:ready',
      DESTROYED: 'intersectionObserverManager:destroyed'
    }
  };

  exports.IntersectionObserverManager = IntersectionObserverManager;

}));
