import {
  createElement,
  isValidElement,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent,
  type MouseEventHandler,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { guardActivationHandlers } from './guardActivation';

describe('guardActivationHandlers', () => {
  it('leaves children unchanged when guarding is disabled', () => {
    const child = createElement('a', { href: '/test' }, 'Link');

    expect(
      guardActivationHandlers(child, false, {
        onClick: vi.fn(),
        onClickCapture: vi.fn(),
        onKeyDown: vi.fn(),
        onKeyDownCapture: vi.fn(),
      }),
    ).toBe(child);
  });

  it('replaces activation handlers when guarding is enabled', () => {
    const originalClick = vi.fn();
    const onClick = vi.fn();
    const onClickCapture = vi.fn();
    const onKeyDown = vi.fn();
    const onKeyDownCapture = vi.fn();
    const child = createElement('a', { href: '/test', onClick: originalClick }, 'Link');

    const guarded = guardActivationHandlers(child, true, {
      onClick,
      onClickCapture,
      onKeyDown,
      onKeyDownCapture,
    });

    expect(isValidElement(guarded)).toBe(true);
    if (!isValidElement(guarded)) return;
    const props = guarded.props as {
      onClick: MouseEventHandler<HTMLElement>;
      onClickCapture: MouseEventHandler<HTMLElement>;
      onKeyDown: KeyboardEventHandler<HTMLElement>;
      onKeyDownCapture: KeyboardEventHandler<HTMLElement>;
    };

    props.onClick({} as MouseEvent<HTMLElement>);
    props.onClickCapture({} as MouseEvent<HTMLElement>);
    props.onKeyDown({} as KeyboardEvent<HTMLElement>);
    props.onKeyDownCapture({} as KeyboardEvent<HTMLElement>);

    expect(originalClick).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClickCapture).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
  });
});
