import { type FeedbackAppearance, type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';

/**
 * Props for `EmptyState`, a non-interactive placeholder shown when a region has no data.
 *
 * ### Notes
 * Do: include `EmptyStateTitle` and `EmptyStateDescription` so assistive technology
 * receives the same message as sighted users.
 * Don't: use EmptyState for transient loading states; use Skeleton or Spinner instead.
 *
 * @example
 * ```tsx
 * import { EmptyState } from '@poffy-ui/react/feedback';
 * ```
 *
 * Related: `EmptyStateIconProps`
 * Related: `EmptyStateActionsProps`
 */
export interface EmptyStateProps extends PrimitiveProps<'div'> {
  /** Controls padding and icon/font sizing.
   * @defaultValue `'md'`
   */
  size?: 'sm' | 'md' | 'lg';
  /** Controls the public surface treatment.
   * @defaultValue `'soft'`
   */
  appearance?: Extract<FeedbackAppearance, 'soft' | 'outline'>;
  /** Legacy/internal surface mapping. */
  variant?: 'dashed' | 'solid' | 'elevated' | 'flat';
  /** Controls semantic accent color.
   * @defaultValue `'primary'`
   */
  intent?: Extract<
    SemanticIntent,
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
  >;
}

/**
 * Props for the decorative or status icon slot in EmptyState.
 *
 * ### Notes
 * Mark purely decorative SVG children with `aria-hidden`.
 */
export type EmptyStateIconProps = PrimitiveProps<'div'>;

/**
 * Props for the heading slot in EmptyState.
 *
 * ### Notes
 * Keep the title short and pair it with `EmptyStateDescription` for context.
 */
export type EmptyStateTitleProps = PrimitiveProps<'h3'>;

/**
 * Props for the explanatory text slot in EmptyState.
 */
export type EmptyStateDescriptionProps = PrimitiveProps<'p'>;

/**
 * Props for the optional action area in EmptyState.
 *
 * ### Notes
 * Place follow-up controls here, such as a create button or retry link.
 */
export type EmptyStateActionsProps = PrimitiveProps<'div'>;
