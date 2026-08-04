import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { Blockquote } from './Blockquote';

const meta = {
  title: 'Display/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'brand', 'subtle'],
    },
  },
  args: {
    children: 'Good design is as little design as possible.',
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <Stack gap="md">
      <Blockquote tone="brand">Use brand tone for prominent editorial quotes.</Blockquote>
      <Blockquote tone="neutral">Use neutral tone for documentation references.</Blockquote>
      <Blockquote tone="subtle">Use subtle tone inside dense support content.</Blockquote>
    </Stack>
  ),
};

export const WithCitation: Story = {
  render: () => (
    <Stack gap="xs">
      <Blockquote>Programs must be written for people to read.</Blockquote>
      <Text variant="caption">Harold Abelson</Text>
    </Stack>
  ),
};

export const LongUnbrokenText: Story = {
  render: () => (
    <Blockquote>
      {'sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'.repeat(8)}
    </Blockquote>
  ),
};

export const RtlConstrained: Story = {
  render: () => (
    <Box width="[240px]" dir="rtl">
      <Blockquote aria-label="RTL constrained quote">
        {'مسار-طويل-غير-قابل-للفصل-'.repeat(12)}
      </Blockquote>
    </Box>
  ),
};
