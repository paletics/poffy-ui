import { BoxProps } from '../Box/Box.types';

/**
 * Properties for the Spacer component.
 *
 * ### Notes
 * Spacer expands only inside flex layout contexts such as `Flex`, `HStack`, and
 * `VStack`. It is marked `aria-hidden` by the component and should not contain
 * meaningful content.
 *
 * @example
 * ```tsx
 * import { HStack, Spacer } from '@poffy-ui/react/layout';
 * ```
 *
 * ### AI Usage
 * - Do: use between siblings that should be pushed apart.
 * - Don't: use inside Grid or SimpleGrid.
 */
export type SpacerProps = BoxProps;
