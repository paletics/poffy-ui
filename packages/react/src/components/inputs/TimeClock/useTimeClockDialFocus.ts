'use client';

import { getDeepActiveElement, getDOMTreeRoot, type DOMTreeRoot } from '@poffy-ui/behavior/hooks';
import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { TimeClockUnit } from './TimeClock.types';

interface PendingDialFocus {
  source: Element;
  treeRoot: DOMTreeRoot;
}

const canRestoreDialFocus = ({ source, treeRoot }: PendingDialFocus) => {
  const activeElement = getDeepActiveElement(treeRoot);
  if (activeElement === source || (activeElement !== null && source.contains(activeElement))) {
    return true;
  }
  if (source.isConnected) return false;

  const ownerDocument = source.ownerDocument;
  if (!('host' in treeRoot)) return activeElement === ownerDocument.body;
  if (activeElement !== null) return false;

  const documentActiveElement = getDeepActiveElement(ownerDocument);
  return [
    documentActiveElement === null,
    documentActiveElement === treeRoot.host,
    documentActiveElement === ownerDocument.body,
  ].some(Boolean);
};

export const useTimeClockDialFocus = (
  activeUnit: TimeClockUnit,
  rootRef: RefObject<HTMLDivElement | null>,
) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const pendingFocusRef = useRef<PendingDialFocus | null>(null);
  const trackedFocusRef = useRef<PendingDialFocus | null>(null);

  const requestFocusRestore = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      pendingFocusRef.current = null;
      return;
    }
    const treeRoot = getDOMTreeRoot(root);
    const source = getDeepActiveElement(treeRoot);
    pendingFocusRef.current = source && root.contains(source) ? { source, treeRoot } : null;
  }, [rootRef]);

  const trackFocusSource = useCallback((source: Element) => {
    trackedFocusRef.current = {
      source,
      treeRoot: getDOMTreeRoot(source),
    };
  }, []);

  const requestTrackedFocusRestore = useCallback(() => {
    if (trackedFocusRef.current) {
      pendingFocusRef.current = trackedFocusRef.current;
      trackedFocusRef.current = null;
      return;
    }
    requestFocusRestore();
  }, [requestFocusRestore]);

  useEffect(() => {
    const pendingFocus = pendingFocusRef.current;
    pendingFocusRef.current = null;
    if (!pendingFocus || !canRestoreDialFocus(pendingFocus)) return;

    const target =
      dialRef.current?.querySelector<HTMLButtonElement>('[data-selected]') ??
      dialRef.current?.querySelector<HTMLButtonElement>('button');
    target?.focus();
  }, [activeUnit]);

  return {
    dialRef,
    requestFocusRestore,
    requestTrackedFocusRestore,
    trackFocusSource,
  };
};
