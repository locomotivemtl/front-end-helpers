# @locomotivemtl/intersection-observer-manager

A lightweight, static TypeScript class to manage viewport intersection detection across your entire application with a single, efficient API.

## Features

- Single intersection observer instance per unique `rootMargin` configuration
- Automatic class toggling when elements enter/exit viewport
- Support for custom CSS classes per element
- Optional toggle mode for repeated animations
- Dynamic element observation (add/remove elements on the fly)
- Configurable root margins per element via data attributes
- JavaScript callback support for custom intersection logic
- Automatic cleanup on page transitions
- Zero dependencies

## Basic Usage

### Initialize on page load

```typescript
import { IntersectionObserverManager } from '@locomotivemtl/intersection-observer-manager';

// Initialize with default rootMargin
IntersectionObserverManager.init('0px 0px 0px 0px');
```

### Add data attributes to HTML elements

```html
<!-- Basic usage: adds 'is-inview' class once -->
<div data-inview>This element will get the 'is-inview' class when visible</div>

<!-- Custom class name -->
<div data-inview data-inview-class="fade-in">Uses custom 'fade-in' class instead</div>

<!-- Toggle mode: class is added/removed on enter/exit -->
<div data-inview data-inview-toggle>Class toggles on scroll in/out of viewport</div>

<!-- Custom root margin -->
<div data-inview data-inview-root-margin="0px 0px -50% 0px">Triggers earlier (50% from bottom)</div>

<!-- All options combined -->
<div
    data-inview
    data-inview-class="slide-up"
    data-inview-toggle
    data-inview-root-margin="0px 0px -20% 0px"
>
    Full configuration
</div>
```

### Cleanup on page transitions

```typescript
// When leaving the page or component
IntersectionObserverManager.destroy();
```

## API Reference

### Methods

#### `init(defaultRootMargin?: string): void`

Initialize the observer and start observing all elements with `data-inview`.

```typescript
// Default: triggers when element is 10% from bottom of viewport
IntersectionObserverManager.init('0px 0px -10% 0px');

// Trigger immediately when element enters viewport
IntersectionObserverManager.init('0px');

// Trigger 100px before element enters viewport
IntersectionObserverManager.init('0px 0px 100px 0px');
```

#### `destroy(): void`

Disconnect all observers and clear all tracked elements.

```typescript
IntersectionObserverManager.destroy();
```

#### `observe(element: Element, callback?: IntersectionCallback, options?: Partial<ObserveOptions>): void`

Add a single element to be observed. Useful for dynamically added elements.

**With data attributes only:**

```typescript
const newElement = document.createElement('div');
newElement.setAttribute('data-inview', '');
newElement.setAttribute('data-inview-class', 'animate');
document.body.appendChild(newElement);

IntersectionObserverManager.observe(newElement);
```

**With JavaScript callback:**

```typescript
const video = document.querySelector('video');

IntersectionObserverManager.observe(
    video,
    (entry, isIntersecting) => {
        if (isIntersecting) {
            video.play();
        } else {
            video.pause();
        }
    },
    {
        rootMargin: '0px',
        shouldToggle: true,
        className: 'is-playing'
    }
);
```

**Callback signature:**

```typescript
type IntersectionCallback = (entry: IntersectionObserverEntry, isIntersecting: boolean) => void;
```

**Dispatched events:**

| Event                                   | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| `intersectionObserverManager:ready`     | Dispatched when the intersection observer is ready     |
| `intersectionObserverManager:destroyed` | Dispatched when the intersection observer is destroyed |


**Options:**

```typescript
interface ObserveOptions {
    className: string; // CSS class to toggle
    shouldToggle: boolean; // Whether to remove class on exit
    rootMargin: string; // Custom root margin
}
```

#### `unobserve(element: Element): void`

Remove a single element from observation.

```typescript
const element = document.querySelector('.my-element');
IntersectionObserverManager.unobserve(element);
```

#### `refresh(): void`

Re-scan the DOM for new elements and remove observers for deleted elements.

```typescript
// After dynamic content updates
IntersectionObserverManager.refresh();
```

#### `getStats(): ObserverStats`

Get debugging information about active observers.

```typescript
const stats = IntersectionObserverManager.getStats();
console.log(stats);
// {
//   observerCount: 3,
//   elementCount: 42,
//   rootMargins: ['0px 0px -10% 0px', '0px 0px -50% 0px', '0px']
// }
```

## Data Attributes

| Attribute                 | Required | Description                              | Example                                      |
| ------------------------- | -------- | ---------------------------------------- | -------------------------------------------- |
| `data-inview`             | Yes      | Marks element for observation            | `data-inview`                                |
| `data-inview-class`       | No       | Custom class name (default: `is-inview`) | `data-inview-class="fade-in"`                |
| `data-inview-toggle`      | No       | Enable class toggle on scroll in/out     | `data-inview-toggle`                         |
| `data-inview-root-margin` | No       | Custom root margin for this element      | `data-inview-root-margin="0px 0px -20% 0px"` |

## Root Margin Explained

The `rootMargin` works like CSS margin and defines when the intersection triggers:

```
Format: "top right bottom left"
```

**Examples:**

```typescript
// Trigger when element is 10% visible from bottom
'0px 0px -10% 0px';

// Trigger 100px before element enters viewport
'0px 0px 100px 0px';

// Trigger when element is fully in viewport
'0px';

// Trigger 50% before from top, 20% before from bottom
'-50% 0px -20% 0px';
```

**Negative values** = element must be further into viewport  
**Positive values** = triggers before element enters viewport

## Common Patterns

### Different trigger points

```html
<!-- Trigger early for hero sections -->
<section data-inview data-inview-root-margin="0px 0px 100px 0px">Hero content</section>

<!-- Standard trigger for content -->
<article data-inview>Article content</article>

<!-- Late trigger for footer -->
<footer data-inview data-inview-root-margin="0px 0px -50% 0px">Footer content</footer>
```

## Integration Examples

### With SPA Router

```typescript
// router.ts
import { IntersectionObserverManager } from '@locomotivemtl/intersection-observer-manager';

router.beforeEach(() => {
    IntersectionObserverManager.destroy();
});

router.afterEach(() => {
    IntersectionObserverManager.init('0px 0px 0px 0px');
});
```

### With Web Components

```typescript
export class MyComponent extends HTMLElement {
    connectedCallback() {
        // Observe dynamically added elements
        const elements = this.querySelectorAll('[data-inview]');
        elements.forEach((el) => {
            IntersectionObserverManager.observe(el);
        });
    }

    disconnectedCallback() {
        // Clean up observations
        const elements = this.querySelectorAll('[data-inview]');
        elements.forEach((el) => {
            IntersectionObserverManager.unobserve(el);
        });
    }
}
```

## Performance

- Creates only **one observer per unique rootMargin**
- If you have 100 elements with 3 different rootMargins → only **3 observers** are created
- Elements without toggle are automatically unobserved after first intersection
- Automatic cleanup prevents memory leaks
