import { forwardRef } from 'react';
import { Flex } from '../Flex';
import { WrapProps } from './Wrap.types';

/**
 * A flex-wrap layout primitive — a shortcut for `<Flex wrap="wrap">`.
 * Items are laid out horizontally and automatically wrap to the next row
 * when there is insufficient space, making it ideal for tag clouds and chip groups.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Flex with `wrap="wrap"`), Radix Slot (inherited via Flex). No dedicated recipe — delegates entirely to `<Flex>` with `wrap="wrap"` hardcoded.
 * - **Props**: WrapProps
 *
 * ### Design Tokens
 * - **spacing**: gap: Silver Ratio spacing tokens inherited from `<Flex>`. Use `gap` to control space between wrapped items.
 *
 * ### Variant Logic
 * - **variants**: No variants. Single-purpose: always `flex-wrap: wrap`. For `wrap-reverse`, use `<Flex wrap="wrap-reverse">` directly.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent semantic role. Wrap chips/tags inside a `<ul>` via `asChild` for list semantics.
 *
 * ### AI Usage
 * - **DO**: Use for tag lists, filter chips, skill badges, or any collection of variable-width inline items.
 * - **DO**: Prefer `<HStack>` when items are known never to wrap (fixed-count toolbars).
 *
 * @example Tag cloud / chip group
 * ```tsx
 * <Wrap gap="sm">
 *   {tags.map(tag => (
 *     <Tag key={tag.id}>{tag.label}</Tag>
 *   ))}
 * </Wrap>
 * ```
 *
 * @example Responsive button group that wraps on small screens
 * ```tsx
 * <Wrap gap="md" justify="flex-end">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="solid">Save Draft</Button>
 *   <Button variant="solid">Publish</Button>
 * </Wrap>
 * ```
 *
 * ### Notes
 * `<Wrap>` hardcodes `wrap="wrap"`. If you need to toggle wrapping conditionally,
 * use `<Flex wrap={condition ? "wrap" : "nowrap"}>` instead.
 */
export const Wrap = forwardRef<HTMLDivElement, WrapProps>((props, ref) => {
  return <Flex ref={ref} wrap="wrap" {...props} />;
});

Wrap.displayName = 'Wrap';
