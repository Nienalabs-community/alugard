import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';
import { raise, createContainer, createItem } from './setup';

describe('Destroy', () => {
  it('removes event listeners on destroy', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);

    drake.destroy();

    let dragEmitted = false;
    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(false);
    expect(drake.dragging).toBe(false);

    div.remove();
  });

  it('can be called multiple times safely', () => {
    const drake = alugard();
    expect(() => {
      drake.destroy();
      drake.destroy();
    }).not.toThrow();
  });
});

describe('Containers', () => {
  it('containers can be pushed dynamically', () => {
    const drake = alugard();
    const div = document.createElement('div');
    drake.containers.push(div);
    expect(drake.containers).toHaveLength(1);
    expect(drake.containers[0]).toBe(div);
    drake.destroy();
  });

  it('respects isContainer option', () => {
    const item = createItem();
    const div = document.createElement('div');
    div.classList.add('custom-container');
    div.appendChild(item);
    document.body.appendChild(div);

    const drake = alugard([], {
      isContainer: (el) => el.classList.contains('custom-container'),
    });

    let dragEmitted = false;
    drake.on('drag', () => { dragEmitted = true; });

    raise(item, 'pointerdown', { button: 0 });
    raise(item, 'pointermove', { buttons: 1 });

    expect(dragEmitted).toBe(true);

    drake.destroy();
    div.remove();
  });
});

describe('canMove', () => {
  it('returns true for valid draggable items', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div]);

    expect(drake.canMove(item)).toBe(true);

    drake.destroy();
    div.remove();
  });

  it('returns false for items not in containers', () => {
    const item = createItem();
    document.body.appendChild(item);
    const drake = alugard();

    expect(drake.canMove(item)).toBe(false);

    drake.destroy();
    item.remove();
  });

  it('returns false when moves returns false', () => {
    const item = createItem();
    const div = createContainer(item);
    const drake = alugard([div], { moves: () => false });

    expect(drake.canMove(item)).toBe(false);

    drake.destroy();
    div.remove();
  });
});
