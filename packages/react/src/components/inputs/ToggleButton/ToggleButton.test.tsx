import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createElement,
  createRef,
  forwardRef,
  type ComponentPropsWithoutRef,
  type FormEvent,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ToggleButton } from './ToggleButton';

const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

/**
 * ### Test Strategy: ToggleButton
 * - **Focus**: Uncontrolled toggle, controlled mode, `aria-pressed` management, `onPressedChange` callback,
 *   disabled state, icon slots, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion animation timing — that is covered in animation unit tests.
 */
describe('ToggleButton', () => {
  it('renders with button role and visible label', () => {
    render(<ToggleButton>Toggle me</ToggleButton>);
    expect(screen.getByRole('button', { name: 'Toggle me' })).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<ToggleButton>Bold</ToggleButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('starts with aria-pressed="false" by default', () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not submit an owning form when runtime props conflict with its button type', () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ToggleButton {...({ type: 'submit' } as never)}>Toggle</ToggleButton>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps component-owned ARIA state when consumer props conflict', () => {
    render(
      <ToggleButton pressed disabled aria-pressed="false" aria-disabled="false">
        Toggle
      </ToggleButton>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('toggles aria-pressed on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultPressed', () => {
    render(<ToggleButton defaultPressed>Toggle</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onPressedChange with the new state on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton onPressedChange={handleChange}>Toggle</ToggleButton>);

    await user.click(screen.getByRole('button'));
    expect(handleChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('supports controlled mode — state does not update until parent changes prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <ToggleButton pressed={false} onPressedChange={handleChange}>
        Toggle
      </ToggleButton>,
    );
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <ToggleButton pressed={true} onPressedChange={handleChange}>
        Toggle
      </ToggleButton>,
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('retains the latest controlled value when becoming uncontrolled', () => {
    const { rerender } = render(
      <ToggleButton pressed={false} defaultPressed>
        Toggle
      </ToggleButton>,
    );

    rerender(<ToggleButton pressed>Toggle</ToggleButton>);
    rerender(<ToggleButton defaultPressed={false}>Toggle</ToggleButton>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when the consumer cancels the click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ToggleButton onClick={(event) => event.preventDefault()} onPressedChange={handleChange}>
        Toggle
      </ToggleButton>,
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(handleChange).not.toHaveBeenCalled();
  });

  describe('when disabled', () => {
    it('is marked disabled with aria-disabled', () => {
      render(<ToggleButton disabled>Toggle</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not toggle when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ToggleButton disabled onPressedChange={handleChange}>
          Toggle
        </ToggleButton>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('when using asChild', () => {
    it('keeps component-owned ARIA state over conflicting child attributes', () => {
      render(
        <ToggleButton asChild pressed disabled>
          <span aria-pressed="false" aria-disabled="false">
            Toggle
          </span>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('falls back for a link-like child while preserving icon slots', () => {
      render(
        <ToggleButton
          asChild
          startIcon={<svg data-testid="start-icon" />}
          endIcon={<svg data-testid="end-icon" />}
        >
          <a href="/toggle">Toggle</a>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button.tagName).toBe('BUTTON');
      expect(button).not.toHaveAttribute('href');
      expect(screen.getByTestId('start-icon')).toHaveAccessibleName('');
      expect(screen.getByTestId('end-icon')).toHaveAccessibleName('');
    });

    it('adds keyboard button semantics for a non-button host', async () => {
      const user = userEvent.setup();
      render(
        <ToggleButton asChild>
          <span>Toggle</span>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toHaveAttribute('tabindex', '0');
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.keyUp(button, { key: ' ', code: 'Space' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('does not toggle when a child cancels its keyboard activation', () => {
      const handleChange = vi.fn();
      render(
        <ToggleButton asChild onPressedChange={handleChange}>
          {createElement('span', { onKeyDown: (event) => event.preventDefault() }, 'Toggle')}
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter' });

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('suppresses child activation before it runs when disabled', () => {
      const childClick = vi.fn();
      const childPointerUp = vi.fn();
      const childKeyUp = vi.fn();
      render(
        <ToggleButton asChild disabled>
          <button
            type="button"
            onClick={childClick}
            onPointerUp={childPointerUp}
            onKeyUp={childKeyUp}
          >
            Toggle
          </button>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.pointerUp(button);
      fireEvent.keyUp(button, { key: 'Enter' });
      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(childClick).not.toHaveBeenCalled();
      expect(childPointerUp).not.toHaveBeenCalled();
      expect(childKeyUp).not.toHaveBeenCalled();
    });

    it('blocks disabled slotted auxiliary activation before child handlers run', () => {
      const childAuxClick = vi.fn();
      const toggleAuxClick = vi.fn();
      render(
        <ToggleButton asChild disabled onAuxClick={toggleAuxClick}>
          <button type="button" onAuxClick={childAuxClick}>
            Toggle
          </button>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(
        button.dispatchEvent(
          new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
        ),
      ).toBe(false);
      expect(childAuxClick).not.toHaveBeenCalled();
      expect(toggleAuxClick).not.toHaveBeenCalled();
    });

    it('owns native button disabled and type semantics', () => {
      render(
        <ToggleButton asChild disabled>
          <button type="submit">Toggle</button>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('delegates owned button props and ref to a custom button host', () => {
      const ref = createRef<HTMLElement>();
      const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
      const onPressedChange = vi.fn();
      render(
        <form onSubmit={onSubmit}>
          <ToggleButton
            {...({
              form: 'external-form',
              formAction: '/unsafe',
              name: 'unsafe',
              value: 'unsafe',
            } as unknown as { form?: never })}
            asChild
            ref={ref}
            disabled
            onPressedChange={onPressedChange}
          >
            <CustomButton type="submit">Toggle</CustomButton>
          </ToggleButton>
        </form>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(ref.current).toBe(button);
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute('form');
      expect(button).not.toHaveAttribute('formaction');
      expect(button).not.toHaveAttribute('name');
      expect(button).not.toHaveAttribute('value');
      fireEvent.click(button);
      expect(onSubmit).not.toHaveBeenCalled();
      expect(onPressedChange).not.toHaveBeenCalled();
    });

    it('activates Enter on keydown and Space on keyup', () => {
      render(
        <ToggleButton asChild>
          <span>Toggle</span>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.keyUp(button, { key: 'Enter' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.keyUp(button, { key: ' ', code: 'Space' });
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('falls back to a native button for void asChild hosts', () => {
      render(
        <ToggleButton asChild aria-label="Toggle">
          <img alt="Ignored" />
        </ToggleButton>,
      );

      expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: 'Ignored' })).not.toBeInTheDocument();
    });

    it('falls back to a native button for incompatible interactive hosts', async () => {
      const user = userEvent.setup();
      const selectChange = vi.fn();
      render(
        <ToggleButton asChild>
          <select aria-label="Mode" onChange={selectChange}>
            <option>Toggle</option>
          </select>
        </ToggleButton>,
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(screen.queryByRole('combobox', { name: 'Mode' })).not.toBeInTheDocument();
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(selectChange).not.toHaveBeenCalled();
    });
  });

  it('renders startIcon and endIcon', () => {
    const StartIcon = () => <svg data-testid="start-icon" />;
    const EndIcon = () => <svg data-testid="end-icon" />;
    render(
      <ToggleButton startIcon={<StartIcon />} endIcon={<EndIcon />}>
        Toggle
      </ToggleButton>,
    );
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<ToggleButton ref={ref}>Toggle</ToggleButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('does not forward the internal variant prop to the native button', () => {
    render(<ToggleButton {...({ variant: 'soft' } as never)}>Toggle</ToggleButton>);

    expect(screen.getByRole('button')).not.toHaveAttribute('variant');
  });
});
