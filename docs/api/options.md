# Configuration Options

When initializing Alugard, you pass an array of containers and an optional configuration object.

```typescript
import alugard from 'alugard-drop';

const drake = alugard([container1, container2], {
  direction: 'vertical',
  copy: false,
  revertOnSpill: true
});
```

## `isContainer`
`isContainer?: (el: HTMLElement) => boolean`

A function that dynamically determines if an element should be treated as a container. This is useful if your containers are created dynamically.

## `moves`
`moves?: (item: HTMLElement, source: HTMLElement, handle: HTMLElement, sibling: HTMLElement | null) => boolean`

Determines if an element can be dragged. By default, all direct children of containers are draggable. Use this to implement drag handles.

## `accepts`
`accepts?: (item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => boolean`

Determines if an element can be dropped into a specific container and before a specific sibling. Use this to construct rules about where items are allowed to go.

## `invalid`
`invalid?: (item: HTMLElement, handle: HTMLElement) => boolean`

A function that prevents a drag from starting. By default, it ignores dragging on `<input>`, `<textarea>`, `<select>`, and `<a>` elements. 

## `copy`
`copy?: boolean | ((item: HTMLElement, source: HTMLElement) => boolean)`

Set to `true` to copy elements instead of moving them.

## `copySortSource`
`copySortSource?: boolean`

If `copy` is true, this determines if elements in the copy source wrapper can be reordered.

## `revertOnSpill`
`revertOnSpill?: boolean`

If true, dropping an item outside of any valid container will revert it to its original position.

## `removeOnSpill`
`removeOnSpill?: boolean`

If true, dropping an item outside of any valid container will remove it from the DOM entirely.

## `direction`
`direction?: 'vertical' | 'horizontal'`

Hints at the primary axis of layout. **Note:** Alugard detects physics dynamically, so this option is rarely strictly required unless you are forcing explicit collision shapes.

## `ignoreInputTextSelection`
`ignoreInputTextSelection?: boolean`

Prevents drag operations from initiating when the user is trying to highlight text in an input. Default is `true`.

## `slideFactorX` / `slideFactorY`
`slideFactorX?: number`
`slideFactorY?: number`

The number of pixels the pointer must traverse before a drag is officially triggered. Useful to prevent accidental drags on touch screens. Default is `0`.
