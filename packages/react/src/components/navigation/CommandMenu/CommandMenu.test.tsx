import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CommandMenu } from './CommandMenu';
import type { CommandMenuItem } from './CommandMenu.types';
import { PortalProvider } from '@/providers/PortalProvider';
import { filterFloatingFocusGuardAxeResults } from '@/testing/filterFloatingFocusGuardAxeResults';

const items: CommandMenuItem[] = [
  { id: 'open', label: 'Open project', description: 'Jump to a project', group: 'Projects' },
  { id: 'archive', label: 'Archive project', group: 'Projects' },
  { id: 'disabled', label: 'Disabled command', disabled: true, group: 'Projects' },
  { id: 'settings', label: 'Open settings', group: 'System', keywords: ['preferences'] },
];

/**
 * ### Test Strategy: CommandMenu
 * - **Focus**: global shortcut, combobox/listbox semantics, filtering,
 *   keyboard highlight/selection, controlled query, disabled state, and axe.
 * - **DON'T**: Do not assert layout, animation timing, or generated class names.
 */
describe('CommandMenu', () => {
  it('portals into an explicit owner document and focuses within that realm', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    render(<CommandMenu defaultOpen items={items} ownerDocument={() => frameDocument} />);

    await waitFor(() =>
      expect(frameDocument.body.querySelector('[role="dialog"]')).toBeInTheDocument(),
    );
    const input = frameDocument.body.querySelector<HTMLInputElement>('[role="combobox"]');
    await waitFor(() => expect(frameDocument.activeElement).toBe(input));
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    frame.remove();
  });

  it('lets a PortalProvider win over ownerDocument and treats owner null as suppression', async () => {
    const frame = document.createElement('iframe');
    const providerTarget = document.createElement('div');
    document.body.append(frame, providerTarget);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    const { unmount } = render(
      <PortalProvider container={providerTarget}>
        <CommandMenu defaultOpen items={items} ownerDocument={frameDocument} />
      </PortalProvider>,
    );
    await waitFor(() => expect(providerTarget.querySelector('[role="dialog"]')).not.toBeNull());
    expect(frameDocument.body.querySelector('[role="dialog"]')).toBeNull();
    unmount();

    render(<CommandMenu defaultOpen items={items} ownerDocument={() => null} />);
    await Promise.resolve();
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    frame.remove();
    providerTarget.remove();
  });

  it('keeps shortcut scope independent from the portal owner document', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    render(
      <CommandMenu
        items={items}
        globalShortcut
        globalShortcutTarget={document}
        ownerDocument={frameDocument}
      />,
    );
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );

    await waitFor(() => expect(frameDocument.body.querySelector('[role="dialog"]')).not.toBeNull());
    frame.remove();
  });

  it('opens from the global shortcut and focuses the search input', async () => {
    render(<CommandMenu items={items} globalShortcut />);

    await userEvent.keyboard('{Meta>}k{/Meta}');

    const dialog = await screen.findByRole('dialog', { name: 'Command menu' });
    const input = screen.getByRole('combobox', { name: 'Command menu' });
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveFocus());
  });

  it('does not notify when the shortcut requests the already-open controlled state', async () => {
    const onOpenChange = vi.fn();
    render(<CommandMenu open onOpenChange={onOpenChange} items={items} globalShortcut />);

    await userEvent.keyboard('{Meta>}k{/Meta}');
    await userEvent.keyboard('{Meta>}k{/Meta}');

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('uses priority to resolve multiple shortcuts on the same target', async () => {
    const lowPriorityOpen = vi.fn();
    const highPriorityOpen = vi.fn();
    render(
      <>
        <CommandMenu
          items={items}
          globalShortcut
          globalShortcutPriority={1}
          open={false}
          onOpenChange={lowPriorityOpen}
        />
        <CommandMenu
          items={items}
          globalShortcut
          globalShortcutPriority={2}
          open={false}
          onOpenChange={highPriorityOpen}
        />
      </>,
    );

    await userEvent.keyboard('{Control>}k{/Control}');

    expect(highPriorityOpen).toHaveBeenCalledWith(true);
    expect(lowPriorityOpen).not.toHaveBeenCalled();
  });

  it('keeps equal-priority ownership stable across rerenders', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const firstOpen = vi.fn();
    const latestOpen = vi.fn();
    const { rerender } = render(
      <>
        <CommandMenu items={items} globalShortcut open={false} onOpenChange={firstOpen} />
        <CommandMenu items={items} globalShortcut open={false} onOpenChange={latestOpen} />
      </>,
    );
    rerender(
      <>
        <CommandMenu items={[...items]} globalShortcut open={false} onOpenChange={firstOpen} />
        <CommandMenu items={items} globalShortcut open={false} onOpenChange={latestOpen} />
      </>,
    );

    await userEvent.keyboard('{Control>}k{/Control}');

    expect(latestOpen).toHaveBeenCalledWith(true);
    expect(firstOpen).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });

  it('scopes the shortcut to an explicit shadow root', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const { unmount } = render(
      <CommandMenu items={items} globalShortcut globalShortcutTarget={shadowRoot} />,
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    shadowRoot.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, composed: true }),
    );
    expect(await screen.findByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();

    unmount();
    host.remove();
  });

  it('resolves a delayed shortcut target without subscribing to the document fallback', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const targetRef: { current: ShadowRoot | null } = { current: null };
    const resolveTarget = () => targetRef.current;
    const { rerender, unmount } = render(
      <CommandMenu items={items} globalShortcut globalShortcutTarget={resolveTarget} />,
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    targetRef.current = shadowRoot;
    rerender(<CommandMenu items={items} globalShortcut globalShortcutTarget={resolveTarget} />);
    shadowRoot.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, composed: true }),
    );

    expect(await screen.findByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();

    unmount();
    host.remove();
  });

  it('moves shortcut ownership synchronously when its explicit target changes', () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <CommandMenu
        items={items}
        globalShortcut
        globalShortcutTarget={firstTarget}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    rerender(
      <CommandMenu
        items={items}
        globalShortcut
        globalShortcutTarget={secondTarget}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    firstTarget.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ctrlKey: true, key: 'k' }),
    );
    expect(onOpenChange).not.toHaveBeenCalled();

    secondTarget.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ctrlKey: true, key: 'k' }),
    );
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('localizes default labels and empty state', () => {
    render(<CommandMenu defaultOpen items={[]} locale="ja-JP" />);

    expect(screen.getByRole('dialog', { name: 'コマンドメニュー' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'placeholder',
      'コマンドを入力または検索...',
    );
    expect(screen.getByRole('status')).toHaveTextContent('コマンドが見つかりません。');
  });

  it('filters commands and selects the highlighted item with Enter', async () => {
    const handleSelect = vi.fn();
    render(
      <CommandMenu
        defaultOpen
        items={[
          ...items,
          { id: 'billing', label: 'Open billing', keywords: ['invoice'], onSelect: handleSelect },
        ]}
      />,
    );

    await userEvent.type(screen.getByRole('combobox'), 'invoice');
    expect(screen.getByRole('option', { name: 'Open billing' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Open project Jump to a project' }),
    ).not.toBeInTheDocument();

    await userEvent.keyboard('{Enter}');

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'billing', label: 'Open billing' }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('does not select a command while IME composition is active', () => {
    const onSelect = vi.fn();
    render(<CommandMenu defaultOpen items={[{ id: 'open', label: 'Open project', onSelect }]} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter', isComposing: true });

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('uses locale-aware filtering for command labels', async () => {
    render(<CommandMenu defaultOpen items={[{ id: 'isparta', label: 'ISPARTA' }]} locale="tr" />);

    await userEvent.type(screen.getByRole('combobox'), 'ısparta');

    expect(screen.getByRole('option', { name: 'ISPARTA' })).toBeInTheDocument();
  });

  it('moves highlight with arrow keys and skips disabled items', async () => {
    render(<CommandMenu defaultOpen items={items} />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Archive project' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Open settings' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(screen.getByRole('option', { name: 'Archive project' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not install a global shortcut by default', async () => {
    render(<CommandMenu items={items} />);

    await userEvent.keyboard('{Meta>}k{/Meta}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not consume a shortcut that another handler has already handled', async () => {
    const preventShortcut = (event: KeyboardEvent) => event.preventDefault();
    document.addEventListener('keydown', preventShortcut);
    render(<CommandMenu items={items} globalShortcut />);

    await userEvent.keyboard('{Meta>}k{/Meta}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    document.removeEventListener('keydown', preventShortcut);
  });

  it('closes on Escape and calls onOpenChange in controlled mode', async () => {
    const onOpenChange = vi.fn();
    render(<CommandMenu open onOpenChange={onOpenChange} items={items} />);

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('supports controlled query without mutating the input value', async () => {
    const onQueryChange = vi.fn();
    render(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        query=""
        onQueryChange={onQueryChange}
        items={items}
      />,
    );

    await userEvent.type(screen.getByRole('combobox'), 'set');

    expect(onQueryChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('does not notify when a change event repeats the controlled query', () => {
    const onQueryChange = vi.fn();
    render(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        query="set"
        onQueryChange={onQueryChange}
        items={items}
      />,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'set' } });
    expect(onQueryChange).not.toHaveBeenCalled();
  });

  it('retains the latest controlled open state when becoming uncontrolled', () => {
    const { rerender } = render(
      <CommandMenu open={false} onOpenChange={() => undefined} items={items} />,
    );

    rerender(<CommandMenu open onOpenChange={() => undefined} items={items} />);
    rerender(<CommandMenu items={items} />);

    expect(screen.getByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();
  });

  it('retains the latest controlled query when becoming uncontrolled', () => {
    const { rerender } = render(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        query="open"
        onQueryChange={() => undefined}
        items={items}
      />,
    );

    rerender(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        query="settings"
        onQueryChange={() => undefined}
        items={items}
      />,
    );
    rerender(<CommandMenu defaultOpen items={items} />);

    expect(screen.getByRole('combobox')).toHaveValue('settings');
    expect(screen.getByRole('option', { name: 'Open settings' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Open project Jump to a project' }),
    ).not.toBeInTheDocument();
  });

  it('falls back independently and safely for non-function callbacks', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <CommandMenu
        {...({
          open: true,
          defaultOpen: false,
          query: 'open',
          defaultQuery: 'archive',
          onOpenChange: 'not-a-function',
          onQueryChange: 42,
          items,
        } as never)}
      />,
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('open');
    await userEvent.clear(input);
    await userEvent.type(input, 'settings');
    expect(input).toHaveValue('settings');
    expect(screen.getByRole('option', { name: 'Open settings' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('`open` without `onOpenChange`'));
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('`query` without `onQueryChange`'),
    );
    warning.mockRestore();
  });

  it('keeps highlight aligned with the committed controlled query', async () => {
    const handleSelect = vi.fn();
    render(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        query=""
        onQueryChange={vi.fn()}
        items={[...items, { id: 'billing', label: 'Open billing', onSelect: handleSelect }]}
      />,
    );

    await userEvent.type(screen.getByRole('combobox'), 'billing');
    await userEvent.keyboard('{Enter}');

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('does not reuse option DOM ids when command ids are duplicated', () => {
    render(
      <CommandMenu
        open
        onOpenChange={() => undefined}
        items={[
          { id: 'same', label: 'Open project' },
          { id: 'same', label: 'Close project' },
        ]}
      />,
    );

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('id');
    expect(options[1]).toHaveAttribute('id');
    expect(options[0].id).not.toBe(options[1].id);
  });

  it('does not reuse option DOM ids when the same item object is included twice', () => {
    const item = { id: 'open', label: 'Open project' };
    render(<CommandMenu open onOpenChange={() => undefined} items={[item, item]} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0].id).not.toBe(options[1].id);
  });

  it('does not open from the global shortcut when disabled', async () => {
    render(<CommandMenu disabled items={items} globalShortcut />);

    await userEvent.keyboard('{Control>}k{/Control}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not leave focus guards mounted while closed', () => {
    render(<CommandMenu items={items} />);

    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('provides localized touch-screen-reader dismiss controls', async () => {
    render(
      <>
        <button type="button">Command launcher</button>
        <CommandMenu items={items} locale="ja-JP" globalShortcut />
      </>,
    );

    const launcher = screen.getByRole('button', { name: 'Command launcher' });
    launcher.focus();
    await userEvent.keyboard('{Control>}k{/Control}');
    const dismissControls = await screen.findAllByRole('button', { name: '閉じる' });
    expect(dismissControls).toHaveLength(2);

    fireEvent.click(dismissControls[0]!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(launcher).toHaveFocus());
    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('does not render default-open or controlled-open content while disabled', () => {
    const { rerender } = render(<CommandMenu disabled defaultOpen items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<CommandMenu disabled open onOpenChange={() => undefined} items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not reopen an uncontrolled menu after it is disabled and re-enabled', () => {
    const { rerender } = render(<CommandMenu defaultOpen items={items} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<CommandMenu disabled items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<CommandMenu items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders an empty state', () => {
    render(<CommandMenu defaultOpen items={items} defaultQuery="missing" />);

    expect(screen.getByText('No commands found.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No commands found.');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('keeps command icons decorative and non-interactive', () => {
    render(
      <CommandMenu
        defaultOpen
        items={[{ id: 'open', label: 'Open project', icon: <button type="button">Pin</button> }]}
      />,
    );

    const option = screen.getByRole('option', { name: 'Open project' });
    expect(option.querySelector('button')).toBeNull();
    expect(option.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('has no accessibility violations when open', async () => {
    render(<CommandMenu defaultOpen items={items} />);

    expect(filterFloatingFocusGuardAxeResults(await axe(document.body))).toHaveNoViolations();
  });
});
