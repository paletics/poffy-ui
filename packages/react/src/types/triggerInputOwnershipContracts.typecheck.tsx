import { ComboBoxInput } from '@/components/inputs/ComboBox';
import { SearchInput } from '@/components/inputs/SearchInput';
import { DropdownTrigger } from '@/components/navigation/Dropdown';
import { PopoverTrigger } from '@/components/overlay/Popover';
import type { ComponentProps } from 'react';

const validDropdownTrigger = <DropdownTrigger aria-label="Actions" />;
const dropdownAriaDisabled = {
  // @ts-expect-error DropdownTrigger derives disabled semantics from `disabled`.
  'aria-disabled': true,
} satisfies ComponentProps<typeof DropdownTrigger>;
// @ts-expect-error DropdownTrigger owns its button semantics.
const dropdownRole = <DropdownTrigger role="link" />;
// @ts-expect-error DropdownTrigger owns keyboard focusability.
const dropdownTabIndex = <DropdownTrigger tabIndex={-1} />;

const validPopoverTrigger = <PopoverTrigger aria-label="Details" />;
const popoverAriaDisabled = {
  // @ts-expect-error PopoverTrigger derives disabled semantics from `disabled`.
  'aria-disabled': true,
} satisfies ComponentProps<typeof PopoverTrigger>;
// @ts-expect-error PopoverTrigger owns its button semantics.
const popoverRole = <PopoverTrigger role="link" />;
// @ts-expect-error PopoverTrigger owns keyboard focusability.
const popoverTabIndex = <PopoverTrigger tabIndex={-1} />;

const validComboBoxInput = <ComboBoxInput aria-label="Search" aria-describedby="search-help" />;
const comboBoxHasPopup = {
  // @ts-expect-error ComboBox.Input owns its popup semantic.
  'aria-haspopup': 'dialog',
} satisfies ComponentProps<typeof ComboBoxInput>;
const comboBoxControls = {
  // @ts-expect-error ComboBox.Input derives its list relationship from ComboBox.Root.
  'aria-controls': 'custom-list',
} satisfies ComponentProps<typeof ComboBoxInput>;

const validSearchInput = <SearchInput aria-label="Search" />;
// @ts-expect-error SearchInput owns native search input semantics.
const searchInputType = <SearchInput type="text" />;
// @ts-expect-error SearchInput owns its leading search affordance.
const searchInputStartElement = <SearchInput startElement={<span />} />;
// @ts-expect-error SearchInput owns its optional clear affordance.
const searchInputEndElement = <SearchInput endElement={<span />} />;
// @ts-expect-error SearchInput does not render caller children.
const searchInputChildren = <SearchInput>Ignored</SearchInput>;
// @ts-expect-error SearchInput owns leading element interactivity.
const searchInputStartInteractive = <SearchInput startElementInteractive />;
// @ts-expect-error SearchInput owns trailing element interactivity.
const searchInputEndInteractive = <SearchInput endElementInteractive />;

void validDropdownTrigger;
void dropdownAriaDisabled;
void dropdownRole;
void dropdownTabIndex;
void validPopoverTrigger;
void popoverAriaDisabled;
void popoverRole;
void popoverTabIndex;
void validComboBoxInput;
void comboBoxHasPopup;
void comboBoxControls;
void validSearchInput;
void searchInputType;
void searchInputStartElement;
void searchInputEndElement;
void searchInputChildren;
void searchInputStartInteractive;
void searchInputEndInteractive;
