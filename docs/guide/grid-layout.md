# Grid Layouts (Photo Galleries, Dashboards)

Drag-and-drop behaves identically for the JavaScript API when dealing with Grids, but the physics and placement logic inside Alugard detects elements flowing horizontally and wrapping to the next line. 

This makes it perfect for photo galleries or dashboard widget positioning.

## `index.html` structure

A simple grid of images using a single container.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grid Layout Example</title>
  </head>
  <body>
    <div id="app">
      <h2>Photo Gallery (Drag to rearrange)</h2>
      
      <!-- Single container spanning the screen width -->
      <div id="gallery" class="grid-container">
        <div class="grid-item"><img src="https://picsum.photos/id/1018/200/200" alt="Landscape 1"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1015/200/200" alt="Landscape 2"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1019/200/200" alt="Landscape 3"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1016/200/200" alt="Landscape 4"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1020/200/200" alt="Landscape 5"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1021/200/200" alt="Landscape 6"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1022/200/200" alt="Landscape 7"></div>
        <div class="grid-item"><img src="https://picsum.photos/id/1026/200/200" alt="Landscape 8"></div>
      </div>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## `src/main.ts`

Alugard works out of the box with grids. 
**Note:** `direction: 'horizontal'` shouldn't be needed for standard floating grids because Alugard dynamically determines insertion points based on coordinates, but you can explicitly specify it if you are strictly making a single horizontal row.

```typescript
import alugard from 'alugard-drop';
import 'alugard-drop/style.css';

const gallery = document.getElementById('gallery')!;

// Initialize Alugard
const drake = alugard([gallery], {
  revertOnSpill: true
});

drake.on('drop', (el) => {
  console.log('Grid reordered! New order saved.');
});
```

## `src/style.css`

Using CSS Grid or Flexbox with wrap creates the grid structure.

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 20px;
  background: #fafafa;
}

/* CSS Grid layout for our gallery */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;
  min-height: 250px;
}

/* Draggable items */
.grid-item {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  cursor: grab;
  aspect-ratio: 1 / 1; /* Keep them perfectly square */
}

.grid-item:active {
  cursor: grabbing;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none; /* Prevents browsers from triggering default image drag */
}

/* Styling the dragged item placeholder (Transit element) */
.ad-transit {
  opacity: 0.3;
  transform: scale(0.95);
  transition: transform 0.2s;
  box-shadow: none;
}
```

### Tips for Grids
1. **Always use `pointer-events: none` on nested images.** Browsers have native image drag behaviors that can conflict with your drag-and-drop library.
2. If you are using `display: flex`, ensure you use `flex-wrap: wrap`.
