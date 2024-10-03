import { CustomThemeConfig } from 'tailwindcss/types/config';

type Options = {
    prefix?: string;
};

const tailwindAliasesMap = [
    {
        functionIdent: 'speed',
        tailwindKey: 'transitionDuration'
    },
    {
        functionIdent: 'ease',
        tailwindKey: 'transitionTimingFunction'
    },
    {
        functionIdent: 'z',
        tailwindKey: 'zIndex'
    },
    {
        functionIdent: 'color',
        tailwindKey: 'colors'
    },
    {
        functionIdent: 'spacing',
        tailwindKey: 'spacing'
    }
];

const postcssTailwindShortcuts = (tailwindThemeConfig: Partial<CustomThemeConfig>, options: Options = {}) => {
    return {
        postcssPlugin: 'postcss-tailwind-shortcuts',

        Root(root) {
            root.walkDecls((decl) => {
                // Create a concatenated regular expression pattern for all functionIdent values
                const functionIdents = tailwindAliasesMap
                    .map((alias) => {
                        if (options?.prefix) {
                            return `${options?.prefix}-${alias.functionIdent}`;
                        }

                        return alias.functionIdent;
                    })
                    .join('|');
                const regex = new RegExp(
                    `\\b(${functionIdents})\\s*\\(\\s*['"]?([^'")]+)?['"]?\\s*\\)`,
                    'g'
                );

                // Replace the function with the Tailwind value
                decl.value = decl.value.replace(regex, (match, ident, value) => {
                    // Find the corresponding tailwind key and get the value
                    const alias = tailwindAliasesMap.find((alias) => {
                        if (options?.prefix) {
                            return `${options?.prefix}-${alias.functionIdent}` === ident;
                        }

                        return alias.functionIdent === ident;
                    });

                    if (alias) {
                        const tailwindKey = alias.tailwindKey;
                        const defaultValue = 'default'; // Default key value to use if no value is provided

                        // Determine the value to use
                        const keyValue = value || defaultValue;

                        // Access the value from the Tailwind config
                        const tailwindValue = tailwindThemeConfig.extend[tailwindKey]?.[keyValue];

                        // Log an error if no value is found
                        if (!tailwindValue) {
                            console.error(`No value found for ${tailwindKey}.${keyValue}`);
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

export default postcssTailwindShortcuts;
