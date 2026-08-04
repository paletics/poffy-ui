import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { ModalVariantProps } from '@/styled-system/recipes';
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
 * Variants for the Modal component based on Panda CSS recipe.
 *
 */
export type ModalVariants = ModalVariantProps;

/** Public Modal variant props with shared overlay appearance names. */
export interface ModalVariantSubset extends Omit<ModalVariants, 'appearance'> {
  /** Surface treatment. */
  appearance?: OverlayAppearance;
}

/**
 * Props for the Modal root provider.
 *
 * Modal renders no DOM node by itself. Required structure:
 * `Modal` -> `ModalContent`, with `ModalTitle` inside the content for
 * the generated `aria-labelledby` relationship. Add `ModalDescription`
 * when supplementary text should be announced by assistive technology.
 *
 * Controlled contract: pass `open` with `onOpenChange`. Uncontrolled
 * contract: omit `open` and optionally pass `defaultOpen`. An unpaired
 * controlled value warns and falls back to initial uncontrolled state.
 *
 * Do: import from `@poffy-ui/react/overlay` and compose the provided
 * subcomponents. Don't: render `ModalContent` outside `Modal` or omit an
 * accessible title.
 *
 * @example
 * ```tsx
 * import {
 *   Modal,
 *   ModalBody,
 *   ModalClose,
 *   ModalContent,
 *   ModalHeader,
 *   ModalTitle,
 * } from '@poffy-ui/react/overlay';
 *
 * <Modal open={open} onOpenChange={setOpen}>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Delete project</ModalTitle>
 *       <ModalClose />
 *     </ModalHeader>
 *     <ModalBody>This action cannot be undone.</ModalBody>
 *   </ModalContent>
 * </Modal>
 * ```
 *
 * Related: ModalContentProps
 * Related: ModalTitleProps
 *
 */
interface ModalBaseProps extends ModalVariantSubset {
  /** Modal subtree. Include `ModalContent` as the rendered dialog surface. */
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

/** Controlled state props for Modal. */
export interface ControlledModalProps extends ModalBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled state props for Modal. */
export interface UncontrolledModalProps extends ModalBaseProps {
  open?: never;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Public props for Modal. */
export type ModalProps = ControlledModalProps | UncontrolledModalProps;

/**
 * Props for the dialog surface rendered inside `Modal`.
 * `asChild` accepts one native article, aside, div, or section surface; other
 * children use the default div surface.
 */
export type ModalContentProps = OverlayContentProps;

/**
 * Props for the control that opens and closes the modal. The forwarded ref
 * targets the default button or the slotted trigger element with `asChild`.
 */
export type ModalTriggerProps = OverlayTriggerProps;

/** Props for the optional header region, typically containing title and close. */
export type ModalHeaderProps = OverlayPartProps<
  'div',
  object,
  HTMLElement,
  OverlaySectionAsChildElement
>;

/** Props for the required accessible modal heading. */
export type ModalTitleProps = OverlayPartProps<
  'h2',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type ModalDescriptionProps = OverlayPartProps<
  'p',
  object,
  HTMLElement,
  OverlayTextAsChildElement
>;

/** Props for the modal's primary content region. */
export type ModalBodyProps = ModalHeaderProps;

/** Props for the optional action/footer region. */
export type ModalFooterProps = ModalHeaderProps;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type ModalCloseProps = OverlayCloseProps;
