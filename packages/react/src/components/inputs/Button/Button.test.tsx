import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ActionMotion } from '@/components/animations';
import { Button } from './index';

vi.mock('@/components/animations', () => ({
  ActionMotion: vi.fn(({ children }: { children: ReactNode }) => children),
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
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with the button role and visible label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
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
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
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
      render(<Button loading>Processing...</Button>);
      const button = screen.getByRole('button', { name: 'Processing...' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading', '');
      expect(button.querySelector('[data-part="icon"]')).toBeInTheDocument();
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
    it('renders leftIcon before the label', () => {
      render(<Button leftIcon={<span data-testid="left-icon" />}>Save</Button>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders rightIcon after the label', () => {
      render(<Button rightIcon={<span data-testid="right-icon" />}>Save</Button>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('hides leftIcon and rightIcon while loading', () => {
      render(
        <Button
          loading
          leftIcon={<span data-testid="left-icon" />}
          rightIcon={<span data-testid="right-icon" />}
        >
          Save
        </Button>,
      );
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
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
