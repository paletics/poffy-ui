import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Text } from './Text';

describe('Text', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Text>Test Content</Text>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('preserves element children during normal rendering', () => {
    const { getByRole } = render(
      <Text>
        <a href="/docs">Documentation</a>
      </Text>,
    );

    expect(getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/docs');
  });

  it('renders as paragraph by default', () => {
    const { container } = render(<Text>Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('P');
  });

  it('applies default variants', () => {
    const { container } = render(<Text>Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text');
  });

  it('applies custom variant', () => {
    const { container } = render(<Text variant="body2">Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text--variant_body2');
  });

  it('applies weight variant', () => {
    const { container } = render(<Text weight="bold">Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text--weight_bold');
  });

  it('applies align variant', () => {
    const { container } = render(<Text align="center">Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text--align_center');
  });

  it('applies transform variant', () => {
    const { container } = render(<Text transform="uppercase">Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text--transform_uppercase');
  });

  it('renders as custom element with asChild prop', () => {
    const { container } = render(
      <Text asChild>
        <span>Content</span>
      </Text>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('SPAN');
    expect(element).toHaveClass('poffy-text');
  });

  it('falls back to a paragraph for invalid asChild hosts', () => {
    const { container } = render(
      <Text asChild>
        <>Content</>
      </Text>,
    );

    expect(container.querySelector('p')).toHaveTextContent('Content');
  });

  it('preserves a void asChild host inside the fallback paragraph', () => {
    const { container } = render(
      <Text asChild>
        <img alt="Status" />
      </Text>,
    );

    expect(container.querySelector('p img')).toHaveAttribute('alt', 'Status');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Text ref={ref}>Content</Text>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('merges className prop', () => {
    const { container } = render(<Text className="custom-class">Content</Text>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveClass('poffy-text');
  });

  it('passes through HTML attributes', () => {
    const { container } = render(
      <Text data-testid="test-id" id="custom-id">
        Content
      </Text>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('data-testid', 'test-id');
    expect(element).toHaveAttribute('id', 'custom-id');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Text>Text content</Text>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies multiple variants together', () => {
    const { container } = render(
      <Text variant="caption" weight="bold" align="center" transform="uppercase">
        Content
      </Text>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('poffy-text--variant_caption');
    expect(element).toHaveClass('poffy-text--weight_bold');
    expect(element).toHaveClass('poffy-text--align_center');
    expect(element).toHaveClass('poffy-text--transform_uppercase');
  });
});
