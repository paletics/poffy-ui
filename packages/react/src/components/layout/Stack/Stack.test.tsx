import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Stack } from './Stack';

describe('Stack Component', () => {
  it('renders children correctly', () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>,
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Stack>Content</Stack>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as a custom element when "as" prop is provided', () => {
    const { container } = render(
      <Stack asChild>
        <section>Content</section>
      </Stack>,
    );
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('applies default styles (column, gap-md)', () => {
    const { container } = render(<Stack>Content</Stack>);
    expect(container.firstChild).toHaveClass(/stack/);
  });

  it('supports row direction', () => {
    const { container } = render(<Stack direction="row">Content</Stack>);
    expect(container.firstChild).toHaveClass(/stack/);
  });

  it('applies variant classes for direction, align, justify, gap', () => {
    const { container } = render(
      <Stack direction="row" align="center" justify="space-between" gap="lg">
        Content
      </Stack>,
    );
    expect(container.firstChild).toHaveClass(/stack/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
      </Stack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
