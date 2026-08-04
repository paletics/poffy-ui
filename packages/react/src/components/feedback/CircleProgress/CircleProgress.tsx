'use client';

import { cx } from '@/styled-system/css';
import { circleProgress } from '@/styled-system/recipes';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { createNoMotionStyle, sanitizeStaticStyle } from '@/types/motion';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { INTENTS } from '@poffy-ui/types';
import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  cloneElement,
  type CSSProperties,
  Fragment,
  forwardRef,
  isValidElement,
  type ReactNode,
} from 'react';
import type {
  CircleProgressComponent,
  CircleProgressProps,
  CircleProgressVariants,
} from '@/components/feedback/CircleProgress/CircleProgress.types';
import {
  isReactNodeIterable,
  materializeReactNodeIterable,
} from '@/components/shared/flattenFragmentChildren';
import { DeterminateProgress } from '@/components/feedback/CircleProgress/internal/DeterminateProgress';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const circleProgressAnimations = new Set(['progress', 'none']);
const circleProgressAppearances = new Set(['solid', 'soft']);
const circleProgressNativeAsChildElements = new Set(['div', 'output', 'span']);

const isComposableCircleProgressHost = (children: ReactNode) =>
  isValidElement(children) &&
  children.type !== Fragment &&
  typeof children.type === 'string' &&
  circleProgressNativeAsChildElements.has(children.type);

const normalizeIntent = (intent: unknown): CircleProgressVariants['intent'] =>
  typeof intent === 'string' && INTENTS.includes(intent as (typeof INTENTS)[number])
    ? (intent as CircleProgressVariants['intent'])
    : undefined;

const normalizeAppearance = (
  appearance: unknown,
): NonNullable<CircleProgressVariants['appearance']> =>
  typeof appearance === 'string' && circleProgressAppearances.has(appearance)
    ? (appearance as NonNullable<CircleProgressVariants['appearance']>)
    : 'solid';

const normalizeAnimation = (
  animation: unknown,
): NonNullable<CircleProgressVariants['animation']> =>
  typeof animation === 'string' && circleProgressAnimations.has(animation)
    ? (animation as NonNullable<CircleProgressVariants['animation']>)
    : 'progress';

const normalizeAriaText = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed === '' ? undefined : trimmed;
};

/** Removes element wrappers so progress labels cannot contain flow or interactive descendants. */
const getSafeCircleProgressLabelChildren = (children: ReactNode): ReactNode => {
  if (Array.isArray(children)) return children.map(getSafeCircleProgressLabelChildren);
  if (isReactNodeIterable(children))
    return materializeReactNodeIterable(children).map(getSafeCircleProgressLabelChildren);
  if (!isValidElement<{ children?: ReactNode }>(children)) {
    return typeof children === 'object' && children !== null ? null : children;
  }
  return getSafeCircleProgressLabelChildren(children.props.children);
};

