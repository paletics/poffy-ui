'use client';

import { forwardRef, ReactNode } from 'react';
import { getMotionComponent } from '../utils';
import { usePathDrawAnimation } from './PathDrawTransitionContext';
import type { PathDrawPathProps } from './PathDrawTransition.types';

const MotionPath = getMotionComponent('path');

/**
 * Animated SVG `<path>` primitive for `PathDrawTransition`.
 */
export const PathDrawPath = forwardRef<SVGPathElement, PathDrawPathProps>(
  ({ animationType, customData, children, className, style, ...rest }, ref) => {
    const animationProps = usePathDrawAnimation(animationType, customData);

    return (
      <MotionPath ref={ref} className={className} style={style} {...animationProps} {...rest}>
        {children as ReactNode}
      </MotionPath>
    );
  },
);

PathDrawPath.displayName = 'PathDrawTransition.Path';
