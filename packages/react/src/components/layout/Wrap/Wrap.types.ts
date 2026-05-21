import { FlexProps } from '../Flex/Flex.types';

/**
 * Properties for the Wrap component.
 *
 * ### Notes
 * Wrap is a directional Flex alias with `wrap="wrap"` fixed. Use it for
 * variable-width inline collections such as tags, chips, and action groups.
 *
 * @example
 * ```tsx
 * import { Wrap } from '@poffy-ui/react/layout';
 * ```
 *
 * ### AI Usage
 * - Do: use for collections that can naturally flow to multiple rows.
 * - Don't: use for fixed single-row navigation; use `HStack`.
 */
export type WrapProps = FlexProps;
