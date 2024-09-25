# GridHelper

The `GridHelper` class is a utility that creates an overlay grid for web development, allowing designers and developers to visualize the grid structure based on design guidelines. It provides easy toggling and responsiveness based on screen breakpoints.

## Features

- Toggle the grid visibility with `Control + g` (customizable key).
- Define grid structure: number of columns, gutter width, margin, color, and opacity.
- Supports custom breakpoints, allowing different grid configurations at various screen widths.
- Automatically updates the grid when the window is resized.

## Installation

```shell
npm install @locomotivemtl/grid-helper
```

## Usage

### Basic Example

To initialize the grid with default settings:

```js
const gridHelper = new GridHelper();
```

### Custom Configuration

You can provide a custom configuration to adjust the grid properties:

```js
const gridHelper = new GridHelper({
    columns: 4,
    gutterWidth: '10px',
    marginWidth: '10px',
    color: 'blue',
    opacity: 0.2,
    key: 'g',
    breakpoints: {
        '768': { columns: 8, gutterWidth: '15px' },
        '1024': { columns: 12, gutterWidth: '20px' }
    }
});
```

You can also use CSS variables to bind them with your CSS logic, especially for `columns`, `gutterWidth`, and `marginWidth`. This can be useful in cases where you dynamically update CSS variables within media queries.

```js
const gridHelper = new GridHelper({
    columns: 'var(--grid-columns)',
    gutterWidth: `var(--grid-gutter)`,
    marginWidth: `var(--grid-margin)`,
});
```

## Options

### Main Options

| Option        | Default Value | Type                | Description                                                                 |
|---------------|---------------|---------------------|-----------------------------------------------------------------------------|
| `columns`     | `12`          | `number \| string`  | Number of columns in the grid or a CSS variable for columns.                |
| `gutterWidth` | `'16px'`      | `string \| CSSVariable` | Width of the gutters between columns or a CSS variable for gutter width.    |
| `marginWidth` | `'16px'`      | `string \| CSSVariable` | Width of the margins around the grid or a CSS variable for margin width.    |
| `color`       | `'red'`       | `string`            | Color of the grid in CSS format.                                            |
| `opacity`     | `0.1`         | `number`            | Opacity of the grid.                                                        |
| `key`         | `'g'`         | `string`            | Key to toggle the grid visibility (with Control key).                       |
| `breakpoints` | `undefined`   | `object`            | Breakpoint configurations for responsive grids.                             |

### Breakpoint Options

| Option        | Type                     | Description                                                   |
|---------------|--------------------------|---------------------------------------------------------------|
| `columns`     | `number \| string`       | Number of columns in the grid or a CSS variable for columns.  |
| `gutterWidth` | `string \| CSSVariable`  | Width of the gutters between columns or a CSS variable for gutter width. |
| `marginWidth` | `string \| CSSVariable`  | Width of the margins around the grid or a CSS variable for margin width. |
| `color`       | `string`                 | Color of the grid in CSS format.                               |
| `opacity`     | `number`                 | Opacity of the grid.                                           |
| `key`         | `string`                 | Key to toggle the grid visibility (with Control key).          |
