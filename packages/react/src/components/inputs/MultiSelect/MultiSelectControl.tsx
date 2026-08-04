'use client';

import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  RefObject,
  type ReactNode,
} from 'react';
import { DisclosureIconButton } from '@/components/inputs/DisclosureIconButton';
import type {
  MultiSelectClasses,
  MultiSelectOption,
  MultiSelectRenderTagProps,
} from './MultiSelect.types';
import { MultiSelectTags } from './MultiSelectTags';

/**
 * Visual shell for MultiSelect.
 * Keeps DOM wiring for the internal combobox in one place so the root component
 * can stay focused on composition and the hook can stay focused on state.
 */
interface MultiSelectControlProps {
  activeDescendant?: string;
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  classes: MultiSelectClasses;
  disabled: boolean;
  error: boolean;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  isOpen: boolean;
  listId?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onInputPointerDown: (event: PointerEvent<HTMLInputElement>) => void;
  onRemoveTag: (tagValue: string) => void;
  onToggleOpen: (nextOpen: boolean) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  readOnly: boolean;
  renderTag?: (props: MultiSelectRenderTagProps) => ReactNode;
  required: boolean;
  tabIndex?: number;
  value: string[];
  toggleLabel: string;
  getRemoveLabel: (label: string) => string;
}


export const MultiSelectControl = forwardRef<HTMLDivElement, MultiSelectControlProps>(
  (
    {
      activeDescendant,
      ariaDescribedBy,
      ariaErrorMessage,
      ariaLabel,
      ariaLabelledBy,
      classes,
      disabled,
      error,
      inputId,
      inputRef,
      inputValue,
      isOpen,
      listId,
      onInputChange,
      onInputKeyDown,
      onInputPointerDown,
      onRemoveTag,
      onToggleOpen,
      options,
      placeholder,
      readOnly,
      renderTag,
      required,
      tabIndex,
      value,
      toggleLabel,
      getRemoveLabel,
    },
    ref,
  ) => (
    <div ref={ref} className={classes.control}>
      <MultiSelectTags
        values={value}
        options={options}
        disabled={disabled ? true : readOnly}
        onRemove={onRemoveTag}
        renderTag={renderTag}
        getRemoveLabel={getRemoveLabel}
      />
      {/* eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex -- The input is focusable and receives tabIndex below; the rule does not recognize this dynamic tabIndex expression. */}
      <input
        ref={inputRef}
        id={inputId}
        className={classes.input}
        tabIndex={tabIndex ?? 0}
        role="combobox"
        value={inputValue}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={value.length === 0 ? placeholder : ''}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-errormessage={ariaErrorMessage}
        aria-controls={listId}
        aria-expanded={isOpen}
        aria-invalid={error ? true : undefined}
        aria-readonly={readOnly ? true : undefined}
        aria-required={required ? true : undefined}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-activedescendant={activeDescendant}
        onChange={onInputChange}
        onPointerDown={onInputPointerDown}
        onKeyDown={onInputKeyDown}
      />
      <DisclosureIconButton
        data-multiselect-trigger
        className={classes.trigger}
        open={isOpen}
        disabled={disabled ? true : readOnly}
        aria-label={toggleLabel}
        aria-haspopup="listbox"
        aria-controls={listId}
        tabIndex={-1}
        onOpenChange={onToggleOpen}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </div>
  ),
);

MultiSelectControl.displayName = 'MultiSelectControl';
