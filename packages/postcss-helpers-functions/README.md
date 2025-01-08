# PostCSS Helpers Functions

A set of useful PostCSS functions to help you write better CSS. This plugin allows you to simplify complex CSS expressions like grid spacing, responsive font sizes, and viewport-based calculations directly in your CSS.

## Installation

```bash
npm install postcss-helpers-functions --save-dev
```

## Usage

To use this plugin, include it in your PostCSS configuration file.

### Example Configuration

#### 1. PostCSS Configuration (`postcss.config.js`):

```js
import postcssHelpersFunctions from 'postcss-helpers-functions';

export default {
    plugins: [
        postcssHelpersFunctions()
    ]
};
```

#### 2. CSS Input Example:

```css
.example {
    width: grid-space(6/12, 1);
    font-size: responsive-value(16px, 32px, 1200);
    height: dvh(100);
    padding: svh(5);
}
```

#### 3. Output CSS:

```css
.example {
    width: calc(0.5 * (calc(var(--vw, 1vw) * 100) - 2 * var(--grid-margin, 0px)) - 0.5 * var(--grid-gutter, 0px) + 1 * var(--grid-gutter, 0px));
    font-size: clamp(16px, calc(0.02666666666666667 * var(--vw, 1vw) * 100), 32px);
    height: calc(100 * var(--dvh, 1dvh));
    padding: calc(5 * var(--svh, 1svh));
}
```

## Features

### Helper Functions

This plugin provides several helper functions to streamline CSS calculations.

| Function              | Description                                                                                     | Example Usage                          | Example Output                                                                                                 |
|-----------------------|-------------------------------------------------------------------------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `gridSpace(frac, inset)` | Calculates grid spacing based on a fraction of the grid and an optional gutter inset.           | `grid-space(6/12, 1)`                  | `calc(0.5 * (calc(var(--vw) * 100) - 2 * var(--grid-margin)) - 0.5 * var(--grid-gutter) + 1 * var(--grid-gutter))` |
| `responsiveValue(min, max, breakpoint)` | Creates a responsive value using CSS `clamp()` for fluid scaling.                          | `responsive-value(16px, 32px, 1200)` | `clamp(16px, calc(0.026666 * var(--vw) * 100), 32px)`                                                          |
| `dvh(percentage)`      | Calculates a percentage of the dynamic viewport height.                                          | `dvh(100)`                             | `calc(100 * var(--dvh, 1dvh))`                                                                                 |
| `svh(percentage)`      | Calculates a percentage of the small viewport height.                                           | `svh(50)`                              | `calc(50 * var(--svh, 1svh))`                                                                                 |
| `lvh(percentage)`      | Calculates a percentage of the large viewport height.                                           | `lvh(100)`                             | `calc(100 * var(--lvh, 1lvh))`                                                                                 |
| `vw(percentage)`       | Calculates a percentage of the viewport width.                                                  | `vw(100)`                              | `calc(100 * var(--vw, 1vw))`                                                                                   |

---

### Detailed Function Descriptions

#### 1. **Grid Space Calculation (`gridSpace`)**

Generates a CSS `calc()` string for calculating a fraction of the grid width with an optional gutter inset.

**Syntax:**
```js
gridSpace(fraction, inset = 0)
```

**Parameters:**
- `fraction` (number): The fraction of the grid (e.g., `6/12` or `0.5` for half the grid).
- `inset` (number, optional): Multiplier for the grid gutter (default: `0`).

**Example:**
```css
width: grid-space(6/12, 1);
```

**Output:**
```css
width: calc(0.5 * (calc(var(--vw) * 100) - 2 * var(--grid-margin)) - 0.5 * var(--grid-gutter) + 1 * var(--grid-gutter));
```

---

#### 2. **Responsive Value Calculation (`responsiveValue`)**

Generates a CSS `clamp()` string for scaling values between a minimum and maximum size based on a breakpoint.

**Syntax:**
```js
responsiveValue(minSize, maxSize, breakpoint)
```

**Parameters:**
- `minSize` (string): Minimum value (e.g., `16px`).
- `maxSize` (string): Maximum value (e.g., `32px`).
- `breakpoint` (number): Maximum breakpoint value (e.g., `1200` for `1200px`).

**Example:**
```css
font-size: responsive-value(16px, 32px, 1200);
```

**Output:**
```css
font-size: clamp(16px, calc(0.026666 * var(--vw, 1vw) * 100), 32px);
```

---

#### 3. **Viewport Height Calculations (`dvh`, `svh`, `lvh`)**

Generates a CSS `calc()` string for dynamic viewport height values.

**Syntax:**
```js
dvh(percentage)
svh(percentage)
lvh(percentage)
```

**Example:**
```css
height: dvh(100);
padding: svh(5);
```

**Output:**
```css
height: calc(100 * var(--dvh, 1dvh));
padding: calc(5 * var(--svh, 1svh));
```

