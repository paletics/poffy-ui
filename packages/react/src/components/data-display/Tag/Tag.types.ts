import { RecipeVariantProps } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import {
  type ControlShape,
  type NavigationAppearance,
  type SemanticIntent,
  PrimitiveProps,
} from '@poffy-ui/types';
import type { ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Public type for `TagRecipeVariants`. */
export type TagRecipeVariants = RecipeVariantProps<typeof tag>;

/**
 * Visual surface treatment for Tag.
 */
export type TagAppearance = Extract<NavigationAppearance, 'soft' | 'outline' | 'ghost'>;

/**
 * Semantic accent color for Tag.
 */
export type TagIntent = Extract<
  SemanticIntent,
  'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
>;

/**
 * Corner geometry for Tag.
 */
export type TagShape = Extract<ControlShape | 'pill', 'rounded' | 'pill'>;

/** Shared base props for Tag. */
export type TagBaseProps = TagRecipeVariants & {
  /**
   * Public appearance.
   * @defaultValue 'soft'
   */
  appearance?: TagAppearance;
  /**
   * Public semantic accent.
   * @defaultValue 'primary'
   */
  intent?: TagIntent;
  /**
   * Public geometry control.
   * @defaultValue 'rounded'
   */
  shape?: TagShape;
  /**
   * The size of the tag.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Type checks Tag root props with native `span` attributes.
 */
type TagRootNativeProps = PrimitiveProps<'span', TagBaseProps>;
/** Props for Tag rendered with its default host. */
export type TagDefaultProps = DefaultHostProps<TagRootNativeProps>;
/** Props for Tag delegated to an asChild host. */
export type TagAsChildProps = RetargetedAsChildHostProps<TagRootNativeProps, HTMLElement>;
/** Public props for Tag. */
export type TagProps = TagDefaultProps | TagAsChildProps;
/** Polymorphic component call signatures for Tag. */
export type TagComponent = PolymorphicAsChildComponent<
  TagDefaultProps,
  TagAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Type checks TagLabel wrapping a native `span`.
 */
type TagLabelNativeProps = PrimitiveProps<'span'>;
/** Props for TagLabel rendered with its default host. */
export type TagLabelDefaultProps = DefaultHostProps<TagLabelNativeProps>;
/** Props for TagLabel delegated to an asChild host. */
export type TagLabelAsChildProps = RetargetedAsChildHostProps<TagLabelNativeProps, HTMLElement>;
/** Public props for TagLabel. */
export type TagLabelProps = TagLabelDefaultProps | TagLabelAsChildProps;
/** Polymorphic component call signatures for TagLabel. */
export type TagLabelComponent = PolymorphicAsChildComponent<
  TagLabelDefaultProps,
  TagLabelAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Base properties for the Tag dismiss button.
 */
export interface TagCloseButtonBaseProps {
  /**
   * Aria label for the close button.
   *
   * ### Notes
   * Replace the default with object-specific text such as
   * `Remove Documentation tag` when multiple tags can be dismissed.
   *
   * @defaultValue 'Close'
   */
  'aria-label'?: string;
  /**
   * Prevents all pointer and keyboard activation while preserving the control's label.
   */
  isDisabled?: boolean;
}

/**
 * Type checks TagCloseButton with native `button` attributes.
 */
type TagCloseButtonNativeProps = Omit<PrimitiveProps<'button', TagCloseButtonBaseProps>, 'type'>;
type TagCloseButtonAsChildElement = ReactElement<
  Record<string, unknown>,
  | 'a'
  | 'abbr'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'button'
  | 'cite'
  | 'code'
  | 'data'
  | 'del'
  | 'dfn'
  | 'div'
  | 'em'
  | 'i'
  | 'ins'
  | 'kbd'
  | 'mark'
  | 'q'
  | 'rp'
  | 'rt'
  | 'ruby'
  | 's'
  | 'samp'
  | 'small'
  | 'span'
  | 'strong'
  | 'sub'
  | 'sup'
  | 'time'
  | 'u'
  | 'var'
>;
/** Props for TagCloseButton rendered with its default host. */
export type TagCloseButtonDefaultProps = DefaultHostProps<TagCloseButtonNativeProps>;
/** Props for TagCloseButton delegated to an asChild host. */
export type TagCloseButtonAsChildProps = RetargetedAsChildHostProps<
  TagCloseButtonNativeProps,
  HTMLElement,
  TagCloseButtonAsChildElement
>;
/** Public props for TagCloseButton. */
export type TagCloseButtonProps = TagCloseButtonDefaultProps | TagCloseButtonAsChildProps;
/** Polymorphic component call signatures for TagCloseButton. */
export type TagCloseButtonComponent = PolymorphicAsChildComponent<
  TagCloseButtonDefaultProps,
  TagCloseButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
