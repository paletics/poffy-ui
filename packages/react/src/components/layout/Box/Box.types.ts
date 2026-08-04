import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Props for the lowest-level layout primitive. Prefer a semantic host through `asChild` for
 * landmarks, and prefer a more specific layout component when one expresses intent.
 */
export type BoxBaseProps = JsxStyleProps & {
  /** Content rendered inside the Box. */
  children?: ReactNode;
  /**
   * Additional CSS class names merged with the generated recipe and Panda classes.
   */
  className?: string;
};

/**
 * Public props for Box.
 *
 * ### Notes
 * Supports `asChild` polymorphism via Radix Slot.
 */
type BoxNativeProps = PrimitiveProps<'div', BoxBaseProps>;
/** Props for Box rendered with its default host. */
export type BoxDefaultProps = DefaultHostProps<BoxNativeProps>;
/** Props for Box delegated to an asChild host. */
export type BoxAsChildProps = AsChildHostProps<BoxNativeProps>;
/** Public props for Box. */
export type BoxProps = BoxDefaultProps | BoxAsChildProps;
/** Polymorphic component call signatures for Box. */
export type BoxComponent = PolymorphicAsChildComponent<
  BoxDefaultProps,
  BoxAsChildProps,
  HTMLDivElement
>;
