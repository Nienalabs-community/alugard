# Alugard-Drop Documentation

Welcome to the documentation for **Alugard-Drop**, a modern, lightweight, and performant drag-and-drop library replacing legacy solutions like Dragula.

## Getting Started

Alugard-Drop is designed to be extremely simple to use. To get started, you only need an HTML structure and a small amount of JavaScript to initialize the drag-and-drop behavior.

### Basic Setup Example

If you are using Vite (like in this repository's `index.html`), your entry point is `src/main.ts`.

#### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alugard Drop Basic Example</title>
  </head>
  <body>
    <!-- The containers we want to make drag-and-droppable -->
    <div id="app">
      <div id="left" class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
      <div id="right" class="container">
        <div class="item">Item 4</div>
        <div class="item">Item 5</div>
        <div class="item">Item 6</div>
      </div>
    </div>
    
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### `src/main.ts`
```typescript
import alugard from 'alugard-drop';
import 'alugard-drop/style.css'; // Make sure to import the CSS for mirror and transit styles!

// Select your containers
const leftContainer = document.getElementById('left')!;
const rightContainer = document.getElementById('right')!;

// Initialize Alugard Drop
const drake = alugard([leftContainer, rightContainer]);

// Optional: listen to events
drake.on('drop', (el, target, source, sibling) => {
  console.log(`Dropped item into ${target.id} from ${source.id}`);
});
```

#### `src/style.css`
```css
/* Basic styling for the example */
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #f4f4f5;
  border-radius: 8px;
  min-height: 200px;
  width: 250px;
  float: left; /* Just to sit them side by side */
  margin-right: 20px;
}

.item {
  padding: 15px;
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.item:active {
  cursor: grabbing;
}
```

## Available Guides

Explore the following guides for specific use cases and advanced layouts:

*   [Column Layouts (Kanban Boards)](./column-layout.md)
*   [Grid Layouts (Photo Galleries, Dashboards)](./grid-layout.md)
*   [Dragging Different Component Types](./components.md) 
