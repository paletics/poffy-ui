import { simpleGrid } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Recipe-backed equal-width grid layout options. */
export type SimpleGridVariants = NonNullable<Parameters<typeof simpleGrid>[0]>;
type SimpleGridGap = NonNullable<Parameters<typeof simpleGrid>[0]>['gap'];

/**
 * Props for equal-width repeated content. `minChildWidth` selects a fluid auto-fit layout and takes
 * precedence over `columns`; use `Grid` instead for asymmetric track layouts.
 */
export type SimpleGridBaseProps = Omit<SimpleGridVariants, 'columns' | 'gap'> &
  Omit<JsxStyleProps, 'columns' | 'gap'> & {
    /** Grid items rendered inside the container. */
    children?: ReactNode;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /**
     * Number of equal-width columns.
     *
     * @defaultValue browser grid auto-placement
     */
    columns?: number;
    /**
     * Minimum child width used to create a responsive auto-fit grid. Accepts
     * a CSS length-percentage; finite positive numeric values are converted to
     * pixels. Invalid values are ignored, allowing a valid `columns` value to apply.
     */
    minChildWidth?: string | number;
    /** Gap between grid items using Panda spacing recipe values. */
    gap?: SimpleGridGap;
  };


type SimpleGridNativeProps = PrimitiveProps<'div', SimpleGridBaseProps>;
/** Props for SimpleGrid rendered with its default host. */
export type SimpleGridDefaultProps = DefaultHostProps<SimpleGridNativeProps>;
/** Props for SimpleGrid delegated to an asChild host. */
export type SimpleGridAsChildProps = AsChildHostProps<SimpleGridNativeProps>;
/** Public props for SimpleGrid. */
export type SimpleGridProps = SimpleGridDefaultProps | SimpleGridAsChildProps;
/** Polymorphic component call signatures for SimpleGrid. */
export type SimpleGridComponent = PolymorphicAsChildComponent<
  SimpleGridDefaultProps,
  SimpleGridAsChildProps,
  HTMLDivElement
>;
