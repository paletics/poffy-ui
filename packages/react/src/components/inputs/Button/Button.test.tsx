import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ActionMotion } from '@/components/animations';
import { Button } from './index';

const RuntimeButton = Button as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

const animationState = vi.hoisted(() => ({ isAnimating: true }));
const buttonRecipe = vi.hoisted(() => vi.fn(() => 'button-recipe'));

vi.mock('@/components/animations', () => ({
  ActionMotion: vi.fn(({ children }: { children: ReactNode }) => children),
}));

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => animationState,
}));

vi.mock('@/styled-system/recipes', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/styled-system/recipes')>()),
  button: buttonRecipe,
}));

/**
 * ### Test Strategy: Button
 * - **Focus**: Correct rendering, polymorphic `asChild` delegation, loading / disabled ARIA attributes,
 *   icon slot rendering, ref forwarding, HTML attribute pass-through, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion animation timing — that is covered in animation unit tests.
 */
describe('Button', () => {
  beforeEach(() => {
    vi.mocked(ActionMotion).mockClear();
    buttonRecipe.mockClear();
    animationState.isAnimating = true;
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with the button role and visible label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('removes the glow recipe when the animation policy resolves motion to static', () => {
    animationState.isAnimating = false;
    render(<Button glow>Static CTA</Button>);

    expect(buttonRecipe).toHaveBeenLastCalledWith(expect.objectContaining({ glow: false }));
  });

  it('delegates rendering to child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('does not delegate wrapper-owned native button attributes at runtime', () => {
    render(
      <RuntimeButton
        asChild
        form="settings"
        formAction="/save"
        formEncType="multipart/form-data"
        formMethod="post"
        formNoValidate
        formTarget="_blank"
        name="action"
        type="submit"
        value="save"
      >
        <a href="/test">Link Button</a>
      </RuntimeButton>,
    );

    const link = screen.getByRole('link', { name: 'Link Button' });
    for (const attribute of [
      'form',
      'formaction',
      'formenctype',
      'formmethod',
      'formnovalidate',
      'formtarget',
      'name',
      'type',
      'value',
    ]) {
      expect(link).not.toHaveAttribute(attribute);
    }
  });

  it('adds standard button semantics and keyboard activation to passive asChild hosts', () => {
    const onClick = vi.fn();
    render(
      <Button asChild onClick={onClick}>
        <div>Save</div>
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('falls back to a native button for incompatible asChild hosts', () => {
    render(
      <Button asChild aria-label="Save">
        <select aria-label="Save target">
          <option>Save</option>
        </select>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Save target' })).not.toBeInTheDocument();
  });

  it('owns disabled state while preserving a slotted button type', () => {
    render(
      <Button asChild disabled>
        <button type="submit">Save</button>
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('preserves the type owned by a slotted native button', () => {
    render(
      <Button asChild>
        <button type="submit">Save</button>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit');
  });

  it('preserves non-state ARIA attributes for an asChild host', () => {
    render(
      <Button asChild aria-busy="false">
        <a href="/save">Save</a>
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Save' })).toHaveAttribute('aria-busy', 'false');
  });

  it('preserves child capture handlers when asChild is enabled', () => {
    const handleClickCapture = vi.fn();
    render(
      <Button asChild>
        <a href="/test" onClickCapture={handleClickCapture}>
          Link Button
        </a>
      </Button>,
    );

    screen.getByRole('link', { name: 'Link Button' }).click();
    expect(handleClickCapture).toHaveBeenCalledTimes(1);
  });

  describe('when disabled', () => {
    it('is marked disabled and has aria-disabled', () => {
      render(
        <Button disabled aria-disabled={false} data-disabled="incorrect">
          Disabled Button
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-disabled', '');
    });

    it('removes the glow recipe on a disabled control', () => {
      render(
        <Button disabled glow>
          Disabled CTA
        </Button>,
      );

      expect(buttonRecipe).toHaveBeenLastCalledWith(expect.objectContaining({ glow: false }));
    });

    it('does not fire onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Disabled Button' }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation before child handlers run', () => {
      const handleClick = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/blocked" onClick={handleClick}>
            Disabled Link
          </a>
        </Button>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Disabled Link' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('owns state data attributes for an asChild host', () => {
      render(
        <Button asChild disabled>
          <a href="/blocked" data-disabled="incorrect" data-loading="incorrect">
            Disabled Link
          </a>
        </Button>,
      );

      const link = screen.getByRole('link', { name: 'Disabled Link' });
      expect(link).toHaveAttribute('data-disabled', '');
      expect(link).not.toHaveAttribute('data-loading');
    });

    it('blocks asChild anchor auxiliary activation before child handlers run', () => {
      const childAuxClick = vi.fn();
      const buttonAuxClick = vi.fn();
      render(
        <Button asChild disabled onAuxClick={buttonAuxClick}>
          <a href="/blocked" onAuxClick={childAuxClick}>
            Disabled Auxiliary Link
          </a>
        </Button>,
      );

      const event = new MouseEvent('auxclick', {
        bubbles: true,
        button: 1,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Disabled Auxiliary Link' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(childAuxClick).not.toHaveBeenCalled();
      expect(buttonAuxClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor capture activation before child handlers run', () => {
      const handleClickCapture = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Disabled Capture Link
          </a>
        </Button>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Disabled Capture Link' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks asChild keyboard activation keys before child handlers run', () => {
      const handleKeyDown = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Disabled Link
          </a>
        </Button>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Disabled Link' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys before child handlers run', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Disabled Capture Link
          </a>
        </Button>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Disabled Capture Link' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });

    it('preserves child and button handlers for non-activation keys', () => {
      const calls: string[] = [];
      render(
        <Button asChild disabled onKeyDown={() => calls.push('button')}>
          <a href="/blocked" onKeyDown={() => calls.push('child')}>
            Disabled Keyboard Link
          </a>
        </Button>,
      );

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Disabled Keyboard Link' });

      expect(link.dispatchEvent(tabEvent)).toBe(true);
      expect(calls).toEqual(['child', 'button']);
    });

    it('disables ActionMotion feedback', () => {
      render(<Button disabled>Disabled Motion</Button>);
      const props = vi.mocked(ActionMotion).mock.calls.at(-1)?.[0] as {
        disabled?: boolean;
        animationType?: unknown;
      };
      expect(props.disabled).toBe(true);
      expect(props.animationType).toBeUndefined();
    });
  });

  describe('when loading', () => {
    it('sets aria-busy, aria-disabled, data-loading, and renders a spinner', () => {
      render(
        <Button loading aria-busy={false} aria-disabled={false} data-loading="incorrect">
          Processing...
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Processing...' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading', '');
      expect(button.querySelector('[data-part="icon"]')).toBeInTheDocument();
    });

    it('owns loading data attributes for an asChild host', () => {
      render(
        <Button asChild loading>
          <a href="/processing" data-disabled="incorrect" data-loading="incorrect">
            Processing
          </a>
        </Button>,
      );

      const link = screen.getByRole('link', { name: 'Processing' });
      expect(link).toHaveAttribute('data-loading', '');
      expect(link).not.toHaveAttribute('data-disabled');
    });

    it('does not fire onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Processing...
        </Button>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Processing...' }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation while loading', () => {
      const handleClick = vi.fn();
      render(
        <Button asChild loading>
          <a href="/blocked" onClick={handleClick}>
            Loading Link
          </a>
        </Button>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Loading Link' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor capture activation while loading', () => {
      const handleClickCapture = vi.fn();
      render(
        <Button asChild loading>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Loading Capture Link
          </a>
        </Button>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Loading Capture Link' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks asChild keyboard activation keys while loading', () => {
      const handleKeyDown = vi.fn();
      render(
        <Button asChild loading>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Loading Link
          </a>
        </Button>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Loading Link' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys while loading', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <Button asChild loading>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Loading Capture Link
          </a>
        </Button>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Loading Capture Link' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });

    it('disables ActionMotion feedback', () => {
      render(<Button loading>Loading Motion</Button>);
      const props = vi.mocked(ActionMotion).mock.calls.at(-1)?.[0] as {
        disabled?: boolean;
        animationType?: unknown;
      };
      expect(props.disabled).toBe(true);
      expect(props.animationType).toBeUndefined();
    });
  });

  describe('icon slots', () => {
    it('renders startIcon before the label', () => {
      render(<Button startIcon={<span data-testid="start-icon" />}>Save</Button>);
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders endIcon after the label', () => {
      render(<Button endIcon={<span data-testid="end-icon" />}>Save</Button>);
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('hides startIcon and endIcon while loading', () => {
      render(
        <Button
          loading
          startIcon={<span data-testid="start-icon" />}
          endIcon={<span data-testid="end-icon" />}
        >
          Save
        </Button>,
      );
      expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
    });
  });

  it('forwards the ref to the underlying DOM element', () => {
    let ref: HTMLButtonElement | null = null;
    render(
      <Button
        ref={(node) => {
          ref = node;
        }}
      >
        Ref Text
      </Button>,
    );
    expect(ref).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through custom HTML attributes to the DOM element', () => {
    render(
      <Button role="menuitem" data-custom="test">
        Custom Role
      </Button>,
    );
    const button = screen.getByRole('menuitem', { name: 'Custom Role' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-custom', 'test');
    expect(button).toHaveAttribute('type', 'button');
  });
});
