# React

Alugard-Drop works seamlessly with React. As with any DOM manipulation library in React, the key is to initialize the library after the component has mounted and the DOM elements are available. We use the `useEffect` and `useRef` hooks for this.

## Example

This is a functional React component demonstrating a basic drag-and-drop setup between two lists.

```tsx
import React, { useEffect, useRef, useState } from 'react';
import alugard from 'alugard-drop';
import 'alugard-drop/style.css'; 

export default function DragDropExample() {
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const drakeRef = useRef<any>(null);

  const [leftItems, setLeftItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [rightItems, setRightItems] = useState(['Item 4', 'Item 5', 'Item 6']);

  useEffect(() => {
    // Only initialize if the containers are ready
    if (leftContainerRef.current && rightContainerRef.current) {
      
      // Initialize Alugard-Drop with the container elements
      drakeRef.current = alugard([leftContainerRef.current, rightContainerRef.current]);

      // Optional: Listen for the 'drop' event
      drakeRef.current.on('drop', (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => {
        console.log(`Successfully dropped an item into ${target.id}`);
        
        // Note: For complex state sync, you would update your React state here 
        // based on the DOM changes made by Alugard-Drop.
      });
    }

    // Cleanup: destroy the drake instance when component unmounts
    return () => {
      if (drakeRef.current) {
        drakeRef.current.destroy();
      }
    };
  }, []); // Run once on mount

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div 
        id="left-list" 
        ref={leftContainerRef} 
        style={{ width: '250px', minHeight: '300px', background: '#f4f4f5', padding: '10px', borderRadius: '8px' }}
      >
        <h3>List A</h3>
        {leftItems.map((item, index) => (
          <div key={`left-${index}`} className="draggable-item" style={{ padding: '15px', background: 'white', border: '1px solid #e4e4e7', marginBottom: '10px', cursor: 'grab', borderRadius: '4px' }}>
            {item}
          </div>
        ))}
      </div>

      <div 
        id="right-list" 
        ref={rightContainerRef} 
        style={{ width: '250px', minHeight: '300px', background: '#f4f4f5', padding: '10px', borderRadius: '8px' }}
      >
        <h3>List B</h3>
        {rightItems.map((item, index) => (
          <div key={`right-${index}`} className="draggable-item" style={{ padding: '15px', background: 'white', border: '1px solid #e4e4e7', marginBottom: '10px', cursor: 'grab', borderRadius: '4px' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Key Takeaways for React
1.  **DOM Refs:** Use `useRef` to get the DOM node of your container elements. Alugard-Drop needs raw DOM elements, not React components.
2.  **Initialization:** Always initialize `alugard()` inside `useEffect` (or `componentDidMount` for class components) so the DOM is guaranteed to be present.
3.  **Cleanup:** Return a cleanup function from your `useEffect` to call `drake.destroy()` to prevent memory leaks if the component unmounts.
4.  **State Synchronization:** Alugard-Drop updates the actual DOM directly. If your UI relies heavily on React state (`leftItems` and `rightItems`), you need to listen for the `drop` event and manually update your state arrays to reflect the new DOM order, so React doesn't override the changes on the next render.
