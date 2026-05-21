'use client';

import { cx } from '@/styled-system/css';
import { spinner } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { CSSProperties, Suspense, forwardRef, lazy } from 'react';
import { SpinnerProps } from './Spinner.types';

const MotionDash = lazy(() =>
  import('./internal/MotionDash').then((m) => ({ default: m.MotionDash })),
);
const MotionTrail = lazy(() =>
  import('./internal/MotionTrail').then((m) => ({ default: m.MotionTrail })),
);
const MotionElastic = lazy(() =>
  import('./internal/MotionElastic').then((m) => ({ default: m.MotionElastic })),
);
const MotionOrbitGlow = lazy(() =>
  import('./internal/MotionOrbitGlow').then((m) => ({ default: m.MotionOrbitGlow })),
);
const MotionSilver = lazy(() =>
  import('./internal/MotionSilver').then((m) => ({ default: m.MotionSilver })),
);

/**
 * Spinner component displays an indeterminate loading indicator in a circular form.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (spinnerRecipe), Radix Slot, Framer Motion (lazy-loaded)
 * - **Props**: SpinnerProps
 *
 * @example
 * ```tsx
 * import { Spinner } from '@poffy-ui/react/feedback';
 *
 * <Spinner />
 * <Spinner animation="orbit-glow" variant="success" size={48} />
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = 40,
      thickness = 4,
      intent,
      variant,
      animation,
      asChild,
      className,
      style,
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'span';
    const radius = Math.max(1, (size - thickness) / 2);
    const circumference = 2 * Math.PI * radius;

    const isDash = animation === 'dash';
    const isTrail = animation === 'trail';
    const isElastic = animation === 'elastic';
    const isOrbitGlow = animation === 'orbit-glow';
    const isSilver = animation === 'silver';
    const isMotion = [isDash, isTrail, isElastic, isOrbitGlow, isSilver].some(Boolean);

    const resolvedVariant = variant ?? intent;
    const classes = spinner({ variant: resolvedVariant, animation: isMotion ? 'none' : animation });
    const internalProps = { size, thickness, radius, circumference, classes };

    return (
      <Component
        ref={ref}
        {...props}
        role="status"
        aria-label={ariaLabel}
        className={cx(classes.root, className)}
        style={
          {
            '--circumference': `${circumference}px`,
            ...style,
          } as CSSProperties
        }
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={classes.svg}
          aria-hidden="true"
        >
          <circle
            className={classes.track}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={thickness}
          />

          {isMotion ? (
            <Suspense
              fallback={
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={thickness}
                  fill="transparent"
                  className={classes.indicator}
                />
              }
            >
              {isDash ? (
                <MotionDash {...internalProps} />
              ) : isTrail ? (
                <MotionTrail {...internalProps} />
              ) : isElastic ? (
                <MotionElastic {...internalProps} />
              ) : isOrbitGlow ? (
                <MotionOrbitGlow {...internalProps} />
              ) : (
                <MotionSilver {...internalProps} />
              )}
            </Suspense>
          ) : (
            <circle
              className={classes.indicator}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={thickness}
            />
          )}
        </svg>
      </Component>
    );
  },
);

Spinner.displayName = 'Spinner';
