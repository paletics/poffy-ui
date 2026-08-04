import type { PointerEvent } from 'react';

export const getRangeSliderPointerValue = (
  event: PointerEvent<HTMLElement>,
  min: number,
  max: number,
  isRtl = false,
) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const horizontalPercent = rect.width === 0 ? 0 : (event.clientX - rect.left) / rect.width;
  const percent = isRtl ? 1 - horizontalPercent : horizontalPercent;
  return min + Math.min(1, Math.max(0, percent)) * (max - min);
};
