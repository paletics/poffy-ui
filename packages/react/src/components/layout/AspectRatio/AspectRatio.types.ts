import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Own props for the AspectRatio component.
 *
 * ### Notes
 * Use `AspectRatio` for media, embeds, and placeholders that need stable layout
 * dimensions before their content loads. It prevents layout shift; it does not
 * resize or crop the child on its own.
 *
 * ### AI Usage
 * - Do: set the child to `width: 100%` and `height: 100%` when embedding media.
 * - Don't: use it as a generic spacing wrapper.
 */
export type AspectRatioBaseProps = JsxStyleProps & {
  /** Single visual child whose box should maintain the requested ratio. */
  children?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /**
   * Width divided by height.
   *
   * @defaultValue `16 / 9`
   * @example `16 / 9`, `4 / 3`, `1`
   */
  ratio?: number;
};

/**
 * Public props for the AspectRatio component.
 *
 * @example
 * ```tsx
 * import { AspectRatio } from '@poffy-ui/react/layout';
 * ```
 *
 * ### AI Usage
 * Use this type when exposing wrapper components that forward AspectRatio props.
 */
export type AspectRatioProps = PrimitiveProps<'div', AspectRatioBaseProps>;
