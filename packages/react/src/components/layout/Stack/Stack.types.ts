import { stackStyle } from '@/styled-system/recipes';
import { JsxStyleProps, RecipeVariantProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Recipe-backed one-dimensional stack layout options. */
export type StackVariants = RecipeVariantProps<typeof stackStyle>;

/**
 * Props for a configurable one-dimensional layout. Prefer `HStack` or `VStack` when the fixed axis
 * is part of the component's meaning, and use `Grid` for two-dimensional layouts.
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


type StackNativeProps = PrimitiveProps<'div', StackBaseProps>;

/** Default div-host Stack properties. */
export type StackDefaultProps = DefaultHostProps<StackNativeProps>;

/** Slotted Stack properties whose ref resolves to the child host. */
export type StackAsChildProps = AsChildHostProps<StackNativeProps>;

/** Public props for Stack. */
export type StackProps = StackDefaultProps | StackAsChildProps;

/** Public ref contract for default and slotted Stack hosts. */
export type StackComponent = PolymorphicAsChildComponent<
  StackDefaultProps,
  StackAsChildProps,
  HTMLDivElement
>;
