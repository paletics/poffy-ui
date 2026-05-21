'use client';

import { cx } from '@/styled-system/css';
import { listboxSelect } from '@/styled-system/recipes';
import { forwardRef, useEffect, useId, useRef } from 'react';
import { ListboxPopover, ListboxPopoverAnchor } from '@/components/overlay/ListboxPopover';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { ListboxSelectProps } from './ListboxSelect.types';
import { ListboxSelectNativeSelect } from './ListboxSelectNativeSelect';
import { ListboxSelectPopup } from './ListboxSelectPopup';
import { ListboxSelectTrigger } from './ListboxSelectTrigger';
import { flattenListboxSelectOptions, getListboxSelectOptionId } from './ListboxSelect.utils';
import { useListboxSelectState } from './useListboxSelectState';

/**
 * Custom listbox select that keeps the native select API through a visually hidden field.
 * The visible trigger and popup align with ComboBox and MultiSelect for interaction consistency.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`listboxSelect`), `ListboxPopover`, native hidden `<select>`
 * - **Props**: Native select props plus ListboxSelect appearance and size variants
 *
 * ### Design Tokens
 * - **spacing**: trigger, popup, and option spacing come from the `listboxSelect` recipe
 * - **color**: semantic field, popup, highlighted, selected, disabled, and error colors
 *
 * ### Variant Logic
 * - **appearance="outline"**: Default field treatment for forms and dense settings.
 * - **appearance="soft"**: Lower emphasis field surface, mapped to the filled recipe variant.
 * - **appearance="neo"**: Raised control surface while the popup remains outline for readability.
 * - **error**: Propagates invalid styling and `aria-invalid` to the visible combobox.
 *
 * ### Accessibility
 * - **Role**: combobox with listbox popup, backed by a native select for form submission.
 * - **Pattern**: WAI-ARIA Combobox with Listbox Popup
 * - **Keyboard**: Arrow keys move highlight, Home/End jump, Enter/Space select, Escape closes.
 * - **Required**: Provide visible labeling through `<label htmlFor>` or `aria-label`.
 *
 * ### AI Usage
 * - **DO**: Use native `<option>` and `<optgroup>` children so forms, labels, and tests stay native.
 * - **DON'T**: Pass custom option components; option parsing intentionally mirrors native select content.
 *
 * @example Native options
 * ```tsx
 * <ListboxSelect name="fruit" aria-label="Fruit">
 *   <option value="apple">Apple</option>
 *   <option value="pear">Pear</option>
 * </ListboxSelect>
 * ```
 *
 * @example Grouped and disabled options
 * ```tsx
 * <ListboxSelect defaultValue="available" aria-label="Status">
 *   <optgroup label="Unavailable" disabled>
 *     <option value="blocked">Blocked</option>
 *   </optgroup>
 *   <option value="available">Available</option>
 * </ListboxSelect>
 * ```
 */
export const ListboxSelect = forwardRef<HTMLSelectElement, ListboxSelectProps>((props, ref) => {
  const {
    size,
    appearance = 'outline',
    variant,
    error = false,
    className,
    children,
    value: valueProp,
    defaultValue: _defaultValue,
    onChange,
    onFocus,
    disabled = false,
    name,
    required,
    form,
    id: idProp,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    ...rest
  } = props;

  const resolvedVariant =
    variant ?? (appearance === 'soft' ? 'filled' : appearance === 'neo' ? 'neo' : 'outline');
  const popupVariant = resolvedVariant === 'neo' ? 'outline' : resolvedVariant;
  const classes = listboxSelect({ size, variant: resolvedVariant, error });
  const popupClasses = listboxSelect({ size, variant: popupVariant, error });
  const isInvalid = !!error;
  const options = flattenListboxSelectOptions(children);
  const listId = useId();
  const generatedControlId = useId();
  const controlId = idProp ?? generatedControlId;
  const triggerId = `${controlId}-trigger`;
  const nativeSelectRef = useRef<HTMLSelectElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(nativeSelectRef, ref);
  const {
    handleKeyDown,
    handleOpenChange,
    handleSelectOption,
    highlightedIndex,
    isOpen,
    selectedIndex,
    selectedValue,
    setHighlightedIndex,
    toggleFromTrigger,
  } = useListboxSelectState({
    disabled,
    nativeSelectRef,
    options,
    props,
    valueProp,
  });

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || ariaLabelledBy) return undefined;

    if (ariaLabel || ariaLabelledBy) {
      trigger.removeAttribute('aria-labelledby');
      return undefined;
    }

    const labels = Array.from(nativeSelectRef.current?.labels ?? []);
    if (labels.length === 0) {
      trigger.removeAttribute('aria-labelledby');
      return undefined;
    }

    const assignedIds: HTMLLabelElement[] = [];
    const labelIds = labels.map((label, index) => {
      if (label.id) return label.id;
      label.id = `${controlId}-label-${index}`;
      assignedIds.push(label);
      return label.id;
    });
    const labelIdList = labelIds.join(' ');
    trigger.setAttribute('aria-labelledby', labelIdList);

    return () => {
      if (trigger.getAttribute('aria-labelledby') === labelIdList) {
        trigger.removeAttribute('aria-labelledby');
      }
      assignedIds.forEach((label) => {
        label.removeAttribute('id');
      });
    };
  }, [ariaLabel, ariaLabelledBy, controlId]);

  const activeDescendant =
    isOpen && highlightedIndex >= 0 && highlightedIndex < options.length
      ? getListboxSelectOptionId(listId, options[highlightedIndex])
      : undefined;

  const selectedLabel = options[selectedIndex]?.label ?? '';

  return (
    <ListboxPopover open={isOpen} onOpenChange={handleOpenChange}>
      <div className={cx(classes.root, className)}>
        <ListboxSelectNativeSelect
          {...rest}
          ref={mergedRef}
          controlId={controlId}
          selectedValue={selectedValue}
          onChange={onChange}
          disabled={disabled}
          name={name}
          required={required}
          form={form}
          onNativeFocus={(event) => {
            onFocus?.(event);
            triggerRef.current?.focus();
          }}
        >
          {children}
        </ListboxSelectNativeSelect>
        <ListboxPopoverAnchor asChild>
          <ListboxSelectTrigger
            ref={triggerRef}
            triggerId={triggerId}
            className={classes.field}
            iconClassName={classes.icon}
            activeDescendant={activeDescendant}
            ariaLabel={ariaLabel}
            ariaLabelledBy={ariaLabelledBy}
            ariaDescribedBy={ariaDescribedBy}
            ariaErrorMessage={ariaErrorMessage}
            disabled={disabled}
            error={isInvalid}
            isOpen={isOpen}
            listId={listId}
            selectedLabel={selectedLabel}
            tabIndex={tabIndex}
            onPointerDown={(event) => {
              if (disabled || event.button !== 0) return;
              event.preventDefault();
              triggerRef.current?.focus();
              toggleFromTrigger();
            }}
            onKeyDown={handleKeyDown}
          />
        </ListboxPopoverAnchor>
        {options.length > 0 && (
          <ListboxSelectPopup
            listId={listId}
            contentClassName={popupClasses.content}
            itemClassName={popupClasses.item}
            itemTextClassName={popupClasses.itemText}
            options={options}
            highlightedIndex={highlightedIndex}
            selectedValue={selectedValue}
            onSelect={handleSelectOption}
            onHighlight={setHighlightedIndex}
          />
        )}
      </div>
    </ListboxPopover>
  );
});

ListboxSelect.displayName = 'ListboxSelect';
