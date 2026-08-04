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

const twoColumns: WheelPickerColumn[] = [
  columns[0]!,
  {
    id: 'hour',
    label: 'Hour',
    options: [
      { value: '10', label: '10' },
      { value: '11', label: '11' },
    ],
  },
];

interface HookProps {
  columns?: WheelPickerColumn[];
  disabled?: boolean;
  layoutKey?: string;
  readOnly?: boolean;
  selectedValue: WheelPickerValue;
}

const renderScrollHook = ({
  columns: initialColumns,
  disabled = false,
  layoutKey = 'md',
  readOnly = false,
  selectedValue,
}: HookProps) => {
  const commitValue = vi.fn();
  const hook = renderHook(
    (props: HookProps) =>
      useWheelPickerScroll({
        columns: props.columns ?? columns,
        commitValue: (columnId, nextOptionValue) => commitValue(columnId, nextOptionValue),
        disabled: props.disabled ?? false,
        layoutKey: props.layoutKey ?? 'md',
        readOnly: props.readOnly ?? false,
        selectedValue: props.selectedValue,
      }),
    {
      initialProps: {
        columns: initialColumns,
        disabled,
        layoutKey,
        readOnly,
        selectedValue,
      },
    },
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
    result.current.setOptionRef('minute', '30', selectedOption);
    rerender({ selectedValue: { minute: '30' } });

    expect(viewport.scrollTop).toBe(90);
  });

  it('recenters when the internal layout key changes without changing selection', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const { rerender, result } = renderScrollHook({
      layoutKey: 'sm',
      selectedValue: { minute: '30' },
    });
    const viewport = createViewport();
    let viewportHeight = 90;
    let optionHeight = 30;
    let optionOffsetTop = 120;
    Object.defineProperty(viewport, 'clientHeight', {
      configurable: true,
      get: () => viewportHeight,
    });
    const selectedOption = createOption({ offsetTop: optionOffsetTop, top: 0 });
    Object.defineProperty(selectedOption, 'offsetHeight', {
      configurable: true,
      get: () => optionHeight,
    });
    Object.defineProperty(selectedOption, 'offsetTop', {
      configurable: true,
      get: () => optionOffsetTop,
    });
    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute', '30', selectedOption);

    viewportHeight = 150;
    optionHeight = 50;
    optionOffsetTop = 200;
    rerender({ layoutKey: 'lg', selectedValue: { minute: '30' } });

    expect(viewport.scrollTop).toBe(150);
  });

  it('coalesces owner-realm resize observations and disconnects on unmount', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;
    if (!frameDocument || !frameWindow)
      throw new Error('The test environment did not create an iframe realm.');

    let resizeCallback: ResizeObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    class OwnerResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }
      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    Object.defineProperty(frameWindow, 'ResizeObserver', {
      configurable: true,
      value: OwnerResizeObserver,
    });

    let frameId = 0;
    const frameCallbacks = new Map<number, FrameRequestCallback>();
    const requestAnimationFrame = vi
      .spyOn(frameWindow, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        frameId += 1;
        frameCallbacks.set(frameId, callback);
        return frameId;
      });
    vi.spyOn(frameWindow, 'cancelAnimationFrame').mockImplementation((id) => {
      frameCallbacks.delete(id);
    });
    const flushFrames = () => {
      const pending = [...frameCallbacks.entries()];
      frameCallbacks.clear();
      pending.forEach(([, callback]) => callback(0));
    };

    const { result, unmount } = renderScrollHook({ selectedValue: { minute: '30' } });
    const viewport = frameDocument.createElement('div');
    const selectedOption = frameDocument.createElement('div');
    let viewportHeight = 90;
    let optionHeight = 30;
    let optionOffsetTop = 120;
    Object.defineProperty(viewport, 'clientHeight', {
      configurable: true,
      get: () => viewportHeight,
    });
    Object.defineProperty(selectedOption, 'offsetHeight', {
      configurable: true,
      get: () => optionHeight,
    });
    Object.defineProperty(selectedOption, 'offsetTop', {
      configurable: true,
      get: () => optionOffsetTop,
    });

    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute', '30', selectedOption);
    expect(observe).toHaveBeenCalledWith(viewport);
    expect(observe).toHaveBeenCalledWith(selectedOption);
    flushFrames();
    flushFrames();
    requestAnimationFrame.mockClear();

    viewportHeight = 150;
    optionHeight = 50;
    optionOffsetTop = 200;
    resizeCallback?.([], {} as ResizeObserver);
    resizeCallback?.([], {} as ResizeObserver);
    expect(requestAnimationFrame).toHaveBeenCalledOnce();
    flushFrames();

    expect(viewport.scrollTop).toBe(150);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    frame.remove();
  });

  it('uses the viewport owner window for programmatic scroll frames', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;
    if (!frameDocument || !frameWindow)
      throw new Error('The test environment did not create an iframe realm.');

    const topRequestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const frameRequestAnimationFrame = vi
      .spyOn(frameWindow, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const { rerender, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = frameDocument.createElement('div');
    const selectedOption = frameDocument.createElement('div');
    Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 90 });
    Object.defineProperty(selectedOption, 'offsetHeight', { configurable: true, value: 30 });
    Object.defineProperty(selectedOption, 'offsetTop', { configurable: true, value: 120 });

    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute', '30', selectedOption);
    topRequestAnimationFrame.mockClear();
    frameRequestAnimationFrame.mockClear();
    rerender({ selectedValue: { minute: '30' } });

    expect(frameRequestAnimationFrame).toHaveBeenCalledOnce();
    expect(topRequestAnimationFrame).not.toHaveBeenCalled();
    frame.remove();
  });

  it('ignores scroll events caused by internal centering', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const { commitValue, rerender, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();
    const selectedOption = createOption({ offsetTop: 120, top: 0 });

    result.current.setViewportRef('minute', viewport);
    result.current.setOptionRef('minute', '30', selectedOption);
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

    result.current.setOptionRef('minute', '0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute', '15', createOption({ offsetTop: 30, top: 30 }));
    result.current.setOptionRef('minute', '30', createOption({ offsetTop: 60, top: 30 }));

    act(() => {
      result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(180);
    });

    expect(commitValue).toHaveBeenCalledWith('minute', '30');
  });

  it('preserves a pending commit across fresh semantically equal props before 180ms', () => {
    vi.useFakeTimers();
    const { commitValue, rerender, result } = renderScrollHook({
      selectedValue: { minute: '0' },
    });
    const viewport = createViewport();

    result.current.setOptionRef('minute', '0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute', '30', createOption({ offsetTop: 60, top: 30 }));

    act(() => {
      result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(100);
    });
    rerender({
      columns: columns.map((column) => ({
        ...column,
        options: column.options.map((option) => ({ ...option })),
      })),
      selectedValue: { minute: '0' },
    });
    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(commitValue).toHaveBeenCalledOnce();
    expect(commitValue).toHaveBeenCalledWith('minute', '30');
  });

  it('preserves another column pending commit when one selection changes', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    const { commitValue, rerender, result } = renderScrollHook({
      columns: twoColumns,
      selectedValue: { hour: '10', minute: '0' },
    });
    const minuteViewport = createViewport();
    const hourViewport = createViewport();

    result.current.setViewportRef('minute', minuteViewport);
    result.current.setOptionRef('minute', '0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute', '30', createOption({ offsetTop: 60, top: 30 }));
    result.current.setViewportRef('hour', hourViewport);
    result.current.setOptionRef('hour', '10', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('hour', '11', createOption({ offsetTop: 60, top: 30 }));

    act(() => {
      result.current.handleScroll({ currentTarget: minuteViewport } as never, 'minute');
      result.current.handleScroll({ currentTarget: hourViewport } as never, 'hour');
      vi.advanceTimersByTime(100);
    });
    rerender({
      columns: twoColumns,
      selectedValue: { hour: '11', minute: '0' },
    });
    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(commitValue).toHaveBeenCalledOnce();
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

  it('does not commit while the viewport is not measurable', () => {
    vi.useFakeTimers();
    const { commitValue, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();
    viewport.getBoundingClientRect = () => createRect({ height: 0, top: 0 });

    result.current.setOptionRef('minute', '0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute', '30', createOption({ offsetTop: 60, top: 30 }));

    act(() => {
      result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
      vi.advanceTimersByTime(180);
    });

    expect(commitValue).not.toHaveBeenCalled();
  });

  it('cancels a pending scroll commit when it becomes disabled', () => {
    vi.useFakeTimers();
    const { commitValue, rerender, result } = renderScrollHook({ selectedValue: { minute: '0' } });
    const viewport = createViewport();

    result.current.setOptionRef('minute', '0', createOption({ offsetTop: 0, top: 0 }));
    result.current.setOptionRef('minute', '30', createOption({ offsetTop: 60, top: 30 }));
    result.current.handleScroll({ currentTarget: viewport } as never, 'minute');
    rerender({ disabled: true, selectedValue: { minute: '0' } });

    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(commitValue).not.toHaveBeenCalled();
  });
});
