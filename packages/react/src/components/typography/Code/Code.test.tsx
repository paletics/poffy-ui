import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Code } from './Code';

describe('Code', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Code>const x = 5;</Code>);
    expect(getByText('const x = 5;')).toBeInTheDocument();
  });

  it('renders as inline code by default', () => {
    const { container } = render(<Code>code</Code>);
    const element = container.querySelector('code');
    expect(element).toBeInTheDocument();
  });

  it('applies code class for inline variant', () => {
    const { container } = render(<Code variant="inline">code</Code>);
    const element = container.querySelector('code');
    expect(element).toHaveClass('poffy-code__code');
    expect(element?.parentElement).not.toHaveClass('poffy-code__root');
  });

  it('renders as block code with pre wrapper', () => {
    const { container } = render(<Code variant="block">code</Code>);
    const pre = container.querySelector('pre');
    const code = container.querySelector('code');
    expect(pre).toBeInTheDocument();
    expect(code).toBeInTheDocument();
  });

  it('applies block variant classes', () => {
    const { container } = render(<Code variant="block">code</Code>);
    const pre = container.querySelector('pre');
    const code = container.querySelector('code');
    expect(pre).toHaveClass('poffy-code__root');
    expect(code).toHaveClass('poffy-code__code');
  });

  it('forwards ref to <code> element for inline variant', () => {
    const ref = { current: null };
    render(<Code ref={ref}>code</Code>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect((ref.current as HTMLElement)?.tagName).toBe('CODE');
  });

  it('forwards ref to <code> element for block variant', () => {
    const ref = { current: null };
    render(
      <Code variant="block" ref={ref}>
        code
      </Code>,
    );
    expect((ref.current as HTMLElement)?.tagName).toBe('CODE');
  });

  it('merges className for inline variant', () => {
    const { container } = render(<Code className="custom-class">code</Code>);
    const code = container.querySelector('code');
    expect(code).toHaveClass('custom-class');
  });

  it('passes through HTML attributes', () => {
    const { container } = render(
      <Code data-testid="test-id" id="custom-id">
        code
      </Code>,
    );
    const code = container.querySelector('code');
    expect(code).toHaveAttribute('data-testid', 'test-id');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Code>inline code</Code>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations (block)', async () => {
    const { container } = render(<Code variant="block">block code</Code>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Syntax highlighting', () => {
  it('applies language class when language is specified', () => {
    const { container } = render(
      <Code variant="block" language="typescript">
        const x = 1;
      </Code>,
    );
    const code = container.querySelector('code');
    expect(code).toHaveClass('language-typescript');
  });
});
