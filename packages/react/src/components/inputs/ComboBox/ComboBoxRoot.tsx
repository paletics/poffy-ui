'use client';

import { cx } from '@/styled-system/css';
import { ListboxPopover } from '@/components/overlay/ListboxPopover';
import { comboBox } from '@/styled-system/recipes';
import { filterListboxOptions } from '@poffy-ui/behavior/listbox';
import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ComboBoxAppearance, ComboBoxProps } from './ComboBox.types';
import { ComboBoxContext, ComboBoxContextValue } from './ComboBoxContext';

const resolveInputVariant = (appearance: ComboBoxAppearance, variant?: ComboBoxProps['variant']) =>
  variant ?? (appearance === 'soft' ? 'filled' : appearance === 'neo' ? 'neo' : 'outline');

/**
 * State and layout root for the composable ComboBox pattern.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`comboBox` slot recipe), `ListboxPopover`, React context
 * - **Props**: `ComboBoxProps`
 *
 * ### Design Tokens
 * - **spacing**: input height, option padding, and content gap are driven by the `size` recipe variant
 * - **color**: field, popup, highlighted, selected, and error states use semantic input tokens
 *
 * ### Variant Logic
 * - **appearance="outline"**: Standard bordered input for forms and filters.
 * - **appearance="soft"**: Filled field for low-emphasis surfaces.
 * - **appearance="neo"**: Raised visual style for prominent controls.
 * - **size**: `sm` for dense filters, `md` for standard forms, `lg` for prominent fields.
 *
 * ### Accessibility
 * - **Role**: delegates combobox/listbox roles to `ComboBoxInput` and `ComboBoxList`.
 * - **Pattern**: WAI-ARIA Combobox with list autocomplete.
 * - **Keyboard**: Delegated to `ComboBoxInput`.
 * - **Required**: Provide `label`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use as `ComboBox.Root` when manually composing input, list, and item slots.
 * - **DON'T**: Do not render `ComboBox.Item` outside this root.
 *
 * @example Composable usage
 * ```tsx
 * <ComboBox.Root options={options} aria-label="Country">
 *   <ComboBox.Input placeholder="Search countries" />
 *   <ComboBox.List>
 *     <ComboBox.Item value="jp" label="Japan" />
 *   </ComboBox.List>
 * </ComboBox.Root>
 * ```
 *
 * @example Form integration
 * ```tsx
 * <ComboBox.Root name="country" options={options} aria-label="Country">
 *   <ComboBox.Input />
 *   <ComboBox.List>{items}</ComboBox.List>
 * </ComboBox.Root>
 * ```
 */
export const ComboBoxRoot = forwardRef<HTMLDivElement, ComboBoxProps>((props, ref) => {
  const {
    options = [],
    value,
    onChange,
    disabled = false,
    readOnly = false,
    size = 'md',
    appearance = 'outline',
    variant,
    error = false,
    id: idProp,
    name,
    form,
    required,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    className,
    style,
    children,
    ...rest
  } = props;

  const classes = comboBox({
    size,
    variant: resolveInputVariant(appearance, variant),
    error,
  });
  const [isOpen, setIsOpen] = useState(false);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(value ?? null);
  const selectedValue = useMemo(
    () => (isControlled ? (value ?? null) : uncontrolledValue),
    [isControlled, value, uncontrolledValue],
  );
  const generatedInputId = useId();
  const inputId = idProp ?? generatedInputId;
  const listId = useId();

  const [inputValue, setInputValue] = useState(() => {
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    return selectedOption ? selectedOption.label : '';
  });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else if (!isOpen && selectedValue == null) {
        setInputValue('');
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedValue, options, isOpen]);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs([containerRef, ref]);

  const filteredOptions = filterListboxOptions(options, inputValue);

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [disabled, isControlled, onChange, readOnly],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if ((disabled || readOnly) && nextOpen) return;
      setIsOpen((prev) => (prev === nextOpen ? prev : nextOpen));
    },
    [disabled, readOnly],
  );

  const contextValue: ComboBoxContextValue = {
    isOpen,
    setIsOpen: handleOpenChange,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    options,
    value: selectedValue,
    onChange: handleValueChange,
    disabled,
    readOnly,
    required,
    tabIndex,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaErrorMessage,
    size: size as ComboBoxContextValue['size'],
    inputId,
    listId,
    classes,
  };

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <ListboxPopover open={isOpen} onOpenChange={handleOpenChange}>
        <div ref={mergedRef} className={cx(classes.root, className)} style={style} {...rest}>
          {name && (
            <input
              type="hidden"
              name={name}
              value={selectedValue ?? ''}
              form={form}
              disabled={disabled}
              readOnly
            />
          )}
          {children}
        </div>
      </ListboxPopover>
    </ComboBoxContext.Provider>
  );
});

ComboBoxRoot.displayName = 'ComboBoxRoot';
