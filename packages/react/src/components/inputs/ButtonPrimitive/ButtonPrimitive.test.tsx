import { render, screen, fireEvent } from '@testing-library/react';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentType, FormEvent, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ButtonPrimitive } from './ButtonPrimitive';

const RuntimeButtonPrimitive = ButtonPrimitive as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

describe('ButtonPrimitive', () => {
  it('renders as a native button by default', () => {
    render(<ButtonPrimitive>Click</ButtonPrimitive>);
    const button = screen.getByRole('button', { name: 'Click' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ButtonPrimitive>Click</ButtonPrimitive>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onClick when activated', () => {
    const onClick = vi.fn();
    render(<ButtonPrimitive onClick={onClick}>Click</ButtonPrimitive>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports asChild and keeps aria-disabled semantics', () => {
    render(
      <ButtonPrimitive asChild disabled>
        <a href="/test">Custom Trigger</a>
      </ButtonPrimitive>,
    );

    const trigger = screen.getByRole('link', { name: 'Custom Trigger' });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toHaveAttribute('disabled');
  });

  it('does not delegate wrapper-owned native button attributes at runtime', () => {
    render(
      <RuntimeButtonPrimitive
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
        <a href="/test">Custom Trigger</a>
      </RuntimeButtonPrimitive>,
    );

    const link = screen.getByRole('link', { name: 'Custom Trigger' });
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

  it('does not infer native button props for a custom asChild host', () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ButtonPrimitive asChild disabled>
          <CustomButton>Save</CustomButton>
        </ButtonPrimitive>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute('type');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('preserves native props explicitly owned by a custom asChild host', () => {
    render(
      <ButtonPrimitive asChild>
        <CustomButton disabled type="submit">
          Save
        </CustomButton>
      </ButtonPrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('keeps component-owned disabled ARIA state over conflicting props', () => {
    render(
      <ButtonPrimitive disabled aria-disabled="false">
        Click
      </ButtonPrimitive>,
    );
    expect(screen.getByRole('button', { name: 'Click' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('falls back to a native button for invalid asChild content', () => {
    render(<ButtonPrimitive asChild>Click</ButtonPrimitive>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('blocks click interaction when disabled with asChild', () => {
    const onClick = vi.fn();

    render(
      <ButtonPrimitive asChild disabled onClick={onClick}>
        <a href="/test">Custom Trigger</a>
      </ButtonPrimitive>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Custom Trigger' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks child click interaction when disabled with asChild', () => {
    const onClick = vi.fn();
    const onClickCapture = vi.fn();

    render(
      <ButtonPrimitive asChild disabled>
        <a href="/test" onClick={onClick} onClickCapture={onClickCapture}>
          Custom Trigger
        </a>
      </ButtonPrimitive>,
    );

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const dispatched = screen.getByRole('link', { name: 'Custom Trigger' }).dispatchEvent(event);

    expect(dispatched).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
    expect(onClickCapture).not.toHaveBeenCalled();
  });

  it('blocks keyboard interaction when disabled with asChild', () => {
    const onKeyDown = vi.fn();

    render(
      <ButtonPrimitive asChild disabled onKeyDown={onKeyDown}>
        <a href="/test">Custom Trigger</a>
      </ButtonPrimitive>,
    );

    fireEvent.keyDown(screen.getByRole('link', { name: 'Custom Trigger' }), { key: 'Enter' });
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('blocks child keyboard interaction when disabled with asChild', () => {
    const onKeyDown = vi.fn();
    const onKeyDownCapture = vi.fn();

    render(
      <ButtonPrimitive asChild disabled>
        <a href="/test" onKeyDown={onKeyDown} onKeyDownCapture={onKeyDownCapture}>
          Custom Trigger
        </a>
      </ButtonPrimitive>,
    );

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    const dispatched = screen.getByRole('link', { name: 'Custom Trigger' }).dispatchEvent(event);

    expect(dispatched).toBe(false);
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(onKeyDownCapture).not.toHaveBeenCalled();
  });

  it('blocks child keyup and pointer activation when disabled with asChild', () => {
    const onKeyUp = vi.fn();
    const onKeyUpCapture = vi.fn();
    const onPointerDown = vi.fn();
    const onPointerUpCapture = vi.fn();
    render(
      <ButtonPrimitive asChild disabled>
        <a
          href="/test"
          aria-disabled="false"
          onKeyUp={onKeyUp}
          onKeyUpCapture={onKeyUpCapture}
          onPointerDown={onPointerDown}
          onPointerUpCapture={onPointerUpCapture}
        >
          Custom Trigger
        </a>
      </ButtonPrimitive>,
    );

    const trigger = screen.getByRole('link', { name: 'Custom Trigger' });
    fireEvent.keyUp(trigger, { key: 'Enter' });
    fireEvent.pointerDown(trigger);
    fireEvent.pointerUp(trigger);

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(onKeyUpCapture).not.toHaveBeenCalled();
    expect(onPointerDown).not.toHaveBeenCalled();
    expect(onPointerUpCapture).not.toHaveBeenCalled();
  });

  it('blocks disabled slotted auxiliary activation before child handlers run', () => {
    const onChildAuxClick = vi.fn();
    const onButtonAuxClick = vi.fn();
    render(
      <ButtonPrimitive asChild disabled onAuxClick={onButtonAuxClick}>
        <a href="/test" onAuxClick={onChildAuxClick}>
          Custom Trigger
        </a>
      </ButtonPrimitive>,
    );

    const trigger = screen.getByRole('link', { name: 'Custom Trigger' });
    expect(
      trigger.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildAuxClick).not.toHaveBeenCalled();
    expect(onButtonAuxClick).not.toHaveBeenCalled();
  });

  it('owns disabled state while preserving native button type semantics for asChild', () => {
    render(
      <ButtonPrimitive asChild disabled>
        <button type="submit">Custom Trigger</button>
      </ButtonPrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom Trigger' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('preserves presentation children for every native button path', () => {
    const CustomIcon = () => <svg data-testid="custom-icon" />;
    const { rerender } = render(
      <ButtonPrimitive>
        <span data-testid="default-label">Label</span>
        <CustomIcon />
      </ButtonPrimitive>,
    );

    expect(screen.getByTestId('default-label')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();

    rerender(
      <ButtonPrimitive asChild>
        <button type="submit">
          <span data-testid="slotted-label">Label</span>
          <CustomIcon />
        </button>
      </ButtonPrimitive>,
    );

    const slottedButton = screen.getByRole('button', { name: 'Label' });
    expect(slottedButton).toHaveAttribute('type', 'submit');
    expect(screen.getByTestId('slotted-label')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('adds button semantics and standard keyboard activation to non-native asChild hosts', () => {
    const onClick = vi.fn();
    render(
      <ButtonPrimitive asChild onClick={onClick}>
        <div>Custom Trigger</div>
      </ButtonPrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom Trigger' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('falls back to a native button for void asChild hosts', () => {
    render(
      <ButtonPrimitive asChild aria-label="Custom Trigger">
        <img alt="Ignored" />
      </ButtonPrimitive>,
    );

    expect(screen.getByRole('button', { name: 'Custom Trigger' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Ignored' })).not.toBeInTheDocument();
  });

  it('falls back to a native button for incompatible interactive asChild hosts', () => {
    render(
      <ButtonPrimitive asChild aria-label="Custom Trigger">
        <select aria-label="Select target">
          <option>Custom Trigger</option>
        </select>
      </ButtonPrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom Trigger' });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Select target' })).not.toBeInTheDocument();
    expect(button.querySelector('option')).toBeNull();
  });

  it('falls back to a native button for editable asChild hosts', () => {
    const { container } = render(
      <ButtonPrimitive asChild aria-label="Custom Trigger">
        <div contentEditable="plaintext-only">Custom Trigger</div>
      </ButtonPrimitive>,
    );

    expect(screen.getByRole('button', { name: 'Custom Trigger' })).toBeInTheDocument();
    expect(container.querySelector('[contenteditable]')).toBeNull();
  });
});
