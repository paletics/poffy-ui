import { PrimitiveProps } from '@poffy-ui/types';
import { BadgeVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';

/**
 * Public surface treatment for Badge.
 */
export type BadgeAppearance = 'solid' | 'soft' | 'outline';

/**
 * Semantic accent color for Badge.
 */
export type BadgeIntent =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

/**
 * Public geometry control for Badge.
 */
export type BadgeShape = 'rounded' | 'pill';

/**
 * Extracted variant types from the Panda CSS badge recipe.
 *
 * ### Notes
 * Prefer `BadgeProps` in application code. Use this interface for
 * wrapper components that expose the same visual axes.
 *
 * ### AI Usage
 * - Use this when extending badge styles.
 */
export interface BadgeRecipeVariants extends Omit<
  BadgeVariantProps,
  'appearance' | 'intent' | 'shape'
> {
  appearance?: BadgeAppearance;
  intent?: BadgeIntent;
  shape?: BadgeShape;
}

/**
 * Context value mapping for Badge propagation.
 */
export type BadgeContextValue = BadgeRecipeVariants;

/**
 * Comprehensive properties for the BadgeRoot component.
 * ### Formula
 * - Silver Ratio (1:1.414) applied conceptually to positioning Offsets.
 *
 * @example
 * ```tsx
 * import { Badge } from '@poffy-ui/react/data-display';
 *
 * <Badge.Root intent="success" placement="top-end">
 *   <span aria-label="Online user" />
 *   <Badge.Indicator />
 * </Badge.Root>
 * ```
 *
 * ### Notes
 * Do: make the anchored child or surrounding text explain what the badge means.
 * Don't: rely on color alone for status, counts, or urgency.
 *
 * ### AI Usage
 * - Use this to type-check the parent container setting up the relative positioning context.
 */
export interface BadgeRootBaseProps extends BadgeRecipeVariants {
  children?: ReactNode;
}

/**
 * Validates BadgeRoot props, injecting element type constraints.
 */
export type BadgeRootProps = PrimitiveProps<'div', BadgeRootBaseProps>;

/**
 * Properties for the strictly visual Badge Indicator component.
 *
 * ### Notes
 * When the indicator contains a count, keep the value short and add a fuller
 * accessible name to the anchored control when needed.
 */
export interface BadgeIndicatorBaseProps {
  children?: ReactNode;
}

/**
 * Validates BadgeIndicator properties natively wrapping a span tag.
 */
export type BadgeIndicatorProps = PrimitiveProps<'span', BadgeIndicatorBaseProps>;

/**
 * Properties unifying Badge logic for the shorthand variation.
 *
 * @example
 * ```tsx
 * import { Badge, Avatar } from '@poffy-ui/react/data-display';
 *
 * <Badge content={3} intent="danger" placement="top-end">
 *   <Avatar src="/user.jpg" alt="Jane Doe" name="Jane Doe" />
 * </Badge>
 * ```
 */
export interface BadgeBaseProps extends BadgeRecipeVariants {
  /**
   * Content inside the badge indicator.
   *
   * ### Notes
   * Use a compact count, symbol, or empty dot. Add accessible context
   * outside the badge when the content is not self-explanatory.
   */
  content?: ReactNode;
  /**
   * The anchor element that the Badge applies to.
   * If children exists, Badge wraps it.
   */
  children?: ReactNode;
}

/**
 * Type checks Badge instances evaluating both root mechanics and indicator data.
 */
export type BadgeProps = PrimitiveProps<'div', BadgeBaseProps>;
