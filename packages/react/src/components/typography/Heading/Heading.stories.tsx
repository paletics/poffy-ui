import type { Meta, StoryObj } from '@storybook/react';
import { TextRevealTransition } from '@/components/animations';
import { Stack } from '@/components/layout/Stack';
import { Heading } from '@/components/typography/Heading';

/**
 * A semantic heading component that renders h1-h6 elements with Silver Ratio-scaled typography.
 * Use to establish page and section hierarchy; supports `asChild` for visual/semantic decoupling.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS recipe (`heading`), Radix Slot
 */
const meta: Meta<typeof Heading> = {
  title: 'Display/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
      description: 'Heading level (1-6)',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
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
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: 'Heading Level 1',
    level: '1',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Levels: Story = {
  render: () => (
    <Stack gap="md">
      <Heading level="1">Heading Level 1</Heading>
      <Heading level="2">Heading Level 2</Heading>
      <Heading level="3">Heading Level 3</Heading>
      <Heading level="4">Heading Level 4</Heading>
      <Heading level="5">Heading Level 5</Heading>
      <Heading level="6">Heading Level 6</Heading>
    </Stack>
  ),
};

export const Weights: Story = {
  render: () => (
    <Stack gap="md">
      <Heading level="2" weight="normal">
        Normal Weight Heading
      </Heading>
      <Heading level="2" weight="medium">
        Medium Weight Heading
      </Heading>
      <Heading level="2" weight="semibold">
        Semibold Weight Heading
      </Heading>
      <Heading level="2" weight="bold">
        Bold Weight Heading
      </Heading>
    </Stack>
  ),
};

export const TypeScale: Story = {
  render: () => (
    <Stack gap="lg">
      <Heading level="1">The quick brown fox jumps over the lazy dog</Heading>
      <Heading level="2">The quick brown fox jumps over the lazy dog</Heading>
      <Heading level="3">The quick brown fox jumps over the lazy dog</Heading>
      <Heading level="4">The quick brown fox jumps over the lazy dog</Heading>
      <Heading level="5">The quick brown fox jumps over the lazy dog</Heading>
      <Heading level="6">The quick brown fox jumps over the lazy dog</Heading>
    </Stack>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Stack gap="md">
      <Heading level="1">Real H1 element (default)</Heading>
      <Heading level="2" asChild>
        <p>H2 styling but renders as paragraph (for SEO)</p>
      </Heading>
      <Heading level="3" asChild>
        <div>H3 styling but renders as div</div>
      </Heading>
    </Stack>
  ),
};

export const Animation: Story = {
  render: () => (
    <Stack gap="md">
      <TextRevealTransition>
        <Heading level="1">Real H1 element</Heading>
      </TextRevealTransition>
      <TextRevealTransition>
        <Heading level="2">H2 styling but renders as paragraph (for SEO)</Heading>
      </TextRevealTransition>
      <TextRevealTransition>
        <Heading level="3">H3 styling but renders as div</Heading>
      </TextRevealTransition>
    </Stack>
  ),
};
