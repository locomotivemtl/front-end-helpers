(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.PostCSSRemoveDoubleParentheses = factory());
})(this, (function () {
    var removeDoubleParentheses = function removeDoubleParentheses() {
      return {
        postcssPlugin: 'postcss-remove-double-parentheses',
        AtRule: {
          media: function media(atRule) {
            atRule.params = atRule.params.replace(/\(\((.*?)\)\)/g, '($1)');
          }
        }
      };
    };
    removeDoubleParentheses.postcss = true;

    return removeDoubleParentheses;

}));
