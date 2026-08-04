import { NativeProps, PrimitiveProps } from '@poffy-ui/types';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

/**
 * Properties for the root FormControl component.
 * Acts as a container and context provider for form labels, inputs, and feedback.
 */
export interface FormControlOwnProps {
  /**
   * Describes whether the field controlled by this wrapper is a native labelable
   * element or a composite widget.
   *
   * Use `group` for widgets whose interactive controls are contained by a
   * non-labelable element (for example `TimePicker` or `RadioGroup`). In that
   * mode `FormLabel` is referenced through `aria-labelledby` instead of an
   * invalid native `for` association.
   * @defaultValue 'control'
   */
  labelTarget?: 'control' | 'group';

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

  /**
   * Description element IDs available during server rendering.
   * Supply matching IDs to `FormHelperText` when the initial HTML must include
   * `aria-describedby` before hydration.
   */
  describedByIds?: string | string[];

  /**
   * Error message element IDs available during server rendering.
   * Supply matching IDs to `FormErrorMessage` when the initial HTML must include
   * `aria-errormessage` before hydration.
   */
  errorMessageIds?: string | string[];
}

type FormControlNativeProps = Omit<PrimitiveProps<'div', FormControlOwnProps>, 'role'>;

/** Props for the owned native div host. */
export type FormControlDefaultProps = DefaultHostProps<FormControlNativeProps>;

/**
 * Props for a delegated div, fieldset, or section host.
 * The shorthand `label` would add a second Slot child, so compose FormLabel
 * explicitly when delegating the root.
 */
export type FormControlAsChildProps = RetargetedAsChildHostProps<
  FormControlNativeProps,
  HTMLElement
> & {
  label?: never;
};

/**
 * Props accepted by FormControl.
 *
 * The default branch renders an owned `div`. The `asChild` branch can delegate
 * only to `div`, `fieldset`, or `section`, and deliberately rejects the `label`
 * shorthand because a Slot requires exactly one child.
 */
export type FormControlProps = FormControlDefaultProps | FormControlAsChildProps;

/** Ref-forwarding public component signature for FormControl. */
export type FormControlComponent = PolymorphicAsChildComponent<
  FormControlDefaultProps,
  FormControlAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Properties for the FormLabel component.
 *
 * `isRequired` overrides the surrounding FormControl state only for the visual,
 * aria-hidden required indicator; it does not add native validation attributes.
 */
export type FormLabelProps = NativeProps<
  'label',
  {
    /**
     * Whether to explicitly show the required asterisk indicator.
     */
    isRequired?: boolean;
  }
>;

/**
 * Native element types that may receive FormHelperText or FormErrorMessage through `asChild`.
 *
 * These hosts are intentionally limited to passive text containers so a message
 * cannot become a keyboard- or pointer-activatable control.
 */
export type FormMessageAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'p'>, 'p'>
  | ReactElement<ComponentPropsWithoutRef<'span'>, 'span'>;

type FormHelperTextNativeProps = PrimitiveProps<'div'>;
/** Props for FormHelperText's owned passive div host. */
export type FormHelperTextDefaultProps = DefaultHostProps<FormHelperTextNativeProps>;
/** Props for a delegated passive div, paragraph, or span helper-message host. */
export type FormHelperTextAsChildProps = RetargetedAsChildHostProps<
  FormHelperTextNativeProps,
  HTMLElement,
  FormMessageAsChildElement
>;
/** Props accepted by FormHelperText, including its constrained `asChild` branch. */
export type FormHelperTextProps = FormHelperTextDefaultProps | FormHelperTextAsChildProps;
/** Ref-forwarding public component signature for FormHelperText. */
export type FormHelperTextComponent = PolymorphicAsChildComponent<
  FormHelperTextDefaultProps,
  FormHelperTextAsChildProps,
  HTMLDivElement,
  HTMLElement
>;

/**
 * Properties for the FormErrorMessage component.
 */
type FormErrorMessageNativeProps = PrimitiveProps<
  'div',
  {
    /**
     * Announcement priority used when the error message is rendered.
     *
     * Keep assertive announcements for a single urgent error. Use `off` when
     * a form-level summary or focus management announces validation failures.
     * @defaultValue 'polite'
     */
    live?: 'polite' | 'assertive' | 'off';
  }
>;
/** Props for FormErrorMessage's owned passive div host. */
export type FormErrorMessageDefaultProps = DefaultHostProps<FormErrorMessageNativeProps>;
/** Props for a delegated passive div, paragraph, or span error-message host. */
export type FormErrorMessageAsChildProps = RetargetedAsChildHostProps<
  FormErrorMessageNativeProps,
  HTMLElement,
  FormMessageAsChildElement
>;
/** Props accepted by FormErrorMessage, including its constrained `asChild` branch. */
export type FormErrorMessageProps =
  | FormErrorMessageDefaultProps
  | FormErrorMessageAsChildProps;
/** Ref-forwarding public component signature for FormErrorMessage. */
export type FormErrorMessageComponent = PolymorphicAsChildComponent<
  FormErrorMessageDefaultProps,
  FormErrorMessageAsChildProps,
  HTMLDivElement,
  HTMLElement
>;
