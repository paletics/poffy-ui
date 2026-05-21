import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Box } from './Box';

describe('Box Component', () => {
  it('renders children correctly', () => {
    render(<Box>Box Content</Box>);
    expect(screen.getByText('Box Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<Box>Content</Box>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as a custom element', () => {
    const { container } = render(
      <Box asChild>
        <span>Span Content</span>
      </Box>,
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('applies base recipe class', () => {
    const { container } = render(<Box>Content</Box>);
    expect(container.firstChild).toHaveClass(/box/);
  });

  it('applies Panda CSS style props', () => {
    const { container } = render(
      <Box p="4" bg="blue.400">
        Content
      </Box>,
    );
    expect(container.firstChild).toHaveClass(/box/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Box>Content</Box>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
