import { Skeleton } from '@/components/feedback/Skeleton';
import { Checkbox } from '@/components/inputs/Checkbox';
import { DatePicker } from '@/components/inputs/DatePicker';
import { DateTimePicker } from '@/components/inputs/DateTimePicker';
import { InputGroup } from '@/components/inputs/InputGroup';
import { RangeSlider } from '@/components/inputs/RangeSlider';
import { Radio, RadioGroup } from '@/components/inputs/RadioGroup';
import { Slider } from '@/components/inputs/Slider';
import { Switch } from '@/components/inputs/Switch';
import { WheelPicker } from '@/components/inputs/WheelPicker';
import { BreadcrumbLink } from '@/components/navigation/Breadcrumbs';
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from '@/components/navigation/Dropdown';
import { Code } from '@/components/typography/Code';
import { createRef, type ComponentProps } from 'react';

const validInputGroup = (
  <InputGroup size="lg">
    <InputGroup.Input aria-label="Search" />
  </InputGroup>
);
// @ts-expect-error Controlled Dropdown requires an update callback.
const unpairedDropdown = <Dropdown open>{null}</Dropdown>;
// @ts-expect-error InputGroup owns the size of its input slot.
const inputGroupInputSize = <InputGroup.Input size="sm" />;

const validSkeleton = <Skeleton />;
const validSlottedSkeleton = (
  <Skeleton asChild>
    <div />
  </Skeleton>
);
// @ts-expect-error A default Skeleton is an inline placeholder and does not render children.
const defaultSkeletonChildren = <Skeleton>Loading</Skeleton>;
// @ts-expect-error A slotted Skeleton requires exactly one React element.
const missingSlottedSkeletonChild = <Skeleton asChild />;
// @ts-expect-error A slotted Skeleton cannot receive text as its host.
const textSlottedSkeletonChild = <Skeleton asChild>Loading</Skeleton>;

const validCurrentBreadcrumb = <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>;
const validSlottedCurrentBreadcrumb = (
  <BreadcrumbLink isCurrentPage asChild>
    <a href="/current">Current</a>
  </BreadcrumbLink>
);
// @ts-expect-error A current-page breadcrumb is not a navigation target.
const currentBreadcrumbHref = <BreadcrumbLink isCurrentPage href="/current" />;
// @ts-expect-error A current-page breadcrumb cannot expose an interactive role.
const currentBreadcrumbRole = <BreadcrumbLink isCurrentPage role="button" />;
// @ts-expect-error A current-page breadcrumb cannot be focusable.
const currentBreadcrumbTabIndex = <BreadcrumbLink isCurrentPage tabIndex={0} />;
// @ts-expect-error A current-page breadcrumb cannot expose activation handlers.
const currentBreadcrumbClick = <BreadcrumbLink isCurrentPage onClick={() => undefined} />;
const currentBreadcrumbPointerDown = (
  // @ts-expect-error A current-page breadcrumb cannot expose pointer activation handlers.
  <BreadcrumbLink isCurrentPage onPointerDown={() => undefined} />
);
// @ts-expect-error A current-page breadcrumb renders a span and rejects anchor-only attributes.
const currentBreadcrumbDownload = <BreadcrumbLink isCurrentPage download />;

const validRadioGroup = (
  <RadioGroup name="plan" defaultValue="free">
    <Radio value="free" required>
      Free
    </Radio>
  </RadioGroup>
);
// @ts-expect-error RadioGroup owns individual radio checked state.
const radioChecked = <Radio value="free" checked />;
// @ts-expect-error RadioGroup owns individual radio defaultChecked state.
const radioDefaultChecked = <Radio value="free" defaultChecked />;
// @ts-expect-error RadioGroup owns the native name shared by its radios.
const radioName = <Radio value="free" name="plan" />;
// @ts-expect-error RadioGroup owns the native form shared by its radios.
const radioForm = <Radio value="free" form="checkout" />;
// @ts-expect-error Radio changes are reported through RadioGroup.
const radioChange = <Radio value="free" onChange={() => undefined} />;
// @ts-expect-error Radio owns its native radio role.
const radioRole = <Radio value="free" role="button" />;
// @ts-expect-error Radio derives checked semantics from RadioGroup.
const radioAriaChecked = { 'aria-checked': true, value: 'free' } satisfies ComponentProps<
  typeof Radio
>;
// @ts-expect-error Radio derives disabled semantics from its props and RadioGroup.
const radioAriaDisabled = { 'aria-disabled': true, value: 'free' } satisfies ComponentProps<
  typeof Radio
>;

