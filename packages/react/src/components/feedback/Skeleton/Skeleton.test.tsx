import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders as a span by default', () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.tagName).toBe('SPAN');
    expect(el).toBeInTheDocument();
  });

  it('sets aria-hidden to true', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className', () => {
    render(<Skeleton data-testid="skeleton" className="custom-class" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
  });

  it('maps numeric width and height to CSS variables', () => {
    render(<Skeleton data-testid="skeleton" width={100} height={50} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ '--skeleton-width': '100px', '--skeleton-height': '50px' });
  });

  it('maps string width and height to CSS variables', () => {
    render(<Skeleton data-testid="skeleton" width="10rem" height="5rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ '--skeleton-width': '10rem', '--skeleton-height': '5rem' });
  });

  it('defaults circle height to width when height is omitted', () => {
    render(<Skeleton data-testid="skeleton" shape="circle" width="40px" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ '--skeleton-width': '40px', '--skeleton-height': '40px' });
  });

  it('uses explicit height for circle when both width and height are provided', () => {
    render(<Skeleton data-testid="skeleton" shape="circle" width="40px" height="60px" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ '--skeleton-width': '40px', '--skeleton-height': '60px' });
  });

  it('renders with different shapes without throwing', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" shape="circle" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    rerender(<Skeleton data-testid="skeleton" shape="rect" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('supports legacy semantic tint aliases without throwing', () => {
    const variants = [
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'danger',
      'light',
      'dark',
    ] as const;
    const { rerender } = render(<Skeleton data-testid="skeleton" variant="primary" />);
    for (const variant of variants) {
      rerender(<Skeleton data-testid="skeleton" variant={variant} />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    }
  });

  it('renders with different animations without throwing', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" animation="shimmer" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    rerender(<Skeleton data-testid="skeleton" animation="none" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  describe('asChild', () => {
    it('renders the child element instead of span', () => {
      render(
        <Skeleton asChild>
          <div data-testid="skeleton-div" />
        </Skeleton>,
      );
      const el = screen.getByTestId('skeleton-div');
      expect(el.tagName).toBe('DIV');
    });

    it('sets aria-hidden to true on the child element', () => {
      render(
        <Skeleton asChild>
          <div data-testid="skeleton-div" />
        </Skeleton>,
      );
      expect(screen.getByTestId('skeleton-div')).toHaveAttribute('aria-hidden', 'true');
    });

    it('merges skeleton classes onto the child element', () => {
      render(
        <Skeleton asChild className="extra">
          <div data-testid="skeleton-div" />
        </Skeleton>,
      );
      expect(screen.getByTestId('skeleton-div')).toHaveClass('extra');
    });
  });
});
