import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { List } from '@/components/data-display/List';
import { Alert } from '@/components/feedback/Alert';
import { InputGroup } from '@/components/inputs/InputGroup';
import { SimpleGrid } from '@/components/layout/SimpleGrid';
import { Card } from '@/components/surfaces/Card';

/**
 * ### Test Strategy: Additional polymorphic refs
 * - **Focus**: Delegated refs resolve to the actual HTML or SVG host.
 * - **DON'T**: Do not assert generated recipe class names or visual layout.
 */
describe('additional polymorphic refs', () => {
  it('forwards container refs to delegated semantic hosts', () => {
    const gridRef = createRef<Element>();
    const cardRef = createRef<Element>();
    const alertRef = createRef<Element>();
    const groupRef = createRef<Element>();

    render(
      <>
        <SimpleGrid asChild ref={gridRef}>
          <ul aria-label="Grid list">
            <li>Grid item</li>
          </ul>
        </SimpleGrid>
        <Card asChild ref={cardRef}>
          <article aria-label="Card article">Card</article>
        </Card>
        <Alert asChild ref={alertRef} live="off">
          <section aria-label="Alert section">Alert</section>
        </Alert>
        <InputGroup asChild ref={groupRef}>
          <section aria-label="Input group">
            <InputGroup.Input aria-label="Query" />
          </section>
        </InputGroup>
      </>,
    );

    expect(gridRef.current).toBe(screen.getByRole('list', { name: 'Grid list' }));
    expect(cardRef.current).toBe(screen.getByRole('article', { name: 'Card article' }));
    expect(alertRef.current).toBe(screen.getByLabelText('Alert section'));
    expect(groupRef.current).toBe(screen.getByLabelText('Input group'));
  });

  it('forwards leaf refs to delegated HTML and SVG hosts', () => {
    const hiddenRef = createRef<Element>();
    const addonRef = createRef<Element>();
    const elementRef = createRef<Element>();
    const iconRef = createRef<Element>();
    const textRef = createRef<Element>();

    render(
      <>
        <VisuallyHidden asChild ref={hiddenRef}>
          <span data-testid="hidden-host">Hidden</span>
        </VisuallyHidden>
        <InputGroup>
          <InputGroup.StartAddon asChild ref={addonRef}>
            <span data-testid="addon-host">https://</span>
          </InputGroup.StartAddon>
          <InputGroup.Input aria-label="Domain" />
          <InputGroup.EndElement asChild ref={elementRef}>
            <span data-testid="element-host">.com</span>
          </InputGroup.EndElement>
        </InputGroup>
        <List>
          <List.Item>
            <List.Icon asChild ref={iconRef} aria-hidden>
              <svg data-testid="icon-host" />
            </List.Icon>
            <List.Text asChild ref={textRef} primary="Primary">
              <span data-testid="text-host" />
            </List.Text>
          </List.Item>
        </List>
      </>,
    );

    expect(hiddenRef.current).toBe(screen.getByTestId('hidden-host'));
    expect(addonRef.current).toBe(screen.getByTestId('addon-host'));
    expect(elementRef.current).toBe(screen.getByTestId('element-host'));
    expect(iconRef.current).toBe(screen.getByTestId('icon-host'));
    expect(textRef.current).toBe(screen.getByTestId('text-host'));
  });

  it('falls invalid addon delegation back to the default div host', () => {
    const ref = createRef<Element>();
    render(
      <InputGroup.StartAddon asChild ref={ref}>
        Prefix
      </InputGroup.StartAddon>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent('Prefix');
  });
});
