import { isAsChildHost, isPotentiallyInteractiveAsChildHost } from '@/components/shared/asChild';
import type { ReactElement, ReactNode } from 'react';

const avatarRootNativeHosts = new Set(['a', 'button', 'div', 'span']);

/**
 * Avatar injects an image and inline fallback into its delegated host.
 * Native hosts therefore stay limited to compatible HTML containers. Opaque
 * components are accepted under the documented HTML host/ref forwarding contract.
 */
export const isAvatarRootAsChildHost = (
  children: ReactNode,
): children is ReactElement<{ children?: ReactNode }> =>
  isAsChildHost(children, avatarRootNativeHosts);

/**
 * Decorative roots own `aria-hidden`. Do not delegate that attribute to a host
 * that is, or could become, keyboard interactive. Opaque components are
 * intentionally treated as potentially interactive because their rendered host
 * cannot be verified here.
 */
export const isPotentiallyInteractiveAvatarRootHost = (child: ReactElement): boolean => {
  return isPotentiallyInteractiveAsChildHost(child);
};

/** Preserves composed Avatar children while discarding a rejected host. */
export const getAvatarRootFallbackContent = (
  child: ReactElement<{ children?: ReactNode }>,
): ReactNode => child.props.children;
