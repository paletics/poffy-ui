import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CloseButton } from './CloseButton';

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
 * ### Test Strategy: CloseButton
 * - **Focus**: Default and custom `aria-label`, click handling, disabled state,
 *   SVG icon presence, polymorphic `asChild` delegation, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('CloseButton', () => {
  it('renders with button role and default aria-label', () => {
    render(<CloseButton />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<CloseButton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('accepts a custom aria-label', () => {
    render(<CloseButton aria-label="Close modal" />);
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('contains the SVG close icon', () => {
    render(<CloseButton />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<CloseButton onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('never submits an owning form when callers provide a conflicting type', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CloseButton type="submit" />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('preserves active capture handlers', () => {
    const onClickCapture = vi.fn();
    const onPointerDownCapture = vi.fn();
    const onKeyDownCapture = vi.fn();
    render(
      <CloseButton
        onClickCapture={onClickCapture}
        onPointerDownCapture={onPointerDownCapture}
        onKeyDownCapture={onKeyDownCapture}
      />,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.pointerDown(button);
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(onClickCapture).toHaveBeenCalledTimes(1);
    expect(onPointerDownCapture).toHaveBeenCalledTimes(1);
    expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
  });

  describe('when disabled', () => {
    it('is marked disabled', () => {
      render(<CloseButton disabled />);
      expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<CloseButton disabled onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('delegates rendering to child element when asChild is true', () => {
    render(
      <CloseButton asChild aria-label="Dismiss notification">
        <span>Dismiss notification</span>
      </CloseButton>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss notification' }).tagName).toBe('SPAN');
  });

  it('keeps the localized default accessible name on an asChild host', () => {
    render(
      <CloseButton asChild>
        <span aria-label="Conflicting child label">Dismiss</span>
      </CloseButton>,
    );

    expect(screen.getByRole('button', { name: 'Close' }).tagName).toBe('SPAN');
  });

  it('falls back to a native button for a link-like asChild host', () => {
    render(
      <CloseButton asChild aria-label="Dismiss notification">
        <a href="#close">Dismiss notification</a>
      </CloseButton>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).not.toHaveAttribute('href');
  });

  it('falls back to a native button without losing non-element asChild content', () => {
    render(<CloseButton asChild>Dismiss notification</CloseButton>);

    expect(screen.getByRole('button', { name: 'Close' })).toHaveTextContent('Dismiss notification');
  });

  it('blocks slotted child interactions when disabled', async () => {
    const user = userEvent.setup();
    const onChildClick = vi.fn();
    render(
      <CloseButton asChild disabled aria-label="Dismiss notification">
        <button type="button" onClick={onChildClick}>
          Dismiss notification
        </button>
      </CloseButton>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(onChildClick).not.toHaveBeenCalled();
  });

  it('preserves child and component non-activation keys once when disabled asChild', () => {
    const onChildKeyDown = vi.fn();
    const onCloseButtonKeyDown = vi.fn();
    render(
      <CloseButton
        asChild
        disabled
        aria-label="Dismiss notification"
        onKeyDown={onCloseButtonKeyDown}
      >
        <button type="button" onKeyDown={onChildKeyDown}>
          Dismiss notification
        </button>
      </CloseButton>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Dismiss notification' }), { key: 'Tab' });

    expect(onChildKeyDown).toHaveBeenCalledTimes(1);
    expect(onCloseButtonKeyDown).toHaveBeenCalledTimes(1);
  });

  it('blocks slotted child capture handlers and owns slotted ARIA state when disabled', () => {
    const onChildClickCapture = vi.fn();
    const onChildPointerUpCapture = vi.fn();
    const onChildKeyUpCapture = vi.fn();
    render(
      <CloseButton asChild disabled aria-label="Dismiss notification">
        <button
          type="button"
          aria-disabled="false"
          aria-label="Conflicting label"
          onClickCapture={onChildClickCapture}
          onPointerUpCapture={onChildPointerUpCapture}
          onKeyUpCapture={onChildKeyUpCapture}
        >
          Dismiss notification
        </button>
      </CloseButton>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    fireEvent.click(button);
    fireEvent.pointerUp(button);
    fireEvent.keyUp(button, { key: 'Enter' });

    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(onChildClickCapture).not.toHaveBeenCalled();
    expect(onChildPointerUpCapture).not.toHaveBeenCalled();
    expect(onChildKeyUpCapture).not.toHaveBeenCalled();
  });

  it('blocks auxiliary activation before disabled slotted child handlers run', () => {
    const onChildAuxClick = vi.fn();
    const onCloseButtonAuxClick = vi.fn();
    render(
      <CloseButton
        asChild
        disabled
        onAuxClick={onCloseButtonAuxClick}
        aria-label="Dismiss notification"
      >
        <button type="button" onAuxClick={onChildAuxClick}>
          Dismiss notification
        </button>
      </CloseButton>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(
      button.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildAuxClick).not.toHaveBeenCalled();
    expect(onCloseButtonAuxClick).not.toHaveBeenCalled();
  });

  it('gives a non-native asChild host button semantics and keyboard activation', () => {
    const onClick = vi.fn();
    render(
      <CloseButton asChild aria-label="Dismiss notification" onClick={onClick}>
        <div>Dismiss notification</div>
      </CloseButton>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('falls back for link-like custom hosts and preserves custom button activation', () => {
    const onLinkClick = vi.fn();
    const onCloseLinkClick = vi.fn();
    const onButtonClick = vi.fn();
    const onCloseButtonClick = vi.fn();
    render(
      <>
        <CloseButton asChild aria-label="Custom link" onClick={onCloseLinkClick}>
          <CustomLink href="#custom-link-target" onClick={onLinkClick}>
            Custom link
          </CustomLink>
        </CloseButton>
        <CloseButton asChild aria-label="Custom button" onClick={onCloseButtonClick}>
          <CustomButton onClick={onButtonClick}>Custom button</CustomButton>
        </CloseButton>
      </>,
    );

    const linkFallback = screen.getByRole('button', { name: 'Custom link' });
    const button = screen.getByRole('button', { name: 'Custom button' });
    expect(linkFallback.tagName).toBe('BUTTON');
    fireEvent.click(linkFallback);
    expect(onLinkClick).not.toHaveBeenCalled();
    expect(onCloseLinkClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onButtonClick).not.toHaveBeenCalled();
    expect(onCloseButtonClick).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('emulates href-less anchors and falls back for incompatible interactive hosts', () => {
    const onAnchorClick = vi.fn();
    const onSummaryClick = vi.fn();
    const onCloseSummaryClick = vi.fn();
    render(
      <>
        <CloseButton asChild aria-label="Href-less anchor" onClick={onAnchorClick}>
          {createElement('a', null, 'Href-less anchor')}
        </CloseButton>
        <details>
          <CloseButton asChild aria-label="Summary" onClick={onCloseSummaryClick}>
            <summary onClick={onSummaryClick}>Summary</summary>
          </CloseButton>
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
    expect(onCloseSummaryClick).toHaveBeenCalledTimes(1);
  });

  it('forces type=button on a native button asChild host', () => {
    render(
      <CloseButton asChild aria-label="Dismiss notification">
        <button type="submit">Dismiss notification</button>
      </CloseButton>,
    );

    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('delegates owned button props and ref to a custom button host', () => {
    const ref = { current: null as HTMLButtonElement | null };
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CloseButton
          {...({
            form: 'external-form',
            formAction: '/unsafe',
            name: 'unsafe',
            value: 'unsafe',
          } as unknown as { form?: never })}
          asChild
          ref={ref}
          disabled
          aria-label="Dismiss notification"
        >
          <CustomButton type="submit">Dismiss notification</CustomButton>
        </CloseButton>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('form');
    expect(button).not.toHaveAttribute('formaction');
    expect(button).not.toHaveAttribute('name');
    expect(button).not.toHaveAttribute('value');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('falls back to a native button for void asChild hosts', () => {
    render(
      <CloseButton asChild aria-label="Dismiss notification">
        <input aria-label="Ignored" />
      </CloseButton>,
    );

    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Ignored' })).not.toBeInTheDocument();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
