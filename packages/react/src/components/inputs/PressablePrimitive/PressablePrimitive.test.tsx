import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { PressablePrimitive } from './PressablePrimitive';

describe('PressablePrimitive', () => {
  it('renders as a native button by default', () => {
    render(<PressablePrimitive>Press</PressablePrimitive>);
    const button = screen.getByRole('button', { name: 'Press' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PressablePrimitive>Press</PressablePrimitive>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports click handling via onPress', () => {
    const onPress = vi.fn();
    render(<PressablePrimitive onPress={onPress}>Press</PressablePrimitive>);
    fireEvent.click(screen.getByRole('button', { name: 'Press' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('preserves press callback order and consumer vetoes', () => {
    const calls: string[] = [];
    const onPress = vi.fn(() => calls.push('press'));
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => {
      calls.push('click');
      event.preventDefault();
    });
    const onPressKeyDown = vi.fn((event: React.KeyboardEvent<HTMLElement>) => {
      calls.push('press-keydown');
      event.preventDefault();
    });
    const onKeyDown = vi.fn(() => calls.push('keydown'));

    render(
      <PressablePrimitive
        asChild
        onClick={onClick}
        onPress={onPress}
        onPressKeyDown={onPressKeyDown}
        onKeyDown={onKeyDown}
      >
        <div>Custom</div>
      </PressablePrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(calls).toEqual(['press-keydown', 'keydown']);

    fireEvent.click(button);
    expect(calls).toEqual(['press-keydown', 'keydown', 'click']);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('runs press callbacks in order for an allowed keyboard activation', () => {
    const calls: string[] = [];
    render(
      <PressablePrimitive
        asChild
        onClick={() => calls.push('click')}
        onPress={() => calls.push('press')}
        onPressKeyDown={() => calls.push('press-keydown')}
        onKeyDown={() => calls.push('keydown')}
      >
        <div>Custom</div>
      </PressablePrimitive>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Custom' }), { key: 'Enter' });

    expect(calls).toEqual(['press-keydown', 'keydown', 'click', 'press']);
  });

  it('blocks interaction when disabled', () => {
    const onClick = vi.fn();
    const onPress = vi.fn();
    render(
      <PressablePrimitive disabled onClick={onClick} onPress={onPress}>
        Press
      </PressablePrimitive>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Press' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('blocks slotted child handlers when disabled', () => {
    const onChildClick = vi.fn();
    const onChildKeyDown = vi.fn();
    const onChildKeyUp = vi.fn();
    render(
      <PressablePrimitive asChild disabled>
        <a href="/test" onClick={onChildClick} onKeyDown={onChildKeyDown} onKeyUp={onChildKeyUp}>
          Disabled link
        </a>
      </PressablePrimitive>,
    );

    const link = screen.getByRole('link', { name: 'Disabled link' });
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: 'Enter' });
    fireEvent.keyUp(link, { key: 'Enter' });
    expect(onChildClick).not.toHaveBeenCalled();
    expect(onChildKeyDown).not.toHaveBeenCalled();
    expect(onChildKeyUp).not.toHaveBeenCalled();
  });

  it('blocks disabled slotted auxiliary activation before child handlers run', () => {
    const onChildAuxClick = vi.fn();
    const onPressableAuxClick = vi.fn();
    render(
      <PressablePrimitive asChild disabled onAuxClick={onPressableAuxClick}>
        <a href="/test" onAuxClick={onChildAuxClick}>
          Disabled link
        </a>
      </PressablePrimitive>,
    );

    const link = screen.getByRole('link', { name: 'Disabled link' });
    expect(
      link.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildAuxClick).not.toHaveBeenCalled();
    expect(onPressableAuxClick).not.toHaveBeenCalled();
  });

  it('owns disabled state while preserving native button type semantics for asChild', () => {
    render(
      <PressablePrimitive asChild disabled>
        <button type="submit">Disabled button</button>
      </PressablePrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Disabled button' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('falls back to a native button for void asChild hosts', () => {
    const { container } = render(
      <PressablePrimitive asChild aria-label="Fallback pressable">
        <input type="button" value="Unsafe host" />
      </PressablePrimitive>,
    );

    expect(container.querySelector('input')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fallback pressable' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('allows tab navigation from a disabled slotted child', async () => {
    const user = userEvent.setup();
    render(
      <>
        <PressablePrimitive asChild disabled>
          <a href="/test">Disabled link</a>
        </PressablePrimitive>
        <button type="button">Next</button>
      </>,
    );

    screen.getByRole('link', { name: 'Disabled link' }).focus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('supports asChild button semantics and keyboard press fallback', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <div>Custom</div>
      </PressablePrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores repeated keyboard fallback presses for asChild controls', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <div>Custom</div>
      </PressablePrimitive>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    fireEvent.keyDown(button, { key: ' ', repeat: false });
    fireEvent.keyDown(button, { key: ' ', repeat: true });
    expect(onPress).not.toHaveBeenCalled();
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not trigger keyboard fallback for native clickable children', () => {
    const onPress = vi.fn();
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <a href="/test">Custom Link</a>
      </PressablePrimitive>,
    );

    fireEvent.keyDown(screen.getByRole('link', { name: 'Custom Link' }), { key: 'Enter' });
    expect(onPress).not.toHaveBeenCalled();

    const link = screen.getByRole('link', { name: 'Custom Link' });
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    expect(link.dispatchEvent(click)).toBe(true);
    expect(click.defaultPrevented).toBe(false);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('prevents navigation when a custom asChild component renders an anchor', () => {
    const onPress = vi.fn();
    const CustomAnchor = forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>((props, ref) => (
      <a ref={ref} {...props}>
        {props.children}
      </a>
    ));
    CustomAnchor.displayName = 'CustomAnchor';
    render(
      <PressablePrimitive asChild onPress={onPress}>
        <CustomAnchor href="/custom">Custom anchor</CustomAnchor>
      </PressablePrimitive>,
    );

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    expect(screen.getByRole('button', { name: 'Custom anchor' }).dispatchEvent(click)).toBe(false);
    expect(click.defaultPrevented).toBe(true);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('prevents form submission when a custom asChild component renders a button', () => {
    const onPress = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const CustomButton = forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    render(
      <form onSubmit={onSubmit}>
        <PressablePrimitive asChild onPress={onPress}>
          <CustomButton type="submit">Custom button</CustomButton>
        </PressablePrimitive>
      </form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Custom button' }));

    expect(onPress).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
