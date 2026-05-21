'use client';

import { cx } from '@/styled-system/css';
import { circleProgress } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CSSProperties, forwardRef, isValidElement } from 'react';
import { CircleProgressProps } from './CircleProgress.types';
import { DeterminateProgress } from './internal/DeterminateProgress';

/**
 * CircleProgress component displays determinate progress in a circular form.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (circleProgressRecipe), Radix Slot
 * - **Props**: CircleProgressProps
 *
 * @example
 * ```tsx
 * import { CircleProgress } from '@poffy-ui/react/feedback';
 *
 * <CircleProgress value={75} showValue />
 * <CircleProgress value={50} animation="none" />
 * ```
 */
export const CircleProgress = forwardRef<HTMLSpanElement, CircleProgressProps>(
  (
    {
      value,
      size = 100,
      thickness = 8,
      appearance = 'solid',
      intent = 'primary',
      variant,
      animation,
      showValue = false,
      children,
      asChild,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'span';
    const radius = Math.max(1, (size - thickness) / 2);
    const circumference = 2 * Math.PI * radius;

    const classes = circleProgress({ variant: variant ?? intent, appearance, animation });
    const clampedValue = Math.min(100, Math.max(0, value));
    const offset = circumference - (clampedValue / 100) * circumference;
    const hasLabel = [showValue, children].some(Boolean);
    const label = children ?? `${Math.round(clampedValue)}%`;
    const slottableChild = isValidElement(children) ? (
      children
    ) : (
      <span className={classes.label}>{label}</span>
    );

    return (
      <Component
        ref={ref}
        {...props}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          ariaLabel ?? (ariaLabelledBy ? undefined : `Progress ${Math.round(clampedValue)}%`)
        }
        aria-labelledby={ariaLabelledBy}
        className={cx(classes.root, className)}
        style={
          {
            '--circle-size': `${size}px`,
            '--label-size': `${size / 4}px`,
            '--circle-circumference': `${circumference}px`,
            '--circle-offset': `${offset}px`,
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

          <DeterminateProgress
            value={clampedValue}
            size={size}
            thickness={thickness}
            radius={radius}
            circumference={circumference}
            classes={classes}
            animation={animation === 'none' ? 'none' : 'progress'}
          />
        </svg>

        {asChild ? (
          <Slottable>{slottableChild}</Slottable>
        ) : (
          hasLabel && <div className={classes.label}>{label}</div>
        )}
      </Component>
    );
  },
);

CircleProgress.displayName = 'CircleProgress';
