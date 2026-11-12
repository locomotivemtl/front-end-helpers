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
    let failed = false;
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
    // After a failed rescan it rescans on every relevant event, since the tag set is stale.
    async function sync(file, code) {
        if (!isSourceFile(file))
            return;
        const knownTag = tagOf(file);
        const isIsland = code !== null && (isInDirectories(file, directories) || importsMixin(code));
        if (!knownTag && !isIsland && !(failed && code === null))
            return;
        if (!failed && knownTag && isIsland && extractTag(file, code, config.root) === knownTag)
            return;
        await rescan();
        failed = false;
        invalidateVirtualModule();
    }
    // Discovery errors in dev come from user files: show them, keep the last good inventory.
    function reportError(error) {
        if (!server)
            throw error;
        failed = true;
        const err = error instanceof Error ? error : new Error(String(error));
        const { message, stack = '' } = err;
        server.config.logger.error(message, { timestamp: true, error: err });
        server.ws.send({ type: 'error', err: { message, stack, plugin: 'component-islands' } });
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
            try {
                if (event === 'delete')
                    return await sync(id, null);
                if (isSourceFile(id))
                    await sync(id, await readFile(id, 'utf8'));
            }
            catch (error) {
                reportError(error);
            }
        },
        async transform(code, id) {
            if (server)
                await sync(id.split('?')[0], code);
        }
    };
}
