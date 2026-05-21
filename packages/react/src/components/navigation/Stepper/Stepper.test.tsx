import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Stepper, Step } from './index';

describe('Stepper', () => {
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

  it('does not include undefined in the aria-label when title is omitted', () => {
    render(
      <Stepper activeStep={0}>
        <Step />
      </Stepper>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Step 1: Step 1');
  });

  it('respects explicit completed prop override', () => {
    render(
      <Stepper activeStep={0}>
        <Step title="Step 1" completed={true} />
        <Step title="Step 2" />
      </Stepper>,
    );
    const items = screen.getAllByRole('button')[0].closest('[data-state]');
    expect(items).toHaveAttribute('data-state', 'completed');
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
      <Stepper activeStep={0} aria-label="Checkout process">
        <Step title="Step 1" />
      </Stepper>,
    );
    expect(screen.getByRole('group', { name: 'Checkout process' })).toBeInTheDocument();
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
