# @locomotivemtl/component-islands

A Vite plugin and Astro integration that lazy-loads custom elements ("islands"). A custom element's JavaScript downloads only when its directive says so: when it scrolls into view, when the browser is idle, on first hover, and so on.

## Install

```bash
npm install -D @locomotivemtl/component-islands
```

`vite` 6 or newer is a peer dependency.

## Vite setup

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import componentIslands from '@locomotivemtl/component-islands';

export default defineConfig({
    plugins: [componentIslands()]
});
```

Import the runtime once in your client entry:

```ts
import '@locomotivemtl/component-islands/revive';
```

The plugin finds your islands at build time and emits one lazy chunk per island. The runtime is a page-level singleton: importing `revive` from several files shares one instance.

## Astro setup

```js
// astro.config.mjs
import componentIslands from '@locomotivemtl/component-islands/astro';

export default { integrations: [componentIslands()] };
```

The integration registers the Vite plugin and injects the revive script on every page. It observes the `<html>` element, so it works with the `ClientRouter` view transitions: the islands of the new `<body>` are found after each navigation. Bare directive attributes work in `.astro` files: Astro outputs them as `="true"`, which the runtime treats as no value.

## Writing islands

An island is a file that defines one custom element. Two ways to mark it, and you can use both.

**Directory.** Every `.ts` or `.js` file under an island directory is an island. The default is `/src/scripts/islands/`. Subdirectories are scanned too.

**Mixin.** Any file that imports `Island` is an island, wherever it lives:

```ts
// src/components/SiteFooter.ts
import Island from '@locomotivemtl/component-islands/island';

class SiteFooter extends Island(HTMLElement) {
    connectedCallback() {
        // ...
    }
}

customElements.define('site-footer', SiteFooter);
```

`Island` returns its argument unchanged. It only marks the file for discovery.

Rules, checked at build time:

- Each island file contains exactly one static `customElements.define('tag-name', ...)`, with a string literal as the first argument. Zero or several fail the build.
- The tag contains a hyphen.
- A tag is owned by one file. Two files with the same tag fail the build and the error names both.
- The filename does not matter. `CartDrawer.ts` can define `cart-drawer`.

An island that sits inside another island waits for its parent's module. When the parent loads, the runtime walks the parent again, so the child activates with its own directives.

```html
<product-form island:visible>
    <!-- loads after product-form, then follows its own directive -->
    <tab-switcher island:idle></tab-switcher>
</product-form>
```

## Directives

Add an attribute to the element. Without any directive, the island loads at once.

The first element of a tag that the runtime finds decides when that tag loads. Other elements of the same tag wait for the module and then upgrade as usual. If the deciding element is removed first, the next element of that tag takes over with its own directives.

### `island:visible`

Loads when the element enters the viewport. The value overrides `rootMargin` (default `200px`).

```html
<product-recommendations island:visible></product-recommendations>
<product-recommendations island:visible="0px"></product-recommendations>
```

### `island:media`

Loads when a media query matches. An empty value logs a warning and skips the check.

```html
<mobile-menu island:media="(max-width: 768px)"></mobile-menu>
```

### `island:idle`

Loads when the browser is idle, with a timeout (default 500 ms). The value overrides the timeout. It must be an integer, otherwise the runtime warns and uses the default. Browsers without `requestIdleCallback` get a plain timer.

```html
<recently-viewed island:idle="2000"></recently-viewed>
```

### `island:defer`

Loads after a fixed delay (default 3000 ms). The value is the delay in ms. A value that is not an integer warns and uses the default.

```html
<chat-widget island:defer="5000"></chat-widget>
```

### `island:interaction`

Loads on the first of `mouseenter`, `touchstart` or `focusin` on the element. The value overrides the events, separated by spaces or commas. An empty value uses the defaults.

```html
<cart-flyout island:interaction="mouseenter click"></cart-flyout>
```

### Combining directives

Directives on one element resolve in sequence: `visible`, `media`, `idle`, `defer`, `interaction`, then custom directives. Each one starts only when the previous one has passed. This keeps interaction listeners off elements that are not on screen yet.

```html
<custom-menu island:visible island:interaction></custom-menu>
```

### Why `island:` and not `client:`

Astro's compiler treats `client:*` on a custom element as a request for framework hydration and removes the attribute. `island:*` passes through untouched. You can change any attribute name in the options.

## Custom directives

A custom directive is a module with a default export. It receives `load`, the attribute info, the element and a context. Call `load()` when the condition is met.

```ts
// src/directives/hash.ts
import type { ClientDirective } from '@locomotivemtl/component-islands';

const hash: ClientDirective = (load, { value }, $el, ctx) => {
    if (location.hash === value) {
        void load();
        return;
    }
    const onChange = () => location.hash === value && void load();
    window.addEventListener('hashchange', onChange);
    ctx.onCleanup(() => window.removeEventListener('hashchange', onChange));
};

