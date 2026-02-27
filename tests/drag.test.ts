import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';
import { raise, createContainer, createItem } from './setup';

describe('Drag events', () => {
  it('emits drag event on pointerdown + pointermove', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let dragEmitted = false;
    let dragEl: HTMLElement | null = null;
    let dragSource: HTMLElement | null = null;

    drake.on('drag', (el, source) => {
      dragEmitted = true;
      dragEl = el;
      dragSource = source;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(true);
    expect(dragEl).toBe(item);
    expect(dragSource).toBe(div);
    expect(drake.dragging).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('does not drag on right click', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 2 });
    raise(item, 'pointermove', { buttons: 2 });

    expect(dragEmitted).toBe(false);
    expect(drake.dragging).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('does not drag on meta+click', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0, metaKey: true });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('does not drag on ctrl+click', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0, ctrlKey: true });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('does not drag containers themselves', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(div, 'pointerdown', { button: 0 });
    raise(div, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('respects moves option returning false', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div], { moves: () => false });
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('respects invalid option returning true', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div], { invalid: () => true });
    let dragEmitted = false;

    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);

    drake.destroy();
    div.remove();
  });

  it('adds ad-transit class when dragging', () => {
    const item = createItem();
    const div = createContainer(item);
    alugard([div]);

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(item.classList.contains('ad-transit')).toBe(true);

    div.remove();
  });
});
