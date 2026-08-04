import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Props that reserve a stable ratio for media, embeds, or placeholders. The wrapper does not resize
 * or crop its child, so embedded content must fill the available box itself.
 */
export type AspectRatioBaseProps = JsxStyleProps & {
  /** Single visual child whose box should maintain the requested ratio. */
  children?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /**
   * Width divided by height. Non-positive or non-finite values use the default.
   *
   * @defaultValue `16 / 9`
   * @example `16 / 9`, `4 / 3`, `1`
   */
  ratio?: number;
};


type AspectRatioNativeProps = PrimitiveProps<'div', AspectRatioBaseProps>;
/** Props for AspectRatio rendered with its default host. */
export type AspectRatioDefaultProps = DefaultHostProps<AspectRatioNativeProps>;
/** Props for AspectRatio delegated to an asChild host. */
export type AspectRatioAsChildProps = AsChildHostProps<AspectRatioNativeProps>;
/** Public props for AspectRatio. */
export type AspectRatioProps = AspectRatioDefaultProps | AspectRatioAsChildProps;
/** Polymorphic component call signatures for AspectRatio. */
export type AspectRatioComponent = PolymorphicAsChildComponent<
  AspectRatioDefaultProps,
  AspectRatioAsChildProps,
  HTMLDivElement
>;
