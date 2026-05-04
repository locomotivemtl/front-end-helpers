# Storage Utilities

Type-safe wrappers around `localStorage`/`sessionStorage` with nanostores integration, nested key support, and a write queue to prevent race conditions.

```ts
import { useStorage, useLocalStorage, useSessionStorage, useStorageState } from '#utils/storage/index.ts';
```

---

## `useStorage(id, storage?, options?)` → `StorageObject`

Creates (or retrieves) a named storage bucket. All data is stored under a single key in the underlying storage.

In production builds, the ID is automatically salted with a timestamp hash to prevent stale cache reads across deploys.

```ts
const store = useStorage('my-app');
```

### Options

| Param | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | `'dummy'` | Bucket name (lowercased automatically) |
| `storage` | `Storage` | `localStorage` | Any `Storage`-compatible object |
| `encode` | `(v) → string` | `JSON.stringify` | Custom serializer |
| `decode` | `(s) → any` | `JSON.parse` | Custom deserializer |

### Shorthand factories

```ts
useLocalStorage('my-app');              // localStorage
useSessionStorage('my-app');            // sessionStorage
```

---

### `StorageObject` API

| Method | Description |
|---|---|
| `get(key, def?)` | Read value at dot-separated path, returns `def` if missing |
| `set(key, value)` | Write value at dot-separated path (enqueued) |
| `remove(key)` | Delete key at path (enqueued) |
| `clear()` | Remove entire bucket from storage, unsubscribe all atoms |
| `sync(key, atom, reset?)` | Two-way bind a nanostores atom to a storage key |
| `folder(subKey)` | Returns a scoped `StorageObject` for a sub-namespace |

```ts
const store = useLocalStorage('my-app');

store.set('user.name', 'Alex');
store.get('user.name');        // 'Alex'
store.get('user.age', 0);     // 0 (default)

store.remove('user.name');
store.clear();
```

### Nanostores sync

```ts
import { atom } from 'nanostores';

const $count = atom(0);
store.sync('count', $count); // atom and storage stay in sync

$count.set(5); // automatically persisted
```

### Folders (sub-namespaces)

```ts
const settings = store.folder('settings');
settings.set('theme', 'dark');
settings.get('theme'); // 'dark'
settings.clear();      // resets only the 'settings' sub-object
```

---

## `useStorageState(id, atom, storage?, options?)` → `WritableAtom`

Lightweight single-atom persistence, independent of `useStorage`. Useful for one-off persisted signals.

```ts
import { atom } from 'nanostores';

const $theme = atom('light');
useStorageState('theme', $theme);

$theme.set('dark'); // persisted to localStorage under '__storage_state:theme'
```
