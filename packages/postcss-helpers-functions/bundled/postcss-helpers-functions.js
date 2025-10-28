(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.PostCSSRemoveDoubleParentheses = factory());
})(this, (function () {
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

    var responsiveValue = function responsiveValue(minSize, maxSize, breakpoint) {
      // Calculate delta as the ratio of max-size to breakpoint
      var delta = parseFloat(maxSize) / parseFloat(breakpoint);
      // Construct the `clamp()` function for responsive font size
      return "clamp(" + minSize + ", calc(" + delta + " * var(--vw, 1vw) * 100), " + maxSize + ")";
    };

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

    var helpersFunctionsAliasesMap = [{
      functionIdent: 'grid-space',
      "function": gridSpace
    }, {
      functionIdent: 'responsive-value',
      "function": responsiveValue
    }, {
      functionIdent: 'dvh',
      "function": dvh
    }, {
      functionIdent: 'svh',
      "function": svh
    }, {
      functionIdent: 'lvh',
      "function": lvh
    }, {
      functionIdent: 'vw',
      "function": vw
    }, {
      functionIdent: 'rem',
      "function": rem
    }];
    var postcssHelpersFunctions = function postcssHelpersFunctions(options) {
      return {
        postcssPlugin: 'postcss-helpers-functions',
        Root: function Root(root) {
          try {
            root.walkDecls(function (decl) {
              // Create a concatenated regular expression pattern for all functionIdent values
              var functionIdents = helpersFunctionsAliasesMap.map(function (alias) {
                return alias.functionIdent;
              }).join('|');
              var regex = new RegExp("\\b(" + functionIdents + ")\\s*\\(\\s*['\"]?([^'\")]+)?['\"]?\\s*\\)", 'g');
              // Replace the function with the selected function result
              decl.value = decl.value.replace(regex, function (match, ident, value) {
                var targetFunction = helpersFunctionsAliasesMap.find(function (alias) {
                  return alias.functionIdent === ident;
                });
                if (targetFunction) {
                  var args = value.split(',').map(function (arg) {
                    return arg.trim();
                  });
                  return targetFunction["function"].apply(null, args);
                }
                // Return the original value if no match is found
                return match;
              });
            });
            return Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
        }
      };
    };
    postcssHelpersFunctions.postcss = true;

    return postcssHelpersFunctions;

}));
