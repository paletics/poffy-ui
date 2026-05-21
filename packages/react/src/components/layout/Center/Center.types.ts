import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Center Base Props
 * Center provides flex-based centering without additional variants.
 * ### AI Usage
 * - Use to type-check Center configurations without the outer div props.
 */
export type CenterBaseProps = JsxStyleProps & {
  /** The content to be centered */
  children?: ReactNode;
  /**
   * Additional CSS class names.
   * Prefer using Panda CSS style props for styling.
   */
  className?: string;
};

/**
 * Comprehensive properties for the Center component.
 * ### AI Usage
 * - Use to type-check Center components.
 */
export type CenterProps = PrimitiveProps<'div', CenterBaseProps>;
