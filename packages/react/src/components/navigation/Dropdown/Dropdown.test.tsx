import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef, forwardRef, useEffect, useState, type FormEvent } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { filterFloatingFocusGuardAxeResults } from '@/testing/filterFloatingFocusGuardAxeResults';
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
  it.each([
    [0, '0px'],
    [12.5, '12.5px'],
  ])('mirrors resolved collision padding %s into the menu fallback', (padding, expected) => {
    render(
      <Dropdown collisionPadding={padding} open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.getByRole('menu').style.getPropertyValue('--floating-fallback-padding')).toBe(
      expected,
    );
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'falls back to 8px for invalid collision padding %s',
    (padding) => {
      render(
        <Dropdown collisionPadding={padding} open onOpenChange={() => undefined}>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Edit</DropdownItem>
          </DropdownMenu>
        </Dropdown>,
      );

      expect(screen.getByRole('menu').style.getPropertyValue('--floating-fallback-padding')).toBe(
        '8px',
      );
    },
  );

  it('preserves consumer styles while keeping positioning and fallback padding component-owned', () => {
    const style = {
      color: 'rgb(1, 2, 3)',
      position: 'fixed',
      '--floating-fallback-padding': '999px',
    } as CSSProperties;
    render(
      <Dropdown collisionPadding={0} open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu style={style}>
          <DropdownItem>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const menu = screen.getByRole('menu');
    expect(menu).toHaveStyle({ color: 'rgb(1, 2, 3)', position: 'absolute' });
    expect(menu.style.getPropertyValue('--floating-fallback-padding')).toBe('0px');
  });

  it('forwards trigger and menu refs and clears them on unmount', () => {
    const triggerRef = createRef<HTMLElement>();
    const menuRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLElement>();
    const { unmount } = render(
      <Dropdown>
        <DropdownTrigger ref={triggerRef}>Actions</DropdownTrigger>
        <DropdownMenu ref={menuRef}>
          <DropdownItem ref={itemRef}>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(menuRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
    unmount();
    expect(triggerRef.current).toBeNull();
    expect(menuRef.current).toBeNull();
    expect(itemRef.current).toBeNull();
  });

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

  it('preserves element children when asChild is not requested', () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <span data-testid="trigger-content">Open Menu</span>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.getByTestId('trigger-content')).toBeInTheDocument();
  });

  it('falls back to a native trigger while preserving invalid asChild content', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger asChild aria-label="Image menu">
          <img alt="Menu artwork" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Image menu' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(screen.getByRole('img', { name: 'Menu artwork' })).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('drops an unsafe input host when falling back to a native trigger', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild aria-label="Open safe menu">
          <input aria-label="Nested input" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Open safe menu' });
    expect(trigger.querySelector('input')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('falls back when an asChild trigger is an incompatible native control', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild aria-label="Open safe menu">
          <select aria-label="Nested select">
            <option>Actions</option>
          </select>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Open safe menu' });
    expect(screen.queryByRole('combobox', { name: 'Nested select' })).not.toBeInTheDocument();
    expect(trigger.querySelector('select')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('owns native button type and disabled state for an asChild trigger', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild disabled>
          <button type="submit">Disabled menu</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled menu' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });

  it('clears child-owned trigger state when the delegated trigger is enabled', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';

    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <CustomButton disabled aria-disabled="true" tabIndex={-1}>
            Enabled menu
          </CustomButton>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Enabled menu' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');
    expect(trigger).toHaveAttribute('tabindex', '0');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('preserves a rejected custom trigger accessible name on the fallback button', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <CustomLink to="/actions" aria-label="Named actions" />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Named actions' });
    expect(trigger).toBeEmptyDOMElement();
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('preserves an external labelledby name on a rejected custom trigger', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <>
        <span id="external-dropdown-name">External actions</span>
        <Dropdown>
          <DropdownTrigger asChild>
            <CustomLink to="/actions" aria-labelledby="external-dropdown-name" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'External actions' });
    expect(trigger).toHaveAttribute('aria-labelledby', 'external-dropdown-name');
    expect(trigger).not.toHaveAttribute('aria-label');
  });

  it('preserves a normalized label fallback beside a dangling labelledby reference', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <CustomLink
            to="/actions"
            aria-labelledby="missing-dropdown-name"
            aria-label="  Named actions  "
          />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Named actions' });
    expect(trigger).toHaveAttribute('aria-labelledby', 'missing-dropdown-name');
    expect(trigger).toHaveAttribute('aria-label', 'Named actions');
  });

  it('guards every disabled asChild trigger activation channel while preserving Tab', () => {
    const childKeyDown = vi.fn();
    const childClick = vi.fn();
    const childAuxClick = vi.fn();
    const childPointerUp = vi.fn();
    const triggerKeyDown = vi.fn();
    const triggerClickCapture = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger
          asChild
          disabled
          onClickCapture={triggerClickCapture}
          onKeyDown={triggerKeyDown}
        >
          <a
            href="#blocked"
            onAuxClick={childAuxClick}
            onClick={childClick}
            onKeyDown={childKeyDown}
            onPointerUp={childPointerUp}
          >
            Disabled trigger
          </a>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled trigger' });
    fireEvent.keyDown(trigger, { key: 'Tab' });
    expect(childKeyDown).toHaveBeenCalledOnce();
    expect(triggerKeyDown).toHaveBeenCalledOnce();

    fireEvent.click(trigger);
    fireEvent.pointerDown(trigger);
    fireEvent.pointerUp(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyUp(trigger, { key: 'Unidentified', code: 'Space' });
    expect(
      trigger.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toHaveAttribute('disabled');
    expect(childKeyDown).toHaveBeenCalledOnce();
    expect(triggerKeyDown).toHaveBeenCalledOnce();
    expect(childClick).not.toHaveBeenCalled();
    expect(childAuxClick).not.toHaveBeenCalled();
    expect(childPointerUp).not.toHaveBeenCalled();
    expect(triggerClickCapture).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('composes enabled asChild trigger handlers once before opening', () => {
    const childClick = vi.fn();
    const triggerClickCapture = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger asChild onClickCapture={triggerClickCapture}>
          <a href="#menu" onClick={childClick}>
            Linked trigger
          </a>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Linked trigger' }));

    expect(childClick).toHaveBeenCalledOnce();
    expect(triggerClickCapture).toHaveBeenCalledOnce();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('turns an asChild anchor into a menu button without navigating', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <a href="#menu">Linked trigger</a>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Linked trigger' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    act(() => {
      expect(trigger.dispatchEvent(event)).toBe(false);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('respects preventDefault from an asChild anchor', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <a href="#menu" onClick={(event) => event.preventDefault()}>
            Open menu
          </a>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens an asChild anchor with Space', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <a href="#menu">Linked trigger</a>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Linked trigger' });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it.each([
    ['href', { href: '#menu' }],
    ['to', { to: '/menu' }],
    ['link role', { role: 'link' }],
  ])('falls back from a link-like custom trigger with %s', (_name, linkProps) => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { href?: string; to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={props.href ?? to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <CustomLink {...linkProps}>Custom linked trigger</CustomLink>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom linked trigger' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(screen.queryByRole('link', { name: 'Custom linked trigger' })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('preserves an opaque custom button that forwards props and its ref', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Dropdown>
          <DropdownTrigger asChild ref={ref}>
            <CustomButton>Custom button trigger</CustomButton>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom button trigger' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(ref.current).toBe(trigger);
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('owns delegated trigger ARIA state without clearing unrelated child ARIA', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <button
            aria-controls="wrong-menu"
            aria-describedby="child-description"
            aria-expanded={false}
            aria-haspopup="dialog"
          >
            Delegated menu
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Delegated menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).toHaveAttribute('aria-describedby', 'child-description');

    fireEvent.click(trigger);

    const menu = screen.getByRole('menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(trigger).toHaveAttribute('aria-describedby', 'child-description');
  });

  it('clears native child disabled state when the delegated trigger is enabled', () => {
    render(
      <Dropdown>
        <DropdownTrigger asChild>
          <button disabled aria-disabled="true">
            Child-disabled menu
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: 'Child-disabled menu' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
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

  it('preserves an asChild menu host', async () => {
    const user = userEvent.setup();
    const menuRef = createRef<HTMLElement>();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild ref={menuRef}>
          <ul data-testid="custom-menu">
            <DropdownItem asChild>
              <li>Edit</li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('menu')).toBe(screen.getByTestId('custom-menu'));
    expect(screen.getByTestId('custom-menu')).toHaveAttribute('data-state', 'open');
    expect(menuRef.current).toBe(screen.getByTestId('custom-menu'));
  });

  it('owns menu and item identity, role, focus, and disabled semantics after slot merging', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Managed menu</DropdownTrigger>
        <DropdownMenu asChild>
          <ul id="wrong-menu" role="list" tabIndex={7} aria-labelledby="wrong-trigger">
            <DropdownItem asChild disabled>
              <a id="wrong-item" href="#managed" role="link" tabIndex={7} aria-disabled="false">
                Managed item
              </a>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger('Managed menu'));
    const menu = screen.getByRole('menu');
    const item = screen.getByRole('menuitem', { name: 'Managed item' });
    expect(menu.id).not.toBe('wrong-menu');
    expect(menu).toHaveAttribute('tabindex', '-1');
    expect(menu).not.toHaveAttribute('aria-labelledby', 'wrong-trigger');
    expect(item.id).not.toBe('wrong-item');
    expect(item).toHaveAttribute('tabindex', '-1');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('falls back to a div menu surface for an interactive asChild host', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild>
          <button type="button" data-testid="unsafe-menu-host">
            <DropdownItem>Edit</DropdownItem>
          </button>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const menu = screen.getByRole('menu');
    expect(menu.tagName).toBe('DIV');
    expect(screen.queryByTestId('unsafe-menu-host')).not.toBeInTheDocument();
    expect(menu.querySelector('button button')).toBeNull();
  });

  it('removes interactive default item children from the native button host', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>
            <a href="#edit">Edit</a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    expect(item.querySelector('a')).toBeNull();
    expect(item).toHaveTextContent('Edit');
  });

  it('removes interactive descendants from a slotted menuitem host', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild>
          <ul>
            <DropdownItem asChild>
              <li>
                <a href="#edit">Edit</a>
              </li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    expect(item.tagName).toBe('LI');
    expect(item.querySelector('a')).toBeNull();
    expect(item).toHaveTextContent('Edit');
  });

  it('preserves a list item host while removing editable state', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild>
          <ul>
            <DropdownItem asChild>
              <li contentEditable>Rename</li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Rename' });
    expect(item.tagName).toBe('LI');
    expect(item).not.toHaveAttribute('contenteditable');
  });

  it('removes event-owning descendants so the menuitem exclusively handles activation', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={onSelect}>
            <span
              data-testid="event-owning-label"
              onClickCapture={(event) => event.stopPropagation()}
            >
              Edit
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.queryByTestId('event-owning-label')).not.toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('removes opaque custom item content that renders an interactive descendant', async () => {
    const user = userEvent.setup();
    const UnsafeContent = () => <button type="button">Edit</button>;
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>
            <UnsafeContent />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('menuitem')).not.toContainElement(
      screen.queryByRole('button', { name: 'Edit' }),
    );
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

  it('preserves separator semantics when a conflicting role is provided', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownSeparator {...({ role: 'presentation' } as never)} />
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

  it('preserves heading semantics for an asChild label', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel asChild>
            <h4>Group</h4>
          </DropdownLabel>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('heading', { name: 'Group' })).toBeInTheDocument();
  });

  it('falls back from interactive label and separator hosts without retaining their subtrees', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel asChild>
            <button type="button">
              <span>Safe group text</span>
            </button>
          </DropdownLabel>
          <DropdownItem>Item</DropdownItem>
          <DropdownSeparator asChild>
            <button type="button">Unsafe separator action</button>
          </DropdownSeparator>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByText('Safe group text').closest('[role="none"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Safe group text' })).not.toBeInTheDocument();
    expect(screen.queryByText('Unsafe separator action')).not.toBeInTheDocument();
    expect(screen.getByRole('separator').tagName).toBe('DIV');
  });

  it('preserves passive native label and separator hosts while sanitizing label descendants', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel asChild>
            <h4>
              Group <a href="#unsafe">details</a>
            </h4>
          </DropdownLabel>
          <DropdownItem>Item</DropdownItem>
          <DropdownSeparator asChild>
            <hr />
          </DropdownSeparator>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('heading', { name: 'Group details' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'details' })).not.toBeInTheDocument();
    expect(screen.getByRole('separator').tagName).toBe('HR');
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

  it('prevents an asChild disabled link from activating', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem asChild disabled>
            <a href="#settings" onClick={onClick}>
              Settings
            </a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger('Actions'));
    const item = screen.getByRole('menuitem', { name: 'Settings' });
    expect(item).not.toHaveAttribute('href');
    await user.click(item);
    await user.keyboard('{Enter}');

    expect(onClick).not.toHaveBeenCalled();
  });

  it('guards disabled asChild activation handlers but preserves Tab', async () => {
    const user = userEvent.setup();
    const onClickCapture = vi.fn();
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    const onPointerUp = vi.fn();
    const onAuxClick = vi.fn();
    const outerKeyDown = vi.fn();
    const outerAuxClickCapture = vi.fn();
    const outerPointerUpCapture = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            asChild
            disabled
            onAuxClickCapture={outerAuxClickCapture}
            onKeyDown={outerKeyDown}
            onPointerUpCapture={outerPointerUpCapture}
          >
            <a
              href="#settings"
              onAuxClick={onAuxClick}
              onClickCapture={onClickCapture}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              onPointerUp={onPointerUp}
            >
              Settings
            </a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Settings' });
    fireEvent.keyDown(item, { key: 'Tab' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(outerKeyDown).toHaveBeenCalledOnce();

    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyUp(item, { key: 'Enter' });
    fireEvent.pointerUp(item);
    fireEvent.click(item);
    expect(
      item.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(onPointerUp).not.toHaveBeenCalled();
    expect(onAuxClick).not.toHaveBeenCalled();
    expect(outerAuxClickCapture).not.toHaveBeenCalled();
    expect(outerPointerUpCapture).not.toHaveBeenCalled();
    expect(onClickCapture).not.toHaveBeenCalled();
  });

  it('preserves enabled item activation handlers', async () => {
    const user = userEvent.setup();
    const onClickCapture = vi.fn();
    const onKeyDownCapture = vi.fn();
    const onKeyUp = vi.fn();
    const onPointerUpCapture = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            onClickCapture={onClickCapture}
            onKeyDownCapture={onKeyDownCapture}
            onKeyUp={onKeyUp}
            onPointerUpCapture={onPointerUpCapture}
          >
            Settings
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Settings' });
    fireEvent.keyDown(item, { key: 'Tab' });
    fireEvent.keyUp(item, { key: 'Tab' });
    fireEvent.pointerUp(item);
    fireEvent.click(item);

    expect(onClickCapture).toHaveBeenCalledOnce();
    expect(onKeyDownCapture).toHaveBeenCalledOnce();
    expect(onKeyUp).toHaveBeenCalledOnce();
    expect(onPointerUpCapture).toHaveBeenCalledOnce();
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

  it('selects a slotted non-button menuitem with Enter and Space', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild>
          <ul>
            <DropdownItem asChild onSelect={onSelect}>
              <li>Archive</li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );

    const enterItem = screen.getByRole('menuitem', { name: 'Archive' });
    const enter = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' });
    act(() => expect(enterItem.dispatchEvent(enter)).toBe(false));
    expect(enter.defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenCalledOnce();

    rerender(
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu asChild>
          <ul>
            <DropdownItem asChild onSelect={onSelect}>
              <li>Archive</li>
            </DropdownItem>
          </ul>
        </DropdownMenu>
      </Dropdown>,
    );
    const spaceItem = screen.getByRole('menuitem', { name: 'Archive' });
    const spaceDown = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: 'Space',
      key: ' ',
    });
    const spaceUp = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      code: 'Space',
      key: ' ',
    });
    act(() => {
      expect(spaceItem.dispatchEvent(spaceDown)).toBe(false);
      expect(spaceItem.dispatchEvent(spaceUp)).toBe(false);
    });
    expect(spaceDown.defaultPrevented).toBe(true);
    expect(spaceUp.defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('keeps the menu open when an item opts out of close-on-select', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem closeOnSelect={false} onSelect={onSelect}>
            Toggle details
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitem', { name: 'Toggle details' }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('prevents a slotted native item button from submitting an owning form', () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    const onSelect = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Dropdown open onOpenChange={() => undefined}>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem asChild onSelect={onSelect}>
              <button type="submit">Archive</button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </form>,
    );

    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(item).toHaveAttribute('type', 'button');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('delegates owned button props and ref to a custom item button', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      function CustomButton(props, ref) {
        return <button ref={ref} {...props} />;
      },
    );
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    const onSelect = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Dropdown open onOpenChange={() => undefined}>
          <DropdownTrigger>Actions</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              {...({
                form: 'external-form',
                formAction: '/unsafe',
                name: 'unsafe',
                value: 'unsafe',
              } as unknown as { form?: never })}
              asChild
              ref={ref}
              disabled
              onSelect={onSelect}
            >
              <CustomButton type="submit">Archive</CustomButton>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </form>,
    );

    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(ref.current).toBe(item);
    expect(item).toHaveAttribute('type', 'button');
    expect(item).toBeDisabled();
    expect(item).not.toHaveAttribute('form');
    expect(item).not.toHaveAttribute('formaction');
    expect(item).not.toHaveAttribute('name');
    expect(item).not.toHaveAttribute('value');
    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps custom item links as links without button-only props', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      ComponentPropsWithoutRef<'a'> & { to: string }
    >(function CustomLink({ to, children, ...props }, ref) {
      return (
        <a ref={ref} href={to} {...props}>
          {children}
        </a>
      );
    });
    render(
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem asChild>
            <CustomLink to="/archive">Archive</CustomLink>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(item.tagName).toBe('A');
    expect(item).toHaveAttribute('href', '/archive');
    expect(item).not.toHaveAttribute('type');
    expect(item).not.toHaveAttribute('disabled');
  });

  it('falls back to a native button for a disabled custom item link', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      ComponentPropsWithoutRef<'a'> & { to: string }
    >(function CustomLink({ to, children, ...props }, ref) {
      return (
        <a ref={ref} href={to} {...props}>
          {children}
        </a>
      );
    });
    render(
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem asChild disabled>
            <CustomLink to="/archive">Archive</CustomLink>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(item.tagName).toBe('BUTTON');
    expect(item).not.toHaveAttribute('href');
    expect(item).not.toHaveAttribute('to');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('keeps the menu open when a consumer vetoes item activation', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onClick={onClick} onSelect={onSelect}>
            Edit
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
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

  it('treats aria-disabled items as disabled for activation', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem aria-disabled="true" onSelect={onSelect}>
            Unavailable
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    const item = screen.getByRole('menuitem', { name: 'Unavailable' });
    await user.click(item);
    item.focus();
    await user.keyboard('{Enter}');

    expect(onSelect).not.toHaveBeenCalled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
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

  it('keeps disabled items skipped after closing and reopening', async () => {
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
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveAttribute('tabIndex', '0');

    await user.keyboard('{Escape}');
    expect(screen.getByRole('menuitem', { name: 'Third', hidden: true })).toHaveAttribute(
      'tabIndex',
      '-1',
    );
    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Third' })).toHaveAttribute('tabIndex', '0');
  });

  it('follows keyed DOM order changes', async () => {
    const user = userEvent.setup();
    const renderDropdown = (items: string[]) => (
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          {items.map((item) => (
            <DropdownItem key={item}>{item}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
    const { rerender } = render(renderDropdown(['First', 'Second']));

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'First' })).toHaveAttribute('tabIndex', '0');

    rerender(renderDropdown(['Second', 'First']));
    expect(screen.getByRole('menuitem', { name: 'First' })).toHaveAttribute('tabIndex', '0');

    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveAttribute('tabIndex', '0');
  });

  it('follows keyed DOM order changes from child component state', async () => {
    const user = userEvent.setup();
    const StatefulItems = () => {
      const [reversed, setReversed] = useState(false);
      const items = reversed ? ['Second', 'First'] : ['First', 'Second'];
      return (
        <>
          <button onClick={() => setReversed(true)}>Reverse</button>
          {items.map((item) => (
            <DropdownItem key={item}>{item}</DropdownItem>
          ))}
        </>
      );
    };

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <StatefulItems />
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.click(screen.getByRole('button', { name: 'Reverse' }));
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveAttribute('tabIndex', '0');
  });

  it('removes roving focus when the active item becomes disabled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const renderDropdown = (disabled: boolean) => (
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled={disabled}>First</DropdownItem>
          <DropdownItem onSelect={onSelect}>Second</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    const { rerender } = render(renderDropdown(false));

    await user.keyboard('{ArrowDown}');
    const firstItem = screen.getByRole('menuitem', { name: 'First' });
    firstItem.focus();
    expect(firstItem).toHaveFocus();
    rerender(renderDropdown(true));

    expect(screen.getByRole('menuitem', { name: 'First' })).toHaveAttribute('tabIndex', '-1');
    expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('does not move focus when a previously focused item becomes disabled', () => {
    const renderDropdown = (firstDisabled: boolean) => (
      <Dropdown open onOpenChange={() => undefined}>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled={firstDisabled}>First</DropdownItem>
          <DropdownItem>Second</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    const { rerender } = render(renderDropdown(false));
    const firstItem = screen.getByRole('menuitem', { name: 'First' });
    const secondItem = screen.getByRole('menuitem', { name: 'Second' });

    firstItem.focus();
    secondItem.focus();
    rerender(renderDropdown(true));

    expect(screen.getByRole('menuitem', { name: 'Second' })).toHaveFocus();
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

  it('skips disabled matching items', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem disabled>Delete</DropdownItem>
          <DropdownItem>Download</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.keyboard('d');

    expect(screen.getByRole('menuitem', { name: 'Download' })).toHaveAttribute('tabIndex', '0');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('tabIndex', '-1');
  });

  it('updates typeahead labels when item text changes', async () => {
    const user = userEvent.setup();
    const renderDropdown = (label: string) => (
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>{label}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    const { rerender } = render(renderDropdown('Edit'));

    await user.click(getTrigger());
    rerender(renderDropdown('Rename'));
    await user.keyboard('r');

    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveAttribute('tabIndex', '0');
  });

  it('updates implicit typeahead text when a descendant changes its own DOM text', async () => {
    const user = userEvent.setup();
    let rename: () => void = () => undefined;
    const StatefulItem = () => {
      const [label, setLabel] = useState('Edit');
      useEffect(() => {
        rename = () => setLabel('Rename');
      }, []);
      return (
        <DropdownItem>
          <span>{label}</span>
        </DropdownItem>
      );
    };
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <StatefulItem />
          <DropdownItem>Archive</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    act(() => rename());
    await act(async () => {
      await Promise.resolve();
    });
    await user.keyboard('r');

    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveAttribute('tabIndex', '0');
  });

  it('uses the final typeahead metadata after multiple updates in one task', async () => {
    const user = userEvent.setup();
    const renderDropdown = (label: string) => (
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>{label}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    const { rerender } = render(renderDropdown('Edit'));

    await user.click(getTrigger());
    rerender(renderDropdown('Rename'));
    rerender(renderDropdown('Archive'));
    await user.keyboard('a');

    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute('tabIndex', '0');
  });

  it('uses explicit textValue for rich item typeahead', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem textValue="Settings">
            <span aria-hidden="true">⚙</span>
            <span className="sr-only">Preferences</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    await user.click(getTrigger());
    await user.keyboard('s');

    expect(screen.getByRole('menuitem', { name: 'Preferences' })).toHaveAttribute('tabIndex', '0');
  });
});

describe('Dropdown - controlled mode', () => {
  it('falls back to uncontrolled initial state when untyped open lacks a callback', async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Dropdown {...({ open: true } as never)}>
        <DropdownTrigger>Legacy menu</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Legacy menu' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warn.mockRestore();
  });

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
          <DropdownItem>Other</DropdownItem>
        </DropdownMenu>
      </Dropdown>,
    );

    screen.getByRole('menu').focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Item' })).toHaveAttribute('tabIndex', '0');

    await user.keyboard('{Escape}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Item' })).toHaveAttribute('tabIndex', '0');
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
    // Floating UI's Safari/VoiceOver sentinels intentionally use an unnamed button role.
    // We disable 'region' because the portal renders directly into body, outside of main container landmarks in tests.
    expect(
      filterFloatingFocusGuardAxeResults(
        await axe(baseElement, {
          rules: {
            region: { enabled: false },
          },
        }),
      ),
    ).toHaveNoViolations();
  });
});
