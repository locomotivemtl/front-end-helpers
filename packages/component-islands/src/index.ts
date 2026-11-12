import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import {
    discoverIslands,
    extractTag,
    importsMixin,
    isInDirectories,
    isSourceFile,
    resolveDirectories,
    toImportPath,
    type Inventory
} from './discovery.js';
import { resolveOptions, type ComponentIslandsOptions } from './options.js';
import { RESOLVED_VIRTUAL_ID, VIRTUAL_ID, createVirtualModule } from './virtual-module.js';

export type {
    ClientDirective,
    ClientDirectiveContext,
    ClientDirectiveOptions,
    ComponentIslandsOptions
} from './options.js';
export type { IslandErrorDetail, IslandLoadDetail } from './events.js';

/** Vite plugin that finds islands and emits the `@locomotivemtl/component-islands/revive` module. */
export default function componentIslands(userOptions: ComponentIslandsOptions = {}): Plugin {
    const options = resolveOptions(userOptions);
    let config: ResolvedConfig;
    let server: ViteDevServer | undefined;
    let directories: string[] = [];
    let inventory: Inventory = new Map();

    const tagOf = (file: string) => [...inventory].find(([, owner]) => owner === file)?.[0];

    async function rescan() {
        inventory = await discoverIslands(config.root, directories);
    }

    function invalidateVirtualModule() {
        if (!server) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (!module) return;
        server.moduleGraph.invalidateModule(module);
        void server.reloadModule(module);
    }

    // `code` is null for a deleted file. Rescans when the file starts, stops or changes being an island.
    async function sync(file: string, code: string | null) {
        if (!isSourceFile(file)) return;
        const knownTag = tagOf(file);
        const isIsland =
            code !== null && (isInDirectories(file, directories) || importsMixin(code));
        if (!knownTag && !isIsland) return;
        if (knownTag && isIsland && extractTag(file, code, config.root) === knownTag) return;

        await rescan();
        invalidateVirtualModule();
    }

    return {
        name: 'component-islands',
        enforce: 'pre',

        configResolved(resolved) {
            config = resolved;
            directories = resolveDirectories(
                options.directories,
                config.root,
                config.resolve.alias
            );
        },

        configureServer(devServer) {
            server = devServer;
        },

        async buildStart() {
            await rescan();
            if (!options.runtime.debug) return;
            for (const [tag, file] of inventory) {
                console.log('[component-islands]', `<${tag}> ->`, toImportPath(file, config.root));
            }
        },

        resolveId(id) {
            if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
        },

        async load(id) {
            if (id !== RESOLVED_VIRTUAL_ID) return;
            return createVirtualModule({
                root: config.root,
                inventory,
                options,
                // The importer anchors relative entrypoints to the project root, not the cwd.
                resolve: async (entrypoint) =>
                    (await this.resolve(entrypoint, path.join(config.root, 'index.html')))?.id ??
                    null
            });
        },

        async watchChange(id, { event }) {
            if (event === 'delete') return sync(id, null);
            if (isSourceFile(id)) return sync(id, await readFile(id, 'utf8'));
        },

        async transform(code, id) {
            if (server) await sync(id.split('?')[0], code);
        }
    };
}
