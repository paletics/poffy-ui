'use client';

import { cx } from '@/styled-system/css';
import { spinner } from '@/styled-system/recipes';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { createNoMotionStyle, sanitizeStaticStyle } from '@/types/motion';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { INTENTS } from '@poffy-ui/types';
import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  cloneElement,
  Fragment,
  Suspense,
  forwardRef,
  isValidElement,
  lazy,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type {
  SpinnerComponent,
  SpinnerProps,
  SpinnerVariants,
} from '@/components/feedback/Spinner/Spinner.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import {
  isReactNodeIterable,
  materializeReactNodeIterable,
} from '@/components/shared/flattenFragmentChildren';

const animations = new Set([
  'spin',
  'dash',
  'breathe',
  'pop-spin',
  'refined-dash',
  'trail',
  'elastic',
  'orbit-glow',
  'silver',
  'none',
]);

const spinnerNativeAsChildElements = new Set(['div', 'output', 'span']);

const isComposableSpinnerHost = (children: ReactNode) =>
  isValidElement(children) &&
  children.type !== Fragment &&
  typeof children.type === 'string' &&
  spinnerNativeAsChildElements.has(children.type);

/** Reduces fallback content to text descendants safe for the status span. */
const getSpinnerFallbackChildren = (children: ReactNode): ReactNode => {
  if (Array.isArray(children)) return children.map(getSpinnerFallbackChildren);
  if (isReactNodeIterable(children))
    return materializeReactNodeIterable(children).map(getSpinnerFallbackChildren);
  if (!isValidElement<{ children?: ReactNode }>(children)) {
    return typeof children === 'object' && children !== null ? null : children;
  }
  return getSpinnerFallbackChildren(children.props.children);
};

const normalizeIntent = (intent: unknown): SpinnerVariants['intent'] =>
  typeof intent === 'string' && INTENTS.includes(intent as (typeof INTENTS)[number])
    ? (intent as SpinnerVariants['intent'])
    : undefined;

const normalizeAnimation = (animation: unknown): NonNullable<SpinnerVariants['animation']> =>
  typeof animation === 'string' && animations.has(animation)
    ? (animation as NonNullable<SpinnerVariants['animation']>)
    : 'spin';

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

