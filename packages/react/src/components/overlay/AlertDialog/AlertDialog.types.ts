import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { AlertDialogVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';
import type { OverlayAppearance } from '@poffy-ui/types';
import type {
  OverlayCloseComponent,
  OverlayCloseProps,
  OverlayContentProps,
  OverlayPartProps,
  OverlaySectionAsChildElement,
  OverlayTextAsChildElement,
  OverlayTriggerProps,
} from '../shared/factories/types';

/** Public visual variant props for AlertDialog. */
export type AlertDialogVariants = AlertDialogVariantProps;

/** Public visual variant subset for AlertDialog. */
export interface AlertDialogVariantSubset extends Omit<AlertDialogVariants, 'appearance'> {
  /** Surface treatment. */
  appearance?: OverlayAppearance;
}

interface AlertDialogBaseProps extends AlertDialogVariantSubset {
  /** Alert dialog subtree. Include `AlertDialogContent`. */
  children?: ReactNode;

  /** Theme brand override. */
  brand?: PoffyBrand;

  /** Theme color mode override. */
  theme?: PoffyResolvedColorMode;
}

/** Controlled state props for AlertDialog. */
export interface ControlledAlertDialogProps extends AlertDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled state props for AlertDialog. */
export interface UncontrolledAlertDialogProps extends AlertDialogBaseProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for AlertDialog. */
export type AlertDialogProps = ControlledAlertDialogProps | UncontrolledAlertDialogProps;

/** Props for the portalled, focus-managed alert-dialog surface. */
export type AlertDialogContentProps = OverlayContentProps;
/** The forwarded ref targets the default button or the slotted trigger with `asChild`. */
export type AlertDialogTriggerProps = OverlayTriggerProps;
/** Public props for AlertDialogHeader. */
export type AlertDialogHeaderProps = OverlayPartProps<
  'div',
  object,
  HTMLElement,
  OverlaySectionAsChildElement
>;
/** Public props for AlertDialogTitle. */
export type AlertDialogTitleProps = OverlayPartProps<
  'h2',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;
/** Public props for AlertDialogDescription. */
export type AlertDialogDescriptionProps = OverlayPartProps<
  'p',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;
/** Public props for AlertDialogBody. */
export type AlertDialogBodyProps = AlertDialogHeaderProps;
/** Public props for AlertDialogFooter. */
export type AlertDialogFooterProps = AlertDialogHeaderProps;
/** Props for the cancelling close control; its ref can receive initial dialog focus. */
export type AlertDialogCancelProps = OverlayCloseProps;
/** Polymorphic component call signatures for AlertDialogCancel. */
export type AlertDialogCancelComponent = OverlayCloseComponent;
/** Props for the confirming close control; action side effects remain caller-owned. */
export type AlertDialogActionProps = OverlayCloseProps;
/** Polymorphic component call signatures for AlertDialogAction. */
export type AlertDialogActionComponent = OverlayCloseComponent;
