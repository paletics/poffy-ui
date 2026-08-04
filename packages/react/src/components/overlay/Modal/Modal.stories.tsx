import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  MessageModal,
} from './index';
import type { ModalProps } from './Modal.types';


const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const extraContentClass = css({ py: 'lg' });
const extraLineClass = css({ my: 'sm' });
const buttonRowClass = css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' });
const customSectionClass = css({
  bg: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
  p: '2xl',
  borderRadius: '3xl',
  borderWidth: '4px',
  borderStyle: 'dashed',
  borderColor: '[#ec407a]',
  maxWidth: '[500px]',
  m: 'auto',
  position: 'relative',
});
const customCloseClass = css({
  position: 'absolute',
  top: 'lg',
  right: 'lg',
  fontSize: '2xl',
  border: 'none',
  bg: 'none',
  cursor: 'pointer',
});

const ModalWithState = (args: ModalProps) => {
  const [open, setOpen] = useState(args.defaultOpen ?? false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {String(args.size ?? 'default')} Modal</Button>
      <Modal {...args} open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalClose />
          <ModalHeader>
            <ModalTitle>Modal Title ({String(args.size ?? 'md')})</ModalTitle>
            <ModalDescription>
              This is a description of the modal. Scroll behavior is{' '}
              {String(args.scrollBehavior ?? 'inside')}.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>This is the body content of the modal. You can put anything here.</p>
            {args.scrollBehavior === 'outside' || args.size === 'full' ? (
              <div className={extraContentClass}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <p key={i} className={extraLineClass}>
                    Extra content line {i + 1} to demonstrate scrolling.
                  </p>
                ))}
              </div>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button appearance="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const Default: Story = {
  args: {
    appearance: 'soft',
  },
  render: (args) => <ModalWithState {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => <ModalWithState />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /open default modal/i }));
    await expect(await body.findByRole('dialog')).toHaveAttribute('data-state', 'open');
  },
};

export const AccessibilityOpen: Story = {
  args: {
    appearance: 'soft',
    defaultOpen: true,
  },
  render: (args) => <ModalWithState {...args} />,
};

export const Message: Story = {
  render: () => (
    <MessageModal
      defaultOpen
      title="Archive project"
      okHandle={() => undefined}
      onCancel={() => undefined}
    >
      The project will be archived. You can restore it later from the archived projects list.
    </MessageModal>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={buttonRowClass}>
      <ModalWithState size="sm" />
      <ModalWithState size="md" />
      <ModalWithState size="lg" />
      <ModalWithState size="xl" />
      <ModalWithState size="full" />
    </div>
  ),
};

export const FullViewport: Story = {
  render: () => <ModalWithState size="full" />,
};

export const ScrollOutside: Story = {
  args: {
    scrollBehavior: 'outside',
  },
  render: (args) => <ModalWithState {...args} />,
};

export const Brands: Story = {
  render: () => (
    <div className={buttonRowClass}>
      <ModalWithState brand="pome" />
      <ModalWithState brand="blue" />
    </div>
  ),
};

const AsChildDemo = (args: ModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open asChild Modal</Button>
      <Modal {...args} open={open} onOpenChange={setOpen}>
        <ModalContent asChild>
          <section className={customSectionClass}>
            <ModalClose asChild>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={customCloseClass}
                aria-label="Close"
              >
                x
              </button>
            </ModalClose>
            <ModalHeader>
              <ModalTitle>Custom Container</ModalTitle>
              <ModalDescription>
                This ModalContent is rendered as a &lt;section&gt;.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>
                By using asChild, you can completely customize the wrapper element while keeping the
                modal logic and backdrop.
              </p>
            </ModalBody>
          </section>
        </ModalContent>
      </Modal>
    </>
  );
};

export const AsChild: Story = {
  render: (args) => <AsChildDemo {...args} />,
};
