import { createRef, type ComponentProps } from 'react';
import { AspectRatio } from '@/components/layout/AspectRatio';
import { Box } from '@/components/layout/Box';
import { Center } from '@/components/layout/Center';
import { Container } from '@/components/layout/Container';
import { Flex } from '@/components/layout/Flex';
import { Grid } from '@/components/layout/Grid';
import { EmptyStateIcon } from '@/components/feedback/EmptyState';
import { HStack } from '@/components/layout/HStack';
import { Stack } from '@/components/layout/Stack';
import { VStack } from '@/components/layout/VStack';
import { Wrap } from '@/components/layout/Wrap';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';

const divRef = createRef<HTMLDivElement>();
const elementRef = createRef<HTMLElement>();
const svgRef = createRef<SVGSVGElement>();

const componentPropsContracts = [
  { children: 'Box' } satisfies ComponentProps<typeof Box>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Box>,
  { children: 'Flex' } satisfies ComponentProps<typeof Flex>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Flex>,
  { children: 'Center' } satisfies ComponentProps<typeof Center>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Center>,
  { children: 'Container' } satisfies ComponentProps<typeof Container>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Container>,
  { children: 'Grid' } satisfies ComponentProps<typeof Grid>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Grid>,
  { children: 'Wrap' } satisfies ComponentProps<typeof Wrap>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Wrap>,
  { children: 'AspectRatio' } satisfies ComponentProps<typeof AspectRatio>,
  {
    asChild: true,
    children: <svg />,
    ref: svgRef,
  } satisfies ComponentProps<typeof AspectRatio>,
  { children: 'Heading' } satisfies ComponentProps<typeof Heading>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Heading>,
  { children: 'Text' } satisfies ComponentProps<typeof Text>,
  { asChild: true, children: <svg />, ref: svgRef } satisfies ComponentProps<typeof Text>,
];

<Stack ref={divRef}>Stack</Stack>;
<Stack asChild ref={elementRef}>
  <nav />
</Stack>;
<Stack asChild ref={svgRef}>
  <svg />
</Stack>;
<HStack gap="sm">Horizontal</HStack>;
<HStack asChild ref={elementRef}>
  <nav />
</HStack>;
<VStack gap="sm">Vertical</VStack>;
<VStack asChild ref={elementRef}>
  <main />
</VStack>;
// @ts-expect-error HStack owns its horizontal direction.
<HStack direction="column">Horizontal</HStack>;
// @ts-expect-error VStack owns its vertical direction, including responsive values.
<VStack direction={{ base: 'row', md: 'column' }}>Vertical</VStack>;

<EmptyStateIcon ref={divRef}>Decorative</EmptyStateIcon>;
<EmptyStateIcon asChild ref={svgRef}>
  <svg />
</EmptyStateIcon>;
<EmptyStateIcon decorative={false} aria-label="Empty folder">
  Icon
</EmptyStateIcon>;
<EmptyStateIcon asChild decorative={false} aria-labelledby="empty-icon-label" ref={svgRef}>
  <svg />
</EmptyStateIcon>;
// @ts-expect-error The default icon branch forwards a div ref.
<EmptyStateIcon ref={svgRef}>Decorative</EmptyStateIcon>;
// @ts-expect-error The delegated SVG branch forwards an SVG ref.
<EmptyStateIcon asChild ref={divRef}>
  <svg />
</EmptyStateIcon>;
// @ts-expect-error Meaningful icons require an accessible name.
<EmptyStateIcon decorative={false}>Meaningful</EmptyStateIcon>;
// @ts-expect-error Decorative icons cannot expose an accessible name.
<EmptyStateIcon aria-label="Decorative">Decorative</EmptyStateIcon>;
// @ts-expect-error Icon slots are presentation-only; actions belong in EmptyStateActions.
<EmptyStateIcon onClick={() => undefined}>Decorative</EmptyStateIcon>;
// @ts-expect-error Icon slots cannot enter the tab order.
<EmptyStateIcon tabIndex={0}>Decorative</EmptyStateIcon>;
// @ts-expect-error Icon slots cannot request focus.
<EmptyStateIcon autoFocus>Decorative</EmptyStateIcon>;
void [divRef, elementRef, svgRef, componentPropsContracts];
