'use client';

import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { PathDrawContext } from './PathDrawTransitionContext';
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
    const contextValue = useMemo(
      () => ({ animationType, customData }),
      [animationType, customData],
    );

    return (
      <PathDrawContext.Provider value={contextValue}>
        <MotionSvg
          ref={ref}
          className={className}
          style={style}
          data-visible={isVisible}
          initial={false}
          animate={isVisible ? 'animate' : 'exit'}
          {...rest}
        >
          {children as ReactNode}
        </MotionSvg>
      </PathDrawContext.Provider>
    );
  },
);

PathDrawTransitionRoot.displayName = 'PathDrawTransition';

/**
 * Compound SVG path drawing component.
 * Use for stroked SVG icons, status glyphs, and indicators that reveal through path drawing.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules
 * - Stack: Framer Motion SVG primitives, React Context, compound path primitives
 *
 * ### Design Tokens
 * - Motion timing comes from `pathDrawVariants`.
 * - Stroke color, width, and sizing stay on the SVG or child primitives.
 *
 * ### Variant Logic
 * - `draw`: Spring-like stroke reveal for checkmarks and confirmation glyphs.
 * - `dash`: Slower stroke reveal for progress-like paths or illustrative lines.
 * - `instant`: Static reveal when path animation should be suppressed.
 *
 * ### Accessibility
 * - Respects reduced motion by disabling path animation.
 * - Add `aria-hidden="true"` for decorative SVGs or provide an accessible name when the drawing carries meaning.
 *
 * ### AI Usage
 * - **DO**: Use `Path`, `Line`, or `Polyline` children so animation props can be inherited from the root.
 * - **DON'T**: Use for filled SVG shapes; presets target stroked paths.
 *
 * @example
 * ```tsx
 * import { PathDrawTransition } from '@poffy-ui/react';
 *
 * <PathDrawTransition viewBox="0 0 24 24" aria-hidden="true">
 *   <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
 * </PathDrawTransition>
 * ```
 */
export const PathDrawTransition = Object.assign(PathDrawTransitionRoot, {
  Line: PathDrawLine,
  Path: PathDrawPath,
  Polyline: PathDrawPolyline,
});
