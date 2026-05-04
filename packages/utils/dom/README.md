# DOM Utilities

Helpers for DOM access, querying, and element observation.

```ts
import { $html, $body, onDOMReady, forceReflow, useBoundingRect } from '#utils/dom/index.ts';
```

---

## DOM Helpers (`dom.ts`)

### `$html` / `$body`

Pre-resolved references to `document.documentElement` and `document.body`.

```ts
$html.classList.add('is-ready');
```

---

### `forceReflow(node?)` → `void`

Forces a synchronous layout reflow by reading `offsetHeight`. Useful to flush pending style transitions.

```ts
el.classList.add('is-hidden');
forceReflow(el);
el.classList.add('is-visible');
```

---

### `onDOMReady(callback)` → `void`

Calls `callback` immediately if DOM is ready, otherwise waits for `DOMContentLoaded`.

```ts
onDOMReady(() => init());
```

---

## Bounding Rect (`useBounding.ts`)

### `useBoundingRect($el, options?)` → `DynamicBoundingRect`

Tracks an element's bounding rect reactively via a nanostores atom.

| Option | Type | Default | Description |
|---|---|---|---|
| `callback` | `(rect) → void` | `() => {}` | Called on every update |
| `updateOnResize` | `boolean` | `true` | Observe element via ResizeObserver |

```ts
const bounding = useBoundingRect(el, {
    callback: (rect) => console.log(rect.width),
    updateOnResize: true
});

bounding.data.subscribe((rect) => applyRect(rect));
bounding.update();  // force update
bounding.dispose(); // clean up observers
```
