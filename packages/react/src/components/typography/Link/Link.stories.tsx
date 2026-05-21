import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { Link } from './Link';

/**
 * Polymorphic anchor component for navigational and inline links.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Link> = {
  title: 'Display/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['underline', 'hover', 'plain'] },
    colorScheme: { control: 'select', options: ['primary', 'danger', 'success', 'neutral'] },
    external: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: '#link-default',
    children: 'Documentation link',
  },
};

export const Variants: Story = {
  render: () => (
    <Stack gap="sm" align="flex-start">
      <Link href="#link-underline" variant="underline">
        Underline link
      </Link>
      <Link href="#link-hover" variant="hover">
        Hover link
      </Link>
      <Link href="#link-plain" variant="plain">
        Plain link
      </Link>
    </Stack>
  ),
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    external: true,
    children: 'External link',
  },
};

export const AsChild: Story = {
  render: () => (
    <Text>
      Read the{' '}
      <Link asChild variant="underline">
        <a href="#link-as-child">linked section</a>
      </Link>
      .
    </Text>
  ),
};
