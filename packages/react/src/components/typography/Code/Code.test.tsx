import { render, screen } from '@testing-library/react';
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

  it('keeps inline asChild delegation', () => {
    const { container } = render(
      <Code asChild>
        <code>delegated inline code</code>
      </Code>,
    );

    expect(container.querySelectorAll('code')).toHaveLength(1);
    expect(container.querySelector('code')).toHaveTextContent('delegated inline code');
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
    expect(screen.getByRole('group', { name: 'Code block' })).not.toHaveAttribute('tabindex');
  });

  it('preserves an explicit block tabIndex', () => {
    render(
      <Code variant="block" tabIndex={-1}>
        code
      </Code>,
    );
    expect(screen.getByRole('group', { name: 'Code block' })).toHaveAttribute('tabindex', '-1');
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

  it('removes Prism markup when syntax highlighting is disabled', () => {
    const { container, rerender } = render(
      <Code variant="block" language="typescript">
        const x = 1;
      </Code>,
    );

    rerender(<Code variant="block">const x = 1;</Code>);

    expect(container.querySelector('code span')).not.toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('const x = 1;');
  });

  it('falls back to native block markup when block asChild receives a pre/code structure', () => {
    const { container } = render(
      <Code variant="block" asChild={true as never} language="typescript">
        {
          (
            <pre>
              <code>const x = 1;</code>
            </pre>
          ) as never
        }
      </Code>,
    );

    expect(container.querySelectorAll('pre')).toHaveLength(1);
    expect(container.querySelector('pre > code')).toHaveTextContent('const x = 1;');
  });

  it('updates and clears Prism markup for block asChild fallbacks', () => {
    const child = (value: string) => (
      <pre>
        <code>{value}</code>
      </pre>
    );
    const { container, rerender } = render(
      <Code variant="block" asChild={true as never} language="typescript">
        {child('const x = 1;') as never}
      </Code>,
    );

    rerender(
      <Code variant="block" asChild={true as never} language="typescript">
        {child('const y = 2;') as never}
      </Code>,
    );
    expect(container.querySelector('pre > code')).toHaveTextContent('const y = 2;');

    rerender(
      <Code variant="block" asChild={true as never}>
        {child('const y = 2;') as never}
      </Code>,
    );
    expect(container.querySelector('code span')).not.toBeInTheDocument();
  });

  it('uses the default block name for empty accessible labels', () => {
    render(
      <Code variant="block" aria-label="" aria-labelledby=" ">
        code
      </Code>,
    );

    expect(screen.getByRole('group', { name: 'Code block' })).toBeInTheDocument();
  });

  it('keeps the block group role when runtime props conflict', () => {
    render(
      <Code {...({ role: 'button' } as never)} variant="block">
        code
      </Code>,
    );

    expect(screen.getByRole('group', { name: 'Code block' })).toBeInTheDocument();
  });

  it('preserves meaningful roles for inline code', () => {
    render(<Code role="status">code</Code>);

    expect(screen.getByRole('status')).toHaveTextContent('code');
  });
});
