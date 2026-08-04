import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createDisabledActivationHandlers } from './createDisabledActivationHandlers';

const createKeyboardEvent = (key: string, code = '') =>
  ({
    key,
    code,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }) as unknown as KeyboardEvent<HTMLElement>;

const createPointerEvent = () =>
  ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }) as unknown as PointerEvent<HTMLElement>;

describe('createDisabledActivationHandlers', () => {
  it('blocks mouse and pointer activation in every phase while disabled', () => {
    const originalClick = vi.fn();
    const handlers = createDisabledActivationHandlers(true, {
      onAuxClick: originalClick,
      onClick: originalClick,
      onPointerDown: originalClick,
    });
    const events = [
      ['onAuxClick', createPointerEvent() as unknown as MouseEvent<HTMLElement>],
      ['onAuxClickCapture', createPointerEvent() as unknown as MouseEvent<HTMLElement>],
      ['onClick', createPointerEvent() as unknown as MouseEvent<HTMLElement>],
      ['onClickCapture', createPointerEvent() as unknown as MouseEvent<HTMLElement>],
      ['onPointerDown', createPointerEvent()],
      ['onPointerDownCapture', createPointerEvent()],
      ['onPointerUp', createPointerEvent()],
      ['onPointerUpCapture', createPointerEvent()],
    ] as const;

    for (const [name, event] of events) {
      handlers[name](event as never);
    }

    expect(originalClick).not.toHaveBeenCalled();
    for (const [, event] of events) {
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(event.stopPropagation).toHaveBeenCalledOnce();
    }
  });

  it('blocks activation keys but preserves other keyboard handlers', () => {
    const original = vi.fn();
    const handlers = createDisabledActivationHandlers(true, { onKeyDown: original });
    const enter = createKeyboardEvent('Enter');
    const space = createKeyboardEvent(' ', 'Space');
    const tab = createKeyboardEvent('Tab');

    handlers.onKeyDown(enter);
    handlers.onKeyDown(space);
    handlers.onKeyDown(tab);

    expect(original).toHaveBeenCalledOnce();
    expect(original).toHaveBeenCalledWith(tab);
    expect(enter.preventDefault).toHaveBeenCalledOnce();
    expect(space.preventDefault).toHaveBeenCalledOnce();
    expect(tab.preventDefault).not.toHaveBeenCalled();
  });

  it('forwards every handler while enabled', () => {
    const onClick = vi.fn();
    const onKeyUp = vi.fn();
    const handlers = createDisabledActivationHandlers(false, { onClick, onKeyUp });
    const click = createPointerEvent() as unknown as MouseEvent<HTMLElement>;
    const keyUp = createKeyboardEvent('Enter');

    handlers.onClick(click);
    handlers.onKeyUp(keyUp);

    expect(onClick).toHaveBeenCalledWith(click);
    expect(onKeyUp).toHaveBeenCalledWith(keyUp);
    expect(handlers.onClick).toBe(onClick);
    expect(handlers.onKeyUp).toBe(onKeyUp);
    expect(handlers.onAuxClick).toBe(createDisabledActivationHandlers(false).onAuxClick);
  });

  it('blocks code-only Space activation on every keyboard channel', () => {
    const original = vi.fn();
    const handlers = createDisabledActivationHandlers(true, {
      onKeyDown: original,
      onKeyDownCapture: original,
      onKeyUp: original,
      onKeyUpCapture: original,
    });

    for (const name of ['onKeyDown', 'onKeyDownCapture', 'onKeyUp', 'onKeyUpCapture'] as const) {
      const event = createKeyboardEvent('Unidentified', 'Space');
      handlers[name](event);
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(event.stopPropagation).toHaveBeenCalledOnce();
    }
    expect(original).not.toHaveBeenCalled();
  });
});
