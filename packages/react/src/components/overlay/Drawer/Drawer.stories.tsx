import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import type { DrawerProps } from './Drawer.types';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './index';

/**
 * Storybook documentation and visual review surface for Drawer.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, overlay primitives
 */
const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const DrawerWithState = (args: DrawerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {args.placement ?? 'right'} Drawer</Button>
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title ({args.placement ?? 'right'})</DrawerTitle>
            <DrawerDescription>This is a description of the drawer.</DrawerDescription>
            <DrawerClose />
          </DrawerHeader>
          <DrawerBody>
            <p>This is the body content of the drawer.</p>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className={css({ my: '2.5' })}>
                Scrollable content line {i + 1}
              </p>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button appearance="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const Default: Story = {
  args: {
    appearance: 'soft',
    placement: 'right',
  },
  render: (args) => <DrawerWithState {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => <DrawerWithState />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /open right drawer/i }));
    await expect(await body.findByRole('dialog')).toHaveAttribute('data-state', 'open');
  },
};

export const Placements: Story = {
  render: () => (
    <div className={css({ display: 'flex', gap: '2.5', flexWrap: 'wrap' })}>
      <DrawerWithState placement="left" />
      <DrawerWithState placement="right" />
      <DrawerWithState placement="top" />
      <DrawerWithState placement="bottom" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={css({ display: 'flex', gap: '2.5', flexWrap: 'wrap' })}>
      <DrawerWithState size="sm" placement="right" />
      <DrawerWithState size="md" placement="right" />
      <DrawerWithState size="lg" placement="right" />
      <DrawerWithState size="xl" placement="right" />
      <DrawerWithState size="full" placement="right" />
    </div>
  ),
};

export const Brands: Story = {
  render: () => (
    <div className={css({ display: 'flex', gap: '2.5', flexWrap: 'wrap' })}>
      <DrawerWithState brand="pome" placement="right" />
      <DrawerWithState brand="blue" placement="right" />
    </div>
  ),
};

const AsChildDemo = (args: DrawerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open asChild Drawer</Button>
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerContent asChild>
          <aside
            className={css({
              bg: 'white',
              width: '300px',
              height: '100vh',
              position: 'fixed',
              right: '0',
              top: '0',
              boxShadow: 'lg',
              p: '5',
              borderLeftWidth: '5px',
              borderLeftStyle: 'solid',
              borderLeftColor: 'indigo.500',
            })}
          >
            <DrawerClose asChild>
              <Button onClick={() => setOpen(false)} className={css({ mb: '5' })}>
                Close
              </Button>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Custom Aside</DrawerTitle>
              <DrawerDescription>Rendered as an &lt;aside&gt;.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p>Perfect for custom sidebars.</p>
            </DrawerBody>
          </aside>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const AsChild: Story = {
  render: (args) => <AsChildDemo {...args} />,
};
