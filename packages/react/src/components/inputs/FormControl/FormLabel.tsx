'use client';

import { cx } from '@/styled-system/css';
import { formControl } from '@/styled-system/recipes';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import { forwardRef, type MouseEvent } from 'react';
import type { FormLabelProps } from './FormControl.types';
import { useFormControl } from './useFormControl';

/**
 * Label wired to the nearest `FormControl` field or composite group.
 *
 * It owns the context-derived label ID. For `labelTarget="control"` it uses native `htmlFor`;
 * for a composite group it focuses the first enabled interactive descendant when clicked. The
 * required marker follows the explicit `isRequired` value or FormControl state.
 */
export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>((props, ref) => {
  const legacyProps = props as FormLabelProps & { asChild?: unknown };
  const {
    children,
    className,
    asChild: _legacyAsChild,
    isRequired: requiredProp,
    id: labelIdProp,
    onClick,
    ...rest
  } = legacyProps;
  void _legacyAsChild;
  const { isRequired: contextIsRequired, isDisabled, labelId, id, labelTarget } = useFormControl();
  const classes = formControl();
  const resolvedLabelId = labelId ?? labelIdProp;
  const focusCompositeControl = (event: MouseEvent<HTMLLabelElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || rest.htmlFor !== undefined || !id) return;

    const target = getTreeElementById<HTMLElement>(event.currentTarget, id);
    if (!target || target.matches('button, input, meter, output, progress, select, textarea')) {
      return;
    }

    target
      .querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([data-time-picker-validation-proxy]):not([data-form-control-validation-proxy]):not(:disabled), select:not(:disabled), button:not(:disabled), [data-wheel-picker-column]:not([aria-disabled="true"])',
      )
      ?.focus();
  };

  return (
    <label
      ref={ref}
      className={cx(classes.label, className)}
      data-disabled={isDisabled ? '' : undefined}
      htmlFor={rest.htmlFor ?? (labelTarget === 'group' ? undefined : id)}
      onClick={focusCompositeControl}
      {...rest}
      id={resolvedLabelId}
    >
      {children}
      {(requiredProp ?? contextIsRequired) && (
        <span className={classes.requiredIndicator} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});

FormLabel.displayName = 'FormLabel';
