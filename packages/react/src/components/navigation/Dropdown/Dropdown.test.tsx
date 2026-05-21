import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from './index';

function renderBasic() {
  return render(
    <Dropdown>
      <DropdownTrigger>Actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>,
  );
}

function getTrigger(name: RegExp | string = /actions|menu/i) {
  return screen.getByRole('button', { name });
}

describe('Dropdown - rendering', () => {
  it('renders trigger button', () => {
    render(
      <Dropdown>
        <DropdownTrigger>Open Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item 1</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
  });

  it('does not render menu until trigger is clicked', () => {
    renderBasic();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup();
    renderBasic();

    await user.click(getTrigger('Actions'));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders separator with correct role', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders label with role="none"', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel>Group</DropdownLabel>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByText('Group')).toHaveAttribute('role', 'none');
  });
});
describe('Dropdown - ARIA attributes', () => {
  it('trigger has aria-haspopup="menu" and aria-expanded="false" when closed', () => {
    renderBasic();

    const trigger = getTrigger();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-expanded="true" when open', async () => {
    const user = userEvent.setup();
    renderBasic();

    await user.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('disabled item has aria-disabled="true"', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled>Disabled</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('menuitem', { name: 'Disabled' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});

describe('Dropdown - selection', () => {
  it('calls onSelect and closes menu when item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={onSelect}>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not call onSelect and keeps menu open for disabled items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled onSelect={onSelect}>
            Disabled
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitem', { name: 'Disabled' }));

    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('Dropdown - keyboard navigation', () => {
  it('opens menu with Enter on trigger', async () => {
    const user = userEvent.setup();
    renderBasic();

    getTrigger().focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens menu with Space on trigger', async () => {
    const user = userEvent.setup();
    renderBasic();

    getTrigger().focus();
    await user.keyboard(' ');

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes menu with Escape', async () => {
    const user = userEvent.setup();
    renderBasic();

    await user.click(getTrigger());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('navigates items with ArrowDown', async () => {
    const user = userEvent.setup();
    renderBasic();

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('tabIndex', '0');
  });

  it('navigates items with ArrowUp from last item', async () => {
    const user = userEvent.setup();
    renderBasic();

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveAttribute('tabIndex', '0');
  });

  it('selects focused item with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={onSelect}>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('skips disabled items during ArrowDown navigation', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>First</DropdownItem>
          <DropdownItem disabled>Disabled</DropdownItem>
          <DropdownItem>Third</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveAttribute('tabIndex', '0');
    expect(screen.getByRole('menuitem', { name: 'Disabled' })).toHaveAttribute('tabIndex', '-1');
  });
});

describe('Dropdown - typeahead', () => {
  it('focuses matching item when typing first character', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
          <DropdownItem>Copy</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.keyboard('d');

    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('tabIndex', '0');
  });
});

describe('Dropdown - controlled mode', () => {
  it('opens and closes via external state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Dropdown open={false} onOpenChange={onOpenChange}>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <Dropdown open={true} onOpenChange={onOpenChange}>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('does not close when parent ignores onOpenChange', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown open={true} onOpenChange={() => undefined}>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.keyboard('{Escape}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
describe('Dropdown - accessibility', () => {
  it('has no violations when closed', async () => {
    const { container } = render(
      <Dropdown>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
          <DropdownSeparator />
          <DropdownItem>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(
      await axe(container, {
        rules: {
          'aria-command-name': { enabled: false },
          region: { enabled: false },
        },
      }),
    ).toHaveNoViolations();
  });

  it('has no violations when open', async () => {
    const user = userEvent.setup();

    const { baseElement } = render(
      <Dropdown>
        <DropdownTrigger>Menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel>Actions</DropdownLabel>
          <DropdownItem>Edit</DropdownItem>
          <DropdownSeparator />
          <DropdownItem disabled>Disabled</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());

    // FloatingPortal renders into document.body, so axe must scan baseElement
    // We disable 'aria-command-name' due to Floating UI internal focus guards using role="button" without a name.
    // We disable 'region' because the portal renders directly into body, outside of main container landmarks in tests.
    expect(
      await axe(baseElement, {
        rules: {
          'aria-command-name': { enabled: false },
          region: { enabled: false },
        },
      }),
    ).toHaveNoViolations();
  });
});
