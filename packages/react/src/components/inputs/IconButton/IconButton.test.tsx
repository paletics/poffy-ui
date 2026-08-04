import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { IconButton } from './IconButton';

const TestIcon = () => (
  <svg data-testid="test-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const CustomLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(function CustomLink(
  { children, ...props },
  ref,
) {
  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
});
const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

/**
 * ### Test Strategy: IconButton
 * - **Focus**: Icon rendering, mandatory `aria-label`, click handling, loading/disabled ARIA attributes,
 *   polymorphic `asChild` delegation, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names, size/variant/shape visual output — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion animation timing — that is covered in animation unit tests.
 */
describe('IconButton', () => {
  it('renders with button role and icon', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Edit item" />);
    expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<IconButton icon={<TestIcon />} aria-label="Edit item" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Submit" onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('never submits an owning form when callers provide a conflicting type', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton icon={<TestIcon />} aria-label="Submit" type="submit" />
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe('when disabled', () => {
    it('is marked disabled and has aria-disabled', () => {
      render(<IconButton icon={<TestIcon />} aria-label="Edit" disabled />);
      const button = screen.getByRole('button', { name: 'Edit' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('removes a native anchor destination', () => {
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Disabled profile" disabled>
          <a href="/profile" data-testid="disabled-profile">
            Profile
          </a>
        </IconButton>,
      );

      const host = screen.getByTestId('disabled-profile');
      expect(host.tagName).toBe('A');
      expect(host).not.toHaveAttribute('href');
    });

    it('falls back to a native button when a disabled custom host has a destination', () => {
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Disabled profile" disabled>
          <CustomLink href="/profile">Profile</CustomLink>
        </IconButton>,
      );

      const host = screen.getByRole('button', { name: 'Disabled profile' });
      expect(host.tagName).toBe('BUTTON');
      expect(host).not.toHaveAttribute('href');
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('does not allow disabled ARIA state to be overridden', () => {
      render(<IconButton icon={<TestIcon />} aria-label="Edit" disabled aria-disabled="false" />);
      expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<IconButton icon={<TestIcon />} aria-label="Edit" disabled onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation before child handlers run', () => {
      const handleClick = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onClick={handleClick}>
            Edit
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('preserves child and component non-activation keys once when disabled asChild', () => {
      const onChildKeyDown = vi.fn();
      const onIconButtonKeyDown = vi.fn();
      render(
        <IconButton
          asChild
          icon={<TestIcon />}
          aria-label="Edit"
          disabled
          onKeyDown={onIconButtonKeyDown}
        >
          <a href="/blocked" onKeyDown={onChildKeyDown}>
            Edit
          </a>
        </IconButton>,
      );

      fireEvent.keyDown(screen.getByRole('link', { name: 'Edit' }), { key: 'Tab' });

      expect(onChildKeyDown).toHaveBeenCalledTimes(1);
      expect(onIconButtonKeyDown).toHaveBeenCalledTimes(1);
    });

    it('blocks asChild anchor capture activation before child handlers run', () => {
      const handleClickCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Edit
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks auxiliary activation before disabled slotted child handlers run', () => {
      const onChildAuxClick = vi.fn();
      const onIconButtonAuxClick = vi.fn();
      render(
        <IconButton
          asChild
          icon={<TestIcon />}
          aria-label="Edit"
          disabled
          onAuxClick={onIconButtonAuxClick}
        >
          <a href="/blocked" onAuxClick={onChildAuxClick}>
            Edit
          </a>
        </IconButton>,
      );

      const link = screen.getByRole('link', { name: 'Edit' });
      expect(
        link.dispatchEvent(
          new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
        ),
      ).toBe(false);
      expect(onChildAuxClick).not.toHaveBeenCalled();
      expect(onIconButtonAuxClick).not.toHaveBeenCalled();
    });

    it('disables a native button asChild host', () => {
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <button>Edit</button>
        </IconButton>,
      );

      expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    });

    it('blocks asChild keyboard activation keys before child handlers run', () => {
      const handleKeyDown = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Edit
          </a>
        </IconButton>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild pointer handlers before child handlers run', () => {
      const handlePointerUp = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onPointerUp={handlePointerUp}>
            Edit
          </a>
        </IconButton>,
      );
      const event = new PointerEvent('pointerup', { bubbles: true, cancelable: true });
      expect(screen.getByRole('link', { name: 'Edit' }).dispatchEvent(event)).toBe(false);
      expect(handlePointerUp).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys before child handlers run', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Edit
          </a>
        </IconButton>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });
  });

  describe('when loading', () => {
    it('sets aria-busy, aria-disabled, and hides the icon', () => {
      render(<IconButton icon={<TestIcon />} aria-label="Save" loading />);
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<IconButton icon={<TestIcon />} aria-label="Save" loading onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation while loading', () => {
      const handleClick = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onClick={handleClick}>
            Save
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor capture activation while loading', () => {
      const handleClickCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Save
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks asChild keyboard activation keys while loading', () => {
      const handleKeyDown = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Save
          </a>
        </IconButton>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys while loading', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Save
          </a>
        </IconButton>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });
  });

  it('delegates rendering to child element when asChild is true', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Open link">
        <a href="/profile">Open link</a>
      </IconButton>,
    );
    expect(screen.getByRole('link', { name: 'Open link' })).toBeInTheDocument();
  });

  it('gives a non-native asChild host button semantics and keyboard activation', () => {
    const onClick = vi.fn();
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit" onClick={onClick}>
        <div>Edit</div>
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('preserves activation semantics owned by custom asChild hosts', () => {
    const onLinkClick = vi.fn();
    const onIconLinkClick = vi.fn();
    const onButtonClick = vi.fn();
    const onIconButtonClick = vi.fn();
    render(
      <>
        <IconButton asChild icon={<TestIcon />} aria-label="Custom link" onClick={onIconLinkClick}>
          <CustomLink href="#custom-link-target" onClick={onLinkClick}>
            Custom link
          </CustomLink>
        </IconButton>
        <IconButton
          asChild
          icon={<TestIcon />}
          aria-label="Custom button"
          onClick={onIconButtonClick}
        >
          <CustomButton onClick={onButtonClick}>Custom button</CustomButton>
        </IconButton>
      </>,
    );

    const link = screen.getByRole('link', { name: 'Custom link' });
    const button = screen.getByRole('button', { name: 'Custom button' });
    expect(link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(
      true,
    );
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onIconLinkClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onButtonClick).not.toHaveBeenCalled();
    expect(onIconButtonClick).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onIconButtonClick).toHaveBeenCalledTimes(1);
  });

  it('does not delegate runtime button ownership props to a custom host', () => {
    render(
      <IconButton
        {...({
          form: 'external-form',
          formAction: '/unsafe',
          name: 'unsafe',
          value: 'unsafe',
        } as unknown as { form?: never })}
        asChild
        icon={<TestIcon />}
        aria-label="Custom button"
      >
        <CustomButton>Custom button</CustomButton>
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Custom button' });
    expect(button).not.toHaveAttribute('form');
    expect(button).not.toHaveAttribute('formaction');
    expect(button).not.toHaveAttribute('name');
    expect(button).not.toHaveAttribute('value');
  });

  it('emulates href-less anchors and falls back for incompatible interactive hosts', () => {
    const onAnchorClick = vi.fn();
    const onSummaryClick = vi.fn();
    const onIconSummaryClick = vi.fn();
    render(
      <>
        <IconButton
          asChild
          icon={<TestIcon />}
          aria-label="Href-less anchor"
          onClick={onAnchorClick}
        >
          {createElement('a', null, 'Href-less anchor')}
        </IconButton>
        <details>
          <IconButton asChild icon={<TestIcon />} aria-label="Summary" onClick={onIconSummaryClick}>
            <summary onClick={onSummaryClick}>Summary</summary>
          </IconButton>
        </details>
      </>,
    );

    const anchorButton = screen.getByRole('button', { name: 'Href-less anchor' });
    expect(anchorButton).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(anchorButton, { key: 'Enter' });
    fireEvent.keyDown(anchorButton, { key: ' ', code: 'Space' });
    fireEvent.keyUp(anchorButton, { key: ' ', code: 'Space' });
    expect(onAnchorClick).toHaveBeenCalledTimes(2);

    const summaryFallback = screen.getByRole('button', { name: 'Summary' });
    expect(screen.queryByText('Summary', { selector: 'summary' })).not.toBeInTheDocument();
    fireEvent.click(summaryFallback);
    expect(onSummaryClick).not.toHaveBeenCalled();
    expect(onIconSummaryClick).toHaveBeenCalledTimes(1);
  });

  it('falls back to a native button for incompatible interactive asChild hosts', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit">
        <select aria-label="Edit target">
          <option>Edit</option>
        </select>
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Edit target' })).not.toBeInTheDocument();
  });

  it('falls back to a native button for editable asChild hosts', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit">
        <div contentEditable="plaintext-only">Edit target</div>
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByText('Edit target')).not.toBeInTheDocument();
  });

  it('owns slotted accessibility state and native button type', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled aria-disabled="false">
        <button aria-label="Conflicting label" aria-disabled="false" type="submit">
          Edit
        </button>
      </IconButton>,
    );

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('preserves presentation children for every native button path', () => {
    const { rerender } = render(
      <IconButton icon={<TestIcon />} aria-label="Edit">
        <span data-testid="default-label">Label</span>
      </IconButton>,
    );

    const defaultButton = screen.getByRole('button', { name: 'Edit' });
    expect(defaultButton).toHaveTextContent('Label');
    expect(screen.getByTestId('default-label')).toBeInTheDocument();

    rerender(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit">
        <button type="submit">
          <span data-testid="slotted-label">Label</span>
        </button>
      </IconButton>,
    );

    const slottedButton = screen.getByRole('button', { name: 'Edit' });
    expect(slottedButton).toHaveAttribute('type', 'button');
    expect(slottedButton).toHaveTextContent('Label');
    expect(screen.getByTestId('slotted-label')).toBeInTheDocument();
  });

  it('falls back to a native button for void asChild hosts', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit">
        <img alt="Ignored" />
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Ignored' })).not.toBeInTheDocument();
  });

  it('preserves child capture handlers when asChild is enabled', () => {
    const handleClickCapture = vi.fn();
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Open link">
        <a href="/profile" onClickCapture={handleClickCapture}>
          Open link
        </a>
      </IconButton>,
    );

    screen.getByRole('link', { name: 'Open link' }).click();
    expect(handleClickCapture).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<IconButton ref={ref} icon={<TestIcon />} aria-label="Edit" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('falls back to a native button when asChild has no host element', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Edit">
        Edit
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});
