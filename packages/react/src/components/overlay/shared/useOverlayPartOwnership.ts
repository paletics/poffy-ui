'use client';

import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';

type OverlayOwnerKind = 'content' | 'reference';

const useOwnerRegistry = () => {
  const ids = useRef(new Set<string>());
  const [activeId, setActiveId] = useState<string>();
  const register = useCallback((id: string) => {
    ids.current.add(id);
    setActiveId((current) => current ?? id);
    return () => {
      ids.current.delete(id);
      setActiveId((current) => (current === id ? ids.current.values().next().value : current));
    };
  }, []);
  return { activeId, register };
};

export const useOverlayPartOwnership = () => {
  const reference = useOwnerRegistry();
  const content = useOwnerRegistry();
  return {
    activeReferenceOwnerId: reference.activeId,
    activeContentOwnerId: content.activeId,
    registerReferenceOwner: reference.register,
    registerContentOwner: content.register,
  };
};

interface OverlayOwnershipContext {
  activeReferenceOwnerId?: string;
  activeContentOwnerId?: string;
  registerReferenceOwner: (id: string) => () => void;
  registerContentOwner: (id: string) => () => void;
}

export const useOverlayPartOwner = (
  context: OverlayOwnershipContext,
  kind: OverlayOwnerKind,
) => {
  const id = useId();
  const activeId =
    kind === 'reference' ? context.activeReferenceOwnerId : context.activeContentOwnerId;
  const register =
    kind === 'reference' ? context.registerReferenceOwner : context.registerContentOwner;
  useLayoutEffect(() => register(id), [id, register]);
  return { activeId, isOwner: activeId === undefined || activeId === id };
};
