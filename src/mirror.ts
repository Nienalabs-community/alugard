/**
 * AlugardDrop - Mirror rendering
 * Manages the visual clone that follows the cursor during drag.
 * Uses CSS transforms for GPU-composited positioning (no layout reflow).
 * Uses pointer-events: none instead of the hide/show className hack.
 */

import type { Drake } from './drake';

/** CSS class names used by alugard-drop */
export const CLASSES = {
  mirror: 'ad-mirror',
  transit: 'ad-transit',
  hide: 'ad-hide',
  unselectable: 'ad-unselectable',
} as const;

/**
 * Create and append a mirror image of the dragged item.
 * The mirror is a deep clone positioned with CSS transforms for smooth 60fps movement.
 */
export function createMirror(
  item: HTMLElement,
  mirrorContainer: HTMLElement,
  drake: Drake
): HTMLElement {
  const rect = item.getBoundingClientRect();
  const mirror = item.cloneNode(true) as HTMLElement;

  // Set explicit dimensions from the source element
  mirror.style.width = `${rect.width}px`;
  mirror.style.height = `${rect.height}px`;

  // Apply mirror styling
  mirror.classList.remove(CLASSES.transit);
  mirror.classList.add(CLASSES.mirror);

  // Append to mirror container
  mirrorContainer.appendChild(mirror);

  // Make mirror container unselectable during drag
  mirrorContainer.classList.add(CLASSES.unselectable);

  // Emit cloned event for the mirror
  drake.emit('cloned', mirror, item, 'mirror');

  return mirror;
}

/**
 * Remove the mirror image and clean up associated classes.
 */
export function removeMirror(
  mirror: HTMLElement | null,
  mirrorContainer: HTMLElement
): void {
  if (!mirror) return;

  mirrorContainer.classList.remove(CLASSES.unselectable);
  mirror.parentNode?.removeChild(mirror);
}

/**
 * Update mirror position using CSS transform (GPU-composited).
 * This replaces the old style.left/style.top approach which triggered layout reflow.
 */
export function moveMirror(mirror: HTMLElement, x: number, y: number): void {
  mirror.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

/**
 * Get the element underneath the cursor, ignoring the mirror.
 * Uses pointer-events: none on the mirror (set via CSS) instead of
 * the old hide/show className hack that caused DOM thrashing.
 *
 * The CSS class .ad-mirror already has pointer-events: none,
 * so document.elementFromPoint naturally sees through the mirror.
 */
export function getElementBehindMirror(
  _mirror: HTMLElement | null,
  x: number,
  y: number
): Element | null {
  return document.elementFromPoint(x, y);
}
