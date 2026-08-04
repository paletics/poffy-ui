import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import { Link } from './Link';


const meta: Meta<typeof Link> = {
  title: 'Display/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['underline', 'hover', 'plain'] },
    colorScheme: { control: 'select', options: ['brand', 'danger', 'success', 'neutral'] },
    external: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;
const neutralParentClass = css({ color: 'text.primary' });

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

export const ColorSchemes: Story = {
  render: () => (
    <Stack gap="sm" align="flex-start">
      <Link href="#link-brand" colorScheme="brand">
        Brand link
      </Link>
      <Link href="#link-danger" colorScheme="danger">
        Danger link
      </Link>
      <Link href="#link-success" colorScheme="success">
        Success link
      </Link>
      <span className={neutralParentClass}>
        <Link href="#link-neutral" colorScheme="neutral">
          Neutral link
        </Link>
      </span>
    </Stack>
  ),
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
