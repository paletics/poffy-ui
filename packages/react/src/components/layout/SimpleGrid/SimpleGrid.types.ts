import { simpleGrid } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending SimpleGrid styles.
 */
export type SimpleGridVariants = RecipeVariantProps<typeof simpleGrid>;

/**
 * Own props for SimpleGrid.
 *
 * @example
 * ```tsx
 * import { SimpleGrid } from '@poffy-ui/react/layout';
 * ```
 *
 * ### Notes
 * Use `columns` for fixed equal-width grids and `minChildWidth` for fluid
 * auto-fit grids. When both are provided, `minChildWidth` controls the layout.
 *
 * ### AI Usage
 * - Do: use for card grids, galleries, and repeated equal-width content.
 * - Don't: use for asymmetric main/sidebar layouts; use `Grid` instead.
 */
export type SimpleGridBaseProps = SimpleGridVariants &
  JsxStyleProps & {
    /** Grid items rendered inside the container. */
    children?: ReactNode;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /**
     * Number of equal-width columns.
     *
     * @defaultValue recipe default
     */
    columns?: number;
    /** Minimum child width used to create a responsive auto-fit grid. */
    minChildWidth?: string | number;
    /** Gap between grid items using Panda spacing tokens or raw CSS length values. */
    gap?: string | number;
  };

/**
 * Comprehensive properties for the core SimpleGrid component.
 * ### AI Usage
 * - Use this to type-check SimpleGrid.
 */
export type SimpleGridProps = PrimitiveProps<'div', SimpleGridBaseProps>;
