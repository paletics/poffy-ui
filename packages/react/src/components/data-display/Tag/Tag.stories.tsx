import type { Meta, StoryObj } from '@storybook/react';
import { Tag, TagLabel, TagCloseButton } from '@/components/data-display/Tag';
import { Flex } from '@/components/layout/Flex';
import { Box } from '@/components/layout/Box';

const meta = {
  title: 'Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill'],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tag {...args}>
      <TagLabel>Sample Tag</TagLabel>
    </Tag>
  ),
  args: {
    size: 'md',
    appearance: 'soft',
    intent: 'secondary',
    shape: 'rounded',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithCloseButton: Story = {
  render: (args) => (
    <Tag {...args}>
      <TagLabel>Closable Tag</TagLabel>
      <TagCloseButton onClick={() => undefined} />
    </Tag>
  ),
  args: {
    size: 'md',
    intent: 'success',
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="xs" align="center">
      <Tag size="sm">
        <TagLabel>Small</TagLabel>
      </Tag>
      <Tag size="md">
        <TagLabel>Medium</TagLabel>
      </Tag>
      <Tag size="lg">
        <TagLabel>Large</TagLabel>
      </Tag>
    </Flex>
  ),
};

export const Appearances: Story = {
  render: () => (
    <Flex gap="xs" align="center">
      <Tag appearance="soft" intent="info">
        <TagLabel>Soft</TagLabel>
      </Tag>
      <Tag appearance="outline" intent="info">
        <TagLabel>Outline</TagLabel>
      </Tag>
      <Tag appearance="ghost" intent="info">
        <TagLabel>Ghost</TagLabel>
      </Tag>
    </Flex>
  ),
};

export const ConstrainedLongLabel: Story = {
  render: () => (
    <Box width="[120px]" aria-label="Constrained tag">
      <Tag shape="pill">
        <TagLabel>Filtervaluewithoutbreakopportunities</TagLabel>
        <TagCloseButton aria-label="Remove filter" />
      </Tag>
    </Box>
  ),
};

export const ConstrainedDismissibleSizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Containment stress fixtures below the practical width of a dismissible tag. Labels preserve their full text and wrap at natural word boundaries; applications should provide more than 80px when a readable label and close target must coexist.',
      },
    },
  },
  render: () => (
    <Flex gap="md" wrap="wrap" align="flex-start">
      <Box width="[48px]" aria-label="Small constrained tag">
        <Tag size="sm">
          <TagLabel>Small</TagLabel>
          <TagCloseButton aria-label="Remove small tag" />
        </Tag>
      </Box>
      <Box width="[64px]" aria-label="Medium constrained tag">
        <Tag size="md">
          <TagLabel>Medium</TagLabel>
          <TagCloseButton aria-label="Remove medium tag" />
        </Tag>
      </Box>
      <Box width="[80px]" aria-label="Large constrained tag">
        <Tag size="lg">
          <TagLabel>Large</TagLabel>
          <TagCloseButton aria-label="Remove large tag" />
        </Tag>
      </Box>
      <Box width="[64px]" dir="rtl" aria-label="Medium constrained tag RTL">
        <Tag size="md">
          <TagLabel>متوسط</TagLabel>
          <TagCloseButton aria-label="Remove RTL tag" />
        </Tag>
      </Box>
    </Flex>
  ),
};
