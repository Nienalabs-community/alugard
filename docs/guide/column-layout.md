# Column Layouts (Kanban Boards)

A very common use case for drag-and-drop is a Kanban board (e.g., Trello or Jira). You have multiple columns, and items can be sorted within a column or moved between different columns.

Alugard-Drop makes this incredibly easy.

## How it looks in `index.html`

Replace the content of your `index.html` `<body>` with this example structure to see it in action.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kanban Board Example</title>
  </head>
  <body>
    <div id="app">
      <h2>Project Board</h2>
      
      <div class="board">
        <!-- Column 1: To Do -->
        <div class="column">
          <h3>To Do</h3>
          <div id="todo" class="task-list">
            <div class="task">Research competitors</div>
            <div class="task">Design database schema</div>
            <div class="task">Create wireframes</div>
          </div>
        </div>

        <!-- Column 2: In Progress -->
        <div class="column">
          <h3>In Progress</h3>
          <div id="in-progress" class="task-list">
            <div class="task">Setup Vite project</div>
            <div class="task">Configure Tailwind CSS</div>
          </div>
        </div>

        <!-- Column 3: Done -->
        <div class="column">
          <h3>Done</h3>
          <div id="done" class="task-list">
            <div class="task">Initial meeting</div>
            <div class="task">Requirements gathering</div>
          </div>
        </div>
      </div>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## `src/main.ts`

To make the Kanban board work, grab the `.task-list` containers and pass them to Alugard.

```typescript
import alugard from 'alugard-drop';
import 'alugard-drop/style.css'; 

// Select all task lists in our columns
const todo = document.getElementById('todo')!;
const inProgress = document.getElementById('in-progress')!;
const done = document.getElementById('done')!;

// Initialize Alugard
const drake = alugard([todo, inProgress, done], {
  // Optional configuration
  revertOnSpill: true, // If dropped outside a valid container, return to original location
});

drake.on('drop', (el, target, source) => {
  // Example of using events to track state changes
  if (target !== source) {
    console.log(`Task moved from ${source.id} to ${target.id}`);
  }
});
```

## `src/style.css`

Styles to make our Kanban board look like a real board. We'll use CSS Flexbox.

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  color: #0f172a;
  margin: 0;
  padding: 20px;
}

/* Board Layout */
.board {
  display: flex;
  gap: 20px;
  align-items: flex-start; /* Prevents columns from completely stretching */
  overflow-x: auto;
  padding-bottom: 20px;
}

/* Individual Column Wrapper */
.column {
  background: #e2e8f0;
  border-radius: 8px;
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.column h3 {
  margin: 0;
  padding: 15px;
  font-size: 16px;
  color: #334155;
}

/* The drop target zone */
.task-list {
  padding: 0 10px 10px 10px;
  min-height: 100px; /* Crucial: Ensure empty columns have a drop target area */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* The draggable tasks */
.task {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: grab;
  user-select: none; /* Prevents text selection while dragging */
}

.task:active {
  cursor: grabbing;
}

/* Styling the element while it is being dragged (Transit element) */
.ad-transit {
  opacity: 0.2;
  border: 2px dashed #94a3b8;
  background: #f1f5f9;
}
```
