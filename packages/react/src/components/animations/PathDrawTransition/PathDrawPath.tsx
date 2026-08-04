'use client';

import { forwardRef, ReactNode } from 'react';
import { sanitizeControlledMotionProps, sanitizeStaticStyle } from '@/types/motion';
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
    const safeRest = sanitizeControlledMotionProps(rest);

    return (
      <MotionPath
        ref={ref}
        className={className}
        style={sanitizeStaticStyle(style)}
        {...safeRest}
        {...animationProps}
      >
        {children as ReactNode}
      </MotionPath>
    );
  },
);

PathDrawPath.displayName = 'PathDrawTransition.Path';
