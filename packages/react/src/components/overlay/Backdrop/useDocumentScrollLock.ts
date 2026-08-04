'use client';

import { type RefObject, useLayoutEffect } from 'react';

const scrollbarProperty = '--floating-ui-scrollbar-width';

interface StyleValue {
  priority: string;
  value: string;
}

interface LockState {
  count: number;
  restore: () => void;
}

const documentLocks = new WeakMap<Document, LockState>();
const styleProperties = [
  'overflow',
  'padding-left',
  'padding-right',
  'position',
  'top',
  'left',
  'right',
  scrollbarProperty,
] as const;

const captureStyle = (style: CSSStyleDeclaration, property: string): StyleValue => ({
  priority: style.getPropertyPriority(property),
  value: style.getPropertyValue(property),
});

const restoreStyle = (style: CSSStyleDeclaration, property: string, snapshot: StyleValue) => {
  if (snapshot.value) {
    style.setProperty(property, snapshot.value, snapshot.priority);
  } else {
    style.removeProperty(property);
  }
};

const isIOS = (navigator: Navigator) => {
  const platform = navigator.platform;
  if (/iP(hone|ad|od)|iOS/.test(platform)) return true;
  return platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

const lockDocument = (ownerDocument: Document) => {
  const activeLock = documentLocks.get(ownerDocument);
  if (activeLock) {
    activeLock.count += 1;
    return () => {
      activeLock.count -= 1;
      if (activeLock.count === 0) {
        activeLock.restore();
        documentLocks.delete(ownerDocument);
      }
    };
  }

  const ownerWindow = ownerDocument.defaultView;
  const bodyStyle = ownerDocument.body.style;
  const snapshot = new Map(
    styleProperties.map((property) => [property, captureStyle(bodyStyle, property)]),
  );
  const documentElement = ownerDocument.documentElement;
  const scrollbarX =
    Math.round(documentElement.getBoundingClientRect().left) + documentElement.scrollLeft;
  const paddingProperty = scrollbarX ? 'padding-left' : 'padding-right';
  const scrollbarWidth = ownerWindow
    ? Math.max(0, ownerWindow.innerWidth - documentElement.clientWidth)
    : 0;
  const computedPadding = ownerWindow
    ? Number.parseFloat(
        ownerWindow.getComputedStyle(ownerDocument.body).getPropertyValue(paddingProperty),
      )
    : 0;
  const existingPadding = Number.isFinite(computedPadding) ? computedPadding : 0;
  const scrollX = ownerWindow?.scrollX ?? 0;
  const scrollY = ownerWindow?.scrollY ?? 0;
  const usesFixedBody = Boolean(ownerWindow && isIOS(ownerWindow.navigator));

  bodyStyle.setProperty('overflow', 'hidden');
  bodyStyle.setProperty(scrollbarProperty, `${scrollbarWidth}px`);
  if (scrollbarWidth) {
    bodyStyle.setProperty(paddingProperty, `${existingPadding + scrollbarWidth}px`);
  }

  if (ownerWindow && usesFixedBody) {
    const offsetLeft = ownerWindow.visualViewport?.offsetLeft ?? 0;
    const offsetTop = ownerWindow.visualViewport?.offsetTop ?? 0;
    bodyStyle.setProperty('position', 'fixed');
    bodyStyle.setProperty('top', `${-(scrollY - Math.floor(offsetTop))}px`);
    bodyStyle.setProperty('left', `${-(scrollX - Math.floor(offsetLeft))}px`);
    bodyStyle.setProperty('right', '0');
  }

  const state: LockState = {
    count: 1,
    restore: () => {
      for (const property of styleProperties) {
        const value = snapshot.get(property);
        if (value) restoreStyle(bodyStyle, property, value);
      }
      if (ownerWindow && usesFixedBody) ownerWindow.scrollTo(scrollX, scrollY);
    },
  };
  documentLocks.set(ownerDocument, state);

  return () => {
    state.count -= 1;
    if (state.count === 0) {
      state.restore();
      documentLocks.delete(ownerDocument);
    }
  };
};

export const useDocumentScrollLock = (
  overlayRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) => {
  useLayoutEffect(() => {
    if (!enabled) return;
    const ownerDocument = overlayRef.current?.ownerDocument;
    if (!ownerDocument) return;
    return lockDocument(ownerDocument);
  }, [enabled, overlayRef]);
};
