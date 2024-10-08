# PostCSS Remove Double Parentheses

This PostCSS plugin removes double parentheses around media queries, for example, `@media ((min-width: 700px)) {}`. Without this, older Safari browsers (before version 16.5) may not interpret the media queries at all.

## Installation

```shell
npm install @locomotivemtl/postcss-remove-double-parentheses --save-dev
```

## Usage

### Basic Example

Import the plugin in your PostCSS configuration

```js
const removeDoubleParentheses = require('@locomotivemtl/postcss-remove-double-parentheses');

module.exports = {
    plugins: [
        removeDoubleParentheses(),
        // other plugins
    ]
};
```

### Basic Example (ESM)

```js
import removeDoubleParentheses from '@locomotivemtl/postcss-remove-double-parentheses';

export default {
    plugins: [
        removeDoubleParentheses(),
        // other plugins
    ]
};
```
