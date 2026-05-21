import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WheelPickerColumn, WheelPickerValue } from './WheelPicker.types';
import { useWheelPickerScroll } from './useWheelPickerScroll';

const columns: WheelPickerColumn[] = [
  {
    id: 'minute',
    label: 'Minute',
    options: [
      { value: '0', label: '00' },
      { value: '15', label: '15', disabled: true },
      { value: '30', label: '30' },
    ],
  },
];

interface HookProps {
  disabled?: boolean;
  readOnly?: boolean;
  selectedValue: WheelPickerValue;
}

const renderScrollHook = ({ disabled = false, readOnly = false, selectedValue }: HookProps) => {
  const commitValue = vi.fn();
  const hook = renderHook(
    (props: HookProps) =>
      useWheelPickerScroll({
        columns,
        commitValue,
        disabled: props.disabled ?? false,
        readOnly: props.readOnly ?? false,
        selectedValue: props.selectedValue,
      }),
    { initialProps: { disabled, readOnly, selectedValue } },
  );

  return { commitValue, ...hook };
};

const createViewport = () => {
  const viewport = document.createElement('div');
  Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 90 });
  viewport.getBoundingClientRect = () => createRect({ height: 90, top: 0 });
  return viewport;
};

const createOption = ({
  height = 30,
  offsetTop,
  top,
}: {
  height?: number;
  offsetTop: number;
  top: number;
}) => {
  const option = document.createElement('div');
  Object.defineProperty(option, 'offsetHeight', { configurable: true, value: height });
  Object.defineProperty(option, 'offsetTop', { configurable: true, value: offsetTop });
  option.getBoundingClientRect = () => createRect({ height, top });
  return option;
};

const createRect = ({ height, top }: { height: number; top: number }) =>
  ({
    bottom: top + height,
    height,
    left: 0,
    right: 0,
    toJSON: () => undefined,
    top,
    width: 0,
    x: 0,
    y: top,
  }) as DOMRect;

/**
 * ### Test Strategy: useWheelPickerScroll
 * - **Focus**: Selected-option centering, native-scroll commit debounce,
 *   programmatic-scroll guard, and disabled/read-only no-op behavior.
 * - **DON'T**: Do not rely on jsdom layout; explicitly mock offset and rect values.
 */
describe('useWheelPickerScroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('centers the selected option when the selected value changes', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const { rerender, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();
    const selectedOption = createOption({ offsetTop: 120, top: 0 });

    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute:30', selectedOption);
    rerender({ selectedValue: { minute: '30' } });

    expect(viewport.scrollTop).toBe(90);
  });

  it('ignores scroll events caused by internal centering', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const { commitValue, rerender, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();
    const selectedOption = createOption({ offsetTop: 120, top: 0 });

    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute:30', selectedOption);
    rerender({ selectedValue: { minute: '30' } });

    act(() => {
      result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(180);
    });

    expect(commitValue).not.toHaveBeenCalled();
  });

  it('commits the nearest enabled option after native scrolling stops', () => {
    vi.useFakeTimers();
    const { commitValue, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();

    result.current.setOptionRef('minute:0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute:15', createOption({ offsetTop: 30, top: 30 }));
    result.current.setOptionRef('minute:30', createOption({ offsetTop: 60, top: 30 }));

    act(() => {
      result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(180);
    });

    expect(commitValue).toHaveBeenCalledWith('minute', '30');
  });

  it('does not commit scroll changes while disabled or read-only', () => {
    vi.useFakeTimers();
    const disabled = renderScrollHook({ disabled: true, selectedValue: { minute: '0' } });
    const readOnly = renderScrollHook({ readOnly: true, selectedValue: { minute: '0' } });
    const viewport = createViewport();

    act(() => {
      disabled.result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      readOnly.result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(180);
    });

    expect(disabled.commitValue).not.toHaveBeenCalled();
    expect(readOnly.commitValue).not.toHaveBeenCalled();
  });
});
