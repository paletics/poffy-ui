/**
 * Renders the visual separator between TimePicker fields.
 */
export const TimePickerSeparator = ({
  children,
  className,
}: {
  children: string;
  className: string;
}) => (
  <span aria-hidden="true" className={className}>
    {children}
  </span>
);
