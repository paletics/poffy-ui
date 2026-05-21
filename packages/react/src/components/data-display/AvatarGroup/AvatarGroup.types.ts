import { PrimitiveProps } from '@poffy-ui/types';
import { AvatarGroupVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS avatarGroup recipe.
 *
 * ### Notes
 * Prefer `AvatarGroupProps` in application code. Use this type for
 * wrapper components that need the recipe's `size` and layout variants.
 *
 * ### AI Usage
 * - Use this when extending avatar group styles.
 */
export type AvatarGroupRecipeVariants = AvatarGroupVariantProps;

/**
 * Valid spacing token keys defined in src/theme/tokens-config.ts.
 * ### AI Context & Architecture
 * - Mirrors the `spacing` keys in baseTokens to ensure type-safe
 * token lookups via the `token()` utility without resorting to `as any`.
 */
export type SpacingTokenKey =
  | 'none'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl';

/** Positive or negative spacing token key (e.g. `"sm"` or `"-sm"`). */
export type SpacingValue = SpacingTokenKey | `-${SpacingTokenKey}`;

/**
 * Context value passed to children to ensure uniform size and spacing.
 *
 * ### Notes
 * Internal compound-component plumbing. Consumers should set these on
 * `AvatarGroup` rather than providing context manually.
 */
export interface AvatarGroupContextValue {
  /** Shared avatar size inherited by compound children. */
  size?: AvatarGroupRecipeVariants['size'];
  /** Shared overlap or spacing value inherited by compound children. */
  spacing?: SpacingValue;
}

/**
 * Comprehensive properties for the AvatarGroupRoot component.
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to spacing variants when overlapping avatars.
 *
 * @example
 * ```tsx
 * import { Avatar, AvatarGroup } from '@poffy-ui/react/data-display';
 *
 * <AvatarGroup max={3} total={12} aria-label="Project members">
 *   <Avatar src="/a.jpg" alt="Alice Lee" name="Alice Lee" />
 *   <Avatar src="/b.jpg" alt="Bo Chen" name="Bo Chen" />
 * </AvatarGroup>
 * ```
 *
 * ### Notes
 * Do: give the group an accessible label when the collection meaning is not
 * already clear from surrounding text.
 * Don't: use the group for arbitrary overlapping media; it propagates Avatar sizing.
 *
 * ### AI Usage
 * - Use for a visible subset of people or entities represented by avatars.
 * - Set `total` when the rendered children are only a page or sample of the full set.
 */
export interface AvatarGroupRootBaseProps extends AvatarGroupRecipeVariants {
  children: ReactNode;
  /**
   * Maximum number of avatars to show.
   *
   * ### Notes
   * Extra rendered children are replaced by `AvatarGroup.Excess`.
   */
  max?: number;
  /**
   * Space between avatars (can be negative for overlap).
   * Accepts a spacing token key, optionally prefixed with `-` for negative overlap.
   * @defaultValue "-sm"
   * @example "-sm"
   */
  spacing?: SpacingValue;
  /**
   * Total number of avatars. Used to calculate excess indicator if greater than children length.
   * Useful when only fetching a subset of users.
   */
  total?: number;
  /**
   * Callback when the excess indicator is clicked.
   *
   * ### Notes
   * If this opens a popover or dialog, ensure the excess control has an
   * accessible name that describes the hidden members.
   */
  onExcessClick?: (event: React.MouseEvent) => void;
}

/**
 * Type checks AvatarGroupRoot instances for the complete set of valid props.
 */
export type AvatarGroupRootProps = PrimitiveProps<'div', AvatarGroupRootBaseProps>;

/**
 * Base properties for the AvatarGroupExcess indicator.
 */
export interface AvatarGroupExcessBaseProps {
  /** Number of hidden avatars represented by the excess indicator. */
  count: number;
  /**
   * Callback when the excess indicator is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * Prop type for identifying the excess counter in AvatarGroup.
 */
export type AvatarGroupExcessProps = PrimitiveProps<'span', AvatarGroupExcessBaseProps>;

/**
 * Type checks AvatarGroup instances for the complete set of valid props.
 */
export type AvatarGroupProps = AvatarGroupRootProps;
