import { createNoMotionStyle } from '@/types/motion';
import { cloneElement, isValidElement, type ReactNode } from 'react';

interface StyleChildProps {
  style?: unknown;
}

/** Clones a valid child with static no-motion styles when the caller's policy applies. */
export const withNoMotionStyle = (children: ReactNode, shouldApply: boolean): ReactNode => {
  if (!shouldApply || !isValidElement<StyleChildProps>(children)) return children;

  return cloneElement(children, {
    style: createNoMotionStyle(children.props.style),
  });
};
