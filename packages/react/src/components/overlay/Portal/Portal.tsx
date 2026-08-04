'use client';

import { createPortal } from 'react-dom';
import { MotionPortalScope } from '@/providers/MotionPortalScope';
import type { PortalProps } from './Portal.types';
import { useResolvedPortalContainer } from './useResolvedPortalContainer';
import { useWarnViewportPortalRoot } from './useWarnViewportPortalRoot';

type ViewportPortalProps = PortalProps & {
  viewportOwnerName?: string;
};

/**
 * Internal viewport-scoped portal variant. Keeping the diagnostic here lets
 * consumers share the exact container resolution used by createPortal.
 *
 * @internal
 */
export const ViewportPortal = ({
  children,
  container,
  ownerDocument,
  disabled = false,
  scopeProviders = false,
  viewportOwnerName,
}: ViewportPortalProps) => {
  const resolution = useResolvedPortalContainer(container, ownerDocument);
  useWarnViewportPortalRoot({
    componentName: viewportOwnerName ?? 'Portal',
    enabled: Boolean(viewportOwnerName) && resolution.hasConfiguredContainer && !disabled,
    target: resolution.target,
  });

  if (disabled) return <>{children}</>;
  const target = resolution.hasConfiguredContainer
    ? resolution.target
    : resolution.mounted
      ? (resolution.ownerDocument?.body ??
        (resolution.hasExplicitOwnerDocument || typeof document === 'undefined'
          ? null
          : document.body))
      : null;
  if (!target) return null;
  return createPortal(
    scopeProviders ? <MotionPortalScope>{children}</MotionPortalScope> : children,
    target,
  );
};

ViewportPortal.displayName = 'ViewportPortal';

/** Low-level portal component for rendering content outside the current DOM tree. */
export const Portal = (props: PortalProps) => <ViewportPortal {...props} />;

Portal.displayName = 'Portal';
