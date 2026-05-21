import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Reference } from './Reference';
import { ReferenceList } from './ReferenceList';

/**
 * ### Test Strategy: Reference
 * - **Focus**: Link/span rendering, accessible numbered labels, list navigation semantics,
 *   and automated accessibility checks.
 * - **DON'T**: Do not assert generated Panda class names or visual token values.
 */
describe('Reference', () => {
  it('renders a numbered reference as a link', () => {
    render(<Reference index={1} label="Design docs" href="/docs" />);

    expect(screen.getByRole('link', { name: '[1] Design docs' })).toHaveAttribute('href', '/docs');
  });

  it('renders an inert labelled reference without href', () => {
    render(<Reference label="Inline source" />);

    expect(screen.getByText('Inline source')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a labelled reference list', () => {
    render(<ReferenceList references={[{ label: 'API', href: '/api' }]} />);

    expect(screen.getByRole('navigation', { name: 'References' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '[1] API' })).toHaveAttribute('href', '/api');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ReferenceList references={[{ label: 'Docs', href: '/docs', description: 'Guide' }]} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
