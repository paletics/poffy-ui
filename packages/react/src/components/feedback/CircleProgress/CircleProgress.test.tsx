import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { CircleProgress } from './CircleProgress';

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
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders custom children as label', () => {
    render(
      <CircleProgress value={50} showValue aria-label="Upload progress">
        Custom Label
      </CircleProgress>,
    );
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
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

  it('handles size and thickness styles correctly', () => {
    const size = 200;
    const { container } = render(
      <CircleProgress value={0} size={size} aria-label="Upload progress" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ '--circle-size': `${size}px` });
    expect(container.querySelector('svg')).toHaveAttribute('width', `${size}`);
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

  it('does not crash when thickness exceeds size', () => {
    const { container } = render(
      <CircleProgress value={50} size={10} thickness={20} aria-label="Upload progress" />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
