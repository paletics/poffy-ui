'use client';

import { getTimeClockValueFromPoint } from '@poffy-ui/behavior/time';
import { useRef, type PointerEvent } from 'react';
import type { TimeClockUnit } from './TimeClock.types';

interface UseTimeClockPointerOptions {
  activeUnit: TimeClockUnit;
  disabled: boolean;
  onSelect: (value: number) => void;
  readOnly: boolean;
}

/**
 * Handles pointer drag selection for the TimeClock dial.
 */
export const useTimeClockPointer = ({
  activeUnit,
  disabled,
  onSelect,
  readOnly,
}: UseTimeClockPointerOptions) => {
  const draggingPointerIdRef = useRef<number | null>(null);
  const suppressNextOptionClickRef = useRef(false);

  const selectFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    onSelect(
      getTimeClockValueFromPoint(
        event.currentTarget.getBoundingClientRect(),
        event.clientX,
        event.clientY,
        activeUnit,
      ),
    );
  };

  const handleDialPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || readOnly) return;

    const target = event.target as HTMLElement;
    if (target.closest('button') && event.clientX === 0 && event.clientY === 0) return;

    suppressNextOptionClickRef.current = Boolean(target.closest('button'));
    draggingPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
    selectFromPointer(event);
  };

  const handleDialPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingPointerIdRef.current !== event.pointerId || disabled || readOnly) return;

    event.preventDefault();
    event.stopPropagation();
    selectFromPointer(event);
  };

  const handleDialPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingPointerIdRef.current !== event.pointerId) return;

    draggingPointerIdRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const shouldSuppressOptionClick = () => {
    if (!suppressNextOptionClickRef.current) return false;

    suppressNextOptionClickRef.current = false;
    return true;
  };

  return {
    dialPointerProps: {
      onPointerCancel: handleDialPointerEnd,
      onPointerDownCapture: handleDialPointerDown,
      onPointerMove: handleDialPointerMove,
      onPointerUp: handleDialPointerEnd,
    },
    shouldSuppressOptionClick,
  };
};
