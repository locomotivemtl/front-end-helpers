# Screen Utilities

Reactive helpers for viewport and device pixel ratio tracking.

```ts
import { useScreen, useResize, useDPR } from '#utils/screen/index.ts';
```

---

## `useScreen(options?)` → `UseScreenInstance`

Tracks `window` dimensions and device pixel ratio. Listens to `resize` and `orientationchange`.

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `onUpdate` | `(api) → void` | `() => {}` | Called on every change |
| `onDebouncedUpdate` | `(api) → void` | `() => {}` | Debounced version of `onUpdate` |
| `debounceTime` | `number` | `200` | Debounce delay in ms |

### Instance

| Property | Type | Description |
|---|---|---|
| `width` | `number` | `window.innerWidth` |
| `height` | `number` | `window.innerHeight` |
| `ratio` | `number` | width / height |
| `dpr` | `number` | Device pixel ratio |
| `start()` | `() → void` | Attach listeners |
| `stop()` | `() → void` | Detach listeners |

```ts
const screen = useScreen({
    onDebouncedUpdate: ({ width, height }) => resize(width, height)
});

screen.stop();
```

---

## `useResize($el, options?)` → `UseResizeInstance`

Tracks an element's dimensions via ResizeObserver.

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `onUpdate` | `(api) → void` | `() => {}` | Called on every change |
| `onDebouncedUpdate` | `(api) → void` | `() => {}` | Debounced version |
| `debounceTime` | `number` | `200` | Debounce delay in ms |
| `autoStart` | `boolean` | `true` | Start observing immediately |

### Instance

| Property | Type | Description |
|---|---|---|
| `width` | `number` | Element width |
| `height` | `number` | Element height |
| `ratio` | `number` | width / height |
| `start()` | — | Start observing |
| `stop()` | — | Stop observing |
| `destroy()` | — | Stop and disconnect observer |

```ts
const resize = useResize(container, {
    onUpdate: ({ width }) => setColumns(width)
});

resize.destroy();
```

---

## `useDPR(onUpdate?)` → `UseDPRInstance`

Tracks `window.devicePixelRatio` changes via media queries.

| Property | Type | Description |
|---|---|---|
| `value` | `number` | Current DPR |
| `start()` | — | Begin watching |
| `stop()` | — | Stop watching |

```ts
const dpr = useDPR((value) => canvas.setDPR(value));
dpr.stop();
```
