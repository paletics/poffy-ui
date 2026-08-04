import { PrimitiveProps } from '@poffy-ui/types';
import { BadgeVariantProps } from '@/styled-system/recipes';
import type { badge } from '@/styled-system/recipes';
import type { ReactElement, ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

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

/** Public type for `BadgeRecipeVariants`. */
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
export type BadgeContextValue = BadgeRecipeVariants & {
  classes: ReturnType<typeof badge>;
  /** Whether compound children are being slotted into a delegated root host. */
  isDelegated: boolean;
};

/** Shared base props for BadgeRoot. */
export interface BadgeRootBaseProps extends BadgeRecipeVariants {
  children?: ReactNode;
}

/**
 * Validates BadgeRoot props, injecting element type constraints.
 */
type BadgeRootNativeProps = PrimitiveProps<'div', BadgeRootBaseProps>;
export type BadgeRootDefaultProps = DefaultHostProps<BadgeRootNativeProps>;
export type BadgeRootAsChildProps = Omit<
  RetargetedAsChildHostProps<BadgeRootNativeProps, HTMLElement>,
  'children'
> & {
  /** The first child is the delegated anchor; remaining children must be Badge indicators. */
  children: ReactNode;
};
/** Public props for BadgeRoot. */
export type BadgeRootProps = BadgeRootDefaultProps | BadgeRootAsChildProps;
export type BadgeRootComponent = PolymorphicAsChildComponent<
  BadgeRootDefaultProps,
  BadgeRootAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Content props for the positioned Badge indicator.
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
type BadgeIndicatorNativeProps = PrimitiveProps<'span', BadgeIndicatorBaseProps>;
type BadgeIndicatorAsChildElement = ReactElement<
  Record<string, unknown>,
  'b' | 'em' | 'i' | 'small' | 'span' | 'strong'
>;
export type BadgeIndicatorDefaultProps = DefaultHostProps<BadgeIndicatorNativeProps>;
export type BadgeIndicatorAsChildProps = RetargetedAsChildHostProps<
  BadgeIndicatorNativeProps,
  HTMLElement,
  BadgeIndicatorAsChildElement
>;
/** Public props for BadgeIndicator. */
export type BadgeIndicatorProps = BadgeIndicatorDefaultProps | BadgeIndicatorAsChildProps;
export type BadgeIndicatorComponent = PolymorphicAsChildComponent<
  BadgeIndicatorDefaultProps,
  BadgeIndicatorAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Props for the Badge shorthand, which composes a root and optional indicator.
 *
 * @example
 * ```tsx
 * import { Badge, Avatar } from '@poffy-ui/react/data-display';
 *
 * <Badge content={3} intent="danger" placement="top-right">
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
   * Anchor content. When present, the indicator is positioned relative to it;
   * when omitted, `content` is rendered as a standalone badge.
   */
  children?: ReactNode;
}

/**
 * Native props accepted by the shorthand's default `div` root.
 */
type BadgeNativeProps = PrimitiveProps<'div', BadgeBaseProps>;
export type BadgeDefaultProps = DefaultHostProps<BadgeNativeProps>;
export type BadgeAsChildProps = RetargetedAsChildHostProps<
  BadgeNativeProps,
  HTMLElement,
  ReactElement
>;
/** Public props for Badge. */
export type BadgeProps = BadgeDefaultProps | BadgeAsChildProps;
export type BadgeComponent = PolymorphicAsChildComponent<
  BadgeDefaultProps,
  BadgeAsChildProps,
  HTMLDivElement,
  HTMLElement
>;
