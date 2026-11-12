import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { discoverIslands, extractTag, importsMixin, isInDirectories, isSourceFile, resolveDirectories, toImportPath } from './discovery.js';
import { resolveOptions } from './options.js';
import { RESOLVED_VIRTUAL_ID, VIRTUAL_ID, createVirtualModule } from './virtual-module.js';
/** Vite plugin that finds islands and emits the `@locomotivemtl/component-islands/revive` module. */
export default function componentIslands(userOptions = {}) {
    const options = resolveOptions(userOptions);
    let config;
    let server;
    let directories = [];
    let inventory = new Map();
    const tagOf = (file) => [...inventory].find(([, owner]) => owner === file)?.[0];
    async function rescan() {
        inventory = await discoverIslands(config.root, directories);
    }
    function invalidateVirtualModule() {
        if (!server)
            return;
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (!module)
            return;
        server.moduleGraph.invalidateModule(module);
        void server.reloadModule(module);
    }
    // `code` is null for a deleted file. Rescans when the file starts, stops or changes being an island.
    async function sync(file, code) {
        if (!isSourceFile(file))
            return;
        const knownTag = tagOf(file);
        const isIsland = code !== null && (isInDirectories(file, directories) || importsMixin(code));
        if (!knownTag && !isIsland)
            return;
        if (knownTag && isIsland && extractTag(file, code, config.root) === knownTag)
            return;
        await rescan();
        invalidateVirtualModule();
    }
    return {
        name: 'component-islands',
        enforce: 'pre',
        configResolved(resolved) {
            config = resolved;
            directories = resolveDirectories(options.directories, config.root, config.resolve.alias);
        },
        configureServer(devServer) {
            server = devServer;
        },
        async buildStart() {
            await rescan();
            if (!options.runtime.debug)
                return;
            for (const [tag, file] of inventory) {
                console.log('[component-islands]', `<${tag}> ->`, toImportPath(file, config.root));
            }
        },
        resolveId(id) {
            if (id === VIRTUAL_ID)
                return RESOLVED_VIRTUAL_ID;
        },
        async load(id) {
            if (id !== RESOLVED_VIRTUAL_ID)
                return;
            return createVirtualModule({
                root: config.root,
                inventory,
                options,
                // The importer anchors relative entrypoints to the project root, not the cwd.
                resolve: async (entrypoint) => (await this.resolve(entrypoint, path.join(config.root, 'index.html')))?.id ??
                    null
            });
        },
        async watchChange(id, { event }) {
            if (event === 'delete')
                return sync(id, null);
            if (isSourceFile(id))
                return sync(id, await readFile(id, 'utf8'));
        },
        async transform(code, id) {
            if (server)
                await sync(id.split('?')[0], code);
        }
    };
}
