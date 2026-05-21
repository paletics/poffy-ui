import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Properties for the root FormControl component.
 * Acts as a container and context provider for form labels, inputs, and feedback.
 */
export interface FormControlProps extends PrimitiveProps<'div'> {
  /**
   * Whether the form control is in an invalid state.
   * @defaultValue false
   */
  isInvalid?: boolean;

  /**
   * Whether the form control is required for submission.
   * @defaultValue false
   */
  isRequired?: boolean;

  /**
   * Whether the form control and its children are disabled.
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Whether the form control is in a read-only state.
   * @defaultValue false
   */
  isReadOnly?: boolean;

  /**
   * Optional shorthand label text.
   */
  label?: string;
}

/**
 * Properties for the FormLabel component.
 */
export interface FormLabelProps extends PrimitiveProps<'label'> {
  /**
   * Whether to explicitly show the required asterisk indicator.
   */
  isRequired?: boolean;
}

/**
 * Properties for the FormHelperText component.
 */
export type FormHelperTextProps = PrimitiveProps<'div'>;

/**
 * Properties for the FormErrorMessage component.
 */
export type FormErrorMessageProps = PrimitiveProps<'div'>;
