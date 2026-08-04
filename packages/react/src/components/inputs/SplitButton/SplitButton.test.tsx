import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { SplitButton } from './SplitButton';

const makeItems = () => [
  { id: '1', label: 'Option 1', onClick: vi.fn() },
  { id: '2', label: 'Option 2', onClick: vi.fn() },
  { id: '3', label: 'Option 3', onClick: vi.fn() },
];

/**
 * ### Test Strategy: SplitButton
 * - **Focus**: Main button click, dropdown toggle, menu item selection (click + keyboard), disabled
 *   item/button behavior, and WAI-ARIA menu pattern (role="menu" / role="menuitem").
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('SplitButton', () => {
  let items: ReturnType<typeof makeItems>;

  beforeEach(() => {
    items = makeItems();
  });

  it('renders main button and dropdown toggle', () => {
    render(<SplitButton items={items}>Action</SplitButton>);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More options' })).toBeInTheDocument();
  });

  it('forwards the root element ref and clears it on unmount', () => {
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
      <SplitButton ref={ref} items={items}>
        Action
      </SplitButton>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    unmount();
    expect(ref.current).toBeNull();
  });

  it('has no accessibility violations when the menu is open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));

    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('localizes and explicitly overrides the menu trigger label', () => {
    const { rerender } = render(
      <SplitButton items={items} locale="ja-JP">
        Action
      </SplitButton>,
    );
    expect(screen.getByRole('button', { name: 'その他のオプション' })).toBeInTheDocument();

    rerender(
      <SplitButton items={items} locale="ja-JP" labels={{ moreOptions: '追加操作' }}>
        Action
      </SplitButton>,
    );
    expect(screen.getByRole('button', { name: '追加操作' })).toBeInTheDocument();
  });

  it('calls main onClick when main button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <SplitButton items={items} onClick={handleClick}>
        Action
      </SplitButton>,
    );

    await user.click(screen.getByRole('button', { name: 'Action' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('opens the menu when the dropdown toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<SplitButton items={items}>Action</SplitButton>);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option 1' })).toHaveFocus();
  });

  it.each([
    ['ArrowDown', 'Enabled 1'],
    ['ArrowUp', 'Enabled 2'],
  ])('opens with %s and focuses the expected enabled item', async (key, expectedName) => {
    const user = userEvent.setup();
    render(
      <SplitButton
        items={[
          { id: '1', label: 'Enabled 1' },
          { id: '2', label: 'Disabled', disabled: true },
          { id: '3', label: 'Enabled 2' },
        ]}
      >
        Action
      </SplitButton>,
    );
    const trigger = screen.getByRole('button', { name: 'More options' });
    trigger.focus();

    await user.keyboard(`{${key}}`);

    expect(screen.getByRole('menuitem', { name: expectedName })).toHaveFocus();
  });

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])(
    'uses native %s button activation and focuses the first enabled item',
    async (_key, keyboardInput) => {
      const user = userEvent.setup();
      render(<SplitButton items={items}>Action</SplitButton>);
      const trigger = screen.getByRole('button', { name: 'More options' });
      trigger.focus();

      await user.keyboard(keyboardInput);

      expect(screen.getByRole('menuitem', { name: 'Option 1' })).toHaveFocus();
    },
  );

  it('updates disclosure state attributes when the menu opens and closes', async () => {
    const user = userEvent.setup();
    render(<SplitButton items={items}>Action</SplitButton>);

    const toggle = screen.getByRole('button', { name: 'More options' });
    expect(toggle).toHaveAttribute('aria-haspopup', 'menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('highlights enabled menu items with arrow keys and activates the highlighted item', async () => {
    const user = userEvent.setup();
    const itemsWithDisabled = [
      { id: '1', label: 'Enabled 1', onClick: vi.fn() },
      { id: '2', label: 'Disabled Item', disabled: true, onClick: vi.fn() },
      { id: '3', label: 'Enabled 2', onClick: vi.fn() },
    ];

    render(<SplitButton items={itemsWithDisabled}>Action</SplitButton>);
    await user.click(screen.getByRole('button', { name: 'More options' }));

    expect(screen.getByRole('menuitem', { name: 'Enabled 1' })).toHaveAttribute('data-highlighted');
    expect(screen.getByRole('menuitem', { name: 'Enabled 1' })).toHaveFocus();

    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Enabled 2' })).toHaveAttribute('data-highlighted');
    expect(screen.getByRole('menuitem', { name: 'Enabled 2' })).toHaveFocus();

    fireEvent.keyDown(menu, { key: 'Enter' });
    expect(itemsWithDisabled[2]!.onClick).toHaveBeenCalledTimes(1);
    expect(itemsWithDisabled[1]!.onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'More options' })).toHaveFocus();
  });

  it('calls menu item onClick and closes menu on item click', async () => {
    const user = userEvent.setup();
    render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    expect(items[0]!.onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More options' })).toHaveFocus();
  });

  it('preserves focus moved by a menu item action', async () => {
    const user = userEvent.setup();
    let destination: HTMLButtonElement | null = null;
    render(
      <>
        <SplitButton
          items={[
            {
              id: 'move-focus',
              label: 'Open destination',
              onClick: () => destination?.focus(),
            },
          ]}
        >
          Action
        </SplitButton>
        <button
          ref={(node) => {
            destination = node;
          }}
          type="button"
        >
          Destination
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Open destination' }));

    expect(screen.getByRole('button', { name: 'Destination' })).toHaveFocus();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not treat a menu click in a shadow portal as an outside press', async () => {
    const user = userEvent.setup();
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const mount = document.createElement('div');
    shadowRoot.append(mount);
    document.body.append(host);
    const onClick = vi.fn();

    const { unmount } = render(
      <SplitButton
        items={[{ id: 'shadow-item', label: 'Shadow option', onClick }]}
        portalContainer={shadowRoot}
      >
        Action
      </SplitButton>,
      { container: mount },
    );
    const shadowQueries = within(shadowRoot as unknown as HTMLElement);

    await user.click(shadowQueries.getByRole('button', { name: 'More options' }));
    await user.click(shadowQueries.getByRole('menuitem', { name: 'Shadow option' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(shadowQueries.queryByRole('menu')).not.toBeInTheDocument();
    unmount();
    host.remove();
  });

  it('does not call onClick for disabled menu items', async () => {
    const user = userEvent.setup();
    const itemsWithDisabled = [
      { id: '1', label: 'Enabled', onClick: vi.fn() },
      { id: '2', label: 'Disabled Item', disabled: true, onClick: vi.fn() },
    ];

    render(<SplitButton items={itemsWithDisabled}>Action</SplitButton>);
    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Disabled Item' }));

    expect(itemsWithDisabled[1]!.onClick).not.toHaveBeenCalled();
  });

  it('disables both buttons when disabled prop is true', () => {
    render(
      <SplitButton items={items} disabled>
        Action
      </SplitButton>,
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
  });

  it('keeps the primary action enabled but disables an empty menu trigger', () => {
    render(<SplitButton items={[]}>Action</SplitButton>);

    expect(screen.getByRole('button', { name: 'Action' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'More options' })).not.toHaveAttribute(
      'aria-controls',
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disables the menu trigger when every item is disabled', () => {
    render(
      <SplitButton items={[{ id: 'disabled', label: 'Disabled option', disabled: true }]}>
        Action
      </SplitButton>,
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'More options' })).toBeDisabled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the portalled menu and preserves forward and reverse tab order', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <SplitButton items={items}>Action</SplitButton>
        <button type="button">After</button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menuitem', { name: 'Option 1' })).toHaveFocus();

    await user.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menuitem', { name: 'Option 1' })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
  });

  it('closes and restores focus when all open-menu items become disabled', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));
    rerender(
      <SplitButton
        items={items.map((item) => ({
          ...item,
          disabled: true,
        }))}
      >
        Action
      </SplitButton>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
  });

  it('moves focus to an enabled item when the focused item becomes disabled', async () => {
    const user = userEvent.setup();
    const onFallbackClick = vi.fn();
    const { rerender } = render(
      <SplitButton
        items={[
          { id: 'first', label: 'First', onClick: vi.fn() },
          { id: 'second', label: 'Second', onClick: onFallbackClick },
        ]}
      >
        Action
      </SplitButton>,
    );

    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus();

    rerender(
      <SplitButton
        items={[
          { id: 'first', label: 'First', disabled: true, onClick: vi.fn() },
          { id: 'second', label: 'Second', onClick: onFallbackClick },
        ]}
      >
        Action
      </SplitButton>,
    );

    expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onFallbackClick).toHaveBeenCalledOnce();
  });

  it('closes an open menu when disabled changes to true', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    rerender(
      <SplitButton items={items} disabled>
        Action
      </SplitButton>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(items[0]!.onClick).not.toHaveBeenCalled();
  });

  it('renders main button icon when icon prop is provided', () => {
    const Icon = () => <svg data-testid="main-icon" />;
    render(
      <SplitButton items={items} icon={<Icon />}>
        Action
      </SplitButton>,
    );
    expect(screen.getByTestId('main-icon')).toBeInTheDocument();
  });

  it('renders menu item icons when open', async () => {
    const user = userEvent.setup();
    const Icon = () => <svg data-testid="item-icon" />;
    const itemsWithIcons = [{ id: '1', label: 'Option 1', icon: <Icon />, onClick: vi.fn() }];

    render(<SplitButton items={itemsWithIcons}>Action</SplitButton>);
    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByTestId('item-icon')).toBeInTheDocument();
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More options' })).toHaveFocus();
  });
});
