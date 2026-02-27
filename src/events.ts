/**
 * AlugardDrop - Event handling utilities
 * Replaces touchy(), crossvent, whichMouseButton(), getEventHost(), getCoord()
 * with modern Pointer Events API.
 */

type EventOp = 'add' | 'remove';

/**
 * Bind or unbind pointer events on an element.
 * Replaces the touchy() function that handled mouse/touch/pointer/MSPointer separately.
 * Modern browsers all support Pointer Events, which unify mouse, touch, and pen input.
 * Falls back to mouse events if pointer events aren't available (e.g., in test environments).
 */
export function pointerEvents(
  el: HTMLElement | Document,
  op: EventOp,
  type: 'down' | 'move' | 'up' | 'cancel',
  fn: (e: MouseEvent) => void
): void {
  const hasPointerEvents = typeof PointerEvent !== 'undefined';
  
  const pointerMap = { down: 'pointerdown', move: 'pointermove', up: 'pointerup', cancel: 'pointercancel' } as const;
  const mouseMap = { down: 'mousedown', move: 'mousemove', up: 'mouseup', cancel: '' } as const;
  
  const eventName = hasPointerEvents ? pointerMap[type] : mouseMap[type];
  if (!eventName) return; // ignore mouse cancel
  const method = op === 'add' ? 'addEventListener' : 'removeEventListener';
  (el as HTMLElement)[method](eventName, fn as EventListener);
}

/**
 * Check if a pointer event is a primary left-click / primary touch.
 * Replaces whichMouseButton() which had 10+ lines of cross-browser checks.
 */
export function isPrimaryButton(e: MouseEvent): boolean {
  // button === 0 is left mouse / primary touch / primary pen
  return e.button === 0 && !e.metaKey && !e.ctrlKey;
}

/**
 * Get coordinates from a pointer event.
 * Replaces getEventHost() + getCoord() which handled touch arrays and IE8 fallbacks.
 * Pointer Events normalize all input types into a single event with clientX/clientY.
 */
export function getPointerCoords(e: MouseEvent): { clientX: number; clientY: number; pageX: number; pageY: number } {
  return {
    clientX: e.clientX,
    clientY: e.clientY,
    pageX: e.pageX,
    pageY: e.pageY,
  };
}
