import { PoffyBrand, PoffyDirection, PoffyResolvedColorMode } from '@/providers';
import { DrawerVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';
import type { OverlayAppearance } from '@poffy-ui/types';
import type {
  OverlayCloseProps,
  OverlayContentProps,
  OverlayPartProps,
  OverlaySectionAsChildElement,
  OverlayTextAsChildElement,
  OverlayTriggerProps,
} from '../shared/factories/types';

/**
 * Variants for the Drawer component based on Panda CSS recipe.
 */
export type DrawerVariants = DrawerVariantProps;

/** Public Drawer variant props with shared overlay appearance names. */
export interface DrawerVariantSubset extends Omit<DrawerVariants, 'appearance'> {
  /** Surface treatment. */
  appearance?: OverlayAppearance;
}

/**
 * Props for the Drawer root provider.
 *
 * Drawer renders no DOM node by itself. Required structure:
 * `Drawer` -> `DrawerContent`, with `DrawerTitle` inside the content for
 * the generated `aria-labelledby` relationship. Add `DrawerDescription`
 * when supplementary text should be announced by assistive technology.
 *
 * Controlled contract: pass `open` with `onOpenChange`. An unpaired `open`
 * value warns and becomes uncontrolled initial state. Uncontrolled contract:
 * omit `open` and optionally pass `defaultOpen`.
 *
 * Do: use Drawer for task panels and side sheets. Don't: use it as a hover
 * disclosure or render drawer parts outside the root provider.
 *
 * @example
 * ```tsx
 * import {
 *   Drawer,
 *   DrawerBody,
 *   DrawerClose,
 *   DrawerContent,
 *   DrawerHeader,
 *   DrawerTitle,
 * } from '@poffy-ui/react/overlay';
 *
 * <Drawer defaultOpen placement="right">
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *       <DrawerClose />
 *     </DrawerHeader>
 *     <DrawerBody>Panel content</DrawerBody>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * Related: DrawerContentProps
 * Related: DrawerTitleProps
 */
interface DrawerBaseProps extends DrawerVariantSubset {
  /** Drawer subtree. Include `DrawerContent` as the rendered panel surface. */
  children?: ReactNode;

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
   * Text direction used to resolve logical `start` and `end` placements.
   * Falls back to the nearest DirectionProvider, then `ltr`.
   */
  dir?: PoffyDirection;
}

/** Controlled state props for Drawer. */
export interface ControlledDrawerProps extends DrawerBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled state props for Drawer. */
export interface UncontrolledDrawerProps extends DrawerBaseProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for Drawer. */
export type DrawerProps = ControlledDrawerProps | UncontrolledDrawerProps;

/** Props for the fixed-position dialog panel rendered inside `Drawer`. */
export type DrawerContentProps = OverlayContentProps;

/** Props for the control that opens and closes the drawer. */
export type DrawerTriggerProps = OverlayTriggerProps;

/** Props for the optional header region, typically containing title and close. */
export type DrawerHeaderProps = OverlayPartProps<
  'div',
  object,
  HTMLElement,
  OverlaySectionAsChildElement
>;

/** Props for the required accessible drawer heading. */
export type DrawerTitleProps = OverlayPartProps<
  'h2',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type DrawerDescriptionProps = OverlayPartProps<
  'p',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for the drawer's primary content region. */
export type DrawerBodyProps = DrawerHeaderProps;

/** Props for the optional action/footer region. */
export type DrawerFooterProps = DrawerHeaderProps;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type DrawerCloseProps = OverlayCloseProps;
