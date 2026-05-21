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
 * IconProps
 *
 * The public props for the Icon component.
 * Extends standard SVG attributes and includes `asChild` for polymorphism.
 *
 * @example
 * ```tsx
 * import { Icon } from '@poffy-ui/react/media';
 *
 * <Icon size="md" color="red.500" />
 * ```
 *
 * @example
 * ```tsx
 * import { Icon } from '@poffy-ui/react/media';
 *
 * <Icon asChild>
 *   <CustomSvg />
 * </Icon>
 * ```
 *
 * ### Notes
 * Do: keep default Icon output decorative and label the interactive parent.
 * Don't: rely on `asChild` to inject `aria-hidden`, `focusable`, or `viewBox`;
 * the child SVG owns those attributes.
 *
 * ### AI Usage
 * - Use named icons from `@poffy-ui/react/media` when available.
 * - Use raw `Icon` only for custom SVG paths that follow the 24x24 viewBox contract.
 */
export type IconProps = PrimitiveProps<'svg', IconOwnProps>;
