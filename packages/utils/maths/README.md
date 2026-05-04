# Maths Utilities

Math helpers grouped by category.

```ts
import { clamp, lerp, mod, average } from '#utils/maths/index.ts';
```

---

## Range (`range.ts`)

| Function | Signature | Description |
|---|---|---|
| `clamp` | `(value, min?, max?) → number` | Clamps value between min (0) and max (1) |
| `map` | `(value, min, max, nmin, nmax) → number` | Maps value from one range to another |
| `mapClamp` | `(value, start1, stop1, start2, stop2) → number` | Maps and clamps to target range |
| `normalize` | `(value, min, max) → number` | Normalizes value to [0, 1] |
| `smoothstep` | `(x, min, max) → number` | Smooth Hermite interpolation between 0 and 1 |

```ts
clamp(1.5);           // 1
clamp(0.3, 0, 0.5);  // 0.3
normalize(75, 0, 100); // 0.75
smoothstep(0.5, 0, 1); // 0.5
```

---

## Interpolation (`interpolation.ts`)

| Function | Signature | Description |
|---|---|---|
| `lerp` | `(start, end, t) → number` | Linear interpolation |
| `lerpPrecise` | `(start, end, t, limit?) → number` | Lerp that snaps to end when close enough |
| `damp` | `(a, b, smoothing, dt) → number` | Frame-rate independent smoothing |
| `dampPrecise` | `(a, b, smoothing, dt, limit?) → number` | Damp that snaps to target when close enough |
| `yoyo` | `(value) → number` | Ping-pongs value: 0→1→0 over input range [0, 1] |

```ts
lerp(0, 100, 0.25);              // 25
damp(current, target, 5, delta); // smoothed value
yoyo(0.75);                      // 0.5
```

---

## Statistics (`stats.ts`)

| Function | Signature | Description |
|---|---|---|
| `roundToDecimals` | `(value, decimals) → number` | Rounds to N decimal places |
| `average` | `(values) → number` | Arithmetic mean of array |
| `median` | `(values?) → number` | Median of array |

```ts
roundToDecimals(3.14159, 2); // 3.14
average([1, 2, 3, 4]);       // 2.5
median([1, 3, 2]);           // 2
```

---

## Modulo (`modulo.ts`)

| Function | Signature | Description |
|---|---|---|
| `mod` | `(dividend, divisor) → number` | Always-positive mathematical modulo (unlike `%`) |
| `symmetricMod` | `(value, base) → number` | Modulo centered around zero |

```ts
mod(-1, 3);          // 2  (vs -1 % 3 = -1)
symmetricMod(7, 10); // -3
```
