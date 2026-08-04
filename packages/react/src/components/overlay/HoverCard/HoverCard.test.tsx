import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, type ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardTitle,
  HoverCardTrigger,
} from './index';

const TestHoverCard = ({ defaultOpen = true }: { defaultOpen?: boolean }) => (
  <HoverCard defaultOpen={defaultOpen} openDelay={0} closeDelay={0}>
    <HoverCardTrigger>Profile</HoverCardTrigger>
    <HoverCardContent>
      <HoverCardTitle>Ada Lovelace</HoverCardTitle>
      <HoverCardDescription>Mathematician and computing pioneer.</HoverCardDescription>
    </HoverCardContent>
  </HoverCard>
);

/**
 * ### Test Strategy: HoverCard
 * - **Focus**: hover/focus interactions, controlled state, disabled behavior,
 *   trigger composition, dialog semantics, and accessibility compliance.
 * - **DON'T**: Do not assert animation timing or computed Floating UI styles.
 */
describe('HoverCard', () => {
  it('renders controlled open content with dialog semantics', () => {
    render(<TestHoverCard />);

    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    const trigger = screen.getByRole('button', { name: 'Profile' });
    const description = screen.getByText('Mathematician and computing pioneer.');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
    expect(dialog).toHaveAttribute('data-brand', 'blue');
    expect(dialog).toHaveAttribute('data-theme', 'light');
  });

  it('retains the latest controlled open state when becoming uncontrolled', () => {
    const { rerender } = render(
      <HoverCard open onOpenChange={() => undefined} openDelay={0} closeDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    rerender(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('links nested title and description parts on the first render', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <div>
            <HoverCardTitle>Ada Lovelace</HoverCardTitle>
            <HoverCardDescription>Mathematician and computing pioneer.</HoverCardDescription>
          </div>
        </HoverCardContent>
      </HoverCard>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    expect(dialog).toHaveAttribute('aria-labelledby', screen.getByRole('heading').id);
    expect(dialog).toHaveAttribute(
      'aria-describedby',
      screen.getByText('Mathematician and computing pioneer.').id,
    );
  });

  it('does not render dangling title or description references when optional parts are omitted', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent aria-label="Profile preview">Plain preview</HoverCardContent>
      </HoverCard>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Profile preview' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('falls back to an accessible name when no title or label is supplied', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>Plain preview</HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Hover card' })).toBeInTheDocument();
  });

  it('prefers an explicit label to an automatically linked title', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent aria-label="Profile preview">
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Profile preview' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('does not use a nested hover card title as its own accessible name', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCard defaultOpen>
            <HoverCardTrigger>More</HoverCardTrigger>
            <HoverCardContent>
              <HoverCardTitle>Nested details</HoverCardTitle>
            </HoverCardContent>
          </HoverCard>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Hover card' })).not.toHaveAttribute(
      'aria-labelledby',
    );
    expect(screen.getByRole('dialog', { name: 'Nested details' })).toBeInTheDocument();
  });

  it('opens on hover and closes after unhover', async () => {
    render(<TestHoverCard defaultOpen={false} />);

    const trigger = screen.getByRole('button', { name: 'Profile' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.hover(trigger);
    expect(await screen.findByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();

    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opens on focus and closes on blur', async () => {
    render(<TestHoverCard defaultOpen={false} />);

    const trigger = screen.getByRole('button', { name: 'Profile' });
    await act(async () => trigger.focus());
    expect(await screen.findByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();

    await act(async () => trigger.blur());
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('does not leave focus guards mounted while managed content is closed', () => {
    render(
      <HoverCard open={false} onOpenChange={() => undefined}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent focusManagement>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('calls onOpenChange in controlled mode without mutating content', async () => {
    const onOpenChange = vi.fn();
    render(
      <HoverCard open={false} onOpenChange={onOpenChange} openDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    await userEvent.hover(screen.getByRole('button', { name: 'Profile' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates internal state and calls onOpenChange in uncontrolled mode', async () => {
    const onOpenChange = vi.fn();
    render(
      <HoverCard onOpenChange={onOpenChange} openDelay={0} closeDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    await userEvent.hover(screen.getByRole('button', { name: 'Profile' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(await screen.findByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(
      <HoverCard disabled openDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByRole('button', { name: 'Profile' });
    await userEvent.hover(trigger);
    await act(async () => trigger.focus());

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ignores legacy trigger-level disabled without leaking it to a delegated host', async () => {
    const legacyProps = {
      disabled: true,
    } as unknown as ComponentProps<typeof HoverCardTrigger>;
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild {...legacyProps}>
          <span tabIndex={0}>Profile</span>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByText('Profile');
    expect(trigger).not.toHaveAttribute('disabled');
    await userEvent.hover(trigger);
    expect(await screen.findByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('hides controlled content while disabled', () => {
    render(
      <HoverCard disabled open onOpenChange={() => undefined}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('supports asChild trigger composition', async () => {
    const childFocus = vi.fn();
    const childRef = vi.fn();
    const triggerRef = createRef<HTMLElement>();

    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger ref={triggerRef} asChild>
          <a
            href="/profile"
            ref={childRef}
            className="consumer-trigger"
            onFocus={childFocus}
            aria-controls="custom-card"
            aria-expanded={false}
            aria-haspopup="menu"
            data-state="custom"
          >
            Profile
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByRole('link', { name: 'Profile' });
    fireEvent.focus(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Ada Lovelace' });
    expect(childFocus).toHaveBeenCalledTimes(1);
    expect(childRef).toHaveBeenCalledWith(trigger);
    expect(triggerRef.current).toBe(trigger);
    expect(trigger).toHaveClass('consumer-trigger');
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  });

  it('falls back to a native trigger when asChild does not receive one reference host', () => {
    render(
      <HoverCard>
        <HoverCardTrigger asChild aria-label="Profile preview">
          <>
            <span>Profile</span>
            <span>details</span>
          </>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByRole('button', { name: 'Profile preview' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger.querySelector('span')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Profiledetails');
  });

  it('keeps a void asChild reference host and opens it on focus', async () => {
    const ref = createRef<HTMLElement>();
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild ref={ref}>
          <input aria-label="Profile reference" />
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    const trigger = screen.getByRole('textbox', { name: 'Profile reference' });
    expect(ref.current).toBe(trigger);
    trigger.focus();
    expect(await screen.findByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const onOpenChange = vi.fn();
    render(
      <HoverCard open onOpenChange={onOpenChange}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the hover card open when its content key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <HoverCard open onOpenChange={onOpenChange}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent onKeyDown={(event) => event.preventDefault()}>
          <HoverCardTitle>Cancelable profile</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('supports asChild composition for title and description', () => {
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle asChild ref={titleRef} className="title-class">
            <h2>Ada Lovelace</h2>
          </HoverCardTitle>
          <HoverCardDescription asChild className="description-class">
            <div>Mathematician</div>
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>,
    );

    const title = screen.getByRole('heading', { name: 'Ada Lovelace' });
    const description = screen.getByText('Mathematician');
    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    expect(title.tagName).toBe('H2');
    expect(title).toHaveClass('title-class');
    expect(titleRef.current).toBe(title);
    expect(description.tagName).toBe('DIV');
    expect(description).toHaveClass('description-class');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('keeps registered title and description ids on delegated hosts', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle asChild id="ignored-title">
            <h2 id="stale-title">Ada Lovelace</h2>
          </HoverCardTitle>
          <HoverCardDescription asChild id="ignored-description">
            <div id="stale-description">Mathematician</div>
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    const title = screen.getByRole('heading', { name: 'Ada Lovelace' });
    const description = screen.getByText('Mathematician');
    expect(title.id).toBe('ignored-title');
    expect(title.id).not.toBe('stale-title');
    expect(description.id).toBe('ignored-description');
    expect(description.id).not.toBe('stale-description');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
    expect(document.getElementById('stale-title')).toBeNull();
    expect(document.getElementById('stale-description')).toBeNull();
  });

  it('falls back to semantic title and description hosts for invalid asChild content', () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle asChild>Ada Lovelace</HoverCardTitle>
          <HoverCardDescription asChild>
            <>Mathematician</>
          </HoverCardDescription>
        </HoverCardContent>
      </HoverCard>,
    );

    const title = screen.getByRole('heading', { name: 'Ada Lovelace' });
    const description = screen.getByText('Mathematician');
    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    expect(title.tagName).toBe('H3');
    expect(description.tagName).toBe('P');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });

  it('preserves consumer surface styles alongside floating positioning', () => {
    render(
      <HoverCard open onOpenChange={() => undefined}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent aria-label="Profile preview" style={{ color: 'rgb(1, 2, 3)' }}>
          Preview
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Profile preview' })).toHaveStyle({
      color: 'rgb(1, 2, 3)',
    });
  });

  it('has no accessibility violations when open', async () => {
    render(
      <HoverCard open onOpenChange={() => undefined}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
          <HoverCardDescription>Mathematician and computing pioneer.</HoverCardDescription>
        </HoverCardContent>
      </HoverCard>,
    );
    await screen.findByRole('dialog', { name: 'Ada Lovelace' });
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });

  it('falls back safely for untyped open with a non-function callback', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <HoverCard
        {...({ open: true, defaultOpen: false, onOpenChange: 'not-a-function' } as never)}
        openDelay={0}
        closeDelay={0}
      >
        <HoverCardTrigger>Legacy profile</HoverCardTrigger>
        <HoverCardContent>
          <HoverCardTitle>Ada Lovelace</HoverCardTitle>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByRole('dialog', { name: 'Ada Lovelace' })).toBeInTheDocument();
    await userEvent.unhover(screen.getByRole('button', { name: 'Legacy profile' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });
});
