import type { KeyboardEvent } from 'react';

/** Scrolls a focused horizontal overflow owner without intercepting descendant controls. */
export const handleHorizontalOverflowKeyDown = (event: KeyboardEvent<HTMLElement>): boolean => {
  if (
    event.defaultPrevented ||
    event.currentTarget !== event.target ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return false;
  }

  const scrollContainer = event.currentTarget;
  if (scrollContainer.scrollWidth <= scrollContainer.clientWidth) return false;

  const direction = getComputedStyle(scrollContainer).direction;
  const viewportStep = Math.max(scrollContainer.clientWidth * 0.8, 1);
  const isRtl = direction === 'rtl';
  const delta =
    event.key === 'ArrowLeft'
      ? isRtl
        ? viewportStep
        : -viewportStep
      : event.key === 'ArrowRight'
        ? isRtl
          ? -viewportStep
          : viewportStep
        : event.key === 'Home'
          ? isRtl
            ? scrollContainer.scrollWidth
            : -scrollContainer.scrollWidth
          : event.key === 'End'
            ? isRtl
              ? -scrollContainer.scrollWidth
              : scrollContainer.scrollWidth
            : null;

  if (delta === null) return false;
  event.preventDefault();
  scrollContainer.scrollBy({ left: delta, behavior: 'auto' });
  return true;
};
