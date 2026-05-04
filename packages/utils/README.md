# @locomotivemtl/utils

General-purpose TypeScript utilities for frontend projects. Tree-shakeable, no runtime dependencies (except `nanostores` for reactive DOM/storage helpers).

## Installation

```sh
npm install @locomotivemtl/utils
```

## Modules

| Module | Description |
|---|---|
| [`async/`](./async/README.md) | Timing helpers — `wait`, `nextFrame`, `debounce`, `throttle`, `deferredPromise` |
| [`colors/`](./colors/README.md) | Color manipulation — `lighten`, `normalizeColor` |
| [`dom/`](./dom/README.md) | DOM utilities — `onDOMReady`, `forceReflow`, `useBoundingRect` |
| [`log/`](./log/README.md) | Logging — stylized console logger and DOM logger |
| [`maths/`](./maths/README.md) | Math helpers — `clamp`, `lerp`, `damp`, `mod`, `average`, and more |
| [`screen/`](./screen/README.md) | Viewport tracking — `useScreen`, `useResize`, `useDPR` |
| [`storage/`](./storage/README.md) | Storage wrappers — `useStorage`, `useLocalStorage`, `useStorageState` |
| [`string/`](./string/README.md) | String helpers — `capitalize`, `toDash`, `sanitize`, `createUUID` |
| [`convert/`](./convert/README.md) | Type coercion — `float`, `nullFloat`, `integer`, `boolean` |
| [`object/`](./object/README.md) | Deep object ops — `dlv`, `dsv`, `ddv` via dot-separated paths |

## Usage

Import directly from the submodule for the best tree-shaking:

```ts
import { clamp, lerp } from '@locomotivemtl/utils/maths';
import { debounce } from '@locomotivemtl/utils/async';
import { useScreen } from '@locomotivemtl/utils/screen';
```
