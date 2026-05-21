import { PoffyResolvedColorMode } from '@/providers';
import { popover, PopoverVariantProps } from '@/styled-system/recipes';
import { PoffyBrand } from '@/providers';
import type { MiddlewareData, Placement, ReferenceType, UseRoleProps } from '@floating-ui/react';
import { ReactNode } from 'react';
import type { PrimitiveProps } from '@poffy-ui/types';
import type { OverlayContext } from '../shared/factories/types';

/**
 * Variants for the Popover component based on Panda CSS recipe.
 *
 */
export type PopoverVariants = PopoverVariantProps;

/**
 * Props for the Popover root provider.
 *
 * Required structure: use either `PopoverTrigger` or `PopoverAnchor`, then
 * `PopoverContent` for the floating surface. Use `PopoverTitle` for a named
 * dialog and `PopoverDescription` for announced helper text.
 *
 * Controlled contract: pass `open` with `onOpenChange`. Uncontrolled
 * contract: omit `open`; click triggers manage state by default. Set
 * `triggerMode="manual"` when another component controls the reference and
 * open state.
 *
 * Do: use Popover for interactive non-modal content. Don't: use Tooltip for
 * focusable content or use Popover as a replacement for Modal when background
 * interaction must be blocked.
 *
 * @example
 * ```tsx
 * import {
 *   Popover,
 *   PopoverClose,
 *   PopoverContent,
 *   PopoverTitle,
 *   PopoverTrigger,
 * } from '@poffy-ui/react/overlay';
 *
 * <Popover placement="bottom-start">
 *   <PopoverTrigger>Open details</PopoverTrigger>
 *   <PopoverContent focusManagement>
 *     <PopoverTitle>Details</PopoverTitle>
 *     <PopoverClose />
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * Related: PopoverTriggerProps
 * Related: PopoverContentProps
 *
 */
export interface PopoverProps extends PopoverVariants {
  /**
   * Whether the popover is currently open.
   * If provided, the popover becomes a controlled component.
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /** Popover subtree. Include a trigger or anchor and `PopoverContent`. */
  children?: ReactNode;

  /**
   * Preferred placement of the popover relative to the trigger.
   * @defaultValue "bottom"
   */
  placement?: Placement;

  /**
   * Whether to display an arrow pointing to the trigger.
   * @defaultValue true
   */
  showArrow?: boolean;

  /**
   * Theme brand override.
   * @defaultValue current brand from theme context
   */
  brand?: PoffyBrand;

  /**
   * Theme color mode override.
   * @defaultValue current color mode from context
   */
  theme?: PoffyResolvedColorMode;

  /**
   * Trigger interaction mode.
   * - `click`: PopoverTrigger toggles open/close on click.
   * - `manual`: Trigger only provides anchor/ref wiring; open state is controlled externally.
   * @defaultValue "click"
   */
  triggerMode?: 'click' | 'manual';

  /**
   * Floating role used by `useRole`.
   * @defaultValue "dialog"
   */
  floatingRole?: UseRoleProps['role'];
}

/** Props for the button that toggles and anchors a click-triggered popover. */
export type PopoverTriggerProps = PrimitiveProps<'button'>;

/** Props for a non-button anchor when open state is controlled elsewhere. */
export type PopoverAnchorProps = PrimitiveProps<'div'>;

/**
 * Props for the floating popover surface.
 *
 * Set `focusManagement` when the content contains focusable controls. Leave it
 * false for lightweight informational content that should not trap focus.
 */
export interface PopoverContentProps extends PrimitiveProps<'div'> {
  /**
   * Enables FloatingFocusManager wrapping when true.
   * @defaultValue false
   */
  focusManagement?: boolean;
}

/** Props for the optional accessible popover heading. */
export type PopoverTitleProps = PrimitiveProps<'h3'>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type PopoverDescriptionProps = PrimitiveProps<'p'>;

/** Props for the decorative arrow. Usually controlled by `showArrow`. */
export type PopoverArrowProps = PrimitiveProps<'svg'>;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type PopoverCloseProps = PrimitiveProps<'button'>;

/**
 * Value provided by the PopoverContext.
 *
 * ### AI Context & Architecture
 * Extends OverlayContext<ReferenceType> to inherit shared overlay fields
 * (open, refs, context, getFloatingProps, titleId, descriptionId, brand, theme, classes).
 * Unique to Popover: anchor positioning (floatingStyles, middlewareData),
 * arrow management (arrowRef, setArrowElement, showArrow), and setOpen/getReferenceProps.
 */
export interface PopoverContextValue extends OverlayContext<ReferenceType> {
  /**
   * Popover-specific setter alias (same reference as onOpenChange).
   * Exposed for consumers who interact with Popover state directly.
   */
  setOpen: (open: boolean) => void;

  /** CSS properties for positioning the floating element (anchored overlay, not fixed). */
  floatingStyles: React.CSSProperties;

  /** Data returned from Floating UI middleware, used for arrow positioning. */
  middlewareData: MiddlewareData;

  /** Prop getter for the trigger element. Not part of OverlayContext. */
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** Prop getter for the popover content. Narrows optional OverlayContext.getFloatingProps. */
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** ID for the title element (required; narrows base OverlayContext's optional titleId). */
  titleId: string;

  /** ID for the description element (required; narrows base OverlayContext's optional descriptionId). */
  descriptionId: string;

  /** Computed classes from the popover recipe (narrowed from Record<string, string>). */
  classes: ReturnType<typeof popover>;

  /** Ref for the arrow SVG element. */
  arrowRef: React.RefObject<SVGSVGElement | null>;

  /** Setter for the arrow SVG element ref. */
  setArrowElement: (node: SVGSVGElement | null) => void;

  /** Whether to render the arrow pointing to the trigger. */
  showArrow: boolean;
}
