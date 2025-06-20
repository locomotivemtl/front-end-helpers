(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.PostCSSTailwindShortcuts = factory());
})(this, (function () {
    var defaultAliasesMap = [{
      functionIdent: 'speed',
      cssVariablePrefix: '--transition-duration'
    }, {
      functionIdent: 'ease',
      cssVariablePrefix: '--ease'
    }, {
      functionIdent: 'z',
      cssVariablePrefix: '--z-index'
    }, {
      functionIdent: 'colorCode',
      cssVariablePrefix: '--color'
    }, {
      functionIdent: 'spacing',
      cssVariablePrefix: '--spacing'
    }, {
      functionIdent: 'radius',
      cssVariablePrefix: '--radius'
    }];
    var postcssTailwindShortcuts = function postcssTailwindShortcuts(options) {
      if (options === void 0) {
        options = {};
      }
      // Merge default aliases with custom shortcuts
      var aliasesMap = [].concat(defaultAliasesMap, options.shortcuts || []);
      // Create a map for faster lookup
      var functionMap = new Map(aliasesMap.map(function (alias) {
        return [alias.functionIdent, alias.cssVariablePrefix];
      }));
      return {
        postcssPlugin: 'postcss-tailwind-shortcuts',
        Root: function Root(root) {
          root.walkDecls(function (decl) {
            if (!decl.value) return;
            // Regular expression to match function calls like:
            // speed(slow), speed('slow'), speed("slow")
            var functionRegex = /(\w+)\((['"]?)([^'")]+)\2\)/g;
            var match;
            var newValue = decl.value;
            // Find and replace all function calls
            while ((match = functionRegex.exec(decl.value)) !== null) {
              var _match = match,
                fullMatch = _match[0],
                functionName = _match[1],
                argument = _match[3];
              // Check if this function name is in our aliases map
              if (functionMap.has(functionName)) {
                var cssVariablePrefix = functionMap.get(functionName);
                var replacement = "var(" + cssVariablePrefix + "-" + argument + ")";
                newValue = newValue.replace(fullMatch, replacement);
              }
            }
            // Update the declaration value if changes were made
            if (newValue !== decl.value) {
              decl.value = newValue;
            }
          });
        }
      };
    };
    postcssTailwindShortcuts.postcss = true;

    return postcssTailwindShortcuts;

}));
