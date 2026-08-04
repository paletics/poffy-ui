import { createRef } from 'react';
import {
  ActionMotion,
  CollapseTransition,
  IconSwapTransition,
  ListTransition,
  NumberTransition,
  ReorderTransition,
  StaggerTransition,
  TextRevealTransition,
} from '@/components/animations';

declare const dynamicAsChild: boolean;

const defaultDivRef = createRef<HTMLDivElement>();
const defaultSpanRef = createRef<HTMLSpanElement>();
const defaultListRef = createRef<HTMLUListElement>();
const delegatedButtonRef = createRef<HTMLButtonElement>();
const delegatedSvgRef = createRef<SVGSVGElement>();
const delegatedHeadingRef = createRef<HTMLHeadingElement>();
const delegatedOrderedListRef = createRef<HTMLOListElement>();
const dynamicElementRef = createRef<Element>();

<ActionMotion ref={defaultDivRef}>Default div</ActionMotion>;
<IconSwapTransition ref={defaultSpanRef} transitionKey="default">
  Default span
</IconSwapTransition>;
<CollapseTransition isOpen ref={defaultDivRef}>
  Default collapse
</CollapseTransition>;
<NumberTransition ref={defaultSpanRef} from={0} to={1} />;
<ListTransition ref={defaultListRef}>
  <ListTransition.Item>Default list item</ListTransition.Item>
</ListTransition>;

<ActionMotion asChild ref={delegatedButtonRef}>
  <button type="button">Delegated button</button>
</ActionMotion>;

<IconSwapTransition asChild ref={delegatedSvgRef} transitionKey="svg">
  <svg aria-label="Delegated icon" role="img" />
</IconSwapTransition>;

<ActionMotion asChild={dynamicAsChild} ref={dynamicElementRef}>
  <section>Dynamic delegated root</section>
</ActionMotion>;

<ReorderTransition asChild ref={delegatedButtonRef}>
  <button type="button">Reorder root</button>
</ReorderTransition>;

<ReorderTransition.Item asChild ref={delegatedSvgRef}>
  <svg aria-label="Reorder item" role="img" />
</ReorderTransition.Item>;

<StaggerTransition asChild ref={delegatedButtonRef}>
  <button type="button">Stagger root</button>
</StaggerTransition>;

<StaggerTransition.Item asChild ref={delegatedSvgRef}>
  <svg aria-label="Stagger item" role="img" />
</StaggerTransition.Item>;

<TextRevealTransition asChild ref={delegatedHeadingRef}>
  <h1>Delegated heading</h1>
</TextRevealTransition>;

<ListTransition asChild ref={delegatedOrderedListRef}>
  <ol>
    <ListTransition.Item>Ordered item</ListTransition.Item>
  </ol>
</ListTransition>;

<ActionMotion
  onClick={(event) => {
    const host: HTMLDivElement = event.currentTarget;
    void host.align;
  }}
>
  Default div
</ActionMotion>;

<ActionMotion
  asChild
  onClick={(event) => {
    const host: Element = event.currentTarget;
    void host;
    // @ts-expect-error A delegated motion event is not fixed to the default div.
    void event.currentTarget.align;
  }}
>
  <button type="button">Delegated event host</button>
</ActionMotion>;

<ListTransition
  asChild
  onClick={(event) => {
    const host: HTMLUListElement | HTMLOListElement = event.currentTarget;
    void host;
  }}
>
  <ol />
</ListTransition>;

<ActionMotion
  asChild
  onDrag={(_event, info) => {
    const offset: number = info.offset.x;
    void offset;
  }}
>
  <div />
</ActionMotion>;

// @ts-expect-error CollapseTransition requires its controlled open state.
<CollapseTransition />;

// @ts-expect-error NumberTransition requires both numeric endpoints.
<NumberTransition from={0} />;

// @ts-expect-error A non-delegated IconSwapTransition renders a span, not an SVG.
<IconSwapTransition ref={delegatedSvgRef} transitionKey="default-root">
  Default span
</IconSwapTransition>;
