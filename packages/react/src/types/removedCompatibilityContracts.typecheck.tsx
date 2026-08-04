import {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@/components/navigation/Breadcrumbs';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/navigation/Sidebar';
import { ScrollArea } from '@/components/layout/ScrollArea';
import { Code } from '@/components/typography/Code';
import { InputGroup } from '@/components/inputs/InputGroup';
import { NumberInput } from '@/components/inputs/NumberInput';
import { Button } from '@/components/inputs/Button';
import { CloseButton } from '@/components/inputs/CloseButton';
import { CopyButton } from '@/components/inputs/CopyButton';
import { DirectionalButton } from '@/components/inputs/DirectionalButton';
import { IconButton } from '@/components/inputs/IconButton';
import { ToggleButton } from '@/components/inputs/ToggleButton';
import { ButtonGroup } from '@/components/inputs/ButtonGroup';
import { Checkbox } from '@/components/inputs/Checkbox';
import { OTPInput } from '@/components/inputs/OTPInput';
import { Radio, RadioGroup } from '@/components/inputs/RadioGroup';
import { TimeClock } from '@/components/inputs/TimeClock';
import { TimePicker } from '@/components/inputs/TimePicker';
import { TagCloseButton } from '@/components/data-display/Tag';
import { Step, Stepper } from '@/components/navigation/Stepper';
import { TabContent, TabList, Tabs, TabTrigger } from '@/components/navigation/Tabs';
import * as inputGroupExports from '@/components/inputs/InputGroup';
import { ContextMenu } from '@/components/overlay/ContextMenu';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/overlay/Popover';
import { Portal } from '@/components/overlay/Portal';
import type { ContextMenuItem } from '@/components/overlay/ContextMenu';
import type { ComponentProps } from 'react';

// @ts-expect-error Fixed semantic roots do not support host delegation.
<Breadcrumbs asChild />;
// @ts-expect-error Fixed semantic items do not support host delegation.
<BreadcrumbItem asChild />;
// @ts-expect-error Fixed semantic separators do not support host delegation.
<BreadcrumbSeparator asChild />;

// @ts-expect-error Sidebar owns its aside host.
<Sidebar asChild />;
// @ts-expect-error SidebarHeader owns its header host.
<SidebarHeader asChild />;
// @ts-expect-error SidebarContent owns its div host.
<SidebarContent asChild />;
// @ts-expect-error SidebarFooter owns its footer host.
<SidebarFooter asChild />;
// @ts-expect-error SidebarGroup owns its div host.
<SidebarGroup asChild />;

// @ts-expect-error ScrollArea owns its root and viewport structure.
<ScrollArea asChild>Content</ScrollArea>;
<Code asChild>
  <code>inline</code>
</Code>;
// @ts-expect-error Block Code owns its pre and code DOM structure.
<Code variant="block" asChild>
  <code>block</code>
</Code>;
// @ts-expect-error Physical-direction compound slots were removed.
<InputGroup.LeftAddon>Prefix</InputGroup.LeftAddon>;
// @ts-expect-error NumberInput owns its native number-input semantics.
<NumberInput type="number" />;
// @ts-expect-error NumberInput owns its native spinbutton role.
<NumberInput role="spinbutton" />;
// @ts-expect-error NumberInput always enforces minimum stepper targets.
<NumberInput stepperTarget="compact" />;
<Button startIcon={<span />} endIcon={<span />}>
  Save
</Button>;
<ToggleButton startIcon={<span />} endIcon={<span />}>
  Pin
</ToggleButton>;
// @ts-expect-error Physical icon placement was replaced by logical inline-start placement.
<Button leftIcon={<span />}>Save</Button>;
// @ts-expect-error Physical icon placement was replaced by logical inline-end placement.
<Button rightIcon={<span />}>Save</Button>;
// @ts-expect-error Physical icon placement was replaced by logical inline-start placement.
<ToggleButton leftIcon={<span />}>Pin</ToggleButton>;
// @ts-expect-error Physical icon placement was replaced by logical inline-end placement.
<ToggleButton rightIcon={<span />}>Pin</ToggleButton>;
// @ts-expect-error IconButton always owns the non-submit button type.
<IconButton type="submit" icon={<svg />} aria-label="Open actions" />;
// @ts-expect-error CloseButton always owns the non-submit button type.
<CloseButton type="submit" />;
// @ts-expect-error DirectionalButton always owns the non-submit button type.
<DirectionalButton type="submit" aria-label="Next item" />;
// @ts-expect-error CopyButton always owns the non-submit button type.
<CopyButton type="submit" value="value" />;
// @ts-expect-error TagCloseButton always owns the non-submit button type.
<TagCloseButton type="submit" />;
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    <PopoverClose>Close</PopoverClose>
  </PopoverContent>
</Popover>;
// @ts-expect-error PopoverTrigger always owns the non-submit button type.
<PopoverTrigger type="submit">Open</PopoverTrigger>;
// @ts-expect-error PopoverClose always owns the non-submit button type.
<PopoverClose type="submit">Close</PopoverClose>;
// @ts-expect-error Portal only exposes the provider-wide scoping name.
<Portal scopeMotion />;
// @ts-expect-error OTPInput owns its composite group role.
<OTPInput role="presentation" />;
// @ts-expect-error OTPInput derives the group disabled state from `disabled`.
const invalidOtpAriaDisabled = { 'aria-disabled': false } satisfies ComponentProps<typeof OTPInput>;
// @ts-expect-error CheckboxGroup owns its composite group role.
<Checkbox.Group role="list">
  <Checkbox value="one">One</Checkbox>
</Checkbox.Group>;
// @ts-expect-error RadioGroup owns its radiogroup role.
<RadioGroup role="group">
  <Radio value="one">One</Radio>
</RadioGroup>;
// @ts-expect-error RadioGroup derives aria-orientation from `orientation`.
const invalidRadioOrientation = { 'aria-orientation': 'horizontal' } satisfies ComponentProps<
  typeof RadioGroup
>;
// @ts-expect-error RadioGroup derives aria-readonly from `readOnly`.
const invalidRadioReadOnly = { 'aria-readonly': false } satisfies ComponentProps<typeof RadioGroup>;
// @ts-expect-error ButtonGroup owns its composite group role.
<ButtonGroup role="presentation" />;
// @ts-expect-error TimePicker owns its composite group role.
<TimePicker role="presentation" />;
// @ts-expect-error TimePicker derives the group disabled state from `disabled`.
const invalidTimePickerAriaDisabled = { 'aria-disabled': false } satisfies ComponentProps<
  typeof TimePicker
>;
// @ts-expect-error TimeClock owns its composite group role.
<TimeClock role="presentation" />;
// @ts-expect-error TimeClock derives the group disabled state from `disabled`.
const invalidTimeClockAriaDisabled = { 'aria-disabled': false } satisfies ComponentProps<
  typeof TimeClock
>;
// @ts-expect-error Stepper owns its composite group role.
<Stepper role="presentation">
  <Step title="One" />
</Stepper>;
// @ts-expect-error TabList owns the tablist role.
<TabList role="list" />;
// @ts-expect-error TabList derives aria-orientation from the Tabs root.
const invalidTabListOrientation = { 'aria-orientation': 'vertical' } satisfies ComponentProps<
  typeof TabList
>;
// @ts-expect-error TabTrigger owns selection state.
const invalidTabTriggerSelected = { 'aria-selected': true, value: 'one' } satisfies ComponentProps<
  typeof TabTrigger
>;
const invalidTabTriggerControls = {
  // @ts-expect-error TabTrigger owns its associated panel relation.
  'aria-controls': 'panel',
  value: 'one',
} satisfies ComponentProps<typeof TabTrigger>;
// @ts-expect-error TabContent owns panel visibility.
<TabContent value="one" hidden />;
const invalidTabContentLabelledBy = {
  // @ts-expect-error TabContent owns its associated trigger relation.
  'aria-labelledby': 'trigger',
  value: 'one',
} satisfies ComponentProps<typeof TabContent>;
<Tabs defaultValue="one">
  <TabList>
    <TabTrigger value="one">One</TabTrigger>
  </TabList>
  <TabContent value="one">One</TabContent>
</Tabs>;

const validContextItem: ContextMenuItem = { label: 'Action' };
// @ts-expect-error ContextMenu does not advertise unimplemented submenu behavior.
const submenuContextItem: ContextMenuItem = { type: 'submenu', label: 'More' };
// @ts-expect-error ContextMenu items do not accept nested children.
const nestedContextItem: ContextMenuItem = { label: 'More', children: [validContextItem] };

<ContextMenu open={false} onClose={() => undefined} items={[validContextItem]} />;
// @ts-expect-error ContextMenu always owns the menu role.
<ContextMenu open={false} onClose={() => undefined} items={[validContextItem]} role="dialog" />;

// @ts-expect-error Tabs owns internal trigger occurrence indexing.
<TabTrigger value="one" tabInstanceIndex={0} />;
// @ts-expect-error Tabs owns trigger-panel association identifiers.
<TabTrigger value="one" tabAssociationId="manual" />;
// @ts-expect-error Tabs owns trigger-panel match state.
<TabTrigger value="one" hasMatchingPanel />;
// @ts-expect-error Tabs owns internal panel occurrence indexing.
<TabContent value="one" tabInstanceIndex={0} />;
// @ts-expect-error Tabs owns panel-trigger association identifiers.
<TabContent value="one" tabAssociationId="manual" />;
// @ts-expect-error Tabs owns panel-trigger match state.
<TabContent value="one" hasMatchingTrigger />;

void submenuContextItem;
void nestedContextItem;
void invalidOtpAriaDisabled;
void invalidRadioOrientation;
void invalidRadioReadOnly;
void invalidTimePickerAriaDisabled;
void invalidTimeClockAriaDisabled;
void invalidTabListOrientation;
void invalidTabTriggerSelected;
void invalidTabTriggerControls;
void invalidTabContentLabelledBy;

// @ts-expect-error Removed pagination aliases must stay unavailable.
import type { PaginationDot, PaginationRangeItem } from '@/components/navigation/Pagination';
// @ts-expect-error ScrollAreaRootProps was replaced by the canonical ScrollAreaProps.
import type { ScrollAreaRootProps } from '@/components/layout/ScrollArea';
// @ts-expect-error NumberInput no longer exposes a configurable stepper target.
import type { NumberInputStepperTarget } from '@/components/inputs/NumberInput';
// @ts-expect-error Empty generated Popover recipe aliases are not public component contracts.
import type { PopoverVariants } from '@/components/overlay/Popover';
// @ts-expect-error ContextMenuProps is the sole public root props name.
import type { ContextMenuCombinedProps } from '@/components/overlay/ContextMenu';

// @ts-expect-error Removed InputGroup physical-direction export must stay unavailable.
const removedLeftAddon = inputGroupExports.InputLeftAddon;
// @ts-expect-error Removed InputGroup physical-direction export must stay unavailable.
const removedRightAddon = inputGroupExports.InputRightAddon;
// @ts-expect-error Removed InputGroup physical-direction export must stay unavailable.
const removedLeftElement = inputGroupExports.InputLeftElement;
// @ts-expect-error Removed InputGroup physical-direction export must stay unavailable.
const removedRightElement = inputGroupExports.InputRightElement;

void removedLeftAddon;
void removedRightAddon;
void removedLeftElement;
void removedRightElement;
type RemovedPaginationAliases = PaginationDot | PaginationRangeItem;
type RemovedNumberInputAlias = NumberInputStepperTarget;
type RemovedPopoverAlias = PopoverVariants;
type RemovedContextMenuAlias = ContextMenuCombinedProps;
declare const removedPaginationAlias: RemovedPaginationAliases;
declare const removedScrollAreaRootProps: ScrollAreaRootProps;
declare const removedNumberInputAlias: RemovedNumberInputAlias;
declare const removedPopoverAlias: RemovedPopoverAlias;
declare const removedContextMenuAlias: RemovedContextMenuAlias;
void removedPaginationAlias;
void removedScrollAreaRootProps;
void removedNumberInputAlias;
void removedPopoverAlias;
void removedContextMenuAlias;