const validCheckboxInput = <Checkbox.Input required readOnly form="checkout" />;
// @ts-expect-error Checkbox owns the input checked state.
const checkboxInputChecked = <Checkbox.Input checked />;
// @ts-expect-error Checkbox owns the input defaultChecked state.
const checkboxInputDefaultChecked = <Checkbox.Input defaultChecked />;
// @ts-expect-error Checkbox owns the disabled state of its input slot.
const checkboxInputDisabled = <Checkbox.Input disabled />;
// @ts-expect-error Checkbox reports changes from its root.
const checkboxInputChange = <Checkbox.Input onChange={() => undefined} />;
// @ts-expect-error Checkbox owns the submitted value of its input slot.
const checkboxInputValue = <Checkbox.Input value="terms" />;
// @ts-expect-error Checkbox.Input owns its native checkbox role.
const checkboxInputRole = <Checkbox.Input role="button" />;
// @ts-expect-error Checkbox.Input derives checked semantics from Checkbox.
const checkboxInputAriaChecked = { 'aria-checked': true } satisfies ComponentProps<
  typeof Checkbox.Input
>;
// @ts-expect-error Checkbox.Input derives disabled semantics from Checkbox.
const checkboxInputAriaDisabled = { 'aria-disabled': true } satisfies ComponentProps<
  typeof Checkbox.Input
>;

// @ts-expect-error DatePicker owns native date-input or custom button semantics.
const datePickerRole = <DatePicker role="textbox" />;
// @ts-expect-error DatePicker owns its expanded state.
const datePickerExpanded = { 'aria-expanded': true } satisfies ComponentProps<typeof DatePicker>;
// @ts-expect-error DatePicker owns its popup relation.
const datePickerControls = { 'aria-controls': 'calendar' } satisfies ComponentProps<
  typeof DatePicker
>;
// @ts-expect-error DatePicker always exposes a dialog popup in custom mode.
const datePickerHasPopup = { 'aria-haspopup': 'listbox' } satisfies ComponentProps<
  typeof DatePicker
>;
// @ts-expect-error DatePicker derives required semantics from `required`.
const datePickerAriaRequired = { 'aria-required': false } satisfies ComponentProps<
  typeof DatePicker
>;
const customDatePickerRef = createRef<HTMLButtonElement>();
const nativeDatePickerRef = createRef<HTMLInputElement>();
const validCustomDatePickerRef = <DatePicker ref={customDatePickerRef} />;
const validNativeDatePickerRef = <DatePicker native ref={nativeDatePickerRef} />;
// @ts-expect-error Custom DatePicker forwards an HTMLButtonElement.
const invalidCustomDatePickerRef = <DatePicker ref={nativeDatePickerRef} />;
// @ts-expect-error Native DatePicker forwards an HTMLInputElement.
const invalidNativeDatePickerRef = <DatePicker native ref={customDatePickerRef} />;

// @ts-expect-error Slider owns its native range role.
const sliderRole = <Slider role="button" />;
// @ts-expect-error Slider owns its implicit orientation.
const sliderOrientation = { 'aria-orientation': 'vertical' } satisfies ComponentProps<
  typeof Slider
>;
// @ts-expect-error Slider derives the announced current value from the native value.
const sliderAriaValueNow = { 'aria-valuenow': 50 } satisfies ComponentProps<typeof Slider>;
const validSliderValueText = <Slider aria-valuetext="Medium" />;

// @ts-expect-error Switch owns its switch role.
const switchRole = <Switch role="checkbox" />;
// @ts-expect-error Switch derives checked semantics from native checked state.
const switchAriaChecked = { 'aria-checked': true } satisfies ComponentProps<typeof Switch>;
// @ts-expect-error Switch derives required semantics from `required`.
const switchAriaRequired = { 'aria-required': false } satisfies ComponentProps<typeof Switch>;
const validSwitchFormProps = <Switch checked required name="updates" form="settings" />;

// @ts-expect-error DateTimePicker owns its composite group role.
const dateTimePickerRole = <DateTimePicker role="button" />;
// @ts-expect-error DateTimePicker derives disabled semantics from `disabled`.
const dateTimePickerAriaDisabled = { 'aria-disabled': false } satisfies ComponentProps<
  typeof DateTimePicker
>;
// @ts-expect-error DateTimePicker keeps readonly semantics on its inner fields.
const dateTimePickerAriaReadOnly = { 'aria-readonly': false } satisfies ComponentProps<
  typeof DateTimePicker
>;
// @ts-expect-error DateTimePicker keeps required semantics on its inner fields.
const dateTimePickerAriaRequired = { 'aria-required': false } satisfies ComponentProps<
  typeof DateTimePicker
>;

// @ts-expect-error RangeSlider owns its composite group role.
const rangeSliderRole = <RangeSlider role="button" />;
// @ts-expect-error RangeSlider derives read-only semantics from `readOnly`.
const rangeSliderAriaReadOnly = { 'aria-readonly': false } satisfies ComponentProps<
  typeof RangeSlider
