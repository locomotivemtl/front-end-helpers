import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const ROOT_SCAN_SKIPPED = new Set(['node_modules', 'dist', 'build', 'public']);
const MIXIN_IMPORT = /(?:from|import)\s*\(?\s*['"]@locomotivemtl\/component-islands\/island(?:\.js)?['"]/;
const STATIC_DEFINE = /customElements\.define\(\s*(['"`])([^'"`$\\\s]*)\1/g;
function toPosix(file) {
    return file.split(path.sep).join('/');
}
function applyAlias(dir, aliases) {
    for (const { find, replacement } of aliases) {
        if (typeof find === 'string') {
            if (dir === find || dir.startsWith(find.endsWith('/') ? find : `${find}/`)) {
                return replacement + dir.slice(find.length);
            }
        }
        else if (find.test(dir)) {
            return dir.replace(find, replacement);
        }
    }
    return null;
}
/** Turns root-relative paths and alias paths into absolute directories. */
export function resolveDirectories(directories, root, aliases) {
    return directories.map((dir) => {
        const aliased = applyAlias(dir, aliases);
        if (aliased !== null)
            return path.resolve(root, aliased);
        if (dir.startsWith(root))
            return path.resolve(dir);
        return path.join(root, dir);
    });
}
export function isSourceFile(file) {
    return /\.(ts|js)$/.test(file) && !file.endsWith('.d.ts') && !file.includes('node_modules');
}
export function isInDirectories(file, directories) {
    return directories.some((dir) => toPosix(file).startsWith(`${toPosix(dir).replace(/\/$/, '')}/`));
}
export function importsMixin(code) {
    return MIXIN_IMPORT.test(code);
}
/** The import path for a file: root-relative inside the root, absolute outside it. */
export function toImportPath(file, root) {
    const relative = toPosix(path.relative(root, file));
    return relative.startsWith('..') ? toPosix(file) : `/${relative}`;
}
/** Reads the one static `customElements.define('tag', ...)` of an island file. */
export function extractTag(file, code, root) {
    const withoutComments = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
    const tags = [...withoutComments.matchAll(STATIC_DEFINE)].map((match) => match[2]);
    const name = toImportPath(file, root);
    if (tags.length !== 1) {
        throw new Error(`[component-islands] ${name} must contain exactly one static customElements.define('tag-name', ...) ` +
            `with a string literal tag, found ${tags.length}. One island file owns one tag.`);
    }
    if (!tags[0].includes('-')) {
        throw new Error(`[component-islands] ${name} defines "${tags[0]}", a custom element tag must contain a hyphen.`);
    }
    return tags[0];
}
async function listSources(dir, skipDir) {
    const files = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!skipDir(entry.name))
                files.push(...(await listSources(full, skipDir)));
        }
        else if (isSourceFile(full)) {
            files.push(full);
        }
    }
    return files;
}
async function exists(dir) {
    return stat(dir).then((info) => info.isDirectory(), (error) => {
        if (error.code === 'ENOENT')
            return false;
        throw error;
    });
}
/**
 * Finds every island: all sources under the island directories, plus any source
 * in the project that imports the Island mixin. Throws when a tag is missing or owned twice.
 */
export async function discoverIslands(root, directories) {
    const sources = new Map();
    const read = async (file) => {
        if (!sources.has(file))
            sources.set(file, await readFile(file, 'utf8'));
        return sources.get(file);
    };
    for (const dir of directories) {
        if (!(await exists(dir)))
            continue;
        for (const file of await listSources(dir, (name) => name === 'node_modules'))
            await read(file);
    }
    const skipRootDir = (name) => name.startsWith('.') || ROOT_SCAN_SKIPPED.has(name);
    for (const file of await listSources(root, skipRootDir)) {
        if (sources.has(file) || importsMixin(await readFile(file, 'utf8')))
            await read(file);
    }
    const inventory = new Map();
    for (const [file, code] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
        const tag = extractTag(file, code, root);
        const owner = inventory.get(tag);
        if (owner) {
            throw new Error(`[component-islands] <${tag}> is defined by two files:\n- ${toImportPath(owner, root)}\n- ${toImportPath(file, root)}\n` +
                'Each tag must be owned by exactly one island file.');
        }
        inventory.set(tag, file);
    }
    return inventory;
}
