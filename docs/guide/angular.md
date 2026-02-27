# Angular

Alugard-Drop works well inside Angular component architectures. Because Angular creates and destroys elements based on data binding, it is best to initialize the drag-and-drop instance when the view is fully rendered using the `AfterViewInit` lifecycle hook, referencing the DOM elements via `@ViewChild`.

## Example

### `drag-drop.component.ts`

```typescript
import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import alugard, { Drake } from 'alugard-drop';
// Remember to also include 'alugard-drop/style.css' in your angular.json styles array 
// or import it in your main styles.css/scss file.

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements AfterViewInit, OnDestroy {
  @ViewChild('leftList') leftListRef!: ElementRef<HTMLDivElement>;
  @ViewChild('rightList') rightListRef!: ElementRef<HTMLDivElement>;
  
  drakeInstance: Drake | null = null;

  leftItems = ['Item 1', 'Item 2', 'Item 3'];
  rightItems = ['Item 4', 'Item 5', 'Item 6'];

  ngAfterViewInit() {
    // Both ViewChild references are available now
    const leftContainer = this.leftListRef.nativeElement;
    const rightContainer = this.rightListRef.nativeElement;

    // Initialize Alugard-Drop
    this.drakeInstance = alugard([leftContainer, rightContainer]);

    // Optional event listening
    this.drakeInstance.on('drop', (el: HTMLElement, target: HTMLElement, source: HTMLElement) => {
      console.log(`Element dropped into container: ${target.id}`);
      
      // Note: Here you would typically synchronize the underlying 'leftItems' 
      // and 'rightItems' arrays based on the DOM change the user just made.
    });
  }

  ngOnDestroy() {
    // Destroy the instance to free up memory
    if (this.drakeInstance) {
      this.drakeInstance.destroy();
    }
  }
}
```

### `drag-drop.component.html`

```html
<div class="dnd-wrapper">
  <div id="left-list-container" #leftList class="list-container">
    <h3>List A</h3>
    <!-- Important: Use trackBy if dealing with complex objects -->
    <div *ngFor="let item of leftItems" class="draggable-item">
      {{ item }}
    </div>
  </div>

  <div id="right-list-container" #rightList class="list-container">
    <h3>List B</h3>
    <div *ngFor="let item of rightItems" class="draggable-item">
      {{ item }}
    </div>
  </div>
</div>
```

### `drag-drop.component.css`

```css
.dnd-wrapper {
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
```

### Key Takeaways for Angular
1.  **Selecting Elements:** Use `#templateVariable` and `@ViewChild('templateVariable')` to safely retrieve handles to native elements in the template.
2.  **`ngAfterViewInit`:** Always construct the `alugard()` instance in this lifecycle hook because this is when the inner elements rendered using `*ngFor` and the containers are confirmed to be within the DOM.
3.  **`ngOnDestroy`:** Call `.destroy()` on the drake instance to clear up native event listeners when the route or component changes.
4.  **Global Styles:** Make sure you've included `alugard-drop/style.css` globally in your Angular project so the floating clone (mirror) retains its styles when dragged out of the component's view encapsulation context.
