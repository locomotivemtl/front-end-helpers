# PostCSS Tailwind Shortcuts

PostCSS plugin that scans your CSS declarations and looks for function calls that match the configured shortcuts. When it finds a match, it replaces the function call with a CSS variable reference that follows Tailwind v4's naming conventions. Works with both Tailwind and custom CSS files.

For example:

-   `speed(slow)` becomes `var(--transition-duration-slow)`
-   `colorCode('primary')` becomes `var(--color-primary)`

## Installation

```bash
npm install @locomotivemtl/postcss-tailwind-shortcuts --save-dev
```

## Usage

To use this plugin, include it in your PostCSS configuration file.

### Basic Configuration

PostCSS Configuration:

```js
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';

export default {
    plugins: [postcssTailwindShortcuts()]
};
```

### With Custom Shortcuts

You can add your own custom shortcuts by passing them in the options:

```js
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';

export default {
    plugins: [
        postcssTailwindShortcuts({
            shortcuts: [
                {
                    functionIdent: 'shadow',
                    cssVariablePrefix: '--shadow'
                },
                {
                    functionIdent: 'radius',
                    cssVariablePrefix: '--radius'
                }
            ]
        })
    ]
};
```

And set them in your Tailwind theme configuration:

```css
/* Using Tailwind @theme directive */
@theme {
    --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --radius-medium: 0.375rem;
}
```

## Options

| Option      | Type    | Description                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------------------- |
| `shortcuts` | `Array` | Array of custom shortcut objects with `functionIdent` and `cssVariablePrefix` properties |

### Shortcut Object Structure

Each shortcut object should have:

-   `functionIdent`: The function name to use in CSS (e.g., `'shadow'`)
-   `cssVariablePrefix`: The CSS variable prefix (e.g., `'--shadow'`)

## Default Shortcut Functions

This plugin comes with the following pre-configured shortcuts that are based on **Tailwind CSS v4's variable naming conventions**:

-   `speed(value)`: Converts to `var(--transition-duration-{value})`
-   `ease(value)`: Converts to `var(--ease-{value})`
-   `z(value)`: Converts to `var(--z-index-{value})`
-   `colorCode(value)`: Converts to `var(--color-{value})`
-   `spacing(value)`: Converts to `var(--spacing-{value})`

These shortcuts are designed to work with Tailwind CSS v4's CSS variable system, where design tokens are exposed as CSS custom properties.

## Example Usage

### Basic Examples

```css
/* Input CSS */
.example {
    transition-duration: speed(slow);
    transition-timing-function: ease(fast);
    z-index: z(modal);
    color: colorCode(primary);
    margin: spacing(4);
}

/* Output CSS */
.example {
    transition-duration: var(--transition-duration-slow);
    transition-timing-function: var(--ease-fast);
    z-index: var(--z-index-modal);
    color: var(--color-primary);
    margin: var(--spacing-4);
}
```

### With Custom Shortcuts

```css
/* Input CSS */
.card {
    box-shadow: shadow(large);
    border-radius: radius(medium);
    background-color: colorCode('accent');
}

/* Output CSS */
.card {
    box-shadow: var(--shadow-large);
    border-radius: var(--radius-medium);
    background-color: var(--color-accent);
}
```

### Quoted Arguments

The plugin supports both quoted and unquoted arguments:

```css
/* All of these work the same way */
.element {
    border-radius: radius(medium);
    border-radius: radius('medium');
    border-radius: radius('medium');
}
```

### Custom CSS Variables Setup

If you're using custom shortcuts or want to extend the default behavior, you can define additional CSS variables:

```css
/* Custom CSS */
:root {
    --box-shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --border-radius-medium: 0.375rem;
}
```
