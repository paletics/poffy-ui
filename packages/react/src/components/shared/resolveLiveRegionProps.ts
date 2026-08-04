import type { AriaAttributes, AriaRole } from 'react';

export type LiveRegionPriority = 'assertive' | 'polite' | 'off';

interface ResolveLiveRegionPropsOptions {
  live?: LiveRegionPriority;
  defaultLive: LiveRegionPriority;
  role?: AriaRole;
  ariaLive?: AriaAttributes['aria-live'];
  announceDefaultWithExplicitRole?: boolean;
}

const getImplicitRole = (live: LiveRegionPriority): AriaRole | undefined => {
  if (live === 'assertive') return 'alert';
  if (live === 'polite') return 'status';
  return undefined;
};

/**
 * Resolves component-level live-region shortcuts without erasing the
 * distinction between an explicit priority and a compatibility default.
 */
export const resolveLiveRegionProps = ({
  live,
  defaultLive,
  role,
  ariaLive,
  announceDefaultWithExplicitRole = false,
}: ResolveLiveRegionPropsOptions): {
  role: AriaRole | undefined;
  ariaLive: AriaAttributes['aria-live'];
} => {
  const effectiveLive = live ?? defaultLive;
  const resolvedRole = role ?? getImplicitRole(effectiveLive);

  if (ariaLive !== undefined) return { role: resolvedRole, ariaLive };
  if (live === 'off') return { role: resolvedRole, ariaLive: 'off' };
  if (role !== undefined && live !== undefined) {
    return { role: resolvedRole, ariaLive: effectiveLive };
  }
  if (role !== undefined && announceDefaultWithExplicitRole) {
    return { role: resolvedRole, ariaLive: defaultLive };
  }

  return { role: resolvedRole, ariaLive: undefined };
};
