'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import { TagContext } from './TagContext';
import { TagProps } from './Tag.types';

/**
 * The root container for the Tag compound component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: tag), React Context, Radix Slot
 * ### Design Tokens
 * - padding/gap/borderRadius: silver-ratio tokens
 * ### Variant Logic
 * - variant: solid=filled, subtle=muted background, outline=bordered.
 * - colorScheme: semantic color (blue, green, red, etc.).
 * ### Notes
 * Establishes variant context consumed by TagLabel and TagCloseButton.
 * ### Accessibility
 * - If the tag can be dismissed, ensure TagCloseButton has `aria-label`.
 * @example
 * ```tsx
 * import { Tag } from '@poffy-ui/react/data-display';
 *
 * <Tag.Root appearance="soft" intent="info" size="md">
 *   <Tag.Label>TypeScript</Tag.Label>
 *   <Tag.CloseButton onClick={handleRemove} />
 * </Tag.Root>
 * ```
 */
export const TagRoot = forwardRef<HTMLSpanElement, TagProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size,
    appearance,
    intent,
    shape,
    variant,
    colorScheme,
    ...rest
  } = props;
  const Component = asChild ? Slot : ('span' as ElementType);
  const resolvedAppearance =
    appearance ?? (variant === 'outline' ? 'outline' : variant === 'solid' ? 'soft' : 'soft');
  const resolvedIntent =
    intent ??
    (colorScheme === 'red'
      ? 'danger'
      : colorScheme === 'green'
        ? 'success'
        : colorScheme === 'blue'
          ? 'info'
          : colorScheme === 'gray'
            ? 'secondary'
            : 'primary');
  const classes = tag({ size, appearance: resolvedAppearance, intent: resolvedIntent, shape });

  const contextValue = useMemo(
    () => ({ size, appearance: resolvedAppearance, intent: resolvedIntent, shape }),
    [size, resolvedAppearance, resolvedIntent, shape],
  );

  return (
    <TagContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </Component>
    </TagContext.Provider>
  );
});

TagRoot.displayName = 'Tag.Root';
