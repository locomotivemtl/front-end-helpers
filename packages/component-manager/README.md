# @locomotivemtl/component-manager

A powerful, lightweight Web Component management system based on nanostores with automatic lifecycle tracking, global access bridge, and performance optimizations.

## ✨ Features

- 🔄 **Automatic Lifecycle Management** - Components are tracked when connected/disconnected from DOM
- 🆔 **Unique ID Generation** - Auto-generated IDs prevent conflicts 
- 🎯 **Type-Safe Queries** - Full TypeScript support with flexible generics
- 🚀 **Performance Optimized** - Smart caching for frequently called queries
- 🌐 **Global Bridge** - Access components from external libraries without dependencies
- 🔧 **Debug Mode** - Optional logging for development and troubleshooting
- 📦 **Zero Dependencies** - Only requires nanostores for internal state management

## 📦 Installation

```bash
npm install @locomotivemtl/component-manager nanostores
```

## 🚀 Quick Start

### 1. Create Enhanced Web Components

```typescript
import { ComponentElement } from '@locomotivemtl/component-manager';

// Extend any HTML element
class Accordion extends HTMLDetailsElement {
    constructor() {
        super();
    }
    
    toggle() {
        this.toggleAttribute('open');
    }
}

// Register with ComponentElement for automatic management
customElements.define('c-accordion', ComponentElement(Accordion, 'Accordion'), {
    extends: 'details'
});
```

```html
<details is="c-accordion">
    <summary>Click me</summary>
    <p>This is an accordion content!</p>
</details>
```

> **⚠️ Safari Compatibility Note**  
> The `is` attribute for extending built-in elements is **not supported in Safari**. For better cross-browser compatibility, consider using autonomous custom elements instead:
> ```html
> <c-accordion>
>     <summary>Click me</summary>
>     <p>This is an accordion content!</p>
> </c-accordion>
> ```

### 2. Access Components Programmatically

```typescript
import { getComponentById, getComponentsByPrototype, findComponents } from '@locomotivemtl/component-manager';

// Get specific component by ID with full type safety
const $accordion = getComponentById<Accordion>('accordion-1');
$accordion?.toggle(); // TypeScript knows about toggle() method

// Get all components of a type with type safety
const $allAccordions = getComponentsByPrototype<Accordion>('Accordion');
$allAccordions.forEach($accordion => $accordion.toggle()); // TypeScript knows about Accordion methods

// Advanced queries with generic support
const $openDialogs = findComponents<Dialog>($component => 
    $component.prototypeType === 'Dialog' && $component.hasAttribute('open')
);
```

## 🔧 Component Creation

### Basic Components

```typescript
import { ComponentElement } from '@locomotivemtl/component-manager';

class Dialog extends HTMLElement {
    constructor() {
        super();
    }
    
    open() {
        this.showModal();
    }
    
    close() {
        this.close();
    }
}

customElements.define('c-dialog', ComponentElement(Dialog, 'Dialog'));
```

### Extended Built-in Elements

You can extend any built-in HTML element to gain specific behaviors while adding component management:

```typescript
class CustomButton extends HTMLButtonElement {
    constructor() {
        super();
    }
    
    activate() {
        this.classList.add('active');
    }
}

customElements.define('c-button', ComponentElement(CustomButton, 'Button'), {
    extends: 'button'
});
```

```html
<button is="c-button">Enhanced Button</button>
```

## 📋 API Reference

### Component Management

#### `ComponentElement(BaseClass, className)`
Enhances any custom element class with automatic management features.

**Parameters:**
- `BaseClass` - The base custom element class to extend
- `className` - String identifier for the component type

**Returns:** Enhanced class with lifecycle management

**⚠️ Important:** The `className` parameter is required as a string to prevent issues with JavaScript minifiers (Vite, Webpack, etc.) that rename class names during production builds. By providing an explicit string, your component types remain consistent across development and production environments.

```typescript
// ✅ Correct - className as string prevents minification issues
customElements.define('c-accordion', ComponentElement(Accordion, 'Accordion'));

// ❌ Don't rely on class.name - gets minified in production
// ComponentElement(Accordion, Accordion.name) // Could become 'a' in production
```


#### `getComponentById<T>(id: string): ComponentOfType<T> | undefined`
Retrieves a component by its unique ID with optional type casting.

**Generic Usage:**
```typescript
// Get component with full type safety
const $dialog = getComponentById<Dialog>('my-dialog');
if ($dialog) {
    $dialog.open();
}
```

#### `getComponentsByPrototype<T>(prototype: string, selectorsToExclude?: string[] | string | HTMLElement | ManagedComponent): ComponentOfType<T>[]`
Gets all components of a specific prototype with optional exclusion filters and full type safety.

**Generic Usage:**
```typescript
// Get all components with type safety
const $allDialogs = getComponentsByPrototype<Dialog>('Dialog');
$allDialogs.forEach($dialog => {
    $dialog.open();
});

// With exclusions
const $otherDialogs = getComponentsByPrototype<Dialog>('Dialog', '#current-dialog');
```

#### `findComponents<T>(predicate: (component: ManagedComponent) => boolean): ComponentOfType<T>[]`
Query components using a custom predicate function with optional type casting.

