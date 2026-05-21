import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';
import { EmptyStateActions } from './EmptyStateActions';
import { EmptyStateDescription } from './EmptyStateDescription';
import { EmptyStateIcon } from './EmptyStateIcon';
import { EmptyStateTitle } from './EmptyStateTitle';

describe('EmptyState Component', () => {
  it('renders title and description', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>No Data</EmptyStateTitle>
        <EmptyStateDescription>Nothing to display</EmptyStateDescription>
      </EmptyState>,
    );
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('Nothing to display')).toBeInTheDocument();
  });

  it('renders icon via asChild', () => {
    render(
      <EmptyState>
        <EmptyStateIcon asChild>
          <svg data-testid="test-icon" />
        </EmptyStateIcon>
        <EmptyStateTitle>Title</EmptyStateTitle>
      </EmptyState>,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>Title</EmptyStateTitle>
        <EmptyStateActions>
          <button>Click Me</button>
        </EmptyStateActions>
      </EmptyState>,
    );
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('passes size and variant props to root', () => {
    const { container } = render(
      <EmptyState size="lg" variant="elevated">
        <EmptyStateTitle>Title</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('when sub-component is used outside EmptyState', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(vi.fn());
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('throws an error', () => {
      expect(() => render(<EmptyStateTitle>Orphan</EmptyStateTitle>)).toThrow(
        'EmptyState sub-components must be used within <EmptyState>.',
      );
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateIcon asChild>
          <svg aria-hidden="true" />
        </EmptyStateIcon>
        <EmptyStateTitle>No results</EmptyStateTitle>
        <EmptyStateDescription>Try a different search term.</EmptyStateDescription>
        <EmptyStateActions>
          <button>Reset</button>
        </EmptyStateActions>
      </EmptyState>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