export default hash;
```

Register it by attribute name. `entrypoint` is resolved by Vite, so aliases work.

```ts
componentIslands({
    directives: { custom: [{ name: 'island:hash', entrypoint: './src/directives/hash.ts' }] }
});
```

```html
<product-reviews island:hash="#reviews"></product-reviews>
```

| Argument        | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `load`          | Call it when the condition is met.                                         |
| `options.name`  | The attribute name, for example `island:hash`.                             |
| `options.value` | The attribute value. Empty string when there is none.                      |
| `$el`           | The island element.                                                        |
| `ctx.signal`    | Aborts when the element is removed, unobserved or the runtime disconnects. |
| `ctx.onCleanup` | Registers work that runs once, when the directive resolves or aborts.      |

All custom directives present on an element must call `load()`. If one throws or rejects, the runtime dispatches `islands:error` and abandons that attempt.

## Retry

When a module fails to load, the runtime can try again. The delay doubles on each attempt.

```ts
componentIslands({ retry: { retries: 3, delay: 1000 } }); // waits 1s, 2s, 4s
```

Every failed attempt dispatches `islands:error`. When the attempts run out, a newly added element of that tag starts a fresh activation.

## Events

The runtime dispatches two events on `document`.

```ts
import { onIslandLoad, onIslandError } from '@locomotivemtl/component-islands/events';

const stop = onIslandLoad(({ tag, duration, attempt }) => {
    console.log(`<${tag}> loaded in ${duration}ms on attempt ${attempt}`);
});
onIslandError(({ tag, error, attempt }) => console.warn(tag, attempt, error));

stop();
```

Both helpers return an unsubscribe function. You can also listen to the raw events, `islands:load` and `islands:error`, with `document.addEventListener`. The details are typed through the `DocumentEventMap` augmentation in `events`.

## Runtime API

For content swapped after load, for example with Swup or Taxi, the revive module exports four functions:

```ts
import { scan, observe, unobserve, disconnect } from '@locomotivemtl/component-islands/revive';

scan($container); // walk a subtree now. Defaults to document.body
unobserve($container); // skip a subtree and abort its pending activations
observe($container); // lift unobserve and walk the subtree again
disconnect(); // stop everything
```

`unobserve()` with no argument or with `document.body` is the same as `disconnect()`. After `disconnect()`, later calls do nothing. Calling it before `DOMContentLoaded` also cancels the pending start. Passing `null` (for example a failed `querySelector`) does nothing.

The runtime observes DOM changes itself, so most pages never call these.

## Options

| Option                             | Type                                     | Default                                   |
| ---------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `directories`                      | `string \| string[]`                     | `['/src/scripts/islands/']`               |
| `directives.visible.attribute`     | `string`                                 | `'island:visible'`                        |
| `directives.visible.rootMargin`    | `string`                                 | `'200px'`                                 |
| `directives.visible.threshold`     | `number`                                 | `0`                                       |
| `directives.idle.attribute`        | `string`                                 | `'island:idle'`                           |
| `directives.idle.timeout`          | `number` (ms)                            | `500`                                     |
| `directives.media.attribute`       | `string`                                 | `'island:media'`                          |
| `directives.defer.attribute`       | `string`                                 | `'island:defer'`                          |
| `directives.defer.delay`           | `number` (ms)                            | `3000`                                    |
| `directives.interaction.attribute` | `string`                                 | `'island:interaction'`                    |
| `directives.interaction.events`    | `string[]`                               | `['mouseenter', 'touchstart', 'focusin']` |
| `directives.custom`                | `{ name: string; entrypoint: string }[]` | `[]`                                      |
| `retry.retries`                    | `number`                                 | `0`                                       |
| `retry.delay`                      | `number` (ms, doubles each attempt)      | `1000`                                    |
| `debug`                            | `boolean`                                | `false`                                   |

Partial overrides keep the other defaults. `directories` entries are relative to the Vite root, or start with a Vite alias such as `'@islands/'`. A directory that does not exist is skipped. The project root is also scanned for files that import the `Island` mixin; `node_modules`, `dist`, `build`, `public` and hidden directories are skipped.

With `debug: true` the plugin logs every discovered island at build start and the runtime logs each tag as it is discovered, gated and loaded.

## TypeScript

Add the types of the virtual module to your project:

```ts
/// <reference types="@locomotivemtl/component-islands/revive" />
```

or list `@locomotivemtl/component-islands/revive` in `compilerOptions.types`. Importing `@locomotivemtl/component-islands/events` adds the typed `islands:load` and `islands:error` events to `document.addEventListener`.

## Not supported (yet)

- A directive timeout for custom directives that never call `load()`.
- Tags derived from filenames. The tag always comes from `customElements.define`.
- A `resolveTag` override.
- Shopify Theme Editor events.

## Credits

Inspired by [vite-plugin-shopify-theme-islands](https://github.com/Rees1993/vite-plugin-shopify-theme-islands) by Alex Rees (MIT). This package is a smaller rewrite for generic Vite and Astro projects.

## License

MIT
