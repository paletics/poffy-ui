import { createRef, type ReactElement } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from '@/components/layout/AspectRatio';
import { Box } from '@/components/layout/Box';
import { Center } from '@/components/layout/Center';
import { Container } from '@/components/layout/Container';
import { Flex } from '@/components/layout/Flex';
import { Grid } from '@/components/layout/Grid';
import { Wrap } from '@/components/layout/Wrap';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';

describe('polymorphic asChild ref contracts', () => {
  it('keeps the default host ref while forwarding delegated HTML refs', () => {
    const defaultRef = createRef<HTMLDivElement>();
    const delegatedRef = createRef<Element>();
    const { rerender } = render(<Box ref={defaultRef}>Box</Box>);

    expect(defaultRef.current).toBeInstanceOf(HTMLDivElement);
    rerender(
      <Box asChild ref={delegatedRef}>
        <main>Main</main>
      </Box>,
    );
    expect(delegatedRef.current).toBeInstanceOf(HTMLElement);
    expect(delegatedRef.current?.tagName).toBe('MAIN');
  });

  it.each([
    [
      'Box',
      (ref: React.Ref<Element>) => (
        <Box asChild ref={ref}>
          <svg />
        </Box>
      ),
    ],
    [
      'Flex',
      (ref: React.Ref<Element>) => (
        <Flex asChild ref={ref}>
          <svg />
        </Flex>
      ),
    ],
    [
      'Center',
      (ref: React.Ref<Element>) => (
        <Center asChild ref={ref}>
          <svg />
        </Center>
      ),
    ],
    [
      'Container',
      (ref: React.Ref<Element>) => (
        <Container asChild ref={ref}>
          <svg />
        </Container>
      ),
    ],
    [
      'Grid',
      (ref: React.Ref<Element>) => (
        <Grid asChild ref={ref}>
          <svg />
        </Grid>
      ),
    ],
    [
      'Wrap',
      (ref: React.Ref<Element>) => (
        <Wrap asChild ref={ref}>
          <svg />
        </Wrap>
      ),
    ],
    [
      'AspectRatio',
      (ref: React.Ref<Element>) => (
        <AspectRatio asChild ref={ref}>
          <svg />
        </AspectRatio>
      ),
    ],
    [
      'Heading',
      (ref: React.Ref<Element>) => (
        <Heading asChild ref={ref}>
          <svg />
        </Heading>
      ),
    ],
    [
      'Text',
      (ref: React.Ref<Element>) => (
        <Text asChild ref={ref}>
          <svg />
        </Text>
      ),
    ],
  ] satisfies Array<[string, (ref: React.Ref<Element>) => ReactElement]>)(
    'forwards %s refs to delegated SVG hosts',
    (_name, renderComponent) => {
      const ref = createRef<Element>();
      render(renderComponent(ref));
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    },
  );
});
