import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
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

  it('has no accessibility violations when the menu is open', async () => {
    const user = userEvent.setup();
    const { container } = render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));

    expect(await axe(container)).toHaveNoViolations();
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
  });

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

    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Enabled 1' })).toHaveAttribute('data-highlighted');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Enabled 2' })).toHaveAttribute('data-highlighted');

    fireEvent.keyDown(menu, { key: 'Enter' });
    expect(itemsWithDisabled[2]!.onClick).toHaveBeenCalledTimes(1);
    expect(itemsWithDisabled[1]!.onClick).not.toHaveBeenCalled();
  });

  it('calls menu item onClick and closes menu on item click', async () => {
    const user = userEvent.setup();
    render(<SplitButton items={items}>Action</SplitButton>);

    await user.click(screen.getByRole('button', { name: 'More options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Option 1' }));

    expect(items[0]!.onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
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
  });
});
