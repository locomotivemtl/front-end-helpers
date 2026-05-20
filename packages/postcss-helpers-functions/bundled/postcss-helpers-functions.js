(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.PostCSSRemoveDoubleParentheses = factory());
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
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /** Split a string by top-level commas, ignoring commas inside parentheses. */
  function splitArgs(input) {
    var result = [];
    var current = '';
    var depth = 0;
    for (var _iterator = _createForOfIteratorHelperLoose(input), _step; !(_step = _iterator()).done;) {
      var _char = _step.value;
      if (_char === '(') depth++;else if (_char === ')') depth--;
      if (_char === ',' && depth === 0) {
        result.push(current.trim());
        current = '';
      } else {
        current += _char;
      }
    }
    result.push(current.trim());
    return result;
  }
  /**
   * Find all `processor_name(...)` calls in a CSS value string and replace them.
   * Handles nested parentheses (e.g. CSS vars with fallbacks).
   * Return null from transform to leave the call unchanged.
   */
  function replaceCSSFunction(value, name, transform) {
    var keyword = name + "(";
    if (!value.includes(keyword)) return value;
    var result = '';
    var i = 0;
    while (i < value.length) {
      var start = value.indexOf(keyword, i);
      if (start === -1) {
        result += value.slice(i);
        break;
      }
      result += value.slice(i, start);
      var contentStart = start + keyword.length;
      var depth = 1;
      var j = contentStart;
      while (j < value.length && depth > 0) {
        if (value[j] === '(') depth++;else if (value[j] === ')') depth--;
        j++;
      }
      var args = splitArgs(value.slice(contentStart, j - 1));
      var replacement = transform(args);
      result += replacement != null ? replacement : value.slice(start, j);
      i = j;
    }
    return result;
  }

  /**
   * Replaces `dvh(n)` with `calc(n * var(--dvh, 1dvh))`.
   *
   * Uses a CSS custom property `--dvh` set by JS to work around iOS Safari's
   * dynamic viewport height bug, falling back to the native `dvh` unit.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: dvh(100);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: calc(100 * var(--dvh, 1dvh));
   * }
   * ```
   */
  function dvh(value) {
    return replaceCSSFunction(value, 'dvh', function (_ref) {
      var percentage = _ref[0];
      if (!percentage) return null;
      return "calc(" + percentage + " * var(--dvh, 1dvh))";
    });
  }

  /**
   * Replaces `grid-space(fraction, inset?)` with a `calc()` expression for
   * a column-based width using CSS custom properties `--vw`, `--grid-margin`, and `--grid-gutter`.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: grid-space(6/12, 1);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: calc(6/12 * (calc(100 * var(--vw, 1vw)) - 2 * var(--grid-margin, 0px)) - (1 - 6/12) * var(--grid-gutter, 0px) + 1 * var(--grid-gutter, 0px));
   * }
   * ```
   */
  function gridSpace(value) {
    return replaceCSSFunction(value, 'grid-space', function (_ref) {
      var percentage = _ref[0],
        _ref$ = _ref[1],
        inset = _ref$ === void 0 ? '0' : _ref$;
      if (!percentage) return null;
      return "calc(" + percentage + " * (vw(100) - 2 * var(--grid-margin, 0px)) - (1 - " + percentage + ") * var(--grid-gutter, 0px) + " + inset + " * var(--grid-gutter, 0px))";
    });
  }

  /**
   * Replace interpolate(a, b, t) with a linear interpolation between two values.
   *
   * @example
   * ```css
   * // Input
   * p {
   *  font-size: interpolate(16px, 24px, 0.5);
   * }
   * ```
   *
   * ```css
   * // Output
   * p {
   *  font-size: calc(16px * (1 - 0.5) + 24px * 0.5);
   * }
   * ```
   */
  function interpolate(value) {
    return replaceCSSFunction(value, 'interpolate', function (_ref) {
      var a = _ref[0],
        b = _ref[1],
        t = _ref[2];
      if (!a || !b || !t) return null;
      return "calc(" + a + " * (1 - " + t + ") + " + b + " * " + t + ")";
    });
  }

  /**
   * Replaces `lvh(n)` with `calc(n * var(--lvh, 1lvh))`.
   *
   * Uses a CSS custom property `--lvh` set by JS (large viewport height),
   * falling back to the native `lvh` unit.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: lvh(100);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: calc(100 * var(--lvh, 1lvh));
   * }
   * ```
   */
  function lvh(value) {
    return replaceCSSFunction(value, 'lvh', function (_ref) {
      var percentage = _ref[0];
      if (!percentage) return null;
      return "calc(" + percentage + " * var(--lvh, 1lvh))";
    });
  }

  /**
   * Replaces `map-clamp(val, start1, stop1, start2, stop2)` with a clamped linear map expression.
   *
   * Maps `val` from range [start1, stop1] to range [start2, stop2], clamped to the output range.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: map-clamp(var(--progress, 0), .3, .8, 20px, 80px);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: clamp(min(20px, 80px), calc(20px + (80px - 20px) * ((var(--progress) - .3) / (.8 - .3))), max(20px, 80px));
   *  // Progress at 0: height: 20px
   *  // Progress at .3: height: 20px
   *  // Progress at .55: height: 50px
   *  // Progress at .8: height: 80px
   *  // Progress at 1: height: 80px
   * }
   * ```
   */
  function mapClamp(value) {
    return replaceCSSFunction(value, 'map-clamp', function (_ref) {
      var val = _ref[0],
        start1 = _ref[1],
        stop1 = _ref[2],
        start2 = _ref[3],
        stop2 = _ref[4];
      if (!val || !start1 || !stop1 || !start2 || !stop2) return null;
      return "clamp(min(" + start2 + ", " + stop2 + "), calc(" + start2 + " + (" + stop2 + " - " + start2 + ") * ((" + val + " - " + start1 + ") / (" + stop1 + " - " + start1 + "))), max(" + start2 + ", " + stop2 + "))";
    });
  }

  /**
   * Replaces `max-screen(value)` with `max({value}lvh, {value}vw)`.
   *
   * Returns the larger of the value in large viewport height vs. width units,
   * sizing relative to the larger viewport dimension.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: max-screen(50);
   *
   *  --size: 50;
   *  height: max-screen(var(--size)); // with CSS variable
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: max(50lvh, 50vw);
   *  height: max(calc(var(--size) * 1lvh), calc(var(--size) * 1vw)); // with CSS variable
   * }
   * ```
   */
  function maxScreen(value) {
    return replaceCSSFunction(value, 'max-screen', function (_ref) {
      var val = _ref[0];
      if (!val) return null;
      if (isNaN(parseFloat(val))) return "max(lvh(" + val + "), vw(" + val + "))";
      return "max(lvh(" + val + "), vw(" + val + "))";
    });
  }

  /**
   * Replaces `min-screen(value)` with `min({value}lvh, {value}vw)`.
   *
   * Returns the smaller of the value in large viewport height vs. width units,
   * sizing relative to the smaller viewport dimension.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: min-screen(50);
   *
   *  --size: 50;
   *  height: min-screen(var(--size)); // with CSS variable
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: min(50lvh, 50vw);
   *  height: min(calc(var(--size) * 1lvh), calc(var(--size) * 1vw)); // with CSS variable
   * }
   * ```
   */
  function minScreen(value) {
    return replaceCSSFunction(value, 'min-screen', function (_ref) {
      var val = _ref[0];
      if (!val) return null;
      if (isNaN(parseFloat(val))) return "min(lvh(" + val + "), vw(" + val + "))";
      return "min(lvh(" + val + "), vw(" + val + "))";
    });
  }

  var ROOT_SIZE = 16;
  /**
   * Replaces `rem(pixels)` with a rem value based on a root font size.
   * Default is a 16px root font size.
   *
   * @example
   * ```css
   * // Input
   * p {
   *  font-size: rem(24);
   *  font-size: rem(24, 20); // with custom root size
   *
   *  --font-size: 24px;
   *  font-size: rem(var(--font-size)); // with CSS variable
   *
   * --root-font-size: 20px;
   * font-size: rem(var(--font-size), var(--root-font-size)); // with CSS variables
   * }
   * ```
   *
   * ```css
   * // Output
   * p {
   *  font-size: 1.5rem;
   *  font-size: 1.2rem; // with custom root size
   *  font-size: calc(var(--font-size) / 16 * 1rem); // with CSS variable
   *  font-size: calc(var(--font-size) / var(--root-font-size) * 1rem); // with CSS variables
   * }
   * ```
   */
  function rem(value) {
    return replaceCSSFunction(value, 'rem', function (_ref) {
      var pixels = _ref[0],
        rootSize = _ref[1];
      if (!pixels) return null;
      var pxNum = parseFloat(pixels);
      var rootNum = rootSize ? parseFloat(rootSize) : ROOT_SIZE;
      var rootVal = rootSize != null ? rootSize : String(ROOT_SIZE);
      if (!isNaN(rootNum) && rootNum === 0) return null;
      if (!isNaN(pxNum) && !isNaN(rootNum)) return pxNum / rootNum + "rem";
      return "calc(" + pixels + " / " + (isNaN(rootNum) ? rootVal : rootNum) + " * 1rem)";
    });
  }

  /**
   * Replaces `responsive-value(minSize, maxSize, breakpoint)` with a fluid
   * `clamp()` expression that scales linearly between `minSize` and `maxSize`
   * across the viewport width up to `breakpoint`.
   *
   * @example
   * ```css
   * // Input
   * p {
   *  font-size: responsive-value(30px, 60px, 1800px);
   *
   *  --font-size: 30px;
   *  --max-size: 60px;
   *  --breakpoint: 1800px;
   *  font-size: responsive-value(var(--font-size), var(--max-size), var(--breakpoint)); // with CSS variables
   * }
   * ```
   *
   * ```css
   * // Output
   * p {
   *  font-size: clamp(30px, calc(0.0333 * var(--vw, 1vw) * 100), 60px);
   *  font-size: clamp(var(--font-size), calc(var(--max-size) / var(--breakpoint) * var(--vw, 1vw) * 100), var(--max-size)); // with CSS variables
   * }
   * ```
   */
  function responsiveValue(value) {
    return replaceCSSFunction(value, 'responsive-value', function (_ref) {
      var minSize = _ref[0],
        maxSize = _ref[1],
        breakpoint = _ref[2];
      if (!minSize || !maxSize || !breakpoint) return null;
      var maxNum = parseFloat(maxSize);
      var bpNum = parseFloat(breakpoint);
      var fluid = !isNaN(maxNum) && !isNaN(bpNum) ? "calc(vw(" + maxNum / bpNum + ") * 100)" : "calc(vw(" + maxSize + " / " + breakpoint + ") * 100)";
      return "clamp(" + minSize + ", " + fluid + ", " + maxSize + ")";
    });
  }

  /**
   * Replaces `svh(n)` with `calc(n * var(--svh, 1svh))`.
   *
   * Uses a CSS custom property `--svh` set by JS (small viewport height),
   * falling back to the native `svh` unit.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  height: svh(100);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  height: calc(100 * var(--svh, 1svh));
   * }
   * ```
   */
  function svh(value) {
    return replaceCSSFunction(value, 'svh', function (_ref) {
      var percentage = _ref[0];
      if (!percentage) return null;
      return "calc(" + percentage + " * var(--svh, 1svh))";
    });
  }

  /**
   * Replaces `vw(n)` with `calc(n * var(--vw, 1vw))`.
   *
   * Uses a CSS custom property `--vw` set by JS to avoid the scrollbar width
   * that `100vw` includes on desktop browsers, falling back to the native `vw` unit.
   *
   * @example
   * ```css
   * // Input
   * div {
   *  width: vw(100);
   * }
   * ```
   *
   * ```css
   * // Output
   * div {
   *  width: calc(100 * var(--vw, 1vw));
   * }
   * ```
   */
  function vw(value) {
    return replaceCSSFunction(value, 'vw', function (_ref) {
      var percentage = _ref[0];
      if (!percentage) return null;
      return "calc(" + percentage + " * var(--vw, 1vw))";
    });
  }

  var DEFAULT_HELPERS = [{
    name: 'grid-space',
    processor: gridSpace
  }, {
    name: 'responsive-value',
    processor: responsiveValue
  }, {
    name: 'dvh',
    processor: dvh
  }, {
    name: 'svh',
    processor: svh
  }, {
    name: 'lvh',
    processor: lvh
  }, {
    name: 'vw',
    processor: vw
  }, {
    name: 'rem',
    processor: rem
  }, {
    name: 'min-screen',
    processor: minScreen
  }, {
    name: 'max-screen',
    processor: maxScreen
  }, {
    name: 'map-clamp',
    processor: mapClamp
  }, {
    name: 'interpolate',
    processor: interpolate
  }];
  /**
   * PostCSS plugin that processes custom CSS helper functions
   */
  var postcssProcessorHelpers = function postcssProcessorHelpers(helpers) {
    if (helpers === void 0) {
      helpers = [];
    }
    var helpersList = [].concat(DEFAULT_HELPERS, helpers);
    // Create regex pattern to match any helper processor: min-screen(, max-screen(, map-range-clamp(
    var helperPattern = new RegExp("(" + helpersList.map(function (h) {
      return h.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ")\\s*\\(", 'g');
    return {
      helpers: helpersList,
      regex: helperPattern,
      postcssPlugin: 'postcss-helpers',
      Declaration: function Declaration(decl) {
        var value = decl.value;
        // Test if any helper function is present using regex
        if (helperPattern.test(value)) {
          // Reset regex lastIndex for processing
          helperPattern.lastIndex = 0;
          // Process each helper in sequence
          // Each helper checks internally if it needs to process the value
          for (var _iterator = _createForOfIteratorHelperLoose(helpersList), _step; !(_step = _iterator()).done;) {
            var helper = _step.value;
            value = helper.processor(value);
          }
          decl.value = value;
        }
      }
    };
  };
  postcssProcessorHelpers.postcss = true;

  return postcssProcessorHelpers;

}));
