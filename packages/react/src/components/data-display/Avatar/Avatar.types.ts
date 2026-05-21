import { PrimitiveProps } from '@poffy-ui/types';
import { type ControlShape } from '@poffy-ui/types';
import { AvatarVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS avatar recipe.
 *
 * ### Notes
 * Prefer `AvatarProps` or `AvatarRootProps` in application code.
 * Use this type only when a wrapper needs to mirror recipe variant keys.
 *
 * ### AI Usage
 * - Use this when extending avatar styles.
 */
export type AvatarVariants = AvatarVariantProps;

/**
 * Public Avatar variant props with shared control shape names.
 *
 * ### Notes
 * Do: use `shape="circle"` or another supported control shape to match nearby controls.
 * Don't: invent custom shape strings; add a system-level shape token first.
 */
export interface AvatarVariantSubset extends Omit<AvatarVariantProps, 'shape'> {
  /** Avatar silhouette. */
  shape?: ControlShape;
}

/**
 * Common props for all Avatar sub-components to maintain consistency.
 */
export interface AvatarContextValue extends AvatarVariantSubset {
  /** Current image loading state shared with Image and Fallback children. */
  status: 'loading' | 'loaded' | 'error';
  /** Updates the shared image loading state from Avatar.Image lifecycle events. */
  setStatus: (status: 'loading' | 'loaded' | 'error') => void;
}

/**
 * Comprehensive properties for the AvatarRoot component.
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to all size and padding variants inside the recipe.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar.Root size="md">
 *   <Avatar.Image src="/people/jane.jpg" alt="Jane Doe" />
 *   <Avatar.Fallback name="Jane Doe" />
 * </Avatar.Root>
 * ```
 *
 * ### AI Usage
 * - Use this for custom Avatar composition when shorthand `Avatar` is not enough.
 * - Keep exactly one image and one fallback in the root so loading state remains predictable.
 */
export interface AvatarRootBaseProps extends AvatarVariantSubset {
  children?: ReactNode;
  /**
   * Callback fired when the image loading status changes.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

/**
 * Prop type for usage in components utilizing the Root element.
 */
export type AvatarRootProps = PrimitiveProps<'span', AvatarRootBaseProps>;

/**
 * Base properties for the AvatarImage component.
 *
 * ### Notes
 * Do: provide `alt` with the represented person's name.
 * Don't: leave `alt` empty unless the avatar is purely decorative and already named nearby.
 */
export interface AvatarImageBaseProps {
  src?: string;
  alt?: string;
  /**
   * Callback fired when the image loading status changes.
   * This is internal and managed by Avatar.Root if used as a child.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

/**
 * Extends `img` attributes, enforcing consistent image representation.
 * ### AI Usage
 * - Use this to enforce image rules within the avatar container.
 */
export type AvatarImageProps = PrimitiveProps<'img', AvatarImageBaseProps>;

/**
 * Base properties for the AvatarFallback component.
 *
 * ### Notes
 * Use `name` when children are not supplied so the fallback can generate initials.
 */
export interface AvatarFallbackBaseProps {
  children?: ReactNode;
  /**
   * Name to generate initials from.
   */
  name?: string;
  /**
   * Delay in milliseconds before the fallback is shown.
   * Useful to avoid a flash when the image loads quickly.
   * @defaultValue 0
   */
  delayMs?: number;
}

/**
 * Prop type for identifying what replaces a missing image.
 */
export type AvatarFallbackProps = PrimitiveProps<'span', AvatarFallbackBaseProps>;

/**
 * Legacy props for backward compatibility if needed,
 * or as a shorthand for the Molecule version.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar src="/people/jane.jpg" alt="Jane Doe" name="Jane Doe" size="md" />
 * ```
 */
export interface AvatarBaseProps extends AvatarVariantSubset {
  src?: string;
  alt?: string;
  /** Name used by Avatar.Fallback to generate initials when no custom children are supplied. */
  name?: string;
  children?: ReactNode;
  /**
   * Callback fired when the image loading status changes.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

/**
 * Type checks Avatar instances for the complete set of valid props.
 */
export type AvatarProps = PrimitiveProps<'span', AvatarBaseProps>;
