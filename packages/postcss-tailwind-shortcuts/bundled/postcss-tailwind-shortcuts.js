(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.PostCSSRemoveDoubleParentheses = factory());
})(this, (function () {
    var tailwindAliasesMap = [{
      functionIdent: 'speed',
      tailwindKey: 'transitionDuration'
    }, {
      functionIdent: 'ease',
      tailwindKey: 'transitionTimingFunction'
    }, {
      functionIdent: 'z',
      tailwindKey: 'zIndex'
    }, {
      functionIdent: 'color',
      tailwindKey: 'colors'
    }, {
      functionIdent: 'spacing',
      tailwindKey: 'spacing'
    }];
    var postcssTailwindShortcuts = function postcssTailwindShortcuts(tailwindThemeConfig, options) {
      if (options === void 0) {
        options = {};
      }
      return {
        postcssPlugin: 'postcss-tailwind-shortcuts',
        Root: function Root(root) {
          root.walkDecls(function (decl) {
            // Create a concatenated regular expression pattern for all functionIdent values
            var functionIdents = tailwindAliasesMap.map(function (alias) {
              var _options;
              if ((_options = options) != null && _options.prefix) {
                var _options2;
                return ((_options2 = options) == null ? void 0 : _options2.prefix) + "-" + alias.functionIdent;
              }
              return alias.functionIdent;
            }).join('|');
            var regex = new RegExp("\\b(" + functionIdents + ")\\s*\\(\\s*['\"]?([^'\")]+)?['\"]?\\s*\\)", 'g');
            // Replace the function with the Tailwind value
            decl.value = decl.value.replace(regex, function (match, ident, value) {
              // Find the corresponding tailwind key and get the value
              var alias = tailwindAliasesMap.find(function (alias) {
                var _options3;
                if ((_options3 = options) != null && _options3.prefix) {
                  var _options4;
                  return ((_options4 = options) == null ? void 0 : _options4.prefix) + "-" + alias.functionIdent === ident;
                }
                return alias.functionIdent === ident;
              });
              if (alias) {
                var _tailwindThemeConfig$;
                var tailwindKey = alias.tailwindKey;
                var defaultValue = 'default'; // Default key value to use if no value is provided
                // Determine the value to use
                var keyValue = value || defaultValue;
                // Access the value from the Tailwind config
                var tailwindValue = (_tailwindThemeConfig$ = tailwindThemeConfig.extend[tailwindKey]) == null ? void 0 : _tailwindThemeConfig$[keyValue];
                // Log an error if no value is found
                if (!tailwindValue) {
                  console.error("No value found for " + tailwindKey + "." + keyValue);
                  return match;
                }
                // Return the Tailwind value
                return tailwindValue;
              }
              // Return the original value if no match is found
              return match;
            });
          });
        }
      };
    };
    postcssTailwindShortcuts.postcss = true;

    return postcssTailwindShortcuts;

}));
