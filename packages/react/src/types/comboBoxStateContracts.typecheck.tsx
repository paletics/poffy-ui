import { ComboBox } from '@/components/inputs/ComboBox';
import type { ComboBoxProps } from '@/components/inputs/ComboBox';

const options = [{ label: 'One', value: 'one' }];

const uncontrolledComboBox = <ComboBox options={options} defaultValue="one" />;
const controlledComboBox = <ComboBox options={options} value="one" onChange={() => undefined} />;
const independentlyControlledInput = (
  <ComboBox options={options} inputValue="o" onInputValueChange={() => undefined} />
);

// @ts-expect-error Controlled selection requires an update callback.
const selectionWithoutCallback = <ComboBox options={options} value="one" />;
// @ts-expect-error Controlled selection cannot also receive an uncontrolled default.
const mixedSelectionState: ComboBoxProps = {
  options,
  value: 'one',
  onChange: () => undefined,
  defaultValue: 'one',
};
// @ts-expect-error Controlled filter text requires an update callback.
const inputValueWithoutCallback = <ComboBox options={options} inputValue="o" />;
// @ts-expect-error Controlled filter text cannot also receive an uncontrolled default.
const mixedInputState: ComboBoxProps = {
  options,
  inputValue: 'o',
  onInputValueChange: () => undefined,
  defaultInputValue: '',
};

void [
  uncontrolledComboBox,
  controlledComboBox,
  independentlyControlledInput,
  selectionWithoutCallback,
  mixedSelectionState,
  inputValueWithoutCallback,
  mixedInputState,
];
