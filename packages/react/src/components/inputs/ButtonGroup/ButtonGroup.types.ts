import { ActionMotionType } from '@/components/animations/ActionMotion';
import type { ButtonGroupVariantProps } from '@/styled-system/recipes';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Extended variant props for `ButtonGroup`, merging Panda CSS recipe variants
 * with the `animationType` runtime prop.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) governs all `spacing` token values in the `buttonGroup` recipe.
 * ### AI Usage
 * - Use when extending `ButtonGroup` styles or building composition wrappers around it.
 */
export type ButtonGroupVariants = ButtonGroupVariantProps & {
  /**
   * Physics-based orchestration preset applied to child buttons via `ActionMotion`.
   * - `'stagger'`: Sequential reveal of children on mount (default).
   * - Other presets apply a shared animation to the entire group.
   * @defaultValue 'stagger'
   */
  animationType?: ActionMotionType;
};

/**
 * Full props for the `ButtonGroup` component, supporting polymorphic rendering via `asChild`.
 * Merges `ButtonGroupVariants` with standard `<div>` HTML attributes through `PrimitiveProps`.
 *
 * ### AI Usage
 * - Use this type when typing `ButtonGroup` or any wrapper that delegates to it.
 */
export type ButtonGroupProps = PrimitiveProps<'div', ButtonGroupVariants>;
