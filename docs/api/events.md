# Events API

The Alugard instance (a `Drake`) emits several events throughout the drag-and-drop lifecycle. You can listen to these events using the `.on(event, callback)` method.

```typescript
const drake = alugard([...containers]);

drake.on('drop', (item, target, source, sibling) => {
  console.log(`Moved ${item} into ${target}`);
});
```

## `drag`
*Fired when a drag operation starts.*
Callback signature: `(item: HTMLElement, source: HTMLElement) => void`

## `drop`
*Fired when an item is successfully placed into a container.*
Callback signature: `(item: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => void`

## `cancel`
*Fired if the drag is cancelled (e.g. by pressing Esc) or if it reverts to its initial position.*
Callback signature: `(item: HTMLElement, container: HTMLElement, source: HTMLElement) => void`

## `remove`
*Fired when an element is dropped outside a valid container with `removeOnSpill: true` enabled.*
Callback signature: `(item: HTMLElement, container: HTMLElement, source: HTMLElement) => void`

## `shadow`
*Fired continuously as the drag moves over valid containers, indicating where the element would land if dropped.*
Callback signature: `(item: HTMLElement, container: HTMLElement, source: HTMLElement) => void`

## `over`
*Fired when the dragged element enters a generic container.*
Callback signature: `(item: HTMLElement, container: HTMLElement, source: HTMLElement) => void`

## `out`
*Fired when the dragged element leaves a container.*
Callback signature: `(item: HTMLElement, container: HTMLElement, source: HTMLElement) => void`

## `cloned`
*Fired when `copy: true` is enabled, passing the original and the cloned element.*
Callback signature: `(clone: HTMLElement, original: HTMLElement, type: 'mirror' | 'copy') => void`

## `dragend`
*Fired at the very end of any drag lifecycle (after `drop`, `cancel`, or `remove`).*
Callback signature: `(item: HTMLElement) => void`
