import { describe, it, expect } from 'vitest';
import { alugard } from '../src/index';

describe('Public API', () => {
  it('alugard is a function', () => {
    expect(typeof alugard).toBe('function');
  });

  it('can be called without arguments', () => {
    expect(() => alugard()).not.toThrow();
  });

  it('returns a drake object', () => {
    const drake = alugard();
    expect(drake).toBeTruthy();
    expect(typeof drake).toBe('object');
  });
});
