import { forwardRef } from 'react';
import { Stack } from '../Stack';
import { StackProps } from '../Stack/Stack.types';

/**
 * A vertical layout primitive — a semantic shortcut for `<Stack direction="column">`.
 * Automatically stretches children on the cross-axis (`align="stretch"`) for consistent
 * full-width vertical composition.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: stackStyle via Stack), Radix Slot (inherited)
 * - **Props**: VStackProps (Alias of StackProps)
 *
 * ### Design Tokens
 * - **spacing**: gap: Silver Ratio spacing tokens (e.g., `md` = 1.414× base unit)
 *
 * ### Variant Logic
 * - **direction**: locked to `"column"`. For horizontal stacking, use `<HStack>`.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent role. Use `asChild` with semantic elements (e.g., `<main>`, `<section>`, `<form>`) when establishing landmark or form regions.
 *
 * ### AI Usage
 * - **DO**: Use for form layouts, page section stacks, or any top-to-bottom flow of elements.
 * - **DO**: Prefer `<VStack>` over raw `<Stack direction="column">` for readability and intent clarity.
 *
 * @example Form field group
 * ```tsx
 * <VStack gap="md" align="stretch">
 *   <Label>Name</Label>
 *   <Input />
 *   <Label>Email</Label>
 *   <Input type="email" />
 * </VStack>
 * ```
 *
 * @example Full-height page section with asChild
 * ```tsx
 * <VStack asChild gap="xl">
 *   <main>
 *     <Hero />
 *     <Features />
 *     <Footer />
 *   </main>
 * </VStack>
 * ```
 *
 * ### Notes
 * `direction` prop is accepted but overridden to `"column"`. Passing `direction="row"`
 * has no effect — use `<HStack>` or `<Stack>` directly in that case.
 */
export const VStack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const { align = 'stretch', direction = 'column', ...rest } = props;
  return <Stack ref={ref} align={align} direction={direction} {...rest} />;
});

VStack.displayName = 'VStack';
