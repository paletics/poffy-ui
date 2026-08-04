'use client';

import { Slot } from '@radix-ui/react-slot';
import { INTENTS } from '@poffy-ui/types';
import { cx } from '@/styled-system/css';
import { progressBar } from '@/styled-system/recipes';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { createNoMotionStyle, sanitizeStaticStyle } from '@/types/motion';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getProgressBarLabels } from './ProgressBar.locales';
import {
  cloneElement,
  Fragment,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type ReactNode,
  useRef,
} from 'react';
import type {
  LabelPosition,
  ProgressBarComponent,
  ProgressBarIntent,
  ProgressBarProps,
} from '@/components/feedback/ProgressBar/ProgressBar.types';
import { useProgressLabelPlacement } from './useProgressLabelPlacement';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const MIN_INSIDE_THICKNESS = 16;
const LABEL_HORIZONTAL_PADDING = 16;
const AUTO_POSITION_HYSTERESIS = 2;
const AVERAGE_CHARACTER_WIDTH = 0.62;
const LOAD_PROGRESS_PERCENT = 70.7;
const progressBarAppearances = new Set(['solid', 'soft', 'outline']);
const progressBarShapes = new Set(['rounded', 'square']);
const progressBarPatterns = new Set(['simple', 'dashed']);
const progressBarBorderTypes = new Set(['solid', 'dashed', 'dotted', 'none']);
const progressBarLabelPositions = new Set(['auto', 'center', 'right', 'top', 'bottom', 'inside']);
type ResolvedLabelPosition = Exclude<LabelPosition, 'auto'>;
// Native and custom hosts must accept the span-based progressbar subtree.
// Native elements are restricted to known flow containers; custom components
// must forward props and refs to an HTML flow container.
const safeProgressBarAsChildNativeElements = new Set([
  'article',
  'aside',
  'blockquote',
  'div',
  'figcaption',
  'figure',
  'footer',
  'header',
  'main',
  'nav',
  'p',
  'section',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);
const isSafeProgressBarAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  children.type !== Fragment &&
  (typeof children.type === 'string'
    ? safeProgressBarAsChildNativeElements.has(children.type)
    : true);

const clampProgress = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

const normalizeIntent = (intent: unknown): ProgressBarIntent | undefined =>
  typeof intent === 'string' && INTENTS.includes(intent as (typeof INTENTS)[number])
    ? (intent as ProgressBarIntent)
    : undefined;

const normalizeStringValue = <T extends string>(
  value: unknown,
  values: Set<string>,
  fallback: T,
): T => (typeof value === 'string' && values.has(value) ? (value as T) : fallback);

const normalizeAnimationType = (value: unknown): 'progress' | 'load' | false =>
  value === 'progress' || value === 'load' || value === false ? value : 'progress';

const normalizeProgressWidth = (
  size: number | string,
): { cssWidth: string; estimatedWidth?: number } => {
  if (typeof size === 'number') {
    const estimatedWidth = Number.isFinite(size) && size > 0 ? size : 300;
    return { cssWidth: `${estimatedWidth}px`, estimatedWidth };
  }

  const cssWidth = size.trim();
  return cssWidth ? { cssWidth } : { cssWidth: '300px', estimatedWidth: 300 };
};

const getLabelText = (label: ProgressBarProps['label'], progressPercent: number) => {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }

  return `${progressPercent}%`;
};

/**
 * Flattens native wrappers, whose content model may be invalid inside the label span,
 * while preserving custom components so public ReactNode labels keep rendering.
 */
const getSafeProgressLabelChildren = (children: ReactNode): ReactNode => {
  if (Array.isArray(children)) return children.map(getSafeProgressLabelChildren);
  if (!isValidElement<{ children?: ReactNode }>(children)) {
    return typeof children === 'object' && children !== null ? null : children;
  }
  return getSafeProgressLabelChildren(children.props.children);
};

