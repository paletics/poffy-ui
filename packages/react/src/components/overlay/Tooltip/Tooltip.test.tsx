import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

/**
 * ### Test Strategy: Tooltip
 * - **Focus**: Conditional rendering on hover and focus, controlled/uncontrolled state, and disabled state.
 * - **DON'T**: Do not test CSS animations directly in unit tests.
 */
describe('Tooltip', () => {
  it('shows content when controlled open is true', () => {
    render(
      <Tooltip content="Tooltip content" open={true}>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-theme', 'light');
  });

  it('hides content when controlled open is false', () => {
    render(
      <Tooltip content="Tooltip content" open={false}>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when Floating UI requests a state change in controlled mode', async () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Controlled tip" open={true} onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Tooltip>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('opens on hover after the default delay and closes when the cursor leaves', async () => {
    render(
      <Tooltip content="Hover tip" delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.hover(screen.getByRole('button'));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await userEvent.unhover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus and closes on blur', async () => {
    render(
      <Tooltip content="Focus tip">
        <button>Trigger</button>
      </Tooltip>,
    );

    await act(async () => {
      screen.getByRole('button').focus();
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button').blur();
    });
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('does not open on hover when disabled', async () => {
    render(
      <Tooltip content="Disabled tip" disabled delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByRole('button'));
    await act(async () => undefined);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not open on focus when disabled', async () => {
    render(
      <Tooltip content="Disabled tip" disabled>
        <button>Trigger</button>
      </Tooltip>,
    );

    await act(async () => {
      screen.getByRole('button').focus();
    });
    await act(async () => undefined);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not render a trigger wrapper when virtualRef is provided', () => {
    const virtualRef = {
      getBoundingClientRect: () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }),
    };

    const { container } = render(
      <Tooltip content="Virtual tip" virtualRef={virtualRef} open={true}>
        <button>Should not render</button>
      </Tooltip>,
    );

    expect(container.querySelector('button')).not.toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Tooltip content="Helpful tip" open={true}>
        <button>Trigger</button>
      </Tooltip>,
    );
    // FloatingPortal renders into document.body outside any landmark element.
    // The `region` rule is inapplicable for tooltip portals, so it is disabled here.
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
