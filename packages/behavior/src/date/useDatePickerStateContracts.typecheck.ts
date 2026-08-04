import type { UseDatePickerStateOptions } from './useDatePickerState.types';

const options: UseDatePickerStateOptions = {
  defaultValue: null,
  onChange: (date) => {
    date satisfies Date | null;
  },
};

void options;
