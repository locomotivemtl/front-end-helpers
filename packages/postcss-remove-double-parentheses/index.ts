import { AtRule } from 'postcss';

const removeDoubleParentheses = () => {
    return {
        postcssPlugin: 'postcss-remove-double-parentheses',
        AtRule: {
            media(atRule: AtRule) {
                atRule.params = atRule.params.replace(/\(\((.*?)\)\)/g, '($1)');
            }
        }
    };
};

removeDoubleParentheses.postcss = true;

export default removeDoubleParentheses;
