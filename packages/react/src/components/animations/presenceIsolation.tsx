'use client';

import { useIsPresent } from 'motion/react';
import { cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react';

interface PresenceChildProps {
  'aria-hidden'?: boolean;
  inert?: boolean;
  style?: CSSProperties;
}

export interface PresenceSafeRest extends Record<string, unknown> {
  'aria-hidden'?: unknown;
  inert?: unknown;
}

/** Isolates a delegated host while preserving caller-managed static styles. */
export const isolatePresenceChild = (
  children: ReactNode,
  shouldIsolate: boolean,
  managedStyle?: CSSProperties,
): ReactNode => {
  if (!shouldIsolate || !isValidElement<PresenceChildProps>(children)) return children;

  return cloneElement(children, {
    'aria-hidden': true,
    inert: true,
    style: { ...children.props.style, ...managedStyle, pointerEvents: 'none' },
  });
};

/** Isolates an exiting `asChild` host while AnimatePresence keeps it mounted. */
export const useExitPresenceIsolation = (children: ReactNode, isolateAsChild: boolean) => {
  const isPresent = useIsPresent();
  const renderedChildren = isolatePresenceChild(children, isolateAsChild && !isPresent);

  return { isPresent, renderedChildren };
};
