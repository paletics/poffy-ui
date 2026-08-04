'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Determines when an overflow container participates in sequential keyboard focus. */
export type OverflowFocusMode = 'auto' | 'always' | 'never';
export type OverflowAxis = 'horizontal' | 'vertical' | 'both';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const descendantLayoutEvents = [
  'animationcancel',
  'animationend',
  'error',
  'load',
  'loadeddata',
  'loadedmetadata',
  'resize',
  'transitioncancel',
  'transitionend',
] as const;

const hasOverflow = (element: HTMLElement, axis: OverflowAxis) => {
  if (axis !== 'horizontal' && element.scrollHeight > element.clientHeight + 1) return true;
  return axis !== 'vertical' && element.scrollWidth > element.clientWidth + 1;
};

/** Keeps scroll-region tab stops in sync with whether keyboard scrolling is useful. */
export const useOverflowFocusability = <T extends HTMLElement = HTMLDivElement>({
  axis = 'both',
  explicitTabIndex,
  focusMode = 'auto',
}: {
  axis?: OverflowAxis;
  explicitTabIndex?: number;
  focusMode?: OverflowFocusMode;
}) => {
  const ref = useRef<T | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (focusMode !== 'auto' || explicitTabIndex !== undefined) return;
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const next = hasOverflow(element, axis);
      setOverflowing((current) => (current === next ? current : next));
    };
    update();

    const ownerWindow = element.ownerDocument.defaultView;
    let updateFrame: number | undefined;
    const scheduleUpdate = () => {
      if (!ownerWindow) {
        update();
        return;
      }
      if (updateFrame !== undefined) return;
      updateFrame = ownerWindow.requestAnimationFrame(() => {
        updateFrame = undefined;
        update();
      });
    };
    ownerWindow?.addEventListener('resize', scheduleUpdate);
    descendantLayoutEvents.forEach((eventType) => {
      element.addEventListener(eventType, scheduleUpdate, true);
    });
    const fontSet = element.ownerDocument.fonts;
    fontSet?.addEventListener('loadingdone', scheduleUpdate);
    fontSet?.addEventListener('loadingerror', scheduleUpdate);

    const ResizeObserverConstructor = ownerWindow?.ResizeObserver;
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(scheduleUpdate)
      : undefined;
    let contentOwner: Element | null = null;
    if (resizeObserver) {
      resizeObserver.observe(element);
      contentOwner = element.children.length === 1 ? element.firstElementChild : null;
      if (contentOwner) resizeObserver.observe(contentOwner);
    }

    const MutationObserverConstructor = ownerWindow?.MutationObserver;
    const mutationObserver = MutationObserverConstructor
      ? new MutationObserverConstructor((records) => {
          if (resizeObserver) {
            const directChildrenChanged = records.some(
              (record) => record.type === 'childList' && record.target === element,
            );
            if (directChildrenChanged) {
              const nextContentOwner =
                element.children.length === 1 ? element.firstElementChild : null;
              if (contentOwner !== nextContentOwner) {
                if (contentOwner) resizeObserver.unobserve(contentOwner);
                if (nextContentOwner) resizeObserver.observe(nextContentOwner);
                contentOwner = nextContentOwner;
              }
            }
          }
          scheduleUpdate();
        })
      : undefined;
    mutationObserver?.observe(element, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
    });

    return () => {
      ownerWindow?.removeEventListener('resize', scheduleUpdate);
      descendantLayoutEvents.forEach((eventType) => {
        element.removeEventListener(eventType, scheduleUpdate, true);
      });
      fontSet?.removeEventListener('loadingdone', scheduleUpdate);
      fontSet?.removeEventListener('loadingerror', scheduleUpdate);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (updateFrame !== undefined) ownerWindow?.cancelAnimationFrame(updateFrame);
    };
  }, [axis, explicitTabIndex, focusMode]);

  const tabIndex =
    explicitTabIndex ??
    (focusMode === 'always' ? 0 : focusMode === 'never' ? undefined : overflowing ? 0 : undefined);

  return [ref, tabIndex] as const;
};
