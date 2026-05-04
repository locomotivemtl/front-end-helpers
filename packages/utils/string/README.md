# String Utilities

String helpers grouped by category.

```ts
import { capitalize, sanitize, createUUID } from '#utils/string/index.ts';
```

---

## Case & Formatting (`case.ts`)

| Function | Signature | Description |
|---|---|---|
| `toDash` | `(str) → string` | Converts PascalCase/camelCase to dash-case |
| `kamelCaseToDash` | `(str) → string` | Converts camelCase to dash-case (handles adjacent capitals correctly) |
| `capitalize` | `(str) → string` | Uppercases the first character |
| `lcfirst` | `(str?) → string` | Lowercases the first character |

```ts
toDash('MyComponent');      // 'my-component'
kamelCaseToDash('myValue'); // 'my-value'
capitalize('hello');        // 'Hello'
lcfirst('Hello');           // 'hello'
```

---

## Sanitize & Normalize (`sanitize.ts`)

| Function | Signature | Description |
|---|---|---|
| `sanitize` | `(str) → string` | Strips special chars, trims, replaces spaces with dashes, lowercases |
| `normalizeSlashHref` | `(href) → string` | Ensures href starts with `/` |

```ts
sanitize('Hello World!'); // 'hello-world'
normalizeSlashHref('about'); // '/about'
normalizeSlashHref('/about'); // '/about'
```

---

## Generate (`generate.ts`)

| Function | Signature | Description |
|---|---|---|
| `hash` | `(str) → string` | Deterministic 32-bit hash as hex string |
| `createUUID` | `() → string` | UUID v4 (RFC4122, no `crypto` dependency) |

```ts
hash('hello'); // 'a77f432d' (deterministic)
createUUID();  // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```
