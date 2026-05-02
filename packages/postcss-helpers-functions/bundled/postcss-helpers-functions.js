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

  /**
   * Calculates a percentage of the viewport dynamic height (dvh).
   *
   * Example usage:
   * ```js
   * const height = dvh(100); // Returns "calc(100 * var(--dvh, 1dvh))"
   * ```
   *
   * @param {number} percentage - The percentage of the dynamic viewport height.
   * @return {string} The calculated CSS value as a string.
   */
  function dvh(percentage) {
    return "calc(" + percentage + " * var(--dvh, 1dvh))";
  }

  /**
   * Generates a CSS `calc()` string to calculate a percentage of the grid cell width,
   * with an optional grid gutter inset.
   *
   * This function mimics the behavior of a Sass function and is suitable for use in PostCSS plugins.
   *
   * Example usage:
   * ```js
   * gridSpace(6/12); // Calculates a width based on 6/12 of the grid
   * gridSpace(1/12, 1); // Calculates with a gutter inset
   * ```
   *
   * @param {number} percentage - The fraction of the grid (e.g., 6/12 or 0.5 for half the grid width).
   * @param {number} [inset=0] - An optional inset multiplier for the grid gutter (default is 0).
   * @returns {string} - The CSS `calc()` string for the grid spacing.
   */
  function gridSpace(percentage, inset) {
    if (inset === void 0) {
      inset = 0;
    }
    return "calc(\n        " + percentage + " * (calc(var(--vw, 1vw) * 100) - 2 * var(--grid-margin, 0px)) -\n        (1 - " + percentage + ") * var(--grid-gutter, 0px) +\n        " + inset + " * var(--grid-gutter, 0px)\n    )";
  }

  /**
   * PostCSS helper: Replace interpolate(value) with a linear interpolation between two values based on a percentage
   */
  function interpolate(value) {
    var keyword = 'interpolate(';
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
      // Find the matching closing parenthesis
      var contentStart = start + keyword.length;
      var depth = 1;
      var j = contentStart;
      while (j < value.length && depth > 0) {
        if (value[j] === '(') depth++;else if (value[j] === ')') depth--;
        j++;
      }
      var args = value.slice(contentStart, j - 1);
      var parts = splitArgs(args);
      if (parts.length === 3) {
        var _parts$map = parts.map(function (s) {
            return s.trim();
          }),
          a = _parts$map[0],
          b = _parts$map[1],
          t = _parts$map[2];
        result += "calc(" + a + " * (1 - " + t + ") + " + b + " * " + t + ")";
      } else {
        result += value.slice(start, j);
      }
      i = j;
    }
    return result;
  }
  /** Split a string by commas, ignoring commas nested inside parentheses. */
  function splitArgs(input) {
    var result = [];
    var current = '';
    var depth = 0;
    for (var _iterator = _createForOfIteratorHelperLoose(input), _step; !(_step = _iterator()).done;) {
      var _char = _step.value;
      if (_char === '(') depth++;else if (_char === ')') depth--;
      if (_char === ',' && depth === 0) {
        result.push(current);
        current = '';
      } else {
        current += _char;
      }
    }
    result.push(current);
    return result;
  }

  /**
   * Calculates a percentage of the viewport large height (lvh).
   *
   * Example usage:
   * ```js
   * const height = lvh(100); // Returns "calc(100 * var(--lvh, 1lvh))"
   * ```
   *
   * @param {number} percentage - The percentage of the large viewport height.
   * @return {string} The calculated CSS value as a string.
   */
  function lvh(percentage) {
    return "calc(" + percentage + " * var(--lvh, 1lvh))";
  }

  /**
   * PostCSS helper: Replace map-clamp(value, start1, stop1, start2, stop2) with map math expression
   */
  function mapClamp(value) {
    if (!value.includes('map-clamp(')) {
      return value;
    }
    var mapRangeClampPattern = /map-clamp\(/g;
    var matches = [];
    // Collect all matches first
    var match;
    while ((match = mapRangeClampPattern.exec(value)) !== null) {
      matches.push(match.index);
    }
    // Process matches in reverse order to avoid index shifting
    for (var idx = matches.length - 1; idx >= 0; idx--) {
      var startIdx = matches[idx];
      var funcName = 'map-clamp(';
      // Find the matching closing parenthesis by counting depth
      var depth = 1;
      var i = startIdx + funcName.length;
      var content = '';
      // Extract content between parentheses
      while (i < value.length && depth > 0) {
        var _char = value[i];
        if (_char === '(') {
          depth++;
          content += _char;
        } else if (_char === ')') {
          depth--;
          if (depth > 0) {
            // Still inside nested parentheses
            content += _char;
          }
          // If depth === 0, we've found the closing paren - don't add it
        } else {
          content += _char;
        }
        i++;
      }
      if (depth !== 0) {
        // Unmatched parentheses, skip this match
        console.warn('map-clamp: unmatched parentheses, depth:', depth);
        continue;
      }
      // Split on commas not inside parentheses (handles CSS vars)
      var parts = [];
      var current = '';
      var parens = 0;
      for (var j = 0; j < content.length; j++) {
        var _char2 = content[j];
        if (_char2 === '(') {
          parens++;
          current += _char2;
        } else if (_char2 === ')') {
          parens--;
          current += _char2;
        } else if (_char2 === ',') {
          if (parens === 0) {
            // Split here - we're at top level
            var _trimmed = current.trim();
            if (_trimmed) {
              parts.push(_trimmed);
            }
            current = '';
          } else {
            // Inside nested parentheses, keep the comma
            current += _char2;
          }
        } else {
          current += _char2;
        }
      }
      // Add the last part
      var trimmed = current.trim();
      if (trimmed) {
        parts.push(trimmed);
      }
      if (parts.length !== 5) {
        console.warn("map-clamp expects 5 arguments, got " + parts.length + ":", parts);
        console.warn('Content was:', JSON.stringify(content));
        console.warn('Full value was:', JSON.stringify(value.substring(startIdx, i)));
        continue;
      }
      var val = parts[0],
        start1 = parts[1],
        stop1 = parts[2],
        start2 = parts[3],
        stop2 = parts[4];
      var min = "min(" + start2 + ", " + stop2 + ")";
      var max = "max(" + start2 + ", " + stop2 + ")";
      var replacement = "clamp(" + min + ", calc(" + start2 + " + (" + stop2 + " - " + start2 + ") * ((" + val + " - " + start1 + ") / (" + stop1 + " - " + start1 + "))), " + max + ")";
      // Replace the entire function call
      value = value.substring(0, startIdx) + replacement + value.substring(i);
    }
    return value;
  }

  /**
   * PostCSS helper: Replace max-screen(value) with max({value}lvh, {value}vw)
   */
  function maxScreen(value) {
    var maxRegex = /max-screen\(([^)]+)\)/g;
    if (maxRegex.test(value)) {
      return value.replace(maxRegex, function (_, val) {
        return "max(" + val + "lvh, " + val + "vw)";
      });
    }
    return value;
  }

  /**
   * PostCSS helper: Replace min-screen(value) with min({value}lvh, {value}vw)
   */
  function minScreen(value) {
    var minRegex = /min-screen\(([^)]+)\)/g;
    if (minRegex.test(value)) {
      return value.replace(minRegex, function (_, val) {
        return "min(" + val + "lvh, " + val + "vw)";
      });
    }
    return value;
  }

  /**
   * Converts pixel values to rem units based on a configurable root font size.
   *
   * Example usage:
   * ```js
   * const fontSize = rem(16);     // Returns "1rem" (if root is 16px)
   * const margin = rem("24px");   // Returns "1.5rem" (if root is 16px)
   * const padding = rem(8);       // Returns "0.5rem" (if root is 16px)
   * const spacing = rem("32px");  // Returns "2rem" (if root is 16px)
   * ```
   *
   * @param {number | string} pixels - The pixel value to convert to rem (number or string with "px").
   * @param {number} rootSize - The root font size in pixels. Defaults to 16.
   * @return {string} The calculated rem value as a string.
   */
  function rem(pixels, rootSize) {
    if (rootSize === void 0) {
      rootSize = 16;
    }
    // Parse the pixels value if it's a string
    var pixelValue = typeof pixels === 'string' ? parseFloat(pixels.replace('px', '')) : pixels;
    var remValue = pixelValue / rootSize;
    // Trailing space to preserve spacing in CSS output
    return remValue + "rem ";
  }

  var responsiveValue = function responsiveValue(minSize, maxSize, breakpoint) {
    // Calculate delta as the ratio of max-size to breakpoint
    var delta = parseFloat(maxSize) / parseFloat(breakpoint);
    // Construct the `clamp()` function for responsive font size
    return "clamp(" + minSize + ", calc(" + delta + " * var(--vw, 1vw) * 100), " + maxSize + ")";
  };

  /**
   * Calculates a percentage of the viewport small height (svh).
   *
   * Example usage:
   * ```js
   * const height = svh(100); // Returns "calc(100 * var(--svh, 1svh))"
   * ```
   *
   * @param {number} percentage - The percentage of the small viewport height.
   * @return {string} The calculated CSS value as a string.
   */
  function svh(percentage) {
    return "calc(" + percentage + " * var(--svh, 1svh))";
  }

  /**
   * Calculates a percentage of the viewport width (vw).
   *
   * Example usage:
   * ```js
   * const width = vw(100); // Returns "calc(100 * var(--vw, 1vw))"
   * ```
   *
   * @param {number} percentage - The percentage of the viewport width.
   * @return {string} The calculated CSS value as a string.
   */
  function vw(percentage) {
    return "calc(" + percentage + " * var(--vw, 1vw))";
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
