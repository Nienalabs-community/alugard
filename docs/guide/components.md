# Dragging Different Types of Components

Sometimes, you don't want to drag simple text blocks or images. You might have complex UI components where only a specific part (a "handle") should initiate the drag, or you might want to prevent dragging from certain interactive areas (like inputs or buttons).

Alugard-Drop provides powerful options to control **what** can drag **whom**.

## Using Drag Handles

A common UI pattern is having a specific icon (like `☰` or "Drag Me") that the user must grab to move the whole card.

### `index.html` structure

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag Handles Example</title>
  </head>
  <body>
    <div id="app">
      <h2>Sortable List with Handles</h2>
      
      <div id="list" class="sortable-list">
        
        <div class="list-item">
          <!-- This is the ONLY part you can drag from -->
          <span class="handle">☰</span>
          <div class="content">
            <h4>User Management</h4>
            <p>You can click this text to edit, and it won't drag the card.</p>
          </div>
        </div>

        <div class="list-item">
          <span class="handle">☰</span>
          <div class="content">
            <h4>Billing Settings</h4>
            <p>Only dragging the handle icon moves this row.</p>
          </div>
        </div>

        <div class="list-item">
          <span class="handle">☰</span>
          <div class="content">
            <h4>Notification Preferences</h4>
            <button>Save settings</button>
          </div>
        </div>

      </div>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### `src/main.ts`

To use handles, you use the `moves` configuration function. Alugard gives you the element under the cursor (`handle`) and the element being asked to move (`item`).

```typescript
import alugard from 'alugard-drop';
import 'alugard-drop/style.css';

const list = document.getElementById('list')!;

// Initialize Alugard with handle logic
const drake = alugard([list], {
  // `item` is the .list-item. `handle` is what the user actually clicked.
  moves: (item, container, handle) => {
    // Only allow drag if the user clicked on something that contains the 'handle' class
    // Or if the handle itself has the class.
    return handle.classList.contains('handle') || handle.closest('.handle') !== null;
  }
});

drake.on('drop', (el) => {
  console.log('List reordered!');
});
```

### `src/style.css`

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 40px;
  background: #fdfdfd;
}

.sortable-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
}

.list-item {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s;
}

.list-item:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

/* The Handle */
.handle {
  cursor: grab;
  padding: 10px;
  margin-right: 15px;
  font-size: 20px;
  color: #9ca3af;
  user-select: none;
}

.handle:hover {
  color: #4b5563;
}

.handle:active {
  cursor: grabbing;
}

.content {
  flex-grow: 1;
}

.content h4 {
  margin: 0 0 5px 0;
  color: #111827;
}

.content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

button {
  margin-top: 10px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #2563eb;
}

/* Transit styling */
.ad-transit {
  opacity: 0.2;
  border-style: dashed;
}
```

## Preventing Drag on Interactive Components

If your draggable component has inputs, buttons, or links, you don't want the user to accidentally start dragging the card when they are simply trying to click a button or select text.

Alugard-Drop intelligently ignores inputs and text selection by default. However, if you have other interactive elements (like SVG icons, links, or custom dropdowns), you can use the `invalid` function to prevent dragging.

```typescript
const drake = alugard([container], {
  invalid: (item, handle) => {
    // Prevent dragging if clicking on an <a> tag, a <button>, or an SVG
    return (
      handle.tagName === 'A' || 
      handle.tagName === 'BUTTON' || 
      handle.closest('button') !== null || // For icons inside buttons
      handle.closest('a') !== null
    );
  }
});
```
