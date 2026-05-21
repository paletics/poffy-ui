import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { SimpleGrid } from './SimpleGrid';

describe('SimpleGrid Component', () => {
  it('renders children correctly', () => {
    render(<SimpleGrid>Content</SimpleGrid>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div by default', () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies simple-grid class', () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(container.firstChild).toHaveClass('poffy-simple-grid');
  });

  it('handles minChildWidth via style', () => {
    const { container } = render(<SimpleGrid minChildWidth="200px">Content</SimpleGrid>);
    const style = container.firstChild as HTMLElement;
    expect(style.getAttribute('style')).toContain('--min-child-width');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<SimpleGrid>Content</SimpleGrid>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
