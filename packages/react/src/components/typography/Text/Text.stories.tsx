import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';


const meta: Meta<typeof Text> = {
  title: 'Display/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body1', 'body2', 'caption'],
      description: 'Typography variant',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
    align: {
      control: 'select',
      options: ['start', 'end', 'left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    transform: {
      control: 'select',
      options: ['none', 'uppercase', 'lowercase', 'capitalize'],
      description: 'Text case transformation',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (Radix UI Slot)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'body1',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Variants: Story = {
  render: () => (
    <Stack gap="md">
      <Text variant="body1">Body 1: The quick brown fox jumps over the lazy dog.</Text>
      <Text variant="body2">Body 2: The quick brown fox jumps over the lazy dog.</Text>
      <Text variant="caption">Caption: The quick brown fox jumps over the lazy dog.</Text>
    </Stack>
  ),
};

export const Weights: Story = {
  render: () => (
    <Stack gap="md">
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </Stack>
  ),
};

export const Alignments: Story = {
  render: () => (
    <Stack gap="md" width="full">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </Stack>
  ),
};

export const RtlLogicalAndPhysicalAlignments: Story = {
  render: () => (
    <Stack gap="md" width="[320px]" maxWidth="100%" dir="rtl">
      <Text data-testid="rtl-default">Default logical start</Text>
      <Text align="start" data-testid="rtl-start">
        Explicit logical start
      </Text>
      <Text align="end" data-testid="rtl-end">
        Explicit logical end
      </Text>
      <Text align="left" data-testid="rtl-left">
        Physical left
      </Text>
      <Text align="right" data-testid="rtl-right">
        Physical right
      </Text>
    </Stack>
  ),
};

export const Transform: Story = {
  render: () => (
    <Stack gap="xs">
      <Text transform="none">No transformation</Text>
      <Text transform="uppercase">Uppercase transformation</Text>
      <Text transform="lowercase">LOWERCASE TRANSFORMATION</Text>
      <Text transform="capitalize">capitalize each word</Text>
    </Stack>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Stack gap="xs">
      <Text asChild>
        <p>Rendered as paragraph (default)</p>
      </Text>
      <Text asChild>
        <span>Rendered as span (inline)</span>
      </Text>
      <Text asChild>
        <div>Rendered as div</div>
      </Text>
      <Text asChild>
        <label htmlFor="example-input">Rendered as label</label>
      </Text>
    </Stack>
  ),
};

export const Combined: Story = {
  render: () => (
    <Stack gap="md">
      <Text variant="body1" weight="bold" align="center" transform="uppercase">
        Bold Centered Uppercase Body1
      </Text>
      <Text variant="body2" weight="medium" align="right">
        Medium Right-Aligned Body2
      </Text>
      <Text variant="caption" weight="normal" align="left" transform="capitalize">
        normal left caption text
      </Text>
    </Stack>
  ),
};
