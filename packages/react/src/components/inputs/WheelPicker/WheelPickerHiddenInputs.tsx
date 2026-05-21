import type { WheelPickerValueFormat } from './WheelPicker.types';

interface WheelPickerHiddenInputsProps {
  name: string;
  form?: string;
  disabled: boolean;
  selectedValue: Record<string, string>;
  valueFormat: WheelPickerValueFormat;
}

/**
 * Renders hidden form inputs for the current WheelPicker selection.
 */
export const WheelPickerHiddenInputs = ({
  name,
  form,
  disabled,
  selectedValue,
  valueFormat,
}: WheelPickerHiddenInputsProps) => {
  if (valueFormat === 'entries') {
    return (
      <>
        {Object.entries(selectedValue).map(([key, value]) => (
          <input
            key={key}
            type="hidden"
            name={`${name}[${key}]`}
            value={value}
            form={form}
            disabled={disabled}
            readOnly
          />
        ))}
      </>
    );
  }

  const value =
    typeof valueFormat === 'function' ? valueFormat(selectedValue) : JSON.stringify(selectedValue);

  return <input type="hidden" name={name} value={value} form={form} disabled={disabled} readOnly />;
};
