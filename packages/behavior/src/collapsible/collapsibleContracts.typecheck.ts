import type {
  ControlledUseCollapsibleStateProps,
  UncontrolledUseCollapsibleStateProps,
  UseCollapsibleStateProps,
} from './useCollapsibleState.types';

const controlled = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledUseCollapsibleStateProps;

const uncontrolled = {
  defaultOpen: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies UncontrolledUseCollapsibleStateProps;

// @ts-expect-error Controlled state requires an update callback.
const unpairedOpen: UseCollapsibleStateProps = { open: true };

// @ts-expect-error Controlled state cannot also receive an uncontrolled initial value.
const conflictingInitialState: UseCollapsibleStateProps = {
  open: true,
  onOpenChange: () => undefined,
  defaultOpen: false,
};

void [controlled, uncontrolled, unpairedOpen, conflictingInitialState];
