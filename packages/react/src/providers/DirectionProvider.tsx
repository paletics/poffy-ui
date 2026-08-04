'use client';

import { createContext, ReactElement, useContext, useMemo, useState } from 'react';
import type {
  DirectionContextType,
  DirectionProviderProps,
  PoffyDirection,
} from './DirectionProvider.types';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { ProviderScope } from './ProviderScope';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';

/**
 * Public direction provider context and direction value types.
 */
export type { PoffyDirection, DirectionContextType } from './DirectionProvider.types';

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

const directionOwnerStack = createGlobalDocumentOwnerStack<PoffyDirection, string | null>({
  capture: (targetDocument) => targetDocument.documentElement.getAttribute('dir'),
  apply: (targetDocument, dir) => targetDocument.documentElement.setAttribute('dir', dir),
  restore: (targetDocument, dir) => {
    if (dir === null) targetDocument.documentElement.removeAttribute('dir');
    else targetDocument.documentElement.setAttribute('dir', dir);
  },
});

/**
 * Provides text direction to a subtree. At the application root, `global` synchronizes `dir` to
 * the owner document; with `global={false}` and `scope`, it applies direction to only the local
 * subtree. Prefer CSS logical properties so ordinary layout follows this direction automatically.
 */
export const DirectionProvider = ({
  children,
  defaultDir = 'ltr',
  global = true,
  ownerDocument,
  scope = false,
}: DirectionProviderProps): ReactElement => {
  const [dir, setDir] = useState<PoffyDirection>(defaultDir);
  useGlobalDocumentOwner(directionOwnerStack, dir, global, ownerDocument);

  const contextValue = useMemo(() => ({ dir, setDir }), [dir]);

  return (
    <DirectionContext.Provider value={contextValue}>
      {!global && scope ? <ProviderScope dir={dir}>{children}</ProviderScope> : children}
    </DirectionContext.Provider>
  );
};

/** Returns the nearest text direction and setter, or throws when no provider is present. */
export const useDirection = (): DirectionContextType => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider.');
  }
  return context;
};

/** Returns the nearest direction context when one exists. */
export const useOptionalDirection = (): DirectionContextType | undefined =>
  useContext(DirectionContext);
