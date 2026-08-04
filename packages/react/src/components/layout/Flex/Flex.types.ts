import { flexStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Recipe-backed flexbox layout options. */
export type FlexVariants = RecipeVariantProps<typeof flexStyle>;

/**
 * Style and composition props for explicit flexbox alignment, wrapping, or distribution. Prefer
 * `HStack` or `VStack` when a fixed one-dimensional axis communicates the layout more clearly.
 */
export type FlexBaseProps = FlexVariants &
  JsxStyleProps & {
    /** Flex items rendered inside the container. */
    children?: ReactNode;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
  };


type FlexNativeProps = PrimitiveProps<'div', FlexBaseProps>;
/** Props for Flex rendered with its default host. */
export type FlexDefaultProps = DefaultHostProps<FlexNativeProps>;
/** Props for Flex delegated to an asChild host. */
export type FlexAsChildProps = AsChildHostProps<FlexNativeProps>;
/** Public props for Flex. */
export type FlexProps = FlexDefaultProps | FlexAsChildProps;
/** Polymorphic component call signatures for Flex. */
export type FlexComponent = PolymorphicAsChildComponent<
  FlexDefaultProps,
  FlexAsChildProps,
  HTMLDivElement
>;
