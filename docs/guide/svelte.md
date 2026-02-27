# Svelte

Integrating Alugard-Drop with Svelte is straightforward using `bind:this` to access DOM elements and the `onMount` lifecycle hook.

## Example

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import alugard from 'alugard-drop';
  import 'alugard-drop/style.css'; 

  let leftContainer;
  let rightContainer;
  let drake;

  let leftItems = ['Item 1', 'Item 2', 'Item 3'];
  let rightItems = ['Item 4', 'Item 5', 'Item 6'];

  onMount(() => {
    // Elements bound with `bind:this` are guaranteed to be available in onMount
    drake = alugard([leftContainer, rightContainer]);

    drake.on('drop', (el, target, source) => {
      console.log(`Element dropped from ${source.id} into ${target.id}`);
      
      // Note: Because Alugard moved the DOM node manually, it circumvents Svelte's state.
      // If order matters in your data logic, listen to this event, figure out the new index, 
      // and update `leftItems`/`rightItems` arrays manually to keep them in sync.
    });
  });

  onDestroy(() => {
    if (drake) drake.destroy();
  });
</script>

<div class="wrapper">
  <div id="left-list" bind:this={leftContainer} class="list">
    <h3>List A</h3>
    {#each leftItems as item (item)}
      <div class="draggable-item">
        {item}
      </div>
    {/each}
  </div>

  <div id="right-list" bind:this={rightContainer} class="list">
    <h3>List B</h3>
    {#each rightItems as item (item)}
      <div class="draggable-item">
        {item}
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    gap: 20px;
  }

  .list {
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
</style>
```

### Key Takeaways for Svelte
1.  **Element Binding:** Utilize `bind:this={variableName}` to grab the native DOM node of your drag containers directly.
2.  **`onMount` Setup:** `alugard(...)` requires real DOM elements, making the `onMount` lifecycle hook the ideal place for initialization.
3.  **Keyed Blocks:** When rendering items to be dragged, it's often a good idea to use keyed each blocks (like `{#each items as item (item.id)}`) to help Svelte keep track of DOM nodes that have been manually shuffled by an external tool.
