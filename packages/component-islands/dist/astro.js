import vitePlugin from './index.js';
/** Astro integration: adds the Vite plugin and loads the runtime on every page. */
export default function componentIslands(options) {
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
