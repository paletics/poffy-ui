import { describe, expect, it, vi } from 'vitest';
import { scrollIntoInlineView } from './scrollIntoInlineView';

const rect = (left: number, right: number): DOMRect =>
  ({
    bottom: 40,
    height: 40,
    left,
    right,
    top: 0,
    width: right - left,
    x: left,
    y: 0,
    toJSON: () => ({}),
  }) as DOMRect;

describe('scrollIntoInlineView', () => {
  it('scrolls only by the horizontal amount needed at the inline end', () => {
    const container = document.createElement('div');
    const target = document.createElement('button');
    const scrollBy = vi.fn();
    container.scrollBy = scrollBy;
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect(10, 210));
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(190, 250));

    scrollIntoInlineView(container, target, 4);

    expect(scrollBy).toHaveBeenCalledWith({ left: 44, behavior: 'auto' });
  });

  it('scrolls toward the inline start when focus moves backward', () => {
    const container = document.createElement('div');
    const target = document.createElement('button');
    const scrollBy = vi.fn();
    container.scrollBy = scrollBy;
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect(10, 210));
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(-10, 30));

    scrollIntoInlineView(container, target, 4);

    expect(scrollBy).toHaveBeenCalledWith({ left: -24, behavior: 'auto' });
  });

  it('does not scroll a fully visible target', () => {
    const container = document.createElement('div');
    const target = document.createElement('button');
    const scrollBy = vi.fn();
    container.scrollBy = scrollBy;
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rect(10, 210));
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(20, 80));

    scrollIntoInlineView(container, target, 4);

    expect(scrollBy).not.toHaveBeenCalled();
  });
});
