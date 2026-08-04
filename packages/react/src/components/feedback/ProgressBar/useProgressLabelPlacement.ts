'use client';

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { LabelPosition } from './ProgressBar.types';

type ResolvedLabelPosition = Exclude<LabelPosition, 'auto'>;

interface MeasuredPlacement {
  key: string;
  label: ReactNode;
  position: ResolvedLabelPosition;
}

interface UseProgressLabelPlacementOptions {
  barRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  estimatedPosition: ResolvedLabelPosition;
  fillPercent: number;
  hysteresis: number;
  inlinePadding: number;
  label: ReactNode;
  measurementKey: string;
  measurementRef: RefObject<HTMLElement | null>;
}

/** Resolves automatic label placement from the rendered bar and label dimensions. */
export const useProgressLabelPlacement = ({
  barRef,
  enabled,
  estimatedPosition,
  fillPercent,
  hysteresis,
  inlinePadding,
  label,
  measurementKey,
  measurementRef,
}: UseProgressLabelPlacementOptions): ResolvedLabelPosition => {
  const [measuredPlacement, setMeasuredPlacement] = useState<MeasuredPlacement>();
  const measurementInputsRef = useRef({
    estimatedPosition,
    fillPercent,
    hysteresis,
    inlinePadding,
    label,
    measurementKey,
  });
  const measureRef = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    measurementInputsRef.current = {
      estimatedPosition,
      fillPercent,
      hysteresis,
      inlinePadding,
      label,
      measurementKey,
    };
  }, [estimatedPosition, fillPercent, hysteresis, inlinePadding, label, measurementKey]);

  useLayoutEffect(() => {
    if (!enabled) return;

    const bar = barRef.current;
    const measurement = measurementRef.current;
    if (!bar || !measurement) return;

    const measure = () => {
      const inputs = measurementInputsRef.current;
      // Placement is relative to the rendered progressbar, not an outer host
      // that may include an inline-end label or unrelated available space.
      const barInlineSize = bar.clientWidth;
      const barBlockSize = bar.clientHeight;
      if (barInlineSize <= 0 || barBlockSize <= 0) return;

      const availableInlineSize = barInlineSize * (inputs.fillPercent / 100);
      const requiredInlineSize = measurement.offsetWidth + inputs.inlinePadding;
      const requiredBlockSize = measurement.offsetHeight;

      setMeasuredPlacement((previous) => {
        const previousPosition =
          previous?.key === inputs.measurementKey && previous.label === inputs.label
            ? previous.position
            : inputs.estimatedPosition;
        const wasInside = previousPosition === 'inside';
        const inlineFits = wasInside
          ? availableInlineSize + inputs.hysteresis >= requiredInlineSize
          : availableInlineSize >= requiredInlineSize + inputs.hysteresis;
        const nextPosition = inlineFits && barBlockSize >= requiredBlockSize ? 'inside' : 'right';

        return previous?.key === inputs.measurementKey &&
          previous.label === inputs.label &&
          previous.position === nextPosition
          ? previous
          : { key: inputs.measurementKey, label: inputs.label, position: nextPosition };
      });
    };

    measureRef.current = measure;
    measure();
    const ownerWindow = bar.ownerDocument.defaultView;
    let resizeFrame: number | undefined;
    const scheduleMeasure = () => {
      if (!ownerWindow) return;
      if (resizeFrame !== undefined) ownerWindow.cancelAnimationFrame(resizeFrame);
      resizeFrame = ownerWindow.requestAnimationFrame(() => {
        resizeFrame = undefined;
        measure();
      });
    };
    ownerWindow?.addEventListener('resize', scheduleMeasure);

    const ResizeObserverConstructor = ownerWindow?.ResizeObserver;
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(scheduleMeasure)
      : undefined;
    resizeObserver?.observe(bar);
    if (bar.parentElement) resizeObserver?.observe(bar.parentElement);
    resizeObserver?.observe(measurement);

    const MutationObserverConstructor = ownerWindow?.MutationObserver;
    const mutationObserver = MutationObserverConstructor
      ? new MutationObserverConstructor(scheduleMeasure)
      : undefined;
    mutationObserver?.observe(measurement, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      if (measureRef.current === measure) measureRef.current = null;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      ownerWindow?.removeEventListener('resize', scheduleMeasure);
      if (resizeFrame !== undefined) ownerWindow?.cancelAnimationFrame(resizeFrame);
    };
  }, [barRef, enabled, measurementRef]);

  useLayoutEffect(() => {
    if (!enabled) return;
    measureRef.current?.();
  }, [enabled, estimatedPosition, fillPercent, hysteresis, inlinePadding, label, measurementKey]);

  return enabled && measuredPlacement?.key === measurementKey && measuredPlacement.label === label
    ? measuredPlacement.position
    : estimatedPosition;
};
