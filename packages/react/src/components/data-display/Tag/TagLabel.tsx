'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { useTagContext } from './TagContext';
import { TagLabelProps } from './Tag.types';

/**
 * The text label inside a Tag, inheriting variant styles from TagContext.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: tag), React Context, Radix Slot
 * ### Variant Logic
 * - Inherits `variant` and `colorScheme` from TagRoot via context.
 * ### Notes
 * Must be a direct child of TagRoot.
 * @example
 * ```tsx
 * import { Tag } from '@poffy-ui/react/data-display';
 *
 * <Tag.Root appearance="soft" intent="danger">
 *   <Tag.Label>Critical</Tag.Label>
 * </Tag.Root>
 * ```
 */
export const TagLabel = forwardRef<HTMLSpanElement, TagLabelProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { size, appearance, intent, shape } = useTagContext();
  const Component = asChild ? Slot : ('span' as ElementType);
  const classes = tag({ size, appearance, intent, shape });

  return (
    <Component ref={ref} className={cx(classes.label, className)} {...rest}>
      {children}
    </Component>
  );
});

TagLabel.displayName = 'Tag.Label';
