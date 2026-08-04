import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '../Popover';
import { MessageModal, Modal, ModalContent, ModalTitle, ModalClose, ModalTrigger } from './index';
import { createRef, forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { filterFloatingFocusGuardAxeResults } from '@/testing/filterFloatingFocusGuardAxeResults';

const TestModal = ({ defaultOpen = true }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalClose />
        <ModalTitle>Test Modal</ModalTitle>
      </ModalContent>
    </Modal>
  );
};

/**
 * ### Test Strategy: Modal
 * - **Focus**: Conditional rendering, close on interaction (Escape, close button), defaultOpen state, and WAI-ARIA dialog compliance via axe.
 * - **DON'T**: Do not assert visual styling or Panda CSS rules.
 */
describe('Modal', () => {
  it('fail-closes duplicate parts hidden behind an opaque wrapper and promotes the survivor', async () => {
    const OpaqueParts = ({ showFirst }: { showFirst: boolean }) => (
      <>
        {showFirst ? (
          <>
            <ModalTrigger>First trigger</ModalTrigger>
            <ModalContent>
              <ModalTitle>First content</ModalTitle>
            </ModalContent>
          </>
        ) : null}
        <ModalTrigger>Second trigger</ModalTrigger>
        <ModalContent>
          <ModalTitle>Second content</ModalTitle>
        </ModalContent>
      </>
    );
    const { rerender } = render(
      <Modal defaultOpen>
        <OpaqueParts showFirst />
      </Modal>,
    );

    expect(screen.getByText('First trigger').closest('button')).toBeInTheDocument();
    expect(screen.queryByText('Second trigger')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'First content' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Second content' })).not.toBeInTheDocument();

    rerender(
      <Modal defaultOpen>
        <OpaqueParts showFirst={false} />
      </Modal>,
    );

    await waitFor(() =>
      expect(screen.getByText('Second trigger').closest('button')).toBeInTheDocument(),
    );
    expect(screen.getByRole('dialog', { name: 'Second content' })).toBeInTheDocument();
  });

  it('localizes the fallback label after title registration remains absent', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Modal defaultOpen>
          <ModalContent>内容</ModalContent>
        </Modal>
      </LocaleProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'ダイアログ' })).toBeInTheDocument();
    await waitFor(() => expect(warning).toHaveBeenCalledWith(expect.stringContaining('Title')));
    warning.mockRestore();
  });
  it('opens from its trigger and returns focus after Escape', async () => {
    const onClickCapture = vi.fn();
    render(
      <Modal>
        <ModalTrigger onClickCapture={onClickCapture}>Open modal</ModalTrigger>
        <ModalContent>
          <ModalClose />
          <ModalTitle>Triggered Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onClickCapture).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  it('owns delegated trigger state attributes without clearing unrelated child ARIA', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Modal>
        <ModalTrigger asChild ref={ref}>
          <button
            aria-controls="wrong-dialog"
            aria-describedby="child-description"
            aria-expanded={false}
            aria-haspopup="menu"
            data-state="stale"
          >
            Open delegated modal
          </button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Delegated Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open delegated modal' });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveAttribute('aria-describedby', 'child-description');

    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Delegated Modal' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-describedby', 'child-description');
  });

  it('owns wrapper trigger state and the content id reference', () => {
    render(
      <Modal>
        <ModalTrigger aria-controls="wrong-dialog" aria-expanded={false} aria-haspopup="menu">
          Open wrapper modal
        </ModalTrigger>
        <ModalContent id="custom-dialog-id">
          <ModalTitle>Wrapper Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open wrapper modal' });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Wrapper Modal' });
    expect(dialog.id).not.toBe('custom-dialog-id');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
  });

  it('owns delegated native-button disabled state', () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <button disabled aria-disabled="true" tabIndex={-1}>
            Child-disabled modal
          </button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Disabled by child</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Child-disabled modal' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');
    expect(trigger).toHaveAttribute('tabindex', '0');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Disabled by child' })).toBeInTheDocument();
  });

  it('owns delegated custom-button disabled state and tab position', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Modal>
          <ModalTrigger asChild>
            <CustomButton disabled tabIndex={-1}>
              Custom child-disabled modal
            </CustomButton>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Custom disabled by child</ModalTitle>
          </ModalContent>
        </Modal>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom child-disabled modal' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(trigger).toHaveAttribute('type', 'button');
    fireEvent.click(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Custom disabled by child' })).toBeInTheDocument();
  });

  it.each([
    ['a non-button role', { role: 'checkbox' }],
    ['editable content', { contentEditable: true }],
  ])('falls back from a custom trigger with %s', (_name, unsafeProps) => {
    const CustomHost = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>((props, ref) => (
      <div ref={ref} {...props} />
    ));
    CustomHost.displayName = 'CustomHost';
    render(
      <Modal>
        <ModalTrigger asChild>
          <CustomHost {...unsafeProps}>Open safe custom modal</CustomHost>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Safe custom modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open safe custom modal' });
    expect(trigger.tagName).toBe('BUTTON');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Safe custom modal' })).toBeInTheDocument();
  });

  it('preserves an unsafe custom trigger accessible name on its fallback button', () => {
    const CustomHost = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>((props, ref) => (
      <div ref={ref} {...props} />
    ));
    CustomHost.displayName = 'CustomHost';
    render(
      <Modal>
        <ModalTrigger asChild>
          <CustomHost role="checkbox" aria-label="Open named custom modal" />
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Named custom modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open named custom modal' });
    expect(trigger).toBeEmptyDOMElement();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Named custom modal' })).toBeInTheDocument();
  });

  it('preserves a normalized label fallback beside a dangling labelledby reference', () => {
    const CustomHost = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>((props, ref) => (
      <div ref={ref} {...props} />
    ));
    CustomHost.displayName = 'CustomHost';
    render(
      <Modal>
        <ModalTrigger asChild>
          <CustomHost
            role="checkbox"
            aria-labelledby="missing-modal-name"
            aria-label="  Open named custom modal  "
          />
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Named custom modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open named custom modal' });
    expect(trigger).toHaveAttribute('aria-labelledby', 'missing-modal-name');
    expect(trigger).toHaveAttribute('aria-label', 'Open named custom modal');
  });

  it.each([
    ['form host', <form key="form">Open constrained modal</form>],
    [
      'table host',
      <table key="table">
        <tbody>
          <tr>
            <td>Open constrained modal</td>
          </tr>
        </tbody>
      </table>,
    ],
    [
      'nested button',
      <div key="button">
        <button type="button">Open constrained modal</button>
      </div>,
    ],
    [
      'nested link',
      <span key="link">
        <a href="#unsafe">Open constrained modal</a>
      </span>,
    ],
  ])('falls back from an unsafe native trigger with %s', (_name, child) => {
    render(
      <Modal>
        <ModalTrigger asChild>{child}</ModalTrigger>
        <ModalContent>
          <ModalTitle>Constrained modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open constrained modal' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.querySelector('button, a, form, table')).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Constrained modal' })).toBeInTheDocument();
  });

  it('forwards an asChild ref to a non-button trigger host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Modal>
        <ModalTrigger asChild ref={ref}>
          <a href="#modal">Open link modal</a>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Link Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Open link modal' }));
  });

  it('treats an asChild anchor as a dialog button instead of navigating', () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <a href="#modal">Open link modal</a>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Link Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open link modal' });
    expect(fireEvent.click(trigger)).toBe(false);
    expect(screen.getByRole('dialog', { name: 'Link Modal' })).toBeInTheDocument();
  });

  it('respects preventDefault from an asChild anchor trigger', () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <a href="#modal" onClick={(event) => event.preventDefault()}>
            Open modal
          </a>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('emulates button semantics for a passive asChild trigger', () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <div>Open keyboard modal</div>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Keyboard Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open keyboard modal' });
    expect(trigger).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('dialog', { name: 'Keyboard Modal' })).toBeInTheDocument();
  });

  it('does not activate a disabled asChild trigger', () => {
    const onClick = vi.fn();
    const onPointerUp = vi.fn();
    const onKeyUp = vi.fn();
    const onChildKeyDown = vi.fn();
    const onTriggerKeyDown = vi.fn();
    const onAuxClick = vi.fn();
    const onAuxClickCapture = vi.fn();
    render(
      <Modal>
        <ModalTrigger
          asChild
          disabled
          onAuxClickCapture={onAuxClickCapture}
          onKeyDown={onTriggerKeyDown}
        >
          <a
            href="#blocked"
            onAuxClick={onAuxClick}
            onClick={onClick}
            onKeyDown={onChildKeyDown}
            onPointerUp={onPointerUp}
            onKeyUp={onKeyUp}
          >
            Disabled modal
          </a>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Disabled Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled modal' });
    fireEvent.keyDown(trigger, { key: 'Tab' });
    expect(onChildKeyDown).toHaveBeenCalledOnce();
    expect(onTriggerKeyDown).toHaveBeenCalledOnce();
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.pointerUp(trigger);
    fireEvent.keyUp(trigger, { key: 'Enter' });
    expect(
      trigger.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
    expect(onChildKeyDown).toHaveBeenCalledOnce();
    expect(onTriggerKeyDown).toHaveBeenCalledOnce();
    expect(onPointerUp).not.toHaveBeenCalled();
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(onAuxClick).not.toHaveBeenCalled();
    expect(onAuxClickCapture).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('falls back to a native trigger while preserving void asChild content', () => {
    render(
      <Modal>
        <ModalTrigger asChild aria-label="Open image modal">
          <img alt="Modal artwork" />
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Image Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open image modal' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(screen.getByRole('img', { name: 'Modal artwork' })).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Image Modal' })).toBeInTheDocument();
  });

  it('falls back from a non-HTML intrinsic trigger to a native button', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Modal>
        <ModalTrigger asChild ref={ref} aria-label="Open SVG modal">
          <svg viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="5" />
          </svg>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>SVG Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open SVG modal' });
    expect(trigger).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(trigger);
    expect(trigger.querySelector('svg')).toBeNull();

    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'SVG Modal' })).toBeInTheDocument();
  });

  it('falls back to a div dialog surface for interactive asChild content', () => {
    render(
      <Modal open>
        <ModalContent asChild data-testid="modal-content">
          <button>Unsafe dialog surface</button>
        </ModalContent>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Dialog' });
    expect(dialog).toHaveAttribute('data-testid', 'modal-content');
    expect(dialog.tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Unsafe dialog surface' })).not.toHaveAttribute(
      'role',
      'dialog',
    );
  });

  it('drops an unsafe input host when falling back to a native trigger', () => {
    render(
      <Modal>
        <ModalTrigger asChild aria-label="Open safe modal">
          <input aria-label="Nested input" />
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Safe Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Open safe modal' });
    expect(trigger.querySelector('input')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Safe Modal' })).toBeInTheDocument();
  });

  it('owns native button semantics for an asChild trigger', () => {
    render(
      <Modal>
        <ModalTrigger asChild disabled>
          <button type="submit">Disabled native modal</button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Native Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled native modal' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes only the nested popover on the first Escape', () => {
    render(
      <Modal>
        <ModalTrigger>Open modal</ModalTrigger>
        <ModalContent>
          <ModalTitle>Outer modal</ModalTitle>
          <Popover>
            <PopoverTrigger>Open popover</PopoverTrigger>
            <PopoverContent>
              <PopoverTitle>Nested popover</PopoverTitle>
            </PopoverContent>
          </Popover>
        </ModalContent>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(screen.getByText('Nested popover')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Nested popover')).not.toBeInTheDocument();
    expect(screen.getByText('Outer modal')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Outer modal')).not.toBeInTheDocument();
  });

  it('returns focus through nested modals as Escape unwinds the tree', async () => {
    render(
      <Modal>
        <ModalTrigger>Open outer modal</ModalTrigger>
        <ModalContent>
          <ModalTitle>Outer modal</ModalTitle>
          <Modal>
            <ModalTrigger>Open inner modal</ModalTrigger>
            <ModalContent>
              <ModalClose aria-label="Close inner modal" />
              <ModalTitle>Inner modal</ModalTitle>
            </ModalContent>
          </Modal>
        </ModalContent>
      </Modal>,
    );

    const outerTrigger = screen.getByRole('button', { name: 'Open outer modal' });
    fireEvent.click(outerTrigger);
    const innerTrigger = screen.getByRole('button', { name: 'Open inner modal' });
    innerTrigger.focus();
    fireEvent.click(innerTrigger);
    expect(screen.getByText('Inner modal')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(document.activeElement).toBe(innerTrigger));
    expect(screen.getByText('Outer modal')).toBeInTheDocument();
    expect(screen.queryByText('Inner modal')).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(document.activeElement).toBe(outerTrigger));
    expect(screen.queryByText('Outer modal')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<TestModal />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'light');
  });

  it('does not render when closed', () => {
    render(<TestModal defaultOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('closes on close button click', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalClose />
          <ModalTitle>Test Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape key press', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(KeyboardEvent), 'escape-key');
  });

  it('keeps the dialog open when its key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent onKeyDown={(event) => event.preventDefault()}>
          <ModalTitle>Cancelable dialog</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('respects defaultOpen for uncontrolled mode', () => {
    render(
      <Modal defaultOpen={true}>
        <ModalContent>
          <ModalTitle>Uncontrolled Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByText('Uncontrolled Modal')).toBeInTheDocument();
  });

  it('treats untyped open without a callback as an uncontrolled initial state', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Modal {...({ open: true } as never)}>
        <ModalContent>
          <ModalClose />
          <ModalTitle>Transitioned Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    warning.mockRestore();
  });

  it('updates internal state for callback-only uncontrolled consumers', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal defaultOpen onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalClose />
          <ModalTitle>Callback Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Callback Modal')).not.toBeInTheDocument();
  });

  it('closes an uncontrolled MessageModal after its OK callback', () => {
    const okHandle = vi.fn();
    render(
      <MessageModal defaultOpen title="Uncontrolled message" okHandle={okHandle}>
        Message body
      </MessageModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(okHandle).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog', { name: 'Uncontrolled message' })).not.toBeInTheDocument();
  });

  it('localizes default MessageModal action labels while preserving explicit labels', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <MessageModal
          defaultOpen
          title="確認"
          okHandle={() => undefined}
          onCancel={() => undefined}
          cancelLabel="戻る"
        >
          メッセージ
        </MessageModal>
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '戻る' })).toBeInTheDocument();
  });

  it('closes an uncontrolled MessageModal after its Cancel callback', () => {
    const onCancel = vi.fn();
    render(
      <MessageModal defaultOpen title="Cancelable message" onCancel={onCancel}>
        Message body
      </MessageModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog', { name: 'Cancelable message' })).not.toBeInTheDocument();
  });

  it('requests close without mutating a controlled MessageModal', () => {
    const onOpenChange = vi.fn();
    render(
      <MessageModal
        open
        onOpenChange={onOpenChange}
        title="Controlled message"
        onCancel={() => undefined}
      >
        Message body
      </MessageModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog', { name: 'Controlled message' })).toBeInTheDocument();
  });

  it('falls back safely for an untyped MessageModal open with a non-function callback', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <MessageModal
        {...({
          open: true,
          defaultOpen: false,
          onOpenChange: 'not-a-function',
        } as never)}
        title="Legacy message"
        onCancel={() => undefined}
      >
        Message body
      </MessageModal>,
    );

    expect(screen.getByRole('dialog', { name: 'Legacy message' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog', { name: 'Legacy message' })).not.toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('falls back to uncontrolled'));
    warning.mockRestore();
  });

  it('does not render dangling optional title or description IDs', () => {
    render(
      <Modal open>
        <ModalContent aria-label="Modal details">Content</ModalContent>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Modal details' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('applies public appearance classes to content', () => {
    render(
      <Modal open={true} appearance="outline">
        <ModalContent>
          <ModalTitle>Styled Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('poffy-modal__content--appearance_outline');
  });

  it('lets explicit brand and theme override provider-free defaults', () => {
    render(
      <Modal open={true} brand="pome" theme="dark">
        <ModalContent>
          <ModalTitle>Custom Theme Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'pome');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'dark');
  });

  it('bridges scoped motion preferences into the portal', () => {
    render(
      <ThemeProvider global={false} defaultAnimationEnabled={false}>
        <TestModal />
      </ThemeProvider>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.closest('[data-animation]')).toHaveAttribute('data-animation', 'disabled');
    expect(dialog.closest('[data-animation]')).toHaveAttribute('data-motion-style', 'none');
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Modal open={true} onOpenChange={vi.fn()}>
        <ModalContent>
          <ModalClose />
          <ModalTitle>Accessible Modal</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    // FloatingPortal renders into document.body outside of `container`; scan the full body.
    // Floating UI focus guards are hidden technical sentinels and do not expose a user-facing name.
    expect(filterFloatingFocusGuardAxeResults(await axe(document.body))).toHaveNoViolations();
  });
});
