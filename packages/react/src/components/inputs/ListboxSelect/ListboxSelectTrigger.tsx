import { forwardRef } from 'react';
import type {
  AriaAttributes,
  HTMLAttributes,
  KeyboardEventHandler,
  PointerEventHandler,
} from 'react';
import { ChevronDownIcon } from '@/components/media/Icon/icons';

interface ListboxSelectTriggerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onKeyDown' | 'onPointerDown'
> {
  activeDescendant?: string;
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  ariaInvalid?: AriaAttributes['aria-invalid'];
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  disabled: boolean;
  error: boolean;
  iconClassName?: string;
  isOpen: boolean;
  listId?: string;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  required?: boolean;
  readOnly?: boolean;
  selectedLabel: string;
  tabIndex?: number;
  triggerId: string;
}


export const ListboxSelectTrigger = forwardRef<HTMLDivElement, ListboxSelectTriggerProps>(
  (
    {
      activeDescendant,
      ariaDescribedBy,
      ariaErrorMessage,
      ariaInvalid,
      ariaLabel,
      ariaLabelledBy,
      className,
      disabled,
      error,
      iconClassName,
      isOpen,
      listId,
      onKeyDown,
      onPointerDown,
      required,
      readOnly,
      selectedLabel,
      tabIndex,
      triggerId,
      ...triggerProps
    },
    ref,
  ) => (
    <div
      {...triggerProps}
      ref={ref}
      id={triggerId}
      className={className}
      role="combobox"
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-errormessage={ariaErrorMessage}
      aria-controls={listId}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-invalid={error ? true : ariaInvalid}
      aria-required={required ? true : undefined}
      aria-readonly={readOnly || undefined}
      aria-activedescendant={activeDescendant}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <span data-listbox-select-value>{selectedLabel}</span>
      <span
        className={iconClassName}
        data-select-icon
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden="true"
      >
        <ChevronDownIcon />
      </span>
    </div>
  ),
);

ListboxSelectTrigger.displayName = 'ListboxSelectTrigger';
