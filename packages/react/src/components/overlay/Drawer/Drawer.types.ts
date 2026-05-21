import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { DrawerVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';
import type { OverlayAppearance, PrimitiveProps } from '@poffy-ui/types';

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
 * Controlled contract: pass `open` with `onOpenChange`. Uncontrolled
 * contract: omit `open` and optionally pass `defaultOpen`.
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
export interface DrawerProps extends DrawerVariantSubset {
  /**
   * Whether the drawer is currently open.
   * If provided, the drawer becomes a controlled component.
   */
  open?: boolean;

  /**
   * Initial open state for uncontrolled mode.
   * Ignored when `open` is provided.
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

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
}

/** Props for the fixed-position drawer panel rendered inside `Drawer`. */
export type DrawerContentProps = PrimitiveProps<'div'>;

/** Props for the optional header region, typically containing title and close. */
export type DrawerHeaderProps = PrimitiveProps<'div'>;

/** Props for the required accessible drawer heading. */
export type DrawerTitleProps = PrimitiveProps<'h2'>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type DrawerDescriptionProps = PrimitiveProps<'p'>;

/** Props for the drawer's primary content region. */
export type DrawerBodyProps = PrimitiveProps<'div'>;

/** Props for the optional action/footer region. */
export type DrawerFooterProps = PrimitiveProps<'div'>;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type DrawerCloseProps = PrimitiveProps<'button'>;