**Generic Usage:**
```typescript
// Find components with specific attributes and type safety
const $activeComponents = findComponents<MyComponent>($component => 
    $component.hasAttribute('active')
);

// Find components by custom criteria with full typing
const $openDialogs = findComponents<Dialog>($component => 
    $component.prototypeType === 'Dialog' && $component.hasAttribute('open')
);

$openDialogs.forEach($dialog => {
    $dialog.close();
});
```

### Utility Functions

#### `getRegisteredPrototypes(): string[]`
Returns array of all registered component prototype names.

#### `getComponentStats(): Record<string, number>`
Returns object with component counts by prototype.

#### `getComponentCount(): number`
Returns total number of managed components.

### Debug Control

Debug logging is controlled via a global window flag. Set `window.COMPONENT_MANAGER_DEBUG = true` before or after component initialization to see lifecycle events in the console.

## 🌐 Global Bridge

Access components from external libraries or inline HTML without importing the component manager:

```html
<button onclick="window.ComponentManager.getById('modal-1')?.open()">
    Open Modal
</button>

<div onclick="window.ComponentManager.getByPrototype('Dialog').forEach($component => $component.close())">
    Close All Dialogs  
</div>
```

### Global Bridge API

```typescript
window.ComponentManager = {
    components: ManagedComponent[]; // All managed components
    getById: (id: string) => ManagedComponent | undefined;
    getByPrototype: (prototype: string) => ManagedComponent[];
    find: (predicate: Function) => ManagedComponent[];
    getRegisteredPrototypes: () => string[];
    getComponentCount: () => number;
}
```

## 🎯 Advanced Usage

### Type-Safe Component Access

The component manager now provides full TypeScript support with automatic type inference:

```typescript
class MyDialog extends HTMLElement {
    public isOpen = false;
    
    open() {
        this.isOpen = true;
        this.showModal();
    }
    
    close() {
        this.isOpen = false;
        this.close();
    }
}

customElements.define('c-dialog', ComponentElement(MyDialog, 'Dialog'));

// ✅ Full type safety - no need for separate interfaces!
const $dialog = getComponentById<MyDialog>('dialog-1');
if ($dialog) {
    $dialog.open(); // ✅ TypeScript knows about open() method
}

// ✅ Works with arrays too
const $allDialogs = getComponentsByPrototype<MyDialog>('Dialog');
$allDialogs.forEach($dialog => {
    $dialog.open(); // ✅ Full type safety for each element
});
```

### Excluding Components from Queries

```typescript
// Exclude by selector
const $otherAccordions = getComponentsByPrototype<Accordion>('Accordion', '#current-accordion');

// Exclude by element reference  
const $otherAccordions = getComponentsByPrototype<Accordion>('Accordion', this);

// Exclude multiple selectors
const $filtered = getComponentsByPrototype<Dialog>('Dialog', ['.ignore', '#skip-me']);
```

### Performance Optimization

The component manager includes automatic caching for `getComponentsByPrototype()` calls:

- ✅ **Automatic cache invalidation** when components are added/removed
- ✅ **Smart caching strategy** only caches queries without exclusions  
- ✅ **Zero configuration** works transparently

## 🔍 Debug Mode

Enable debug logging to track component lifecycle by setting a global flag:

### **Enable Debug from Start**
```html
<!-- In your HTML head, before importing component-manager -->
<script>
  window.COMPONENT_MANAGER_DEBUG = true;
</script>

<!-- Then import your components -->
<script type="module">
  import '@locomotivemtl/component-manager';
  // Components will log from the very beginning!
</script>
```

### **Toggle Debug at Runtime**
```javascript
// In browser console - enable debugging
window.COMPONENT_MANAGER_DEBUG = true;

// Disable debugging
window.COMPONENT_MANAGER_DEBUG = false;
```

### **Debug Output**
When enabled, you'll see component lifecycle events in the console:

```console
🔧 ComponentManager: "accordion-1" (Accordion) registered
✅ ComponentManager: "accordion-1" connected to DOM
❌ ComponentManager: "accordion-1" disconnected from DOM
```

**Note:** Debug state is checked in real-time, so you can toggle it on/off anytime and it will affect subsequent component lifecycle events.

## 🛠 Best Practices

### Component Lifecycle

Always call parent lifecycle methods in your components:

```typescript
class MyComponent extends HTMLElement {
    connectedCallback() {
        // Component manager handles registration automatically
        // Add your component-specific logic here
        this.setupEventListeners();
    }
    
    disconnectedCallback() {
        // Component manager handles cleanup automatically
        // Add your component-specific cleanup here  
        this.removeEventListeners();
    }
}
```

### ID Management

- Components get auto-generated IDs: `componentname-1`, `componentname-2`, etc.
- You can set custom IDs in HTML: `<c-dialog id="main-modal">`
- Use descriptive IDs for components you'll access frequently

### Global Bridge Usage

- Perfect for inline HTML event handlers
- Ideal for integrating with external libraries
- Use for browser console debugging and testing

### TypeScript Best Practices

- Always use generic types when calling component manager functions for better type safety
- No need to create separate interfaces. Use your component classes directly as generic types
- The `ComponentOfType<T>` type automatically provides both your component properties and manager properties

```typescript
// ✅ Recommended - Direct class usage
const $search = getComponentById<Search>('search-1');

// ❌ Not needed - No need for separate interfaces
interface SearchComponent extends ManagedComponent {
    // ...
}
const $search = getComponentById<SearchComponent>('search-1');
```

---

Built with ❤️ by [Locomotive](https://locomotive.ca/)