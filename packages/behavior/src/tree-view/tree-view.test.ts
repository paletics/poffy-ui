import { describe, expect, it } from 'vitest';
import { getTreeViewKeyboardIntent } from './tree-view';

describe('getTreeViewKeyboardIntent', () => {
  const resolve = (key: string, overrides = {}) =>
    getTreeViewKeyboardIntent({
      hasChildren: true,
      isExpanded: false,
      isRtl: false,
      isSelectable: false,
      key,
      ...overrides,
    });

  it('maps linear navigation keys', () => {
    expect(resolve('ArrowDown')).toBe('next');
    expect(resolve('ArrowUp')).toBe('previous');
    expect(resolve('Home')).toBe('first');
    expect(resolve('End')).toBe('last');
  });

  it('maps directional expansion and parent intents in both directions', () => {
    expect(resolve('ArrowRight')).toBe('expand');
    expect(resolve('ArrowRight', { isExpanded: true })).toBe('child');
    expect(resolve('ArrowLeft', { isExpanded: true })).toBe('collapse');
    expect(resolve('ArrowLeft')).toBe('parent');
    expect(resolve('ArrowLeft', { isRtl: true })).toBe('expand');
    expect(resolve('ArrowRight', { isRtl: true })).toBe('parent');
  });

  it('prioritizes checkbox selection for Space', () => {
    expect(resolve(' ', { isSelectable: true })).toBe('select');
    expect(resolve(' ')).toBe('toggle');
    expect(resolve('Enter')).toBe('toggle');
  });
});
