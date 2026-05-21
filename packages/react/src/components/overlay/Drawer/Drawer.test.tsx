import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from './index';

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

  it('manages state internally in uncontrolled mode', () => {
    render(<UncontrolledDrawer />);
    expect(screen.queryByText('Uncontrolled Drawer')).not.toBeInTheDocument();
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
    expect(
      await axe(document.body, {
        rules: {
          'aria-command-name': { enabled: false },
        },
      }),
    ).toHaveNoViolations();
  });
});
