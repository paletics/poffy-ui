import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { Skeleton } from './Skeleton';

const RuntimeSkeleton = Skeleton as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

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

  it('does not render children in the default inline placeholder', async () => {
    const { container } = render(
      <Skeleton
        data-testid="skeleton"
        {...({
          children: (
            <>
              <div>Loading layout</div>
              <button type="button">Cancel</button>
            </>
          ),
        } as never)}
      />,
    );

    expect(screen.queryByText('Loading layout')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not allow aria-hidden to be overridden', () => {
    render(<Skeleton data-testid="skeleton" aria-hidden="false" />);
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

  it('omits invalid numeric dimensions', () => {
    render(<Skeleton data-testid="skeleton" width={Number.NaN} height={-1} />);
    expect(screen.getByTestId('skeleton')).not.toHaveStyle({
      '--skeleton-width': 'NaNpx',
      '--skeleton-height': '-1px',
    });
  });

  it('keeps public dimensions ahead of caller CSS variables', () => {
    render(
      <Skeleton
        data-testid="skeleton"
        width={100}
        style={{ '--skeleton-width': '999px' } as CSSProperties}
      />,
    );
    expect(screen.getByTestId('skeleton')).toHaveStyle({ '--skeleton-width': '100px' });
  });

  it('lets the circle aspect ratio derive height when height is omitted', () => {
    render(<Skeleton data-testid="skeleton" shape="circle" width="40px" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ '--skeleton-width': '40px' });
    expect(el.style.getPropertyValue('--skeleton-height')).toBe('');
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

  it('uses visible recipe fallbacks when circle and rect dimensions are omitted', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" shape="circle" />);
    expect(screen.getByTestId('skeleton').className).toContain('shape_circle');

    rerender(<Skeleton data-testid="skeleton" shape="rect" />);
    expect(screen.getByTestId('skeleton').className).toContain('shape_rect');
  });

  it('supports every semantic intent without throwing', () => {
    const intents = [
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'danger',
      'light',
      'dark',
    ] as const;
    const { rerender } = render(<Skeleton data-testid="skeleton" intent="primary" />);
    for (const intent of intents) {
      rerender(<Skeleton data-testid="skeleton" intent={intent} />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    }
  });

  it('renders with different animations without throwing', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" animation="shimmer" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    rerender(<Skeleton data-testid="skeleton" animation="none" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('removes CSS animation from root and asChild styles when motion is disabled', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <Skeleton data-testid="root-skeleton" style={{ animation: 'pulse 1s linear infinite' }} />
        <Skeleton asChild>
          <span data-testid="child-skeleton" style={{ animation: 'pulse 1s linear infinite' }} />
        </Skeleton>
      </AnimationProvider>,
    );

    expect(screen.getByTestId('root-skeleton')).toHaveStyle({ animation: 'none' });
    expect(screen.getByTestId('child-skeleton')).toHaveStyle({ animation: 'none' });
  });

  it('falls back to safe runtime values for invalid enums', () => {
    render(
      <Skeleton
        {...({ animation: 'unknown', intent: 'unknown', shape: 'unknown' } as never)}
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('shape_text');
    expect(skeleton.className).toContain('animation_pulse');
    expect(skeleton.className).toContain('variant_secondary');
  });

  describe('asChild', () => {
    it('does not forward Motion drag callbacks to the raw DOM Slot', () => {
      const onDrag = vi.fn();
      render(
        <Skeleton asChild onDrag={onDrag}>
          <div data-testid="skeleton-div" draggable />
        </Skeleton>,
      );

      fireEvent.drag(screen.getByTestId('skeleton-div'));
      expect(onDrag).not.toHaveBeenCalled();
    });

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

    it('keeps child accessibility isolation when its props conflict', () => {
      render(
        <Skeleton asChild>
          <div data-testid="skeleton-div" aria-hidden={false} inert={false}>
            <button>Loading</button>
          </div>
        </Skeleton>,
      );

      const skeleton = screen.getByTestId('skeleton-div');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).toHaveAttribute('inert');
    });

    it('prevents hidden child controls from receiving focus through the fallback root', () => {
      render(
        <RuntimeSkeleton asChild data-testid="fallback-skeleton">
          <button type="button">Loading</button>
        </RuntimeSkeleton>,
      );
      expect(screen.getByTestId('fallback-skeleton')).toHaveAttribute('inert');
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('falls back to a span for custom and interactive child hosts', () => {
      const CustomSkeletonHost = () => <button>Loading</button>;

      render(
        <>
          <RuntimeSkeleton asChild data-testid="button-skeleton">
            <button>Loading</button>
          </RuntimeSkeleton>
          <RuntimeSkeleton asChild data-testid="custom-skeleton">
            <CustomSkeletonHost />
          </RuntimeSkeleton>
        </>,
      );

      expect(screen.getByTestId('button-skeleton').tagName).toBe('SPAN');
      expect(screen.getByTestId('custom-skeleton').tagName).toBe('SPAN');
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('falls back to a span when asChild does not receive one element', () => {
      render(
        <Skeleton
          {...({ asChild: true, children: 'Loading', 'data-testid': 'fallback-skeleton' } as never)}
        />,
      );
      expect(screen.getByTestId('fallback-skeleton').tagName).toBe('SPAN');
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('merges skeleton classes onto the child element', () => {
      render(
        <Skeleton asChild className="extra">
          <div data-testid="skeleton-div" />
        </Skeleton>,
      );
      expect(screen.getByTestId('skeleton-div')).toHaveClass('extra');
    });

    it('keeps public dimensions ahead of child CSS variables', () => {
      render(
        <Skeleton asChild width={100} height={50}>
          <div
            data-testid="skeleton-div"
            style={
              {
                '--skeleton-width': '999px',
                '--skeleton-height': '999px',
              } as CSSProperties
            }
          />
        </Skeleton>,
      );

      expect(screen.getByTestId('skeleton-div')).toHaveStyle({
        '--skeleton-width': '100px',
        '--skeleton-height': '50px',
      });
    });
  });
});
