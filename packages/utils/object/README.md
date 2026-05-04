# Object Utilities

Deep get/set/delete for nested objects using dot-separated key paths.

```ts
import { dlv, dsv, ddv } from '#utils/object/index.ts';
```

---

## API

### `dlv(obj, key, def?)` → `any`

Deep get. Resolves a dot-separated path, returns `def` (default: `null`) if not found.

```ts
const obj = { a: { b: { c: 42 } } };

dlv(obj, 'a.b.c')         // 42
dlv(obj, 'a.b.x', 'nope') // 'nope'
```

---

### `dsv(obj, key, value)` → `obj`

Deep set. Writes `value` at the dot-separated path, creating intermediate objects as needed. Passing `undefined` as value deletes the key (delegates to `ddv`).

```ts
const obj = {};
dsv(obj, 'a.b.c', 42);
// obj → { a: { b: { c: 42 } } }

dsv(obj, 'a.b.c', undefined);
// obj → { a: { b: {} } }
```

---

### `ddv(obj, key)` → `boolean`

Deep delete. Removes the property at the dot-separated path. Returns `true` if found and deleted, `false` otherwise.

```ts
const obj = { a: { b: { c: 42 } } };

ddv(obj, 'a.b.c') // true  → obj is { a: { b: {} } }
ddv(obj, 'a.b.x') // false → obj unchanged
```
