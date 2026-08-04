import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/inputs/Button';
import { Stack } from '@/components/layout/Stack';
import { SearchIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';

const meta = {
  title: 'A11y/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This text is only visible to screen readers',
  },
  render: (args) => (
    <Stack gap="xs">
      <Text>The text below is visually hidden but accessible to screen readers:</Text>
      <VisuallyHidden {...args} />
      <Text variant="caption">(Check the DOM to see the hidden element)</Text>
    </Stack>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithButton: Story = {
  args: {
    children: 'Search',
  },
  render: (args) => (
    <Button>
      <SearchIcon />
      <VisuallyHidden {...args} />
    </Button>
  ),
};

export const AsDiv: Story = {
  args: {
    asChild: true,
    children: 'This is rendered as a div element',
  },
  render: (args) => (
    <Stack gap="xs">
      <VisuallyHidden {...args}>
        <div>This is rendered as a div element</div>
      </VisuallyHidden>
      <Text>Content after the visually hidden div</Text>
    </Stack>
  ),
};

export const AsChildButton: Story = {
  render: () => (
    <VisuallyHidden asChild>
      <button type="button">Skip to main content</button>
    </VisuallyHidden>
  ),
};
