import type { UseListboxSelectStateOptions } from './useListboxSelectState.types';

const uncontrolled: UseListboxSelectStateOptions = {
  defaultValue: 'first',
  options: [{ label: 'First', value: 'first' }],
};

const controlled: UseListboxSelectStateOptions = {
  defaultValue: '',
  options: [{ label: 'First', value: 'first' }],
  value: 'first',
};

void controlled;
void uncontrolled;
