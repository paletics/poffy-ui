'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import {
  cloneElement,
  type ElementType,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useId,
  useState,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { FormControlComponent, FormControlProps } from './FormControl.types';
import { FormControlProvider } from './useFormControl';
import { FormLabel } from './FormLabel';

const formControlAsChildElements = new Set(['div', 'fieldset', 'section']);

const normalizeIds = (value: string | string[] | undefined): string[] => [
  ...new Set((Array.isArray(value) ? value : [value]).filter((id): id is string => Boolean(id))),
];

const useRegisteredIds = (explicitIds: string | string[] | undefined) => {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const ids = [...new Set([...normalizeIds(explicitIds), ...registeredIds])];
  const register = useCallback((id: string) => {
    setRegisteredIds((currentIds) => (currentIds.includes(id) ? currentIds : [...currentIds, id]));
    return () =>
      setRegisteredIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
  }, []);

  return { ids, register };
};


const FormControlImpl = forwardRef<Element, FormControlProps>((props, ref) => {
  const {
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    label,
    children,
    className,
    asChild,
    id: idProp,
    labelTarget = 'control',
    describedByIds: describedByIdsProp,
    errorMessageIds: errorMessageIdsProp,
    role: _role,
    ...rest
  } = props as FormControlProps & { label?: string; role?: unknown };

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const { ids: helperTextIds, register: registerHelperText } = useRegisteredIds(describedByIdsProp);
  const { ids: errorMessageIds, register: registerErrorMessage } =
    useRegisteredIds(errorMessageIdsProp);

  const classes = formControl();
  const canUseAsChild =
    asChild &&
    !label &&
    isValidElement(children) &&
    children.type !== Fragment &&
    typeof children.type === 'string' &&
    formControlAsChildElements.has(children.type);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const renderedChildren =
    canUseAsChild && isValidElement<{ role?: string }>(children)
      ? cloneElement(children, { role: 'group' })
      : children;

  const context = {
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
    labelId,
    labelTarget,
    helperTextIds,
    errorMessageIds,
    id,
    registerHelperText,
    registerErrorMessage,
  };

  return (
    <FormControlProvider value={context}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest} role="group">
        {canUseAsChild ? (
          renderedChildren
        ) : (
          <>
            {label && <FormLabel>{label}</FormLabel>}
            {children}
          </>
        )}
      </Component>
    </FormControlProvider>
  );
});

FormControlImpl.displayName = 'FormControl';

/**
 * Coordinates one field's label, state, and registered help/error descriptions in a `role="group"`.
 *
 * Descendants consume the state through context; direct field props can override it. Use
 * `labelTarget="group"` for composite widgets so the label is referenced with
 * `aria-labelledby` rather than an invalid native `for` association. `asChild` accepts only a
 * `div`, `fieldset`, or `section` and cannot be combined with the `label` shorthand.
 */

export const FormControl = FormControlImpl as FormControlComponent;
