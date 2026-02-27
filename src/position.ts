/**
 * AlugardDrop - Position calculation utilities
 * Extracts drop position algorithms from dragula.js.
 * These algorithms are solid and preserved with minimal changes.
 */

import type { ResolvedOptions } from './types';

/**
 * Get the offset of an element relative to the page (accounting for scroll).
 * Replaces getOffset() + getScroll() which had IE fallbacks.
 */
export function getOffset(el: HTMLElement): { left: number; top: number } {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}

/**
 * Find the immediate child of a container that contains the target element.
 * Walks up from target until it finds a direct child of the dropTarget.
 */
export function getImmediateChild(dropTarget: HTMLElement, target: Element): HTMLElement | null {
  let immediate = target as HTMLElement;
  while (immediate !== dropTarget && immediate.parentNode !== dropTarget) {
    immediate = immediate.parentNode as HTMLElement;
    if (!immediate) return null;
  }
  if (immediate === document.documentElement) {
    return null;
  }
  return immediate;
}

/**
 * Determine where an element should be inserted in a container.
 * Compares cursor position to child midpoints based on layout direction.
 *
 * Two strategies:
 * - inside(): Fast path when cursor is over a child element (compare to that child's midpoint)
 * - outside(): Slow path over empty space (iterate all children)
 */
export function getReference(
  dropTarget: HTMLElement,
  target: HTMLElement | null,
  x: number,
  y: number,
  options: ResolvedOptions
): HTMLElement | null {
  const horizontal = options.direction === 'horizontal';

  if (target !== null && target !== dropTarget) {
    return inside(target, horizontal, x, y);
  }
  return outside(dropTarget, horizontal, x, y);
}

/**
 * Fast path: cursor is over a child element.
 * Compare cursor position to the child's midpoint.
 */
function inside(
  target: HTMLElement,
  horizontal: boolean,
  x: number,
  y: number
): HTMLElement | null {
  const rect = target.getBoundingClientRect();
  if (horizontal) {
    const after = x > rect.left + rect.width / 2;
    return after ? nextElementSibling(target) : target;
  }
  const after = y > rect.top + rect.height / 2;
  return after ? nextElementSibling(target) : target;
}

/**
 * Slow path: cursor is over empty space in the container.
 * Iterate all children and find the first one whose midpoint is past the cursor.
 */
function outside(
  dropTarget: HTMLElement,
  horizontal: boolean,
  x: number,
  y: number
): HTMLElement | null {
  const children = dropTarget.children;
  for (let i = 0; i < children.length; i++) {
    const el = children[i] as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (horizontal && (rect.left + rect.width / 2) > x) return el;
    if (!horizontal && (rect.top + rect.height / 2) > y) return el;
  }
  return null;
}

/**
 * Get the next element sibling. Modern browsers all support nextElementSibling.
 * Replaces the manual nodeType fallback from dragula.
 */
export function nextElementSibling(el: HTMLElement): HTMLElement | null {
  return el.nextElementSibling as HTMLElement | null;
}

/**
 * Walk up from an element to find a valid drop target (container).
 */
export function findDropTarget(
  elementBehindCursor: Element | null,
  isContainer: (el: HTMLElement) => boolean,
  accepts: (immediate: HTMLElement | null, reference: HTMLElement | null) => boolean
): HTMLElement | null {
  let target = elementBehindCursor as HTMLElement | null;
  while (target) {
    if (isContainer(target)) {
      if (accepts(target, null)) {
        return target;
      }
    }
    target = target.parentNode === document ? null : target.parentNode as HTMLElement | null;
  }
  return null;
}

/**
 * Check if an element is an input-like element (input, textarea, select, contenteditable).
 */
export function isInput(el: Element): boolean {
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return isEditable(el as HTMLElement);
}

/**
 * Recursively check if an element has contentEditable set to true.
 */
function isEditable(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (el.contentEditable === 'false') return false;
  if (el.contentEditable === 'true') return true;
  return isEditable(el.parentNode === document ? null : el.parentNode as HTMLElement | null);
}

/**
 * Get the parent node, returning null if parent is the document.
 */
export function getParent(el: HTMLElement): HTMLElement | null {
  return el.parentNode === document ? null : el.parentNode as HTMLElement | null;
}
