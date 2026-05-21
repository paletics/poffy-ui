import { stackStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Stack Variants
 * Extracted directly from the Panda CSS recipe to ensure type safety.
 * ### AI Usage
 * - Use this when extending Stack styles.
 */
export type StackVariants = RecipeVariantProps<typeof stackStyle>;

/**
 * Own props for Stack.
 *
 * @example
 * ```tsx
 * import { Stack } from '@poffy-ui/react/layout';
 * ```
 *
 * ### Notes
 * Stack is a one-dimensional layout primitive. Use it to space related siblings
 * along a single axis, and use `asChild` when the wrapper needs semantic meaning.
 *
 * ### AI Usage
 * - Do: prefer `HStack` or `VStack` when the axis is fixed and obvious.
 * - Don't: use Stack for two-dimensional layouts or tabular data.
 */
export type StackBaseProps = StackVariants &
  JsxStyleProps & {
    /** Stack items rendered in source order. */
    children?: ReactNode;
    /**
     * Additional CSS class names merged onto the root element.
     */
    className?: string;
  };

/**
 * Comprehensive properties for the Stack component.
 * ### AI Usage
 * - Use to type-check Stack components.
 */
export type StackProps = PrimitiveProps<'div', StackBaseProps>;
