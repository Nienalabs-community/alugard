/**
 * Test helpers — replaces test/lib/events.js
 * Uses MouseEvent as a fallback since happy-dom may not support PointerEvent.
 */

export function raise(el: HTMLElement, type: string, options: Record<string, unknown> = {}): void {
  // happy-dom may not have PointerEvent, fall back to MouseEvent
  const EventConstructor = typeof PointerEvent !== 'undefined' ? PointerEvent : MouseEvent;
  
  const eventInit: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    button: (options.button as number) ?? 0,
    buttons: (options.buttons as number) ?? 0,
    clientX: (options.clientX as number) ?? (type === 'pointermove' ? 10 : 0),
    clientY: (options.clientY as number) ?? (type === 'pointermove' ? 10 : 0),
    metaKey: (options.metaKey as boolean) ?? false,
    ctrlKey: (options.ctrlKey as boolean) ?? false,
  };

  const e = new EventConstructor(type, eventInit);
  el.dispatchEvent(e);
}

/** Create a container div with child items, append to body. */
export function createContainer(...children: HTMLElement[]): HTMLElement {
  const div = document.createElement('div');
  children.forEach((child) => div.appendChild(child));
  document.body.appendChild(div);
  return div;
}

/** Create a simple div element. */
export function createItem(innerHTML = ''): HTMLElement {
  const div = document.createElement('div');
  if (innerHTML) div.innerHTML = innerHTML;
  return div;
}
