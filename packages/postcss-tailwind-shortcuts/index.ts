type Options = {
    prefix?: string;
    shortcuts?: {
        functionIdent: string;
        cssVariablePrefix: string;
    }[];
};

const defaultAliasesMap = [
    {
        functionIdent: 'speed',
        cssVariablePrefix: '--transition-duration'
    },
    {
        functionIdent: 'ease',
        cssVariablePrefix: '--ease'
    },
    {
        functionIdent: 'z',
        cssVariablePrefix: '--z-index'
    },
    {
        functionIdent: 'colorCode',
        cssVariablePrefix: '--color'
    },
    {
        functionIdent: 'spacing',
        cssVariablePrefix: '--spacing'
    },
    {
        functionIdent: 'radius',
        cssVariablePrefix: '--radius'
    }
];

const postcssTailwindShortcuts = (options: Options = {}) => {
    // Merge default aliases with custom shortcuts
    const aliasesMap = [...defaultAliasesMap, ...(options.shortcuts || [])];

    // Create a map for faster lookup
    const functionMap = new Map(
        aliasesMap.map((alias) => [alias.functionIdent, alias.cssVariablePrefix])
    );

    return {
        postcssPlugin: 'postcss-tailwind-shortcuts',

        Root(root) {
            root.walkDecls((decl) => {
                if (!decl.value) return;

                // Regular expression to match function calls like:
                // speed(slow), speed('slow'), speed("slow")
                const functionRegex = /(\w+)\((['"]?)([^'")]+)\2\)/g;
                let match;
                let newValue = decl.value;

                // Find and replace all function calls
                while ((match = functionRegex.exec(decl.value)) !== null) {
                    const [fullMatch, functionName, quote, argument] = match;

                    // Check if this function name is in our aliases map
                    if (functionMap.has(functionName)) {
                        const cssVariablePrefix = functionMap.get(functionName);
                        const replacement = `var(${cssVariablePrefix}-${argument})`;
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

export default postcssTailwindShortcuts;
