import { createRef, type ComponentProps } from 'react';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { List } from '@/components/data-display/List';
import { Alert } from '@/components/feedback/Alert';
import { InputGroup } from '@/components/inputs/InputGroup';
import { SimpleGrid } from '@/components/layout/SimpleGrid';
import { Tooltip } from '@/components/overlay/Tooltip';
import { Card } from '@/components/surfaces/Card';
import type {
  ListItemIconAsChildProps,
  ListItemIconComponent,
  ListItemIconDefaultProps,
  ListItemTextAsChildProps,
  ListItemTextComponent,
  ListItemTextDefaultProps,
} from '@/components/data-display';
import type { AlertAsChildProps, AlertComponent, AlertDefaultProps } from '@/components/feedback';
import type {
  TooltipAsChildProps,
  TooltipComponent,
  TooltipDefaultProps,
} from '@/components/overlay';
import type { CardAsChildProps, CardComponent, CardDefaultProps } from '@/components/surfaces';

const divRef = createRef<HTMLDivElement>();
const spanRef = createRef<HTMLSpanElement>();
const elementRef = createRef<Element>();
const htmlElementRef = createRef<HTMLElement>();
const svgRef = createRef<SVGSVGElement>();

const componentPropsContracts = [
  { children: 'Grid' } satisfies ComponentProps<typeof SimpleGrid>,
  {
    asChild: true,
    children: <ul />,
    ref: elementRef,
  } satisfies ComponentProps<typeof SimpleGrid>,
  { children: 'Card' } satisfies ComponentProps<typeof Card>,
  {
    asChild: true,
    children: <article />,
    ref: elementRef,
  } satisfies ComponentProps<typeof Card>,
  { children: 'Alert' } satisfies ComponentProps<typeof Alert>,
  {
    asChild: true,
    children: <section />,
    ref: htmlElementRef,
  } satisfies ComponentProps<typeof Alert>,
  { children: 'Hidden' } satisfies ComponentProps<typeof VisuallyHidden>,
  {
    asChild: true,
    children: <svg />,
    ref: svgRef,
  } satisfies ComponentProps<typeof VisuallyHidden>,
  { children: null } satisfies ComponentProps<typeof InputGroup>,
  {
    asChild: true,
    children: <section />,
    ref: elementRef,
  } satisfies ComponentProps<typeof InputGroup>,
  { children: 'Prefix' } satisfies ComponentProps<typeof InputGroup.StartAddon>,
  {
    asChild: true,
    children: <span />,
    ref: elementRef,
  } satisfies ComponentProps<typeof InputGroup.StartAddon>,
  { children: 'Icon' } satisfies ComponentProps<typeof List.Icon>,
  {
    asChild: true,
    children: <svg />,
    ref: svgRef,
  } satisfies ComponentProps<typeof List.Icon>,
  { primary: 'Primary' } satisfies ComponentProps<typeof List.Text>,
  {
    asChild: true,
    children: <span />,
    ref: elementRef,
  } satisfies ComponentProps<typeof List.Text>,
  { content: 'Tooltip', children: <button type="button">Trigger</button> } satisfies ComponentProps<
    typeof Tooltip
  >,
  {
    asChild: true,
    content: 'Tooltip',
    children: <svg />,
    ref: svgRef,
  } satisfies ComponentProps<typeof Tooltip>,
];

const publicEntrypointBranchContracts = [
  { children: 'Card' } satisfies CardDefaultProps,
  { asChild: true, children: <article /> } satisfies CardAsChildProps,
  { children: 'Alert' } satisfies AlertDefaultProps,
  { asChild: true, children: <section /> } satisfies AlertAsChildProps,
  { children: 'Icon' } satisfies ListItemIconDefaultProps,
  { asChild: true, children: <svg /> } satisfies ListItemIconAsChildProps,
  { primary: 'Primary' } satisfies ListItemTextDefaultProps,
  { asChild: true, children: <span /> } satisfies ListItemTextAsChildProps,
  { content: 'Tooltip' } satisfies TooltipDefaultProps,
  { asChild: true, content: 'Tooltip', children: <svg /> } satisfies TooltipAsChildProps,
];

const publicEntrypointComponentContracts: [
  CardComponent,
  AlertComponent,
  ListItemIconComponent,
  ListItemTextComponent,
  TooltipComponent,
] = [Card, Alert, List.Icon, List.Text, Tooltip];

<SimpleGrid ref={divRef}>Grid</SimpleGrid>;
<Card ref={divRef}>Card</Card>;
<Alert ref={divRef}>Alert</Alert>;
<VisuallyHidden ref={spanRef}>Hidden</VisuallyHidden>;
<InputGroup ref={divRef} />;
<InputGroup.EndElement ref={divRef}>Element</InputGroup.EndElement>;
<InputGroup
  ref={divRef}
  onMouseEnter={(event) => {
    const host: HTMLDivElement = event.currentTarget;
    void host;
  }}
/>;
<InputGroup
  asChild
  ref={elementRef}
  onMouseEnter={(event) => {
    const host: Element = event.currentTarget;
    void host;
    // @ts-expect-error Delegated root events follow the Element ref contract.
    void event.currentTarget.style;
  }}
>
  <section />
</InputGroup>;
<InputGroup.StartAddon
  ref={divRef}
  onMouseEnter={(event) => {
    const host: HTMLDivElement = event.currentTarget;
    void host;
  }}
>
  Prefix
</InputGroup.StartAddon>;
<InputGroup.StartAddon
  asChild
  ref={elementRef}
  onMouseEnter={(event) => {
    const host: Element = event.currentTarget;
    void host;
    // @ts-expect-error Delegated addon events follow the Element ref contract.
    void event.currentTarget.style;
  }}
>
  <span>Prefix</span>
</InputGroup.StartAddon>;
<InputGroup.EndElement
  ref={divRef}
  onMouseEnter={(event) => {
    const host: HTMLDivElement = event.currentTarget;
    void host;
  }}
>
  Element
</InputGroup.EndElement>;
<InputGroup.EndElement
  asChild
  ref={elementRef}
  onMouseEnter={(event) => {
    const host: Element = event.currentTarget;
    void host;
    // @ts-expect-error Delegated element events follow the Element ref contract.
    void event.currentTarget.style;
  }}
>
  <span>Element</span>
</InputGroup.EndElement>;
<List.Icon ref={divRef}>Icon</List.Icon>;
<List.Text ref={divRef}>Text</List.Text>;
<Tooltip ref={divRef} content="Tooltip">
  <button type="button">Trigger</button>
</Tooltip>;
<Tooltip asChild ref={svgRef} content="Tooltip">
  <svg />
</Tooltip>;

// @ts-expect-error The default SimpleGrid host forwards a div ref.
<SimpleGrid ref={svgRef}>Grid</SimpleGrid>;
// @ts-expect-error The default VisuallyHidden host forwards a span ref.
<VisuallyHidden ref={svgRef}>Hidden</VisuallyHidden>;
// @ts-expect-error The default InputGroup addon host forwards a div ref.
<InputGroup.StartAddon ref={svgRef}>Prefix</InputGroup.StartAddon>;
// @ts-expect-error The default List.Icon host forwards a div ref.
<List.Icon ref={svgRef}>Icon</List.Icon>;
// @ts-expect-error The default Tooltip host forwards a div ref.
<Tooltip ref={svgRef} content="Tooltip" />;

void [
  componentPropsContracts,
  publicEntrypointBranchContracts,
  publicEntrypointComponentContracts,
  divRef,
  elementRef,
  htmlElementRef,
  spanRef,
  svgRef,
];
