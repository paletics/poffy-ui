'use client';

import { ListboxPopover, ListboxPopoverAnchor } from '@/components/overlay/ListboxPopover';
import { cx } from '@/styled-system/css';
import { multiSelect } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useId, useRef, useState } from 'react';
import { MultiSelectControl } from './MultiSelectControl';
import { MultiSelectOptionList } from './MultiSelectOptionList';
import { MultiSelectProps } from './MultiSelect.types';
import { useMultiSelect } from './useMultiSelect';

/**
 * Searchable multi-value select built on the same shell responsibility as other inputs.
 * Labeling is composed externally; this component owns only the control, tags, and listbox.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: `ListboxPopover`, `useMultiSelect`, Panda CSS (`multiSelect` recipe)
 * - **Props**: `NativeProps<'div', MultiSelectOwnProps>`
 *
 * ### Design Tokens
 * - **spacing**: control, tag, and popup spacing come from the `multiSelect` recipe
 * - **color**: field, tag, highlighted option, selected option, and error colors are semantic tokens
 *
 * ### Variant Logic
 * - **appearance="outline"**: Default form field treatment.
 * - **appearance="soft"**: Lower emphasis field surface, mapped to the filled recipe variant.
 * - **appearance="neo"**: Raised control surface for high-contrast product UI.
 * - **allowCustomValues**: Use only when free-form values are valid domain data.
 *
 * ### Accessibility
 * - **Role**: combobox input with a listbox popup and removable selected tags.
 * - **Pattern**: WAI-ARIA Combobox with Listbox Popup.
 * - **Keyboard**: Arrow keys highlight options, Enter selects, Backspace removes tags, Escape closes.
 * - **Required**: Provide visible labeling through `FormControl`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use for multi-value selection where search or tag removal is required.
 * - **DON'T**: Use for one selected value; choose `Select` or `ListboxSelect`.
 *
 * @example Searchable multi-select
 * ```tsx
 * import { MultiSelect } from '@poffy-ui/react/inputs';
 *
 * <MultiSelect
 *   aria-label="Project tags"
 *   options={[{ label: 'Design', value: 'design' }]}
 *   value={tags}
 *   onChange={setTags}
 * />
 * ```
 *
 * @example Form submission
 * ```tsx
 * import { MultiSelect } from '@poffy-ui/react/inputs';
 *
 * <MultiSelect name="assignees" defaultValue={['kai']} options={assigneeOptions} />
 * ```
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>((props, ref) => {
  const {
    placeholder = 'Select options...',
    options = [],
    value: valueProp,
    defaultValue = [],
    onChange,
    id: idProp,
    name,
    required = false,
    disabled = false,
    readOnly = false,
    form,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    size = 'md',
    appearance = 'outline',
    variant,
    error = false,
    renderTag,
    allowCustomValues = false,
    getCustomValue,
    className,
    ...rest
  } = props;

  const resolvedVariant =
    variant ?? (appearance === 'soft' ? 'filled' : appearance === 'neo' ? 'neo' : 'outline');
  const classes = multiSelect({ size, variant: resolvedVariant, error });
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedInputId = useId();
  const inputId = idProp ?? generatedInputId;
  const mergedRef = useMergeRefs(ref);
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => defaultValue);
  const value = isControlled ? valueProp : uncontrolledValue;
  const handleValueChange = (nextValue: string[]) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  };
  const {
    activeDescendant,
    filteredOptions,
    handleInputChange,
    handleKeyDown,
    handleSelectOption,
    highlightedIndex,
    inputValue,
    isOpen,
    listId,
    onPointerDownInput,
    onToggleOpen,
    optionIdPrefix,
    removeTag,
    setIsOpen,
  } = useMultiSelect({
    allowCustomValues,
    disabled,
    getCustomValue,
    inputRef,
    onChange: handleValueChange,
    options,
    readOnly,
    value,
  });
  const hasVisibleOptions = filteredOptions.length > 0;
  const isListboxOpen = isOpen && hasVisibleOptions;

  return (
    <ListboxPopover
      open={isListboxOpen}
      onOpenChange={(nextOpen) => {
        if (nextOpen && (disabled || readOnly)) return;
        setIsOpen(nextOpen);
      }}
    >
      <div ref={mergedRef} className={cx(classes.root, className)} {...rest}>
        {name &&
          value.map((selectedValue) => (
            <input
              key={selectedValue}
              type="hidden"
              name={name}
              value={selectedValue}
              form={form}
              disabled={disabled}
              readOnly
            />
          ))}
        <ListboxPopoverAnchor asChild>
          <MultiSelectControl
            activeDescendant={activeDescendant}
            ariaDescribedBy={ariaDescribedBy}
            ariaErrorMessage={ariaErrorMessage}
            ariaLabel={ariaLabel}
            ariaLabelledBy={ariaLabelledBy}
            classes={classes}
            disabled={disabled}
            error={error}
            inputId={inputId}
            inputRef={inputRef}
            inputValue={inputValue}
            isOpen={isListboxOpen}
            listId={hasVisibleOptions ? listId : undefined}
            onInputChange={handleInputChange}
            onInputKeyDown={handleKeyDown}
            onInputPointerDown={onPointerDownInput}
            onRemoveTag={removeTag}
            onToggleOpen={onToggleOpen}
            options={options}
            placeholder={placeholder}
            readOnly={readOnly}
            renderTag={renderTag}
            required={required}
            tabIndex={tabIndex}
            value={value}
          />
        </ListboxPopoverAnchor>
        {hasVisibleOptions && (
          <MultiSelectOptionList
            listId={listId}
            labelledBy={inputId}
            optionIdPrefix={optionIdPrefix}
            options={filteredOptions}
            selectedValues={value}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelectOption}
            classes={classes}
          />
        )}
      </div>
    </ListboxPopover>
  );
});

MultiSelect.displayName = 'MultiSelect';
