import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { css } from '@/styled-system/css';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from './index';

/**
 * Storybook documentation and visual review surface for Dropdown.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Dropdown> = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => undefined}>Edit</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => undefined}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Interaction: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Actions</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByText('Actions'));
    await expect(await body.findByRole('menu')).toHaveAttribute('data-state', 'open');
    await expect(await body.findByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
  },
};

export const WithLabelsAndGroups: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>More Options</DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Actions</DropdownLabel>
        <DropdownItem onSelect={() => undefined}>New</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Open</DropdownItem>
        <DropdownSeparator />
        <DropdownLabel>Edits</DropdownLabel>
        <DropdownItem onSelect={() => undefined}>Cut</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Copy</DropdownItem>
        <DropdownItem onSelect={() => undefined}>Paste</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>File</DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => undefined}>Save</DropdownItem>
        <DropdownItem disabled>Save As (Coming Soon)</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => undefined}>Close</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={css({ display: 'flex', gap: 'base', alignItems: 'flex-start' })}>
      <Dropdown size="sm">
        <DropdownTrigger>Small</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown size="md">
        <DropdownTrigger>Medium</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown size="lg">
        <DropdownTrigger>Large</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <p>Menu is {open ? 'open' : 'closed'}</p>
        <Dropdown open={open} onOpenChange={setOpen}>
          <DropdownTrigger>Controlled</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  },
};

export const PolymorphicUsage: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: 'xl' })}>
      <div>
        <h3 className={css({ mb: 'sm' })}>Trigger as Link</h3>
        <Dropdown>
          <DropdownTrigger asChild>
            <a href="#actions">Link Trigger</a>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onSelect={() => undefined}>Action 1</DropdownItem>
            <DropdownItem onSelect={() => undefined}>Action 2</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>
        <h3 className={css({ mb: 'sm' })}>Label as Heading</h3>
        <Dropdown>
          <DropdownTrigger>Structured Menu</DropdownTrigger>
          <DropdownMenu>
            <DropdownLabel asChild>
              <h4>Primary Actions</h4>
            </DropdownLabel>
            <DropdownItem>New File</DropdownItem>
            <DropdownItem>Open File</DropdownItem>
            <DropdownSeparator />
            <DropdownLabel asChild>
              <h4>Secondary Actions</h4>
            </DropdownLabel>
            <DropdownItem>Settings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>
        <h3 className={css({ mb: 'sm' })}>Separator as HR</h3>
        <Dropdown>
          <DropdownTrigger>Custom Elements</DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Top Item</DropdownItem>
            <DropdownSeparator asChild>
              <hr />
            </DropdownSeparator>
            <DropdownItem>Bottom Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  ),
};
