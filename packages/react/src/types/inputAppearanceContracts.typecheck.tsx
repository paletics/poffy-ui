import { ComboBox } from '@/components/inputs/ComboBox';
import { DatePicker } from '@/components/inputs/DatePicker';
import { DateTimePicker } from '@/components/inputs/DateTimePicker';
import { Input } from '@/components/inputs/Input';
import type { InputProps, InputVariants } from '@/components/inputs/Input';
import { InputGroup } from '@/components/inputs/InputGroup';
import { ListboxSelect } from '@/components/inputs/ListboxSelect';
import { MultiSelect } from '@/components/inputs/MultiSelect';
import { NumberInput } from '@/components/inputs/NumberInput';
import { OTPInput } from '@/components/inputs/OTPInput';
import type { OTPInputVariants } from '@/components/inputs/OTPInput';
import { SearchInput } from '@/components/inputs/SearchInput';
import { Select } from '@/components/inputs/Select';
import type { SelectProps, SelectVariants } from '@/components/inputs/Select';
import type { TextareaVariants } from '@/components/inputs/Textarea';
import type { DatePickerVariants } from '@/components/inputs/DatePicker';
import type { MultiSelectVariants } from '@/components/inputs/MultiSelect';
import type { ComboBoxVariants } from '@/components/inputs/ComboBox';
import type { ListboxSelectVariants } from '@/components/inputs/ListboxSelect';
import { Textarea } from '@/components/inputs/Textarea';
import { TimePicker } from '@/components/inputs/TimePicker';

const standardAppearance: NonNullable<InputProps['appearance']> = {
  base: 'outline',
  md: ['soft', null, 'flushed'],
};
const neoAppearance: NonNullable<SelectProps['appearance']> = {
  base: 'neo',
  md: ['soft', null, 'flushed'],
};

<Input appearance={standardAppearance} />;
<Textarea appearance={standardAppearance} />;
<DatePicker appearance={standardAppearance} />;
<NumberInput appearance={standardAppearance} />;
<TimePicker appearance={standardAppearance} />;
<DateTimePicker appearance={standardAppearance} />;
<SearchInput appearance={standardAppearance} />;
<InputGroup>
  <InputGroup.Input appearance={standardAppearance} />
</InputGroup>;

<Select appearance={neoAppearance} />;
<MultiSelect options={[]} appearance={neoAppearance} />;
<ComboBox.Root options={[]} appearance={neoAppearance}>
  <ComboBox.Input />
</ComboBox.Root>;
<ListboxSelect appearance={neoAppearance}>
  <option value="one">One</option>
</ListboxSelect>;

// @ts-expect-error Input recipe variants are no longer a public input-family API.
<Input variant="filled" />;
// @ts-expect-error Textarea recipe variants are no longer public.
<Textarea variant="filled" />;
// @ts-expect-error Composite date/time fields use appearance only.
<DatePicker variant="filled" />;
// @ts-expect-error Composite date/time fields use appearance only.
<DateTimePicker variant="filled" />;
// @ts-expect-error NumberInput uses appearance only.
<NumberInput variant="filled" />;
// @ts-expect-error TimePicker uses appearance only.
<TimePicker variant="filled" />;
// @ts-expect-error Native Select uses appearance only.
<Select variant="neo" />;
// @ts-expect-error MultiSelect uses appearance only.
<MultiSelect options={[]} variant="neo" />;
// @ts-expect-error ComboBox uses appearance only.
<ComboBox.Root options={[]} variant="neo" />;
// @ts-expect-error ListboxSelect uses appearance only.
<ListboxSelect variant="neo" />;
// @ts-expect-error SearchInput inherits the removed Input variant contract.
<SearchInput variant="filled" />;
// @ts-expect-error InputGroup.Input inherits the removed Input variant contract.
<InputGroup.Input variant="filled" />;

// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badInputVariants: InputVariants = { variant: 'filled' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badTextareaVariants: TextareaVariants = { variant: 'filled' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badDatePickerVariants: DatePickerVariants = { variant: 'filled' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badSelectVariants: SelectVariants = { variant: 'neo' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badMultiSelectVariants: MultiSelectVariants = { variant: 'neo' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badComboBoxVariants: ComboBoxVariants = { variant: 'neo' };
// @ts-expect-error Exported wrapper types expose appearance, not the removed recipe axis.
const badListboxSelectVariants: ListboxSelectVariants = { variant: 'neo' };
// @ts-expect-error OTPInput wrapper variants expose canonical scalar appearance.
const badOtpInputVariants: OTPInputVariants = { appearance: { base: 'outline' } };
const otpInputVariants: OTPInputVariants = { appearance: 'outline', size: 'md' };
<OTPInput {...otpInputVariants} aria-label="Verification code" />;

void [
  badInputVariants,
  badTextareaVariants,
  badDatePickerVariants,
  badSelectVariants,
  badMultiSelectVariants,
  badComboBoxVariants,
  badListboxSelectVariants,
  badOtpInputVariants,
  otpInputVariants,
];
