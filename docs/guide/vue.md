# Vue.js

Alugard-Drop is easily integrated into Vue 3 (Composition API) or Vue 2 applications. You will use `ref`s to gain access to the DOM elements and initialize the library within the `onMounted` lifecycle hook.

## Example (Vue 3 Composition API)

```vue
<template>
  <div class="dnd-container">
    <div id="left-list" ref="leftContainer" class="list-container">
      <h3>List A</h3>
      <div v-for="(item, index) in leftItems" :key="index" class="draggable-item">
        {{ item }}
      </div>
    </div>

    <div id="right-list" ref="rightContainer" class="list-container">
      <h3>List B</h3>
      <div v-for="(item, index) in rightItems" :key="index" class="draggable-item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import alugard from 'alugard-drop';
import 'alugard-drop/style.css';

// Refs to hold the DOM elements
const leftContainer = ref(null);
const rightContainer = ref(null);
let drake = null;

// Initial state data
const leftItems = ref(['Item 1', 'Item 2', 'Item 3']);
const rightItems = ref(['Item 4', 'Item 5', 'Item 6']);

onMounted(() => {
  // Initialize Alugard-Drop using the .value of our refs
  drake = alugard([leftContainer.value, rightContainer.value]);

  // Optional: Listen for events
  drake.on('drop', (el, target, source, sibling) => {
    console.log(`Dropped item into ${target.id}`);
    
    // Note: When Alugard moves the physical DOM nodes, it bypasses Vue's Virtual DOM.
    // If you need your state arrays (`leftItems`, `rightItems`) to perfectly match 
    // the UI, you should update them here based on the drop event.
  });
});

onUnmounted(() => {
  // Always clean up to prevent memory leaks
  if (drake) {
    drake.destroy();
  }
});
</script>

<style scoped>
.dnd-container {
  display: flex;
  gap: 20px;
}

.list-container {
  width: 250px;
  min-height: 300px;
  background-color: #f4f4f5;
  padding: 10px;
  border-radius: 8px;
}

.draggable-item {
  padding: 15px;
  background-color: white;
  border: 1px solid #e4e4e7;
  margin-bottom: 10px;
  cursor: grab;
  border-radius: 4px;
}
.draggable-item:active {
  cursor: grabbing;
}
</style>
```

### Key Takeaways for Vue.js
1.  **DOM Tracking:** Use template `ref="yourRefName"` and `const yourRefName = ref(null)` in your setup block.
2.  **`onMounted`:** Initialize the drag-and-drop instance inside the `onMounted` lifecycle hook, passing the `yourRefName.value` elements to `alugard()`.
3.  **Cleanup:** Ensure you call `drake.destroy()` within the `onUnmounted` hook.
4.  **Virtual DOM Conflict:** Remember that Alugard manipulates actual DOM elements. For data-driven applications, listen to the `drop` event and manually reorder your Vue data arrays so they stay synchronized with the DOM changes made by the user.
