import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';

describe('Default options', () => {
  it('initializes with empty containers array', () => {
    const drake = alugard();
    expect(drake.containers).toEqual([]);
  });

  it('accepts containers as first argument', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const drake = alugard([div1, div2]);
    expect(drake.containers).toHaveLength(2);
    expect(drake.containers[0]).toBe(div1);
    expect(drake.containers[1]).toBe(div2);
  });

  it('accepts options as only argument', () => {
    const drake = alugard({ direction: 'horizontal' });
    expect(drake.containers).toEqual([]);
  });

  it('dragging starts as false', () => {
    const drake = alugard();
    expect(drake.dragging).toBe(false);
  });
});
