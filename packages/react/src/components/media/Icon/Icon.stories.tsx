import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '@/components/layout/Flex';
import { Icon } from '@/components/media/Icon';
import { CheckIcon, CopyIcon, InfoIcon, TrashIcon } from '@/components/media/Icon/icons';


const meta: Meta<typeof Icon> = {
  title: 'Media/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the icon',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the icon styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child element',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['stroke', 'filled'],
      description: 'Rendering style. Use "stroke" for outline icons and "filled" for solid icons.',
      table: {
        defaultValue: { summary: 'stroke' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  render: (args) => <InfoIcon {...args} />,
  args: {
    size: 'md',
    disabled: false,
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  render: (args) => (
    <Flex gap="md" align="center">
      <InfoIcon {...args} size="xs" />
      <InfoIcon {...args} size="sm" />
      <InfoIcon {...args} size="md" />
      <InfoIcon {...args} size="lg" />
      <InfoIcon {...args} size="xl" />
      <InfoIcon {...args} size="2xl" />
    </Flex>
  ),
};

export const CustomIcons: Story = {
  render: () => (
    <Flex gap="md">
      <CheckIcon size="lg" />
      <CopyIcon size="lg" />
    </Flex>
  ),
};

export const FilledVariant: Story = {
  render: (args) => (
    <Flex gap="md" align="center">
      <CheckIcon {...args} size="lg" />
      <CopyIcon {...args} size="lg" />
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fill-based icons use variant="filled" (set internally). fill:currentColor and stroke:none are applied via the recipe.',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <TrashIcon {...args} />,
  args: {
    disabled: true,
    size: 'lg',
  },
};

export const AsChild: Story = {
  render: (args) => (
    <Icon {...args} asChild>
      <svg viewBox="0 0 24 24" role="img" aria-label="Custom icon">
        <rect width="24" height="24" rx="6" fill="currentColor" />
        <path
          d="M7 12.5 10.2 16 17 8"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Renders a custom SVG host directly while applying icon styles. Native non-SVG hosts and `as` are not supported.',
      },
    },
  },
};
