import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DirectionProvider } from '@/providers/DirectionProvider';
import { filterFloatingFocusGuardAxeResults } from '@/testing/filterFloatingFocusGuardAxeResults';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './index';

const ControlledDrawer = ({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) => {
  const [open, setOpen] = useState(true);
  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        onOpenChange?.(val);
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Test Drawer</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

const UncontrolledDrawer = () => (
  <Drawer>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Uncontrolled Drawer</DrawerTitle>
        <DrawerClose />
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
);

/**
 * ### Test Strategy: Drawer
 * - **Focus**: Correct controlled/uncontrolled state switching, accessible component lifecycle, proper close events upon Escape/Click triggers.
 * - **DON'T**: Do not test visual snapshot layouts within the Vitest DOM. Do not test FloatingUI positioning mathematics directly.
 */
describe('Drawer', () => {
  it('opens from its trigger and returns focus after Escape', async () => {
    const onClickCapture = vi.fn();
    render(
      <Drawer>
        <DrawerTrigger onClickCapture={onClickCapture}>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Triggered Drawer</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    const trigger = screen.getByRole('button', { name: 'Open drawer' });
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

  it('does not activate a disabled asChild trigger', () => {
    const onClick = vi.fn();
    const onPointerUp = vi.fn();
    const onKeyUp = vi.fn();
    render(
      <Drawer>
        <DrawerTrigger asChild disabled>
          <a href="#blocked" onClick={onClick} onPointerUp={onPointerUp} onKeyUp={onKeyUp}>
            Disabled drawer
          </a>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Disabled Drawer</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled drawer' });
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.pointerUp(trigger);
    fireEvent.keyUp(trigger, { key: 'Enter' });

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(onClick).not.toHaveBeenCalled();
    expect(onPointerUp).not.toHaveBeenCalled();
    expect(onKeyUp).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<ControlledDrawer />);
    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'light');
  });

  it('does not render content when closed', () => {
    render(
      <Drawer open={false} onOpenChange={vi.fn()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Hidden Drawer</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.queryByText('Hidden Drawer')).not.toBeInTheDocument();
    expect(document.querySelector('[data-floating-ui-focus-guard]')).not.toBeInTheDocument();
  });

  it('closes on close button click', () => {
    const onOpenChange = vi.fn();
    render(<ControlledDrawer onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape key press', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open={true} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Escape Drawer</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(KeyboardEvent), 'escape-key');
  });

  it('keeps the drawer open when its key handler cancels Escape', () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent onKeyDown={(event) => event.preventDefault()}>
          <DrawerTitle>Cancelable drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('manages state internally in uncontrolled mode', () => {
    render(<UncontrolledDrawer />);
    expect(screen.queryByText('Uncontrolled Drawer')).not.toBeInTheDocument();
  });

  it('treats untyped open without a callback as an uncontrolled initial state', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Drawer {...({ open: true } as never)}>
        <DrawerContent>
          <DrawerClose />
          <DrawerTitle>Transitioned Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>,
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
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Callback Drawer</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Callback Drawer')).not.toBeInTheDocument();
  });

  it('does not render dangling optional title or description IDs', () => {
    render(
      <Drawer open>
        <DrawerContent aria-label="Drawer details">Content</DrawerContent>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Drawer details' });
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).not.toHaveAttribute('aria-describedby');
  });

  it('applies public appearance classes to content', () => {
    render(
      <Drawer open={true} appearance="outline">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Styled Drawer</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('poffy-drawer__content--appearance_outline');
  });

  it('resolves logical placement from provider direction while preserving physical placement', () => {
    const { rerender } = render(
      <DirectionProvider defaultDir="rtl" global={false}>
        <Drawer open placement="start">
          <DrawerContent aria-label="Logical drawer">Content</DrawerContent>
        </Drawer>
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Logical drawer' })).toHaveClass(
      'poffy-drawer__content--placement_right',
    );

    rerender(
      <DirectionProvider defaultDir="rtl" global={false}>
        <Drawer open placement="right">
          <DrawerContent aria-label="Physical drawer">Content</DrawerContent>
        </Drawer>
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Physical drawer' })).toHaveClass(
      'poffy-drawer__content--placement_right',
    );
  });

  it('lets an explicit direction override resolve logical placement', () => {
    render(
      <DirectionProvider defaultDir="rtl" global={false}>
        <Drawer open placement="end" dir="ltr">
          <DrawerContent aria-label="Explicit direction drawer">Content</DrawerContent>
        </Drawer>
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Explicit direction drawer' })).toHaveClass(
      'poffy-drawer__content--placement_right',
    );
  });

  it('has no accessibility violations when open', async () => {
    render(
      <Drawer open={true} onOpenChange={vi.fn()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Accessible Drawer</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );
    // FloatingPortal renders into document.body outside of `container`; scan the full body.
    // Floating UI focus guards are hidden technical sentinels and do not expose a user-facing name.
    expect(filterFloatingFocusGuardAxeResults(await axe(document.body))).toHaveNoViolations();
  });
});
