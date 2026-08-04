/**
 * Reveals a target inside its horizontal scroll container without moving the page vertically.
 */
export const scrollIntoInlineView = (container: HTMLElement, target: HTMLElement, padding = 0) => {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const inlineStart = containerRect.left + padding;
  const inlineEnd = containerRect.right - padding;
  const delta =
    targetRect.left < inlineStart
      ? targetRect.left - inlineStart
      : targetRect.right > inlineEnd
        ? targetRect.right - inlineEnd
        : 0;

  if (delta === 0) return;

  if (typeof container.scrollBy === 'function') {
    container.scrollBy({ left: delta, behavior: 'auto' });
    return;
  }

  container.scrollLeft += delta;
};
