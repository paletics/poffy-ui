'use client';

import { cx } from '@/styled-system/css';
import { listboxSelect } from '@/styled-system/recipes';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { ListboxPopover, ListboxPopoverAnchor } from '@/components/overlay/ListboxPopover';
import { getTreeElementById, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { resolveNeoInputVariant, resolveNeoPopupVariant } from '@/components/inputs/inputVariant';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { ListboxSelectProps } from './ListboxSelect.types';
import { ListboxSelectNativeSelect } from './ListboxSelectNativeSelect';
import { ListboxSelectPopup } from './ListboxSelectPopup';
import { ListboxSelectTrigger } from './ListboxSelectTrigger';
import { getListboxSelectOptionId, normalizeListboxSelectChildren } from './ListboxSelect.utils';
import { useListboxSelectState } from './useListboxSelectState';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useFormControlBridge } from '@/components/inputs/shared/useFormControlBridge';

/**
 * Single-choice custom listbox backed by a visually hidden native select.
 *
 * The visible trigger provides keyboard navigation and active-descendant semantics, while the
 * native field preserves `name`, validation, native labels, and form reset. `onChange` receives
 * that native change event and may cancel a visible or native selection with `preventDefault()`.
 * It is single-select only; controlled callers reflect the selected value. Disabled or read-only
 * state blocks opening and selection changes.
 */
