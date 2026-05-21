import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Container Base Props
 * Container provides responsive max-width constraint without additional variants.
 */
export type ContainerBaseProps = JsxStyleProps & {
  /** The content of the container */
  children?: ReactNode;
  /**
   * Additional CSS class names.
   * Prefer using Panda CSS style props for styling.
   */
  className?: string;
};

/**
 * Comprehensive properties for the core Container component.
 * ### AI Usage
 * - Use this to type-check Container components.
 */
export type ContainerProps = PrimitiveProps<'div', ContainerBaseProps>;
