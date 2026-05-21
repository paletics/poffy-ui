import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Heading>Test Heading</Heading>);
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders as h1 by default', () => {
    const { container } = render(<Heading>Content</Heading>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('H1');
  });

  it('renders correct heading level', () => {
    const { container: container2 } = render(<Heading level="2">H2</Heading>);
    expect((container2.firstChild as HTMLElement).tagName).toBe('H2');

    const { container: container3 } = render(<Heading level="3">H3</Heading>);
    expect((container3.firstChild as HTMLElement).tagName).toBe('H3');
  });

  it('applies heading class and level variants', () => {
    const { container } = render(<Heading level="2">Content</Heading>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-heading');
    expect(element).toHaveClass('poffy-heading--level_2');
  });

  it('applies weight variant', () => {
    const { container } = render(<Heading weight="bold">Content</Heading>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-heading--weight_bold');
  });

  it('renders as custom element with asChild prop', () => {
    const { container } = render(
      <Heading asChild level="2">
        <p>Content</p>
      </Heading>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass('poffy-heading');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Heading ref={ref}>Content</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Heading>Heading</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports all heading levels', () => {
    (['1', '2', '3', '4', '5', '6'] as const).forEach((level) => {
      const { container } = render(<Heading level={level}>H{level}</Heading>);
      const element = container.firstChild as HTMLElement;
      expect(element.tagName).toBe(`H${level}`);
      expect(element).toHaveClass(`poffy-heading--level_${level}`);
    });
  });
});
