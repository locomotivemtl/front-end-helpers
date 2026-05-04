# Async Utilities

Timing and async control helpers.

```ts
import { wait, debounce, deferredPromise } from '#utils/async/index.ts';
```

---

## Waiting (`wait.ts`)

| Function | Signature | Description |
|---|---|---|
| `wait` | `(ms) → Promise<void>` | Resolves after N milliseconds (setTimeout) |
| `nextFrame` | `() → Promise<null>` | Resolves on the next rendered animation frame (double rAF) |
| `nextTick` | `(times?) → Promise<void>` | Resolves after N event loop ticks (setTimeout 0) |
| `nextMicrotask` | `() → Promise<void>` | Resolves after current microtask queue (queueMicrotask) |
| `rafSetInterval` | `(cb, ms) → { cancel }` | rAF-based interval — pauses when tab is backgrounded |
| `rafWait` | `(ms) → Promise<void>` | rAF-based wait — pauses when tab is backgrounded |

```ts
await wait(1000);      // pause 1s
await nextFrame();     // wait for next paint
await nextTick(2);     // wait 2 event loop ticks

const interval = rafSetInterval((cancel) => {
    if (done) cancel();
}, 100);
interval.cancel();
```

> `rafSetInterval` and `rafWait` pause while the tab is inactive, unlike `setInterval`/`setTimeout`.

---

## Debounce & Throttle (`debounce.ts`)

| Function | Signature | Description |
|---|---|---|
| `debounce` | `(fn, ms) → Debounce<T>` | Returns debounced function with `.cancel()` method |
| `throttle` | `(fn, ms) → Throttle<T>` | Returns trailing-edge throttled function |

```ts
const onResize = debounce(() => measure(), 200);
window.addEventListener('resize', onResize);
onResize.cancel(); // clear pending call
```

---

## Deferred Promise (`deferredPromise.ts`)

| Function | Signature | Description |
|---|---|---|
| `deferredPromise` | `<T>() → { promise, resolve, reject }` | Creates a promise with externally accessible resolve/reject |

```ts
const deferred = deferredPromise<string>();

// somewhere else
deferred.resolve('done');

await deferred.promise; // 'done'
```