const resolveLabelPosition = ({
  animationType,
  fontSize,
  label,
  labelPosition,
  progressPercent,
  showProgress,
  size,
  thickness,
}: Pick<
  ProgressBarProps,
  'animationType' | 'fontSize' | 'label' | 'labelPosition' | 'progressPercent' | 'showProgress'
> & {
  size?: number;
  thickness: number;
}): ResolvedLabelPosition => {
  if (labelPosition !== 'auto') {
    return labelPosition ?? 'right';
  }

  if (!showProgress || thickness < MIN_INSIDE_THICKNESS) {
    return 'right';
  }

  // CSS lengths such as percentages and container-query units cannot be
  // estimated before layout. Start outside, then let measurement correct it.
  if (size === undefined) return 'right';

  const resolvedFontSize =
    typeof fontSize === 'number' ? fontSize : Math.min(16, Math.max(12, thickness * 0.65));
  const labelText = getLabelText(label, progressPercent ?? 0);
  const estimatedLabelWidth =
    labelText.length * resolvedFontSize * AVERAGE_CHARACTER_WIDTH + LABEL_HORIZONTAL_PADDING;
  const availableProgressPercent =
    animationType === 'load' ? LOAD_PROGRESS_PERCENT : clampProgress(progressPercent ?? 0);
  const availableBarWidth = size * (availableProgressPercent / 100);

  return availableBarWidth >= estimatedLabelWidth ? 'inside' : 'right';
};

