'use client';

import { forwardRef, ReactNode } from 'react';
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

    return (
      <MotionPolyline ref={ref} className={className} style={style} {...animationProps} {...rest}>
        {children as ReactNode}
      </MotionPolyline>
    );
  },
);

PathDrawPolyline.displayName = 'PathDrawTransition.Polyline';
