import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import { isValidElement, type ReactNode } from 'react';

export interface OverlayRootPartGroup {
  /** Human-readable ownership group used by development warnings. */
  name: string;
  /** Compound part component identities that share one runtime owner. */
  types: ReadonlySet<unknown>;
}

export interface SanitizedOverlayRootChildren {
  children: ReactNode;
  duplicateGroups: readonly string[];
}

/**
 * Keeps the first statically visible owner for each overlay part group.
 *
 * Floating UI exposes one reference and one floating surface per root. Direct
 * compound parts and parts nested only in Fragments are therefore fail-closed
 * before refs or focus managers mount. Opaque component boundaries remain
 * application-owned and are intentionally not rendered speculatively.
 */
export const sanitizeOverlayRootChildren = (
  children: ReactNode,
  groups: readonly OverlayRootPartGroup[],
): SanitizedOverlayRootChildren => {
  const seenGroups = new Set<string>();
  const duplicateGroups = new Set<string>();
  const sanitized = flattenFragmentChildren(children).map((child) => {
    if (!isValidElement(child)) return child;
    const group = groups.find(({ types }) => types.has(child.type));
    if (!group) return child;
    if (!seenGroups.has(group.name)) {
      seenGroups.add(group.name);
      return child;
    }
    duplicateGroups.add(group.name);
    return null;
  });

  return { children: sanitized, duplicateGroups: [...duplicateGroups] };
};
