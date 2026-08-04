import { forwardRef } from 'react';
import { Box } from '../Box';
import { SpacerProps } from './Spacer.types';

/**
 * Consumes remaining space between siblings in a flex container. It is always non-semantic and
 * hidden from assistive technology; do not place content inside it or use it for grid spacing.
 */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>((props, ref) => {
  const {
    asChild: _asChild,
    children: _children,
    'aria-hidden': _ariaHidden,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _contentEditable,
    ...rest
  } = props as SpacerProps & {
    asChild?: unknown;
    children?: unknown;
    'aria-hidden'?: unknown;
    role?: unknown;
    tabIndex?: unknown;
    contentEditable?: unknown;
  };

  return (
    <Box
      ref={ref}
      flex="1"
      justifySelf="stretch"
      alignSelf="stretch"
      {...rest}
      aria-hidden="true"
    />
  );
});

Spacer.displayName = 'Spacer';
