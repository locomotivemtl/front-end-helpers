import gridSpace from './functions/grid-space';
import responsiveValue from './functions/responsive-value';
import dvh from './functions/dvh';
import svh from './functions/svh';
import lvh from './functions/lvh';
import vw from './functions/vw';
import rem from './functions/rem';

const helpersFunctionsAliasesMap = [
    {
        functionIdent: 'grid-space',
        function: gridSpace
    },
    {
        functionIdent: 'responsive-value',
        function: responsiveValue
    },
    {
        functionIdent: 'dvh',
        function: dvh
    },
    {
        functionIdent: 'svh',
        function: svh
    },
    {
        functionIdent: 'lvh',
        function: lvh
    },
    {
        functionIdent: 'vw',
        function: vw
    },
    {
        functionIdent: 'rem',
        function: rem
    }
];

const postcssHelpersFunctions = (options = {}) => {
    return {
        postcssPlugin: 'postcss-helpers-functions',

        async Root(root) {
            root.walkDecls((decl) => {
                // Create a concatenated regular expression pattern for all functionIdent values
                const functionIdents = helpersFunctionsAliasesMap
                    .map((alias) => {
                        return alias.functionIdent;
                    })
                    .join('|');

                const regex = new RegExp(
                    `\\b(${functionIdents})\\s*\\(\\s*['"]?([^'")]+)?['"]?\\s*\\)`,
                    'g'
                );

                // Replace the function with the selected function result
                decl.value = decl.value.replace(regex, (match, ident, value) => {
                    const targetFunction = helpersFunctionsAliasesMap.find((alias) => {
                        return alias.functionIdent === ident;
                    });

                    if (targetFunction) {
                        const args = value.split(',').map((arg) => arg.trim());
                        return targetFunction.function.apply(null, args);
                    }

                    // Return the original value if no match is found
                    return match;
                });
            });
        }
    };
};

postcssHelpersFunctions.postcss = true;

export default postcssHelpersFunctions;
