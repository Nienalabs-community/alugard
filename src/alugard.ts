/**
 * AlugardDrop - Main factory function
 * Orchestrates the drag & drop lifecycle using modern APIs.
 * This is the modernized equivalent of dragula.js.
 */

import type { AlugardOptions, ResolvedOptions, GrabContext } from './types';
import { Drake } from './drake';
import { pointerEvents, isPrimaryButton, getPointerCoords } from './events';
import { CLASSES, createMirror, removeMirror, moveMirror, getElementBehindMirror } from './mirror';
import { getOffset, getImmediateChild, getReference, nextElementSibling, isInput, getParent } from './position';

/**
 * Create a new drag & drop instance.
 *
 * @param initialContainers - Array of container elements (or options if no containers)
 * @param options - Configuration options
 * @returns A Drake instance for managing drag & drop
 *
 * @example
 * ```ts
 * import alugard from 'alugard-drop';
 * import 'alugard-drop/style.css';
 *
 * const drake = alugard([container1, container2]);
 * drake.on('drop', (el, target, source, sibling) => {
 *   console.log('Dropped!', el);
 * });
 * ```
 */
export function alugard(initialContainers?: HTMLElement[] | AlugardOptions, options?: AlugardOptions): Drake {
  // Handle flexible argument signatures (same as original dragula)
  if (arguments.length === 1 && !Array.isArray(initialContainers)) {
    options = initialContainers as AlugardOptions;
    initialContainers = [];
  }

  const containers = (initialContainers as HTMLElement[]) || [];

  // Resolve options with defaults
  const o: ResolvedOptions = {
    containers,
    isContainer: options?.isContainer ?? (() => false),
    moves: options?.moves ?? (() => true),
    accepts: options?.accepts ?? (() => true),
    invalid: options?.invalid ?? (() => false),
    copy: options?.copy ?? false,
    copySortSource: options?.copySortSource ?? false,
    revertOnSpill: options?.revertOnSpill ?? false,
    removeOnSpill: options?.removeOnSpill ?? false,
    direction: options?.direction ?? 'vertical',
    mirrorContainer: options?.mirrorContainer ?? document.body,
    ignoreInputTextSelection: options?.ignoreInputTextSelection ?? true,
    slideFactorX: options?.slideFactorX ?? 0,
    slideFactorY: options?.slideFactorY ?? 0,
  };

  // If containers were passed in options, use those
  if (options?.containers) {
    o.containers = options.containers;
  }

  // --- Internal state (replaces closure vars in dragula.js) ---
  let _mirror: HTMLElement | null = null;
  let _source: HTMLElement | null = null;
  let _item: HTMLElement | null = null;
  let _offsetX = 0;
  let _offsetY = 0;
  let _moveX = 0;
  let _moveY = 0;
  let _initialSibling: HTMLElement | null = null;
  let _currentSibling: HTMLElement | null = null;
  let _copy: HTMLElement | null = null;
  let _renderTimer: ReturnType<typeof setTimeout> | null = null;
  let _lastDropTarget: HTMLElement | null = null;
  let _grabbed: GrabContext | null = null;

  // --- Create the Drake instance ---
  const drake = new Drake(o.containers);

  drake._bindController({
    start: manualStart,
    end,
    cancel,
    remove,
    destroy,
    canMove,
  });

  // Register spill handlers
  if (o.removeOnSpill) {
    drake.on('over', spillOver);
    drake.on('out', spillOut);
  }

  // Bind initial events
  bindDOMEvents();

  return drake;

  // ========================================================
  // Container detection
  // ========================================================

  function isContainer(el: HTMLElement): boolean {
    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
  }

  // ========================================================
  // DOM event binding (replaces events() / eventualMovements() / movements())
  // ========================================================

  function bindDOMEvents(unbind = false): void {
    const op = unbind ? 'remove' : 'add';
    const listenerOp = unbind ? 'removeEventListener' : 'addEventListener';
    pointerEvents(document.documentElement, op, 'down', grab);
    pointerEvents(document.documentElement, op, 'up', release);
    pointerEvents(document.documentElement, op, 'cancel', release);
    document.documentElement[listenerOp]('touchmove', preventGrabbed as EventListener, { passive: false } as EventListenerOptions);
  }

  function bindMoveEvents(unbind = false): void {
    const op = unbind ? 'remove' : 'add';
    pointerEvents(document.documentElement, op, 'move', startBecausePointerMoved);
  }

  function bindDragMoveEvents(unbind = false): void {
    const op = unbind ? 'removeEventListener' : 'addEventListener';
    document.documentElement[op]('selectstart', preventGrabbed);
    document.documentElement[op]('click', preventGrabbed);
  }

  // ========================================================
  // Lifecycle: Destroy
  // ========================================================

  function destroy(): void {
    bindDOMEvents(true);
    release({} as PointerEvent);
  }

  // ========================================================
  // Event suppression
  // ========================================================

  function preventGrabbed(e: Event): void {
    if (_grabbed) {
      e.preventDefault();
    }
  }

  // ========================================================
  // Phase 1: Grab (pointerdown)
  // ========================================================

  function grab(e: MouseEvent): void {
    _moveX = e.clientX;
    _moveY = e.clientY;

    if (!isPrimaryButton(e)) return;

    const item = e.target as HTMLElement;
    const context = canStart(item);
    if (!context) return;

    _grabbed = context;
    bindMoveEvents();

    // For mouse: prevent default on non-inputs, focus inputs
    if ((e as PointerEvent).pointerType === 'mouse' || !(e as PointerEvent).pointerType) {
      if (isInput(item)) {
        item.focus();
      } else {
        e.preventDefault();
      }
    }
  }

  // ========================================================
  // Phase 2: Start detection (pointermove)
  // ========================================================

  function startBecausePointerMoved(e: MouseEvent): void {
    if (!_grabbed) return;

    // If button was released without us noticing (e.g. text selection)
    if (e.buttons === 0) {
      release({} as PointerEvent);
      return;
    }

    // Slide factor check: ignore tiny movements
    if (
      (Math.abs(e.clientX - _moveX) <= o.slideFactorX) &&
      (Math.abs(e.clientY - _moveY) <= o.slideFactorY)
    ) {
      return;
    }

    // Input text selection guard
    if (o.ignoreInputTextSelection) {
      const elementBehindCursor = document.elementFromPoint(e.clientX, e.clientY);
      if (elementBehindCursor && isInput(elementBehindCursor)) return;
    }

    const grabbed = _grabbed;
    bindMoveEvents(true); // stop listening for initial move
    bindDragMoveEvents(); // start suppressing clicks/selections
    end(); // end any previous drag
    start(grabbed); // begin new drag

    // Calculate offset for mirror positioning
    const offset = getOffset(_item!);
    const coords = getPointerCoords(e);
    _offsetX = coords.pageX - offset.left;
    _offsetY = coords.pageY - offset.top;

    // Add transit class to source item
    (_copy || _item!).classList.add(CLASSES.transit);

    // Create mirror and begin drag tracking
    renderMirrorImage();
    drag(e);
  }

  // ========================================================
  // Phase 3: canStart — target resolution algorithm
  // ========================================================

  function canStart(item: HTMLElement): GrabContext | null {
    if (drake.dragging && _mirror) return null;
    if (isContainer(item)) return null; // don't drag the container itself

    const handle = item;
    let current = item;

    // Walk up the DOM tree to find the top-level draggable child
    while (getParent(current) && !isContainer(getParent(current)!)) {
      if (o.invalid(current, handle)) return null;
      current = getParent(current)!;
      if (!current) return null;
    }

    const source = getParent(current);
    if (!source) return null;
    if (o.invalid(current, handle)) return null;

    const movable = o.moves(current, source, handle, nextElementSibling(current));
    if (!movable) return null;

    return { item: current, source };
  }

  function canMove(item: HTMLElement): boolean {
    return canStart(item) !== null;
  }

  function manualStart(item: HTMLElement): void {
    const context = canStart(item);
    if (context) {
      start(context);
    }
  }

  // ========================================================
  // Phase 4: Start drag
  // ========================================================

  function start(context: GrabContext): void {
    if (isCopy(context.item, context.source)) {
      _copy = context.item.cloneNode(true) as HTMLElement;
      drake.emit('cloned', _copy, context.item, 'copy');
    }

    _source = context.source;
    _item = context.item;
    _initialSibling = _currentSibling = nextElementSibling(context.item);

    drake.dragging = true;
    drake.emit('drag', _item, _source);
  }

  // ========================================================
  // Phase 5: End / Drop / Cancel / Remove
  // ========================================================

  function end(): void {
    if (!drake.dragging) return;
    const item = _copy || _item!;
    drop(item, getParent(item));
  }

  function ungrab(): void {
    _grabbed = null;
    bindMoveEvents(true);
    bindDragMoveEvents(true);
  }

  function release(e: MouseEvent): void {
    ungrab();
    if (!drake.dragging) return;

    const item = _copy || _item!;
    const clientX = e.clientX ?? 0;
    const clientY = e.clientY ?? 0;
    const elementBehindCursor = getElementBehindMirror(_mirror, clientX, clientY);
    const dropTarget = findDropTargetFromElement(elementBehindCursor, clientX, clientY);

    if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
      drop(item, dropTarget);
    } else if (o.removeOnSpill) {
      remove();
    } else {
      cancel();
    }
  }

  function drop(item: HTMLElement, target: HTMLElement | null): void {
    const parent = getParent(item);
    if (_copy && o.copySortSource && target === _source && parent) {
      parent.removeChild(_item!);
    }
    if (isInitialPlacement(target)) {
      drake.emit('cancel', item, _source!, _source!);
    } else {
      drake.emit('drop', item, target!, _source!, _currentSibling);
    }
    cleanup();
  }

  function remove(): void {
    if (!drake.dragging) return;
    const item = _copy || _item!;
    const parent = getParent(item);
    if (parent) {
      parent.removeChild(item);
    }
    drake.emit(_copy ? 'cancel' : 'remove', item, parent!, _source!);
    cleanup();
  }

  function cancel(revert?: boolean): void {
    if (!drake.dragging) return;
    const reverts = revert !== undefined ? revert : o.revertOnSpill;
    const item = _copy || _item!;
    const parent = getParent(item);
    const initial = isInitialPlacement(parent);

    if (!initial && reverts) {
      if (_copy) {
        if (parent) parent.removeChild(_copy);
      } else {
        _source!.insertBefore(item, _initialSibling);
      }
    }

    if (initial || reverts) {
      drake.emit('cancel', item, _source!, _source!);
    } else {
      drake.emit('drop', item, parent!, _source!, _currentSibling);
    }
    cleanup();
  }

  // ========================================================
  // Cleanup
  // ========================================================

  function cleanup(): void {
    const item = _copy || _item;
    ungrab();
    removeMirrorImage();
    if (item) {
      item.classList.remove(CLASSES.transit);
    }
    if (_renderTimer) {
      clearTimeout(_renderTimer);
    }
    drake.dragging = false;
    if (_lastDropTarget) {
      drake.emit('out', item!, _lastDropTarget, _source!);
    }
    drake.emit('dragend', item!);
    _source = _item = _copy = _initialSibling = _currentSibling = _lastDropTarget = null;
    _renderTimer = null;
  }

  // ========================================================
  // Placement detection
  // ========================================================

  function isInitialPlacement(target: HTMLElement | null, s?: HTMLElement | null): boolean {
    let sibling: HTMLElement | null;
    if (s !== undefined) {
      sibling = s;
    } else if (_mirror) {
      sibling = _currentSibling;
    } else {
      sibling = nextElementSibling((_copy || _item)!);
    }
    return target === _source && sibling === _initialSibling;
  }

  // ========================================================
  // Drop target finding
  // ========================================================

  function findDropTargetFromElement(
    elementBehindCursor: Element | null,
    clientX: number,
    clientY: number
  ): HTMLElement | null {
    let target = elementBehindCursor as HTMLElement | null;
    while (target && !accepted(target, elementBehindCursor as HTMLElement, clientX, clientY)) {
      target = target.parentNode === document ? null : target.parentNode as HTMLElement | null;
    }
    return target;
  }

  function accepted(
    target: HTMLElement,
    elementBehindCursor: HTMLElement,
    clientX: number,
    clientY: number
  ): boolean {
    if (!isContainer(target)) return false;

    const immediate = getImmediateChild(target, elementBehindCursor);
    const reference = getReference(target, immediate, clientX, clientY, o);
    const initial = isInitialPlacement(target, reference);
    if (initial) return true; // can always drop back where it came from

    return o.accepts(_item!, target, _source!, reference);
  }

  // ========================================================
  // Continuous drag (pointermove during active drag)
  // ========================================================

  function drag(e: MouseEvent): void {
    if (!_mirror) return;
    e.preventDefault();

    const clientX = e.clientX;
    const clientY = e.clientY;
    const x = clientX - _offsetX;
    const y = clientY - _offsetY;

    // Position mirror with GPU-composited transform
    moveMirror(_mirror, x, y);

    const item = _copy || _item!;
    const elementBehindCursor = getElementBehindMirror(_mirror, clientX, clientY);
    const dropTarget = findDropTargetFromElement(elementBehindCursor, clientX, clientY);
    const changed = dropTarget !== null && dropTarget !== _lastDropTarget;

    if (changed || dropTarget === null) {
      emitOut();
      _lastDropTarget = dropTarget;
      emitOver();
    }

    const parent = getParent(item);
    if (dropTarget === _source && _copy && !o.copySortSource) {
      if (parent) parent.removeChild(item);
      return;
    }

    let reference: HTMLElement | null;
    const immediate = dropTarget ? getImmediateChild(dropTarget, elementBehindCursor as HTMLElement) : null;

    if (immediate !== null && dropTarget) {
      reference = getReference(dropTarget, immediate, clientX, clientY, o);
    } else if (o.revertOnSpill && !_copy) {
      reference = _initialSibling;
      // dropTarget intentionally reassigned to _source for revert behavior
      _lastDropTarget = _source;
    } else {
      if (_copy && parent) parent.removeChild(item);
      return;
    }

    const insertTarget = dropTarget || _source!;
    if (
      (reference === null && changed) ||
      (reference !== item && reference !== nextElementSibling(item))
    ) {
      _currentSibling = reference;
      insertTarget.insertBefore(item, reference);
      drake.emit('shadow', item, insertTarget, _source!);
    }

    function emitOut(): void {
      if (_lastDropTarget) {
        drake.emit('out', item, _lastDropTarget, _source!);
      }
    }

    function emitOver(): void {
      if (changed && dropTarget) {
        drake.emit('over', item, dropTarget, _source!);
      }
    }
  }

  // ========================================================
  // Spill handlers (for removeOnSpill)
  // ========================================================

  function spillOver(el: HTMLElement): void {
    el.classList.remove(CLASSES.hide);
  }

  function spillOut(el: HTMLElement): void {
    if (drake.dragging) {
      el.classList.add(CLASSES.hide);
    }
  }

  // ========================================================
  // Mirror management
  // ========================================================

  function renderMirrorImage(): void {
    if (_mirror) return;
    _mirror = createMirror(_item!, o.mirrorContainer, drake);
    pointerEvents(document.documentElement, 'add', 'move', drag);
  }

  function removeMirrorImage(): void {
    if (_mirror) {
      removeMirror(_mirror, o.mirrorContainer);
      pointerEvents(document.documentElement, 'remove', 'move', drag);
      _mirror = null;
    }
  }

  // ========================================================
  // Utility: copy check
  // ========================================================

  function isCopy(item: HTMLElement, container: HTMLElement): boolean {
    return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
  }
}