const ProgressBarImpl = forwardRef<HTMLElement, ProgressBarProps>((publicProps, ref) => {
  const props = publicProps as ProgressBarProps & { variant?: unknown };
  const {
    asChild,
    children,
    label,
    appearance = 'solid',
    intent = 'primary',
    variant: _unsupportedVariant,
    size = 300,
    thickness = 10,
    progressPercent = 0,
    animationType = 'progress',
    showProgress = false,
    fontSize,
    borderType,
    shape = 'rounded',
    pattern = 'simple',
    labelPosition = 'auto',
    className,
    style,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-valuetext': ariaValueText,
    role: _managedRole,
    'aria-valuenow': _managedAriaValueNow,
    'aria-valuemin': _managedAriaValueMin,
    'aria-valuemax': _managedAriaValueMax,
    ...rest
  } = props as ProgressBarProps & {
    variant?: unknown;
    role?: unknown;
    'aria-valuenow'?: unknown;
    'aria-valuemin'?: unknown;
    'aria-valuemax'?: unknown;
  };

  const { isAnimating } = useOptionalAnimation();
  const locale = useOptionalLocale()?.locale;
  const labels = getProgressBarLabels(locale);
  const resolvedIntent = normalizeIntent(intent) ?? 'primary';
  const resolvedAppearance = normalizeStringValue(appearance, progressBarAppearances, 'solid');
  const resolvedShape = normalizeStringValue(shape, progressBarShapes, 'rounded');
  const resolvedPattern = normalizeStringValue(pattern, progressBarPatterns, 'simple');
  const resolvedBorderType =
    borderType === undefined
      ? undefined
      : normalizeStringValue(borderType, progressBarBorderTypes, 'none');
  const requestedLabelPosition = normalizeStringValue(
    labelPosition,
    progressBarLabelPositions,
    'auto',
  );
  const normalizedAnimationType = normalizeAnimationType(animationType);
  const { cssWidth, estimatedWidth } = normalizeProgressWidth(size);
  const normalizedThickness = Number.isFinite(thickness) && thickness > 0 ? thickness : 10;
  const normalizedFontSize =
    typeof fontSize === 'number' && Number.isFinite(fontSize) && fontSize > 0
      ? fontSize
      : undefined;
  const shouldUseSlot = asChild && isSafeProgressBarAsChildHost(children);
  const Component = shouldUseSlot ? Slot : 'span';
  const staticChild = withNoMotionStyle(children, !isAnimating);
  const materializedLabel = materializeReactNodeTree(label);
  const safeLabel = getSafeProgressLabelChildren(materializedLabel);
  const clampedProgressPercent = clampProgress(progressPercent);
  const visualProgressPercent =
    normalizedAnimationType === 'load' ? LOAD_PROGRESS_PERCENT : clampedProgressPercent;
  const font = Math.min(16, Math.max(12, normalizedThickness * 0.65));
  const resolvedAnimationType = isAnimating ? normalizedAnimationType : false;
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;
  const normalizedAriaLabelledBy = ariaLabelledBy?.trim() || undefined;
  const normalizedAriaValueText = ariaValueText?.trim() || undefined;
  const defaultLabel =
    normalizedAnimationType === 'load' ? labels.loading : `${clampedProgressPercent}%`;
  const estimatedLabelPosition = resolveLabelPosition({
    animationType: normalizedAnimationType,
    fontSize: typeof fontSize === 'string' ? fontSize : normalizedFontSize,
    label: safeLabel,
    labelPosition: requestedLabelPosition,
    progressPercent: clampedProgressPercent,
    showProgress,
    size: estimatedWidth,
    thickness: normalizedThickness,
  });
  const measurementKey = JSON.stringify([
    cssWidth,
    defaultLabel,
    fontSize,
    normalizedAnimationType,
    normalizedThickness,
    requestedLabelPosition,
    showProgress,
    visualProgressPercent,
  ]);
  const progressRootRef = useRef<HTMLSpanElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);
  const resolvedLabelPosition = useProgressLabelPlacement({
    barRef: progressRootRef,
    enabled: requestedLabelPosition === 'auto' && showProgress,
    estimatedPosition: estimatedLabelPosition,
    fillPercent: visualProgressPercent,
    hysteresis: AUTO_POSITION_HYSTERESIS,
    inlinePadding: LABEL_HORIZONTAL_PADDING,
    label,
    measurementKey,
    measurementRef,
  });

  const classes = progressBar({
    intent: resolvedIntent,
    appearance: resolvedAppearance,
    shape: resolvedShape,
    pattern: resolvedPattern,
    animationType: resolvedAnimationType === false ? 'none' : resolvedAnimationType,
    borderType: resolvedBorderType,
    labelPosition: resolvedLabelPosition,
  });

  const content = (
    <>
      <span
        ref={progressRootRef}
        className={classes.root}
        data-intent={resolvedIntent}
        data-progressbar-intent={resolvedIntent}
        data-progressbar-animation={isAnimating ? normalizedAnimationType : 'none'}
        role="progressbar"
        aria-valuenow={normalizedAnimationType === 'load' ? undefined : clampedProgressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={
          normalizedAriaValueText ??
          (normalizedAnimationType === 'load' ? undefined : `${clampedProgressPercent}%`)
        }
        aria-label={
          normalizedAriaLabel ??
          (normalizedAriaLabelledBy
            ? undefined
            : normalizedAnimationType === 'load'
              ? labels.loadingProgress
              : labels.progress)
        }
        aria-labelledby={normalizedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <span className={classes.track} data-intent={resolvedIntent} />
        <span className={classes.bar} data-intent={resolvedIntent} data-testid="progress-bar-bar" />
      </span>
      {showProgress && (
        <span
          className={classes.label}
          data-progressbar-label-position={resolvedLabelPosition}
          inert
        >
          {safeLabel ?? defaultLabel}
        </span>
      )}
      {showProgress && requestedLabelPosition === 'auto' ? (
        <span
          ref={measurementRef}
          className={classes.measurement}
          data-progressbar-label-measurement=""
          aria-hidden="true"
          inert
        >
          {safeLabel ?? defaultLabel}
        </span>
      ) : null}
    </>
  );
  const rootStyle = {
    ...sanitizeStaticStyle(style),
    '--progress-width': cssWidth,
    '--progress-height': `${normalizedThickness}px`,
    '--progress-bar-width': `${visualProgressPercent}%`,
    '--progress-font-size':
      typeof fontSize === 'string' ? fontSize : `${normalizedFontSize ?? font}px`,
    ...(!isAnimating && createNoMotionStyle()),
  } as CSSProperties;
  const managedStyle = {
    '--progress-width': cssWidth,
    '--progress-height': `${normalizedThickness}px`,
    '--progress-bar-width': `${visualProgressPercent}%`,
    '--progress-font-size':
      typeof fontSize === 'string' ? fontSize : `${normalizedFontSize ?? font}px`,
    ...(!isAnimating && createNoMotionStyle()),
  } as CSSProperties;
  const slottedContent =
    shouldUseSlot && isValidElement<{ style?: CSSProperties }>(staticChild)
      ? cloneElement(
          staticChild,
          { style: { ...rootStyle, ...staticChild.props.style, ...managedStyle } },
          content,
        )
      : content;

  return (
    <Component ref={ref} {...rest} className={cx(classes.container, className)} style={rootStyle}>
      {slottedContent}
    </Component>
  );
});

ProgressBarImpl.displayName = 'ProgressBar';

/**
 * Visualizes linear determinate progress or indeterminate loading. Provide an accessible name;
 * indeterminate mode intentionally omits `aria-valuenow`.
 */
export const ProgressBar = ProgressBarImpl as ProgressBarComponent;
