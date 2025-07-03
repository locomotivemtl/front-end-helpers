type Options = {
    prefix?: string;
    shortcuts?: {
        functionIdent: string;
        cssVariablePrefix: string;
    }[];
};
declare const postcssTailwindShortcuts: {
    (options?: Options): {
        postcssPlugin: string;
        Root(root: any): void;
    };
    postcss: boolean;
};
export default postcssTailwindShortcuts;
