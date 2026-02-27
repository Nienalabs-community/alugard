/**
 * AlugardDrop - Drake class
 * The core drag manager with type-safe event emission.
 * Replaces contra/emitter with a manual typed event system.
 */

import type { DrakeEventMap, DrakeEventName } from './types';

// Internal type: a listener for a given event name
type Listener<K extends DrakeEventName> = DrakeEventMap[K];

/**
 * Drake is the object returned by alugard().
 * It manages containers, tracks drag state, and emits typed events.
 */
export class Drake {
  /** The collection of containers managed by this drake. */
  containers: HTMLElement[];

  /** Whether a drag operation is currently in progress. */
  dragging = false;

  /** Internal listener storage: event name → Set of listeners */
  #listeners = new Map<DrakeEventName, Set<Listener<DrakeEventName>>>();

  // Internal references set by the alugard controller
  #startFn: ((item: HTMLElement) => void) | null = null;
  #endFn: (() => void) | null = null;
  #cancelFn: ((revert?: boolean) => void) | null = null;
  #removeFn: (() => void) | null = null;
  #destroyFn: (() => void) | null = null;
  #canMoveFn: ((item: HTMLElement) => boolean) | null = null;

  constructor(containers: HTMLElement[] = []) {
    this.containers = containers;
  }

  /** Bind internal controller methods. Called by the alugard factory. */
  _bindController(controller: {
    start: (item: HTMLElement) => void;
    end: () => void;
    cancel: (revert?: boolean) => void;
    remove: () => void;
    destroy: () => void;
    canMove: (item: HTMLElement) => boolean;
  }): void {
    this.#startFn = controller.start;
    this.#endFn = controller.end;
    this.#cancelFn = controller.cancel;
    this.#removeFn = controller.remove;
    this.#destroyFn = controller.destroy;
    this.#canMoveFn = controller.canMove;
  }

  /**
   * Programmatically start dragging an item.
   * Enters drag mode without a shadow — the user gets a visual
   * shadow once they click and start moving the item.
   */
  start(item: HTMLElement): void {
    this.#startFn?.(item);
  }

  /**
   * End the current drag using the last preview position as the drop target.
   * Emits 'drop' or 'cancel' depending on whether the item moved.
   */
  end(): void {
    this.#endFn?.();
  }

  /**
   * Cancel the current drag.
   * @param revert - If true, forces the item back to its original position.
   */
  cancel(revert?: boolean): void {
    this.#cancelFn?.(revert);
  }

  /** Remove the currently dragged element from the DOM. */
  remove(): void {
    this.#removeFn?.();
  }

  /** Teardown all event listeners and release resources. */
  destroy(): void {
    this.#destroyFn?.();
  }

  /** Check if an element can be dragged by this drake. */
  canMove(item: HTMLElement): boolean {
    return this.#canMoveFn?.(item) ?? false;
  }

  /** Subscribe to a drake event. Returns this for chaining. */
  on<K extends DrakeEventName>(event: K, listener: DrakeEventMap[K]): this {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event)!.add(listener as Listener<DrakeEventName>);
    return this;
  }

  /** Unsubscribe from a drake event. */
  off<K extends DrakeEventName>(event: K, listener: DrakeEventMap[K]): this {
    this.#listeners.get(event)?.delete(listener as Listener<DrakeEventName>);
    return this;
  }

  /** Emit a drake event with arguments. */
  emit<K extends DrakeEventName>(event: K, ...args: Parameters<DrakeEventMap[K]>): void {
    const listeners = this.#listeners.get(event);
    if (!listeners) return;
    for (const listener of listeners) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listener as (...a: any[]) => void)(...args);
    }
  }
}
