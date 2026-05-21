import type { CloseButtonVariantProps } from '@/styled-system/recipes';
import { type ControlShape, type InputAppearance, PrimitiveProps } from '@poffy-ui/types';

/**
 * Extracted size variant props from the Panda CSS `closeButton` recipe.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) governs all `size` token values (width/height) in the `closeButton` recipe.
 * ### AI Usage
 * - Use when extending `CloseButton` styles or composing dismiss controls.
 */
export interface CloseButtonVariants extends Omit<CloseButtonVariantProps, 'appearance' | 'shape'> {
  /**
   * Visual treatment of the dismiss button.
   *
   * @defaultValue `'ghost'`
   */
  appearance?: InputAppearance | 'ghost';
  /**
   * Corner geometry for the dismiss button hit target.
   *
   * @defaultValue `'rounded'`
   */
  shape?: ControlShape;
}

/**
 * Full props for the `CloseButton` component, supporting polymorphic rendering via `asChild`.
 * Pre-applies `aria-label="Close"` as the default accessible label.
 *
 * ### AI Usage
 * - Use this type when typing `CloseButton` or any dismiss control that delegates to it.
 */
export type CloseButtonProps = PrimitiveProps<'button', CloseButtonVariants>;
