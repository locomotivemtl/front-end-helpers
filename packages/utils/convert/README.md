# Convert Utilities

Safe coercion helpers for casting unknown values to primitives.

```ts
import { float, nullFloat, integer, boolean } from '#utils/convert/index.ts';
```

---

## API

### `float(value, defaultValue)` → `number`

Casts any value to a float. Strips trailing `px` from strings. Returns `defaultValue` on failure.

```ts
float('3.14', 0)    // 3.14
float('12px', 0)    // 12
float('', 0)        // 0
float(null, 0)      // 0
```

---

### `nullFloat(value)` → `number | null`

Same as `float` but returns `null` instead of a default when conversion fails.

```ts
nullFloat('3.14')  // 3.14
nullFloat('abc')   // null
nullFloat(null)    // null
```

---

### `integer(value, defaultValue)` → `number`

Casts any value to an integer via `parseInt`. Returns `defaultValue` on failure.

```ts
integer('42', 0)    // 42
integer('3.9', 0)   // 3
integer('abc', 0)   // 0
```

---

### `boolean(value, defaultValue)` → `boolean`

Casts any value to a boolean. Strings `"true"`/`"false"` (case-insensitive) are parsed explicitly. Numbers > 0 are `true`.

```ts
boolean('true', false)   // true
boolean('FALSE', false)  // false
boolean(1, false)        // true
boolean(0, true)         // false
boolean(null, true)      // true (fallback)
```
