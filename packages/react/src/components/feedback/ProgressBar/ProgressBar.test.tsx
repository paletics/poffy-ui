import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<ProgressBar progressPercent={50} aria-label="Upload progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly with default props', () => {
    render(<ProgressBar />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays progress percentage when showProgress is true', () => {
    render(<ProgressBar progressPercent={50} showProgress />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders custom children as label', () => {
    render(<ProgressBar showProgress>Loading...</ProgressBar>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('handles size and thickness styles correctly', () => {
    const size = 200;
    const thickness = 20;
    render(<ProgressBar size={size} thickness={thickness} />);
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveStyle({ '--progress-width': `${size}px` });
    expect(container).toHaveStyle({ '--progress-height': `${thickness}px` });
  });

  it('renders with no animation when animationType is false', () => {
    render(<ProgressBar animationType={false} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('delegates the root element when using asChild', () => {
    render(
      <ProgressBar
        asChild
        progressPercent={50}
        data-testid="polymorphic-test"
        aria-label="Upload progress"
      >
        <section />
      </ProgressBar>,
    );
    const root = screen.getByTestId('polymorphic-test');
    expect(root.tagName).toBe('SECTION');
    expect(root).toContainElement(screen.getByRole('progressbar', { name: 'Upload progress' }));
  });

  it('renders as span by default (no as prop)', () => {
    const { container } = render(
      <ProgressBar progressPercent={50} data-testid="default-element" />,
    );
    expect(container.querySelector('span[data-testid="default-element"]')).toBeInTheDocument();
  });

  it('supports progress animation type', () => {
    render(<ProgressBar animationType="progress" progressPercent={75} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports load animation type', () => {
    render(<ProgressBar animationType="load" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('omits aria-valuenow when animationType is load', () => {
    render(<ProgressBar animationType="load" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('sets aria-valuenow when animationType is progress', () => {
    render(<ProgressBar animationType="progress" progressPercent={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('clamps progress below 0 to 0', () => {
    render(<ProgressBar progressPercent={-10} showProgress />);
    const progressbar = screen.getByRole('progressbar');
    const container = progressbar.parentElement;

    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(container).toHaveStyle({ '--progress-bar-width': '0%' });
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps progress above 100 to 100', () => {
    render(<ProgressBar progressPercent={150} showProgress />);
    const progressbar = screen.getByRole('progressbar');
    const container = progressbar.parentElement;

    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(container).toHaveStyle({ '--progress-bar-width': '100%' });
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('works with all semantic variants', () => {
    const { rerender } = render(<ProgressBar variant="primary" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar variant="success" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar variant="danger" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  describe('labelPosition', () => {
    it('renders auto label inside the bar when there is enough filled width', () => {
      render(<ProgressBar progressPercent={50} showProgress thickness={20} />);
      const label = screen.getByText('50%');
      const bar = screen.getByTestId('progress-bar-bar');
      expect(bar).toContainElement(label);
    });

    it('renders label at right by default when thickness < 16', () => {
      render(<ProgressBar progressPercent={50} showProgress thickness={10} />);
      const label = screen.getByText('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('falls back to right when auto does not have enough filled width', () => {
      render(<ProgressBar progressPercent={5} showProgress thickness={20} />);
      const label = screen.getByText('5%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('falls back to right for long auto labels that do not fit inside the filled bar', () => {
      render(
        <ProgressBar progressPercent={40} showProgress thickness={20}>
          Syncing a long task name
        </ProgressBar>,
      );
      const label = screen.getByText('Syncing a long task name');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('forces center position when labelPosition="center"', () => {
      render(
        <ProgressBar progressPercent={50} showProgress thickness={10} labelPosition="center" />,
      );
      const label = screen.getByText('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toContainElement(label);
    });

    it('forces right position when labelPosition="right"', () => {
      render(
        <ProgressBar progressPercent={50} showProgress thickness={20} labelPosition="right" />,
      );
      const label = screen.getByText('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label at top when labelPosition="top"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="top" />);
      const label = screen.getByText('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label at bottom when labelPosition="bottom"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="bottom" />);
      const label = screen.getByText('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label inside the bar when labelPosition="inside"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="inside" />);
      const label = screen.getByText('50%');
      const bar = screen.getByTestId('progress-bar-bar');
      expect(bar).toContainElement(label);
    });
  });
});
