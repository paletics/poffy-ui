import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders an svg', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has role="status" and aria-label="Loading"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('allows a custom aria-label', () => {
    render(<Spinner aria-label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving changes');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('applies size as svg attribute', () => {
    const { container } = render(<Spinner size={64} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '64');
  });

  it('does not crash when thickness exceeds size', () => {
    const { container } = render(<Spinner size={10} thickness={20} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with animation="none" without crashing', () => {
    const { container } = render(<Spinner animation="none" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
