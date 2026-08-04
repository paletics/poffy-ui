import { type FeedbackAppearance, type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

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
export type ProgressBarIntent = SemanticIntent;

/**
 * Label display position for the progress percentage.
 *
 * ### Notes
 * `auto` chooses an inside label only when there is enough filled
 * width for measurable text/native label content. Otherwise it resolves to
 * logical inline-end. Opaque custom label components are not rendered a
 * second time for measurement and therefore resolve to inline-end.
 *
 * - 'auto': Uses an inside label only when the filled width, thickness, and
 *   measurable label width allow it; opaque custom labels resolve to inline-end.
 * - 'center': Overlaid at the center of the bar
 * - 'right': Displayed at the logical inline-end of the bar
 * - 'top': Displayed above the bar
 * - 'bottom': Displayed below the bar
 * - 'inside': Displayed inside the progress bar at the right end of the filled part
 */
export type LabelPosition = 'auto' | 'center' | 'right' | 'top' | 'bottom' | 'inside';

/**
 * Canonical public visual props for ProgressBar.
 *
 * ### Notes
 * Prefer `ProgressBarProps` for app usage. Wrapper authors can use this type
 * without exposing internal or removed recipe axes.
 */
export interface ProgressBarVariants {
  appearance?: Extract<FeedbackAppearance, 'solid' | 'soft' | 'outline'>;
  intent?: ProgressBarIntent;
  shape?: ProgressBarShape;
  pattern?: ProgressBarPattern;
  animationType?: 'progress' | 'load' | false;
  borderType?: 'solid' | 'dashed' | 'dotted' | 'none';
  labelPosition?: LabelPosition;
}

/**
 * Props for determinate linear progress or indeterminate loading. Supply `aria-label` or
 * `aria-labelledby`; choose indeterminate loading only when no meaningful current value is known.
 */
export interface ProgressBarOwnProps extends ProgressBarVariants {
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
   * Public fill pattern.
   * @defaultValue 'simple'
   */
  pattern?: ProgressBarPattern;
  /**
   * Custom visual label shown when `showProgress` is enabled.
   *
   * ### Notes
   * Native element wrappers are reduced to their text descendants. Custom
   * label components are preserved inside an inert, display-only subtree.
   * The visual label does not name the progressbar by itself. Keep an explicit
   * `aria-label` or `aria-labelledby` on the component.
   */
  label?: ReactNode;
  /**
   * Width of the progress bar. Positive finite numbers are interpreted as
   * pixels; non-empty strings are passed through as CSS widths. Invalid
   * numbers and blank strings fall back to `300px`.
   * @defaultValue 300
   */
  size?: number | string;
  /**
   * Height/thickness of the progress bar in pixels. Invalid values fall back to 10.
   * @defaultValue 10
   */
  thickness?: number;
  /**
   * Progress percentage (0-100). Non-finite values render as 0; finite
   * out-of-range values are clamped.
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
   * When omitted, the label uses a thickness-based size clamped to 12–16px.
   * Explicit values are supported for compact compositions; keep ordinary
   * visible text at 12px or above. The progress value remains available via
   * the component's ARIA semantics regardless of visual label size.
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
 * Default span-host props for ProgressBar.
 */
type ProgressBarNativeProps = Omit<
  PrimitiveProps<'span', ProgressBarOwnProps>,
  'aria-valuemax' | 'aria-valuemin' | 'aria-valuenow' | 'children' | 'role'
>;
interface ProgressBarManagedSemantics {
  role?: never;
  'aria-valuemax'?: never;
  'aria-valuemin'?: never;
  'aria-valuenow'?: never;
}

/** Props for ProgressBar rendered with its default host. */
export type ProgressBarDefaultProps = DefaultHostProps<ProgressBarNativeProps> &
  ProgressBarManagedSemantics & {
    /** Children are reserved for the delegated host branch. Use `label` for visual text. */
    children?: never;
  };

/**
 * Delegated flow-container props for ProgressBar.
 *
 * The child is the outer host only; use `label` for the visual progress label.
 */
export type ProgressBarAsChildProps = RetargetedAsChildHostProps<
  ProgressBarNativeProps,
  HTMLElement
> &
  ProgressBarManagedSemantics;

/** Public ProgressBar props with distinct default and delegated host branches. */
export type ProgressBarProps = ProgressBarDefaultProps | ProgressBarAsChildProps;

/** Callable ProgressBar contract preserving default and delegated host refs. */
export type ProgressBarComponent = PolymorphicAsChildComponent<
  ProgressBarDefaultProps,
  ProgressBarAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;