export const ListboxSelect = forwardRef<HTMLSelectElement, ListboxSelectProps>((props, ref) => {
  const {
    size,
    appearance = 'outline',
    variant: _unsupportedVariant,
    error,
    className,
    children,
    value: valueProp,
    defaultValue,
    multiple: _multiple,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onPointerDown,
    onTriggerFocus,
    onTriggerBlur,
    onTriggerKeyDown,
    onTriggerPointerDown,
    disabled,
    readOnly,
    name,
    required,
    form,
    id: idProp,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props as ListboxSelectProps & { variant?: unknown };

  const formControl = useFormControl();
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid = error === true ? true : error === undefined && formControl.isInvalid === true;
  const resolvedAriaInvalid =
    typeof ariaInvalid === 'string'
      ? ariaInvalid
      : typeof ariaInvalid === 'boolean'
        ? ariaInvalid
        : undefined;
  const hasExplicitInvalid = hasAriaInvalid(resolvedAriaInvalid);
  const shouldAssociateErrorMessage = isInvalid ? true : hasExplicitInvalid;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const explicitAccessibleLabel = resolveAccessibleLabel({ ariaLabel, ariaLabelledBy });
  const hasExplicitAccessibleLabel = Boolean(
    explicitAccessibleLabel.ariaLabel ?? explicitAccessibleLabel.ariaLabelledBy,
  );
  const [nativeLabelledBy, setNativeLabelledBy] = useState<string | undefined>();
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId ?? nativeLabelledBy,
  });

  const resolvedVariant = resolveNeoInputVariant(appearance);
  const popupVariant = resolveNeoPopupVariant(appearance);
  const resolvedError = error ?? formControl.isInvalid ?? false;
  const classes = listboxSelect({ size, variant: resolvedVariant, error: resolvedError });
  const popupClasses = listboxSelect({ size, variant: popupVariant, error: resolvedError });
  const { nativeChildren, options } = useMemo(
    () => normalizeListboxSelectChildren(children),
    [children],
  );
  const listId = useId();
  const generatedControlId = useId();
  const nativeLabelIdBase = useId();
  const controlId = idProp ?? formControl.id ?? generatedControlId;
  const triggerId = `${controlId}-trigger`;
  const nativeSelectRef = useRef<HTMLSelectElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const formBridge = useFormControlBridge<HTMLSelectElement>({ disabled: isDisabled, form });
  const isInteractionDisabled = [isDisabled, formBridge.effectivelyDisabled].some(Boolean);
  const isInteractionDisabledNow = () =>
    [formBridge.isEffectivelyDisabledNow(), isReadOnly].some(Boolean);
  const ownedNativeLabelIdsRef = useRef(new Map<HTMLLabelElement, string>());
  const nativeLabelReconciliationGenerationRef = useRef(0);
  const isMountedRef = useRef(false);
  const {
    formResetRef,
    handleKeyDown,
    handleNativeChange,
    handleOpenChange,
    handleSelectOption,
    highlightedIndex,
    isOpen,
    selectedIndex,
    selectedValue,
    setHighlightedIndex,
    toggleFromTrigger,
  } = useListboxSelectState({
    disabled: isInteractionDisabled,
    isInteractionDisabledNow,
    readOnly: isReadOnly,
    nativeSelectRef,
    options,
    props,
    valueProp,
  });
  const mergedRef = useMergeRefs(nativeSelectRef, formBridge.anchorRef, formResetRef, ref);

  useEffect(() => {
    const ownedNativeLabelIds = ownedNativeLabelIdsRef.current;
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      nativeLabelReconciliationGenerationRef.current += 1;
      ownedNativeLabelIds.forEach((ownedId, label) => {
        if (label.id === ownedId) label.removeAttribute('id');
      });
      ownedNativeLabelIds.clear();
    };
  }, []);

  useEffect(() => {
    const ownedNativeLabelIds = ownedNativeLabelIdsRef.current;
    const labels = Array.from(nativeSelectRef.current?.labels ?? []);
    const currentLabels = new Set(labels);

    ownedNativeLabelIds.forEach((ownedId, label) => {
      if (currentLabels.has(label)) return;
      if (label.id === ownedId) label.removeAttribute('id');
      ownedNativeLabelIds.delete(label);
    });

    const usesNativeLabels = !hasExplicitAccessibleLabel && !formControl.labelId;
    const labelIds = labels.flatMap((label, index) => {
      const ownedId = ownedNativeLabelIds.get(label);
      if (ownedId && label.id !== ownedId) ownedNativeLabelIds.delete(label);
      if (label.id) return label.id;

      if (!usesNativeLabels) return [];
      let candidateIndex = index;
      let assignedId = `${nativeLabelIdBase}-label-${candidateIndex}`;
      const nativeSelect = nativeSelectRef.current;
      while (nativeSelect && getTreeElementById(nativeSelect, assignedId)) {
        candidateIndex += 1;
        assignedId = `${nativeLabelIdBase}-label-${candidateIndex}`;
      }
      label.id = assignedId;
      ownedNativeLabelIds.set(label, assignedId);
      return assignedId;
    });
    const nextNativeLabelledBy =
      usesNativeLabels && labelIds.length > 0 ? labelIds.join(' ') : undefined;
    const generation = ++nativeLabelReconciliationGenerationRef.current;
    if (nativeLabelledBy === nextNativeLabelledBy) return;
    queueMicrotask(() => {
      if (!isMountedRef.current || nativeLabelReconciliationGenerationRef.current !== generation) {
        return;
      }
      setNativeLabelledBy((current) =>
        current === nextNativeLabelledBy ? current : nextNativeLabelledBy,
      );
    });
  });

  const activeDescendant =
    isOpen && highlightedIndex >= 0 && highlightedIndex < options.length
      ? getListboxSelectOptionId(listId, options[highlightedIndex])
      : undefined;

  const selectedLabel = options[selectedIndex]?.label ?? '';
  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onTriggerKeyDown?.(event);
    if (!event.defaultPrevented && nativeSelectRef.current?.matches(':disabled') !== true) {
      handleKeyDown(event);
    }
  };
  const handleTriggerPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    onTriggerPointerDown?.(event);
    if (
      event.defaultPrevented ||
      nativeSelectRef.current?.matches(':disabled') === true ||
      isReadOnly ||
      event.button !== 0
    )
      return;

    event.preventDefault();
    triggerRef.current?.focus();
    toggleFromTrigger();
  };

  return (
    <ListboxPopover open={isOpen} onOpenChange={handleOpenChange}>
      <div className={cx(classes.root, className)}>
        <ListboxSelectNativeSelect
          {...rest}
          ref={mergedRef}
          controlId={controlId}
          selectedValue={valueProp === undefined ? undefined : selectedValue}
          defaultValue={valueProp === undefined ? defaultValue : undefined}
          onChange={(event) => {
            const nextIndex = event.currentTarget.selectedIndex;
            if (isInteractionDisabledNow() || nextIndex === selectedIndex) {
              handleNativeChange(event.currentTarget.value, nextIndex);
              return;
            }
            onChange?.(event);
            if (event.defaultPrevented) {
              event.currentTarget.selectedIndex = selectedIndex;
              return;
            }
            const changed = handleNativeChange(event.currentTarget.value, nextIndex);
            if (!changed) return;
          }}
          disabled={isDisabled}
          name={name}
          required={isRequired && !isReadOnly}
          form={form}
          multiple={false}
          onNativeFocus={(event) => {
            onFocus?.(event);
            triggerRef.current?.focus();
          }}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
        >
          {nativeChildren}
        </ListboxSelectNativeSelect>
        <ListboxPopoverAnchor asChild>
          <ListboxSelectTrigger
            ref={triggerRef}
            triggerId={triggerId}
            className={classes.field}
            iconClassName={classes.icon}
            activeDescendant={activeDescendant}
            ariaLabel={accessibleLabel.ariaLabel}
            ariaLabelledBy={accessibleLabel.ariaLabelledBy}
            ariaDescribedBy={describedBy}
            ariaErrorMessage={errorMessage}
            ariaInvalid={resolvedAriaInvalid}
            disabled={isInteractionDisabled}
            error={isInvalid}
            isOpen={isOpen}
            listId={isOpen && options.length > 0 ? listId : undefined}
            readOnly={isReadOnly}
            required={isRequired}
            selectedLabel={selectedLabel}
            tabIndex={tabIndex}
            onPointerDown={handleTriggerPointerDown}
            onKeyDown={handleTriggerKeyDown}
            onFocus={onTriggerFocus}
            onBlur={onTriggerBlur}
          />
        </ListboxPopoverAnchor>
        {options.length > 0 && (
          <ListboxSelectPopup
            listId={listId}
            contentClassName={popupClasses.content}
            itemClassName={popupClasses.item}
            itemTextClassName={popupClasses.itemText}
            options={options}
            triggerId={triggerId}
            highlightedIndex={highlightedIndex}
            selectedIndex={selectedIndex}
            onSelect={handleSelectOption}
            onHighlight={setHighlightedIndex}
          />
        )}
      </div>
    </ListboxPopover>
  );
});

ListboxSelect.displayName = 'ListboxSelect';
