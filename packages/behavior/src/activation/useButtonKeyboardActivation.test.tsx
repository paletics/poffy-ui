import { act, renderHook } from '@testing-library/react';
import type { FocusEvent, KeyboardEvent, KeyboardEventHandler } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useButtonKeyboardActivation } from './useButtonKeyboardActivation';

const createTarget = (tagName = 'DIV') => ({ tagName, click: vi.fn() }) as unknown as HTMLElement;

const createKeyboardEvent = (
  target: HTMLElement,
  { code = '', key, repeat = false }: { code?: string; key: string; repeat?: boolean },
) => {
  const event = {
    code,
    currentTarget: target,
    defaultPrevented: false,
    key,
    preventDefault: vi.fn(() => {
      event.defaultPrevented = true;
    }),
    repeat,
  };
  return event as unknown as KeyboardEvent<HTMLElement>;
};

const createBlurEvent = (target: HTMLElement) =>
  ({ currentTarget: target }) as FocusEvent<HTMLElement>;

describe('useButtonKeyboardActivation', () => {
  it('activates Enter once on non-repeated keydown after the consumer handler', () => {
    const target = createTarget();
    const order: string[] = [];
    (target.click as ReturnType<typeof vi.fn>).mockImplementation(() => order.push('click'));
    const onKeyDown: KeyboardEventHandler<HTMLElement> = () => order.push('consumer');
    const { result } = renderHook(() => useButtonKeyboardActivation({ enabled: true, onKeyDown }));
    const event = createKeyboardEvent(target, { key: 'Enter' });

    act(() => result.current.onKeyDown(event));

    expect(order).toEqual(['consumer', 'click']);
    expect(event.preventDefault).toHaveBeenCalledOnce();
  });

  it('does not activate repeated or consumer-vetoed Enter keydowns', () => {
    const target = createTarget();
    const { result, rerender } = renderHook(
      ({ veto }: { veto: boolean }) =>
        useButtonKeyboardActivation({
          enabled: true,
          onKeyDown: veto ? (event) => event.preventDefault() : undefined,
        }),
      { initialProps: { veto: false } },
    );

    act(() =>
      result.current.onKeyDown(createKeyboardEvent(target, { key: 'Enter', repeat: true })),
    );
    rerender({ veto: true });
    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: 'Enter' })));

    expect(target.click).not.toHaveBeenCalled();
  });

  it.each([
    { code: 'Space', key: ' ' },
    { code: 'Space', key: 'Unidentified' },
  ])('activates normalized Space on matching keyup: $key/$code', ({ code, key }) => {
    const target = createTarget();
    const { result } = renderHook(() => useButtonKeyboardActivation({ enabled: true }));
    const down = createKeyboardEvent(target, { code, key });
    const up = createKeyboardEvent(target, { code, key });

    act(() => result.current.onKeyDown(down));
    expect(target.click).not.toHaveBeenCalled();
    act(() => result.current.onKeyUp(up));

    expect(target.click).toHaveBeenCalledOnce();
    expect(down.preventDefault).toHaveBeenCalledOnce();
    expect(up.preventDefault).toHaveBeenCalledOnce();
  });

  it('preserves a valid Space arm across repeated keydown events', () => {
    const target = createTarget();
    const { result } = renderHook(() => useButtonKeyboardActivation({ enabled: true }));

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ', repeat: true })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));

    expect(target.click).toHaveBeenCalledOnce();
  });

  it('does not arm Space from a repeat or consumer-vetoed keydown', () => {
    const target = createTarget();
    const { result, rerender } = renderHook(
      ({ veto }: { veto: boolean }) =>
        useButtonKeyboardActivation({
          enabled: true,
          onKeyDown: veto ? (event) => event.preventDefault() : undefined,
        }),
      { initialProps: { veto: false } },
    );

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ', repeat: true })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));
    rerender({ veto: true });
    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));

    expect(target.click).not.toHaveBeenCalled();
  });

  it('lets a consumer veto matching Space keyup and consumes the arm', () => {
    const target = createTarget();
    const { result, rerender } = renderHook(
      ({ veto }: { veto: boolean }) =>
        useButtonKeyboardActivation({
          enabled: true,
          onKeyUp: veto ? (event) => event.preventDefault() : undefined,
        }),
      { initialProps: { veto: true } },
    );

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));
    rerender({ veto: false });
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));

    expect(target.click).not.toHaveBeenCalled();
  });

  it('does not activate repeated Space keyup and consumes the arm', () => {
    const target = createTarget();
    const { result } = renderHook(() => useButtonKeyboardActivation({ enabled: true }));

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ', repeat: true })));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));

    expect(target.click).not.toHaveBeenCalled();
  });

  it('does not activate standalone or target-mismatched Space keyup', () => {
    const first = createTarget();
    const second = createTarget();
    const { result } = renderHook(() => useButtonKeyboardActivation({ enabled: true }));

    act(() => result.current.onKeyUp(createKeyboardEvent(first, { key: ' ' })));
    act(() => result.current.onKeyDown(createKeyboardEvent(first, { key: ' ' })));
    act(() => result.current.onKeyUp(createKeyboardEvent(second, { key: ' ' })));
    act(() => result.current.onKeyUp(createKeyboardEvent(first, { key: ' ' })));

    expect(first.click).not.toHaveBeenCalled();
    expect(second.click).not.toHaveBeenCalled();
  });

  it('clears a Space arm on blur, disable, and unmount', () => {
    const target = createTarget();
    const onBlur = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ enabled }: { enabled: boolean }) => useButtonKeyboardActivation({ enabled, onBlur }),
      { initialProps: { enabled: true } },
    );

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onBlur(createBlurEvent(target)));
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));
    expect(onBlur).toHaveBeenCalledOnce();

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    rerender({ enabled: false });
    act(() => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' })));

    rerender({ enabled: true });
    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    const staleKeyUp = result.current.onKeyUp;
    unmount();
    act(() => staleKeyUp(createKeyboardEvent(target, { key: ' ' })));

    expect(target.click).not.toHaveBeenCalled();
  });

  it('clears a Space arm before invoking the blur consumer', () => {
    const target = createTarget();
    let replayKeyUp: () => void = () => undefined;
    const { result } = renderHook(() =>
      useButtonKeyboardActivation({
        enabled: true,
        onBlur: () => replayKeyUp(),
      }),
    );
    replayKeyUp = () => result.current.onKeyUp(createKeyboardEvent(target, { key: ' ' }));

    act(() => result.current.onKeyDown(createKeyboardEvent(target, { key: ' ' })));
    act(() => result.current.onBlur(createBlurEvent(target)));

    expect(target.click).not.toHaveBeenCalled();
  });

  it('only forwards handlers while disabled and never synthesizes native button clicks', () => {
    const passiveTarget = createTarget();
    const buttonTarget = createTarget('BUTTON');
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useButtonKeyboardActivation({ enabled, onKeyDown, onKeyUp }),
      { initialProps: { enabled: false } },
    );

    act(() => result.current.onKeyDown(createKeyboardEvent(passiveTarget, { key: 'Enter' })));
    rerender({ enabled: true });
    act(() => result.current.onKeyDown(createKeyboardEvent(buttonTarget, { key: 'Enter' })));

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(passiveTarget.click).not.toHaveBeenCalled();
    expect(buttonTarget.click).not.toHaveBeenCalled();
  });
});
