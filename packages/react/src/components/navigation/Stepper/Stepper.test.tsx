import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { Stepper, Step, StepperAuxiliary, StepperSeparator } from './index';

describe('Stepper', () => {
  it('replays generated steps during StrictMode rendering', () => {
    function* steps() {
      yield <Step key="one" title="Step 1" />;
      yield <Step key="two" title="Step 2" />;
    }

    render(
      <StrictMode>
        <Stepper>{steps()}</Stepper>
      </StrictMode>,
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('renders steps with titles', () => {
    render(
      <Stepper activeStep={0}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('flattens fragment-wrapped steps and assigns each a distinct position', () => {
    render(
      <Stepper activeStep={1}>
        <>
          <Step title="Step 1" />
          <Step title="Step 2" />
        </>
      </Stepper>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Step 2/ })).toHaveAttribute('aria-current', 'step');
  });

  it('keeps provider keys unique across sibling fragments', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <Stepper activeStep={1}>
        <>
          <Step title="Step 1" />
        </>
        <>
          <Step title="Step 2" />
        </>
      </Stepper>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('Each child in a list should have a unique "key" prop'),
    );
    consoleError.mockRestore();
  });

  it('filters non-elements and flattens nested arrays without changing step indexes', () => {
    const first = [<Step key="shared" title="Step 1" />];
    const second = [<Step key="shared" title="Step 2" />];

    const { container } = render(
      <Stepper activeStep={1}>
        ignored
        {first}
        <>{second}</>
        {null}
      </Stepper>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('1');
    expect(buttons[1]).toHaveTextContent('2');
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');
    const items = Array.from(container.querySelector('[data-stepper-layout]')?.children ?? []);
    expect(items[0].querySelector(':scope > [data-state]')).toBeInTheDocument();
    expect(items[1].querySelector(':scope > [data-state]')).not.toBeInTheDocument();
  });

  it('ignores custom components instead of guessing that they render a Step', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const WrappedStep = () => <Step title="Wrapped step" />;

    render(
      <Stepper>
        <WrappedStep />
        <Step title="Direct step" />
      </Stepper>,
    );

    expect(screen.queryByText('Wrapped step')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Direct step/ })).toHaveTextContent('1');
    expect(warning).toHaveBeenCalledWith(
      '[Stepper] Unsupported children were ignored. Use Step, StepperSeparator, or StepperAuxiliary directly.',
    );
    warning.mockRestore();
  });

  it('renders nested valid steps with stable indexes on the server', () => {
    const markup = renderToString(
      <Stepper activeStep={1}>
        <>
          {[<Step key="one" title="Step 1" />]}
          <Step title="Step 2" />
        </>
      </Stepper>,
    );

    expect(markup).toContain('Step 1');
    expect(markup).toContain('Step 2');
    expect(markup).toContain('aria-current="step"');
  });

  it('normalizes an out-of-range active step to the final rendered step', () => {
    render(
      <Stepper activeStep={Number.POSITIVE_INFINITY}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    expect(screen.getByRole('button', { name: /Step 2/ })).toHaveAttribute('aria-current', 'step');
  });

  it('does not expose inert navigation buttons without an onStepChange handler', () => {
    render(
      <Stepper activeStep={0} linear={false}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    expect(screen.getAllByRole('button')).toEqual(
      expect.arrayContaining([expect.objectContaining({ disabled: true })]),
    );
  });

  it('handles step click', () => {
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={0} onStepChange={onStepChange} linear={false}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it('disables the active step because selecting it cannot change the workflow', () => {
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={1} onStepChange={onStepChange}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    const activeStep = screen.getByRole('button', { name: /Step 2/ });
    expect(activeStep).toBeDisabled();
    fireEvent.click(activeStep);
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it('excludes explicit separators and foreign children from logical step indexes', () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step title="Step 1" />
        <StepperSeparator />
        <div>Foreign content</div>
        <Step title="Step 2" />
      </Stepper>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('1');
    expect(buttons[1]).toHaveTextContent('2');
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByText('Foreign content')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"][class*="separator"]')).toHaveLength(1);
  });

  it('preserves explicitly auxiliary content without consuming a step index', () => {
    render(
      <Stepper activeStep={0}>
        <StepperAuxiliary>
          <aside>Workflow help</aside>
        </StepperAuxiliary>
        <Step title="Step 1" />
      </Stepper>,
    );

    expect(screen.getByText('Workflow help')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 1/ })).toHaveAttribute('aria-current', 'step');
  });

  it('suppresses automatic separators in manual separator mode', () => {
    const { container } = render(
      <Stepper separatorMode="manual">
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    expect(container.querySelectorAll('[class*="separator"]')).toHaveLength(0);
  });

  it('attaches a vertical manual separator to its source step', () => {
    const { container } = render(
      <Stepper orientation="vertical">
        <Step title="Step 1" />
        <StepperSeparator completed />
        <Step title="Step 2" />
      </Stepper>,
    );

    const separator = container.querySelector('[data-stepper-separator="manual"]');
    expect(separator).toHaveAttribute('data-state', 'completed');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).toHaveAttribute('data-stepper-separator-placement', 'in-step');
    expect(separator?.parentElement).toHaveAttribute('data-state', 'active');
  });

  it('does not attach a dangling manual separator after the final vertical step', () => {
    const { container } = render(
      <Stepper orientation="vertical">
        <Step title="Step 1" />
        <StepperSeparator />
      </Stepper>,
    );

    expect(container.querySelector('[data-stepper-separator="manual"]')).not.toBeInTheDocument();
  });

  it('colors only connectors from completed steps', () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step title="Step 1" />
        <Step title="Step 2" />
        <Step title="Step 3" />
        <Step title="Step 4" />
      </Stepper>,
    );

    const connectors = Array.from(
      container.querySelectorAll<HTMLElement>('[aria-hidden="true"][class*="separator"]'),
    );
    expect(connectors.map((connector) => connector.dataset.state)).toEqual([
      'completed',
      'inactive',
      'inactive',
    ]);
  });

  it('keeps a connector mounted while its completion state changes', () => {
    const { container, rerender } = render(
      <Stepper activeStep={0}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );
    const connector = container.querySelector<HTMLElement>(
      '[aria-hidden="true"][class*="separator"]',
    );

    expect(connector).toHaveAttribute('data-state', 'inactive');

    rerender(
      <Stepper activeStep={1}>
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    expect(container.querySelector('[aria-hidden="true"][class*="separator"]')).toBe(connector);
    expect(connector).toHaveAttribute('data-state', 'completed');
  });

  it('protects current state from consumer data-state overrides', () => {
    render(
      <Stepper activeStep={0}>
        <Step title="Step 1" data-state="inactive" completed />
      </Stepper>,
    );

    const item = screen.getByRole('button').closest('[data-state]');
    expect(item).toHaveAttribute('data-state', 'active');
    expect(item).toHaveAttribute('data-completed');
  });

  it('prevents click if linear and not reachable', () => {
    const onStepChange = vi.fn();
    render(
      <Stepper activeStep={0} onStepChange={onStepChange} linear={true}>
        <Step title="Step 1" />
        <Step title="Step 2" />
        <Step title="Step 3" />
      </Stepper>,
    );

    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(onStepChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it('marks the active step with aria-current="step"', () => {
    render(
      <Stepper activeStep={1}>
        <Step title="Step 1" />
        <Step title="Step 2" />
        <Step title="Step 3" />
      </Stepper>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toHaveAttribute('aria-current');
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');
    expect(buttons[2]).not.toHaveAttribute('aria-current');
  });

  it('renders every step and connector as completed at the workflow terminal state', () => {
    const { container } = render(
      <Stepper activeStep={1} completed>
        <Step title="Step 1" completed={false} />
        <Step title="Step 2" />
        <Step title="Step 3" />
      </Stepper>,
    );

    const root = screen.getByRole('group');
    expect(root).toHaveAttribute('data-state', 'completed');
    const buttons = screen.getAllByRole('button');
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect(screen.queryByRole('button', { current: 'step' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Completed')).toHaveLength(3);
    expect(buttons.map((button) => button.closest('[data-state]')?.dataset.state)).toEqual([
      'completed',
      'completed',
      'completed',
    ]);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>('[aria-hidden="true"][class*="separator"]'),
      ).map((connector) => connector.dataset.state),
    ).toEqual(['completed', 'completed']);
    expect(container.querySelectorAll('[class*="indicator"][data-state="completed"]')).toHaveLength(
      3,
    );
  });

  it('completes manual connectors when the workflow reaches its terminal state', () => {
    const { container } = render(
      <Stepper completed orientation="vertical">
        <Step title="Step 1" />
        <StepperSeparator completed={false} />
        <Step title="Step 2" />
      </Stepper>,
    );

    expect(container.querySelector('[data-stepper-separator="manual"]')).toHaveAttribute(
      'data-state',
      'completed',
    );
  });

  it('restores the active step state when workflow completion is cleared', () => {
    const { rerender } = render(
      <Stepper activeStep={1} completed>
        <Step title="Step 1" />
        <Step title="Step 2" />
        <Step title="Step 3" />
      </Stepper>,
    );

    rerender(
      <Stepper activeStep={1}>
        <Step title="Step 1" />
        <Step title="Step 2" />
        <Step title="Step 3" />
      </Stepper>,
    );

    expect(screen.getByRole('button', { name: /Step 2/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: /Step 1/ }).closest('[data-state]')).toHaveAttribute(
      'data-state',
      'completed',
    );
  });

  it('restores individual completion overrides when workflow completion is cleared', () => {
    const { rerender } = render(
      <Stepper activeStep={2} completed>
        <Step title="Step 1" completed={false} />
        <Step title="Step 2" completed />
        <Step title="Step 3" />
      </Stepper>,
    );

    rerender(
      <Stepper activeStep={2}>
        <Step title="Step 1" completed={false} />
        <Step title="Step 2" completed />
        <Step title="Step 3" />
      </Stepper>,
    );

    expect(screen.getByRole('button', { name: /Step 1/ }).closest('[data-state]')).toHaveAttribute(
      'data-state',
      'inactive',
    );
    expect(screen.getByRole('button', { name: /Step 2/ }).closest('[data-state]')).toHaveAttribute(
      'data-state',
      'completed',
    );
    expect(screen.getByRole('button', { name: /Step 3/ })).toHaveAttribute('aria-current', 'step');
  });

  it('uses the fallback title once in the aria-label when title is omitted', () => {
    render(
      <Stepper activeStep={0}>
        <Step />
      </Stepper>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Step 1');
  });

  it('localizes the fallback title and completed state when title is omitted or blank', () => {
    const { rerender } = render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Stepper completed>
          <Step />
        </Stepper>
      </LocaleProvider>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'ステップ1, 完了');

    rerender(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Stepper>
          <Step title=" " />
        </Stepper>
      </LocaleProvider>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'ステップ1');
  });

  it('includes terminal completion in the fallback accessible name when title is omitted', () => {
    render(
      <Stepper completed>
        <Step />
      </Stepper>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Step 1, Completed');
  });

  it('respects explicit completed prop override', () => {
    render(
      <Stepper activeStep={0}>
        <Step title="Step 1" completed={true} />
        <Step title="Step 2" />
      </Stepper>,
    );
    const items = screen.getAllByRole('button')[0].closest('[data-state]');
    expect(items).toHaveAttribute('data-state', 'active');
    expect(items).toHaveAttribute('data-completed');
  });

  it('renders vertical orientation', () => {
    const { container } = render(
      <Stepper activeStep={0} orientation="vertical">
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });

  it('renders active step content in vertical orientation', () => {
    render(
      <Stepper activeStep={0} orientation="vertical">
        <Step title="Step 1">
          <div>Step content here</div>
        </Step>
        <Step title="Step 2">
          <div>Hidden content</div>
        </Step>
      </Stepper>,
    );
    expect(screen.getByText('Step content here')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('has correct group role and aria-label', () => {
    render(
      <Stepper
        {...({ role: 'presentation' } as never)}
        activeStep={0}
        aria-label="Checkout process"
      >
        <Step title="Step 1" />
      </Stepper>,
    );
    expect(screen.getByRole('group', { name: 'Checkout process' })).toBeInTheDocument();
  });

  it('keeps the public root as the constrained container and the visual layout as its child', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stepper
        ref={ref}
        className="consumer-width"
        style={{ width: '20rem' }}
        aria-label="Constrained progress"
      >
        <Step title="Step 1" />
        <Step title="Step 2" />
      </Stepper>,
    );

    const root = screen.getByRole('group', { name: 'Constrained progress' });
    const layout = root.querySelector('[data-stepper-layout]');
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('consumer-width');
    expect(root).toHaveStyle({ width: '20rem' });
    expect(layout?.parentElement).toBe(root);
    expect(layout).toHaveClass('poffy-stepper__root');
  });

  it('applies public appearance and intent classes', () => {
    const { container } = render(
      <Stepper activeStep={0} appearance="outline" intent="success">
        <Step title="Step 1" />
      </Stepper>,
    );
    const root = container.querySelector('[role="group"]');
    expect(root).toHaveClass('poffy-stepper__root--appearance_outline');
    expect(root).toHaveClass('poffy-stepper__root--intent_success');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Stepper activeStep={1}>
        <Step title="Step 1" description="First step" />
        <Step title="Step 2" description="Second step" />
        <Step title="Step 3" description="Third step" />
      </Stepper>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
