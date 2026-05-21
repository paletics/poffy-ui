import { gridStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending Grid styles.
 */
export type GridVariants = RecipeVariantProps<typeof gridStyle>;

/**
 * Own props for Grid.
 *
 * @example
 * ```tsx
 * import { Grid } from '@poffy-ui/react/layout';
 * ```
 *
 * ### Notes
 * Do: use Grid for two-dimensional layout and use semantic children inside it.
 * Don't: use Grid to represent tabular data; use Table from `@poffy-ui/react/data-display`.
 */
export type GridOwnProps = GridVariants &
  JsxStyleProps & {
    children?: ReactNode;
    className?: string;
    /** Shorthand prop for gridTemplateColumns. */
    columns?: number;
    /** Minimum width of a child, used for auto-fit responsive grids. */
    minChildWidth?: string | number;
  };

/**
 * Comprehensive properties for the core Grid component.
 * ### AI Usage
 * - Use this to type-check Grid components.
 */
export type GridProps = PrimitiveProps<'div', GridOwnProps>;
