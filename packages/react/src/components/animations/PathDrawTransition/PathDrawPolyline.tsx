'use client';

import { forwardRef, ReactNode } from 'react';
import { sanitizeControlledMotionProps, sanitizeStaticStyle } from '@/types/motion';
import { getMotionComponent } from '../utils';
import { usePathDrawAnimation } from './PathDrawTransitionContext';
import type { PathDrawPolylineProps } from './PathDrawTransition.types';

const MotionPolyline = getMotionComponent('polyline');

/**
 * Animated SVG `<polyline>` primitive for `PathDrawTransition`.
 */
export const PathDrawPolyline = forwardRef<SVGPolylineElement, PathDrawPolylineProps>(
  ({ animationType, customData, children, className, style, ...rest }, ref) => {
    const animationProps = usePathDrawAnimation(animationType, customData);
    const safeRest = sanitizeControlledMotionProps(rest);

    return (
      <MotionPolyline
        ref={ref}
        className={className}
        style={sanitizeStaticStyle(style)}
        {...safeRest}
        {...animationProps}
      >
        {children as ReactNode}
      </MotionPolyline>
    );
  },
);

PathDrawPolyline.displayName = 'PathDrawTransition.Polyline';
