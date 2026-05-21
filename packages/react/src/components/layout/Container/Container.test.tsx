import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Container } from './Container';

describe('Container Component', () => {
  it('renders children correctly', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies container class', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toHaveClass(/container/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Container>Content</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
