'use client';

import { FloatingTree, useFloatingTree } from '@floating-ui/react';
import type { ReactNode } from 'react';

/**
 * Reuses an ancestor Floating UI tree or creates one for a top-level overlay.
 *
 * The boundary must wrap an inner overlay component that calls `useFloatingNodeId`.
 * This keeps portal-rendered nested overlays in one tree for dismiss coordination.
 */
export const FloatingTreeBoundary = ({ children }: { children: ReactNode }) => {
  const tree = useFloatingTree();

  return tree == null ? <FloatingTree>{children}</FloatingTree> : children;
};

/** Provides one Floating UI tree for sibling overlays in an application subtree. */
export const OverlayTreeProvider = ({ children }: { children: ReactNode }) => (
  <FloatingTreeBoundary>{children}</FloatingTreeBoundary>
);
