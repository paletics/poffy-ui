import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { createRef, forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from './index';

/**
 * ### Test Strategy: Popover
 * - **Focus**: Conditional rendering, positioning, interactions (click to open, Escape to close), and WAI-ARIA compliance.
 * - **DON'T**: Do not test CSS animation or visual styles directly in unit tests.
 */
describe('Popover', () => {
  it('opens on click', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-surface', 'default');
  });

  it('allows a child component to own the popover surface', () => {
    render(
      <Popover open onOpenChange={() => undefined} showArrow>
        <PopoverTrigger>Open content-owned surface</PopoverTrigger>
        <PopoverContent surface="none" aria-label="Content-owned surface">
          <div>Content-owned surface</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('dialog', { name: 'Content-owned surface' })).toHaveAttribute(
      'data-surface',
      'none',
    );
  });

  it('moves focus into content by default', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open focusable content</PopoverTrigger>
        <PopoverContent aria-label="Focusable content">
          <button type="button">First action</button>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open focusable content' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus());
  });

  it('allows owner-managed consumers to disable focus management explicitly', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open owner-managed content</PopoverTrigger>
        <PopoverContent aria-label="Owner-managed content" focusManagement={false}>
          <button type="button">Owner action</button>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open owner-managed content' });
    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('owns wrapper trigger state and the content id reference', () => {
    render(
      <Popover>
        <PopoverTrigger
          {...({
            'aria-controls': 'wrong-popover',
            'aria-expanded': false,
            'aria-haspopup': 'menu',
          } as never)}
        >
          Open
        </PopoverTrigger>
        <PopoverContent id="custom-popover-id">
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).not.toHaveAttribute('aria-controls');

    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Content' });
    expect(dialog).toHaveAttribute('id', 'custom-popover-id');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  });

  it('uses an asChild content host id for the trigger relation', () => {
    render(
      <Popover>
        <PopoverTrigger>Open custom content</PopoverTrigger>
        <PopoverContent asChild aria-label="Custom content">
          <section id="custom-child-popover-id">Content</section>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open custom content' });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Custom content' });
    expect(dialog).toHaveAttribute('id', 'custom-child-popover-id');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  });

  it('portals from an iframe trigger into the trigger document by default', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);

    const { container, unmount } = render(
      <Popover>
        <PopoverTrigger>Open iframe popover</PopoverTrigger>
        <PopoverContent>Iframe content</PopoverContent>
      </Popover>,
      { baseElement: frameDocument.body, container: host },
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');
    if (!trigger) throw new Error('The test did not render a popover trigger.');

    fireEvent.click(trigger);
    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Iframe content'));

    const dialog = frameDocument.querySelector<HTMLElement>('[role="dialog"]');
    expect(dialog?.ownerDocument).toBe(frameDocument);
    expect(document.body).not.toHaveTextContent('Iframe content');

    unmount();
    frame.remove();
  });

  it('falls back safely for an incompatible asChild trigger', () => {
    render(
      <Popover>
        <PopoverTrigger asChild aria-label="Open safely">
          <select aria-label="Unsafe trigger">
            <option>Open</option>
          </select>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open safely' });
    expect(screen.queryByRole('combobox', { name: 'Unsafe trigger' })).not.toBeInTheDocument();
    expect(trigger.querySelector('select')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not open when a trigger consumer cancels click', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger onClick={(event) => event.preventDefault()}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not submit an owning form through an asChild trigger', () => {
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <button type="submit">Open</button>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('type', 'button');
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('blocks disabled asChild trigger activation', () => {
    const onClick = vi.fn();
    render(
      <Popover>
        <PopoverTrigger asChild disabled>
          <a href="#popover" onClick={onClick}>
            Open
          </a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('gives a passive asChild trigger button semantics', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <div>Open</div>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('turns an asChild anchor into a popover button without navigating', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <a href="#popover">Open</a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).not.toHaveAttribute('href');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      expect(trigger.dispatchEvent(event)).toBe(false);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('prevents auxiliary navigation from an asChild anchor', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <a href="#popover">Open</a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    const event = new MouseEvent('auxclick', {
      bubbles: true,
      button: 1,
      cancelable: true,
    });
    expect(trigger.dispatchEvent(event)).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it.each([
    ['href', { href: '#popover' }],
    ['to', { to: '/popover' }],
    ['link role', { role: 'link' }],
  ])('falls back from a link-like custom trigger with %s', (_name, linkProps) => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href?: string; to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={props.href ?? to} {...props} />);
    CustomLink.displayName = 'CustomLink';
    render(
      <Popover>
        <PopoverTrigger asChild>
          <CustomLink {...linkProps}>Open custom link</CustomLink>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open custom link' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(screen.queryByRole('link', { name: 'Open custom link' })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('preserves a normalized label fallback beside a dangling labelledby reference', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';
    render(
      <Popover>
        <PopoverTrigger asChild>
          <CustomLink
            to="/popover"
            aria-labelledby="missing-popover-name"
            aria-label="  Open custom popover  "
          />
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open custom popover' });
    expect(trigger).toHaveAttribute('aria-labelledby', 'missing-popover-name');
    expect(trigger).toHaveAttribute('aria-label', 'Open custom popover');
  });

  it('preserves a custom button-compatible trigger and forwards its ref', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Popover>
          <PopoverTrigger asChild ref={ref}>
            <CustomButton>Open custom button</CustomButton>
          </PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Open custom button' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(trigger);
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('respects preventDefault from an asChild anchor', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <a href="#popover" onClick={(event) => event.preventDefault()}>
            Open
          </a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens an asChild anchor with Space', () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <a href="#popover">Open</a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('forwards an asChild ref to the trigger host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Popover>
        <PopoverTrigger asChild ref={ref}>
          <a href="#popover">Open</a>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Open' }));
  });

  it('wraps an unsafe asChild content host in a dialog surface', () => {
    render(
      <Popover open onOpenChange={() => undefined}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent asChild>
          <input aria-label="Search content" />
        </PopoverContent>
      </Popover>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.tagName).toBe('DIV');
    expect(screen.getByRole('textbox', { name: 'Search content' })).toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('keeps the popover open when its content key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent onKeyDown={(event) => event.preventDefault()}>
          <PopoverTitle>Cancelable content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes when PopoverClose is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose aria-label="Close" />
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('owns the native type for trigger and close actions', () => {
    render(
      <Popover>
        <PopoverTrigger {...({ type: 'submit' } as never)}>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose {...({ type: 'submit' } as never)}>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('type', 'button');
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
  });

  it('returns focus to the trigger after a focused descendant closes a non-modal popover', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    fireEvent.click(close);

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('does not return focus when a non-modal popover disables returnFocus', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open without focus return</PopoverTrigger>
        <PopoverContent returnFocus={false}>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose>Close without focus return</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open without focus return' });
    const focus = vi.spyOn(trigger, 'focus');
    fireEvent.click(trigger);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    fireEvent.click(close);
    await act(async () => {
      await Promise.resolve();
    });

    expect(focus).not.toHaveBeenCalled();
  });

  it('returns ShadowRoot focus to the trigger after a non-modal popover closes', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const { unmount } = render(
      <Popover>
        <PopoverTrigger>Open shadow popover</PopoverTrigger>
        <PopoverContent portalContainer={shadowRoot}>
          <PopoverTitle>Shadow content</PopoverTitle>
          <PopoverClose>Close shadow popover</PopoverClose>
        </PopoverContent>
      </Popover>,
      { container },
    );
    const trigger = within(container).getByRole('button', { name: 'Open shadow popover' });
    fireEvent.click(trigger);
    const close = await waitFor(() => {
      const candidate = Array.from(shadowRoot.querySelectorAll('button')).find(
        (button) => button.textContent === 'Close shadow popover',
      );
      expect(candidate).toBeDefined();
      return candidate!;
    });
    close.focus();
    fireEvent.click(close);

    await waitFor(() => expect(shadowRoot.activeElement).toBe(trigger));
    unmount();
    host.remove();
  });

  it('keeps open and suppresses child activation for a disabled asChild close', () => {
    const onClick = vi.fn();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose asChild disabled aria-label="Keep open">
            <a href="#close" aria-disabled={false} onClick={onClick}>
              Close link
            </a>
          </PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    const close = screen.getByRole('link', { name: 'Keep open' });
    fireEvent.click(close);

    expect(close).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('preserves a custom close label with default native content', () => {
    render(
      <Popover>
        <PopoverTrigger>Open details</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose asChild aria-label="Dismiss details" />
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open details'));
    const close = screen.getByRole('button', { name: 'Dismiss details' });
    expect(close.querySelector('svg')).toBeInTheDocument();
    fireEvent.click(close);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('uses the default close icon instead of nesting an unsafe input fallback', () => {
    render(
      <Popover>
        <PopoverTrigger>Open unsafe fallback</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
          <PopoverClose asChild aria-label="Close popover">
            <input aria-label="Unsafe close input" />
          </PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open unsafe fallback' }));
    const close = screen.getByRole('button', { name: 'Close popover' });
    expect(close.querySelector('input')).not.toBeInTheDocument();
    expect(close.querySelector('svg')).toBeInTheDocument();
    fireEvent.click(close);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('preserves the latest controlled state when becoming uncontrolled', () => {
    const { rerender } = render(
      <Popover open onOpenChange={() => undefined}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Transitioned Popover</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    rerender(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Transitioned Popover</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('falls back safely when untyped open has a non-function callback', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Popover {...({ open: true, onOpenChange: 'not-a-function' } as never)}>
        <PopoverTrigger>Legacy open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Legacy content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Legacy open' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warn.mockRestore();
  });

  it('updates internal state as well as notifying callback-only uncontrolled consumers', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not auto-toggle when triggerMode is manual', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange} triggerMode="manual">
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Content</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('links dialog to title and description via aria attributes', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Title Text</PopoverTitle>
          <PopoverDescription>Description Text</PopoverDescription>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    const dialog = screen.getByRole('dialog');
    const titleId = screen.getByText('Title Text').getAttribute('id');
    const descriptionId = screen.getByText('Description Text').getAttribute('id');
    expect(dialog).toHaveAttribute('aria-labelledby', titleId);
    expect(dialog).toHaveAttribute('aria-describedby', descriptionId);
  });

  it('preserves dialog semantics when content props conflict at runtime', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent {...({ role: 'presentation' } as never)} aria-label="Details">
          Content
        </PopoverContent>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
  });

  it('does not render dangling title or description references when optional parts are omitted', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent aria-label="Popover details">Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));

    const dialog = screen.getByRole('dialog', { name: 'Popover details' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('falls back to an accessible name for an unnamed dialog', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));

    const dialog = screen.getByRole('dialog', { name: 'Popover' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('treats an empty explicit labelledby value as absent', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent aria-labelledby="   ">Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));

    const dialog = screen.getByRole('dialog', { name: 'Popover' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('prefers an explicit label to an automatically linked title', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent aria-label="Popover details">
          <PopoverTitle>Details</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));

    const dialog = screen.getByRole('dialog', { name: 'Popover details' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('keeps public popovers fixed to dialog semantics for legacy runtime props', () => {
    render(
      <Popover {...({ floatingRole: 'menu' } as never)}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByRole('dialog', { name: 'Popover' })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Details</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(
      await axe(screen.getByRole('dialog'), { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
