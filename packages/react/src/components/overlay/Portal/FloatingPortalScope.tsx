'use client';

import { MotionPortalScope } from '@/providers/MotionPortalScope';
import { FloatingPortal, type ReferenceType } from '@floating-ui/react';
import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';
import type { PortalProviderContextValue } from '@/providers/PortalProvider';
import type {
  PortalProviderContainer,
  PortalProviderTarget,
} from '@/providers/PortalProvider.types';
import { useResolvedPortalContainer } from './useResolvedPortalContainer';
import { useWarnViewportPortalRoot } from './useWarnViewportPortalRoot';

interface ActivePoffyPortal {
  provider: PortalProviderContextValue | undefined;
  root: PortalProviderTarget | null | undefined;
}

const ActivePoffyPortalContext = createContext<ActivePoffyPortal | undefined>(undefined);

export interface FloatingPortalScopeProps {
  children?: ReactNode;
  /** Default body owner. `null` suppresses the portal when no container/provider is configured. */
  ownerDocument?: Document | null;
  portalContainer?: PortalProviderContainer;
  preserveTabOrder?: boolean;
  referenceRef?: Readonly<{ current: ReferenceType | null }>;
  /** Allows modal-style overlays without a trigger to fall back to the ambient document. */
  allowUnanchoredFallback?: boolean;
  /** Internal diagnostic owner for components whose geometry remains viewport-fixed. */
  viewportOwnerName?: string;
}

const getReferencePortalTarget = (
  reference: ReferenceType | null | undefined,
): PortalProviderTarget | undefined => {
  const candidate = reference as unknown as {
    contextElement?: Element;
    getRootNode?: () => Node;
    ownerDocument?: Document;
  } | null;
  const referenceElement =
    candidate?.contextElement ??
    (candidate?.getRootNode ? (candidate as unknown as Element) : null);
  const root = referenceElement?.getRootNode();
  if (root?.nodeType === 11 && 'host' in root) return root as ShadowRoot;
  return referenceElement?.ownerDocument.body ?? candidate?.ownerDocument?.body;
};

const getOwnerDocumentPortalTarget = (
  ownerDocument: Document | null | undefined,
): PortalProviderTarget | null | undefined => (ownerDocument === null ? null : ownerDocument?.body);

const preferDefinedPortalTarget = <T,>(preferred: T | undefined, fallback: T): T => {
  if (preferred !== undefined) return preferred;
  return fallback;
};

/** Shared Floating UI portal that preserves provider roots, nesting, and motion scope. */
export const FloatingPortalScope = ({
  children,
  ownerDocument,
  portalContainer,
  preserveTabOrder,
  referenceRef,
  allowUnanchoredFallback = false,
  viewportOwnerName,
}: FloatingPortalScopeProps) => {
  const activePortal = useContext(ActivePoffyPortalContext);
  const resolution = useResolvedPortalContainer(portalContainer);
  useWarnViewportPortalRoot({
    componentName: viewportOwnerName ?? 'ViewportOverlay',
    enabled: viewportOwnerName !== undefined && resolution.hasConfiguredContainer,
    target: resolution.target,
  });
  const [referencePortalTarget, setReferencePortalTarget] = useState<
    PortalProviderTarget | null | undefined
  >();
  const [hasCommittedWithoutReference, setHasCommittedWithoutReference] = useState(false);

  useLayoutEffect(() => {
    if (!allowUnanchoredFallback) return;
    setHasCommittedWithoutReference(getReferencePortalTarget(referenceRef?.current) === undefined);
  }, [allowUnanchoredFallback, referenceRef]);

  useLayoutEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const referenceTarget = getReferencePortalTarget(referenceRef?.current);
      const nextPortalTarget = preferDefinedPortalTarget(
        referenceTarget,
        getOwnerDocumentPortalTarget(ownerDocument),
      );
      setReferencePortalTarget((current) =>
        current === nextPortalTarget ? current : nextPortalTarget,
      );
    });
    return () => {
      active = false;
    };
  });

  // Floating UI owns this mutable reference and assigns it during commit. Reading
  // it here lets the first interaction portal synchronously into the reference
  // document; the layout-effect state below keeps later owner changes reactive.
  // eslint-disable-next-line react-hooks/refs -- third-party reference ownership requires a synchronous portal-root read.
  const currentReferencePortalTarget = getReferencePortalTarget(referenceRef?.current);
  const effectiveReferencePortalTarget = preferDefinedPortalTarget(
    currentReferencePortalTarget,
    referencePortalTarget,
  );
  // A reference ref is assigned during the commit phase. Do not let Floating UI create its
  // default portal in the ambient document before that owner is known: it cannot reliably move
  // an already-created portal into an iframe document afterwards.
  const isWaitingForReferenceOwner =
    referenceRef !== undefined &&
    ownerDocument === undefined &&
    !resolution.hasConfiguredContainer &&
    effectiveReferencePortalTarget === undefined &&
    !hasCommittedWithoutReference;
  const resolvedOwnerRoot = preferDefinedPortalTarget(
    effectiveReferencePortalTarget,
    getOwnerDocumentPortalTarget(ownerDocument),
  );
  const effectiveRoot = resolution.hasConfiguredContainer
    ? (resolution.target as PortalProviderTarget | null)
    : resolvedOwnerRoot;
  const canReuseParentPortal =
    activePortal !== undefined &&
    !resolution.hasExplicitContainer &&
    activePortal.provider === resolution.provider &&
    activePortal.root === effectiveRoot;

  const root = canReuseParentPortal ? undefined : effectiveRoot;

  if (isWaitingForReferenceOwner) return null;

  return (
    <FloatingPortal root={root} preserveTabOrder={preserveTabOrder}>
      <ActivePoffyPortalContext.Provider
        value={{ provider: resolution.provider, root: effectiveRoot }}
      >
        <MotionPortalScope>{children}</MotionPortalScope>
      </ActivePoffyPortalContext.Provider>
    </FloatingPortal>
  );
};
