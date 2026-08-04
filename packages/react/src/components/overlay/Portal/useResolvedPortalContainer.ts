'use client';

import { useEffect, useRef, useState } from 'react';
import { useHydrated } from '@/components/animations/useHydrated';
import { useOptionalPortalProvider } from '@/providers/PortalProvider';
import type { PortalProviderContextValue } from '@/providers/PortalProvider';
import type { PortalContainer } from './Portal.types';
import type { PortalOwnerDocument } from './Portal.types';

const unresolvedSource = Symbol('unresolved-portal-source');

interface PortalResolution {
  source: PortalContainer | typeof unresolvedSource;
  target: Element | DocumentFragment | null;
}

const resolveSource = (source: PortalContainer) =>
  typeof source === 'function' ? source() : source;

/** Resolves an explicit portal target before the nearest provider, after mount only. */
export const useResolvedPortalContainer = (
  explicitContainer: PortalContainer | undefined,
  explicitOwnerDocument?: PortalOwnerDocument,
) => {
  const provider = useOptionalPortalProvider();
  const hasExplicitContainer = explicitContainer !== undefined;
  const hasConfiguredContainer = hasExplicitContainer ? true : provider !== undefined;
  const source = hasExplicitContainer ? explicitContainer : provider?.container;
  const configuredSource: PortalContainer | undefined = hasConfiguredContainer
    ? (source ?? null)
    : undefined;
  const [resolution, setResolution] = useState<PortalResolution>({
    source: unresolvedSource,
    target: null,
  });
  const pendingResolutionRef = useRef<PortalResolution | null>(null);
  const skipResolutionRefreshRef = useRef(false);
  const mounted = useHydrated();
  const [ownerDocument, setOwnerDocument] = useState<Document | null>(null);

  useEffect(() => {
    const nextOwnerDocument =
      typeof explicitOwnerDocument === 'function'
        ? explicitOwnerDocument()
        : (explicitOwnerDocument ?? null);
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setOwnerDocument((current) => (current === nextOwnerDocument ? current : nextOwnerDocument));
    });
    return () => {
      active = false;
    };
  });

  useEffect(() => {
    const pendingResolution = pendingResolutionRef.current;
    if (
      pendingResolution?.source === resolution.source &&
      pendingResolution.target === resolution.target
    ) {
      pendingResolutionRef.current = null;
      skipResolutionRefreshRef.current = true;
    }
  }, [resolution]);

  useEffect(() => {
    if (!hasConfiguredContainer) return;
    if (skipResolutionRefreshRef.current) {
      skipResolutionRefreshRef.current = false;
      return;
    }

    const target = resolveSource(configuredSource ?? null);
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      if (resolution.source === configuredSource && resolution.target === target) return;

      // A resolver may produce a new target on every call. The next effect caused by this state
      // update is skipped after it commits, while caller-originated commits still refresh it.
      const nextResolution = { source: configuredSource ?? null, target };
      pendingResolutionRef.current = nextResolution;
      setResolution(nextResolution);
    });

    return () => {
      active = false;
    };
  });

  return {
    hasConfiguredContainer,
    hasExplicitContainer,
    hasExplicitOwnerDocument: explicitOwnerDocument !== undefined,
    mounted,
    ownerDocument,
    provider: provider as PortalProviderContextValue | undefined,
    target: resolution.source === configuredSource ? resolution.target : null,
  };
};
