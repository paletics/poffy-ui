import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createElement } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { axe } from 'vitest-axe';
import { ContextMenu } from './ContextMenu';
import { ContextMenuItem } from './ContextMenu.types';
import { useContextMenuTrigger } from '@poffy-ui/behavior/context-menu';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**
 * ### Test Strategy: ContextMenu
 * - **Focus**: ContextMenu must correctly open over a simulated coordinate, display provided items, and correctly fire their respective actions while closing the menu upon selection. Keyboard navigation must strictly conform to WAI-ARIA standards.
 * - **DON'T**: Do not test positioning mathematics since Floating UI provides that guarantee. Focus solely on component API mapping and structural tests.
 */
describe('ContextMenu', () => {
  it('uses a localized fallback name for a virtual target', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <ContextMenu
          items={[{ label: 'Edit', onClick: () => undefined }]}
          open
          onClose={() => undefined}
          position={{ x: 10, y: 10 }}
        />
      </LocaleProvider>,
    );

    const menu = screen.getByRole('menu', { hidden: true });
    expect(menu).toHaveAttribute('aria-label', 'コンテキストメニュー');
    expect(menu).not.toHaveAttribute('aria-labelledby');
  });

  let mockOnClose: Mock<() => void>;

  beforeEach(() => {
    mockOnClose = vi.fn<() => void>();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const position = { x: 100, y: 100 };
  const items: ContextMenuItem[] = [
    { id: '1', label: 'Item 1', type: 'item', onClick: vi.fn() },
    { id: '2', type: 'separator' },
    { id: '3', label: 'Item 3', type: 'item', disabled: true },
  ];

  it('does not render when open is false', () => {
    render(<ContextMenu items={items} position={position} open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Item 1')).toBeNull();
  });

  it('allows a closed menu to mount before an anchor is established', () => {
    render(<ContextMenu items={items} open={false} onClose={mockOnClose} />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-theme', 'light');
  });

  it('keeps shortcut hints out of the menuitem accessible name', async () => {
    render(
      <ContextMenu
        items={[{ id: 'inspect', label: 'Inspect', shortcut: 'Control+Alt+Shift+I' }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Inspect', hidden: true })).toBeInTheDocument(),
    );
    expect(screen.getByText('Control+Alt+Shift+I')).toHaveAttribute('aria-hidden', 'true');
  });

  it('preserves menu semantics when runtime props conflict', () => {
    render(
      <ContextMenu
        {...({ role: 'dialog' } as never)}
        items={items}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole('menu', { hidden: true })).toBeInTheDocument();
  });

  it('uses its menu surface when a legacy asChild prop is passed at runtime', () => {
    render(
      <ContextMenu
        {...({ asChild: true } as never)}
        items={items}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole('menu', { hidden: true })).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('calls onClick and onClose when an item is clicked', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Item 1'));
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call onClick or onClose when a disabled item is clicked', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Item 3'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('activates item on Enter key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const [firstItem] = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(firstItem, { key: 'Enter' });
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('activates item on Space key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const [firstItem] = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(firstItem, { key: ' ' });
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it.each([
    { key: 'Tab', shiftKey: false, destination: 'After' },
    { key: 'Shift+Tab', shiftKey: true, destination: 'Before' },
  ])(
    'closes on $key and moves from its trigger in logical tab order',
    async ({ shiftKey, destination }) => {
      const TriggeredContextMenu = () => {
        const { open, position, target, onContextMenu, onKeyDown, onClose } =
          useContextMenuTrigger();
        return (
          <>
            <button type="button">Before</button>
            <button type="button" onContextMenu={onContextMenu} onKeyDown={onKeyDown}>
              File actions
            </button>
            <button type="button">After</button>
            <ContextMenu
              items={[{ id: 'open', label: 'Open' }]}
              position={position}
              target={target ?? undefined}
              open={open}
              onClose={onClose}
            />
          </>
        );
      };
      render(<TriggeredContextMenu />);

      const trigger = screen.getByRole('button', { name: 'File actions' });
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'F10', shiftKey: true });
      const menuItem = await screen.findByRole('menuitem', { name: 'Open', hidden: true });
      await waitFor(() => expect(menuItem).toHaveFocus());

      expect(fireEvent.keyDown(menuItem, { key: 'Tab', shiftKey })).toBe(false);
      await waitFor(() => expect(screen.getByRole('button', { name: destination })).toHaveFocus());
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    },
  );

  it('focuses the menu surface when every item is disabled', async () => {
    render(
      <ContextMenu
        items={[{ id: 'disabled', label: 'Unavailable', disabled: true }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    const menu = screen.getByRole('menu', { hidden: true });
    await waitFor(() => expect(menu).toHaveFocus());
    expect(menu).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus to the menu surface when enabled items become unavailable', async () => {
    const { rerender } = render(
      <ContextMenu
        items={[{ id: 'action', label: 'Action' }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole('menuitem', { name: 'Action', hidden: true })).toHaveFocus(),
    );

    rerender(
      <ContextMenu
        items={[{ id: 'action', label: 'Action', disabled: true }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    await waitFor(() => expect(screen.getByRole('menu', { hidden: true })).toHaveFocus());
  });

  it('fails closed for unsupported legacy submenu data', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const submenuItems = [
      { id: 'more', type: 'submenu', label: 'More', children: [{ label: 'Nested' }] },
    ] as unknown as ContextMenuItem[];
    const { rerender } = render(
      <ContextMenu items={submenuItems} position={position} open onClose={mockOnClose} />,
    );
    rerender(
      <ContextMenu items={[...submenuItems]} position={position} open onClose={mockOnClose} />,
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('was ignored'));
    expect(screen.queryByRole('menuitem', { name: 'More' })).not.toBeInTheDocument();
    expect(screen.queryByText('Nested')).not.toBeInTheDocument();
    warn.mockRestore();
  });

  it('respects a consumer key handler that prevents roving navigation', () => {
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => event.preventDefault());
    render(
      <ContextMenu
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        position={position}
        open
        onClose={mockOnClose}
        onKeyDown={onKeyDown}
      />,
    );

    const [firstItem, secondItem] = screen.getAllByRole('menuitem', { hidden: true });
    firstItem!.focus();
    fireEvent.keyDown(firstItem!, { key: 'ArrowDown' });

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(firstItem).toHaveFocus();
    expect(secondItem).not.toHaveFocus();
  });

  it('composes consumer capture and bubble handlers in their declared phases', () => {
    const phases: string[] = [];
    render(
      <ContextMenu
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        position={position}
        open
        onClose={mockOnClose}
        onKeyDownCapture={() => phases.push('capture')}
        onKeyDown={(event) => {
          phases.push('bubble');
          event.preventDefault();
        }}
      />,
    );

    const [firstItem, secondItem] = screen.getAllByRole('menuitem', { hidden: true });
    firstItem!.focus();
    fireEvent.keyDown(firstItem!, { key: 'ArrowDown' });

    expect(phases).toEqual(['capture', 'bubble']);
    expect(firstItem).toHaveFocus();
    expect(secondItem).not.toHaveFocus();
  });

  it('respects a consumer key handler that prevents menu-item selection and dismissal', () => {
    const onClick = vi.fn();
    render(
      <ContextMenu
        items={[{ id: 'first', label: 'First', onClick }]}
        position={position}
        open
        onClose={mockOnClose}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );

    const item = screen.getAllByRole('menuitem', { hidden: true })[0]!;
    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: 'Escape' });

    expect(onClick).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('keeps the menu open when an item prevents its selection event', () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault());
    render(
      <ContextMenu
        items={[{ id: 'stay-open', label: 'Stay open', onClick }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    fireEvent.click(screen.getByText('Stay open').closest('[role="menuitem"]')!);
    expect(onClick).toHaveBeenCalledOnce();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('keeps the menu open when keyboard selection is prevented', () => {
    const onClick = vi.fn((event: React.KeyboardEvent) => event.preventDefault());
    render(
      <ContextMenu
        items={[{ id: 'stay-open', label: 'Stay open', onClick }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    fireEvent.keyDown(screen.getAllByRole('menuitem', { hidden: true })[0]!, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('opens from Shift+F10 and restores focus to the trigger after Escape', async () => {
    const TriggeredContextMenu = () => {
      const { open, position, target, onContextMenu, onKeyDown, onClose } = useContextMenuTrigger();
      return (
        <>
          <button type="button" onContextMenu={onContextMenu} onKeyDown={onKeyDown}>
            File actions
          </button>
          <ContextMenu
            items={[{ id: 'open', label: 'Open' }]}
            position={position}
            target={target ?? undefined}
            open={open}
            onClose={onClose}
          />
        </>
      );
    };
    render(<TriggeredContextMenu />);

    const trigger = screen.getByRole('button', { name: 'File actions' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'F10', shiftKey: true });
    const menuItem = await screen.findByRole('menuitem', { name: 'Open', hidden: true });
    await waitFor(() => expect(menuItem).toHaveFocus());

    fireEvent.keyDown(menuItem, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('does not activate disabled item on Enter key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const menuitems = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(menuitems[1], { key: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('keeps interactive label descendants out of the menuitem tab order', () => {
    render(
      <ContextMenu
        items={[{ id: 'unsafe', label: <button type="button">Delete</button> }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole('menuitem', { hidden: true })).toHaveTextContent('Delete');
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('sanitizes interactive label descendants from a one-shot iterable', () => {
    function* label() {
      yield <button type="button">Generated delete</button>;
    }

    render(
      <ContextMenu
        items={[{ id: 'generated-unsafe', label: label() as never }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole('menuitem', { hidden: true })).toHaveTextContent('Generated delete');
    expect(screen.queryByRole('button', { name: 'Generated delete' })).not.toBeInTheDocument();
  });

  it('keeps opaque custom labels from rendering interactive descendants', () => {
    const UnsafeLabel = () => <a href="#delete">Delete</a>;
    render(
      <ContextMenu
        items={[{ id: 'unsafe-custom', label: <UnsafeLabel /> } as never]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { hidden: true })).toHaveAttribute(
      'aria-label',
      'unsafe-custom',
    );
  });

  it.each([{ id: 'blank-label', label: '   ' }, { id: 'missing-label' }])(
    'gives invalid runtime action $id a fallback name',
    (item) => {
      render(
        <ContextMenu items={[item as never]} position={position} open onClose={mockOnClose} />,
      );

      expect(screen.getByRole('menuitem', { hidden: true })).toHaveAttribute('aria-label', item.id);
    },
  );

  it('keeps runtime string tabIndex content out of the menuitem tab order', () => {
    render(
      <ContextMenu
        items={[
          {
            id: 'unsafe-tab',
            label: createElement('span', { tabIndex: '0' as never }, 'Delete'),
          },
        ]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText('Delete')).not.toHaveAttribute('tabindex');
  });

  it('renders custom icon content inside an inert decorative container', () => {
    const CustomIcon = () => <button type="button">Delete icon</button>;
    render(
      <ContextMenu
        items={[{ id: 'custom-icon', label: 'Delete', icon: <CustomIcon /> }]}
        position={position}
        open
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole('button', { hidden: true }).closest('[inert]')).not.toBeNull();
  });

  it('returns focus to the prior control when the context target is not focusable', async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const onClose = vi.fn();
    const { rerender, unmount } = render(<button type="button">Origin</button>);
    screen.getByRole('button', { name: 'Origin' }).focus();
    rerender(
      <>
        <button type="button">Origin</button>
        <ContextMenu items={items} target={target} open onClose={onClose} />
      </>,
    );

    await waitFor(() => expect(screen.getAllByRole('menuitem', { hidden: true })[0]).toHaveFocus());
    rerender(
      <>
        <button type="button">Origin</button>
        <ContextMenu items={items} target={target} open={false} onClose={onClose} />
      </>,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Origin' })).toHaveFocus());
    unmount();
    target.remove();
  });

  it('returns ShadowRoot focus to the prior control for a non-focusable target', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const target = document.createElement('div');
    const container = document.createElement('div');
    shadowRoot.append(target, container);
    document.body.append(host);
    const onClose = vi.fn();
    const renderMenu = (open: boolean) => (
      <>
        <button type="button">Shadow origin</button>
        <ContextMenu
          items={items}
          target={target}
          portalContainer={shadowRoot}
          open={open}
          onClose={onClose}
        />
      </>
    );
    const { rerender, unmount } = render(renderMenu(false), { container });
    const origin = within(container).getByRole('button', { name: 'Shadow origin' });
    origin.focus();

    rerender(renderMenu(true));
    await waitFor(() =>
      expect(shadowRoot.querySelector('[role="menuitem"]')).toBe(shadowRoot.activeElement),
    );
    rerender(renderMenu(false));

    await waitFor(() => expect(shadowRoot.activeElement).toBe(origin));
    unmount();
    host.remove();
  });

  it('preserves an item action focus move when the menu closes', async () => {
    const destination = document.createElement('input');
    destination.setAttribute('aria-label', 'Destination');
    document.body.append(destination);
    const onClose = vi.fn();
    const menuItems: ContextMenuItem[] = [
      { id: 'open-panel', label: 'Open panel', onClick: () => destination.focus() },
    ];
    const { rerender, unmount } = render(
      <ContextMenu items={menuItems} position={position} open onClose={onClose} />,
    );

    const item = await screen.findByRole('menuitem', { name: 'Open panel', hidden: true });
    await waitFor(() => expect(item).toHaveFocus());
    fireEvent.click(item);
    expect(onClose).toHaveBeenCalledOnce();
    expect(destination).toHaveFocus();

    rerender(<ContextMenu items={menuItems} position={position} open={false} onClose={onClose} />);
    await waitFor(() => expect(destination).toHaveFocus());
    unmount();
    destination.remove();
  });

  it('preserves an item action focus move into another menu', async () => {
    const origin = document.createElement('button');
    origin.textContent = 'Origin';
    const destinationMenu = document.createElement('div');
    destinationMenu.setAttribute('role', 'menu');
    destinationMenu.setAttribute('aria-label', 'Destination menu');
    const destination = document.createElement('button');
    destination.setAttribute('role', 'menuitem');
    destination.textContent = 'Destination item';
    destinationMenu.append(destination);
    document.body.append(origin, destinationMenu);
    origin.focus();

    const onClose = vi.fn();
    const menuItems: ContextMenuItem[] = [
      { id: 'open-menu', label: 'Open another menu', onClick: () => destination.focus() },
    ];
    const { rerender, unmount } = render(
      <ContextMenu items={menuItems} position={position} open onClose={onClose} />,
    );

    const item = await screen.findByRole('menuitem', { name: 'Open another menu', hidden: true });
    await waitFor(() => expect(item).toHaveFocus());
    fireEvent.click(item);
    expect(onClose).toHaveBeenCalledOnce();
    expect(destination).toHaveFocus();

    rerender(<ContextMenu items={menuItems} position={position} open={false} onClose={onClose} />);
    await waitFor(() => expect(destination).toHaveFocus());
    unmount();
    origin.remove();
    destinationMenu.remove();
  });

  it('returns focus within the target document after closing an iframe context menu', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const target = frameDocument.createElement('div');
    const origin = frameDocument.createElement('button');
    origin.textContent = 'Iframe origin';
    frameDocument.body.append(origin, target);
    origin.focus();
    const focus = vi.spyOn(origin, 'focus');
    const { rerender, unmount } = render(
      <ContextMenu items={items} target={target} open onClose={mockOnClose} />,
    );

    rerender(<ContextMenu items={items} target={null} open={false} onClose={mockOnClose} />);

    await waitFor(() => expect(focus).toHaveBeenCalledOnce());
    unmount();
    frame.remove();
  });

  it('has no accessibility violations when open', async () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
