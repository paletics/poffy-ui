import { PrimitiveProps } from '@poffy-ui/types';
import { type ControlShape } from '@poffy-ui/types';
import { AvatarVariantProps } from '@/styled-system/recipes';
import type { avatar } from '@/styled-system/recipes';
import { ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

type AvatarRecipeVariants = AvatarVariantProps;

/**
 * Public Avatar variant props with shared control shape names.
 *
 * ### Notes
 * Do: use `shape="rounded"` or `shape="square"` to match nearby controls.
 * Don't: invent custom shape strings; add a system-level shape token first.
 */
export interface AvatarVariantSubset extends Omit<AvatarRecipeVariants, 'shape'> {
  /** Avatar silhouette. Defaults to the recipe's rounded shape. */
  shape?: ControlShape;
}

/**
 * Canonical public variants accepted by Avatar and suitable for component
 * wrappers.
 */
export type AvatarVariants = AvatarVariantSubset;

/**
 * Runtime state shared internally by Avatar compound children.
 */
export interface AvatarContextValue extends AvatarVariantSubset {
  classes: ReturnType<typeof avatar>;
  /** Current image loading state shared with Image and Fallback children. */
  status: 'loading' | 'loaded' | 'error';
  /** Whether an image resource is currently loading. */
  hasLoadingImage: boolean;
  /** Whether the composed avatar includes an image source. */
  hasImage: boolean;
  /** Whether the avatar is intentionally hidden from assistive technology. */
  decorative: boolean;
  /** Registers an image resource whose lifecycle contributes to the shared status. */
  registerImage: (id: string) => void;
  /** Removes an image resource from the shared status calculation. */
  unregisterImage: (id: string) => void;
  /** Reports the lifecycle status of a registered image resource. */
  setImageStatus: (id: string, status: 'loading' | 'loaded' | 'error') => void;
}

/** Shared base props for AvatarRoot. */
export interface AvatarRootBaseProps extends AvatarVariantSubset {
  children?: ReactNode;
  /**
   * Called when the aggregate status changes between `loading`, `loaded`, and `error`.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
  /** Hides the complete avatar from assistive technology. */
  decorative?: boolean;
}

/**
 * Native props accepted by the default `span` root.
 */
type AvatarRootNativeProps = Omit<
  PrimitiveProps<'span', AvatarRootBaseProps>,
  'aria-hidden' | 'data-status'
>;
interface AvatarManagedRootProps {
  'aria-hidden'?: never;
  'data-status'?: never;
}
/** Props for AvatarRoot rendered with its default host. */
export type AvatarRootDefaultProps = DefaultHostProps<AvatarRootNativeProps> &
  AvatarManagedRootProps;
/** Props for AvatarRoot delegated to an asChild host. */
export type AvatarRootAsChildProps = RetargetedAsChildHostProps<
  AvatarRootNativeProps,
  HTMLElement
> &
  AvatarManagedRootProps;
/** Public props for AvatarRoot. */
export type AvatarRootProps = AvatarRootDefaultProps | AvatarRootAsChildProps;
/** Polymorphic component call signatures for AvatarRoot. */
export type AvatarRootComponent = PolymorphicAsChildComponent<
  AvatarRootDefaultProps,
  AvatarRootAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

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
  /** Forces an empty image alternative. Inherits from Avatar.Root when omitted. */
  decorative?: boolean;
  /**
   * Called when this image settles. `Avatar.Root` also receives the result
   * when this component is composed below it.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

type AvatarImageNativeProps = Omit<PrimitiveProps<'img', AvatarImageBaseProps>, 'data-loading'>;
type AvatarInformativeImageProps = Omit<AvatarImageNativeProps, 'decorative'> & {
  decorative?: false;
};
type AvatarDecorativeImageProps = Omit<
  AvatarImageNativeProps,
  'aria-label' | 'aria-labelledby' | 'decorative'
> & {
  decorative: true;
  /** Decorative images cannot expose an accessible name. */
  'aria-label'?: never;
  /** Decorative images cannot expose an accessible name. */
  'aria-labelledby'?: never;
};
type AvatarDynamicDecorativeImageProps = Omit<
  AvatarImageNativeProps,
  'aria-label' | 'aria-labelledby' | 'decorative'
> & {
  decorative: boolean;
  'aria-label'?: never;
  'aria-labelledby'?: never;
};
/** Public props for AvatarImage. */
export type AvatarImageProps = (
  | AvatarInformativeImageProps
  | AvatarDecorativeImageProps
  | AvatarDynamicDecorativeImageProps
) & {
  /** Managed by Avatar.Image from the current resource lifecycle. */
  'data-loading'?: never;
};

/**
 * Base properties for the AvatarFallback component.
 *
 * ### Notes
 * Use `name` when children are not supplied so the fallback can generate initials.
 */
export interface AvatarFallbackBaseProps {
  children?: ReactNode;
  /**
   * Name used to generate one or two uppercase initials when `children` is omitted.
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
 * Props accepted by the default fallback `span`.
 */
type AvatarFallbackNativeProps = PrimitiveProps<'span', AvatarFallbackBaseProps>;
/** Props for AvatarFallback rendered with its default host. */
export type AvatarFallbackDefaultProps = DefaultHostProps<AvatarFallbackNativeProps>;
/** Props for AvatarFallback delegated to an asChild host. */
export type AvatarFallbackAsChildProps = RetargetedAsChildHostProps<
  AvatarFallbackNativeProps,
  HTMLElement
>;
/** Public props for AvatarFallback. */
export type AvatarFallbackProps = AvatarFallbackDefaultProps | AvatarFallbackAsChildProps;
/** Polymorphic component call signatures for AvatarFallback. */
export type AvatarFallbackComponent = PolymorphicAsChildComponent<
  AvatarFallbackDefaultProps,
  AvatarFallbackAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Shorthand props for rendering the compound Avatar from a single component.
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
  /** Marks the shorthand avatar as decorative and forces an empty image alternative. */
  decorative?: boolean;
  /** Name used by Avatar.Fallback to generate initials when no custom children are supplied. */
  name?: string;
  children?: ReactNode;
  /**
   * Called when the aggregate image status changes.
   */
  onStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

/**
 * Native props accepted by the shorthand's default `span` root.
 */
type AvatarNativeProps = Omit<
  PrimitiveProps<'span', AvatarBaseProps>,
  'aria-hidden' | 'data-status'
>;
/** Props for Avatar rendered with its default host. */
export type AvatarDefaultProps = DefaultHostProps<AvatarNativeProps> & AvatarManagedRootProps;
/** Props for Avatar delegated to an asChild host. */
export type AvatarAsChildProps = RetargetedAsChildHostProps<AvatarNativeProps, HTMLElement> &
  AvatarManagedRootProps;
/** Public props for Avatar. */
export type AvatarProps = AvatarDefaultProps | AvatarAsChildProps;
/** Polymorphic component call signatures for Avatar. */
export type AvatarComponent = PolymorphicAsChildComponent<
  AvatarDefaultProps,
  AvatarAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;
