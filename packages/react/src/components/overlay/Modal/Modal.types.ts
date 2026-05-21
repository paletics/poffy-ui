import { PoffyBrand, PoffyResolvedColorMode } from '@/providers';
import { ModalVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';
import type { OverlayAppearance, PrimitiveProps } from '@poffy-ui/types';

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
 * contract: omit `open` and optionally pass `defaultOpen`.
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
export interface ModalProps extends ModalVariantSubset {
  /**
   * Whether the modal is currently open.
   * If provided, the modal becomes a controlled component.
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

/** Props for the dialog surface rendered inside `Modal`. */
export type ModalContentProps = PrimitiveProps<'div'>;

/** Props for the optional header region, typically containing title and close. */
export type ModalHeaderProps = PrimitiveProps<'div'>;

/** Props for the required accessible modal heading. */
export type ModalTitleProps = PrimitiveProps<'h2'>;

/** Props for optional descriptive text linked by `aria-describedby`. */
export type ModalDescriptionProps = PrimitiveProps<'p'>;

/** Props for the modal's primary content region. */
export type ModalBodyProps = PrimitiveProps<'div'>;

/** Props for the optional action/footer region. */
export type ModalFooterProps = PrimitiveProps<'div'>;

/** Props for the dismiss button. It calls the parent `onOpenChange(false)`. */
export type ModalCloseProps = PrimitiveProps<'button'>;
