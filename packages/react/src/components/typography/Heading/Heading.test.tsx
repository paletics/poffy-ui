import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Heading>Test Heading</Heading>);
    expect(getByText('Test Heading')).toBeInTheDocument();
  });

  it('preserves element children during normal rendering', () => {
    render(
      <Heading level="2">
        <strong>Important heading</strong>
      </Heading>,
    );

    expect(screen.getByText('Important heading').tagName).toBe('STRONG');
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

  it('normalizes invalid runtime levels to h1', () => {
    render(<Heading level={'7' as never}>Content</Heading>);

    expect(screen.getByRole('heading', { level: 1, name: 'Content' })).toBeInTheDocument();
  });

  it('preserves native heading semantics against conflicting props', () => {
    render(
      <Heading level="2" {...({ role: 'presentation', 'aria-level': 6 } as never)}>
        Content
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Content' });
    expect(heading).not.toHaveAttribute('aria-level');
  });

  it('allows semantic overrides when asChild intentionally changes the host', () => {
    render(
      <Heading asChild {...({ role: 'presentation' } as never)}>
        <p>Content</p>
      </Heading>,
    );

    expect(screen.getByText('Content')).toHaveAttribute('role', 'presentation');
  });

  it('falls back to a native heading for void asChild hosts', () => {
    const { container } = render(
      <Heading asChild level="2">
        <img alt="Architecture" />
      </Heading>,
    );

    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('h2 img')).toHaveAttribute('alt', 'Architecture');
  });

  it('does not render empty headings', () => {
    const { container } = render(<Heading>{''}</Heading>);

    expect(container.querySelector('h1')).not.toBeInTheDocument();
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
