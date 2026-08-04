'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { GlobalDocumentOwner, GlobalDocumentOwnerStack } from './globalDocumentOwnership';

const resolveTargetDocument = (targetDocument: Document | null | undefined) => {
  if (targetDocument !== undefined) return targetDocument;
  if (typeof document === 'undefined') return null;
  return document;
};

/**
 * Registers a provider's current state with a document-scoped ownership stack while enabled.
 *
 * Registration is updated after each committed state change, moves when `targetDocument` changes,
 * and unregisters on cleanup. The stack, rather than this hook, resolves nested-owner precedence
 * and restores the host document after its final owner disappears.
 */
export const useGlobalDocumentOwner = <TState>(
  stack: GlobalDocumentOwnerStack<TState>,
  state: TState,
  enabled: boolean,
  targetDocument?: Document | null,
) => {
  const owner = useMemo<GlobalDocumentOwner>(() => stack.createOwner(), [stack]);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const resolvedDocument = resolveTargetDocument(targetDocument);
    if (!enabled || !resolvedDocument) return;
    stack.register(resolvedDocument, owner, stateRef.current);
    return () => stack.unregister(resolvedDocument, owner);
  }, [enabled, owner, stack, targetDocument]);

  useEffect(() => {
    const resolvedDocument = resolveTargetDocument(targetDocument);
    if (!enabled || !resolvedDocument) return;
    stack.update(resolvedDocument, owner, state);
  }, [enabled, owner, stack, state, targetDocument]);
};
