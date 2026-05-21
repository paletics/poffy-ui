import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Modal, ModalContent, ModalTitle, ModalClose } from './index';
import { useState } from 'react';

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
  it('renders when open', () => {
    render(<TestModal />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-theme', 'light');
  });

  it('does not render when closed', () => {
    render(<TestModal defaultOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
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
    expect(
      await axe(document.body, {
        rules: {
          'aria-command-name': { enabled: false },
        },
      }),
    ).toHaveNoViolations();
  });
});
