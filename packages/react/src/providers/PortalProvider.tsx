'use client';

import { createContext, useContext, useMemo } from 'react';
import type { PortalProviderContainer, PortalProviderProps } from './PortalProvider.types';

/** Internal context payload holding the subtree's default portal destination or resolver. */
export interface PortalProviderContextValue {
  container: PortalProviderContainer;
}

const PortalProviderContext = createContext<PortalProviderContextValue | undefined>(undefined);

/**
 * Sets the default portal root for overlays in this React subtree.
 *
 * A component-level `portalContainer` takes precedence over this value. Passing
 * `null` intentionally suppresses portals; a resolver is re-evaluated after
 * commits for ref-owned roots. Shadow-root styling and viewport-fixed
 * containing-block constraints are documented on `PortalProviderProps`.
 */
export const PortalProvider = ({ children, container }: PortalProviderProps) => {
  const value = useMemo(() => ({ container }), [container]);

  return <PortalProviderContext.Provider value={value}>{children}</PortalProviderContext.Provider>;
};

/** Internal optional access used by portal rendering infrastructure. */
export const useOptionalPortalProvider = () => useContext(PortalProviderContext);
