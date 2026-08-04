import { IconVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * IconOwnProps
 *
 * Properties specific to the Icon component, including:
 * - `IconVariantProps`: Variants defined in the Panda CSS recipe (e.g., `size`, `disabled`).
 * - `JsxStyleProps`: Panda CSS style props (e.g., `mt`, `color`, `p`).
 *
 * ### Notes
 * Prefer `IconProps` for component usage. Use this type when building
 * named icon components that wrap the base Icon primitive.
 *
 * Related: `IconVariantProps`
 * Related: `JsxStyleProps`
 */
export type IconOwnProps = IconVariantProps & JsxStyleProps;

/**
 * Props for Icon. The default SVG is decorative; `asChild` accepts an SVG-owning child and transfers
 * responsibility for `viewBox`, focus, and accessible naming to that child.
 */
export type IconProps = PrimitiveProps<'svg', IconOwnProps>;
