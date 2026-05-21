import { RecipeVariantProps } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import {
  type ControlShape,
  type NavigationAppearance,
  type SemanticIntent,
  PrimitiveProps,
} from '@poffy-ui/types';

/**
 * Extracted variant types from the Panda CSS tag recipe.
 * ### AI Usage
 * - Use when extending tag styles.
 */
export type TagRecipeVariants = RecipeVariantProps<typeof tag>;

/**
 * Public surface treatment for Tag.
 */
export type TagAppearance = Extract<NavigationAppearance, 'soft' | 'outline' | 'ghost'>;

/**
 * Semantic accent color for Tag.
 */
export type TagIntent = Extract<
  SemanticIntent,
  'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
>;

/**
 * Public geometry control for Tag.
 */
export type TagShape = Extract<ControlShape | 'pill', 'rounded' | 'pill'>;

/**
 * Base properties for the Tag component.
 * ### Formula
 * - Silver Ratio (1:1.414) applied to padding and border-radius tokens.
 *
 * @example
 * ```tsx
 * import { Tag } from '@poffy-ui/react/data-display';
 *
 * <Tag intent="info" appearance="soft">
 *   <Tag.Label>Documentation</Tag.Label>
 * </Tag>
 * ```
 *
 * ### Notes
 * Do: use Tag for compact labels, categories, and removable chips.
 * Don't: use Tag as a button substitute; put the action on `Tag.CloseButton`
 * or use an input/navigation component.
 *
 * ### AI Usage
 * - Use to type-check the Tag root element.
 */
export type TagBaseProps = TagRecipeVariants & {
  /**
   * Public appearance.
   * @defaultValue 'soft'
   */
  appearance?: TagAppearance;
  /**
   * Public semantic accent.
   * @defaultValue 'primary'
   */
  intent?: TagIntent;
  /**
   * Public geometry control.
   * @defaultValue 'rounded'
   */
  shape?: TagShape;
  /**
   * Legacy appearance alias.
   *
   * ### Notes
   * Prefer `appearance` for new code.
   */
  variant?: 'solid' | 'subtle' | 'outline';
  /**
   * The size of the tag.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Legacy semantic alias.
   *
   * ### Notes
   * Prefer `intent` for new code.
   */
  colorScheme?: 'gray' | 'red' | 'green' | 'blue';
};

/**
 * Type checks Tag root props with native `span` attributes.
 */
export type TagProps = PrimitiveProps<'span', TagBaseProps>;

/**
 * Type checks TagLabel wrapping a native `span`.
 */
export type TagLabelProps = PrimitiveProps<'span'>;

/**
 * Base properties for the Tag dismiss button.
 */
export interface TagCloseButtonBaseProps {
  /**
   * Aria label for the close button.
   *
   * ### Notes
   * Replace the default with object-specific text such as
   * `Remove Documentation tag` when multiple tags can be dismissed.
   *
   * @defaultValue 'Close'
   */
  'aria-label'?: string;
  /**
   * Disables the button
   */
  isDisabled?: boolean;
}

/**
 * Type checks TagCloseButton with native `button` attributes.
 */
export type TagCloseButtonProps = PrimitiveProps<'button', TagCloseButtonBaseProps>;