const CircleProgressImpl = forwardRef<HTMLElement, CircleProgressProps>(
  (
    {
      value,
      size = 100,
      thickness = 8,
      appearance = 'solid',
      intent = 'primary',
      animation,
      showValue = false,
      children,
      asChild,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-valuetext': ariaValueText,
      ...props
    },
    ref,
  ) => {
    const { variant: _unsupportedVariant, ...safeProps } = props as typeof props & {
      variant?: unknown;
    };
    const { isAnimating } = useOptionalAnimation();
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const normalizedValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    const normalizedSize = Number.isFinite(size) && size > 0 ? size : 100;
    const maximumThickness = Math.max(0, normalizedSize - 2);
    const normalizedThickness =
      Number.isFinite(thickness) && thickness >= 0
        ? Math.min(thickness, maximumThickness)
        : Math.min(8, maximumThickness);
    const canUseAsChild = Boolean(asChild && isComposableCircleProgressHost(children));
    const hasUnsafeAsChild = asChild && !canUseAsChild;
    const Component = canUseAsChild ? Slot : 'span';
    const radius = Math.max(1, (normalizedSize - normalizedThickness) / 2);
    const rawCircumference = 2 * Math.PI * radius;
    const circumference = Number.isFinite(rawCircumference) ? rawCircumference : Number.MAX_VALUE;

    const resolvedAnimation = isAnimating ? normalizeAnimation(animation) : 'none';
    const normalizedAriaLabel = normalizeAriaText(ariaLabel);
    const normalizedAriaLabelledBy = normalizeAriaText(ariaLabelledBy);
    const normalizedAriaValueText = normalizeAriaText(ariaValueText);
    const classes = circleProgress({
      variant: normalizeIntent(intent) ?? 'primary',
      appearance: normalizeAppearance(appearance),
      animation: resolvedAnimation,
    });
    const offset = circumference - (normalizedValue / 100) * circumference;
    const safeLabelChildren = getSafeCircleProgressLabelChildren(children);
    const hasCustomLabel =
      !hasUnsafeAsChild &&
      safeLabelChildren !== null &&
      safeLabelChildren !== undefined &&
      safeLabelChildren !== false;
    const hasLabel = [showValue, hasCustomLabel].some(Boolean);
    const label = hasUnsafeAsChild
      ? `${Math.round(normalizedValue)}%`
      : (safeLabelChildren ?? `${Math.round(normalizedValue)}%`);
    const staticChild = withNoMotionStyle(children, !isAnimating);
    const rootStyle = {
      ...sanitizeStaticStyle(style),
      '--circle-size': `${normalizedSize}px`,
      '--label-size': `${normalizedSize / 4}px`,
      '--circle-circumference': `${circumference}px`,
      '--circle-offset': `${offset}px`,
      ...(!isAnimating && createNoMotionStyle()),
    } as CSSProperties;
    const managedStyle = {
      '--circle-size': `${normalizedSize}px`,
      '--label-size': `${normalizedSize / 4}px`,
      '--circle-circumference': `${circumference}px`,
      '--circle-offset': `${offset}px`,
      ...(!isAnimating && createNoMotionStyle()),
    } as CSSProperties;
    const asChildLabel =
      canUseAsChild && isValidElement<{ children?: ReactNode }>(staticChild)
        ? (getSafeCircleProgressLabelChildren(staticChild.props.children) ??
          (showValue ? label : undefined))
        : undefined;
    const asChildHost =
      canUseAsChild &&
      isValidElement<{
        children?: ReactNode;
        style?: CSSProperties;
        role?: string;
        'aria-label'?: string;
        'aria-labelledby'?: string;
        'aria-valuemax'?: number;
        'aria-valuemin'?: number;
        'aria-valuenow'?: number;
        'aria-valuetext'?: string;
        'aria-hidden'?: boolean;
        inert?: boolean;
      }>(staticChild)
        ? cloneElement(
            staticChild,
            {
              role: 'progressbar',
              'aria-valuenow': normalizedValue,
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              'aria-valuetext': normalizedAriaValueText ?? `${Math.round(normalizedValue)}%`,
              'aria-label':
                normalizedAriaLabel ?? (normalizedAriaLabelledBy ? undefined : messages.progress),
              'aria-labelledby': normalizedAriaLabelledBy,
              'aria-hidden': false,
              inert: undefined,
              style: { ...rootStyle, ...staticChild.props.style, ...managedStyle },
            },
            asChildLabel === undefined ? undefined : (
              <span className={classes.label}>{asChildLabel}</span>
            ),
          )
        : staticChild;
    const slottableChild = isValidElement(asChildHost) ? (
      asChildHost
    ) : (
      <span className={classes.label}>{label}</span>
    );

    return (
      <Component
        ref={ref}
        {...safeProps}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={normalizedAriaValueText ?? `${Math.round(normalizedValue)}%`}
        aria-label={
          normalizedAriaLabel ?? (normalizedAriaLabelledBy ? undefined : messages.progress)
        }
        aria-labelledby={normalizedAriaLabelledBy}
        aria-hidden={false}
        inert={undefined}
        className={cx(classes.root, className)}
        style={rootStyle}
      >
        <svg
          width={normalizedSize}
          height={normalizedSize}
          viewBox={`0 0 ${normalizedSize} ${normalizedSize}`}
          className={classes.svg}
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className={classes.track}
            cx={normalizedSize / 2}
            cy={normalizedSize / 2}
            r={radius}
            strokeWidth={normalizedThickness}
          />

          <DeterminateProgress
            size={normalizedSize}
            thickness={normalizedThickness}
            radius={radius}
            classes={classes}
          />
        </svg>

        {canUseAsChild ? (
          <Slottable>{slottableChild}</Slottable>
        ) : (
          hasLabel && <span className={classes.label}>{label}</span>
        )}
      </Component>
    );
  },
);

CircleProgressImpl.displayName = 'CircleProgress';

/**
 * Visualizes determinate progress from 0 through 100 as a circular `progressbar`.
 *
 * Non-finite values become 0 and finite values clamp to the supported range. The component always
 * exposes `aria-valuenow`, with a localized “Progress” fallback name and percentage value text.
 * `showValue` or safe text children display a center label; `asChild` accepts only `div`,
 * `output`, and `span` and strips unsafe label descendants.
 */
export const CircleProgress = CircleProgressImpl as CircleProgressComponent;
