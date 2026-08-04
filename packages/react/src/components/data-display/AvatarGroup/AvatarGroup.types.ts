import { PrimitiveProps } from '@poffy-ui/types';
import { AvatarGroupVariantProps } from '@/styled-system/recipes';
import type { ReactElement, ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Public type for `AvatarGroupRecipeVariants`. */
export type AvatarGroupRecipeVariants = AvatarGroupVariantProps;

/** Public type for `SpacingTokenKey`. */
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
  /** Localized accessible text used by the internal excess indicator. */
  showMoreLabel?: (count: number) => string;
}

export interface AvatarGroupRootBaseProps extends AvatarGroupRecipeVariants {
  children: ReactNode;
  /**
   * Maximum number of element children to show. Fractions are rounded down and
   * negative or non-finite values mean zero or no limit respectively.
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
   * Total member count, including members not supplied as children. It is
   * rounded down and cannot reduce the actual child count.
   */
  total?: number;
  /**
   * Called when the generated excess marker is activated. Its presence changes
   * that marker from text to a button.
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
type AvatarGroupNativeProps = PrimitiveProps<'div', AvatarGroupRootBaseProps>;
type AvatarGroupAsChildElement = ReactElement<
  Record<string, unknown>,
  'article' | 'aside' | 'div' | 'footer' | 'header' | 'main' | 'nav' | 'section' | 'span'
>;
export type AvatarGroupDefaultProps = DefaultHostProps<AvatarGroupNativeProps>;
export type AvatarGroupAsChildProps = RetargetedAsChildHostProps<
  AvatarGroupNativeProps,
  HTMLElement,
  AvatarGroupAsChildElement
>;
export type AvatarGroupRootProps = AvatarGroupDefaultProps | AvatarGroupAsChildProps;
export type AvatarGroupComponent = PolymorphicAsChildComponent<
  AvatarGroupDefaultProps,
  AvatarGroupAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

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
export type AvatarGroupExcessProps = Omit<
  PrimitiveProps<'span', AvatarGroupExcessBaseProps>,
  'aria-hidden' | 'asChild' | 'children' | 'data-status'
> & {
  'aria-hidden'?: never;
  'data-status'?: never;
};

/**
 * Type checks AvatarGroup instances for the complete set of valid props.
 */
export type AvatarGroupProps = AvatarGroupRootProps;
