import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Icon } from '@/components/media/Icon';
import { CheckIcon, CopyIcon, InfoIcon, TrashIcon } from '@/components/media/Icon/icons';

/**
 * The foundational SVG icon primitive that wraps inline SVG paths with Silver Ratio size variants and automatic ARIA decoration suppression.
 * Use for all inline SVG icons throughout the design system, with `asChild` available for polymorphic third-party SVG components.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS recipe (`icon` via `iconRecipe.splitVariantProps`), Radix Slot
 */
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
      <Box asChild w="[24px]" h="[24px]">
        <img src="/favicon.ico" alt="Favicon" />
      </Box>
    </Icon>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Renders the child element directly while applying icon styles. Useful for wrapping images or other custom elements. Note: `as` prop is not supported.',
      },
    },
  },
};
