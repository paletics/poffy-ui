import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Center } from './Center';

describe('Center Component', () => {
  it('renders children correctly', () => {
    render(<Center>Content</Center>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Center>Content</Center>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies center class', () => {
    const { container } = render(<Center>Centered</Center>);
    expect(container.firstChild).toHaveClass(/center/);
  });

  it('delegates to a valid host and falls back for invalid asChild content', () => {
    const { rerender } = render(<Center asChild><main>Content</main></Center>);
    expect(screen.getByRole('main')).toHaveClass(/center/);
    rerender(<Center asChild>Content</Center>);
    expect(screen.getByText('Content').parentElement?.tagName).toBe('DIV');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Center>Centered</Center>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
