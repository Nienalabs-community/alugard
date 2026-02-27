/**
 * AlugardDrop - Type definitions
 * All interfaces and types for the drag & drop library.
 */

/** Configuration options for creating an alugard-drop instance. */
export interface AlugardOptions {
  /**
   * Array of container elements where dragging is allowed.
   * Elements can be dragged between any of these containers.
   */
  containers?: HTMLElement[];

  /**
   * Dynamic container check. Besides the containers array,
   * this function can identify additional containers at runtime.
   * @default () => false
   */
  isContainer?: (el: HTMLElement) => boolean;

  /**
   * Determines if an element can be dragged.
   * @param el - The element that would be dragged
   * @param source - The container the element belongs to
   * @param handle - The element that was clicked (drag handle)
   * @param sibling - The next sibling element
   * @returns true if the element can be dragged
   * @default () => true
   */
  moves?: (el: HTMLElement, source: HTMLElement, handle: HTMLElement, sibling: HTMLElement | null) => boolean;

  /**
   * Determines if an element can be dropped into a container.
   * @param el - The element being dragged
   * @param target - The container where the element would be dropped
   * @param source - The container where the element came from
   * @param sibling - The element it would be dropped before (null = end)
   * @returns true if the drop is accepted
   * @default () => true
   */
  accepts?: (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => boolean;

  /**
   * Determines if a drag should be prevented from starting.
   * Checked on the clicked element and every parent up to the container.
   * @param el - The element being checked
   * @param handle - The originally clicked element
   * @returns true to prevent dragging
   * @default () => false
   */
  invalid?: (el: HTMLElement, handle: HTMLElement) => boolean;

  /**
   * Whether to copy elements instead of moving them.
   * Can be a boolean or a function for conditional copying.
   * @default false
   */
  copy?: boolean | ((el: HTMLElement, source: HTMLElement) => boolean);

  /**
   * When copy is true, whether to allow sorting in the source container.
   * @default false
   */
  copySortSource?: boolean;

  /**
   * Revert elements to their original position when dropped outside containers.
   * @default false
   */
  revertOnSpill?: boolean;

  /**
   * Remove elements from the DOM when dropped outside containers.
   * @default false
   */
  removeOnSpill?: boolean;

  /**
   * Layout direction used to determine drop position.
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * The DOM element where the mirror is appended during drag.
   * @default document.body
   */
  mirrorContainer?: HTMLElement;

  /**
   * Allow users to select text in input elements inside draggable elements.
   * Drag won't start until mouse exits the input.
   * @default true
   */
  ignoreInputTextSelection?: boolean;

  /**
   * Minimum horizontal movement (px) before a click becomes a drag.
   * @default 0
   */
  slideFactorX?: number;

  /**
   * Minimum vertical movement (px) before a click becomes a drag.
   * @default 0
   */
  slideFactorY?: number;
}

/** Normalized internal options with all defaults applied. */
export interface ResolvedOptions {
  containers: HTMLElement[];
  isContainer: (el: HTMLElement) => boolean;
  moves: (el: HTMLElement, source: HTMLElement, handle: HTMLElement, sibling: HTMLElement | null) => boolean;
  accepts: (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => boolean;
  invalid: (el: HTMLElement, handle: HTMLElement) => boolean;
  copy: boolean | ((el: HTMLElement, source: HTMLElement) => boolean);
  copySortSource: boolean;
  revertOnSpill: boolean;
  removeOnSpill: boolean;
  direction: 'vertical' | 'horizontal';
  mirrorContainer: HTMLElement;
  ignoreInputTextSelection: boolean;
  slideFactorX: number;
  slideFactorY: number;
}

/** Context captured when an item is grabbed but not yet dragged. */
export interface GrabContext {
  item: HTMLElement;
  source: HTMLElement;
}

/** Map of event names to their listener signatures. */
export interface DrakeEventMap {
  drag: (el: HTMLElement, source: HTMLElement) => void;
  dragend: (el: HTMLElement) => void;
  drop: (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement | null) => void;
  cancel: (el: HTMLElement, container: HTMLElement, source: HTMLElement) => void;
  remove: (el: HTMLElement, container: HTMLElement, source: HTMLElement) => void;
  shadow: (el: HTMLElement, container: HTMLElement, source: HTMLElement) => void;
  over: (el: HTMLElement, container: HTMLElement, source: HTMLElement) => void;
  out: (el: HTMLElement, container: HTMLElement, source: HTMLElement) => void;
  cloned: (clone: HTMLElement, original: HTMLElement, type: 'mirror' | 'copy') => void;
}

/** Event names supported by the Drake instance. */
export type DrakeEventName = keyof DrakeEventMap;
