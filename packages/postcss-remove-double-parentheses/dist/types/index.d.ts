declare const removeDoubleParentheses: {
    (): {
        postcssPlugin: string;
        AtRule: {
            media(atRule: any): void;
        };
    };
    postcss: boolean;
};
export default removeDoubleParentheses;