>;
const validRangeSliderDescription = <RangeSlider aria-describedby="range-help" />;

// @ts-expect-error WheelPicker owns its composite group role.
const wheelPickerRole = <WheelPicker columns={[]} role="button" />;
const wheelPickerAriaDisabled = {
  columns: [],
  // @ts-expect-error WheelPicker derives disabled semantics from `disabled`.
  'aria-disabled': false,
} satisfies ComponentProps<typeof WheelPicker>;
const validWheelPickerDescription = <WheelPicker columns={[]} aria-describedby="wheel-help" />;

const validInlineCodeRole = <Code role="status">code</Code>;
const blockCodeRole = (
  // @ts-expect-error Block Code owns its named overflow group role.
  <Code role="button" variant="block">
    code
  </Code>
);

// @ts-expect-error Dropdown.Trigger owns its native button type.
const dropdownTriggerType = <DropdownTrigger type="submit">Open</DropdownTrigger>;
const dropdownTriggerControls = {
  // @ts-expect-error Dropdown.Trigger owns its popup relationship.
  'aria-controls': 'menu',
} satisfies ComponentProps<typeof DropdownTrigger>;
const dropdownTriggerExpanded = {
  // @ts-expect-error Dropdown.Trigger owns its expanded state.
  'aria-expanded': true,
} satisfies ComponentProps<typeof DropdownTrigger>;
// @ts-expect-error Dropdown.Menu owns its menu role.
const dropdownMenuRole = <DropdownMenu role="list" />;
// @ts-expect-error Dropdown.Menu owns its generated identity.
const dropdownMenuId = <DropdownMenu id="menu" />;
// @ts-expect-error Dropdown.Item owns its roving focus position.
const dropdownItemTabIndex = <DropdownItem tabIndex={0}>Item</DropdownItem>;
const dropdownItemAriaDisabled = {
  // @ts-expect-error Dropdown.Item derives disabled semantics from `disabled`.
  'aria-disabled': true,
} satisfies ComponentProps<typeof DropdownItem>;
// @ts-expect-error Dropdown.Label is always passive.
const dropdownLabelTabIndex = <DropdownLabel tabIndex={0}>Label</DropdownLabel>;
// @ts-expect-error Dropdown.Separator owns its separator role.
const dropdownSeparatorRole = <DropdownSeparator role="button" />;

void validInputGroup;
void unpairedDropdown;
void inputGroupInputSize;
void validSkeleton;
void validSlottedSkeleton;
void defaultSkeletonChildren;
void missingSlottedSkeletonChild;
void textSlottedSkeletonChild;
void validCurrentBreadcrumb;
void validSlottedCurrentBreadcrumb;
void currentBreadcrumbHref;
void currentBreadcrumbRole;
void currentBreadcrumbTabIndex;
void currentBreadcrumbClick;
void currentBreadcrumbPointerDown;
void currentBreadcrumbDownload;
void validRadioGroup;
void radioChecked;
void radioDefaultChecked;
void radioName;
void radioForm;
void radioChange;
void radioRole;
void radioAriaChecked;
void radioAriaDisabled;
void validCheckboxInput;
void checkboxInputChecked;
void checkboxInputDefaultChecked;
void checkboxInputDisabled;
void checkboxInputChange;
void checkboxInputValue;
void checkboxInputRole;
void checkboxInputAriaChecked;
void checkboxInputAriaDisabled;
void datePickerRole;
void datePickerExpanded;
void datePickerControls;
void datePickerHasPopup;
void datePickerAriaRequired;
void validCustomDatePickerRef;
void validNativeDatePickerRef;
void invalidCustomDatePickerRef;
void invalidNativeDatePickerRef;
void sliderRole;
void sliderOrientation;
void sliderAriaValueNow;
void validSliderValueText;
void switchRole;
void switchAriaChecked;
void switchAriaRequired;
void validSwitchFormProps;
void dateTimePickerRole;
void dateTimePickerAriaDisabled;
void dateTimePickerAriaReadOnly;
void dateTimePickerAriaRequired;
void rangeSliderRole;
void rangeSliderAriaReadOnly;
void validRangeSliderDescription;
void wheelPickerRole;
void wheelPickerAriaDisabled;
void validWheelPickerDescription;
void validInlineCodeRole;
void blockCodeRole;
void dropdownTriggerType;
void dropdownTriggerControls;
void dropdownTriggerExpanded;
void dropdownMenuRole;
void dropdownMenuId;
void dropdownItemTabIndex;
void dropdownItemAriaDisabled;
void dropdownLabelTabIndex;
void dropdownSeparatorRole;
