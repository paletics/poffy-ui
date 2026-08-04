import { gridStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Recipe-backed explicit grid layout options. */
export type GridVariants = RecipeVariantProps<typeof gridStyle>;

/**
 * Props for a two-dimensional layout with explicit or ratio-based tracks.
 *
 * Ratio variants describe their larger track using physical `left`/`right` or logical `start`/`end`
 * naming. A ratio variant overrides `columns` and `minChildWidth`.
 */
export type GridOwnProps = GridVariants &
  Omit<JsxStyleProps, 'columns' | 'gap'> & {
    children?: ReactNode;
    className?: string;
    /** Explicit number of equal tracks, ignored when `ratio` or `minChildWidth` is supplied. */
    columns?: number;
    /**
     * Minimum child width used by the auto-fit layout. Accepts a CSS
     * length-percentage; finite positive numeric values are converted to pixels.
     * Invalid values are ignored, allowing a valid `columns` value to apply. A `ratio` variant
     * takes precedence over this prop.
     */
    minChildWidth?: string | number;
  };


type GridNativeProps = PrimitiveProps<'div', GridOwnProps>;
/** Props for Grid rendered with its default host. */
export type GridDefaultProps = DefaultHostProps<GridNativeProps>;
/** Props for Grid delegated to an asChild host. */
export type GridAsChildProps = AsChildHostProps<GridNativeProps>;
/** Public props for Grid. */
export type GridProps = GridDefaultProps | GridAsChildProps;
/** Polymorphic component call signatures for Grid. */
export type GridComponent = PolymorphicAsChildComponent<
  GridDefaultProps,
  GridAsChildProps,
  HTMLDivElement
>;
