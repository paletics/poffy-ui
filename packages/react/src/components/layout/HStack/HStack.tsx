import { forwardRef } from 'react';
import { Stack } from '../Stack';
import { StackProps } from '../Stack/Stack.types';

/**
 * A horizontal layout primitive — a semantic shortcut for `<Stack direction="row">`.
 * Automatically centers children on the cross-axis (`align="center"`) to match
 * the most common horizontal composition pattern.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: stackStyle via Stack), Radix Slot (inherited)
 * - **Props**: StackProps
 *
 * ### Design Tokens
 * - **spacing**: gap: Silver Ratio spacing tokens (e.g., `md` = 1.414× base unit)
 *
 * ### Variant Logic
 * - **direction**: Locked to `"row"`. For vertical stacking, use `<VStack>`.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent role. Wrap in a semantic element via `asChild` (e.g., `<nav>`, `<header>`) when establishing landmark regions.
 *
 * ### AI Usage
 * - **DO**: Use for icon+label pairs, toolbar items, or any side-by-side inline elements.
 * - **DO**: Prefer `<HStack>` over raw `<Stack direction="row">` for readability.
 *
 * @example Standard usage
 * ```tsx
 * // Icon + label inline layout
 * <HStack gap="sm">
 *   <Icon name="star" />
 *   <Text>Rating</Text>
 * </HStack>
 * ```
 *
 * @example Using asChild for semantic HTML
 * ```tsx
 * <HStack asChild gap="md">
 *   <nav>
 *     <a href="/">Home</a>
 *     <a href="/about">About</a>
 *   </nav>
 * </HStack>
 * ```
 */
export const HStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const { align = 'center', direction = 'row', ...rest } = props;
  return <Stack ref={ref} align={align} direction={direction} {...rest} />;
});

HStack.displayName = 'HStack';
