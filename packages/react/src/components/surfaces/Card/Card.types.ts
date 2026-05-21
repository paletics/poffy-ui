import { card } from '@/styled-system/recipes';
import { RecipeVariantProps } from '@/styled-system/types';
import {
  NativeProps,
  PrimitiveProps,
  type SemanticIntent,
  type Shape,
  type SurfaceAppearance,
} from '@poffy-ui/types';
import { ElementType, ReactNode } from 'react';

/**
 * Variants for the Card component derived from Panda CSS recipe.
 */
export type CardVariants = RecipeVariantProps<typeof card>;

/**
 * Public surface treatment for Card.
 *
 * ### Notes
 * `neo` is Card-specific; shared surface components use `SurfaceAppearance`.
 */
export type CardAppearance = SurfaceAppearance | 'neo';

/**
 * Semantic accent color for Card.
 */
export type CardIntent = SemanticIntent;

/**
 * Public geometry control for Card.
 */
export type CardShape = Extract<Shape, 'rounded' | 'square'>;

/**
 * Public Card variant props with shared surface, intent, and shape names.
 */
export interface CardVariantSubset extends Omit<CardVariants, 'appearance' | 'intent' | 'shape'> {
  /**
   * Public surface treatment.
   * @defaultValue 'solid'
   */
  appearance?: CardAppearance;
  /**
   * Public semantic accent.
   * @defaultValue 'primary'
   */
  intent?: CardIntent;
  /**
   * Public geometry control.
   * @defaultValue 'rounded'
   */
  shape?: CardShape;
  /**
   * Legacy surface alias.
   */
  variant?: 'elevated' | 'outlined' | 'filled';
}

/**
 * Properties for the root Card component.
 *
 * @example
 * ```tsx
 * import { Card, CardBody, CardFooter, CardHeader } from '@poffy-ui/react/surfaces';
 * ```
 *
 * ### Notes
 * Recommended structure: use `CardHeader` for titles/actions, `CardBody` for the
 * primary content, and `CardFooter` for trailing actions or metadata. Card itself
 * has no landmark role; choose semantic children or `asChild` when needed.
 *
 * ### AI Usage
 * - Do: use Card for grouped content with a clear boundary.
 * - Don't: nest Cards inside Cards for page section layout.
 *
 * Supports polymorphic rendering via `asChild` (Radix UI Slot pattern).
 */
export type CardProps<T extends ElementType = 'div'> = PrimitiveProps<
  T,
  CardVariantSubset & {
    /** CardHeader, CardBody, and CardFooter components. */
    children?: ReactNode;
  }
>;

/**
 * Properties for the CardHeader component.
 *
 * ### Notes
 * Use for leading title, description, or actions. Keep only one primary
 * heading in a Card unless the content is intentionally subdivided.
 */
export type CardHeaderProps = NativeProps<'div'>;

/**
 * Properties for the CardBody component.
 *
 * ### Notes
 * Use for the main content of a Card. This slot should usually be present
 * even when header and footer are omitted.
 */
export type CardBodyProps = NativeProps<'div'>;

/**
 * Properties for the CardFooter component.
 *
 * ### Notes
 * Use for actions or metadata that follow the body. Avoid placing primary
 * body copy only in the footer.
 */
export type CardFooterProps = NativeProps<'div'>;
