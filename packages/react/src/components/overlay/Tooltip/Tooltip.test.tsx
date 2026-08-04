import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createRef, type KeyboardEvent } from 'react';
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
      <Tooltip content="Tooltip content" open={true} onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-theme', 'light');
  });

  it('treats untyped open with a non-function callback as an uncontrolled initial state', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Tooltip
        {...({
          content: 'Tooltip content',
          open: true,
          onOpenChange: 'not-a-function',
        } as never)}
      >
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    warning.mockRestore();
  });

  it('associates the default element trigger with its tooltip', () => {
    render(
      <Tooltip content="Tooltip content" open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip');
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('preserves existing trigger descriptions when adding the tooltip ID', () => {
    render(
      <>
        <span id="field-help">Field help</span>
        <Tooltip content="Tooltip content" open onOpenChange={() => undefined}>
          <button aria-describedby="field-help">Trigger</button>
        </Tooltip>
      </>,
    );

    const tooltip = screen.getByRole('tooltip');
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-describedby',
      `field-help ${tooltip.id}`,
    );
  });

  it('keeps the default trigger wrapper ref while associating its child', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip ref={ref} content="Tooltip content" open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toContainElement(screen.getByRole('button'));
  });

  it('forwards an asChild ref to the trigger element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Tooltip ref={ref} asChild content="Tooltip content" open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('forwards an asChild ref to an SVG trigger element', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Tooltip ref={ref} asChild content="Tooltip content" open onOpenChange={() => undefined}>
        <svg role="img" aria-label="Trigger" tabIndex={0} />
      </Tooltip>,
    );

    expect(ref.current).toBe(screen.getByRole('img', { name: 'Trigger' }));
  });

  it('hides content when controlled open is false', () => {
    render(
      <Tooltip content="Tooltip content" open={false} onOpenChange={() => undefined}>
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

  it('keeps the tooltip open when its trigger key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip
        content="Cancelable tip"
        open
        onOpenChange={onOpenChange}
        onKeyDown={(event) => event.preventDefault()}
      >
        <button>Trigger</button>
      </Tooltip>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Trigger' }), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
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

  it('closes an open uncontrolled tooltip when it becomes disabled', async () => {
    const { rerender } = render(
      <Tooltip content="Tooltip content" delay={0}>
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button');
    await userEvent.hover(trigger);
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    rerender(
      <Tooltip content="Tooltip content" delay={0} disabled>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not render a trigger wrapper when virtualRef is provided', () => {
    const ref = createRef<HTMLElement>();
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
      <Tooltip
        ref={ref}
        content="Virtual tip"
        virtualRef={virtualRef}
        open={true}
        onOpenChange={() => undefined}
      >
        <button>Should not render</button>
      </Tooltip>,
    );

    expect(container.querySelector('button')).not.toBeInTheDocument();
    expect(ref.current).toBeNull();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('removes interactive content from the tooltip surface', () => {
    render(
      <Tooltip
        content={
          <div>
            <button>Retry</button>
            <a href="/help">Help</a>
            <div role="button" tabIndex={0}>
              More help
            </div>
          </div>
        }
        open
        onOpenChange={() => undefined}
      >
        <button>Trigger</button>
      </Tooltip>,
    );

    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('RetryHelpMore help');
    expect(tip.querySelector('button, a, [role="button"], [tabindex="0"]')).toBeNull();
  });

  it('sanitizes interactive descendants from a one-shot iterable', () => {
    function* content() {
      yield (
        <div key="generated">
          <button>Generated retry</button>
        </div>
      );
    }

    render(
      <Tooltip content={content()} open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Generated retry');
    expect(tip.querySelector('button')).toBeNull();
  });

  it('keeps long supplemental text on a non-tabbable tooltip surface', () => {
    const longHint = 'A-long-supplemental-hint-that-must-wrap-without-becoming-scrollable';
    render(
      <Tooltip content={longHint} open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );

    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent(longHint);
    expect(tip).toHaveAttribute('tabindex', '-1');
  });

  it('scrolls constrained content from the focused trigger', () => {
    render(
      <Tooltip content="Long tooltip content" open onOpenChange={() => undefined}>
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const tip = screen.getByRole('tooltip');
    Object.defineProperties(tip, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 400 },
    });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'PageDown' });
    expect(tip.scrollTop).toBe(80);
    expect(trigger).toHaveFocus();

    fireEvent.keyDown(trigger, { key: 'End' });
    expect(tip.scrollTop).toBe(300);
    expect(trigger).toHaveFocus();

    fireEvent.keyDown(trigger, { key: 'PageUp' });
    expect(tip.scrollTop).toBe(220);

    fireEvent.keyDown(trigger, { key: 'Home' });
    expect(tip.scrollTop).toBe(0);
  });

  it('allows the consumer to cancel trigger-driven tooltip scrolling', () => {
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLElement>) => event.preventDefault());
    render(
      <Tooltip
        content="Long tooltip content"
        open
        onOpenChange={() => undefined}
        onKeyDown={onKeyDown}
      >
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const tip = screen.getByRole('tooltip');
    Object.defineProperties(tip, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 400 },
    });

    fireEvent.keyDown(trigger, { key: 'PageDown' });

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(tip.scrollTop).toBe(0);
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Tooltip content="Helpful tip" open={true} onOpenChange={() => undefined}>
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
