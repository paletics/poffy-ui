'use client';

import { forwardRef, ReactNode, useMemo } from 'react';
import { sanitizeControlledMotionProps, sanitizeStaticStyle } from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { PathDrawContext } from './PathDrawTransitionContext';
import { pathDrawVariants } from './PathDrawTransition.presets';
import { PathDrawLine } from './PathDrawLine';
import { PathDrawPath } from './PathDrawPath';
import { PathDrawPolyline } from './PathDrawPolyline';
import type { PathDrawTransitionProps } from './PathDrawTransition.types';

const MotionSvg = getMotionComponent('svg');

const PathDrawTransitionRoot = forwardRef<SVGSVGElement, PathDrawTransitionProps>(
  (
    { animationType = 'draw', isVisible = true, customData, children, className, style, ...rest },
    ref,
  ) => {
    const resolvedAnimationType = resolvePresetKey(pathDrawVariants, animationType, 'draw');
    const contextValue = useMemo(
      () => ({ animationType: resolvedAnimationType, customData, isVisible }),
      [resolvedAnimationType, customData, isVisible],
    );
    const safeRest = sanitizeControlledMotionProps(rest);

    return (
      <PathDrawContext.Provider value={contextValue}>
        <MotionSvg
          ref={ref}
          className={className}
          style={sanitizeStaticStyle(style)}
          data-visible={isVisible}
          {...safeRest}
        >
          {children as ReactNode}
        </MotionSvg>
      </PathDrawContext.Provider>
    );
  },
);

PathDrawTransitionRoot.displayName = 'PathDrawTransition';

/** Animates stroked SVG `Path`, `Line`, and `Polyline` children; label meaningful SVGs or mark decorative ones hidden. */
export const PathDrawTransition = Object.assign(PathDrawTransitionRoot, {
  Line: PathDrawLine,
  Path: PathDrawPath,
  Polyline: PathDrawPolyline,
});
