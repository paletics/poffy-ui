'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { ElementType } from 'react';
import type {
  FormHelperTextComponent,
  FormHelperTextProps,
} from './FormControl.types';
import { useFormControl } from './useFormControl';
import { useFormControlMessageRegistration } from './useFormControlMessageRegistration';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { isPotentiallyInteractiveAsChildHost } from '@/components/shared/asChild';
import { getPassiveMessageProps } from './passiveMessageProps';

const formMessageAsChildHosts = new Set(['div', 'p', 'span']);


const FormHelperTextImpl = forwardRef<HTMLElement, FormHelperTextProps>((props, ref) => {
  const { children, className, asChild, ...rest } = props;
  const { isDisabled, registerHelperText } = useFormControl();
  const classes = formControl();
  const effectiveChild =
    isValidElement(children) ? cloneElement(children, rest) : children;
  const canUseAsChild = Boolean(
    asChild &&
      isValidElement(effectiveChild) &&
      typeof effectiveChild.type === 'string' &&
      formMessageAsChildHosts.has(effectiveChild.type) &&
      !isPotentiallyInteractiveAsChildHost(effectiveChild),
  );
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const generatedId = useId();
  const resolvedId = rest.id ?? generatedId;
  useFormControlMessageRegistration(registerHelperText, resolvedId);
  const content =
    canUseAsChild && isValidElement<{ id?: string }>(children)
      ? cloneElement(children, { id: resolvedId })
      : asChild
        ? getSafeInteractiveContent(children, { disallowActivationHandlers: true })
        : children;
  const renderedRest = canUseAsChild ? rest : getPassiveMessageProps(rest);

  return (
    <Component
      ref={ref}
      className={cx(classes.helperText, className)}
      data-disabled={isDisabled ? '' : undefined}
      {...renderedRest}
      id={resolvedId}
    >
      {content}
    </Component>
  );
});

FormHelperTextImpl.displayName = 'FormHelperText';

/**
 * Renders and registers supplemental guidance with the nearest `FormControl`.
 *
 * Its ID is included in the field's description reference regardless of validity. A passive
 * `div`, `p`, or `span` may be delegated with `asChild`; interactive children are sanitised when
 * delegation is unsafe.
 */

export const FormHelperText = FormHelperTextImpl as unknown as FormHelperTextComponent;