const SpinnerImpl = forwardRef<HTMLElement, SpinnerProps>(
  (
    {
      size = 40,
      thickness = 4,
      intent,
      animation,
      decorative = false,
      asChild,
      className,
      style,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-live': ariaLive,
      ...props
    },
    ref,
  ) => {
    const { variant: _unsupportedVariant, ...safeProps } = props as typeof props & {
      variant?: unknown;
    };
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const [canRenderMotion, setCanRenderMotion] = useState(false);

    useEffect(() => {
      const timer = window.setTimeout(() => setCanRenderMotion(true), 0);
      return () => window.clearTimeout(timer);
    }, []);

    const resolvedSize = Number.isFinite(size) && size > 0 ? size : 40;
    const requestedThickness = Number.isFinite(thickness) && thickness > 0 ? thickness : 4;
    const resolvedThickness = Math.min(requestedThickness, Math.max(0, resolvedSize - 1));
    const usesSlot = Boolean(asChild && isComposableSpinnerHost(children));
    const Component = usesSlot ? Slot : 'span';
    const radius = Math.max(0, (resolvedSize - resolvedThickness) / 2);
    const rawCircumference = 2 * Math.PI * radius;
    const circumference = Number.isFinite(rawCircumference) ? rawCircumference : Number.MAX_VALUE;

    const resolvedAnimation = normalizeAnimation(animation);
    const isDash = resolvedAnimation === 'dash';
    const isTrail = resolvedAnimation === 'trail';
    const isElastic = resolvedAnimation === 'elastic';
    const isOrbitGlow = resolvedAnimation === 'orbit-glow';
    const isSilver = resolvedAnimation === 'silver';
    const isMotion =
      canRenderMotion &&
      isAnimating &&
      [isDash, isTrail, isElastic, isOrbitGlow, isSilver].some(Boolean);

    const resolvedVariant = normalizeIntent(intent) ?? 'primary';
    const normalizedAriaLabel = ariaLabel?.trim() || messages.loading;
    const normalizedAriaLabelledBy = ariaLabelledBy?.trim() || undefined;
    const classes = spinner({
      variant: resolvedVariant,
      animation: isAnimating ? (isMotion ? 'none' : resolvedAnimation) : 'none',
    });
    const internalProps = {
      size: resolvedSize,
      thickness: resolvedThickness,
      radius,
      circumference,
      classes,
      motionStyle: resolvedMotionStyle,
    };
    const rootStyle = {
      ...sanitizeStaticStyle(style),
      '--spinner-size': `${resolvedSize}px`,
      '--circumference': `${circumference}px`,
      ...(!isAnimating && createNoMotionStyle()),
    } as CSSProperties;
    const managedStyle = {
      '--spinner-size': `${resolvedSize}px`,
      '--circumference': `${circumference}px`,
      ...(!isAnimating && createNoMotionStyle()),
    } as CSSProperties;
    const staticChild = withNoMotionStyle(children, !isAnimating);
    const slottedChild =
      usesSlot &&
      isValidElement<{
        style?: CSSProperties;
        role?: string;
        inert?: boolean;
        'aria-hidden'?: boolean;
        'aria-label'?: string;
        'aria-labelledby'?: string;
        'aria-live'?: string;
      }>(staticChild)
        ? cloneElement(staticChild, {
            role: decorative ? undefined : 'status',
            inert: decorative ? true : undefined,
            'aria-hidden': decorative,
            'aria-label': decorative || normalizedAriaLabelledBy ? undefined : normalizedAriaLabel,
            'aria-labelledby': decorative ? undefined : normalizedAriaLabelledBy,
            'aria-live': decorative ? undefined : ariaLive,
            style: { ...rootStyle, ...staticChild.props.style, ...managedStyle },
          })
        : staticChild;

    return (
      <Component
        ref={ref}
        {...safeProps}
        role={decorative ? undefined : 'status'}
        aria-label={decorative || normalizedAriaLabelledBy ? undefined : normalizedAriaLabel}
        aria-labelledby={decorative ? undefined : normalizedAriaLabelledBy}
        aria-live={decorative ? undefined : ariaLive}
        aria-hidden={decorative}
        inert={decorative ? true : undefined}
        className={cx(classes.root, className)}
        style={rootStyle}
      >
        <svg
          width={resolvedSize}
          height={resolvedSize}
          viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
          className={classes.svg}
          aria-hidden="true"
        >
          <circle
            className={classes.track}
            cx={resolvedSize / 2}
            cy={resolvedSize / 2}
            r={radius}
            strokeWidth={resolvedThickness}
          />

          {isMotion ? (
            <Suspense
              fallback={
                <circle
                  cx={resolvedSize / 2}
                  cy={resolvedSize / 2}
                  r={radius}
                  strokeWidth={resolvedThickness}
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
              cx={resolvedSize / 2}
              cy={resolvedSize / 2}
              r={radius}
              strokeWidth={resolvedThickness}
            />
          )}
        </svg>
        {usesSlot ? <Slottable>{slottedChild}</Slottable> : getSpinnerFallbackChildren(children)}
      </Component>
    );
  },
);

SpinnerImpl.displayName = 'Spinner';

/**
 * Displays indeterminate loading status.
 *
 * By default it is a `status` region with the active locale's loading name; use `decorative` when
 * nearby content already owns that status, which makes the spinner hidden and inert. Invalid size
 * and thickness values fall back or clamp to a drawable circle. `asChild` accepts only `div`,
 * `output`, and `span`; other child content is reduced to safe text inside the default status host.
 */
export const Spinner = SpinnerImpl as SpinnerComponent;
