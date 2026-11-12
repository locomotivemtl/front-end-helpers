import type { Plugin } from 'vite';
import vitePlugin from './index.js';
import type { ComponentIslandsOptions } from './options.js';

// The part of Astro's integration API used here, so the package does not depend on astro.
interface AstroSetupParams {
    updateConfig(config: { vite: { plugins: Plugin[] } }): unknown;
    injectScript(stage: 'page', content: string): void;
}

interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'(params: AstroSetupParams): void;
    };
}

/** Astro integration: adds the Vite plugin and loads the runtime on every page. */
export default function componentIslands(options?: ComponentIslandsOptions): AstroIntegration {
    return {
        name: '@locomotivemtl/component-islands',
        hooks: {
            'astro:config:setup': ({ updateConfig, injectScript }) => {
                updateConfig({ vite: { plugins: [vitePlugin(options)] } });
                injectScript('page', "import '@locomotivemtl/component-islands/revive';");
            }
        }
    };
}
