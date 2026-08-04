import type { MotionPrimitiveProps, StaticMotionAsChildHostProps } from '@/types/motion';
import type { SemanticIntent } from '@poffy-ui/types';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
} from '@/components/shared/polymorphicAsChild.types';

/** Optional semantic tint for a Skeleton placeholder. Most uses rely on shape and dimensions. */
export type SkeletonIntent = SemanticIntent;

/** Shape of the placeholder: text line, avatar-like circle, or rectangular content. */
export type SkeletonShape = 'text' | 'circle' | 'rect';

/** Animation treatment for the placeholder. */
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

/**
 * Props that reserve space for loading content. Skeleton itself is hidden from assistive technology;
 * place `aria-busy` or status text on the real loading region when users need an announcement.
 */
export interface SkeletonBaseProps {
  /**
   * Semantic tint used for the loading surface.
   *
   * @defaultValue `'secondary'`
   */
  intent?: SkeletonIntent;
  /**
   * The geometric shape.
   *
   * @defaultValue `'text'`
   */
  shape?: SkeletonShape;
  /**
   * The animation style.
   *
   * @defaultValue `'pulse'`
   */
  animation?: SkeletonAnimation;
  /**
   * Width of the skeleton. Applied through `--skeleton-width` so the recipe can map
   * sizing to each shape. Numeric values are converted to px; invalid numeric
   * values are omitted. Use CSS lengths or percentages for strings, not Panda
   * shorthand tokens.
   */
  width?: string | number;
  /**
   * Height of the skeleton. Applied through `--skeleton-height`.
   * For `shape="circle"`, the recipe preserves a 1:1 aspect ratio when omitted.
   * Numeric values are converted to px; invalid numeric values are omitted.
   */
  height?: string | number;
}

type SkeletonMotionProps = Omit<
  MotionPrimitiveProps<'span', SkeletonBaseProps>,
  'aria-hidden' | 'asChild' | 'children' | 'inert'
>;
interface SkeletonOwnedSemantics {
  'aria-hidden'?: never;
  inert?: never;
}

/** Props for Skeleton rendered with its default host. */
export type SkeletonDefaultProps = DefaultHostProps<SkeletonMotionProps> &
  SkeletonOwnedSemantics & {
    /** A default Skeleton is a content-free placeholder. */
    children?: never;
  };

type SkeletonAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'output'>, 'output'>
  | ReactElement<ComponentPropsWithoutRef<'span'>, 'span'>;

/** Props for Skeleton delegated to an asChild host. */
export type SkeletonAsChildProps = StaticMotionAsChildHostProps<
  SkeletonMotionProps,
  HTMLElement,
  SkeletonAsChildElement
> &
  SkeletonOwnedSemantics;

/** Public props for Skeleton. */
export type SkeletonProps = SkeletonDefaultProps | SkeletonAsChildProps;

/** Polymorphic component call signatures for Skeleton. */
export type SkeletonComponent = PolymorphicAsChildComponent<
  SkeletonDefaultProps,
  SkeletonAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;
