import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Own props for Box, the lowest-level layout primitive.
 *
 * ### Notes
 * Box accepts Panda CSS style props and standard div attributes. It is best for
 * small layout wrappers and escape hatches when no more specific layout component
 * communicates the intent.
 *
 * @example
 * ```tsx
 * import { Box } from '@poffy-ui/react/layout';
 * ```
 *
 * ### AI Usage
 * - Do: prefer semantic elements through `asChild` for landmarks and sections.
 * - Don't: default to Box when Stack, Grid, Container, or Center describes the layout.
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
export type BoxProps = PrimitiveProps<'div', BoxBaseProps>;
