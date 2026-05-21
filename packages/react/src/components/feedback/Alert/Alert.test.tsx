/**

 * ### Test Strategy
 * - **Focus**: Comprehensive verification for Alert functionality and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '.';

describe('Alert', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Desc</AlertDescription>
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly', () => {
    render(
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Desc</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders correct icon for Status', () => {
    render(
      <Alert status="error">
        <AlertIcon />
      </Alert>,
    );
    expect(screen.getByRole('alert').querySelector('svg')).toBeInTheDocument();
  });

  it('renders close button and calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(<Alert status="info" onClose={onClose} />);
    screen.getByRole('button').click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports asChild with a close button', () => {
    const onClose = vi.fn();
    render(
      <Alert asChild status="info" onClose={onClose}>
        <section>Custom alert</section>
      </Alert>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Custom alert');
    screen.getByRole('button').click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
