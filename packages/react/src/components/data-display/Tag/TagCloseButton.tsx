'use client';

import { Slot } from '@radix-ui/react-slot';
import { CrossIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTagContext } from './TagContext';
import { TagCloseButtonProps } from './Tag.types';

/**
 * A dismiss button rendered inside a Tag, allowing the user to remove it.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: tag), React Context, Radix Slot
 * ### Variant Logic
 * - Inherits `variant`, `colorScheme`, and `size` from TagRoot via context.
 * ### Notes
 * Uses shared `CrossIcon` to keep iconography consistent with other close controls.
 * ### Accessibility
 * - `aria-label="Close"` is applied by default. Override if the tag label provides enough context.
 */
export const TagCloseButton = forwardRef<HTMLButtonElement, TagCloseButtonProps>((props, ref) => {
  const { asChild, className, isDisabled, children, ...rest } = props;
  const { size, appearance, intent, shape } = useTagContext();
  const Component = asChild ? Slot : ('button' as ElementType);
  const classes = tag({ size, appearance, intent, shape });

  return (
    <Component
      ref={ref}
      className={cx(classes.closeButton, className)}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={isDisabled ? true : undefined}
      aria-label="Close"
      {...rest}
    >
      {asChild ? children : (children ?? <CrossIcon />)}
    </Component>
  );
});

TagCloseButton.displayName = 'Tag.CloseButton';
