import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './SkipLink';

/**
 * ### Test Strategy: SkipLink
 * - **Focus**: Native fragment-link contract, accessible naming, and a complete host landmark document.
 * - **DON'T**: Do not test routing or focus transfer; those remain host responsibilities.
 */
describe('SkipLink', () => {
  it('renders a named fragment link', () => {
    render(<SkipLink href="#main-content">Skip to main content</SkipLink>);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('accepts host-provided classes and refs', () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(<SkipLink ref={ref} className="host-class" href="#main-content">Skip</SkipLink>);
    expect(ref.current).toHaveClass('host-class');
  });

  it('has no accessibility violations in a complete host document', async () => {
    const { container } = render(
      <>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <nav aria-label="Primary navigation">Navigation</nav>
        <main id="main-content" tabIndex={-1}>Main content</main>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
