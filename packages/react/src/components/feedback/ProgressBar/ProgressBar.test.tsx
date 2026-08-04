import { act, render, screen, waitFor } from '@testing-library/react';
import { createRef, forwardRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { ProgressBar } from './ProgressBar';

const CustomProgressHost = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  (props, ref) => <div ref={ref} {...props} />,
);
CustomProgressHost.displayName = 'CustomProgressHost';

const FormattedProgressLabel = () => <>Translated progress</>;
const InteractiveProgressLabel = () => <button type="button">Cancel generated upload</button>;

const getVisibleLabel = (text: string) =>
  screen.getAllByText(text).find((element) => element.getAttribute('aria-hidden') !== 'true')!;

describe('ProgressBar', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should pass accessibility compliance', async () => {
    const { container } = render(<ProgressBar progressPercent={50} aria-label="Upload progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly with default props', () => {
    render(<ProgressBar />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('localizes default accessible text from LocaleProvider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <ProgressBar animationType="load" showProgress />
      </LocaleProvider>,
    );
    expect(screen.getByRole('progressbar', { name: '読み込み状況' })).toBeInTheDocument();
    expect(getVisibleLabel('読み込み中')).toBeInTheDocument();
  });

  it('displays progress percentage when showProgress is true', () => {
    render(<ProgressBar progressPercent={50} showProgress />);
    expect(getVisibleLabel('50%')).toBeInTheDocument();
  });

  it('renders the explicit visual label', () => {
    render(<ProgressBar showProgress label="Loading..." />);
    expect(getVisibleLabel('Loading...')).toBeInTheDocument();
  });

  it('reuses a one-shot iterable label for visible content and measurement', () => {
    function* label() {
      yield <strong key="generated">Generated progress</strong>;
    }

    const { container } = render(<ProgressBar showProgress thickness={20} label={label()} />);

    const measurement = container.querySelector('[data-progressbar-label-measurement]');
    expect(getVisibleLabel('Generated progress')).toBeInTheDocument();
    expect(measurement).toHaveTextContent('Generated progress');
    expect(container.querySelectorAll('strong')).toHaveLength(0);
  });

  it('drops opaque label component output that cannot be verified as passive', () => {
    const { container } = render(
      <ProgressBar showProgress thickness={20} label={<FormattedProgressLabel />} />,
    );

    expect(screen.queryByText('Translated progress')).not.toBeInTheDocument();
    expect(container.querySelector('[data-progressbar-label-measurement]')).toBeInTheDocument();
  });

  it('does not render interactive output hidden behind an opaque label component', async () => {
    const { container } = render(
      <ProgressBar
        showProgress
        thickness={20}
        labelPosition="inside"
        label={<InteractiveProgressLabel />}
      />,
    );

    expect(screen.queryByText('Cancel generated upload')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('reduces element label children to safe text descendants', async () => {
    const { container } = render(
      <ProgressBar
        showProgress
        labelPosition="inside"
        label={
          <div>
            <strong>Uploading</strong>
          </div>
        }
      />,
    );

    const label = getVisibleLabel('Uploading');
    expect(label.tagName).toBe('SPAN');
    expect(label.querySelector('div, strong')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('removes interactive elements from progress labels', async () => {
    const { container } = render(
      <ProgressBar
        showProgress
        labelPosition="inside"
        label={<button type="button">Cancel</button>}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
    expect(getVisibleLabel('Cancel')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
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

  it('accepts CSS width strings and falls back for blank strings', () => {
    const { rerender } = render(<ProgressBar size="min(100%, 32rem)" />);
    expect(screen.getByRole('progressbar').parentElement).toHaveStyle({
      '--progress-width': 'min(100%, 32rem)',
    });

    rerender(<ProgressBar size="   " />);
    expect(screen.getByRole('progressbar').parentElement).toHaveStyle({
      '--progress-width': '300px',
    });
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

  it('falls back to a span for unsafe native asChild hosts while preserving custom hosts', () => {
    const customRef = createRef<HTMLElement>();
    render(
      <>
        <ProgressBar asChild data-testid="void-progress">
          <img alt="Progress" />
        </ProgressBar>
        <ProgressBar asChild data-testid="interactive-progress">
          <button>Cancel</button>
        </ProgressBar>
        <ProgressBar asChild data-testid="restricted-progress">
          <table />
        </ProgressBar>
        <ProgressBar ref={customRef} asChild data-testid="custom-progress">
          <CustomProgressHost />
        </ProgressBar>
      </>,
    );

    expect(screen.getByTestId('void-progress').tagName).toBe('SPAN');
    expect(screen.getByTestId('interactive-progress').tagName).toBe('SPAN');
    expect(screen.getByTestId('restricted-progress').tagName).toBe('SPAN');
    expect(screen.getByTestId('custom-progress').tagName).toBe('DIV');
    expect(customRef.current).toBe(screen.getByTestId('custom-progress'));
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
  });

  it('renders as span by default (no as prop)', () => {
    const { container } = render(
      <ProgressBar progressPercent={50} data-testid="default-element" />,
    );
    expect(container.querySelector('span[data-testid="default-element"]')).toBeInTheDocument();
  });

  it('uses a loading label for indeterminate progress without custom content', () => {
    render(<ProgressBar animationType="load" showProgress />);
    expect(getVisibleLabel('Loading')).toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('supports progress animation type', () => {
    render(<ProgressBar animationType="progress" progressPercent={75} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('supports load animation type', () => {
    render(<ProgressBar animationType="load" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('resolves visual progress animation to none when its provider disables motion', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <ProgressBar animationType="load" />
      </AnimationProvider>,
    );

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('data-progressbar-animation', 'none');
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
    expect(progressbar.parentElement).toHaveStyle({ '--progress-bar-width': '70.7%' });
  });

  it('omits aria-valuenow when animationType is load', () => {
    render(<ProgressBar animationType="load" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('sets aria-valuenow when animationType is progress', () => {
    render(<ProgressBar animationType="progress" progressPercent={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '75%');
  });

  it('forwards aria-valuetext to the progressbar instead of its container', () => {
    render(<ProgressBar progressPercent={75} aria-valuetext="3 of 4 files" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 4 files');
    expect(screen.getByRole('progressbar').parentElement).not.toHaveAttribute('aria-valuetext');
  });

  it('drops untyped managed progress semantics from the outer container', () => {
    render(
      <ProgressBar
        {...({
          role: 'progressbar',
          'aria-valuenow': 99,
          'aria-valuemin': -1,
          'aria-valuemax': 200,
        } as never)}
        progressPercent={20}
      />,
    );

    const progressbar = screen.getByRole('progressbar');
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(progressbar).toHaveAttribute('aria-valuenow', '20');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar.parentElement).not.toHaveAttribute('role');
    expect(progressbar.parentElement).not.toHaveAttribute('aria-valuenow');
  });

  it('normalizes empty ARIA names and value text to their defaults', () => {
    render(
      <>
        <ProgressBar aria-label="  " aria-valuetext=" " progressPercent={25} />
        <ProgressBar aria-labelledby=" " animationType="load" />
      </>,
    );

    const [determinate, indeterminate] = screen.getAllByRole('progressbar');
    expect(determinate).toHaveAccessibleName('Progress');
    expect(determinate).toHaveAttribute('aria-valuetext', '25%');
    expect(indeterminate).toHaveAccessibleName('Loading progress');
  });

  it('clamps progress below 0 to 0', () => {
    render(<ProgressBar progressPercent={-10} showProgress />);
    const progressbar = screen.getByRole('progressbar');
    const container = progressbar.parentElement;

    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(container).toHaveStyle({ '--progress-bar-width': '0%' });
    expect(getVisibleLabel('0%')).toBeInTheDocument();
  });

  it('clamps progress above 100 to 100', () => {
    render(<ProgressBar progressPercent={150} showProgress />);
    const progressbar = screen.getByRole('progressbar');
    const container = progressbar.parentElement;

    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(container).toHaveStyle({ '--progress-bar-width': '100%' });
    expect(getVisibleLabel('100%')).toBeInTheDocument();
  });

  it('works with semantic intents including light and dark', () => {
    const { rerender } = render(<ProgressBar intent="primary" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar intent="light" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar intent="dark" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('uses intent and does not forward unsupported runtime variant values', () => {
    const { rerender } = render(<ProgressBar intent="success" progressPercent={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-progressbar-intent', 'success');

    rerender(
      <ProgressBar {...({ intent: 'success', variant: 'ghost', progressPercent: 50 } as never)} />,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-progressbar-intent', 'success');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('variant');
  });

  it('falls back to safe runtime values for invalid enum props', () => {
    render(
      <ProgressBar
        {...({
          animationType: 'unknown',
          appearance: 'unknown',
          borderType: 'unknown',
          labelPosition: 'unknown',
          pattern: 'unknown',
          shape: 'unknown',
          intent: 'unknown',
        } as never)}
      />,
    );

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('data-progressbar-intent', 'primary');
    expect(progressbar).toHaveAttribute('data-progressbar-animation', 'progress');
  });

  it('normalizes invalid numbers before ARIA and style calculations', () => {
    render(
      <ProgressBar
        progressPercent={Number.NaN}
        size={Number.POSITIVE_INFINITY}
        thickness={-1}
        showProgress
      />,
    );
    const progressbar = screen.getByRole('progressbar', { name: 'Progress' });
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(progressbar.parentElement).toHaveStyle({
      '--progress-width': '300px',
      '--progress-height': '10px',
      '--progress-bar-width': '0%',
    });
    expect(getVisibleLabel('0%')).toBeInTheDocument();
  });

  it('does not allow caller style to override computed progress geometry', () => {
    render(
      <ProgressBar
        progressPercent={50}
        style={{ '--progress-bar-width': '999%' } as CSSProperties}
      />,
    );
    expect(screen.getByRole('progressbar').parentElement).not.toHaveStyle({
      '--progress-bar-width': '999%',
    });
  });

  it('does not allow an asChild host style to override computed progress geometry', () => {
    render(
      <ProgressBar asChild progressPercent={50}>
        <section
          data-testid="progress-container"
          style={{ '--progress-bar-width': '999%' } as CSSProperties}
        />
      </ProgressBar>,
    );

    expect(screen.getByTestId('progress-container')).toHaveStyle({ '--progress-bar-width': '50%' });
  });

  it('renders an explicit label inside an asChild host and forwards its ref', () => {
    const hostRef = createRef<HTMLElement>();
    render(
      <ProgressBar ref={hostRef} asChild showProgress label="Uploaded files">
        <section data-testid="labelled-progress-host" />
      </ProgressBar>,
    );

    const host = screen.getByTestId('labelled-progress-host');
    expect(hostRef.current).toBe(host);
    expect(host).toContainElement(getVisibleLabel('Uploaded files'));
  });

  it('keeps a CSS string width managed when using asChild', () => {
    render(
      <ProgressBar asChild size="100%">
        <section
          data-testid="responsive-progress-container"
          style={{ '--progress-width': '999px' } as CSSProperties}
        />
      </ProgressBar>,
    );

    expect(screen.getByTestId('responsive-progress-container')).toHaveStyle({
      '--progress-width': '100%',
    });
  });

  it('keeps fractional ARIA value text aligned with the visual progress value', () => {
    render(<ProgressBar progressPercent={50.5} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50.5');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '50.5%');
  });

  describe('labelPosition', () => {
    it('keeps auto-label observer subscriptions stable across progress updates', () => {
      const resizeObserverConstructed = vi.fn();
      const mutationObserverConstructed = vi.fn();
      class ResizeObserverMock {
        constructor() {
          resizeObserverConstructed();
        }
        disconnect = vi.fn();
        observe = vi.fn();
      }
      class MutationObserverMock {
        constructor() {
          mutationObserverConstructed();
        }
        disconnect = vi.fn();
        observe = vi.fn();
      }
      vi.stubGlobal('ResizeObserver', ResizeObserverMock);
      vi.stubGlobal('MutationObserver', MutationObserverMock);

      const { rerender } = render(<ProgressBar progressPercent={20} showProgress thickness={20} />);
      expect(resizeObserverConstructed).toHaveBeenCalledTimes(1);
      expect(mutationObserverConstructed).toHaveBeenCalledTimes(1);

      rerender(<ProgressBar progressPercent={70} showProgress thickness={20} />);

      expect(resizeObserverConstructed).toHaveBeenCalledTimes(1);
      expect(mutationObserverConstructed).toHaveBeenCalledTimes(1);
    });

    it('starts a CSS-sized auto label at right and corrects it after layout measurement', async () => {
      render(<ProgressBar size="100%" progressPercent={80} showProgress thickness={20} />);
      const progressbar = screen.getByRole('progressbar');
      const label = getVisibleLabel('80%');
      const measurement = progressbar.parentElement!.querySelector<HTMLElement>(
        '[data-progressbar-label-measurement]',
      )!;

      expect(label).toHaveAttribute('data-progressbar-label-position', 'right');

      Object.defineProperties(progressbar, {
        clientWidth: { configurable: true, value: 300 },
        clientHeight: { configurable: true, value: 20 },
      });
      Object.defineProperties(measurement, {
        offsetHeight: { configurable: true, value: 12 },
        offsetWidth: { configurable: true, value: 30 },
      });

      act(() => window.dispatchEvent(new Event('resize')));
      await waitFor(() =>
        expect(label).toHaveAttribute('data-progressbar-label-position', 'inside'),
      );
    });

    it('measures the progressbar itself instead of its outer host', async () => {
      render(<ProgressBar size="100%" progressPercent={80} showProgress thickness={20} />);
      const progressbar = screen.getByRole('progressbar');
      const host = progressbar.parentElement!;
      const label = getVisibleLabel('80%');
      const measurement = host.querySelector<HTMLElement>('[data-progressbar-label-measurement]')!;

      Object.defineProperties(host, {
        clientWidth: { configurable: true, value: 500 },
      });
      Object.defineProperties(progressbar, {
        clientWidth: { configurable: true, value: 300, writable: true },
        clientHeight: { configurable: true, value: 20 },
      });
      Object.defineProperties(measurement, {
        offsetHeight: { configurable: true, value: 12 },
        offsetWidth: { configurable: true, value: 70 },
      });

      act(() => window.dispatchEvent(new Event('resize')));
      await waitFor(() =>
        expect(label).toHaveAttribute('data-progressbar-label-position', 'inside'),
      );

      progressbar.clientWidth = 100;
      act(() => window.dispatchEvent(new Event('resize')));
      await waitFor(() =>
        expect(label).toHaveAttribute('data-progressbar-label-position', 'right'),
      );
    });

    it('does not reuse a measured position after the width input changes', () => {
      const { rerender } = render(
        <ProgressBar size={300} progressPercent={80} showProgress thickness={20} />,
      );
      const progressbar = screen.getByRole('progressbar');
      const label = getVisibleLabel('80%');
      const measurement = progressbar.parentElement!.querySelector<HTMLElement>(
        '[data-progressbar-label-measurement]',
      )!;

      Object.defineProperties(progressbar, {
        clientWidth: { configurable: true, value: 300, writable: true },
        clientHeight: { configurable: true, value: 20 },
      });
      Object.defineProperties(measurement, {
        offsetHeight: { configurable: true, value: 12 },
        offsetWidth: { configurable: true, value: 30 },
      });
      act(() => window.dispatchEvent(new Event('resize')));
      expect(label).toHaveAttribute('data-progressbar-label-position', 'inside');

      progressbar.clientWidth = 0;
      rerender(<ProgressBar size="100%" progressPercent={80} showProgress thickness={20} />);
      expect(getVisibleLabel('80%')).toHaveAttribute('data-progressbar-label-position', 'right');
    });

    it('renders auto label inside the bar when there is enough filled width', () => {
      render(<ProgressBar progressPercent={50} showProgress thickness={20} />);
      const label = getVisibleLabel('50%');
      expect(label).toHaveAttribute('data-progressbar-label-position', 'inside');
    });

    it('renders label at right by default when thickness < 16', () => {
      render(<ProgressBar progressPercent={50} showProgress thickness={10} />);
      const label = getVisibleLabel('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('falls back to right when auto does not have enough filled width', () => {
      render(<ProgressBar progressPercent={5} showProgress thickness={20} />);
      const label = getVisibleLabel('5%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('falls back to right for long auto labels that do not fit inside the filled bar', () => {
      render(
        <ProgressBar
          progressPercent={40}
          showProgress
          thickness={20}
          label="Syncing a long task name"
        />,
      );
      const label = getVisibleLabel('Syncing a long task name');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('forces center position when labelPosition="center"', () => {
      render(
        <ProgressBar progressPercent={50} showProgress thickness={10} labelPosition="center" />,
      );
      const label = getVisibleLabel('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('forces right position when labelPosition="right"', () => {
      render(
        <ProgressBar progressPercent={50} showProgress thickness={20} labelPosition="right" />,
      );
      const label = getVisibleLabel('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label at top when labelPosition="top"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="top" />);
      const label = getVisibleLabel('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label at bottom when labelPosition="bottom"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="bottom" />);
      const label = getVisibleLabel('50%');
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toContainElement(label);
    });

    it('renders label inside the bar when labelPosition="inside"', () => {
      render(<ProgressBar progressPercent={50} showProgress labelPosition="inside" />);
      const label = getVisibleLabel('50%');
      expect(label).toHaveAttribute('data-progressbar-label-position', 'inside');
    });
  });
});
