'use client';

import {
  getTimeClockHourRingFromPoint,
  getTimeClockValueFromPoint,
  type TimeClockHourRing,
  type TimeFormat,
} from '@poffy-ui/behavior/time';
import { useCallback, useRef, type HTMLAttributes, type PointerEvent } from 'react';
import type { TimeClockUnit } from './TimeClock.types';

interface UseTimeClockPointerOptions {
  activeUnit: TimeClockUnit;
  format: TimeFormat;
  interactionBlocked: boolean;
  isInteractionBlockedNow: () => boolean;
  onCancel: () => void;
  onCommit: (value: number) => void;
  onPreview: (value: number) => void;
}

/**
 * Handles pointer drag selection for the TimeClock dial.
 */
export const useTimeClockPointer = ({
  activeUnit,
  format,
  interactionBlocked,
  isInteractionBlockedNow,
  onCancel,
  onCommit,
  onPreview,
}: UseTimeClockPointerOptions) => {
  const draggingPointerIdRef = useRef<number | null>(null);
  const pointerCaptureElementRef = useRef<HTMLDivElement | null>(null);
  const hourRingRef = useRef<TimeClockHourRing | undefined>(undefined);
  const suppressNextOptionClickRef = useRef(false);

  const cancelActivePointer = useCallback(() => {
    const pointerId = draggingPointerIdRef.current;
    const pointerCaptureElement = pointerCaptureElementRef.current;
    if (pointerId === null) return;

    draggingPointerIdRef.current = null;
    pointerCaptureElementRef.current = null;
    hourRingRef.current = undefined;
    suppressNextOptionClickRef.current = false;
    if (pointerCaptureElement?.hasPointerCapture?.(pointerId)) {
      pointerCaptureElement.releasePointerCapture(pointerId);
    }
    onCancel();
  }, [onCancel]);

  const valueFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (activeUnit === 'hour' && format === '24h') {
      hourRingRef.current = getTimeClockHourRingFromPoint(
        rect,
        event.clientX,
        event.clientY,
        hourRingRef.current,
      );
    }
    return getTimeClockValueFromPoint(
      rect,
      event.clientX,
      event.clientY,
      activeUnit,
      format,
      hourRingRef.current,
    );
  };

  const handleDialPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      interactionBlocked ||
      isInteractionBlockedNow() ||
      event.button > 0 ||
      event.isPrimary === false
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('button') && event.clientX === 0 && event.clientY === 0) return;

    suppressNextOptionClickRef.current = Boolean(target.closest('button'));
    draggingPointerIdRef.current = event.pointerId;
    pointerCaptureElementRef.current = event.currentTarget;
    hourRingRef.current = undefined;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
    onPreview(valueFromPointer(event));
  };

  const handleDialPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingPointerIdRef.current !== event.pointerId) return;
    if (interactionBlocked || isInteractionBlockedNow()) {
      cancelActivePointer();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onPreview(valueFromPointer(event));
  };

  const finishPointer = (event: PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (draggingPointerIdRef.current !== event.pointerId) return;
    if (!commit || interactionBlocked || isInteractionBlockedNow()) {
      cancelActivePointer();
      return;
    }

    const nextValue = valueFromPointer(event);
    draggingPointerIdRef.current = null;
    pointerCaptureElementRef.current = null;
    hourRingRef.current = undefined;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onCommit(nextValue);
  };

  const shouldSuppressOptionClick = () => {
    if (!suppressNextOptionClickRef.current) return false;

    suppressNextOptionClickRef.current = false;
    return true;
  };

  const dialPointerProps: HTMLAttributes<HTMLDivElement> = {
    onLostPointerCapture: (event) => finishPointer(event, false),
    onPointerCancel: (event) => finishPointer(event, false),
    onPointerDownCapture: handleDialPointerDown,
    onPointerMove: handleDialPointerMove,
    onPointerUp: (event) => finishPointer(event, true),
  };

  return {
    cancelActivePointer,
    dialPointerProps,
    shouldSuppressOptionClick,
  };
};
