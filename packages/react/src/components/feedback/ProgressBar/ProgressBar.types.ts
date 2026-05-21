import { type FeedbackAppearance, type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';
import { ProgressBarVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';

/**
 * Public fill pattern of the progress bar.
 */
export type ProgressBarPattern = 'simple' | 'dashed';

/**
 * Public geometry control for ProgressBar.
 */
export type ProgressBarShape = 'rounded' | 'square';

/**
 * Semantic accent color for ProgressBar.
 */
export type ProgressBarIntent = Extract<
  SemanticIntent,
  'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
>;

/**
 * Label display position for the progress percentage.
 *
 * ### Notes
 * `auto` chooses an inside label only when there is enough filled
 * width for the estimated label text. Otherwise it resolves to `right`.
 *
 * - 'auto': Automatically determined by thickness (>=16px -> center, <16px -> right)
 * - 'center': Overlaid at the center of the bar
 * - 'right': Displayed to the right of the bar
 * - 'top': Displayed above the bar
 * - 'bottom': Displayed below the bar
 * - 'inside': Displayed inside the progress bar at the right end of the filled part
 */
export type LabelPosition = 'auto' | 'center' | 'right' | 'top' | 'bottom' | 'inside';

/**
 * Variants for the ProgressBar component, driven by Panda CSS recipes.
 *
 * ### Notes
 * Prefer `ProgressBarProps` for app usage. This type mirrors generated
 * recipe variants for wrapper authors.
 */
export type ProgressBarVariants = ProgressBarVariantProps;

/**
 * Base props for the ProgressBar component.
 *
 * @example
 * ```tsx
 * import { ProgressBar } from '@poffy-ui/react/feedback';
 *
 * <ProgressBar progressPercent={64} showProgress aria-label="Import progress" />
 * ```
 *
 * ### Notes
 * Do: provide `aria-label` or `aria-labelledby`; the inner element renders
 * `role="progressbar"`.
 * Don't: use `animationType="load"` when a real percentage is known because
 * indeterminate loading omits `aria-valuenow`.
 *
 * ### AI Usage
 * - Use for determinate linear progress or unknown-duration loading in a single region.
 * - Prefer `progressPercent` over custom children for machine-readable progress state.
 */
export interface ProgressBarOwnProps extends Omit<
  ProgressBarVariants,
  'size' | 'animationType' | 'labelPosition' | 'variant' | 'shape'
> {
  /**
   * Public surface treatment.
   * @defaultValue 'solid'
   */
  appearance?: Extract<FeedbackAppearance, 'solid' | 'soft' | 'outline'>;
  /**
   * Semantic accent color.
   * @defaultValue 'primary'
   */
  intent?: ProgressBarIntent;
  /**
   * Public geometry control.
   * @defaultValue 'rounded'
   */
  shape?: ProgressBarShape;
  /**
   * Legacy semantic variant alias.
   */
  variant?: ProgressBarVariants['variant'];
  /**
   * Public fill pattern.
   * @defaultValue 'simple'
   */
  pattern?: ProgressBarPattern;
  /**
   * Custom label or content to show within the bar.
   *
   * ### Notes
   * The visual label does not name the progressbar by itself. Keep an
   * explicit `aria-label` or `aria-labelledby` on the component.
   */
  children?: ReactNode;
  /**
   * Width of the progress bar in pixels.
   * @defaultValue 300
   */
  size?: number;
  /**
   * Height/thickness of the progress bar in pixels.
   * @defaultValue 10
   */
  thickness?: number;
  /**
   * Progress percentage (0-100).
   * @defaultValue 0
   */
  progressPercent?: number;
  /**
   * Animation type for the progress bar.
   *
   * ### Notes
   * Use `load` for indeterminate progress. Use `false` to disable the
   * fill animation while preserving determinate semantics.
   *
   * @defaultValue 'progress'
   */
  animationType?: 'progress' | 'load' | false;
  /**
   * Whether to show the percentage label.
   * @defaultValue false
   */
  showProgress?: boolean;
  /**
   * Font size for the percentage label.
   */
  fontSize?: string | number;
  /** Border style for the track. */
  borderType?: 'solid' | 'dashed' | 'dotted' | 'none';
  /**
   * Position of the progress label.
   * @defaultValue 'auto'
   */
  labelPosition?: LabelPosition;
}

/**
 * Props for the ProgressBar component.
 * Uses PrimitiveProps to support the asChild (Slot) pattern,
 * replacing the legacy generic `as` prop approach.
 */
export type ProgressBarProps = PrimitiveProps<'span', ProgressBarOwnProps>;
