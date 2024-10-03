# PostCSS Tailwind Shortcuts

PostCSS plugin that provides a set of shortcut functions for Tailwind CSS declarations. This plugin helps you write cleaner and more concise CSS by allowing you to use custom functions to reference Tailwind configuration values.

## Installtion 

```
npm install @locomotivemtl/postcss-tailwind-shortcuts --save-dev
```

## Usage

To use this plugin, include it in your PostCSS configuration file and provide your Tailwind theme configuration.


### Example Configuration

1. PostCSS Configuration (`postcss.config.js`):

```js
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindConfig from './tailwind.config.js';

export default {
    plugins: [
        postcssTailwindShortcuts(tailwindConfig.theme)
    ]
};
```

2. Tailwind Configuration (`tailwind.config.js`):

```js
export default {
    theme: {
        extend: {
            transitionDuration: {
                // Define your custom values here
                fast:       '0.2s',
                default:    '0.4s',
                slow:       '0.6s',
                slower:     '0.8s',
                slowest:    '1s',
            },
            transitionTimingFunction: {
                // Define your custom values here
                default: 'cubic-bezier(0.380, 0.005, 0.215, 1)',
                inOut: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
            },
            zIndex: {
                // Define your custom values here
            },
            colors: {
                // Define your custom values here
            },
            spacing: {
                // Define your custom values here
            }
        }
    }
};
```

## Options

| Option | Type   | Description                                      |
|--------|--------|--------------------------------------------------|
| `prefix` | `string` | A string appended before the shortcut function   |

### Prefix

> [!TIP]
> Sometimes, SASS uses reserved expressions, meaning we can't create a shortcut with the same name. This happened recently with the `color` module, which prevents the use of a `color()` shortcut. In such cases, it's better to prefix all shortcuts with a string of your choice.

The prefix will be appended before a hyphen (`-`).

```js
import postcssTailwindShortcuts from '@locomotivemtl/postcss-tailwind-shortcuts';
import tailwindConfig from './tailwind.config.js';

export default {
    plugins: [
        postcssTailwindShortcuts(tailwindConfig.theme, {
            prefix: 't'
        })
    ]
};
```

This will create for example `t-color()`.

## Shortcut Functions

This plugin supports the following shortcut functions, which can be used in your CSS declarations to reference Tailwind configuration values:

- `speed(value)`: Maps to `transitionDuration`
- `ease(value)`: Maps to `transitionTimingFunction`
- `z(value)`: Maps to `zIndex`
- `color(value)`: Maps to `colors`
- `spacing(value)`: Maps to `spacing`

### Example Usage

```css
/* Input CSS */
.example {
    transition-duration: speed();
    transition-timing-function: ease('inOut');
    z-index: z('modal');
    color: color('accent');
    margin: spacing('4');
}

/* Output CSS */
.example {
    transition-duration: 200ms; /* Assuming 'fast' is 200ms in Tailwind config */
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* Assuming 'inOut' is a cubic-bezier value in Tailwind config */
    z-index: 100; /* Assuming 'modal' is defined in Tailwind config */
    color: #3b82f6; /* Assuming 'accent' is #3b82f6 in Tailwind config */
    margin: 1rem; /* Assuming '4' is 1rem in Tailwind config */
}
```

### Default Key Behavior

The `"default"` key serves as a fallback mechanism. If a user of your PostCSS plugin does not specify a value when using a shortcut function, the plugin will use "default" to look up a predefined default value in the Tailwind CSS configuration.

Styles input :

```css
.example {
    transition-duration: speed(); /* No value provided */
}
```
Tailwind configuration :

```js
export default {
    theme: {
        extend: {
            transitionDuration: {
                'fast': '200ms',
                'default': '300ms' // 
            }
        }
    }
};
```

Results :

```css
.example {
    transition-duration: 300ms;
}
```

## @todo
- [] Add Javascript support
