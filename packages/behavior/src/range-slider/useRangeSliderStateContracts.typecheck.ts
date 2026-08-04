import type { UseRangeSliderStateOptions } from './useRangeSliderState.types';

const options: UseRangeSliderStateOptions = {
  defaultValue: [10, 90],
  onValueChange: (value, thumb) => {
    value satisfies [number, number];
    thumb satisfies 'lower' | 'upper';
  },
};

void options;
