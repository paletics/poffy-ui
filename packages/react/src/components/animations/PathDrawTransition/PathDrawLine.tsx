'use client';

import { forwardRef, ReactNode } from 'react';
import { getMotionComponent } from '../utils';
import { usePathDrawAnimation } from './PathDrawTransitionContext';
import type { PathDrawLineProps } from './PathDrawTransition.types';

const MotionLine = getMotionComponent('line');

/**
 * Animated SVG `<line>` primitive for `PathDrawTransition`.
 */
export const PathDrawLine = forwardRef<SVGLineElement, PathDrawLineProps>(
  ({ animationType, customData, children, className, style, ...rest }, ref) => {
    const animationProps = usePathDrawAnimation(animationType, customData);

    return (
      <MotionLine ref={ref} className={className} style={style} {...animationProps} {...rest}>
        {children as ReactNode}
      </MotionLine>
    );
  },
);

PathDrawLine.displayName = 'PathDrawTransition.Line';
