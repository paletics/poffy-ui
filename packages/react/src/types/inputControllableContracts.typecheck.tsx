import { Checkbox } from '@/components/inputs/Checkbox';
import { DatePicker } from '@/components/inputs/DatePicker';
import { DateTimePicker } from '@/components/inputs/DateTimePicker';
import { MultiSelect } from '@/components/inputs/MultiSelect';
import { NumberInput } from '@/components/inputs/NumberInput';
import { OTPInput } from '@/components/inputs/OTPInput';
import { RadioGroup } from '@/components/inputs/RadioGroup';
import { RangeSlider } from '@/components/inputs/RangeSlider';
import { TimeClock } from '@/components/inputs/TimeClock';
import { TimePicker } from '@/components/inputs/TimePicker';
import { ToggleButton } from '@/components/inputs/ToggleButton';
import { WheelPicker } from '@/components/inputs/WheelPicker';

const noop = () => undefined;
const wheelColumns = [{ id: 'hour', label: 'Hour', options: [{ label: '1', value: '1' }] }];

const validControlledContracts = [
  <RangeSlider value={[0, 1]} onValueChange={noop} />,
  <ToggleButton pressed onPressedChange={noop}>
    Bold
  </ToggleButton>,
  <MultiSelect options={[]} value={[]} onChange={noop} />,
  <DatePicker value={null} onChange={noop} />,
  <DateTimePicker value={null} onChange={noop} />,
  <NumberInput value={0} onChange={noop} />,
  <WheelPicker columns={wheelColumns} value={{ hour: '1' }} onChange={noop} />,
  <Checkbox checked onChange={noop} />,
  <Checkbox.Root checked onChange={noop} />,
  <Checkbox.Group value={[]} onChange={noop} />,
  <RadioGroup value="a" onChange={noop}>
    A
  </RadioGroup>,
  <OTPInput value={[]} onChange={noop} />,
  <TimeClock value={null} onChange={noop} />,
  <TimePicker value={null} onChange={noop} />,
];

const validUncontrolledContracts = [
  <RangeSlider defaultValue={[0, 1]} />,
  <ToggleButton defaultPressed>Bold</ToggleButton>,
  <MultiSelect options={[]} defaultValue={[]} />,
  <DatePicker defaultValue={null} />,
  <DateTimePicker defaultValue={null} />,
  <NumberInput defaultValue={0} />,
  <WheelPicker columns={wheelColumns} defaultValue={{ hour: '1' }} />,
  <Checkbox defaultChecked />,
  <Checkbox.Root defaultChecked />,
  <Checkbox.Group defaultValue={[]} />,
  <RadioGroup defaultValue="a">A</RadioGroup>,
  <OTPInput defaultValue={[]} />,
  <TimeClock defaultValue={null} />,
  <TimePicker defaultValue={null} />,
];

// @ts-expect-error Controlled RangeSlider requires its update callback.
const invalidRangeSlider = <RangeSlider value={[0, 1]} />;
// @ts-expect-error Controlled ToggleButton requires its update callback.
const invalidToggleButton = <ToggleButton pressed>Bold</ToggleButton>;
// @ts-expect-error Controlled MultiSelect requires its update callback.
const invalidMultiSelect = <MultiSelect options={[]} value={[]} />;
// @ts-expect-error Controlled DatePicker requires its update callback.
const invalidDatePicker = <DatePicker value={null} />;
// @ts-expect-error Controlled DateTimePicker requires its update callback.
const invalidDateTimePicker = <DateTimePicker value={null} />;
// @ts-expect-error Controlled NumberInput requires its update callback.
const invalidNumberInput = <NumberInput value={0} />;
// @ts-expect-error Controlled WheelPicker requires its update callback.
const invalidWheelPicker = <WheelPicker columns={wheelColumns} value={{ hour: '1' }} />;
// @ts-expect-error Controlled Checkbox requires its update callback.
const invalidCheckbox = <Checkbox checked />;
// @ts-expect-error Controlled Checkbox.Root requires its update callback.
const invalidCheckboxRoot = <Checkbox.Root checked />;
// @ts-expect-error Controlled Checkbox.Group requires its update callback.
const invalidCheckboxGroup = <Checkbox.Group value={[]} />;
// @ts-expect-error Controlled RadioGroup requires its update callback.
const invalidRadioGroup = <RadioGroup value="a">A</RadioGroup>;
// @ts-expect-error Controlled OTPInput requires its update callback.
const invalidOtpInput = <OTPInput value={[]} />;
// @ts-expect-error Controlled TimeClock requires its update callback.
const invalidTimeClock = <TimeClock value={null} />;
// @ts-expect-error Controlled TimePicker requires its update callback.
const invalidTimePicker = <TimePicker value={null} />;

// @ts-expect-error Controlled and uncontrolled sources are mutually exclusive.
const invalidMixedNumberInput = <NumberInput value={0} defaultValue={1} onChange={noop} />;
const invalidMixedMultiSelect = (
  // @ts-expect-error Controlled and uncontrolled sources are mutually exclusive.
  <MultiSelect options={[]} value={[]} defaultValue={[]} onChange={noop} />
);

void validControlledContracts;
void validUncontrolledContracts;
void invalidRangeSlider;
void invalidToggleButton;
void invalidMultiSelect;
void invalidDatePicker;
void invalidDateTimePicker;
void invalidNumberInput;
void invalidWheelPicker;
void invalidCheckbox;
void invalidCheckboxRoot;
void invalidCheckboxGroup;
void invalidRadioGroup;
void invalidOtpInput;
void invalidTimeClock;
void invalidTimePicker;
void invalidMixedNumberInput;
void invalidMixedMultiSelect;
