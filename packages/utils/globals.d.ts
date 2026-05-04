declare const __DEBUG__: boolean | undefined;
declare const __IS_PROD__: boolean | undefined;
declare const __TIMESTAMP__: string | undefined;

interface ImportMeta {
    readonly env: Record<string, string | boolean | undefined> & { MODE?: string };
}
