# Color Utilities

Helpers for manipulating and normalizing CSS color strings.

```ts
import { lighten, normalizeColor } from '#utils/colors/index.ts';
```

---

## API

### `lighten(color, amount?)` → `string`

Lightens a hex or rgb/rgba color toward white.

| Param | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | — | Hex (`#rrggbb`) or `rgb()`/`rgba()` string |
| `amount` | `number` | `0.3` | Factor 0–1 (0 = no change, 1 = white) |

```ts
lighten('#ff0000', 0.5);            // '#ff8080'
lighten('rgb(255, 0, 0)', 0.5);     // 'rgba(255, 128, 128, 0.2)'
lighten('rgba(0, 0, 0, 1)', 0.3);   // 'rgba(77, 77, 77, 1)'
```

---

### `normalizeColor(color)` → `string`

Normalizes any color string to a consistent CSS format.

- `rgb`/`rgba` → normalized comma-separated format
- `0xRRGGBB` → `#rrggbb`
- `#rrggbb` → returned as-is
- `rrggbb` (no prefix) → `#rrggbb`
- CSS color names → returned as-is

```ts
normalizeColor('0xff0000');        // '#ff0000'
normalizeColor('ff0000');          // '#ff0000'
normalizeColor('rgb(255  0  0)');  // 'rgb(255, 0, 0)'
```
