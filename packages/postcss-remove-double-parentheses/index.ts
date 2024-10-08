const removeDoubleParentheses = () => {
    return {
        postcssPlugin: 'postcss-remove-double-parentheses',
        AtRule: {
            media(atRule) {
                atRule.params = atRule.params.replace(/\(\((.*?)\)\)/g, '($1)');
            }
        }
    };
};

removeDoubleParentheses.postcss = true;

export default removeDoubleParentheses;
