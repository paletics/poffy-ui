'use client';

import { useCallback, useRef, type RefObject } from 'react';

export const useFileUploaderFocus = (rootRef: RefObject<HTMLDivElement | null>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const zoneRefs = useRef(new Set<HTMLDivElement>());

  const registerZone = useCallback((zone: HTMLDivElement | null) => {
    if (!zone) return undefined;
    zoneRefs.current.add(zone);
    return () => zoneRefs.current.delete(zone);
  }, []);

  const focusFirstZone = useCallback(() => {
    zoneRefs.current.values().next().value?.focus();
  }, []);

  const focusAfterRemoval = useCallback(
    (removedIndex: number) => {
      queueMicrotask(() => {
        const removeButtons = rootRef.current?.querySelectorAll<HTMLElement>(
          '[data-file-uploader-remove]',
        );
        const nextIndex = Math.min(removedIndex, Math.max(0, (removeButtons?.length ?? 0) - 1));
        const target = removeButtons?.[nextIndex];
        if (target) target.focus();
        else focusFirstZone();
      });
    },
    [focusFirstZone, rootRef],
  );

  return { focusAfterRemoval, focusFirstZone, inputRef, registerZone };
};
