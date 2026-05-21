import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import type { OverlayAnimationType } from '@/components/animations/OverlayTransition/OverlayTransition.types';
import { FloatingContext, ReferenceType, ExtendedRefs } from '@floating-ui/react';
import { ElementType, HTMLProps } from 'react';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Standardized refs for overlay components.
 * Alias for Floating UI's ExtendedRefs — domReference and setDomReference are inherited.
 */
export type OverlayRefs<T extends ReferenceType> = ExtendedRefs<T>;

/**
 * Common context interface shared by overlay factories.
 *
 * Overlay roots provide this value; generated subcomponents consume it. Required
 * accessible structure is enforced by IDs rather than prop drilling:
 * content uses `titleId` for `aria-labelledby`, descriptions use
 * `descriptionId` for `aria-describedby`, and close buttons call
 * `onOpenChange(false)`.
 *
 * Do: create component-specific contexts that extend this type. Don't: expose
 * this context directly as the preferred public API for application code.
 *
 * Generic `T` represents the reference element type and defaults to Floating
 * UI's `ReferenceType`.
 */
export interface OverlayContext<T extends ReferenceType> {
  /**
   * Map of class names generated from the component's Panda CSS recipe.
   */
  classes: Record<string, string>;

  /**
   * Unique ID for the title element to be used with aria-labelledby.
   */
  titleId?: string;

  /**
   * Unique ID for the description element to be used with aria-describedby.
   */
  descriptionId?: string;

  /**
   * Whether the overlay is currently open.
   */
  open: boolean;

  /**
   * The optional brand variant.
   */
  brand?: PoffyBrand;

  /**
   * The optional color mode/theme.
   */
  theme?: PoffyResolvedColorMode;

  /**
   * Floating UI context provided by useFloating/useOverlay.
   */
  context: FloatingContext<T>;

  /**
   * Floating UI refs provided by useFloating/useOverlay.
   */
  refs: OverlayRefs<T>;

  /**
   * Hook to get props for the floating element.
   */
  getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;

  /**
   * Callback to change the open state.
   * Required by all overlay types — consumed by createOverlayClose to dismiss the overlay.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Animation preset for the overlay content.
   * Consumed by createOverlayContent to drive OverlayTransition.
   * @defaultValue 'modal'
   */
  animationType?: OverlayAnimationType;
}

/**
 * Shared polymorphic props for overlay sub-components generated via factories.
 *
 * Factories support Radix `asChild`; the caller is responsible for preserving
 * equivalent semantics when replacing the default element.
 */
export type OverlaySubComponentProps<T extends ElementType, P = object> = PrimitiveProps<T, P>;
