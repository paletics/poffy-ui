import { Button } from '@/components/inputs/Button';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { CommandMenu } from './CommandMenu';
import type { CommandMenuItem } from './CommandMenu.types';
import { DirectionProvider } from '@/providers/DirectionProvider';

const commandItems: CommandMenuItem[] = [
  {
    id: 'project-open',
    label: 'Open project',
    description: 'Jump to a recent project',
    group: 'Projects',
    keywords: ['workspace'],
  },
  {
    id: 'project-archive',
    label: 'Archive project',
    description: 'Move the current project out of the active list',
    group: 'Projects',
  },
  {
    id: 'settings',
    label: 'Open settings',
    description: 'Manage preferences and workspace defaults',
    group: 'System',
    keywords: ['preferences'],
  },
  {
    id: 'help',
    label: 'Open help center',
    group: 'System',
  },
];


const meta: Meta<typeof CommandMenu> = {
  title: 'Navigation/CommandMenu',
  component: CommandMenu,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandMenu>;

export const Default: Story = {
  args: {
    items: commandItems,
  },
  render: (args) => <CommandMenu {...args} />,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Open: Story = {
  args: {
    items: commandItems,
    defaultOpen: true,
  },
  render: (args) => <CommandMenu {...args} />,
};

export const Empty: Story = {
  args: {
    items: commandItems,
    defaultOpen: true,
    defaultQuery: 'nothing',
  },
  render: (args) => <CommandMenu {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <>
      <CommandMenu items={commandItems} defaultOpen size="sm" label="Small command menu" />
      <CommandMenu items={commandItems} defaultOpen size="lg" label="Large command menu" />
    </>
  ),
};

export const LongList: Story = {
  args: {
    defaultOpen: true,
    items: Array.from({ length: 30 }, (_, index) => ({
      id: `command-${index + 1}`,
      label: `Command ${index + 1}`,
      description: `Run command ${index + 1}`,
    })),
  },
  render: (args) => <CommandMenu {...args} />,
};

export const NarrowViewport: Story = {
  render: () => (
    <DirectionProvider defaultDir="rtl" global={false}>
      <CommandMenu
        defaultOpen
        label="Narrow command menu"
        items={[
          {
            id: 'long-command',
            label: 'Commandwithanunusuallylongunbrokenlocalizedlabel',
            description: 'Descriptionwithanunusuallylongunbrokenlocalizedvalue',
          },
        ]}
      />
    </DirectionProvider>
  ),
};

export const Interaction: Story = {
  render: () => <CommandMenu items={commandItems} globalShortcut />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    const dialog = await body.findByRole('dialog', { name: 'Command menu' });
    await expect(dialog).toHaveAttribute('data-state', 'open');
  },
};

const CommandMenuTriggerExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Command Menu</Button>
      <CommandMenu open={open} onOpenChange={setOpen} items={commandItems} />
    </>
  );
};

export const TriggerExample: Story = {
  render: () => <CommandMenuTriggerExample />,
};
