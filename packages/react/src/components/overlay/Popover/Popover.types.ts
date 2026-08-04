import { PoffyResolvedColorMode } from '@/providers';
import { popover } from '@/styled-system/recipes';
import { PoffyBrand } from '@/providers';
import type { MiddlewareData, Placement, ReferenceType, UseRoleProps } from '@floating-ui/react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type { PrimitiveProps } from '@poffy-ui/types';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type {
  OverlayContext,
  OverlayCloseProps,
  OverlayPartProps,
  OverlayTextAsChildElement,
  OverlayTriggerProps,
} from '../shared/factories/types';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Props for the Popover root provider.
 *
 * Required structure: use either `PopoverTrigger` or `PopoverAnchor`, then
 * `PopoverContent` for the floating surface. Use `PopoverTitle` for a named
 * dialog and `PopoverDescription` for announced helper text.
 *
 * Controlled contract: pass `open` with `onOpenChange`. An unpaired `open`
 * value falls back to initial uncontrolled state and warns in development.
 * Uncontrolled contract: omit `open`; click triggers manage state by default. Set
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
interface PopoverBaseProps {
  /** Popover subtree. Include a trigger or anchor and `PopoverContent`. */
  children?: ReactNode;

  /** Preferred placement of the popover relative to the trigger. */
  placement?: Placement;

  /** Whether to display an arrow pointing to the trigger. */
  showArrow?: boolean;

  /** Theme brand override. */
  brand?: PoffyBrand;

  /** Theme color mode override. */
  theme?: PoffyResolvedColorMode;
}

interface ClickPopoverBaseProps extends PopoverBaseProps {
  triggerMode?: 'click';
}

interface ControlledClickPopoverProps extends ClickPopoverBaseProps {
  /** Controlled visibility. */
  open: boolean;
  /** Required controlled-state update callback. */
  onOpenChange: (open: boolean) => void;
}

interface UncontrolledClickPopoverProps extends ClickPopoverBaseProps {
  /** Uncontrolled click Popovers own their visibility. */
  open?: never;
  /** Optional notification when uncontrolled visibility changes. */
  onOpenChange?: (open: boolean) => void;
}

/** Click-triggered Popover configuration, controlled or uncontrolled. */
export type ClickPopoverProps = ControlledClickPopoverProps | UncontrolledClickPopoverProps;

/** Manual Popover configuration, always controlled by the owning component. */
export interface ManualPopoverProps extends PopoverBaseProps {
  triggerMode: 'manual';
  /** Current visibility owned by the caller. */
  open: boolean;
  /** Receives dismissal requests such as Escape or outside press. */
  onOpenChange: (open: boolean) => void;
}

/** Public props for Popover. */
export type PopoverProps = ClickPopoverProps | ManualPopoverProps;

/**
 * Props for the button that toggles and anchors a click-triggered popover. The
 * forwarded ref targets the default button or the slotted trigger with `asChild`.
 */
export type PopoverTriggerProps = OverlayTriggerProps;

/** Visual ownership for a floating popover content container. */
export type PopoverContentSurface = 'default' | 'none';

/**
 * Props for a non-button anchor when open state is controlled elsewhere. The
 * forwarded ref targets the default div or the slotted anchor with `asChild`.
 */
type PopoverAnchorNativeProps = PrimitiveProps<'div'>;
/** Props for PopoverAnchor rendered with its default host. */
export type PopoverAnchorDefaultProps = DefaultHostProps<PopoverAnchorNativeProps>;
/** Props for PopoverAnchor delegated to an asChild host. */
export type PopoverAnchorAsChildProps = RetargetedAsChildHostProps<
  PopoverAnchorNativeProps,
  Element,
  ReactElement
