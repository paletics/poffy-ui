import { act, renderHook } from '@testing-library/react';
import { StrictMode, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { CalendarProps, DateRange } from './Calendar.types';
import { useCalendarControlledSelection } from './useCalendarControlledSelection';

type CalendarMode = NonNullable<CalendarProps['mode']>;
type CalendarSelectionValue = Date | Date[] | DateRange | undefined;

interface HookProps {
  defaultValue?: CalendarSelectionValue;
  isControlled?: boolean;
  mode: CalendarMode;
  onSelect?: CalendarProps['onSelect'];
  selectedProp?: CalendarSelectionValue;
}

const useSelection = ({ defaultValue, isControlled, mode, onSelect, selectedProp }: HookProps) =>
  useCalendarControlledSelection({
    defaultValue,
    isControlled: isControlled ?? selectedProp !== undefined,
    mode,
    onSelect,
    selectedProp,
  });

const first = new Date(2026, 3, 10);
const latest = new Date(2026, 3, 14);

const controlledValues = {
  single: { first, latest },
  multiple: { first: [first], latest: [latest] },
  range: { first: { from: first }, latest: { from: first, to: latest } },
} satisfies Record<CalendarMode, { first: CalendarSelectionValue; latest: CalendarSelectionValue }>;

const modeTransitions = [
  ['single', 'multiple'],
  ['single', 'range'],
  ['multiple', 'single'],
  ['multiple', 'range'],
  ['range', 'single'],
  ['range', 'multiple'],
] as const;

const expectedEmptySelection = (mode: CalendarMode) => (mode === 'multiple' ? [] : undefined);

describe('useCalendarControlledSelection', () => {
  it.each(['single', 'multiple', 'range'] as const)(
    'keeps the latest controlled %s value when control is released in the same mode',
    (mode) => {
      const values = controlledValues[mode];
      const { result, rerender } = renderHook(useSelection, {
        initialProps: { mode, selectedProp: values.first } satisfies HookProps,
      });

      rerender({ mode, selectedProp: values.latest });
      rerender({ mode, selectedProp: undefined });

      expect(result.current.selected).toBe(values.latest);
    },
  );

  it.each(['single', 'multiple', 'range'] as const)(
    'treats an explicit undefined %s selection as controlled',
    (mode) => {
      const onSelect = vi.fn();
      const { result } = renderHook(useSelection, {
        initialProps: {
          defaultValue: controlledValues[mode].first,
          isControlled: true,
          mode,
          onSelect,
          selectedProp: undefined,
        } satisfies HookProps,
      });

      act(() => result.current.handleSelect(controlledValues[mode].latest));

      expect(result.current.selected).toBeUndefined();
      expect(onSelect).toHaveBeenCalledWith(controlledValues[mode].latest);

      act(() => result.current.resetSelection(controlledValues[mode].first));
      expect(result.current.selected).toBeUndefined();
    },
  );

  it.each(modeTransitions)(
    'resets an uncontrolled %s selection when mode changes to %s',
    (fromMode, toMode) => {
      const { result, rerender } = renderHook(useSelection, {
        initialProps: { mode: fromMode } satisfies HookProps,
      });

      act(() => result.current.handleSelect(controlledValues[fromMode].latest));
      rerender({ mode: toMode });

      expect(result.current.selected).toEqual(expectedEmptySelection(toMode));
    },
  );

  it.each(modeTransitions)(
    'resets instead of handing off when controlled %s changes to uncontrolled %s',
    (fromMode, toMode) => {
      const { result, rerender } = renderHook(useSelection, {
        initialProps: {
          mode: fromMode,
          selectedProp: controlledValues[fromMode].latest,
        } satisfies HookProps,
      });

      rerender({ mode: toMode, selectedProp: undefined });

      expect(result.current.selected).toEqual(expectedEmptySelection(toMode));
    },
  );

  it('uses a supplied controlled value when mode changes', () => {
    const { result, rerender } = renderHook(useSelection, {
      initialProps: { mode: 'single', selectedProp: first } satisfies HookProps,
    });
    const multipleSelection = [latest];

    rerender({ mode: 'multiple', selectedProp: multipleSelection });

    expect(result.current.selected).toBe(multipleSelection);
  });

  it('ignores same-mode default changes but uses the latest default after a mode change', () => {
    const { result, rerender } = renderHook(useSelection, {
      initialProps: { mode: 'single', defaultValue: first } satisfies HookProps,
    });

    act(() => result.current.handleSelect(latest));
    const nextModeDefault = [first];
    rerender({ mode: 'single', defaultValue: nextModeDefault });
    expect(result.current.selected).toBe(latest);

    rerender({ mode: 'multiple', defaultValue: nextModeDefault });
    expect(result.current.selected).toBe(nextModeDefault);
  });

  it('keeps selection callbacks mode-local and resets only uncontrolled state', () => {
    const onSelect = vi.fn();
    const { result, rerender } = renderHook(useSelection, {
      initialProps: { mode: 'single', onSelect } satisfies HookProps,
    });

    act(() => result.current.handleSelect(first));
    expect(result.current.selected).toBe(first);
    expect(onSelect).toHaveBeenCalledWith(first);

    act(() => result.current.resetSelection(latest));
    expect(result.current.selected).toBe(latest);

    rerender({ mode: 'single', onSelect, selectedProp: first });
    act(() => result.current.resetSelection(latest));
    expect(result.current.selected).toBe(first);
  });

  it('preserves same-mode release handoff in StrictMode', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>;
    const { result, rerender } = renderHook(useSelection, {
      initialProps: {
        mode: 'range',
        selectedProp: controlledValues.range.first,
      } satisfies HookProps,
      wrapper,
    });

    rerender({ mode: 'range', selectedProp: controlledValues.range.latest });
    rerender({ mode: 'range', selectedProp: undefined });

    expect(result.current.selected).toBe(controlledValues.range.latest);
  });
});
