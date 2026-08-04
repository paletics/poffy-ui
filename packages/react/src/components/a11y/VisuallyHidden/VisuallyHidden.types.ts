import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Base props for visually hidden accessible content. */
export interface VisuallyHiddenBaseProps {
  /** The content to be accessible only to screen readers. */
  children: ReactNode;
}

/** Native span props for visually hidden accessible content. */
type VisuallyHiddenNativeProps = PrimitiveProps<'span', VisuallyHiddenBaseProps>;
/** Props for VisuallyHidden rendered with its default host. */
export type VisuallyHiddenDefaultProps = DefaultHostProps<VisuallyHiddenNativeProps>;
/** Props for VisuallyHidden delegated to an asChild host. */
export type VisuallyHiddenAsChildProps = AsChildHostProps<VisuallyHiddenNativeProps>;
/** Public props for VisuallyHidden. */
export type VisuallyHiddenProps = VisuallyHiddenDefaultProps | VisuallyHiddenAsChildProps;
/** Polymorphic component call signatures for VisuallyHidden. */
export type VisuallyHiddenComponent = PolymorphicAsChildComponent<
  VisuallyHiddenDefaultProps,
  VisuallyHiddenAsChildProps,
  HTMLSpanElement
>;
