import { flexStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending Flex styles.
 */
export type FlexVariants = RecipeVariantProps<typeof flexStyle>;

/**
 * Own props for Flex.
 *
 * ### Notes
 * Use Flex when alignment, wrapping, or distribution needs explicit flexbox
 * control. For simple one-axis spacing, prefer `HStack` or `VStack`.
 *
 * @example
 * ```tsx
 * import { Flex } from '@poffy-ui/react/layout';
 * ```
 *
 * ### AI Usage
 * - Do: use `align`, `justify`, `direction`, `wrap`, and `gap` for flex layout.
 * - Don't: use Flex to create tabular or two-dimensional data layouts.
 */
export type FlexBaseProps = FlexVariants &
  JsxStyleProps & {
    /** Flex items rendered inside the container. */
    children?: ReactNode;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
  };

/**
 * Comprehensive properties for the core Flex component.
 * ### AI Usage
 * - Use this to type-check Flex components.
 */
export type FlexProps = PrimitiveProps<'div', FlexBaseProps>;
