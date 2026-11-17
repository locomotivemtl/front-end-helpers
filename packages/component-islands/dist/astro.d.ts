import type { Plugin } from 'vite';
import type { ComponentIslandsOptions } from './options.js';
interface AstroSetupParams {
    updateConfig(config: {
        vite: {
            plugins: Plugin[];
        };
    }): unknown;
    injectScript(stage: 'page', content: string): void;
}
interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'(params: AstroSetupParams): void;
    };
}
/** Astro integration: adds the Vite plugin and loads the runtime on every page. */
export default function componentIslands(options?: ComponentIslandsOptions): AstroIntegration;
export {};