>;
/** Public props for PopoverAnchor. */
export type PopoverAnchorProps = PopoverAnchorDefaultProps | PopoverAnchorAsChildProps;
/** Polymorphic component call signatures for PopoverAnchor. */
export type PopoverAnchorComponent = PolymorphicAsChildComponent<
  PopoverAnchorDefaultProps,
  PopoverAnchorAsChildProps,
  HTMLDivElement,
  Element
>;

/**
 * Props for the floating popover surface.
 *
 * Focus management is enabled by default because public Popover owns the
 * interactive non-modal dialog pattern. Leave it false only when an owning
 * composite manages focus and Tab order.
 * The forwarded ref targets the default div or the safe slotted content host.
 */
interface PopoverContentOwnProps extends Omit<PrimitiveProps<'div', PortalTargetProps>, 'role'> {
  /**
   * Selects whether PopoverContent owns the visual surface and focus-safe inner inset.
   * Use `none` only when the child owns its background, border, padding, and focus-ring
   * clearance (for example Calendar or a listbox surface).
   * @defaultValue 'default'
   */
  surface?: PopoverContentSurface;

  /**
   * Enables FloatingFocusManager wrapping when true.
   * @defaultValue true
   */
  focusManagement?: boolean;

  /**
   * Renders Floating UI's hidden focus guards when focus management is enabled.
   * Disable this only when the owning composite explicitly manages how Tab
   * leaves a portalled surface.
   * @defaultValue true
   */
  focusGuards?: boolean;

  /**
   * Returns focus to the reference when managed content unmounts.
   * Disable when the owning composite moves focus explicitly on close.
   * @defaultValue true
   */
  returnFocus?: boolean;
}
type PopoverContentAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
export type PopoverContentDefaultProps = DefaultHostProps<PopoverContentOwnProps>;
export type PopoverContentAsChildProps = RetargetedAsChildHostProps<
  PopoverContentOwnProps,
  HTMLElement,
  PopoverContentAsChildElement
>;
/** Public props for PopoverContent. */
export type PopoverContentProps = PopoverContentDefaultProps | PopoverContentAsChildProps;
export type PopoverContentComponent = PolymorphicAsChildComponent<
  PopoverContentDefaultProps,
  PopoverContentAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/** Props for the optional accessible popover heading. */
export type PopoverTitleProps = OverlayPartProps<
  'h3',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type PopoverDescriptionProps = OverlayPartProps<
  'p',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for the decorative arrow. Usually controlled by `showArrow`. */
export type PopoverArrowProps = PrimitiveProps<'svg'>;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type PopoverCloseProps = OverlayCloseProps;


export interface PopoverContextValue extends OverlayContext<ReferenceType> {
  /**
   * Popover-specific setter alias (same reference as onOpenChange).
   * Exposed for consumers who interact with Popover state directly.
   */
  setOpen: (open: boolean) => void;

  /** Mounted content id used by the trigger's aria-controls relation. */
  contentId?: string;

  /** Registers a mounted PopoverContent id and returns its cleanup function. */
  registerContentId: (id: string) => () => void;

  /** CSS properties for positioning the floating element (anchored overlay, not fixed). */
  floatingStyles: React.CSSProperties;

  /** Data returned from Floating UI middleware, used for arrow positioning. */
  middlewareData: MiddlewareData;

  /** Prop getter for the trigger element. Not part of OverlayContext. */
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** Prop getter for the popover content. Narrows optional OverlayContext.getFloatingProps. */
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;

  /** Computed classes from the popover recipe (narrowed from Record<string, string>). */
  classes: ReturnType<typeof popover>;

  /** Ref for the arrow SVG element. */
  arrowRef: React.RefObject<SVGSVGElement | null>;

  /** Setter for the arrow SVG element ref. */
  setArrowElement: (node: SVGSVGElement | null) => void;

  /** Whether to render the arrow pointing to the trigger. */
  showArrow: boolean;

  /** Internal semantic role shared by Floating UI interactions and semantic presets. */
  popupRole: NonNullable<UseRoleProps['role']>;
}
