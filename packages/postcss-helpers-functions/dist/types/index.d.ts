declare const postcssHelpersFunctions: {
    (options?: {}): {
        postcssPlugin: string;
        Root(root: any): Promise<void>;
    };
    postcss: boolean;
};
export default postcssHelpersFunctions;
