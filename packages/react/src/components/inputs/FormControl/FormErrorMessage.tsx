'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type AriaAttributes,
  type AriaRole,
  type ElementType,
} from 'react';
import type {
  FormErrorMessageComponent,
  FormErrorMessageProps,
} from './FormControl.types';
import { useFormControl } from './useFormControl';
import { useFormControlMessageRegistration } from './useFormControlMessageRegistration';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { isPotentiallyInteractiveAsChildHost } from '@/components/shared/asChild';
import { getPassiveMessageProps } from './passiveMessageProps';

const formMessageAsChildHosts = new Set(['div', 'p', 'span']);


const FormErrorMessageImpl = forwardRef<HTMLElement, FormErrorMessageProps>((props, ref) => {
  const { children, className, asChild, live, role, 'aria-live': ariaLive, ...rest } = props;
  const { isInvalid, registerErrorMessage } = useFormControl();
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
  const childSemantics =
    canUseAsChild &&
    isValidElement<{
      role?: AriaRole;
      'aria-live'?: AriaAttributes['aria-live'];
    }>(children)
      ? children.props
      : undefined;
  const resolvedRole = role ?? childSemantics?.role;
  const resolvedAriaLive =
    ariaLive ??
    live ??
    childSemantics?.['aria-live'] ??
    (resolvedRole === undefined ? 'polite' : undefined);
  useFormControlMessageRegistration(registerErrorMessage, resolvedId, isInvalid);

  if (!isInvalid) return null;
  const content =
    canUseAsChild &&
    isValidElement<{
      id?: string;
      role?: AriaRole;
      'aria-live'?: AriaAttributes['aria-live'];
    }>(children)
      ? cloneElement(children, {
          id: resolvedId,
          role: resolvedRole,
          'aria-live': resolvedAriaLive,
        })
      : asChild
        ? getSafeInteractiveContent(children, { disallowActivationHandlers: true })
        : children;
  const renderedRest = canUseAsChild ? rest : getPassiveMessageProps(rest);

  return (
    <Component
      ref={ref}
      className={cx(classes.errorMessage, className)}
      {...renderedRest}
      id={resolvedId}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
    >
      {content}
    </Component>
  );
});

FormErrorMessageImpl.displayName = 'FormErrorMessage';

/**
 * Renders and registers validation feedback only while the nearest `FormControl` is invalid.
 *
 * The resulting ID is appended to the field's error and description references. It announces
 * politely by default unless a role or explicit live setting supplies different semantics; use a
 * passive `div`, `p`, or `span` for `asChild`.
 */

export const FormErrorMessage =
  FormErrorMessageImpl as unknown as FormErrorMessageComponent;
