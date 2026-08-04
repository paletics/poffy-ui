import { render, screen } from '@testing-library/react';
import { createRef, forwardRef, Fragment, type HTMLAttributes } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { Spinner } from './Spinner';

const CustomSpinnerHost = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div ref={ref} {...props}>
      Custom
    </div>
  ),
);
CustomSpinnerHost.displayName = 'CustomSpinnerHost';

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

  it('keeps the default status visible when caller isolation props conflict', () => {
    render(<Spinner aria-hidden inert />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-hidden', 'false');
    expect(spinner).not.toHaveAttribute('inert');
  });

  it('supports a component-owned decorative mode', async () => {
    const { container } = render(
      <Spinner
        decorative
        role="alert"
        aria-hidden={false}
        aria-label="Must not be announced"
        aria-live="assertive"
      />,
    );

    const spinner = container.firstElementChild;
    expect(spinner).not.toHaveAttribute('role');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toHaveAttribute('inert');
    expect(spinner).not.toHaveAttribute('aria-label');
    expect(spinner).not.toHaveAttribute('aria-live');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('normalizes empty aria-label values and respects aria-labelledby', () => {
    render(
      <>
        <Spinner aria-label="  " />
        <span id="spinner-label">Saving changes</span>
        <Spinner aria-label="Ignored" aria-labelledby="spinner-label" />
        <Spinner aria-labelledby="  " />
      </>,
    );

    expect(screen.getAllByRole('status', { name: 'Loading' })).toHaveLength(2);
    expect(screen.getByRole('status', { name: 'Saving changes' })).toHaveAttribute(
      'aria-labelledby',
      'spinner-label',
    );
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('applies size as svg attribute', () => {
    const { container } = render(<Spinner size={64} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '64');
  });

  it('keeps the preferred maximum as SVG geometry and a CSS sizing variable', () => {
    const { container } = render(<Spinner size={300} />);
    const svg = container.querySelector('svg');

    expect(container.firstElementChild).toHaveStyle({ '--spinner-size': '300px' });
    expect(svg).toHaveAttribute('width', '300');
    expect(svg).toHaveAttribute('height', '300');
    expect(svg).toHaveAttribute('viewBox', '0 0 300 300');
  });

  it('keeps a visible radius when thickness exceeds size', () => {
    const { container } = render(<Spinner size={10} thickness={20} />);
    const circles = container.querySelectorAll('circle');

    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveAttribute('r', '0.5');
    expect(circles[0]).toHaveAttribute('stroke-width', '9');
  });

  it('preserves tiny positive SVG dimensions', () => {
    const { container } = render(<Spinner size={0.1} thickness={4} />);

    expect(container.querySelector('svg')).toHaveAttribute('width', '0.1');
    expect(Number(container.querySelector('circle')?.getAttribute('r'))).toBeGreaterThanOrEqual(0);
  });

  it('normalizes invalid SVG dimensions', () => {
    const { container } = render(
      <Spinner size={Number.NaN} thickness={Number.POSITIVE_INFINITY} />,
    );
    const svg = container.querySelector('svg');
    const track = container.querySelector('circle');

    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('viewBox', '0 0 40 40');
    expect(track).toHaveAttribute('stroke-width', '4');
  });

  it('preserves extreme finite SVG geometry while keeping computed styles finite', () => {
    const { container } = render(<Spinner size={Number.MAX_VALUE} />);

    expect(container.querySelector('svg')).toHaveAttribute('width', String(Number.MAX_VALUE));
    expect(container.firstElementChild).not.toHaveStyle({ '--circumference': 'Infinitypx' });
  });

  it('falls back to its span root when asChild has no valid element', () => {
    render(
      <>
        <Spinner asChild data-testid="empty-spinner" />
        <Spinner asChild data-testid="fragment-spinner">
          <Fragment>
            <span />
          </Fragment>
        </Spinner>
      </>,
    );

    expect(screen.getByTestId('empty-spinner').tagName).toBe('SPAN');
    expect(screen.getByTestId('fragment-spinner').tagName).toBe('SPAN');
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('falls back from unsafe asChild hosts while preserving their text children', () => {
    render(
      <>
        <Spinner asChild data-testid="void-spinner">
          <img alt="Loading indicator" />
        </Spinner>
        <Spinner asChild data-testid="interactive-spinner">
          <button>Cancel</button>
        </Spinner>
        <Spinner asChild data-testid="custom-spinner">
          <CustomSpinnerHost />
        </Spinner>
      </>,
    );

    expect(screen.getByTestId('void-spinner').tagName).toBe('SPAN');
    expect(screen.getByTestId('interactive-spinner').tagName).toBe('SPAN');
    expect(screen.getByTestId('interactive-spinner')).toHaveTextContent('Cancel');
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.getByTestId('custom-spinner').tagName).toBe('SPAN');
    expect(screen.queryByText('Custom')).not.toBeInTheDocument();
  });

  it('reduces fallback children to safe text descendants', async () => {
    const { container } = render(
      <>
        <Spinner data-testid="default-spinner">
          <div>
            <div>Loading</div>
          </div>
        </Spinner>
        <Spinner asChild data-testid="fallback-spinner">
          <button type="button">
            <div>Cancel</div>
          </button>
        </Spinner>
      </>,
    );

    expect(screen.getByTestId('default-spinner').querySelector('div')).toBeNull();
    expect(screen.getByTestId('fallback-spinner').querySelector('div')).toBeNull();
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('sanitizes nested interactive descendants from a one-shot iterable', () => {
    function* content() {
      yield (
        <div key="generated">
          <button type="button">Generated loading</button>
        </div>
      );
    }

    render(<Spinner>{content()}</Spinner>);

    expect(screen.getByText('Generated loading')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Generated loading' })).not.toBeInTheDocument();
  });

  it('normalizes semantic intent and unknown runtime values', () => {
    render(
      <>
        <Spinner intent="success" />
        <Spinner intent={'unknown' as never} animation={'unknown' as never} />
      </>,
    );

    const roots = screen.getAllByRole('status');
    expect(roots[0]?.className).toContain('variant_success');
    expect(roots[1]?.className).toContain('variant_primary');
    expect(roots[1]?.className).toContain('animation_spin');
  });

  it('forwards an HTMLElement ref when slotted into a wrapper', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Spinner asChild ref={ref}>
        <span data-testid="slotted-spinner" />
      </Spinner>,
    );

    expect(ref.current).toBe(screen.getByTestId('slotted-spinner'));
  });

  it('keeps a safe asChild host accessible', async () => {
    const { container } = render(
      <Spinner asChild aria-label="Saving changes">
        <span data-testid="slotted-spinner" />
      </Spinner>,
    );

    expect(screen.getByTestId('slotted-spinner')).toHaveAttribute('role', 'status');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps status semantics and geometry when an asChild host has conflicting props', () => {
    render(
      <Spinner asChild aria-label="Saving changes">
        <span
          data-testid="slotted-spinner"
          role="img"
          aria-hidden
          inert
          aria-label="Wrong label"
          style={{ '--circumference': '0px', animation: 'none' } as CSSProperties}
        />
      </Spinner>,
    );

    const spinner = screen.getByTestId('slotted-spinner');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Saving changes');
    expect(spinner).toHaveAttribute('aria-hidden', 'false');
    expect(spinner).not.toHaveAttribute('inert');
    expect(spinner).not.toHaveStyle({ '--circumference': '0px' });
  });

  it('makes decorative asChild content inert and removes stale live semantics', () => {
    render(
      <Spinner asChild decorative>
        <div data-testid="decorative-spinner" role="alert" aria-live="assertive">
          <button>Nested control</button>
        </div>
      </Spinner>,
    );

    const spinner = screen.getByTestId('decorative-spinner');
    expect(spinner).not.toHaveAttribute('role');
    expect(spinner).not.toHaveAttribute('aria-live');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toHaveAttribute('inert');
  });

  it('renders with animation="none" without crashing', () => {
    const { container } = render(<Spinner animation="none" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('uses the static fallback when the motion style is none', () => {
    const { container } = render(
      <AnimationProvider global={false} defaultMotionStyle="none">
        <Spinner animation="elastic" />
      </AnimationProvider>,
    );

    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('renders a static indicator during server rendering', () => {
    const markup = renderToString(<Spinner animation="elastic" size={300} />);

    expect(markup).not.toContain('Switched to client rendering');
    expect(markup.match(/<circle/g)).toHaveLength(2);
    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="300"');
    expect(markup).toContain('viewBox="0 0 300 300"');
    expect(markup).toContain('--spinner-size:300px');
  });

  it('removes CSS animation from root and asChild styles when motion is disabled', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <Spinner data-testid="root-spinner" style={{ animation: 'spin 1s linear infinite' }} />
        <Spinner asChild>
          <span data-testid="child-spinner" style={{ animation: 'spin 1s linear infinite' }} />
        </Spinner>
      </AnimationProvider>,
    );

    expect(screen.getByTestId('root-spinner')).toHaveStyle({ animation: 'none' });
    expect(screen.getByTestId('child-spinner')).toHaveStyle({ animation: 'none' });
  });
});
