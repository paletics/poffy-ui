import type { InputVariantProps } from '@/styled-system/recipes';
import { type PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';

/** Visual props for `Input`. */
export type InputVariants = InputVariantSubset;

/** Input recipe options exposed with shared appearance names. */
export interface InputVariantSubset extends Omit<InputVariantProps, 'variant'> {
  /**
   * Surface treatment.
   * @defaultValue `'outline'`
   */
  appearance?: InputAppearanceProp;
}

/**
 * Props for the core text-like field. Provide a label through a FormControl or native ARIA.
 *
 * `asChild` accepts an `<input>` or a custom component that forwards input props and an
 * `HTMLInputElement` ref. Start/end elements wrap the input in an InputGroup-style layout; they
 * are decorative and inert until the matching `*Interactive` prop is enabled.
 */
export interface InputProps extends PrimitiveProps<'input', InputVariantSubset> {
  /**
   * Whether the input is in an error state.
   * If true, applies error-specific styles and animations.
   * @defaultValue `false`
   */
  error?: boolean;
  /**
   * Compact element rendered at the input's inline start (e.g. an icon or short symbol).
   * Content is constrained to the size-aware adornment slot. Use `InputGroup.StartAddon`
   * for a variable-width text prefix.
   * @example <Input startElement={<SearchIcon />} />
   */
  startElement?: ReactNode;
  /** Enables pointer interaction for the inline-start element; it then needs its own accessible name. */
  startElementInteractive?: boolean;
  /**
   * Compact element rendered at the input's inline end (e.g. an icon or icon-only action).
   * Content is constrained to the size-aware adornment slot. Use `InputGroup.EndAddon`
   * for a variable-width text suffix.
   * @example <Input endElement={<CalendarIcon />} />
   */
  endElement?: ReactNode;
  /** Enables pointer interaction for the inline-end element; it then needs its own accessible name. */
  endElementInteractive?: boolean;
}
