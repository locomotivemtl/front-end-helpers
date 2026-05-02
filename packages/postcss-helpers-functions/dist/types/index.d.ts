import type { Declaration } from 'postcss';
export type PostCSSProcessorHelper = {
    name: string;
    processor: (value: string) => string;
};
/**
 * PostCSS plugin that processes custom CSS helper functions
 */
declare const postcssProcessorHelpers: {
    (helpers?: PostCSSProcessorHelper[]): {
        helpers: PostCSSProcessorHelper[];
        regex: RegExp;
        postcssPlugin: string;
        Declaration(decl: Declaration): void;
    };
    postcss: boolean;
};
export default postcssProcessorHelpers;
