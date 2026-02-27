import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';
import { raise, createContainer, createItem } from './setup';

describe('Events', () => {
  it('.start() emits "drag" for items', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let emitted = false;

    drake.on('drag', (el, source) => {
      expect(el).toBe(item);
      expect(source).toBe(div);
      emitted = true;
    });

    drake.start(item);
    expect(emitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('.start() emits "cloned" for copies', () => {
    const item = createItem('<em>test</em>');
    const div = createContainer(item);
    const drake = alugard([div], { copy: true });
    let emitted = false;

    drake.on('cloned', (copy, original, type) => {
      if (type === 'copy') {
        expect(copy).not.toBe(item);
        expect(copy.nodeType).toBe(item.nodeType);
        expect(original).toBe(item);
        emitted = true;
      }
    });

    drake.start(item);
    expect(emitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('.end() emits "cancel" when not moved', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let cancelEmitted = false;
    let dragendEmitted = false;

    drake.on('cancel', (el, container) => {
      expect(el).toBe(item);
      expect(container).toBe(div);
      cancelEmitted = true;
    });

    drake.on('dragend', (el) => {
      expect(el).toBe(item);
      dragendEmitted = true;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });
    drake.end();

    expect(cancelEmitted).toBe(true);
    expect(dragendEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('.end() emits "drop" when moved', () => {
    const item = createItem();
    const div = createContainer(item);
    const div2 = document.createElement('div');
    document.body.appendChild(div2);
    const drake = alugard([div, div2]);
    let dropEmitted = false;

    drake.on('drop', (el, target, source) => {
      expect(el).toBe(item);
      expect(target).toBe(div2);
      expect(source).toBe(div);
      dropEmitted = true;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });
    div2.appendChild(item);
    drake.end();

    expect(dropEmitted).toBe(true);

    drake.destroy();
    div.remove();
    div2.remove();
  });

  it('.remove() emits "remove" for items', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let removeEmitted = false;

    drake.on('remove', (el) => {
      expect(el).toBe(item);
      removeEmitted = true;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });
    drake.remove();

    expect(removeEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('.remove() emits "cancel" for copies', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div], { copy: true });
    let cancelEmitted = false;

    drake.on('cancel', () => {
      cancelEmitted = true;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });
    drake.remove();

    expect(cancelEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('.cancel() emits "cancel" when not moved', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);
    let cancelEmitted = false;

    drake.on('cancel', (el, container) => {
      expect(el).toBe(item);
      expect(container).toBe(div);
      cancelEmitted = true;
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });
    drake.cancel();

    expect(cancelEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('pointerdown emits "cloned" for mirrors', () => {
    const item = createItem('<em>test</em>');
    const div = createContainer(item);
    const drake = alugard([div]);
    let mirrorClonedEmitted = false;

    drake.on('cloned', (copy, original, type) => {
      if (type === 'mirror') {
        expect(copy).not.toBe(item);
        expect(copy.nodeType).toBe(item.nodeType);
        expect(original).toBe(item);
        mirrorClonedEmitted = true;
      }
    });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(mirrorClonedEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });
});
