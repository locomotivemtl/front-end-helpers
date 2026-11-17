import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import componentIslands from './dist/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'test/fixtures', name);
const mixinAlias = {
    '@locomotivemtl/component-islands/island': path.join(here, 'dist/island.js')
};

async function buildFixture(name, pluginOptions, alias = {}) {
    const result = await build({
        root: fixture(name),
        configFile: false,
        logLevel: 'silent',
        plugins: [componentIslands(pluginOptions)],
        resolve: { alias: { ...mixinAlias, ...alias } },
        build: { write: false, minify: false }
    });
    return (Array.isArray(result) ? result[0] : result).output.filter(
        (item) => item.type === 'chunk'
    );
}

// Each island must sit in its own lazy chunk, apart from the entry chunk.
function assertIslandChunks(chunks) {
    const entry = chunks.find((chunk) => chunk.isEntry);
    assert.ok(entry, 'entry chunk exists');

    for (const [tag, file] of [
        ['product-form', 'ProductForm.ts'],
        ['cart-drawer', 'CartDrawer.ts'],
        ['site-footer', 'SiteFooter.ts']
    ]) {
        assert.ok(entry.code.includes(tag), `entry chunk lists <${tag}>`);
        const chunk = chunks.find((item) => item.moduleIds.some((id) => id.endsWith(file)));
        assert.ok(chunk, `${file} is bundled`);
        assert.notEqual(chunk, entry, `${file} is not in the entry chunk`);
        assert.ok(chunk.isDynamicEntry, `${file} is a lazy chunk`);
        assert.equal(
            chunk.moduleIds.filter((id) => /\/(ProductForm|CartDrawer|SiteFooter)\.ts$/.test(id))
                .length,
            1,
            `${file} has its own chunk`
        );
    }
    return entry;
}

const custom = [{ name: 'island:hash', entrypoint: './src/directives/hash.ts' }];

{
    const chunks = await buildFixture('basic', { directives: { custom } });
    const entry = assertIslandChunks(chunks);
    assert.ok(entry.code.includes('hashchange'), 'custom directive is bundled');
    assert.ok(entry.code.includes('island:hash'), 'custom directive is registered by attribute');
    console.log('ok  basic: three islands in their own chunks, custom directive bundled');
}

await assert.rejects(buildFixture('duplicate-tag'), (error) => {
    assert.match(error.message, /First\.ts/);
    assert.match(error.message, /Second\.ts/);
    assert.match(error.message, /same-tag/);
    return true;
});
console.log('ok  duplicate-tag: build rejects and names both files');

await assert.rejects(buildFixture('missing-define'), (error) => {
    assert.match(error.message, /NoDefine\.ts/);
    assert.match(error.message, /customElements\.define/);
    return true;
});
console.log('ok  missing-define: build rejects and names the file');

{
    const islandsDir = path.join(fixture('basic'), 'src/scripts/islands');
    const chunks = await buildFixture(
        'basic',
        { directories: ['@islands/'], directives: { custom } },
        { '@islands': islandsDir }
    );
    assertIslandChunks(chunks);
    console.log('ok  alias directory: @islands/ resolves to the same three tags');
}
