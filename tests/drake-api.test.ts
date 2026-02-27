import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';

describe('Drake API', () => {
  it('can be instantiated without throwing', () => {
    expect(() => alugard()).not.toThrow();
  });

  it('has expected API properties', () => {
    const drake = alugard();
    expect(drake).toBeTruthy();
    expect(typeof drake).toBe('object');
    expect(Array.isArray(drake.containers)).toBe(true);
    expect(typeof drake.start).toBe('function');
    expect(typeof drake.end).toBe('function');
    expect(typeof drake.cancel).toBe('function');
    expect(typeof drake.remove).toBe('function');
    expect(typeof drake.destroy).toBe('function');
    expect(typeof drake.canMove).toBe('function');
    expect(typeof drake.dragging).toBe('boolean');
    expect(drake.dragging).toBe(false);
  });

  it('has event methods', () => {
    const drake = alugard();
    expect(typeof drake.on).toBe('function');
    expect(typeof drake.off).toBe('function');
    expect(typeof drake.emit).toBe('function');
  });

  it('on() returns drake for chaining', () => {
    const drake = alugard();
    const result = drake.on('drag', () => {});
    expect(result).toBe(drake);
  });
});
