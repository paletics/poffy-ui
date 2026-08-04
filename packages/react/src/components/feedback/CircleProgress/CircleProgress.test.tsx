import { render, screen } from '@testing-library/react';
import { createRef, forwardRef } from 'react';
import type { ComponentType, CSSProperties, HTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { CircleProgress } from './CircleProgress';

const OpaqueProgressHost = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />,
);
OpaqueProgressHost.displayName = 'OpaqueProgressHost';

describe('CircleProgress', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<CircleProgress value={50} aria-label="Upload progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly with default props', () => {
    const { container } = render(<CircleProgress value={0} aria-label="Upload progress" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('displays progress percentage when showValue is true', () => {
    render(<CircleProgress value={50} showValue aria-label="Upload progress" />);
    expect(screen.getByText('50%').tagName).toBe('SPAN');
  });

  it('renders custom children as label', () => {
    render(
      <CircleProgress value={50} showValue aria-label="Upload progress">
        Custom Label
      </CircleProgress>,
    );
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('reduces element labels to safe text descendants', async () => {
    const { container } = render(
      <CircleProgress value={50}>
        <div>
          <button type="button">Uploading</button>
        </div>
      </CircleProgress>,
    );

    const label = screen.getByText('Uploading');
    expect(label.tagName).toBe('SPAN');
    expect(label.querySelector('div, button')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Uploading' })).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('sanitizes nested interactive descendants from a one-shot iterable label', () => {
    function* label() {
      yield (
        <div key="generated">
          <button type="button">Generated upload</button>
        </div>
      );
    }

    render(<CircleProgress value={50}>{label()}</CircleProgress>);

    expect(screen.getByText('Generated upload').tagName).toBe('SPAN');
    expect(screen.queryByRole('button', { name: 'Generated upload' })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CircleProgress value={0} className="test-class" aria-label="Upload progress" />,
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('supports asChild without dropping progress markup', () => {
    const { container } = render(
      <CircleProgress value={50} asChild aria-label="Upload progress">
        <span data-testid="progress-root">Upload</span>
      </CircleProgress>,
    );

    expect(screen.getByTestId('progress-root')).toHaveAttribute('role', 'progressbar');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('forwards a delegated HTMLElement ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <CircleProgress value={50} asChild ref={ref}>
        <output data-testid="progress-output" />
      </CircleProgress>,
    );

    expect(ref.current).toBe(screen.getByTestId('progress-output'));
  });

  it('rejects opaque custom asChild hosts at runtime', () => {
    const RuntimeCircleProgress = CircleProgress as ComponentType<Record<string, unknown>>;
    render(
      <RuntimeCircleProgress value={50} asChild data-testid="progress-fallback">
        <OpaqueProgressHost>Uploading</OpaqueProgressHost>
      </RuntimeCircleProgress>,
    );

    expect(screen.getByTestId('progress-fallback').tagName).toBe('SPAN');
    expect(screen.queryByText('Uploading')).not.toBeInTheDocument();
  });

  it('keeps progress semantics and geometry when an asChild host has conflicting props', () => {
    render(
      <CircleProgress value={50} asChild aria-label="Upload progress">
        <span
          data-testid="progress-root"
          role="button"
          {...{ 'aria-valuenow': 999 }}
          style={{ '--circle-offset': '999px' } as CSSProperties}
        >
          Upload
        </span>
      </CircleProgress>,
    );

    const progress = screen.getByTestId('progress-root');
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-label', 'Upload progress');
    expect(progress).not.toHaveStyle({ '--circle-offset': '999px' });
    expect(screen.getByText('Upload').tagName).toBe('SPAN');
  });

  it('keeps asChild labels and progress semantics safe when props conflict', async () => {
    const { container } = render(
      <CircleProgress value={50} asChild>
        <span data-testid="progress-root" aria-hidden inert>
          <button type="button">Uploading</button>
        </span>
      </CircleProgress>,
    );

    const progress = screen.getByTestId('progress-root');
    expect(progress).toHaveAttribute('aria-hidden', 'false');
    expect(progress).not.toHaveAttribute('inert');
    expect(progress.querySelector('button')).toBeNull();
    expect(screen.getByText('Uploading').tagName).toBe('SPAN');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the default progressbar visible when caller isolation props conflict', () => {
    render(<CircleProgress value={50} aria-hidden inert />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-hidden', 'false');
    expect(progress).not.toHaveAttribute('inert');
  });

  it('falls back to a span and removes unsafe asChild descendants', () => {
    render(
      <>
        <CircleProgress value={50} asChild data-testid="void-progress">
          <img alt="Progress" />
        </CircleProgress>
        <CircleProgress value={50} asChild data-testid="interactive-progress">
          <button>Cancel</button>
        </CircleProgress>
      </>,
    );

    expect(screen.getByTestId('void-progress').tagName).toBe('SPAN');
    expect(screen.getByTestId('interactive-progress').tagName).toBe('SPAN');
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('handles size and thickness styles correctly', () => {
    const size = 200;
    const { container } = render(
      <CircleProgress value={0} size={size} aria-label="Upload progress" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ '--circle-size': `${size}px` });
    expect(container.querySelector('svg')).toHaveAttribute('width', `${size}`);
  });

  it('keeps the preferred maximum as SVG geometry and a CSS sizing variable', () => {
    const { container } = render(
      <CircleProgress value={50} size={300} aria-label="Upload progress" />,
    );
    const svg = container.querySelector('svg');

    expect(container.firstElementChild).toHaveStyle({ '--circle-size': '300px' });
    expect(svg).toHaveAttribute('width', '300');
    expect(svg).toHaveAttribute('height', '300');
    expect(svg).toHaveAttribute('viewBox', '0 0 300 300');
  });

  it('renders with animation="none" without crashing', () => {
    const { container } = render(
      <CircleProgress value={50} animation="none" aria-label="Upload progress" />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('clamps value below 0 to 0', () => {
    render(<CircleProgress value={-10} showValue aria-label="Upload progress" />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps value above 100 to 100', () => {
    render(<CircleProgress value={150} showValue aria-label="Upload progress" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the clamped value', () => {
    render(<CircleProgress value={60} aria-label="Upload progress" />);
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '60',
    );
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuemin',
      '0',
    );
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuemax',
      '100',
    );
    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuetext',
      '60%',
    );
  });

  it('supports aria-labelledby and hides the decorative svg from assistive tech', () => {
    const { container } = render(
      <>
        <span id="upload-progress-label">Upload progress</span>
        <CircleProgress value={40} aria-labelledby="upload-progress-label" />
      </>,
    );

    expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('normalizes empty ARIA names and value text to defaults', () => {
    render(<CircleProgress value={40} aria-label=" " aria-labelledby=" " aria-valuetext=" " />);

    const progressbar = screen.getByRole('progressbar', { name: 'Progress' });
    expect(progressbar).toHaveAttribute('aria-valuetext', '40%');
  });

  it('does not crash when thickness exceeds size', () => {
    const { container } = render(
      <CircleProgress value={50} size={10} thickness={20} aria-label="Upload progress" />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('normalizes non-finite values and invalid geometry', () => {
    const { container } = render(
      <CircleProgress
        value={Number.NaN}
        size={Number.POSITIVE_INFINITY}
        thickness={-1}
        showValue
      />,
    );
    const progressbar = screen.getByRole('progressbar', { name: 'Progress' });
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(progressbar).toHaveAttribute('aria-valuetext', '0%');
    expect(container.querySelector('svg')).toHaveAttribute('width', '100');
    expect(container.querySelector('circle')).toHaveAttribute('stroke-width', '8');
  });

  it('preserves extreme finite SVG geometry while keeping computed styles finite', () => {
    const { container } = render(
      <CircleProgress value={50} size={Number.MAX_VALUE} aria-label="Upload progress" />,
    );

    expect(container.querySelector('svg')).toHaveAttribute('width', String(Number.MAX_VALUE));
    expect(container.firstElementChild).not.toHaveStyle({ '--circle-circumference': 'Infinitypx' });
  });

  it('keeps label markup valid in server output', () => {
    const markup = renderToStaticMarkup(
      <CircleProgress value={50} showValue aria-label="Upload progress" />,
    );

    expect(markup).not.toContain('<div');
    expect(markup).toContain('50%');
  });

  it('preserves requested geometry during server rendering', () => {
    const markup = renderToStaticMarkup(
      <CircleProgress value={50} size={300} aria-label="Upload progress" />,
    );

    expect(markup).toContain('width="300"');
    expect(markup).toContain('height="300"');
    expect(markup).toContain('viewBox="0 0 300 300"');
    expect(markup).toContain('--circle-size:300px');
  });

  it('keeps internal geometry variables ahead of caller styles', () => {
    const { container } = render(
      <CircleProgress
        value={50}
        aria-label="Upload progress"
        style={{ '--circle-offset': '999px' } as CSSProperties}
      />,
    );
    expect(container.firstElementChild).not.toHaveStyle({ '--circle-offset': '999px' });
  });

  it('removes transition from root and asChild styles when motion is disabled', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <CircleProgress
          value={50}
          data-testid="root-progress"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <CircleProgress value={50} asChild>
          <span data-testid="child-progress" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </CircleProgress>
      </AnimationProvider>,
    );

    expect(screen.getByTestId('root-progress')).toHaveStyle({ transition: 'none' });
    expect(screen.getByTestId('child-progress')).toHaveStyle({ transition: 'none' });
  });
});
