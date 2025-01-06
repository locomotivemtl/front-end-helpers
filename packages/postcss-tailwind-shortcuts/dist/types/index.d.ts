import { CustomThemeConfig } from 'tailwindcss/types/config';
type Options = {
    prefix?: string;
};
declare const postcssTailwindShortcuts: {
    (tailwindThemeConfig: Partial<CustomThemeConfig>, options?: Options): {
        postcssPlugin: string;
        Root(root: any): void;
    };
    postcss: boolean;
};
export default postcssTailwindShortcuts;
