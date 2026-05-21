import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ButtonPrimitive } from './ButtonPrimitive';

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
});
