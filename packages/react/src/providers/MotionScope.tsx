'use client';

import type { ReactNode } from 'react';
import type { PoffyMotionStyle } from './AnimationProvider.types';
import { useMotionScopeAttributes } from './useMotionScopeAttributes';

interface MotionScopeProps {
  children: ReactNode;
  isAnimating: boolean;
  motionStyle: PoffyMotionStyle;
}

/**
 * DOM boundary that exposes resolved motion preferences to recipe CSS.
 */
export const MotionScope = (props: MotionScopeProps) => <MotionScopeBoundary {...props} />;

const MotionScopeBoundary = ({ children, isAnimating, motionStyle }: MotionScopeProps) => {
  const motionScopeAttributes = useMotionScopeAttributes(isAnimating, motionStyle);

  return <div {...motionScopeAttributes}>{children}</div>;
};
