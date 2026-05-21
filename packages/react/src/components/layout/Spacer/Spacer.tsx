import { forwardRef } from 'react';
import { Box } from '../Box';
import { SpacerProps } from './Spacer.types';

/**
 * A flexible spacer element that expands to fill available space within a flex container.
 * Implements the "spacer" layout primitive pattern commonly used to push sibling elements
 * to opposite ends of a flex row or column.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Box), no recipe. Renders as `<Box flex="1">` with `justifySelf="stretch"` and `alignSelf="stretch"` to absorb all available space.
 * - **Props**: SpacerProps
 *
 * ### Design Tokens
 * - **spacing**: No spacing tokens are applied directly. The spacer expands based on the parent's flex algorithm — Silver Ratio gap tokens on the parent control the rhythm.
 *
 * ### Variant Logic
 * - **variants**: No variants. The spacer is a single-purpose utility: it fills remaining space.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: Renders as a non-semantic `<div>` with `aria-hidden` implicit. Do NOT place meaningful content inside a `<Spacer>`.
 *
 * ### AI Usage
 * - **DO**: Use to push sibling elements apart within `<HStack>`, `<VStack>`, or `<Flex>`.
 * - **DON'T**: Do NOT use inside `<Grid>` or `<SimpleGrid>` — those use column gaps, not flex spacers.
 *
 * @example Push nav items to opposite ends of a header
 * ```tsx
 * <HStack>
 *   <Logo />
 *   <Spacer />
 *   <NavLinks />
 *   <UserMenu />
 * </HStack>
 * ```
 *
 * @example Footer with left and right sections
 * ```tsx
 * <Flex>
 *   <CopyrightText />
 *   <Spacer />
 *   <SocialLinks />
 * </Flex>
 * ```
 *
 * ### Notes
 * `<Spacer>` only works inside a flex container. It has no effect inside a grid or block layout.
 * For grid gap control, use the `gap` prop on `<Grid>` or `<SimpleGrid>` instead.
 */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      flex="1"
      justifySelf="stretch"
      alignSelf="stretch"
      aria-hidden="true"
      {...props}
    />
  );
});

Spacer.displayName = 'Spacer';
