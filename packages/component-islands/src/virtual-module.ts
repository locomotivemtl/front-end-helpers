import { fileURLToPath } from 'node:url';
import { toImportPath, type Inventory } from './discovery.js';
import type { ResolvedOptions } from './options.js';

export const VIRTUAL_ID = '@locomotivemtl/component-islands/revive';
export const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

const RUNTIME_FILE = fileURLToPath(new URL('./runtime/index.js', import.meta.url));
const SINGLETON_KEY = '__component_islands_runtime__';

interface VirtualModuleInput {
    root: string;
    inventory: Inventory;
    options: ResolvedOptions;
    /** Resolves a custom directive entrypoint to a file id, or null. */
    resolve(entrypoint: string): Promise<string | null>;
}

/** Emits the module behind `@locomotivemtl/component-islands/revive`. */
export async function createVirtualModule({
    root,
    inventory,
    options,
    resolve
}: VirtualModuleInput): Promise<string> {
    const imports = [`import { revive } from ${JSON.stringify(RUNTIME_FILE)};`];
    const directives: string[] = [];

    for (const [index, { name, entrypoint }] of options.custom.entries()) {
        const id = await resolve(entrypoint);
        if (!id) {
            throw new Error(
                `[component-islands] Cannot resolve the entrypoint "${entrypoint}" of custom directive "${name}".`
            );
        }
        imports.push(`import directive${index} from ${JSON.stringify(id)};`);
        directives.push(`[${JSON.stringify(name)}, directive${index}]`);
    }

    const loaders = [...inventory]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
            ([tag, file]) =>
                `    ${JSON.stringify(tag)}: () => import(${JSON.stringify(toImportPath(file, root))})`
        );

    return `${imports.join('\n')}

const key = ${JSON.stringify(SINGLETON_KEY)};
const runtime = (globalThis[key] ??= revive({
    islands: {
${loaders.join(',\n')}
    },
    options: ${JSON.stringify(options.runtime)},
    customDirectives: new Map([${directives.join(', ')}])
}));

if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
        runtime.disconnect();
        delete globalThis[key];
    });
}

export const { scan, observe, unobserve, disconnect } = runtime;
`;
}
