'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { progressBar } from '@/styled-system/recipes';
import { CSSProperties, cloneElement, forwardRef, isValidElement } from 'react';
import type { LabelPosition, ProgressBarProps } from './ProgressBar.types';

const MIN_INSIDE_THICKNESS = 16;
const LABEL_HORIZONTAL_PADDING = 16;
const AVERAGE_CHARACTER_WIDTH = 0.62;
const LOAD_PROGRESS_PERCENT = 70.7;
type ResolvedLabelPosition = Exclude<LabelPosition, 'auto'>;

const clampProgress = (value: number) => Math.min(100, Math.max(0, value));

const getLabelText = (children: ProgressBarProps['children'], progressPercent: number) => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  return `${progressPercent}%`;
};

const resolveLabelPosition = ({
  animationType,
  children,
  fontSize,
  labelPosition,
  progressPercent,
  showProgress,
  size,
  thickness,
}: Pick<
  ProgressBarProps,
  'animationType' | 'children' | 'fontSize' | 'labelPosition' | 'progressPercent' | 'showProgress'
> & {
  size: number;
  thickness: number;
}): ResolvedLabelPosition => {
  if (labelPosition !== 'auto') {
    return labelPosition ?? 'right';
  }

  if (!showProgress || thickness < MIN_INSIDE_THICKNESS) {
    return 'right';
  }

  const resolvedFontSize =
    typeof fontSize === 'number' ? fontSize : Math.min(16, Math.max(12, thickness * 0.65));
  const labelText = getLabelText(children, progressPercent ?? 0);
  const estimatedLabelWidth =
    labelText.length * resolvedFontSize * AVERAGE_CHARACTER_WIDTH + LABEL_HORIZONTAL_PADDING;
  const availableProgressPercent =
    animationType === 'load' ? LOAD_PROGRESS_PERCENT : clampProgress(progressPercent ?? 0);
  const availableBarWidth = size * (availableProgressPercent / 100);

  return availableBarWidth >= estimatedLabelWidth ? 'inside' : 'right';
};

/**
 * Displays task completion or loading progress as a linear bar.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: progressBar), Radix Slot
 * ### Design Tokens
 * - size/thickness: expressed as CSS custom properties driven by props.
 * ### Variant Logic
 * - variant: primary/secondary/success/danger communicates urgency and status.
 * ### Variant Logic
 * - animationType: progress=fill animation, indeterminate=continuous loop.
 * ### Variant Logic
 * - shape: simple=flat, striped=diagonal pattern.
 * ### Notes
 * Uses CSS custom properties (--progress-width, --progress-bar-width) for dimensions.
 * ### Accessibility
 * - Must set `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
 * ### AI Usage
 * - Use for determinate (known %) and indeterminate (unknown duration) loading states.
 *
 * @example Determinate upload progress
 * ```tsx
 * import { ProgressBar } from '@poffy-ui/react/feedback';
 *
 * <ProgressBar progressPercent={72} showProgress aria-label="Upload progress" />
 * ```
 */
export const ProgressBar = forwardRef<HTMLElement, ProgressBarProps>((props, ref) => {
  const {
    asChild,
    children,
    appearance = 'solid',
    intent = 'primary',
    variant = 'primary',
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
    ...rest
  } = props;

  const shouldUseSlot = asChild && isValidElement(children);
  const Component = shouldUseSlot ? Slot : 'span';
  const labelChildren = shouldUseSlot ? undefined : children;
  const clampedProgressPercent = clampProgress(progressPercent);
  const font = Math.min(16, Math.max(12, thickness * 0.65));
  const resolvedLabelPosition = resolveLabelPosition({
    animationType,
    children: labelChildren,
    fontSize,
    labelPosition,
    progressPercent: clampedProgressPercent,
    showProgress,
    size,
    thickness,
  });

  const classes = progressBar({
    variant: variant ?? intent,
    appearance,
    shape,
    pattern,
    animationType: animationType === false ? undefined : animationType,
    borderType,
    labelPosition: resolvedLabelPosition,
  });

  const content = (
    <>
      <div
        className={classes.root}
        data-variant={variant ?? intent}
        data-progressbar-variant={variant ?? intent}
        data-progressbar-animation={animationType}
        role="progressbar"
        aria-valuenow={animationType === 'load' ? undefined : clampedProgressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          ariaLabel ??
          (ariaLabelledBy
            ? undefined
            : animationType === 'load'
              ? 'Loading progress'
              : `Progress ${clampedProgressPercent}%`)
        }
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <div className={classes.track} data-variant={variant} />
        <div className={classes.bar} data-variant={variant} data-testid="progress-bar-bar">
          {showProgress && resolvedLabelPosition === 'inside' && (
            <div className={classes.label}>{labelChildren ?? `${clampedProgressPercent}%`}</div>
          )}
        </div>
        {showProgress && resolvedLabelPosition === 'center' && (
          <div className={classes.label}>{labelChildren ?? `${clampedProgressPercent}%`}</div>
        )}
      </div>
      {showProgress && resolvedLabelPosition !== 'center' && resolvedLabelPosition !== 'inside' && (
        <div className={classes.label}>{labelChildren ?? `${clampedProgressPercent}%`}</div>
      )}
    </>
  );

  return (
    <Component
      ref={ref}
      {...rest}
      className={cx(classes.container, className)}
      style={
        {
          '--progress-width': `${size}px`,
          '--progress-height': `${thickness}px`,
          '--progress-bar-width': `${clampedProgressPercent}%`,
          '--progress-font-size': typeof fontSize === 'string' ? fontSize : `${fontSize ?? font}px`,
          ...style,
        } as CSSProperties
      }
    >
      {shouldUseSlot ? cloneElement(children, undefined, content) : content}
    </Component>
  );
});

ProgressBar.displayName = 'ProgressBar';
