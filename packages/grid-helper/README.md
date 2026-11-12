# GridHelper

The `GridHelper` class is a utility that creates an overlay grid for web development, allowing designers and developers to visualize the grid structure based on design guidelines. It provides easy toggling and responsiveness based on screen breakpoints.

## Features

- Toggle the grid visibility with `Control + g` (customizable key).
- Define grid structure: number of columns, gutter width, margin, color, and opacity.
- Supports custom breakpoints, allowing different grid configurations at various screen widths.
- Automatically updates the grid when the window is resized.
- Mount the grid overlay inside a specific element instead of `document.body`.
- Remembers whether the grid is visible across page reloads, for the current tab.
- Gutter and margin accept any CSS length, including `vw`, `vmin` and `vmax`.

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

A breakpoint key is the minimum viewport width in pixels. A breakpoint overrides the main options; it does not inherit from narrower breakpoints.

### Viewport Units

`gutterWidth` and `marginWidth` are passed to CSS as they are, so they accept any CSS length or expression, including `vw`, `vmin`, `vmax`, `calc()` and `clamp()`:

```js
const gridHelper = new GridHelper({
    gutterWidth: '2vmin',
    marginWidth: 'clamp(16px, 4vmax, 64px)'
});
```

### Custom Container

By default, the grid overlays the full page (`document.body`, `position: fixed`). Pass a `container` element to mount it inside a specific element instead (`position: absolute`):

```js
const gridHelper = new GridHelper({
    container: document.querySelector('.my-wrapper'),
    columns: 12,
});
```

> **Note:** The container element must have a non-static CSS position (e.g. `position: relative`) for the overlay to be positioned correctly.

### CSS Variables

You can also use CSS variables to bind them with your CSS logic, especially for `columns`, `gutterWidth`, and `marginWidth`. This can be useful in cases where you dynamically update CSS variables within media queries.

```js
const gridHelper = new GridHelper({
    columns: 'var(--grid-columns)',
    gutterWidth: `var(--grid-gutter)`,
    marginWidth: `var(--grid-margin)`,
});
```

The `columns` variable is read from the grid element, so it can be set on `:root` or on the container. It must hold a plain number. If it cannot be read, the grid falls back to 12 columns.

### Visible State

The grid remembers whether it is visible in `sessionStorage`, so it stays on when the page reloads and resets when the tab closes. The state is stored per toggle key.

### Cleanup

Call `destroy()` to remove the overlay and its event listeners, for example before a page transition replaces the container:

```js
gridHelper.destroy();
```

## Options

### Main Options

| Option        | Default Value | Type                | Description                                                                 |
|---------------|---------------|---------------------|-----------------------------------------------------------------------------|
| `columns`     | `12`          | `number \| CSSVariable` | Number of columns in the grid or a CSS variable for columns.            |
| `gutterWidth` | `'16px'`      | `string`            | Width of the gutters between columns. Any CSS length, variable or expression. |
| `marginWidth` | `'16px'`      | `string`            | Width of the margins around the grid. Any CSS length, variable or expression. |
| `color`       | `'red'`       | `string`            | Color of the grid in CSS format.                                            |
| `opacity`     | `0.1`         | `number`            | Opacity of the grid.                                                        |
| `key`         | `'g'`         | `string`            | Key to toggle the grid visibility (with Control key).                       |
| `breakpoints` | `undefined`   | `object`            | Breakpoint configurations for responsive grids.                             |
| `container`   | `document.body` | `HTMLElement`     | Element to mount the grid into. Uses `position: absolute` when set.         |

### Breakpoint Options

| Option        | Type                     | Description                                                   |
|---------------|--------------------------|---------------------------------------------------------------|
| `columns`     | `number \| CSSVariable`  | Number of columns in the grid or a CSS variable for columns.  |
| `gutterWidth` | `string`                 | Width of the gutters between columns. Any CSS length, variable or expression. |
| `marginWidth` | `string`                 | Width of the margins around the grid. Any CSS length, variable or expression. |
| `color`       | `string`                 | Color of the grid in CSS format.                               |
| `opacity`     | `number`                 | Opacity of the grid.                                           |

## Methods

| Method      | Description                                      |
|-------------|--------------------------------------------------|
| `destroy()` | Removes the grid overlay and its event listeners. |
