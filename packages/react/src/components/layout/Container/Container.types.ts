import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Props for a page-width-constrained content region. */
export type ContainerBaseProps = JsxStyleProps & {
  children?: ReactNode;
  className?: string;
};


type ContainerNativeProps = PrimitiveProps<'div', ContainerBaseProps>;
/** Props for Container rendered with its default host. */
export type ContainerDefaultProps = DefaultHostProps<ContainerNativeProps>;
/** Props for Container delegated to an asChild host. */
export type ContainerAsChildProps = AsChildHostProps<ContainerNativeProps>;
/** Public props for Container. */
export type ContainerProps = ContainerDefaultProps | ContainerAsChildProps;
/** Polymorphic component call signatures for Container. */
export type ContainerComponent = PolymorphicAsChildComponent<
  ContainerDefaultProps,
  ContainerAsChildProps,
  HTMLDivElement
>;
