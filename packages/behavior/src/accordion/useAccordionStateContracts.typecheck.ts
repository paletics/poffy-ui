import type {
  ControlledMultipleUseAccordionStateProps,
  ControlledSingleUseAccordionStateProps,
  UncontrolledMultipleUseAccordionStateProps,
  UncontrolledSingleUseAccordionStateProps,
  UseAccordionStateProps,
} from './useAccordionState.types';

const controlledSingle = {
  value: 'one',
  onChange: (_value: string | null) => undefined,
} satisfies ControlledSingleUseAccordionStateProps;
const uncontrolledSingle = {
  defaultValue: 'one',
} satisfies UncontrolledSingleUseAccordionStateProps;
const controlledMultiple = {
  multiple: true,
  value: ['one'],
  onChange: (_value: string[]) => undefined,
} satisfies ControlledMultipleUseAccordionStateProps;
const uncontrolledMultiple = {
  multiple: true,
  defaultValue: ['one'],
} satisfies UncontrolledMultipleUseAccordionStateProps;

// @ts-expect-error A controlled single accordion requires its update callback.
const unpairedSingle = { value: 'one' } satisfies UseAccordionStateProps;
// @ts-expect-error A controlled multiple accordion requires its update callback.
const unpairedMultiple = { multiple: true, value: ['one'] } satisfies UseAccordionStateProps;
// @ts-expect-error Controlled state cannot also receive an uncontrolled default.
const conflictingSingle: UseAccordionStateProps = {
  value: 'one',
  defaultValue: 'two',
  onChange: (_value: string | null) => undefined,
};
// @ts-expect-error Multiple mode uses arrays for its value.
const scalarMultiple: UseAccordionStateProps = {
  multiple: true,
  value: 'one',
  onChange: (_value: string[]) => undefined,
};

void [
  controlledSingle,
  uncontrolledSingle,
  controlledMultiple,
  uncontrolledMultiple,
  unpairedSingle,
  unpairedMultiple,
  conflictingSingle,
  scalarMultiple,
];
