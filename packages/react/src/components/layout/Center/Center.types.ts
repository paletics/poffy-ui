import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Props for a layout region that centers its content on both axes. */
export type CenterBaseProps = JsxStyleProps & {
  children?: ReactNode;
  className?: string;
};


type CenterNativeProps = PrimitiveProps<'div', CenterBaseProps>;
/** Props for Center rendered with its default host. */
export type CenterDefaultProps = DefaultHostProps<CenterNativeProps>;
/** Props for Center delegated to an asChild host. */
export type CenterAsChildProps = AsChildHostProps<CenterNativeProps>;
/** Public props for Center. */
export type CenterProps = CenterDefaultProps | CenterAsChildProps;
/** Polymorphic component call signatures for Center. */
export type CenterComponent = PolymorphicAsChildComponent<
  CenterDefaultProps,
  CenterAsChildProps,
  HTMLDivElement
>;
