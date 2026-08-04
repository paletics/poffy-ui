import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { handleHorizontalOverflowKeyDown } from './handleHorizontalOverflowKeyDown';

describe('handleHorizontalOverflowKeyDown', () => {
  const renderOverflowOwner = (onKeyDown = handleHorizontalOverflowKeyDown) => {
    render(
      <button type="button" aria-label="Source" onKeyDown={onKeyDown}>
        Source
      </button>,
    );
    const owner = screen.getByLabelText('Source');
    const scrollBy = vi.fn();
    Object.defineProperties(owner, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
    });
    Object.defineProperty(owner, 'scrollBy', { configurable: true, value: scrollBy });
    return { owner, scrollBy };
  };

  it('scrolls a focused overflow owner with horizontal navigation keys', () => {
    const { owner, scrollBy } = renderOverflowOwner();

    fireEvent.keyDown(owner, { key: 'ArrowRight' });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 160, behavior: 'auto' });

    fireEvent.keyDown(owner, { key: 'End' });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 600, behavior: 'auto' });
  });

  it('does not intercept modified keys or child controls', () => {
    const { owner, scrollBy } = renderOverflowOwner();
    const child = document.createElement('button');
    owner.append(child);

    fireEvent.keyDown(owner, { key: 'ArrowRight', ctrlKey: true });
    fireEvent.keyDown(child, { key: 'ArrowRight' });
    expect(scrollBy).not.toHaveBeenCalled();
  });
});
