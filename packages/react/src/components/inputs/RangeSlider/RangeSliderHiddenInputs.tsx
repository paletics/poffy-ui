interface RangeSliderHiddenInputsProps {
  className: string;
  form?: string;
  lowerName?: string;
  upperName?: string;
  lowerValue: number;
  upperValue: number;
  disabled?: boolean;
}

export const RangeSliderHiddenInputs = ({
  className,
  form,
  lowerName,
  upperName,
  lowerValue,
  upperValue,
  disabled,
}: RangeSliderHiddenInputsProps) => (
  <>
    {lowerName && (
      <input
        className={className}
        type="hidden"
        form={form}
        name={lowerName}
        value={lowerValue}
        disabled={disabled}
      />
    )}
    {upperName && (
      <input
        className={className}
        type="hidden"
        form={form}
        name={upperName}
        value={upperValue}
        disabled={disabled}
      />
    )}
  </>
);
