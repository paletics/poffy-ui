import { Divider, Flex } from '@/components/layout';
import { EditIcon, HeartIcon, ShareIcon, TrashIcon } from '@/components/media/Icon/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { IconButton } from './IconButton';


const meta = {
  title: 'Inputs/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All four size variants (`xs`, `sm`, `md`, `lg`) aligned in a row. Width and height scale according to Silver Ratio tokens.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <IconButton icon={<EditIcon />} aria-label="Edit" size="xs" />
      <IconButton icon={<EditIcon />} aria-label="Edit" size="sm" />
      <IconButton icon={<EditIcon />} aria-label="Edit" size="md" />
      <IconButton icon={<EditIcon />} aria-label="Edit" size="lg" />
    </Flex>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button', { name: /Edit/i });

    await userEvent.hover(buttons[2]);
    await userEvent.click(buttons[2]);
    await expect(buttons[2]).toHaveFocus();
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The three visual styles: `ghost` (default, no background), `outline` (bordered), `solid` (filled). Choose based on action emphasis.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <IconButton icon={<EditIcon />} aria-label="Edit" appearance="ghost" />
      <IconButton icon={<EditIcon />} aria-label="Edit" appearance="solid" />
      <IconButton icon={<EditIcon />} aria-label="Edit" appearance="outline" />
    </Flex>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Square vs pill shape. `pill` keeps the icon-only silhouette circular by default, while `square` fits grid or tile layouts.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <IconButton icon={<HeartIcon />} aria-label="Like" shape="square" appearance="solid" />
      <IconButton icon={<HeartIcon />} aria-label="Like" shape="pill" appearance="solid" />
    </Flex>
  ),
};

export const DifferentIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates that any SVG icon can be passed via the `icon` prop. Each icon is cloned internally with `aria-hidden="true"` injected.',
      },
    },
  },
  render: () => (
    <Flex gap="md" align="center">
      <IconButton icon={<EditIcon />} aria-label="Edit" />
      <IconButton icon={<TrashIcon />} aria-label="Delete" />
      <IconButton icon={<HeartIcon />} aria-label="Like" />
      <IconButton icon={<ShareIcon />} aria-label="Share" />
    </Flex>
  ),
};

export const AsChild: Story = {
  render: () => (
    <IconButton asChild icon={<EditIcon />} aria-label="Open editor">
      <a href="#icon-button-editor">Open editor</a>
    </IconButton>
  ),
};

export const Loading: Story = {
  args: {
    icon: <EditIcon />,
    'aria-label': 'Edit',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Loading state: icon is replaced by a spinner, `aria-busy="true"` and `aria-disabled="true"` are set. All interaction is suppressed.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    icon: <EditIcon />,
    'aria-label': 'Edit',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state: `aria-disabled="true"` is set and all physics-based feedback is suppressed. Native `disabled` is not passed to `asChild` children.',
      },
    },
  },
};

export const InToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Realistic toolbar composition. Demonstrates correct usage - multiple `IconButton` atoms grouped with a separator divider.',
      },
    },
  },
  render: () => (
    <Flex
      gap="xs"
      p="xs"
      bg="layout.surface"
      borderRadius="md"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="layout.divider"
    >
      <IconButton icon={<EditIcon />} aria-label="Edit" />
      <IconButton icon={<TrashIcon />} aria-label="Delete" />
      <Divider orientation="vertical" />
      <IconButton icon={<HeartIcon />} aria-label="Favorite" />
      <IconButton icon={<ShareIcon />} aria-label="Share" />
    </Flex>
  ),
};
