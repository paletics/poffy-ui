import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  type ControlledMultipleAccordionProps,
  type ControlledSingleAccordionProps,
  type UncontrolledMultipleAccordionProps,
  type UncontrolledSingleAccordionProps,
} from '@/components/surfaces/Accordion';
import {
  MessageModal,
  type ControlledMessageModalProps,
  type UncontrolledMessageModalProps,
} from '@/components/overlay/Modal';
import { createRef, type ComponentProps } from 'react';

const controlledSingle = {
  children: null,
  value: 'one',
  onChange: (_value: string | null) => undefined,
} satisfies ControlledSingleAccordionProps;
const uncontrolledSingle = {
  children: null,
  defaultValue: 'one',
} satisfies UncontrolledSingleAccordionProps;
const controlledMultiple = {
  children: null,
  multiple: true,
  value: ['one'],
  onChange: (_value: string[]) => undefined,
} satisfies ControlledMultipleAccordionProps;
const uncontrolledMultiple = {
  children: null,
  multiple: true,
  defaultValue: ['one'],
} satisfies UncontrolledMultipleAccordionProps;

<Accordion {...controlledSingle} />;
<Accordion {...uncontrolledSingle} />;
<Accordion {...controlledMultiple} />;
<Accordion {...uncontrolledMultiple} />;
// @ts-expect-error Controlled single Accordion requires onChange.
<Accordion value="one">{null}</Accordion>;
// @ts-expect-error Controlled multiple Accordion requires onChange.
<Accordion multiple value={['one']}>
  {null}
</Accordion>;
// @ts-expect-error Controlled Accordion cannot also receive defaultValue.
<Accordion value="one" defaultValue="two" onChange={() => undefined}>
  {null}
</Accordion>;

const rootRef = createRef<Element>();
const itemRef = createRef<Element>();
<Accordion asChild ref={rootRef}>
  <section />
</Accordion>;
<AccordionItem asChild ref={itemRef} value="one">
  <article />
</AccordionItem>;

// @ts-expect-error AccordionTrigger owns its native button type.
<AccordionTrigger type="submit">Open</AccordionTrigger>;
const triggerExpanded = {
  // @ts-expect-error AccordionTrigger derives expanded state from its root.
  'aria-expanded': true,
} satisfies ComponentProps<typeof AccordionTrigger>;

const controlledMessage = {
  open: true,
  onOpenChange: (_open: boolean) => undefined,
} satisfies ControlledMessageModalProps;
const uncontrolledMessage = {
  defaultOpen: true,
} satisfies UncontrolledMessageModalProps;
<MessageModal {...controlledMessage} />;
<MessageModal {...uncontrolledMessage} />;
// @ts-expect-error Controlled MessageModal requires onOpenChange.
<MessageModal open />;
// @ts-expect-error Controlled MessageModal cannot also receive defaultOpen.
<MessageModal open defaultOpen onOpenChange={() => undefined} />;

void triggerExpanded;
