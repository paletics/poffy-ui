import { TimeClock } from '@/components/inputs/TimeClock';
import { TimePicker } from '@/components/inputs/TimePicker';
import {
  Collapsible,
  CollapsibleTrigger,
  type ControlledCollapsibleProps,
  type UncontrolledCollapsibleProps,
} from '@/components/surfaces/Collapsible';
import { createRef, type ComponentProps } from 'react';

const controlled = {
  children: null,
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledCollapsibleProps;
const uncontrolled = {
  children: null,
  defaultOpen: true,
} satisfies UncontrolledCollapsibleProps;

<Collapsible {...controlled} />;
<Collapsible {...uncontrolled} />;
<Collapsible ref={createRef<HTMLDivElement>()}>Default host</Collapsible>;
<Collapsible asChild ref={createRef<Element>()}>
  <section>Delegated host</section>
</Collapsible>;
const collapsibleComponentProps = {
  asChild: true,
  children: <section />,
  ref: createRef<Element>(),
} satisfies ComponentProps<typeof Collapsible>;
<Collapsible>
  <CollapsibleTrigger
    ref={createRef<HTMLButtonElement>()}
    onClick={(event) => void event.currentTarget.form}
  >
    Trigger
  </CollapsibleTrigger>
</Collapsible>;
<Collapsible>
  <CollapsibleTrigger
    asChild
    ref={createRef<HTMLElement>()}
    onClick={(event) => {
      void event.currentTarget.dataset;
      // @ts-expect-error Delegated trigger events target HTMLElement, not HTMLButtonElement.
      void event.currentTarget.form;
    }}
  >
    <div>Trigger</div>
  </CollapsibleTrigger>
</Collapsible>;
// @ts-expect-error Collapsible owns disabled state at the root.
<CollapsibleTrigger disabled>Trigger</CollapsibleTrigger>;
// @ts-expect-error Collapsible owns trigger identity and disclosure relationships.
<CollapsibleTrigger id="custom-trigger">Trigger</CollapsibleTrigger>;
// TypeScript permits unknown hyphenated JSX attributes; runtime strips this owned value.
<CollapsibleTrigger aria-expanded>Trigger</CollapsibleTrigger>;
// @ts-expect-error Controlled Collapsible requires an update callback.
<Collapsible open>Content</Collapsible>;
// @ts-expect-error Controlled Collapsible cannot also receive defaultOpen.
<Collapsible open defaultOpen onOpenChange={() => undefined}>
  Content
</Collapsible>;

const timePickerReadonly = {
  // @ts-expect-error TimePicker derives read-only semantics from readOnly.
  'aria-readonly': true,
} satisfies ComponentProps<typeof TimePicker>;
const timePickerRequired = {
  // @ts-expect-error TimePicker derives required semantics from required.
  'aria-required': true,
} satisfies ComponentProps<typeof TimePicker>;
const timeClockReadonly = {
  // @ts-expect-error TimeClock derives read-only semantics from readOnly.
  'aria-readonly': true,
} satisfies ComponentProps<typeof TimeClock>;
const timeClockRequired = {
  // @ts-expect-error TimeClock derives required semantics from required.
  'aria-required': true,
} satisfies ComponentProps<typeof TimeClock>;

void [
  controlled,
  uncontrolled,
  collapsibleComponentProps,
  timePickerReadonly,
  timePickerRequired,
  timeClockReadonly,
  timeClockRequired,
];
