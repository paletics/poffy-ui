import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { hoverCard, HoverCardVariantProps } from '@/styled-system/recipes';
import type { Placement, ReferenceType } from '@floating-ui/react';
import type { NativeProps } from '@poffy-ui/types';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import type { CSSProperties, HTMLProps, ReactNode } from 'react';
import type {
  OverlayContext,
  OverlayPartProps,
  OverlayRefs,
  OverlayTextAsChildElement,
  OverlayTriggerAsChildProps,
  OverlayTriggerDefaultProps,
} from '../shared/factories/types';
import type { PolymorphicAsChildComponent } from '@/components/shared/polymorphicAsChild.types';

/** Public visual variant props for HoverCard. */
export type HoverCardVariants = HoverCardVariantProps;

interface HoverCardBaseProps extends HoverCardVariants {
  /** HoverCard subtree. Include `HoverCardTrigger` and `HoverCardContent`. */
  children?: ReactNode;

  /** Preferred placement relative to the trigger. */
  placement?: Placement;

  /** Whether to display an arrow pointing to the trigger. */
  showArrow?: boolean;

  /** Delay in milliseconds before opening from hover. */
  openDelay?: number;

  /** Delay in milliseconds before closing after hover leaves. */
  closeDelay?: number;

  /** Disables hover/focus interactions and closes an uncontrolled card. */
  disabled?: boolean;

  /** Theme brand override. */
  brand?: PoffyBrand;

  /** Theme color mode override. */
  theme?: PoffyResolvedColorMode;
}

/** Controlled state props for HoverCard. */
export interface ControlledHoverCardProps extends HoverCardBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled state props for HoverCard. */
export interface UncontrolledHoverCardProps extends HoverCardBaseProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for HoverCard. */
export type HoverCardProps = ControlledHoverCardProps | UncontrolledHoverCardProps;

/**
 * Trigger props. With `asChild`, provide one element that forwards props and
 * refs; reference hosts (including inputs) are supported. The forwarded ref
 * targets the default button or that slotted host. Use a focusable host when
 * keyboard users need to discover the hover card.
 */
export type HoverCardTriggerDefaultProps = Omit<OverlayTriggerDefaultProps, 'disabled'>;
/** Props for HoverCardTrigger delegated to an asChild host. */
export type HoverCardTriggerAsChildProps = Omit<OverlayTriggerAsChildProps, 'disabled'>;
/** Public props for HoverCardTrigger. */
export type HoverCardTriggerProps = HoverCardTriggerDefaultProps | HoverCardTriggerAsChildProps;
/** Polymorphic component call signatures for HoverCardTrigger. */
export type HoverCardTriggerComponent = PolymorphicAsChildComponent<
  HoverCardTriggerDefaultProps,
  HoverCardTriggerAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;

/** Public props for HoverCardContent. */
export interface HoverCardContentProps extends NativeProps<'div', PortalTargetProps> {
  /** Enables non-modal focus management for richer interactive content. Defaults to `false`. */
  focusManagement?: boolean;
}

/** Public props for HoverCardTitle. */
export type HoverCardTitleProps = OverlayPartProps<
  'h3',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;
/** Public props for HoverCardDescription. */
export type HoverCardDescriptionProps = OverlayPartProps<
  'p',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

export interface HoverCardContextValue extends OverlayContext<ReferenceType> {
  setOpen: (open: boolean) => void;
  floatingStyles: CSSProperties;
  getReferenceProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  refs: OverlayRefs<ReferenceType>;
  contentId: string;
  classes: ReturnType<typeof hoverCard>;
  showArrow: boolean;
  setArrowElement: (node: SVGSVGElement | null) => void;
}
